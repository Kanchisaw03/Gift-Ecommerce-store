const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema({
  key: {
    type: String,
    required: [true, 'Please provide a setting key'],
    unique: true,
    trim: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Please provide a setting value']
  },
  group: {
    type: String,
    enum: ['general', 'payment', 'shipping', 'email', 'appearance', 'seo', 'security', 'other'],
    default: 'other'
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Pre-save hook to update the updatedAt field
SettingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for faster queries
SettingSchema.index({ key: 1 });
SettingSchema.index({ group: 1 });
SettingSchema.index({ isPublic: 1 });

module.exports = mongoose.model('Setting', SettingSchema);
