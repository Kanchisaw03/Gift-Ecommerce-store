const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/order.model');
const User = require('../models/user.model');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Create payment intent
// @route   POST /api/payments/create-payment-intent
// @access  Private
exports.createPaymentIntent = asyncHandler(async (req, res, next) => {
  const { items, shipping, couponDiscount } = req.body;

  // Validate input
  if (!items || items.length === 0) {
    return next(new ErrorResponse('Please provide items', 400));
  }

  // Calculate order amount
  let amount = 0;
  for (const item of items) {
    amount += item.price * item.quantity;
  }

  // Add shipping cost
  if (shipping) {
    amount += shipping;
  }

  // Apply discount
  if (couponDiscount) {
    amount -= couponDiscount;
  }

  // Ensure minimum amount for Stripe
  if (amount < 0.5) {
    amount = 0.5;
  }

  // Convert to cents for Stripe
  const amountInCents = Math.round(amount * 100);

  // Create payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: 'usd',
    metadata: {
      userId: req.user.id,
      integration_check: 'accept_a_payment'
    }
  });

  res.status(200).json({
    success: true,
    clientSecret: paymentIntent.client_secret
  });
});

// @desc    Process payment webhook
// @route   POST /api/payments/webhook
// @access  Public
exports.processWebhook = asyncHandler(async (req, res, next) => {
  const signature = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      await handleSuccessfulPayment(paymentIntent);
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      await handleFailedPayment(failedPayment);
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.status(200).json({ received: true });
});

// @desc    Get payment status
// @route   GET /api/payments/:paymentId/status
// @access  Private
exports.getPaymentStatus = asyncHandler(async (req, res, next) => {
  const { paymentId } = req.params;

  // Retrieve payment intent from Stripe
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);

  if (!paymentIntent) {
    return next(new ErrorResponse('Payment not found', 404));
  }

  res.status(200).json({
    success: true,
    data: {
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100, // Convert from cents
      currency: paymentIntent.currency,
      created: paymentIntent.created,
      paymentMethod: paymentIntent.payment_method
    }
  });
});

// @desc    Create refund
// @route   POST /api/payments/:paymentId/refund
// @access  Private (Admin, Seller)
exports.createRefund = asyncHandler(async (req, res, next) => {
  const { paymentId } = req.params;
  const { amount, reason } = req.body;

  // Check if user is admin or seller
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin' && req.user.role !== 'seller') {
    return next(
      new ErrorResponse('Not authorized to process refunds', 403)
    );
  }

  // If user is seller, check if they own the order
  if (req.user.role === 'seller') {
    const order = await Order.findOne({ 'paymentInfo.id': paymentId });
    
    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }
    
    const isSellerOrder = order.items.some(item => item.seller.toString() === req.user.id);
    
    if (!isSellerOrder) {
      return next(
        new ErrorResponse('Not authorized to refund this order', 403)
      );
    }
  }

  // Create refund
  const refund = await stripe.refunds.create({
    payment_intent: paymentId,
    amount: amount ? Math.round(amount * 100) : undefined, // Convert to cents if provided
    reason: reason || 'requested_by_customer'
  });

  // Update order status if refund is successful
  if (refund.status === 'succeeded') {
    const order = await Order.findOne({ 'paymentInfo.id': paymentId });
    
    if (order) {
      order.status = 'refunded';
      order.refundedAt = Date.now();
      order.refundAmount = amount || order.total;
      await order.save();
    }
  }

  res.status(200).json({
    success: true,
    data: refund
  });
});

// Helper function to handle successful payment
const handleSuccessfulPayment = async (paymentIntent) => {
  try {
    // Find order with this payment intent
    const order = await Order.findOne({
      'paymentInfo.id': paymentIntent.id
    });

    if (order) {
      // Update payment status
      order.paymentInfo.status = 'completed';
      order.paymentInfo.paidAt = Date.now();
      order.status = 'processing';
      
      await order.save();
    }
  } catch (err) {
    console.error('Error handling successful payment:', err);
  }
};

// Helper function to handle failed payment
const handleFailedPayment = async (paymentIntent) => {
  try {
    // Find order with this payment intent
    const order = await Order.findOne({
      'paymentInfo.id': paymentIntent.id
    });

    if (order) {
      // Update payment status
      order.paymentInfo.status = 'failed';
      order.status = 'cancelled';
      order.cancellationReason = 'Payment failed';
      order.cancelledAt = Date.now();
      
      await order.save();

      // Restore product stock
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock += item.quantity;
          product.sold -= item.quantity;
          await product.save();
        }
      }
    }
  } catch (err) {
    console.error('Error handling failed payment:', err);
  }
};
