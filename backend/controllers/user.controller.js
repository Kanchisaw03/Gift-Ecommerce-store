const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/user.model');
const Order = require('../models/order.model');
const Product = require('../models/product.model');
const Review = require('../models/review.model');
const cloudinary = require('../utils/cloudinary');

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('-password');

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone
  };

  // Handle avatar upload
  if (req.body.avatar) {
    // If user already has an avatar, delete the old one
    if (req.user.avatar && req.user.avatar.public_id) {
      await cloudinary.uploader.destroy(req.user.avatar.public_id);
    }

    // Upload new avatar
    const result = await cloudinary.uploader.upload(req.body.avatar, {
      folder: 'avatars',
      width: 150,
      crop: 'scale'
    });

    fieldsToUpdate.avatar = {
      public_id: result.public_id,
      url: result.secure_url
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  }).select('-password');

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Get user orders
// @route   GET /api/users/orders
// @access  Private
exports.getUserOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .populate({
      path: 'items.product',
      select: 'name images'
    });

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});

// @desc    Get user reviews
// @route   GET /api/users/reviews
// @access  Private
exports.getUserReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .populate({
      path: 'product',
      select: 'name images'
    });

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews
  });
});

// @desc    Get user wishlist
// @route   GET /api/users/wishlist
// @access  Private
exports.getWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id)
    .select('wishlist')
    .populate({
      path: 'wishlist',
      select: 'name description price images rating numReviews stock'
    });

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  res.status(200).json({
    success: true,
    count: user.wishlist.length,
    data: user.wishlist
  });
});

// @desc    Add product to wishlist
// @route   POST /api/users/wishlist/:productId
// @access  Private
exports.addToWishlist = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.productId);

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.productId}`, 404)
    );
  }

  // Check if product is already in wishlist
  const user = await User.findById(req.user.id);
  const isInWishlist = user.wishlist.includes(req.params.productId);

  if (isInWishlist) {
    return next(
      new ErrorResponse('Product already in wishlist', 400)
    );
  }

  // Add to wishlist
  await User.findByIdAndUpdate(
    req.user.id,
    { $push: { wishlist: req.params.productId } },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: 'Product added to wishlist'
  });
});

// @desc    Remove product from wishlist
// @route   DELETE /api/users/wishlist/:productId
// @access  Private
exports.removeFromWishlist = asyncHandler(async (req, res, next) => {
  // Remove from wishlist
  await User.findByIdAndUpdate(
    req.user.id,
    { $pull: { wishlist: req.params.productId } },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: 'Product removed from wishlist'
  });
});

// @desc    Get user dashboard stats
// @route   GET /api/users/dashboard
// @access  Private
exports.getUserDashboard = asyncHandler(async (req, res, next) => {
  // Get user orders count
  const orderCount = await Order.countDocuments({ user: req.user.id });

  // Get user reviews count
  const reviewCount = await Review.countDocuments({ user: req.user.id });

  // Get wishlist count
  const user = await User.findById(req.user.id).select('wishlist');
  const wishlistCount = user.wishlist.length;

  // Get recent orders
  const recentOrders = await Order.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate({
      path: 'items.product',
      select: 'name images'
    });

  // Get total spent
  const orders = await Order.find({ 
    user: req.user.id,
    'paymentInfo.status': 'completed'
  });
  
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);

  // Get recently viewed products (if implemented)
  // This would require tracking user views in a separate collection or user field

  res.status(200).json({
    success: true,
    data: {
      orderCount,
      reviewCount,
      wishlistCount,
      totalSpent,
      recentOrders
    }
  });
});

// @desc    Change user password
// @route   PUT /api/users/password
// @access  Private
exports.changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  // Check if passwords are provided
  if (!currentPassword || !newPassword) {
    return next(new ErrorResponse('Please provide current and new password', 400));
  }

  // Get user with password
  const user = await User.findById(req.user.id).select('+password');

  // Check if current password matches
  const isMatch = await user.matchPassword(currentPassword);

  if (!isMatch) {
    return next(new ErrorResponse('Current password is incorrect', 401));
  }

  // Set new password
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password updated successfully'
  });
});

// @desc    Delete user account
// @route   DELETE /api/users/account
// @access  Private
exports.deleteAccount = asyncHandler(async (req, res, next) => {
  // Get user
  const user = await User.findById(req.user.id);

  // Delete user avatar from cloudinary if exists
  if (user.avatar && user.avatar.public_id) {
    await cloudinary.uploader.destroy(user.avatar.public_id);
  }

  // Delete user
  await user.remove();

  res.status(200).json({
    success: true,
    message: 'Account deleted successfully'
  });
});

// @desc    Get single user by ID (admin only)
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update user by ID (admin only)
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).select('-password');

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Delete user by ID (admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  // Delete user avatar from cloudinary if exists
  if (user.avatar && user.avatar.public_id) {
    await cloudinary.uploader.destroy(user.avatar.public_id);
  }

  await user.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});
