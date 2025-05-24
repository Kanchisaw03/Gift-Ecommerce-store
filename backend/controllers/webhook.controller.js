const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Order = require('../models/order.model');
const User = require('../models/user.model');
const Product = require('../models/product.model');
const NotificationService = require('../services/notification.service');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// @desc    Handle Stripe webhook
// @route   POST /api/webhooks/stripe
// @access  Public
exports.stripeWebhook = asyncHandler(async (req, res, next) => {
  const signature = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody, // Raw request body (buffer)
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentIntentSucceeded(event.data.object);
      break;
    case 'payment_intent.payment_failed':
      await handlePaymentIntentFailed(event.data.object);
      break;
    case 'charge.refunded':
      await handleChargeRefunded(event.data.object);
      break;
    default:
      console.log(`Unhandled Stripe event type: ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.status(200).json({ received: true });
});

// Handle successful payment
const handlePaymentIntentSucceeded = async (paymentIntent) => {
  try {
    // Find order by payment intent ID
    const order = await Order.findOne({
      'paymentInfo.id': paymentIntent.id
    });

    if (!order) {
      console.error(`Order not found for payment intent: ${paymentIntent.id}`);
      return;
    }

    // Update order payment status
    order.paymentInfo.status = 'completed';
    order.paymentInfo.paidAt = Date.now();
    
    // If order status is still pending, update it to processing
    if (order.status === 'pending') {
      order.status = 'processing';
      
      // Add to order timeline
      order.timeline.push({
        status: 'processing',
        description: 'Payment received, order is being processed',
        timestamp: Date.now()
      });
    }

    await order.save();

    // Update product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    // Update user's total spent (for buyer)
    await User.findByIdAndUpdate(order.user, {
      $inc: { 'buyerInfo.totalSpent': order.total, 'buyerInfo.totalOrders': 1 }
    });

    // Update seller's total revenue and sales (for each seller in the order)
    const sellerIds = [...new Set(order.items.map(item => item.seller.toString()))];
    
    for (const sellerId of sellerIds) {
      // Calculate total for this seller
      const sellerItems = order.items.filter(item => item.seller.toString() === sellerId);
      const sellerTotal = sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const sellerQuantity = sellerItems.reduce((sum, item) => sum + item.quantity, 0);
      
      await User.findByIdAndUpdate(sellerId, {
        $inc: {
          'sellerInfo.totalRevenue': sellerTotal,
          'sellerInfo.totalSales': sellerQuantity
        }
      });
    }

    // Send notifications
    await NotificationService.createOrderNotification({
      orderId: order._id,
      userId: order.user,
      status: 'processing',
      sellerIds
    });

    console.log(`Payment succeeded for order: ${order._id}`);
  } catch (error) {
    console.error('Error handling payment intent succeeded:', error);
  }
};

// Handle failed payment
const handlePaymentIntentFailed = async (paymentIntent) => {
  try {
    // Find order by payment intent ID
    const order = await Order.findOne({
      'paymentInfo.id': paymentIntent.id
    });

    if (!order) {
      console.error(`Order not found for payment intent: ${paymentIntent.id}`);
      return;
    }

    // Update order payment status
    order.paymentInfo.status = 'failed';
    
    // Add to order timeline
    order.timeline.push({
      status: 'payment_failed',
      description: `Payment failed: ${paymentIntent.last_payment_error?.message || 'Unknown error'}`,
      timestamp: Date.now()
    });

    await order.save();

    // Send notification to user
    await NotificationService.createNotification({
      userId: order.user,
      title: 'Payment Failed',
      message: `Your payment for order #${order.orderNumber} has failed. Please try again or contact support.`,
      type: 'order',
      priority: 'high',
      actionLink: `/buyer/orders/${order._id}`,
      resourceType: 'order',
      resourceId: order._id,
      resourceModel: 'Order'
    });

    console.log(`Payment failed for order: ${order._id}`);
  } catch (error) {
    console.error('Error handling payment intent failed:', error);
  }
};

// Handle refunded charge
const handleChargeRefunded = async (charge) => {
  try {
    // Find order by payment intent ID
    const order = await Order.findOne({
      'paymentInfo.id': charge.payment_intent
    });

    if (!order) {
      console.error(`Order not found for charge: ${charge.id}`);
      return;
    }

    // Check if it's a full or partial refund
    const isFullRefund = charge.amount_refunded === charge.amount;

    // Update order
    if (isFullRefund) {
      order.status = 'refunded';
      order.paymentInfo.status = 'refunded';
    } else {
      order.paymentInfo.status = 'partially_refunded';
      order.paymentInfo.amountRefunded = charge.amount_refunded / 100; // Convert from cents
    }
    
    // Add to order timeline
    order.timeline.push({
      status: isFullRefund ? 'refunded' : 'partially_refunded',
      description: isFullRefund 
        ? 'Order has been fully refunded' 
        : `Order has been partially refunded (${(charge.amount_refunded / 100).toFixed(2)} ${charge.currency.toUpperCase()})`,
      timestamp: Date.now()
    });

    await order.save();

    // Send notification to user
    await NotificationService.createNotification({
      userId: order.user,
      title: isFullRefund ? 'Order Refunded' : 'Order Partially Refunded',
      message: isFullRefund
        ? `Your order #${order.orderNumber} has been fully refunded.`
        : `Your order #${order.orderNumber} has been partially refunded (${(charge.amount_refunded / 100).toFixed(2)} ${charge.currency.toUpperCase()}).`,
      type: 'order',
      priority: 'medium',
      actionLink: `/buyer/orders/${order._id}`,
      resourceType: 'order',
      resourceId: order._id,
      resourceModel: 'Order'
    });

    // Send notifications to sellers
    const sellerIds = [...new Set(order.items.map(item => item.seller.toString()))];
    
    for (const sellerId of sellerIds) {
      await NotificationService.createNotification({
        userId: sellerId,
        title: isFullRefund ? 'Order Refunded' : 'Order Partially Refunded',
        message: isFullRefund
          ? `Order #${order.orderNumber} has been fully refunded.`
          : `Order #${order.orderNumber} has been partially refunded (${(charge.amount_refunded / 100).toFixed(2)} ${charge.currency.toUpperCase()}).`,
        type: 'order',
        priority: 'medium',
        actionLink: `/seller/orders/${order._id}`,
        resourceType: 'order',
        resourceId: order._id,
        resourceModel: 'Order'
      });
    }

    console.log(`Refund processed for order: ${order._id}`);
  } catch (error) {
    console.error('Error handling charge refunded:', error);
  }
};

// @desc    Handle PayPal webhook
// @route   POST /api/webhooks/paypal
// @access  Public
exports.paypalWebhook = asyncHandler(async (req, res, next) => {
  // Verify webhook signature (implementation depends on PayPal SDK)
  // ...

  const event = req.body;

  // Handle the event
  switch (event.event_type) {
    case 'PAYMENT.CAPTURE.COMPLETED':
      // Handle successful payment
      // Similar to Stripe's payment_intent.succeeded
      break;
    case 'PAYMENT.CAPTURE.DENIED':
      // Handle failed payment
      // Similar to Stripe's payment_intent.payment_failed
      break;
    case 'PAYMENT.CAPTURE.REFUNDED':
      // Handle refund
      // Similar to Stripe's charge.refunded
      break;
    default:
      console.log(`Unhandled PayPal event type: ${event.event_type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.status(200).json({ received: true });
});

// @desc    Handle Cloudinary webhook
// @route   POST /api/webhooks/cloudinary
// @access  Public
exports.cloudinaryWebhook = asyncHandler(async (req, res, next) => {
  // Verify webhook signature (implementation depends on Cloudinary SDK)
  // ...

  const event = req.body;

  // Handle the event
  switch (event.notification_type) {
    case 'upload':
      console.log(`New upload: ${event.public_id}`);
      break;
    case 'delete':
      console.log(`Resource deleted: ${event.public_id}`);
      break;
    default:
      console.log(`Unhandled Cloudinary event type: ${event.notification_type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.status(200).json({ received: true });
});
