const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Coupon = require('../models/coupon.model');
const Order = require('../models/order.model');
const Product = require('../models/product.model');

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
exports.getCoupons = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single coupon
// @route   GET /api/coupons/:id
// @access  Private/Admin
exports.getCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findById(req.params.id)
    .populate('applicableProducts', 'name images')
    .populate('applicableCategories', 'name')
    .populate('excludedProducts', 'name images')
    .populate('createdBy', 'name')
    .populate('updatedBy', 'name');

  if (!coupon) {
    return next(
      new ErrorResponse(`Coupon not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: coupon
  });
});

// @desc    Create new coupon
// @route   POST /api/coupons
// @access  Private/Admin
exports.createCoupon = asyncHandler(async (req, res, next) => {
  // Add creator to req.body
  req.body.createdBy = req.user.id;
  req.body.updatedBy = req.user.id;

  // Check if coupon code already exists
  const existingCoupon = await Coupon.findOne({ code: req.body.code.toUpperCase() });
  if (existingCoupon) {
    return next(
      new ErrorResponse(`Coupon code ${req.body.code} already exists`, 400)
    );
  }

  const coupon = await Coupon.create(req.body);

  res.status(201).json({
    success: true,
    data: coupon
  });
});

// @desc    Update coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
exports.updateCoupon = asyncHandler(async (req, res, next) => {
  // Add updater to req.body
  req.body.updatedBy = req.user.id;
  req.body.updatedAt = Date.now();

  // Check if updating code and if it already exists
  if (req.body.code) {
    const existingCoupon = await Coupon.findOne({ 
      code: req.body.code.toUpperCase(),
      _id: { $ne: req.params.id }
    });
    
    if (existingCoupon) {
      return next(
        new ErrorResponse(`Coupon code ${req.body.code} already exists`, 400)
      );
    }
  }

  let coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    return next(
      new ErrorResponse(`Coupon not found with id of ${req.params.id}`, 404)
    );
  }

  coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: coupon
  });
});

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
exports.deleteCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    return next(
      new ErrorResponse(`Coupon not found with id of ${req.params.id}`, 404)
    );
  }

  await coupon.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Validate coupon
// @route   POST /api/coupons/validate
// @access  Private
exports.validateCoupon = asyncHandler(async (req, res, next) => {
  const { code, cartItems, cartTotal } = req.body;

  if (!code) {
    return next(new ErrorResponse('Please provide a coupon code', 400));
  }

  // Find coupon
  const coupon = await Coupon.findOne({ 
    code: code.toUpperCase(),
    isActive: true,
    startDate: { $lte: new Date() },
    endDate: { $gte: new Date() }
  })
    .populate('applicableProducts')
    .populate('applicableCategories')
    .populate('excludedProducts');

  if (!coupon) {
    return next(new ErrorResponse('Invalid or expired coupon code', 404));
  }

  // Check usage limit
  if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
    return next(new ErrorResponse('Coupon usage limit reached', 400));
  }

  // Check minimum purchase requirement
  if (cartTotal < coupon.minPurchase) {
    return next(
      new ErrorResponse(`Minimum purchase amount of $${coupon.minPurchase} required`, 400)
    );
  }

  // Check user restrictions
  if (coupon.userRestriction !== 'none') {
    // Get user's order count
    const orderCount = await Order.countDocuments({ user: req.user.id });
    
    if (coupon.userRestriction === 'new' && orderCount > 0) {
      return next(new ErrorResponse('Coupon is only valid for new customers', 400));
    }
    
    if (coupon.userRestriction === 'existing' && orderCount === 0) {
      return next(new ErrorResponse('Coupon is only valid for existing customers', 400));
    }
  }

  // Check user group restrictions
  if (coupon.userGroups && coupon.userGroups.length > 0) {
    if (!coupon.userGroups.includes(req.user.role)) {
      return next(new ErrorResponse('Coupon is not valid for your user group', 400));
    }
  }

  // Check per-user limit
  if (coupon.perUserLimit !== null) {
    // Count how many times this user has used this coupon
    const userUsageCount = await Order.countDocuments({
      user: req.user.id,
      'coupon.code': coupon.code
    });
    
    if (userUsageCount >= coupon.perUserLimit) {
      return next(
        new ErrorResponse(`You have reached the usage limit for this coupon`, 400)
      );
    }
  }

  // Calculate discount
  let discountAmount = 0;
  let applicableAmount = 0;

  // If there are applicable products or categories, filter the cart items
  if (
    (coupon.applicableProducts && coupon.applicableProducts.length > 0) ||
    (coupon.applicableCategories && coupon.applicableCategories.length > 0)
  ) {
    // Get product details for cart items
    const productIds = cartItems.map(item => item.product);
    const products = await Product.find({ _id: { $in: productIds } })
      .populate('category');
    
    // Map products to cart items
    const cartItemsWithDetails = cartItems.map(item => {
      const product = products.find(p => p._id.toString() === item.product.toString());
      return {
        ...item,
        productDetails: product
      };
    });
    
    // Filter applicable items
    const applicableItems = cartItemsWithDetails.filter(item => {
      // Check if product is excluded
      if (
        coupon.excludedProducts &&
        coupon.excludedProducts.some(
          p => p._id.toString() === item.product.toString()
        )
      ) {
        return false;
      }
      
      // Check if product is directly applicable
      if (
        coupon.applicableProducts &&
        coupon.applicableProducts.length > 0 &&
        coupon.applicableProducts.some(
          p => p._id.toString() === item.product.toString()
        )
      ) {
        return true;
      }
      
      // Check if product's category is applicable
      if (
        coupon.applicableCategories &&
        coupon.applicableCategories.length > 0 &&
        item.productDetails &&
        item.productDetails.category &&
        coupon.applicableCategories.some(
          c => c._id.toString() === item.productDetails.category._id.toString()
        )
      ) {
        return true;
      }
      
      // If no specific products or categories are set, all products are applicable
      return coupon.applicableProducts.length === 0 && coupon.applicableCategories.length === 0;
    });
    
    // Calculate applicable amount
    applicableAmount = applicableItems.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );
  } else {
    // All items are applicable
    applicableAmount = cartTotal;
  }

  // Calculate discount based on coupon type
  if (coupon.type === 'percentage') {
    discountAmount = (applicableAmount * coupon.amount) / 100;
  } else {
    // Fixed amount discount
    discountAmount = coupon.amount;
  }

  // Apply maximum discount limit if set
  if (coupon.maxDiscount !== null && discountAmount > coupon.maxDiscount) {
    discountAmount = coupon.maxDiscount;
  }

  // Ensure discount doesn't exceed the applicable amount
  if (discountAmount > applicableAmount) {
    discountAmount = applicableAmount;
  }

  res.status(200).json({
    success: true,
    data: {
      code: coupon.code,
      type: coupon.type,
      amount: coupon.amount,
      discountAmount: parseFloat(discountAmount.toFixed(2)),
      minPurchase: coupon.minPurchase,
      description: coupon.description
    }
  });
});

// @desc    Apply coupon to order
// @route   POST /api/coupons/apply
// @access  Private
exports.applyCoupon = asyncHandler(async (req, res, next) => {
  const { code, orderId } = req.body;

  if (!code || !orderId) {
    return next(new ErrorResponse('Please provide coupon code and order ID', 400));
  }

  // Find coupon
  const coupon = await Coupon.findOne({ 
    code: code.toUpperCase(),
    isActive: true,
    startDate: { $lte: new Date() },
    endDate: { $gte: new Date() }
  });

  if (!coupon) {
    return next(new ErrorResponse('Invalid or expired coupon code', 404));
  }

  // Find order
  const order = await Order.findById(orderId);

  if (!order) {
    return next(new ErrorResponse(`Order not found with id of ${orderId}`, 404));
  }

  // Make sure user owns order
  if (order.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse('Not authorized to update this order', 401)
    );
  }

  // Check if order already has a coupon
  if (order.coupon) {
    return next(new ErrorResponse('Order already has a coupon applied', 400));
  }

  // Validate coupon (reuse validation logic)
  const cartItems = order.items.map(item => ({
    product: item.product,
    price: item.price,
    quantity: item.quantity
  }));

  const validation = await validateCouponInternal(
    code,
    cartItems,
    order.subtotal,
    req.user
  );

  if (!validation.success) {
    return next(new ErrorResponse(validation.message, 400));
  }

  // Update order with coupon
  order.coupon = {
    code: coupon.code,
    type: coupon.type,
    amount: coupon.amount,
    discountAmount: validation.discountAmount
  };

  // Recalculate order total
  order.total = order.subtotal + order.tax + order.shippingCost - validation.discountAmount;

  // Save order
  await order.save();

  // Increment coupon usage count
  coupon.usageCount += 1;
  await coupon.save();

  res.status(200).json({
    success: true,
    data: order
  });
});

// Internal function to validate coupon
const validateCouponInternal = async (code, cartItems, cartTotal, user) => {
  try {
    // Find coupon
    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(),
      isActive: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() }
    })
      .populate('applicableProducts')
      .populate('applicableCategories')
      .populate('excludedProducts');

    if (!coupon) {
      return { success: false, message: 'Invalid or expired coupon code' };
    }

    // Check usage limit
    if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
      return { success: false, message: 'Coupon usage limit reached' };
    }

    // Check minimum purchase requirement
    if (cartTotal < coupon.minPurchase) {
      return { 
        success: false, 
        message: `Minimum purchase amount of $${coupon.minPurchase} required` 
      };
    }

    // Check user restrictions
    if (coupon.userRestriction !== 'none') {
      // Get user's order count
      const orderCount = await Order.countDocuments({ user: user.id });
      
      if (coupon.userRestriction === 'new' && orderCount > 0) {
        return { success: false, message: 'Coupon is only valid for new customers' };
      }
      
      if (coupon.userRestriction === 'existing' && orderCount === 0) {
        return { success: false, message: 'Coupon is only valid for existing customers' };
      }
    }

    // Check user group restrictions
    if (coupon.userGroups && coupon.userGroups.length > 0) {
      if (!coupon.userGroups.includes(user.role)) {
        return { success: false, message: 'Coupon is not valid for your user group' };
      }
    }

    // Check per-user limit
    if (coupon.perUserLimit !== null) {
      // Count how many times this user has used this coupon
      const userUsageCount = await Order.countDocuments({
        user: user.id,
        'coupon.code': coupon.code
      });
      
      if (userUsageCount >= coupon.perUserLimit) {
        return { 
          success: false, 
          message: 'You have reached the usage limit for this coupon' 
        };
      }
    }

    // Calculate discount
    let discountAmount = 0;
    let applicableAmount = 0;

    // If there are applicable products or categories, filter the cart items
    if (
      (coupon.applicableProducts && coupon.applicableProducts.length > 0) ||
      (coupon.applicableCategories && coupon.applicableCategories.length > 0)
    ) {
      // Get product details for cart items
      const productIds = cartItems.map(item => item.product);
      const products = await Product.find({ _id: { $in: productIds } })
        .populate('category');
      
      // Map products to cart items
      const cartItemsWithDetails = cartItems.map(item => {
        const product = products.find(p => p._id.toString() === item.product.toString());
        return {
          ...item,
          productDetails: product
        };
      });
      
      // Filter applicable items
      const applicableItems = cartItemsWithDetails.filter(item => {
        // Check if product is excluded
        if (
          coupon.excludedProducts &&
          coupon.excludedProducts.some(
            p => p._id.toString() === item.product.toString()
          )
        ) {
          return false;
        }
        
        // Check if product is directly applicable
        if (
          coupon.applicableProducts &&
          coupon.applicableProducts.length > 0 &&
          coupon.applicableProducts.some(
            p => p._id.toString() === item.product.toString()
          )
        ) {
          return true;
        }
        
        // Check if product's category is applicable
        if (
          coupon.applicableCategories &&
          coupon.applicableCategories.length > 0 &&
          item.productDetails &&
          item.productDetails.category &&
          coupon.applicableCategories.some(
            c => c._id.toString() === item.productDetails.category._id.toString()
          )
        ) {
          return true;
        }
        
        // If no specific products or categories are set, all products are applicable
        return coupon.applicableProducts.length === 0 && coupon.applicableCategories.length === 0;
      });
      
      // Calculate applicable amount
      applicableAmount = applicableItems.reduce(
        (sum, item) => sum + (item.price * item.quantity),
        0
      );
    } else {
      // All items are applicable
      applicableAmount = cartTotal;
    }

    // Calculate discount based on coupon type
    if (coupon.type === 'percentage') {
      discountAmount = (applicableAmount * coupon.amount) / 100;
    } else {
      // Fixed amount discount
      discountAmount = coupon.amount;
    }

    // Apply maximum discount limit if set
    if (coupon.maxDiscount !== null && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount;
    }

    // Ensure discount doesn't exceed the applicable amount
    if (discountAmount > applicableAmount) {
      discountAmount = applicableAmount;
    }

    return {
      success: true,
      discountAmount: parseFloat(discountAmount.toFixed(2)),
      coupon
    };
  } catch (error) {
    console.error('Error validating coupon:', error);
    return { success: false, message: 'Error validating coupon' };
  }
};
