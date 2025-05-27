const Notification = require('../models/notification.model');
const sendEmail = require('./sendEmail');
const sendSMS = require('./sendSMS');

/**
 * Create and send a notification through multiple channels
 * @param {Object} options - Notification options
 * @param {string} options.userId - User ID to send notification to
 * @param {string} options.title - Notification title
 * @param {string} options.message - Notification message (for in-app and SMS)
 * @param {string} options.type - Notification type (order_confirmation, order_status_update, etc.)
 * @param {string} options.priority - Notification priority (low, medium, high)
 * @param {string} options.resourceType - Resource type (order, product, etc.)
 * @param {string} options.resourceId - Resource ID
 * @param {string} options.resourceModel - Resource model name
 * @param {string} options.actionLink - Action link for the notification
 * @param {Array} options.channels - Channels to send notification through (email, sms, push, in_app)
 * @param {Object} options.emailOptions - Email specific options
 * @param {string} options.emailOptions.subject - Email subject
 * @param {string} options.emailOptions.html - Email HTML content
 * @param {Object} options.smsOptions - SMS specific options
 * @param {string} options.smsOptions.to - Phone number to send SMS to
 * @param {string} options.smsOptions.message - SMS message (overrides options.message)
 * @param {Object} options.metadata - Additional metadata for the notification
 * @returns {Promise<Object>} - Created notification
 */
exports.createNotification = async (options) => {
  try {
    // Create notification record
    const notification = await Notification.create({
      user: options.userId,
      title: options.title,
      message: options.message,
      type: options.type || 'system',
      priority: options.priority || 'medium',
      resourceType: options.resourceType || 'other',
      resourceId: options.resourceId,
      resourceModel: options.resourceModel || 'other',
      actionLink: options.actionLink,
      channels: options.channels || ['in_app'],
      metadata: options.metadata || {}
    });

    // Send through each channel
    const deliveryStatus = {};

    // Send email notification if requested
    if (options.channels?.includes('email') && options.emailOptions) {
      try {
        await sendEmail({
          email: options.emailOptions.to,
          subject: options.emailOptions.subject,
          html: options.emailOptions.html
        });

        deliveryStatus.email = {
          sent: true,
          sentAt: new Date()
        };
      } catch (error) {
        console.error('Error sending email notification:', error);
        deliveryStatus.email = {
          sent: false,
          error: error.message,
          sentAt: new Date()
        };
      }
    }

    // Send SMS notification if requested
    if (options.channels?.includes('sms') && options.smsOptions) {
      try {
        const smsResult = await sendSMS({
          to: options.smsOptions.to,
          message: options.smsOptions.message || options.message
        });

        deliveryStatus.sms = {
          sent: smsResult,
          sentAt: new Date()
        };
      } catch (error) {
        console.error('Error sending SMS notification:', error);
        deliveryStatus.sms = {
          sent: false,
          error: error.message,
          sentAt: new Date()
        };
      }
    }

    // Update notification with delivery status
    if (Object.keys(deliveryStatus).length > 0) {
      notification.deliveryStatus = deliveryStatus;
      await notification.save();
    }

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

/**
 * Send order confirmation notification
 * @param {Object} order - Order object
 * @param {Object} user - User object
 * @param {Object} emailTemplate - Email template object with subject and html
 * @returns {Promise<Object>} - Created notification
 */
exports.sendOrderConfirmation = async (order, user, emailTemplate) => {
  // Create order summary for notification message
  const orderNumber = order.orderNumber || order._id.toString().substring(0, 8);
  const orderTotal = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(order.total || 0);

  // Prepare SMS message
  const estimatedDelivery = new Date(order.createdAt);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);
  const deliveryDate = estimatedDelivery.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const smsMessage = `Hi ${user.name}, your order #${orderNumber} has been placed successfully! 🎉 Total: ${orderTotal}. Expected delivery: ${deliveryDate}. – Luxury Gift Store`;

  // Determine which channels to use
  const channels = ['in_app'];
  if (user.email) channels.push('email');
  if (user.phone) channels.push('sms');

  return this.createNotification({
    userId: user._id,
    title: `Order Confirmed: #${orderNumber}`,
    message: `Your order #${orderNumber} for ${orderTotal} has been confirmed. Expected delivery by ${deliveryDate}.`,
    type: 'order_confirmation',
    priority: 'high',
    resourceType: 'order',
    resourceId: order._id,
    resourceModel: 'Order',
    actionLink: `/track-order/${order._id}`,
    channels,
    emailOptions: {
      to: user.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html
    },
    smsOptions: {
      to: user.phone,
      message: smsMessage
    },
    metadata: {
      orderNumber,
      orderTotal: order.total,
      itemCount: order.items.length,
      estimatedDelivery: estimatedDelivery
    }
  });
};

/**
 * Send order status update notification
 * @param {Object} order - Order object
 * @param {Object} user - User object
 * @param {string} status - New order status
 * @param {Object} emailTemplate - Email template object with subject and html
 * @returns {Promise<Object>} - Created notification
 */
exports.sendOrderStatusUpdate = async (order, user, status, emailTemplate) => {
  // Create order summary for notification message
  const orderNumber = order.orderNumber || order._id.toString().substring(0, 8);
  
  // Get status text and emoji
  const getStatusInfo = (status) => {
    switch (status) {
      case 'processing':
        return { emoji: '🔧', text: 'Your order is being processed' };
      case 'shipped':
        return { emoji: '🚚', text: 'Your order has been shipped' };
      case 'delivered':
        return { emoji: '✅', text: 'Your order has been delivered' };
      case 'cancelled':
        return { emoji: '❌', text: 'Your order has been cancelled' };
      case 'refunded':
        return { emoji: '💸', text: 'Your order has been refunded' };
      default:
        return { emoji: '📦', text: 'Your order status has been updated' };
    }
  };

  const statusInfo = getStatusInfo(status);
  
  // Prepare SMS message
  const smsMessage = `${statusInfo.emoji} Luxury Gift Store: Order #${orderNumber} update - ${statusInfo.text}. ${order.trackingNumber ? `Tracking: ${order.trackingNumber}` : ''} Track at: ${process.env.FRONTEND_URL}/track-order/${order._id}`;

  // Determine which channels to use
  const channels = ['in_app'];
  if (user.email) channels.push('email');
  if (user.phone) channels.push('sms');

  return this.createNotification({
    userId: user._id,
    title: `Order Update: ${statusInfo.text}`,
    message: `Your order #${orderNumber} ${statusInfo.text.toLowerCase()}.`,
    type: `order_${status}`,
    priority: 'high',
    resourceType: 'order',
    resourceId: order._id,
    resourceModel: 'Order',
    actionLink: `/track-order/${order._id}`,
    channels,
    emailOptions: {
      to: user.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html
    },
    smsOptions: {
      to: user.phone,
      message: smsMessage
    },
    metadata: {
      orderNumber,
      newStatus: status,
      trackingNumber: order.trackingNumber,
      carrier: order.carrier
    }
  });
};
