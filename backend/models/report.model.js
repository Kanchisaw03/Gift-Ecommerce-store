const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a report name'],
    trim: true,
    maxlength: [100, 'Report name cannot be more than 100 characters']
  },
  type: {
    type: String,
    enum: ['sales', 'products', 'users', 'inventory', 'custom'],
    required: [true, 'Please provide a report type']
  },
  format: {
    type: String,
    enum: ['csv', 'pdf', 'json'],
    default: 'csv'
  },
  filters: {
    type: Object,
    default: {}
  },
  dateRange: {
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    }
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  fileUrl: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
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
ReportSchema.index({ createdBy: 1, createdAt: -1 });
ReportSchema.index({ status: 1 });
ReportSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index for auto-deletion

module.exports = mongoose.model('Report', ReportSchema);
