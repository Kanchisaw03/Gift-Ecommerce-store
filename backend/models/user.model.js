const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  username: {
    type: String,
    unique: true,
    trim: true,
    maxlength: [50, 'Username cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['buyer', 'seller', 'admin', 'super_admin'],
    default: 'buyer'
  },
  phone: {
    type: String,
    maxlength: [20, 'Phone number cannot be longer than 20 characters']
  },
  avatar: {
    type: String,
    default: 'default-avatar.jpg'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  emailVerificationToken: String,
  emailVerificationExpire: Date,
  refreshToken: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  // Seller specific fields
  sellerInfo: {
    businessName: String,
    businessAddress: String,
    businessDescription: String,
    taxId: String,
    paymentDetails: {
      accountHolder: String,
      accountNumber: String,
      bankName: String,
      swiftCode: String
    },
    isApproved: {
      type: Boolean,
      default: false
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    totalSales: {
      type: Number,
      default: 0
    },
    totalRevenue: {
      type: Number,
      default: 0
    },
    commission: {
      type: Number,
      default: 5 // 5% commission by default
    }
  },
  // Buyer specific fields
  buyerInfo: {
    defaultShippingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address'
    },
    defaultBillingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address'
    },
    wishlist: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }],
    totalOrders: {
      type: Number,
      default: 0
    },
    totalSpent: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Update the updatedAt field on save
UserSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Sign JWT and return - Access Token with short expiry
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { 
      id: this._id, 
      role: this.role,
      name: this.name,
      email: this.email
    },
    process.env.JWT_SECRET || 'luxuryecommercesecret123',
    { expiresIn: process.env.JWT_EXPIRE || '1h' }
  );
};

// Sign Refresh Token and return - Longer lived token
UserSchema.methods.getRefreshToken = function() {
  // Generate a refresh token with minimal payload (just the ID)
  const refreshToken = jwt.sign(
    { id: this._id },
    process.env.JWT_REFRESH_SECRET || 'luxuryecommercerefreshsecret456',
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
  );

  // Store hashed version in the database for security
  const refreshTokenHash = crypto
    .createHash('sha256')
    .update(refreshToken)
    .digest('hex');

  // Save the hashed refresh token to the user document
  this.refreshToken = refreshTokenHash;
  
  return refreshToken;
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Match refresh token with stored hashed refresh token
UserSchema.methods.matchRefreshToken = async function(refreshToken) {
  if (!this.refreshToken) {
    return false;
  }
  
  // Hash the provided refresh token
  const hashedToken = crypto
    .createHash('sha256')
    .update(refreshToken)
    .digest('hex');
  
  // Compare with stored hashed token
  return hashedToken === this.refreshToken;
};

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function() {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

// Generate email verification token
UserSchema.methods.getEmailVerificationToken = function() {
  // Generate token
  const verificationToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to emailVerificationToken field
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');

  // Set expire
  this.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  return verificationToken;
};

// Virtual for user's addresses
UserSchema.virtual('addresses', {
  ref: 'Address',
  localField: '_id',
  foreignField: 'user',
  justOne: false
});

// Virtual for seller's products
UserSchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'seller',
  justOne: false
});

// Virtual for user's orders (as buyer)
UserSchema.virtual('orders', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'user',
  justOne: false
});

// Virtual for seller's orders (as seller)
UserSchema.virtual('sellerOrders', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'items.seller',
  justOne: false
});

module.exports = mongoose.model('User', UserSchema);
