const Review = require('../models/review.model');
const Product = require('../models/product.model');
const Order = require('../models/order.model');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const cloudinary = require('../utils/cloudinary');

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get reviews for a product
// @route   GET /api/products/:productId/reviews
// @access  Public
exports.getProductReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find({
    product: req.params.productId,
    status: 'approved'
  })
    .populate({
      path: 'user',
      select: 'name avatar'
    })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews
  });
});

// @desc    Get single review
// @route   GET /api/reviews/:id
// @access  Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'user',
    select: 'name avatar'
  });

  if (!review) {
    return next(
      new ErrorResponse(`Review not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: review
  });
});

// @desc    Create review
// @route   POST /api/products/:productId/reviews
// @access  Private
exports.createReview = asyncHandler(async (req, res, next) => {
  req.body.product = req.params.productId;
  req.body.user = req.user.id;

  // Check if product exists
  const product = await Product.findById(req.params.productId);

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.productId}`, 404)
    );
  }

  // Check if user has already reviewed this product
  const existingReview = await Review.findOne({
    product: req.params.productId,
    user: req.user.id
  });

  if (existingReview) {
    return next(
      new ErrorResponse('You have already reviewed this product', 400)
    );
  }

  // Check if user has purchased this product
  const orders = await Order.find({
    user: req.user.id,
    'items.product': req.params.productId,
    status: 'delivered'
  });

  // Set verified purchase flag
  req.body.isVerifiedPurchase = orders.length > 0;

  // If user is admin or super_admin, auto-approve the review
  if (req.user.role === 'admin' || req.user.role === 'super_admin') {
    req.body.status = 'approved';
  }

  // Handle image uploads
  if (req.body.images && req.body.images.length > 0) {
    const uploadedImages = [];
    
    for (const image of req.body.images) {
      const result = await cloudinary.uploader.upload(image, {
        folder: 'reviews',
        transformation: [
          { width: 800, height: 800, crop: 'limit' },
          { quality: 'auto:good' }
        ]
      });

      uploadedImages.push({
        public_id: result.public_id,
        url: result.secure_url
      });
    }
    
    req.body.images = uploadedImages;
  }

  // Create review
  const review = await Review.create(req.body);

  res.status(201).json({
    success: true,
    data: review
  });
});

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`Review not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure review belongs to user or user is admin
  if (
    review.user.toString() !== req.user.id &&
    req.user.role !== 'admin' &&
    req.user.role !== 'super_admin'
  ) {
    return next(
      new ErrorResponse('Not authorized to update this review', 403)
    );
  }

  // Handle image uploads
  if (req.body.newImages && req.body.newImages.length > 0) {
    const uploadedImages = [...(review.images || [])];
    
    for (const image of req.body.newImages) {
      const result = await cloudinary.uploader.upload(image, {
        folder: 'reviews',
        transformation: [
          { width: 800, height: 800, crop: 'limit' },
          { quality: 'auto:good' }
        ]
      });

      uploadedImages.push({
        public_id: result.public_id,
        url: result.secure_url
      });
    }
    
    req.body.images = uploadedImages;
    delete req.body.newImages;
  }

  // Handle image deletions
  if (req.body.deleteImages && req.body.deleteImages.length > 0) {
    // Delete images from cloudinary
    for (const publicId of req.body.deleteImages) {
      await cloudinary.uploader.destroy(publicId);
    }
    
    // Filter out deleted images
    if (review.images && review.images.length > 0) {
      const remainingImages = review.images.filter(
        image => !req.body.deleteImages.includes(image.public_id)
      );
      
      req.body.images = remainingImages;
    }
    
    delete req.body.deleteImages;
  }

  // If user is updating their own review, set status back to pending for moderation
  if (review.user.toString() === req.user.id && req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    req.body.status = 'pending';
  }

  // Update review
  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: review
  });
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`Review not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure review belongs to user or user is admin
  if (
    review.user.toString() !== req.user.id &&
    req.user.role !== 'admin' &&
    req.user.role !== 'super_admin'
  ) {
    return next(
      new ErrorResponse('Not authorized to delete this review', 403)
    );
  }

  // Delete images from cloudinary
  if (review.images && review.images.length > 0) {
    for (const image of review.images) {
      await cloudinary.uploader.destroy(image.public_id);
    }
  }

  await review.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Approve review (Admin only)
// @route   PUT /api/reviews/:id/approve
// @access  Private (Admin)
exports.approveReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`Review not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is admin
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return next(
      new ErrorResponse('Not authorized to approve reviews', 403)
    );
  }

  // Update review status
  review.status = 'approved';
  await review.save();

  res.status(200).json({
    success: true,
    data: review
  });
});

// @desc    Reject review (Admin only)
// @route   PUT /api/reviews/:id/reject
// @access  Private (Admin)
exports.rejectReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`Review not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is admin
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return next(
      new ErrorResponse('Not authorized to reject reviews', 403)
    );
  }

  // Update review status
  review.status = 'rejected';
  review.rejectionReason = req.body.reason || 'Review does not meet our guidelines';
  await review.save();

  res.status(200).json({
    success: true,
    data: review
  });
});

// @desc    Add seller response to review
// @route   PUT /api/reviews/:id/seller-response
// @access  Private (Seller)
exports.addSellerResponse = asyncHandler(async (req, res, next) => {
  const { content } = req.body;

  if (!content) {
    return next(new ErrorResponse('Please provide a response', 400));
  }

  const review = await Review.findById(req.params.id).populate({
    path: 'product',
    select: 'seller'
  });

  if (!review) {
    return next(
      new ErrorResponse(`Review not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is the seller of the product
  if (
    review.product.seller.toString() !== req.user.id &&
    req.user.role !== 'admin' &&
    req.user.role !== 'super_admin'
  ) {
    return next(
      new ErrorResponse('Not authorized to respond to this review', 403)
    );
  }

  // Add seller response
  review.sellerResponse = {
    content,
    createdAt: Date.now()
  };

  await review.save();

  res.status(200).json({
    success: true,
    data: review
  });
});

// @desc    Get my reviews
// @route   GET /api/reviews/my-reviews
// @access  Private
exports.getMyReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find({ user: req.user.id })
    .populate({
      path: 'product',
      select: 'name images'
    })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews
  });
});
