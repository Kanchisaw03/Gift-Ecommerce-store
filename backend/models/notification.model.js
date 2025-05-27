const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a notification title'],
    trim: true,
    maxlength: [100, 'Notification title cannot be more than 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Please provide a notification message'],
    trim: true,
    maxlength: [500, 'Notification message cannot be more than 500 characters']
  },
  type: {
    type: String,
    enum: ['order_confirmation', 'order_status_update', 'order_shipped', 'order_delivered', 'order_cancelled', 'order_refunded', 'product', 'account', 'promotion', 'system'],
    default: 'system'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  actionLink: {
    type: String,
    trim: true
  },
  resourceType: {
    type: String,
    enum: ['order', 'product', 'user', 'review', 'payment', 'other'],
    default: 'other'
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'resourceModel'
  },
  resourceModel: {
    type: String,
    enum: ['Order', 'Product', 'User', 'Review', 'other'],
    default: 'other'
  },
  channels: {
    type: [String],
    enum: ['email', 'sms', 'push', 'in_app'],
    default: ['in_app']
  },
  deliveryStatus: {
    email: {
      sent: { type: Boolean, default: false },
      error: String,
      sentAt: Date
    },
    sms: {
      sent: { type: Boolean, default: false },
      error: String,
      sentAt: Date
    },
    push: {
      sent: { type: Boolean, default: false },
      error: String,
      sentAt: Date
    }
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: function() {
      // Default expiration is 30 days from creation
      const date = new Date();
      date.setDate(date.getDate() + 30);
      return date;
    }
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for faster queries
NotificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index for auto-deletion

module.exports = mongoose.model('Notification', NotificationSchema);
