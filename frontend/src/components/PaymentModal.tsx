import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, Loader } from 'lucide-react';
import axios from 'axios';

// Placeholder for mail icon (used for UI consistency)
const MailIcon = () => (
  <svg className="w-full h-full object-cover" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" fill="#28A745" />
    <path d="M10 15L20 20L30 15V25H10V15Z" fill="white" />
    <path d="M10 15L20 10L30 15H10Z" fill="#D3D3D3" />
  </svg>
);

// Placeholder for fade line
const FadeLine = ({ isMobile }) => (
  <div className={`w-full ${isMobile ? 'block md:hidden' : 'hidden md:block'}`}>
    <div className="h-px bg-gradient-to-r from-transparent via-green-300 to-transparent"></div>
  </div>
);

const PaymentModal = ({ isModalOpen, closeModal, selectedPlan, isOnline }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    paymentMethod: '',
    location: '',
    mpesaPhone: '',
    binancePayId: '',
  });
  type FormErrors = {
    paymentMethod?: string;
    location?: string;
    mpesaPhone?: string;
    binancePayId?: string;
  };
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [checkoutUrl, setCheckoutUrl] = useState('');
  const [statusCheckInterval, setStatusCheckInterval] = useState(null);
  const [userData, setUserData] = useState<any>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const handlePaymentMethodSelect = (method) => {
    setFormData({ ...formData, paymentMethod: method });
    setErrors({ ...errors, paymentMethod: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validatePhone = (phone) => {
    return /^\+?\d{10,12}$/.test(phone); // Basic phone number validation
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.paymentMethod) {
        setErrors({ paymentMethod: 'Please select a payment method' });
        return;
      }
      if (!isOnline && !formData.location) {
        setErrors({ location: 'Please select a location' });
        return;
      }
      setStep(2); // Proceed to payment gateway (Step 2)
    }
  };

  const handlePreviousStep = () => {
    if (step === 2) setStep(1);
  };

  const checkPaymentStatus = async () => {
    if (!paymentId) return;
    
    try {
      const response = await axios.get(`${API_URL}/api/payments/status/${paymentId}`);
      
      if (response.data && response.data.status) {
        setPaymentStatus(response.data.status);
        
        // If payment is completed, failed, or canceled, stop checking
        if (['completed', 'failed', 'canceled'].includes(response.data.status)) {
          if (statusCheckInterval) {
            clearInterval(statusCheckInterval);
            setStatusCheckInterval(null);
          }
          
          // Show appropriate message
          if (response.data.status === 'completed') {
            try {
              const token = localStorage.getItem('auth_token');
              const requestBody = {
                subscriptionId: selectedPlan.id,
              };
          
              console.log('Sending subscription data to backend:', requestBody);
          
              const res = await axios.post(
                `${API_URL}/api/subscribe`,
                requestBody,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
          
              console.log('Subscribe API response:', res.data);
          
              alert('Payment completed and subscription activated!');
              closeModal();
            } catch (subscribeError) {
              console.error('Error subscribing user:', subscribeError);
              alert('Payment succeeded but subscription failed. Please contact support.');
            }
          } else if (response.data.status === 'failed') {
            alert('Payment failed. Please try again.');
          } else if (response.data.status === 'canceled') {
            alert('Payment was canceled.');
          }
        }
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
    }
  };

  useEffect(() => {
      const fetchUser = async () => {
        const token = localStorage.getItem('auth_token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user?.id || !token) return;
  
        try {
          const res = await fetch(`${API_URL}/api/users/${user.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          const data = await res.json();
          console.log('User data:', data);
          setUserData(data);
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      };
  
      fetchUser();
    }, []);

  const handleProceedToPayment = async () => {
    // Validate inputs
    if (formData.paymentMethod === 'Mpesa' && (!formData.mpesaPhone || !validatePhone(formData.mpesaPhone))) {
      setErrors({ mpesaPhone: 'Please enter a valid phone number' });
      return;
    }
    
    if (formData.paymentMethod === 'Binance' && !formData.binancePayId) {
      setErrors({ binancePayId: 'Please enter a Binance Pay ID' });
      return;
    }
    
    setIsLoading(true);
    
    try {
      let response;
      
      const amountString = selectedPlan?.price.toString();
      const sanitizedAmount = parseFloat(amountString.replace(/[^0-9.]/g, ''));
      if (formData.paymentMethod === 'Mpesa') {
        // Call M-Pesa API endpoint
        const requestData = {
          phoneNumber: formData.mpesaPhone,
          amount: sanitizedAmount,
          planId: selectedPlan?.id,
          email: userData?.email
        };
        console.log('Selected Plan:', selectedPlan);
        console.log('Request Data:', requestData);
        response = await axios.post(`${API_URL}/api/payments/mpesa/initiate`, {
          phoneNumber: formData.mpesaPhone,
          amount: sanitizedAmount,
          
          planId: selectedPlan?.id,
          email: userData?.email
        });
        
        if (response.data && response.data.success) {
          setPaymentId(response.data.paymentId);
          setPaymentStatus('pending');
          alert('M-Pesa STK push sent. Please check your phone to complete the payment.');
          
          // Start checking payment status every 5 seconds
          const intervalId = setInterval(checkPaymentStatus, 5000);
          setStatusCheckInterval(intervalId);
        }
      } else if (formData.paymentMethod === 'Binance') {
        // Call Binance Pay API endpoint
        response = await axios.post(`${API_URL}/api/payments/binance/initiate`, {
          amount: sanitizedAmount,
          binancePayId: formData.binancePayId,
          planId: selectedPlan?.id,
          email: userData?.email
        });
        
        if (response.data && response.data.success) {
          setPaymentId(response.data.paymentId);
          setQrCodeUrl(response.data.qrCodeUrl);
          setCheckoutUrl(response.data.checkoutUrl);
          setPaymentStatus('pending');
          
          // Start checking payment status every 5 seconds
          const intervalId = setInterval(checkPaymentStatus, 5000);
          setStatusCheckInterval(intervalId);
        }
      }
    } catch (error) {
      console.error('Payment initiation error:', error);
      alert('Failed to initiate payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Clean up interval on component unmount
  useEffect(() => {
    return () => {
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
      }
    };
  }, [statusCheckInterval]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isModalOpen) {
      setStep(1);
      setFormData({
        paymentMethod: '',
        location: '',
        mpesaPhone: '',
        binancePayId: '',
      });
      setErrors({});
      setIsLoading(false);
      setPaymentStatus(null);
      setPaymentId(null);
      setQrCodeUrl('');
      setCheckoutUrl('');
      
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
        setStatusCheckInterval(null);
      }
    }
  }, [isModalOpen]);

  const inputClasses = "w-full max-w-md text-gray-800 rounded-xl border-2 border-green-300 p-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-sm";
  const primaryButtonClasses = "w-full max-w-md text-white font-bold bg-green-500 hover:bg-green-600 py-4 rounded-lg shadow-md transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed";
  const secondaryButtonClasses = "flex items-center space-x-2 px-4 py-3 text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition-all duration-200";

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div
            className={`bg-white rounded-2xl p-6 md:p-8 w-full ${
              step === 2 ? 'max-w-3xl' : 'max-w-lg'
            } max-h-[90vh] overflow-y-auto relative transition-all duration-300`}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 bg-gray-100 p-2 rounded-full transition-all duration-200"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className="flex justify-center mb-6">
              <div className="bg-green-100 px-4 py-1 rounded-full">
                <p className="text-sm font-medium text-gray-600">Step {step} of 2</p>
              </div>
            </div>

            {/* Step 1: Payment Method and Location (for Physical Plans) */}
            {step === 1 && (
              <>
                <h2 className="text-2xl font-bold mb-4 text-center">Choose Payment Method</h2>
                <p className="text-gray-600 mb-6 text-center text-sm">
                  Select a payment method to proceed with your {selectedPlan?.type} payment.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  {[
                    { label: 'M-Pesa', icon: 'M', value: 'Mpesa' },
                    { label: 'Binance', icon: 'B', value: 'Binance' },
                  ].map(({ label, icon, value }, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePaymentMethodSelect(value)}
                      className={`flex items-center justify-center space-x-2 px-4 py-3 border-2 rounded-lg transition-all duration-200 ${
                        formData.paymentMethod === value
                          ? 'bg-green-500 text-white border-green-500 shadow-md'
                          : 'border-green-500 text-green-500 hover:bg-green-50'
                      }`}
                      aria-label={`Select ${label} payment method`}
                    >
                      <span className="text-lg font-bold">{icon}</span>
                      <span className="font-medium">{label}</span>
                    </button>
                  ))}
                </div>
                {errors.paymentMethod && (
                  <p className="text-red-500 text-sm text-center mb-4">{errors.paymentMethod}</p>
                )}

                {!isOnline && (
                  <div className="mb-8">
                    <label className="block text-gray-800 text-sm font-medium mb-2">Location</label>
                    <select
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className={`${inputClasses} ${errors.location ? 'border-red-500' : ''}`}
                      aria-describedby="location-error"
                      >
                      <option value="" disabled>
                        Select a physical location
                      </option>
                      <option value="67d9003df0c96ffff10e982f">Nairobi Branch</option>
                      <option value="67d9003cf0c96ffff10e9827">Mombasa Branch</option>
                      <option value="67d9003af0c96ffff10e9814">
                        Kilifi Branch
                      </option>
                    </select>
                    {errors.location && (
                      <p id="location-error" className="text-red-500 text-sm mt-1">{errors.location}</p>
                    )}
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6 mb-8 bg-gray-50 p-6 rounded-lg">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{selectedPlan?.type}</h3>
                    <p className="text-sm text-gray-500">{isOnline ? 'Online Plan' : 'Physical Class'}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-2xl font-bold text-green-500">KES {selectedPlan?.price}</p>
                  </div>
                </div>

                <FadeLine isMobile={false} />
                <FadeLine isMobile={true} />

                <div className="flex justify-between items-center">
                  {formData.paymentMethod && (
                    <p className="text-sm text-gray-600">
                      Selected: <strong className="text-green-600">{formData.paymentMethod}</strong>
                    </p>
                  )}
                  <div className="flex space-x-4">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
                      aria-label="Go back"
                    >
                      Go back
                    </button>
                    <button
                      onClick={handleNextStep}
                      disabled={!formData.paymentMethod || (!isOnline && !formData.location)}
                      className={primaryButtonClasses + ' px-6 py-2'}
                      aria-label="Proceed to payment"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Payment Gateway */}
            {step === 2 && (
              <>
                <div className="w-16 h-16 mx-auto mb-6 text-green bg-gray-50 p-2 rounded-full">
                  <MailIcon />
                </div>
                <h2 className="text-2xl font-bold mb-4 text-center">Complete Your Payment</h2>
                <p className="text-gray-600 mb-6 text-center">
                  Complete the payment for {selectedPlan?.type} ({selectedPlan?.price}) using {formData.paymentMethod}.
                </p>

                <div className="w-full h-[500px] md:h-[600px] overflow-auto border-2 border-gray-200 rounded-lg mb-6">
                  <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-6">
                    <div className="text-center w-full max-w-md">
                      <h3 className="text-xl font-bold mb-4">
                        {formData.paymentMethod === 'Mpesa' ? 'M-Pesa Payment' : 'Binance Pay'}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Complete your payment for {selectedPlan?.type} ({selectedPlan?.price})
                      </p>
                      
                      {/* Payment Status Section */}
                      {paymentStatus && (
                        <div className={`mb-6 py-3 px-4 rounded-lg text-center ${
                          paymentStatus === 'completed' ? 'bg-green-100 text-green-800' :
                          paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                          paymentStatus === 'canceled' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          <p className="font-medium">
                            {paymentStatus === 'completed' ? 'Payment completed successfully!' :
                             paymentStatus === 'failed' ? 'Payment failed. Please try again.' :
                             paymentStatus === 'canceled' ? 'Payment was canceled.' :
                             'Payment is being processed...'}
                          </p>
                          
                          {paymentStatus === 'pending' && (
                            <div className="flex justify-center mt-2">
                              <Loader size={20} className="animate-spin" />
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        {formData.paymentMethod === 'Mpesa' ? (
                          <>
                            <label className="block text-gray-800 text-sm font-medium mb-2">
                              M-Pesa Phone Number
                            </label>
                            <input
                              type="tel"
                              name="mpesaPhone"
                              value={formData.mpesaPhone}
                              onChange={handleInputChange}
                              placeholder="Enter M-Pesa phone number (e.g., +254712345678)"
                              className={`w-full px-4 py-3 border rounded-lg ${
                                errors.mpesaPhone ? 'border-red-500' : 'border-gray-300'
                              }`}
                              aria-describedby="mpesaPhone-error"
                            />
                            {errors.mpesaPhone && (
                              <p id="mpesaPhone-error" className="text-red-500 text-sm mt-1">
                                {errors.mpesaPhone}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 mt-4 mb-4">
                              You will receive an M-Pesa prompt on your phone to complete the payment.
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-sm text-gray-700 mb-4">
                              Scan the QR code or enter your Binance Pay ID to complete payment.
                            </p>
                            
                            {/* QR Code Display */}
                            {qrCodeUrl ? (
                              <div className="w-48 h-48 mb-4 mx-auto">
                                <img 
                                  src={qrCodeUrl} 
                                  alt="Binance QR Code" 
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            ) : (
                              <div className="w-48 h-48 bg-gray-200 mb-4 mx-auto flex items-center justify-center">
                                <p className="text-gray-500">Binance QR Code</p>
                              </div>
                            )}
                            
                            {/* Payment URL */}
                            {checkoutUrl && (
                              <div className="mb-4 text-center">
                                <a 
                                  href={checkoutUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-green-600 hover:text-green-700 underline"
                                >
                                  Click here to pay with Binance
                                </a>
                              </div>
                            )}
                            
                            <label className="block text-gray-800 text-sm font-medium mb-2">
                              Binance Pay ID
                            </label>
                            <input
                              type="text"
                              name="binancePayId"
                              value={formData.binancePayId}
                              onChange={handleInputChange}
                              placeholder="Enter Binance Pay ID"
                              className={`w-full px-4 py-3 border rounded-lg ${
                                errors.binancePayId ? 'border-red-500' : 'border-gray-300'
                              }`}
                              aria-describedby="binancePayId-error"
                            />
                            {errors.binancePayId && (
                              <p id="binancePayId-error" className="text-red-500 text-sm mt-1">
                                {errors.binancePayId}
                              </p>
                            )}
                          </>
                        )}
                        
                        {/* Only show the button if payment status is not yet set or is not completed */}
                        {(!paymentStatus || !['completed', 'canceled'].includes(paymentStatus)) && (
                          <button
                            onClick={handleProceedToPayment}
                            disabled={isLoading || paymentStatus === 'pending'}
                            className={`w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-lg transition-all duration-200 ${
                              (isLoading || paymentStatus === 'pending') ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            aria-label={
                              formData.paymentMethod === 'Mpesa' ? 'Send M-Pesa Request' : 'Confirm Payment'
                            }
                          >
                            {isLoading ? (
                              <span className="flex items-center justify-center">
                                <Loader size={16} className="animate-spin mr-2" />
                                Processing...
                              </span>
                            ) : paymentStatus === 'pending' ? (
                              'Processing payment...'
                            ) : (
                              formData.paymentMethod === 'Mpesa' ? 'Send M-Pesa Request' : 'Confirm Payment'
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center space-x-4 mt-6">
                  <button
                    onClick={handlePreviousStep}
                    className={secondaryButtonClasses}
                    aria-label="Go back"
                  >
                    <ArrowLeft size={16} />
                    <span>Go back</span>
                  </button>
                  <button
                    onClick={closeModal}
                    className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg shadow-md transition-all duration-200"
                    aria-label="Cancel payment"
                  >
                    Cancel Payment
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentModal;