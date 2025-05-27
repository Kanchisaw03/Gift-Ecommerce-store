const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/payment.model');
const Order = require('../models/order.model');

// Initialize Razorpay with API keys from environment variables
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET // Match the exact name in the .env file
});

// Log Razorpay initialization status
console.log(`Razorpay initialized with key_id: ${process.env.RAZORPAY_KEY_ID ? 'Available' : 'Missing'}, key_secret: ${process.env.RAZORPAY_KEY_SECRET ? 'Available' : 'Missing'}`);

// Check if Razorpay is properly initialized
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error('WARNING: Razorpay API keys are missing in environment variables');
}

/**
 * Create a new Razorpay order
 * @param {Object} orderData - Order data including amount, currency, etc.
 * @returns {Promise<Object>} - Razorpay order details
 */
const createRazorpayOrder = async (orderData) => {
  // Validate Razorpay initialization
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay API keys are missing. Please check your environment variables.');
  }

  console.log('Creating Razorpay order with data:', JSON.stringify(orderData, null, 2));
  
  try {
    // Ensure amount is a valid number
    const amount = parseFloat(orderData.amount);
    if (isNaN(amount) || amount <= 0) {
      throw new Error(`Invalid amount: ${orderData.amount}. Amount must be a positive number.`);
    }

    // Ensure required fields are present
    if (!orderData.userId) {
      throw new Error('userId is required for creating a Razorpay order');
    }
    if (!orderData.orderId) {
      throw new Error('orderId is required for creating a Razorpay order');
    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise
      currency: orderData.currency || 'INR',
      receipt: `order_${Date.now()}`,
      payment_capture: 1, // Auto-capture payment
      notes: {
        userId: orderData.userId.toString(),
        orderId: orderData.orderId.toString(),
        email: orderData.email || '',
        shipping: JSON.stringify(orderData.shipping || {})
      }
    };

    console.log('Sending to Razorpay API:', JSON.stringify(options, null, 2));
    
    const razorpayOrder = await razorpay.orders.create(options);
    console.log('Razorpay order created successfully:', JSON.stringify(razorpayOrder, null, 2));
    
    return {
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      receipt: razorpayOrder.receipt,
      key_id: process.env.RAZORPAY_KEY_ID
    };
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    if (error.statusCode === 401) {
      throw new Error('Authentication failed with Razorpay. Please check your API keys.');
    }
    throw new Error(`Failed to create payment order: ${error.message || 'Unknown error'}`);
  }
};

/**
 * Verify Razorpay payment signature
 * @param {Object} paymentData - Payment data including razorpay_order_id, razorpay_payment_id, razorpay_signature
 * @returns {Boolean} - Whether signature is valid
 */
const verifyPaymentSignature = (paymentData) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentData;
    
    // Create a signature using the order_id and payment_id
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');
    
    // Compare the generated signature with the one received from Razorpay
    return generatedSignature === razorpay_signature;
  } catch (error) {
    console.error('Error verifying payment signature:', error);
    return false;
  }
};

/**
 * Save payment details to database
 * @param {Object} paymentData - Payment data
 * @returns {Promise<Object>} - Saved payment document
 */
const savePaymentDetails = async (paymentData) => {
  try {
    const { 
      orderId, 
      userId, 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      amount,
      currency,
      paymentDetails
    } = paymentData;

    const payment = new Payment({
      orderId,
      userId,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      amount: amount / 100, // Convert from paise to rupees
      currency: currency || 'INR',
      status: 'completed',
      paymentDetails
    });

    const savedPayment = await payment.save();
    
    // Update the order status to "Paid"
    await Order.findByIdAndUpdate(orderId, { 
      paymentStatus: 'paid',
      paymentId: savedPayment._id
    });

    return savedPayment;
  } catch (error) {
    console.error('Error saving payment details:', error);
    throw new Error(`Failed to save payment details: ${error.message}`);
  }
};

/**
 * Get payment details by ID
 * @param {String} paymentId - Payment ID
 * @returns {Promise<Object>} - Payment document
 */
const getPaymentById = async (paymentId) => {
  try {
    return await Payment.findById(paymentId);
  } catch (error) {
    console.error('Error getting payment details:', error);
    throw new Error(`Failed to get payment details: ${error.message}`);
  }
};

/**
 * Get all payments for a user
 * @param {String} userId - User ID
 * @returns {Promise<Array>} - Array of payment documents
 */
const getPaymentsByUser = async (userId) => {
  try {
    return await Payment.find({ userId }).sort({ createdAt: -1 });
  } catch (error) {
    console.error('Error getting user payments:', error);
    throw new Error(`Failed to get user payments: ${error.message}`);
  }
};

/**
 * Get payment details for an order
 * @param {String} orderId - Order ID
 * @returns {Promise<Object>} - Payment document
 */
const getPaymentByOrder = async (orderId) => {
  try {
    return await Payment.findOne({ orderId });
  } catch (error) {
    console.error('Error getting order payment:', error);
    throw new Error(`Failed to get order payment: ${error.message}`);
  }
};

module.exports = {
  createRazorpayOrder,
  verifyPaymentSignature,
  savePaymentDetails,
  getPaymentById,
  getPaymentsByUser,
  getPaymentByOrder
};
