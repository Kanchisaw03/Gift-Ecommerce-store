const mongoose = require('mongoose');

const ChatLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  userRole: {
    type: String,
    enum: ['guest', 'buyer', 'seller', 'admin', 'super_admin'],
    default: 'guest'
  },
  sessionId: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: [true, 'Message is required']
  },
  response: {
    type: String,
    required: [true, 'Response is required']
  },
  feedback: {
    type: String,
    enum: ['positive', 'negative', 'none'],
    default: 'none'
  },
  metadata: {
    type: Object,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for faster queries
ChatLogSchema.index({ userId: 1 });
ChatLogSchema.index({ sessionId: 1 });
ChatLogSchema.index({ createdAt: 1 });
ChatLogSchema.index({ feedback: 1 });

module.exports = mongoose.model('ChatLog', ChatLogSchema);
