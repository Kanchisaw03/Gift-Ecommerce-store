const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Wishlist = require('../models/wishlist.model');
const Product = require('../models/product.model');
const Cart = require('../models/cart.model');

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
  // Find user's wishlist
  let wishlist = await Wishlist.findOne({ user: req.user.id });

  if (!wishlist) {
    return next(new ErrorResponse('Wishlist not found', 404));
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

  // Get the product details from the wishlist
  const wishlistProduct = await Product.findById(productId);
  if (!wishlistProduct) {
    return next(new ErrorResponse('Product not found in database', 404));
  }
  
  // Check if product is available and approved
  if (wishlistProduct.status !== 'approved') {
    return next(new ErrorResponse('This product is not available for purchase', 400));
  }

  // Check if product is in stock
  if (wishlistProduct.stock <= 0) {
    return next(new ErrorResponse('This product is out of stock', 400));
  }

  // Check if requested quantity is available
  if (quantity > wishlistProduct.stock) {
    return next(new ErrorResponse(`Only ${wishlistProduct.stock} items available in stock`, 400));
  }

  // Find user's cart
  let cart = await Cart.findOne({ user: req.user.id });

  // If cart doesn't exist, create one
  if (!cart) {
    cart = await Cart.create({
      user: req.user.id,
      items: []
    });
  }

  // Check if product is already in cart
  const itemIndex = cart.items.findIndex(item => {
    return item.product && item.product.toString() === productId;
  });

  // Get current price
  const price = wishlistProduct.onSale && wishlistProduct.salePrice > 0 
    ? wishlistProduct.salePrice 
    : wishlistProduct.price;

  console.log('Adding product to cart:', { 
    productId, 
    name: wishlistProduct.name, 
    price, 
    quantity 
  });

  if (itemIndex > -1) {
    // Product exists in cart, update quantity
    cart.items[itemIndex].quantity += quantity;
    console.log('Updated existing cart item quantity to:', cart.items[itemIndex].quantity);
  } else {
    // Product is not in cart, add new item
    cart.items.push({
      product: wishlistProduct._id,
      quantity,
      price,
      name: wishlistProduct.name,
      image: wishlistProduct.images && wishlistProduct.images[0] ? wishlistProduct.images[0].url : '/assets/images/product-placeholder.jpg',
      seller: wishlistProduct.seller
    });
    console.log('Added new item to cart');
  }

  // Save cart
  await cart.save();
  console.log('Cart saved successfully');

  // Remove from wishlist
  wishlist.products.splice(productIndex, 1);
  await wishlist.save();
  console.log('Product removed from wishlist');

  // Return updated cart
  cart = await Cart.findById(cart._id)
    .populate({
      path: 'items.product',
      select: 'name price salePrice onSale images stock'
    })
    .populate({
      path: 'items.seller',
      select: 'name sellerInfo.businessName'
    });

  res.status(200).json({
    success: true,
    message: 'Item moved from wishlist to cart successfully',
    data: cart
  });
});
