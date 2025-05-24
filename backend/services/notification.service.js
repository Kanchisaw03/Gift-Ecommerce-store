const Notification = require('../models/notification.model');

/**
 * Notification Service
 * This service provides methods to create and manage notifications programmatically
 * throughout the application.
 */
class NotificationService {
  /**
   * Create a notification for a single user
   * @param {Object} notificationData - Notification data
   * @param {string} notificationData.userId - User ID to send notification to
   * @param {string} notificationData.title - Notification title
   * @param {string} notificationData.message - Notification message
   * @param {string} notificationData.type - Notification type (order, product, account, promotion, system)
   * @param {string} notificationData.priority - Notification priority (low, medium, high)
   * @param {string} notificationData.actionLink - Optional link for action
   * @param {string} notificationData.resourceType - Resource type (order, product, user, review, payment, other)
   * @param {string} notificationData.resourceId - Resource ID
   * @param {string} notificationData.resourceModel - Resource model name
   * @returns {Promise<Object>} Created notification
   */
  static async createNotification({
    userId,
    title,
    message,
    type = 'system',
    priority = 'medium',
    actionLink,
    resourceType = 'other',
    resourceId,
    resourceModel = 'other'
  }) {
    try {
      const notification = await Notification.create({
        user: userId,
        title,
        message,
        type,
        priority,
        actionLink,
        resourceType,
        resourceId,
        resourceModel
      });

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  /**
   * Create notifications for multiple users
   * @param {Array} userIds - Array of user IDs
   * @param {Object} notificationData - Notification data
   * @returns {Promise<number>} Count of created notifications
   */
  static async createBulkNotifications(userIds, notificationData) {
    try {
      const notifications = userIds.map(userId => ({
        user: userId,
        title: notificationData.title,
        message: notificationData.message,
        type: notificationData.type || 'system',
        priority: notificationData.priority || 'medium',
        actionLink: notificationData.actionLink,
        resourceType: notificationData.resourceType || 'other',
        resourceId: notificationData.resourceId,
        resourceModel: notificationData.resourceModel || 'other'
      }));

      const result = await Notification.insertMany(notifications);
      return result.length;
    } catch (error) {
      console.error('Error creating bulk notifications:', error);
      throw error;
    }
  }

  /**
   * Create order notifications
   * @param {Object} orderData - Order data
   * @param {string} orderData.orderId - Order ID
   * @param {string} orderData.userId - User ID
   * @param {string} orderData.status - Order status
   * @param {Array} orderData.sellerIds - Array of seller IDs involved in the order
   * @returns {Promise<Array>} Created notifications
   */
  static async createOrderNotification({ orderId, userId, status, sellerIds = [] }) {
    try {
      const notifications = [];
      let title, message, actionLink;

      // Notification for buyer
      switch (status) {
        case 'pending':
          title = 'Order Received';
          message = 'Your order has been received and is being processed.';
          break;
        case 'processing':
          title = 'Order Processing';
          message = 'Your order is now being processed.';
          break;
        case 'shipped':
          title = 'Order Shipped';
          message = 'Your order has been shipped and is on its way to you.';
          break;
        case 'delivered':
          title = 'Order Delivered';
          message = 'Your order has been delivered. Enjoy your purchase!';
          break;
        case 'cancelled':
          title = 'Order Cancelled';
          message = 'Your order has been cancelled.';
          break;
        default:
          title = 'Order Update';
          message = `Your order status has been updated to ${status}.`;
      }

      actionLink = `/buyer/orders/${orderId}`;

      // Create notification for buyer
      const buyerNotification = await this.createNotification({
        userId,
        title,
        message,
        type: 'order',
        priority: status === 'cancelled' ? 'high' : 'medium',
        actionLink,
        resourceType: 'order',
        resourceId: orderId,
        resourceModel: 'Order'
      });

      notifications.push(buyerNotification);

      // Create notifications for sellers
      if (sellerIds.length > 0) {
        // Different message for sellers
        switch (status) {
          case 'pending':
            title = 'New Order Received';
            message = 'You have received a new order.';
            break;
          case 'processing':
            title = 'Order Processing';
            message = 'An order is now being processed.';
            break;
          case 'shipped':
            title = 'Order Shipped';
            message = 'An order has been marked as shipped.';
            break;
          case 'delivered':
            title = 'Order Delivered';
            message = 'An order has been marked as delivered.';
            break;
          case 'cancelled':
            title = 'Order Cancelled';
            message = 'An order has been cancelled.';
            break;
          default:
            title = 'Order Update';
            message = `An order status has been updated to ${status}.`;
        }

        actionLink = `/seller/orders/${orderId}`;

        // Create notifications for each seller
        for (const sellerId of sellerIds) {
          const sellerNotification = await this.createNotification({
            userId: sellerId,
            title,
            message,
            type: 'order',
            priority: status === 'pending' ? 'high' : 'medium',
            actionLink,
            resourceType: 'order',
            resourceId: orderId,
            resourceModel: 'Order'
          });

          notifications.push(sellerNotification);
        }
      }

      return notifications;
    } catch (error) {
      console.error('Error creating order notification:', error);
      throw error;
    }
  }

  /**
   * Create product notification
   * @param {Object} productData - Product data
   * @param {string} productData.productId - Product ID
   * @param {string} productData.sellerId - Seller ID
   * @param {string} productData.status - Product status
   * @param {string} productData.adminId - Admin ID who updated the status
   * @returns {Promise<Object>} Created notification
   */
  static async createProductNotification({ productId, sellerId, status, adminId }) {
    try {
      let title, message, actionLink;

      switch (status) {
        case 'approved':
          title = 'Product Approved';
          message = 'Your product has been approved and is now live on the marketplace.';
          break;
        case 'rejected':
          title = 'Product Rejected';
          message = 'Your product has been rejected. Please review the feedback and make necessary changes.';
          break;
        case 'pending':
          title = 'Product Under Review';
          message = 'Your product is under review by our team.';
          break;
        default:
          title = 'Product Update';
          message = `Your product status has been updated to ${status}.`;
      }

      actionLink = `/seller/products/${productId}`;

      return await this.createNotification({
        userId: sellerId,
        title,
        message,
        type: 'product',
        priority: status === 'rejected' ? 'high' : 'medium',
        actionLink,
        resourceType: 'product',
        resourceId: productId,
        resourceModel: 'Product'
      });
    } catch (error) {
      console.error('Error creating product notification:', error);
      throw error;
    }
  }

  /**
   * Create review notification
   * @param {Object} reviewData - Review data
   * @param {string} reviewData.reviewId - Review ID
   * @param {string} reviewData.productId - Product ID
   * @param {string} reviewData.sellerId - Seller ID
   * @param {string} reviewData.userId - User ID who created the review
   * @returns {Promise<Object>} Created notification
   */
  static async createReviewNotification({ reviewId, productId, sellerId, userId }) {
    try {
      return await this.createNotification({
        userId: sellerId,
        title: 'New Product Review',
        message: 'Your product has received a new review.',
        type: 'product',
        priority: 'medium',
        actionLink: `/seller/products/${productId}/reviews`,
        resourceType: 'review',
        resourceId: reviewId,
        resourceModel: 'Review'
      });
    } catch (error) {
      console.error('Error creating review notification:', error);
      throw error;
    }
  }

  /**
   * Create account notification
   * @param {Object} accountData - Account data
   * @param {string} accountData.userId - User ID
   * @param {string} accountData.action - Account action (verification, password_reset, etc.)
   * @returns {Promise<Object>} Created notification
   */
  static async createAccountNotification({ userId, action }) {
    try {
      let title, message, actionLink;

      switch (action) {
        case 'verification':
          title = 'Account Verified';
          message = 'Your account has been successfully verified.';
          actionLink = '/profile';
          break;
        case 'password_reset':
          title = 'Password Reset';
          message = 'Your password has been successfully reset.';
          actionLink = '/profile';
          break;
        case 'seller_approved':
          title = 'Seller Account Approved';
          message = 'Your seller account has been approved. You can now list products.';
          actionLink = '/seller/dashboard';
          break;
        case 'seller_rejected':
          title = 'Seller Account Rejected';
          message = 'Your seller account application has been rejected. Please contact support for more information.';
          actionLink = '/support';
          break;
        default:
          title = 'Account Update';
          message = 'Your account has been updated.';
          actionLink = '/profile';
      }

      return await this.createNotification({
        userId,
        title,
        message,
        type: 'account',
        priority: action === 'seller_rejected' ? 'high' : 'medium',
        actionLink,
        resourceType: 'user',
        resourceId: userId,
        resourceModel: 'User'
      });
    } catch (error) {
      console.error('Error creating account notification:', error);
      throw error;
    }
  }

  /**
   * Create promotion notification
   * @param {Object} promotionData - Promotion data
   * @param {Array} promotionData.userIds - Array of user IDs
   * @param {string} promotionData.title - Promotion title
   * @param {string} promotionData.message - Promotion message
   * @param {string} promotionData.actionLink - Action link
   * @returns {Promise<number>} Count of created notifications
   */
  static async createPromotionNotification({ userIds, title, message, actionLink }) {
    try {
      return await this.createBulkNotifications(userIds, {
        title,
        message,
        type: 'promotion',
        priority: 'low',
        actionLink,
        resourceType: 'other'
      });
    } catch (error) {
      console.error('Error creating promotion notification:', error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   * @param {string} notificationId - Notification ID
   * @returns {Promise<Object>} Updated notification
   */
  static async markAsRead(notificationId) {
    try {
      return await Notification.findByIdAndUpdate(
        notificationId,
        { isRead: true },
        { new: true }
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read for a user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Update result
   */
  static async markAllAsRead(userId) {
    try {
      return await Notification.updateMany(
        { user: userId, isRead: false },
        { isRead: true }
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  /**
   * Delete notification
   * @param {string} notificationId - Notification ID
   * @returns {Promise<Object>} Delete result
   */
  static async deleteNotification(notificationId) {
    try {
      return await Notification.findByIdAndDelete(notificationId);
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  /**
   * Delete all read notifications for a user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Delete result
   */
  static async deleteReadNotifications(userId) {
    try {
      return await Notification.deleteMany({
        user: userId,
        isRead: true
      });
    } catch (error) {
      console.error('Error deleting read notifications:', error);
      throw error;
    }
  }
}

module.exports = NotificationService;
