const mongoose = require('mongoose');

const OrderTimelineSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: [true, 'Please provide order ID']
  },
  status: {
    type: String,
    required: [true, 'Please provide status'],
    enum: [
      'pending',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'refunded',
      'tracking_added',
      'payment_received',
      'payment_failed',
      'note_added',
      'other'
    ]
  },
  description: {
    type: String,
    required: [true, 'Please provide description']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create compound index for better query performance
OrderTimelineSchema.index({ order: 1, createdAt: -1 });

module.exports = mongoose.model('OrderTimeline', OrderTimelineSchema);
