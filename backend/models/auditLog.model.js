const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide user']
  },
  action: {
    type: String,
    required: [true, 'Please provide action'],
    enum: [
      'create',
      'update',
      'delete',
      'login',
      'logout',
      'approve',
      'reject',
      'refund',
      'cancel',
      'ship',
      'deliver',
      'feature',
      'unfeature',
      'settings_update',
      'role_change',
      'password_reset',
      'user_ban',
      'user_unban',
      'system_backup',
      'system_restore',
      'other'
    ]
  },
  resourceType: {
    type: String,
    required: [true, 'Please provide resource type'],
    enum: [
      'user',
      'product',
      'order',
      'category',
      'review',
      'payment',
      'setting',
      'role',
      'system',
      'other'
    ]
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId
  },
  description: {
    type: String,
    required: [true, 'Please provide description']
  },
  prevState: {
    type: Object
  },
  newState: {
    type: Object
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create compound index for better query performance
AuditLogSchema.index({ user: 1, action: 1, resourceType: 1, createdAt: -1 });

module.exports = mongoose.model('AuditLog', AuditLogSchema);
