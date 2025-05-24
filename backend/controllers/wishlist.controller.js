const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Wishlist = require('../models/wishlist.model');
const Product = require('../models/product.model');

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = asyncHandler(async (req, res, next) => {
  let wishlist = await Wishlist.findOne({ user: req.user.id })
    .populate({
      path: 'products.product',
      select: 'name description price images rating numReviews stock status'
    });

  // If no wishlist exists, create an empty one
  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: req.user.id,
      products: []
    });
  }

  // Filter out any products that are no longer available or approved
  const filteredProducts = wishlist.products.filter(
    item => item.product && item.product.status === 'approved' && item.product.stock > 0
  );

  // Update wishlist if products were filtered out
  if (filteredProducts.length !== wishlist.products.length) {
    wishlist.products = filteredProducts;
    await wishlist.save();
  }

  res.status(200).json({
    success: true,
    count: wishlist.products.length,
    data: wishlist
  });
});

// @desc    Add product to wishlist
// @route   POST /api/wishlist/:productId
// @access  Private
exports.addToWishlist = asyncHandler(async (req, res, next) => {
  const productId = req.params.productId;

  // Check if product exists
  const product = await Product.findById(productId);

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${productId}`, 404)
    );
  }

  // Check if product is available and approved
  if (product.status !== 'approved' || product.stock <= 0) {
    return next(
      new ErrorResponse('This product is currently not available', 400)
    );
  }

  // Find user's wishlist or create one if it doesn't exist
  let wishlist = await Wishlist.findOne({ user: req.user.id });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: req.user.id,
      products: []
    });
  }

  // Check if product is already in wishlist
  const isInWishlist = wishlist.products.some(
    item => item.product.toString() === productId
  );

  if (isInWishlist) {
    return next(
      new ErrorResponse('Product already in wishlist', 400)
    );
  }

  // Add product to wishlist
  wishlist.products.push({
    product: productId,
    addedAt: Date.now()
  });

  await wishlist.save();

  res.status(200).json({
    success: true,
    message: 'Product added to wishlist',
    data: wishlist
  });
});

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
exports.removeFromWishlist = asyncHandler(async (req, res, next) => {
  const productId = req.params.productId;

  // Find user's wishlist
  const wishlist = await Wishlist.findOne({ user: req.user.id });

  if (!wishlist) {
    return next(
      new ErrorResponse('Wishlist not found', 404)
    );
  }

  // Check if product is in wishlist
  const productIndex = wishlist.products.findIndex(
    item => item.product.toString() === productId
  );

  if (productIndex === -1) {
    return next(
      new ErrorResponse('Product not found in wishlist', 404)
    );
  }

  // Remove product from wishlist
  wishlist.products.splice(productIndex, 1);
  await wishlist.save();

  res.status(200).json({
    success: true,
    message: 'Product removed from wishlist',
    data: wishlist
  });
});

// @desc    Clear wishlist
// @route   DELETE /api/wishlist
// @access  Private
exports.clearWishlist = asyncHandler(async (req, res, next) => {
  // Find user's wishlist
  const wishlist = await Wishlist.findOne({ user: req.user.id });

  if (!wishlist) {
    return next(
      new ErrorResponse('Wishlist not found', 404)
    );
  }

  // Clear products array
  wishlist.products = [];
  await wishlist.save();

  res.status(200).json({
    success: true,
    message: 'Wishlist cleared',
    data: wishlist
  });
});

// @desc    Move product from wishlist to cart
// @route   POST /api/wishlist/:productId/move-to-cart
// @access  Private
exports.moveToCart = asyncHandler(async (req, res, next) => {
  const productId = req.params.productId;
  const { quantity = 1 } = req.body;

  // Check if product exists
  const product = await Product.findById(productId);

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${productId}`, 404)
    );
  }

  // Check if product is available and approved
  if (product.status !== 'approved' || product.stock <= 0) {
    return next(
      new ErrorResponse('This product is currently not available', 400)
    );
  }

  // Check if requested quantity is available
  if (quantity > product.stock) {
    return next(
      new ErrorResponse(`Only ${product.stock} items available in stock`, 400)
    );
  }

  // Find user's wishlist
  const wishlist = await Wishlist.findOne({ user: req.user.id });

  if (!wishlist) {
    return next(
      new ErrorResponse('Wishlist not found', 404)
    );
  }

  // Check if product is in wishlist
  const productIndex = wishlist.products.findIndex(
    item => item.product.toString() === productId
  );

  if (productIndex === -1) {
    return next(
      new ErrorResponse('Product not found in wishlist', 404)
    );
  }

  // Import cart controller
  const { addToCart } = require('./cart.controller');

  // Add to cart (we need to modify the request object)
  req.params.id = productId;
  req.body = { quantity };

  // Call addToCart function
  await addToCart(req, res, next);

  // If we get here, the product was added to cart successfully
  // Now remove from wishlist
  wishlist.products.splice(productIndex, 1);
  await wishlist.save();

  // Response is handled by addToCart
});
