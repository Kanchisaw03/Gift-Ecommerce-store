import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createRazorpayOrder, verifyRazorpayPayment } from '../services/api/paymentService';
import { useAuth } from './useAuth';

/**
 * Custom hook for Razorpay integration
 * @returns {Object} - Razorpay methods and state
 */
export const useRazorpay = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => {
          resolve(true);
          setIsScriptLoaded(true);
        };
        script.onerror = () => {
          resolve(false);
          setError('Failed to load Razorpay script');
          toast.error('Failed to load payment gateway. Please try again later.');
        };
        document.body.appendChild(script);
      });
    };

    // Check if script is already loaded
    if (!window.Razorpay) {
      loadRazorpayScript();
    } else {
      setIsScriptLoaded(true);
    }

    return () => {
      // Cleanup if needed
    };
  }, []);

  /**
   * Initialize Razorpay payment
   * @param {Object} orderData - Order data (orderId, amount, currency)
   * @param {Function} onSuccess - Callback on successful payment
   * @param {Function} onError - Callback on payment error
   */
  const initializePayment = async (orderData, onSuccess, onError) => {
    if (!isScriptLoaded) {
      toast.error('Payment gateway is still loading. Please try again in a moment.');
      return;
    }

    if (!user) {
      toast.error('Please login to proceed with payment');
      navigate('/login');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Create Razorpay order
      const response = await createRazorpayOrder(orderData);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to create payment order');
      }

      const { order_id, amount, currency, key_id } = response.data;

      // Configure Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || key_id, // Use env variable first, fallback to backend key
        amount: amount,
        currency: currency,
        name: 'Luxury Gift Store',
        description: 'Payment for your order',
        order_id: order_id,
        handler: async function (response) {
          try {
            // Verify payment
            const verificationData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderData.orderId
            };

            const verificationResponse = await verifyRazorpayPayment(verificationData);
            
            if (verificationResponse.success) {
              toast.success('Payment successful!');
              if (onSuccess) onSuccess(verificationResponse.data);
            } else {
              throw new Error(verificationResponse.message || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error(error.message || 'Payment verification failed');
            if (onError) onError(error);
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || ''
        },
        notes: {
          orderId: orderData.orderId
        },
        theme: {
          color: '#D4AF37'
        },
        modal: {
          ondismiss: function() {
            toast.info('Payment cancelled');
            if (onError) onError({ message: 'Payment cancelled by user' });
          }
        }
      };

      // Initialize Razorpay
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (error) {
      console.error('Razorpay initialization error:', error);
      setError(error.message || 'Failed to initialize payment');
      toast.error(error.message || 'Failed to initialize payment');
      if (onError) onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    initializePayment,
    isLoading,
    error,
    isScriptLoaded
  };
};

export default useRazorpay;
