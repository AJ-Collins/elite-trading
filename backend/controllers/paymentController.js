const { User, Payment, UserSubscription, Subscription } = require('../models');
const moment = require('moment');
const axios = require('axios');
const crypto = require('crypto');

exports.initiateMpesaPayment = async (req, res) => {
  const { phoneNumber, amount, planId, email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const transactionId = `mpesa_${Date.now()}`;

    // Format phone number
    const formatPhoneNumber = (phone) => {
      const cleaned = phone.replace(/\D/g, '');
      if (cleaned.startsWith('0')) return '254' + cleaned.slice(1);
      if (cleaned.startsWith('7')) return '254' + cleaned;
      if (cleaned.startsWith('254')) return cleaned;
      throw new Error('Invalid Kenyan phone number format');
    };

    const formattedPhone = formatPhoneNumber(phoneNumber);

    // Create initial payment record
    await Payment.create({
      userId: user.id,
      transactionId,
      paymentMethod: 'Mpesa',
      amount,
      subscriptionId: planId,
      status: 'pending',
    });

    // === Real STK Push ===
    const {
      MPESA_CONSUMER_KEY,
      MPESA_CONSUMER_SECRET,
      MPESA_SHORTCODE,
      MPESA_PASSKEY,
      MPESA_CALLBACK_URL,
    } = process.env;

    const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');
    const tokenRes = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      { headers: { Authorization: `Basic ${auth}` } }
    );

    const accessToken = tokenRes.data.access_token;
    const timestamp = moment().format('YYYYMMDDHHmmss');
    const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString('base64');

    const stkPushRes = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        BusinessShortCode: MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: formattedPhone,
        PartyB: MPESA_SHORTCODE,
        PhoneNumber: formattedPhone,
        CallBackURL: `${MPESA_CALLBACK_URL}/api/mpesa/callback`,
        AccountReference: `EliteHub-${transactionId}`,
        TransactionDesc: `Payment for ${planId}`,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Store CheckoutRequestID for future reference
    await Payment.update(
      { mpesaCheckoutRequestId: stkPushRes.data.CheckoutRequestID },
      { where: { transactionId } }
    );

    // === Simulate Payment Confirmation ===
    setTimeout(() => {
      (async () => {
        try {
          const payment = await Payment.findOne({ where: { transactionId } });
          if (!payment) {
            return console.error(`Payment not found for transactionId: ${transactionId}`);
          }
    
          await Payment.update({ status: 'completed' }, { where: { transactionId } });
    
          const existingSub = await UserSubscription.findOne({
            where: {
              userId: payment.userId,
              subscriptionId: payment.subscriptionId,
            },
          });
    
          const plan = await Subscription.findByPk(payment.subscriptionId);
          if (!plan) {
            return console.error(`Subscription plan not found for ID: ${payment.subscriptionId}`);
          }
    
          const now = new Date();
          const additionalDays = plan.duration;
    
          if (existingSub) {
            // Extend the end date from the current endDate or now, whichever is later
            const currentEnd = new Date(existingSub.endDate);
            const baseDate = currentEnd > now ? currentEnd : now;
            const newEndDate = new Date(baseDate);
            newEndDate.setDate(baseDate.getDate() + additionalDays);
    
            await existingSub.update({
              endDate: newEndDate,
              isActive: true,
            });
    
            console.log(`Subscription extended for user ${payment.userId} (Plan: ${plan.id}) to ${newEndDate}`);
          } else {
            const startDate = now;
            const endDate = new Date();
            endDate.setDate(startDate.getDate() + additionalDays);
    
            await UserSubscription.create({
              userId: payment.userId,
              subscriptionId: plan.id,
              startDate,
              endDate,
              isActive: true,
            });
    
            console.log(`Simulated: New subscription created for user ${payment.userId} (Plan: ${plan.id})`);
          }
        } catch (error) {
          console.error('Error during simulated payment callback:', error);
        }
      })();
    }, 10000);    

    res.json({
      success: true,
      message: 'STK Push sent (confirmation will be simulated)',
      transactionId,
      checkoutRequestId: stkPushRes.data.CheckoutRequestID,
    });
  } catch (error) {
    console.error('M-Pesa error:', error.response?.data || error.message);
    res.status(500).json({ error: 'M-Pesa STK Push failed' });
  }
};



exports.initiateBinancePayment = async (req, res) => {
  try {
    const { binancePayId, amount, planId, email } = req.body;

    if (!binancePayId || !amount || !planId || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const merchantRef = `FPF${Date.now()}`;
    const payment = await Payment.create({
      userId: user.id,
      transactionId: merchantRef,
      method: 'Binance',
      amount,
      subscriptionId: planId,
      status: 'pending',
    });

    // Binance credentials
    const BINANCE_API_KEY = process.env.BINANCE_API_KEY;
    const BINANCE_API_SECRET = process.env.BINANCE_API_SECRET;
    const BINANCE_RETURN_URL = process.env.BINANCE_RETURN_URL;
    const BINANCE_CANCEL_URL = process.env.BINANCE_CANCEL_URL;
    const BINANCE_WEBHOOK_URL = `${req.protocol}://${req.get('host')}/api/payments/binance/callback`;

    const timestamp = Date.now();
    const nonce = crypto.randomBytes(16).toString('hex');

    const payload = {
      env: { terminalType: 'WEB' },
      merchantTradeNo: merchantRef,
      orderAmount: amount,
      currency: 'USDT',
      goods: {
        goodsType: '01',
        goodsCategory: 'Z000',
        referenceGoodsId: planId,
        goodsName: `EliteHub ${planId}`,
        goodsDetail: `Payment for EliteHub trading plan ${planId}`,
      },
      returnUrl: BINANCE_RETURN_URL,
      cancelUrl: BINANCE_CANCEL_URL,
      webhookUrl: BINANCE_WEBHOOK_URL,
      supportPayMethods: ['BINANCE_PAY'],
    };

    const payloadString = JSON.stringify(payload);
    const signatureString = `${timestamp}\n${nonce}\n${payloadString}\n`;

    const signature = crypto
      .createHmac('sha512', BINANCE_API_SECRET)
      .update(signatureString)
      .digest('hex')
      .toUpperCase();

    const response = await axios.post(
      'https://bpay.binanceapi.com/binancepay/openapi/v2/order',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'BinancePay-Timestamp': timestamp,
          'BinancePay-Nonce': nonce,
          'BinancePay-Certificate-SN': BINANCE_API_KEY,
          'BinancePay-Signature': signature,
        },
      }
    );

    const { prepayId, qrcodeLink, universalUrl } = response.data.data;

    // Update DB with Binance order data
    await payment.update({
      binanceOrderId: prepayId,
      metadata: JSON.stringify(response.data),
    });

    res.json({
      success: true,
      paymentId: merchantRef,
      transactionRef: merchantRef,
      qrCodeUrl: qrcodeLink,
      checkoutUrl: universalUrl,
      prepayId,
    });
  } catch (error) {
    console.error('Binance payment error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to initiate Binance Pay payment' });
  }
};

exports.checkPaymentStatus = async (req, res) => {
  const { paymentId } = req.params;
  const payment = await Payment.findOne({ where: { paymentId } });

  if (!payment) return res.status(404).json({ error: 'Payment not found' });
  res.json({ status: payment.status });
};
