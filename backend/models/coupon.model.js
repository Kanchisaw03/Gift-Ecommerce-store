const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Please provide a coupon code'],
    unique: true,
    trim: true,
    uppercase: true
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: [true, 'Please specify coupon type']
  },
  amount: {
    type: Number,
    required: [true, 'Please provide discount amount'],
    min: [0, 'Amount cannot be negative']
  },
  minPurchase: {
    type: Number,
    default: 0
  },
  maxDiscount: {
    type: Number,
    default: null
  },
  description: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: [true, 'Please provide an end date']
  },
  usageLimit: {
    type: Number,
    default: null
  },
  usageCount: {
    type: Number,
    default: 0
  },
  perUserLimit: {
    type: Number,
    default: null
  },
  applicableProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  applicableCategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  excludedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  userRestriction: {
    type: String,
    enum: ['none', 'new', 'existing'],
    default: 'none'
  },
  userGroups: [{
    type: String,
    enum: ['buyer', 'seller', 'admin', 'super_admin']
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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

// Virtual for checking if coupon is expired
CouponSchema.virtual('isExpired').get(function() {
  return this.endDate < new Date();
});

// Virtual for checking if coupon is valid (active and not expired)
CouponSchema.virtual('isValid').get(function() {
  return this.isActive && !this.isExpired && (this.usageLimit === null || this.usageCount < this.usageLimit);
});

// Virtual for remaining uses
CouponSchema.virtual('remainingUses').get(function() {
  if (this.usageLimit === null) return Infinity;
  return Math.max(0, this.usageLimit - this.usageCount);
});

// Pre-save hook to convert coupon code to uppercase
CouponSchema.pre('save', function(next) {
  if (this.code) {
    this.code = this.code.toUpperCase();
  }
  this.updatedAt = Date.now();
  next();
});

// Index for faster queries
CouponSchema.index({ code: 1 });
CouponSchema.index({ isActive: 1, startDate: 1, endDate: 1 });

module.exports = mongoose.model('Coupon', CouponSchema);
