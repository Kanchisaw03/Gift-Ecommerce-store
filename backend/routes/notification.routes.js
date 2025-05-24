const express = require('express');
const router = express.Router();

// Import controllers
const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteReadNotifications,
  createNotification,
  createBulkNotifications
} = require('../controllers/notification.controller');

// Import middleware
const { protect, authorize } = require('../middleware/auth');

// Routes
router.route('/')
  .get(protect, getNotifications)
  .post(protect, authorize('admin', 'super_admin'), createNotification);

router.route('/unread-count')
  .get(protect, getUnreadCount);

router.route('/read-all')
  .put(protect, markAllAsRead);

router.route('/read')
  .delete(protect, deleteReadNotifications);

router.route('/bulk')
  .post(protect, authorize('admin', 'super_admin'), createBulkNotifications);

router.route('/:id')
  .delete(protect, deleteNotification);

router.route('/:id/read')
  .put(protect, markAsRead);

module.exports = router;
