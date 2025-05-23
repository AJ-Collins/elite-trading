const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/mpesa/initiate', paymentController.initiateMpesaPayment);
router.post('/binance/initiate', paymentController.initiateBinancePayment);
router.get('/status/:paymentId', paymentController.checkPaymentStatus);

module.exports = router;
