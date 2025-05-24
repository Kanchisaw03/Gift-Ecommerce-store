const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Notification = require('../models/notification.model');

// @desc    Get all notifications for a user
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = asyncHandler(async (req, res, next) => {
  const { read, type, limit = 10, page = 1 } = req.query;
  
  // Build query
  const query = { user: req.user.id };
  
  // Filter by read status if provided
  if (read !== undefined) {
    query.isRead = read === 'true';
  }
  
  // Filter by notification type if provided
  if (type) {
    query.type = type;
  }
  
  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  // Get notifications
  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
  
  // Get total count
  const total = await Notification.countDocuments(query);
  
  res.status(200).json({
    success: true,
    count: notifications.length,
    total,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit))
    },
    data: notifications
  });
});

// @desc    Get unread notification count
// @route   GET /api/notifications/unread-count
// @access  Private
exports.getUnreadCount = asyncHandler(async (req, res, next) => {
  const count = await Notification.countDocuments({
    user: req.user.id,
    isRead: false
  });
  
  res.status(200).json({
    success: true,
    count
  });
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = asyncHandler(async (req, res, next) => {
  let notification = await Notification.findById(req.params.id);
  
  if (!notification) {
    return next(
      new ErrorResponse(`Notification not found with id of ${req.params.id}`, 404)
    );
  }
  
  // Make sure notification belongs to user
  if (notification.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse('Not authorized to access this notification', 403)
    );
  }
  
  notification = await Notification.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    {
      new: true,
      runValidators: true
    }
  );
  
  res.status(200).json({
    success: true,
    data: notification
  });
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllAsRead = asyncHandler(async (req, res, next) => {
  await Notification.updateMany(
    { user: req.user.id, isRead: false },
    { isRead: true }
  );
  
  res.status(200).json({
    success: true,
    message: 'All notifications marked as read'
  });
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
exports.deleteNotification = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);
  
  if (!notification) {
    return next(
      new ErrorResponse(`Notification not found with id of ${req.params.id}`, 404)
    );
  }
  
  // Make sure notification belongs to user
  if (notification.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse('Not authorized to delete this notification', 403)
    );
  }
  
  await notification.remove();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Delete all read notifications
// @route   DELETE /api/notifications/read
// @access  Private
exports.deleteReadNotifications = asyncHandler(async (req, res, next) => {
  await Notification.deleteMany({
    user: req.user.id,
    isRead: true
  });
  
  res.status(200).json({
    success: true,
    message: 'All read notifications deleted'
  });
});

// @desc    Create a notification (admin/system only)
// @route   POST /api/notifications
// @access  Private/Admin
exports.createNotification = asyncHandler(async (req, res, next) => {
  // Create notification
  const notification = await Notification.create(req.body);
  
  res.status(201).json({
    success: true,
    data: notification
  });
});

// @desc    Create bulk notifications (admin/system only)
// @route   POST /api/notifications/bulk
// @access  Private/Admin
exports.createBulkNotifications = asyncHandler(async (req, res, next) => {
  const { users, notification } = req.body;
  
  if (!users || !Array.isArray(users) || users.length === 0) {
    return next(
      new ErrorResponse('Please provide an array of user IDs', 400)
    );
  }
  
  if (!notification) {
    return next(
      new ErrorResponse('Please provide notification details', 400)
    );
  }
  
  // Create notifications for each user
  const notifications = users.map(userId => ({
    user: userId,
    ...notification
  }));
  
  await Notification.insertMany(notifications);
  
  res.status(201).json({
    success: true,
    count: notifications.length,
    message: 'Bulk notifications created successfully'
  });
});
