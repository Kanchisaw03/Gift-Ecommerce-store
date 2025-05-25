const mongoose = require('mongoose');
const Product = require('../models/product.model');
const User = require('../models/user.model');
const Category = require('../models/category.model');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const cloudinary = require('../utils/cloudinary');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
    .populate({
      path: 'seller',
      select: 'name avatar sellerInfo.businessName sellerInfo.rating'
    })
    .populate('category')
    .populate('subcategory')
    .populate({
      path: 'reviews',
      match: { status: 'approved' },
      populate: {
        path: 'user',
        select: 'name avatar'
      }
    });

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }

  // Increment view count for product
  product.views = (product.views || 0) + 1;
  await product.save();

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Seller, Admin)
exports.createProduct = asyncHandler(async (req, res, next) => {
  console.log('Creating product with data:', JSON.stringify(req.body, null, 2));
  
  // Validate required fields
  const requiredFields = ['name', 'description', 'price', 'category', 'stock'];
  const missingFields = requiredFields.filter(field => !req.body[field]);
  
  if (missingFields.length > 0) {
    return next(
      new ErrorResponse(
        `Missing required fields: ${missingFields.join(', ')}`,
        400
      )
    );
  }
  
  // Validate price and stock are numbers
  if (isNaN(parseFloat(req.body.price))) {
    return next(new ErrorResponse('Price must be a valid number', 400));
  }
  
  if (isNaN(parseInt(req.body.stock))) {
    return next(new ErrorResponse('Stock must be a valid number', 400));
  }
  
  // Validate category is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(req.body.category)) {
    return next(new ErrorResponse('Invalid category ID format', 400));
  }
  
  // Add user to req.body
  req.body.seller = req.user.id;

  // Check if user is seller or admin
  if (req.user.role !== 'seller' && req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return next(
      new ErrorResponse(
        `User with ID ${req.user.id} is not authorized to add a product`,
        403
      )
    );
  }

  // Handle image uploads
  const uploadedImages = [];
  if (req.files && req.files.images) {
    // Handle multipart form data uploads
    const files = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
    
    for (const file of files) {
      try {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: 'products',
          transformation: [
            { width: 1000, height: 1000, crop: 'limit' },
            { quality: 'auto:good' }
          ]
        });

        uploadedImages.push({
          public_id: result.public_id,
          url: result.secure_url
        });
      } catch (error) {
        console.error('Error uploading image to cloudinary:', error);
      }
    }
  } else if (req.body.images && req.body.images.length > 0) {
    // Handle base64 image uploads
    try {
      for (const image of req.body.images) {
        // Skip if not a base64 string
        if (!image || (typeof image === 'string' && !image.startsWith('data:'))) continue;
        
        const result = await cloudinary.uploader.upload(image, {
          folder: 'products',
          transformation: [
            { width: 1000, height: 1000, crop: 'limit' },
            { quality: 'auto:good' }
          ]
        });

        uploadedImages.push({
          public_id: result.public_id,
          url: result.secure_url
        });
      }
    } catch (error) {
      console.error('Error uploading base64 image to cloudinary:', error);
    }
  }

  // Add images to req.body or use placeholder if no images
  if (uploadedImages.length > 0) {
    req.body.images = uploadedImages;
  } else {
    // Add placeholder image if no images were uploaded
    req.body.images = [{
      public_id: 'products/placeholder',
      url: '/assets/images/product-placeholder.jpg'
    }];
  }

  try {
    // Create product
    const product = await Product.create(req.body);
    
    console.log(`Product created successfully with ID: ${product._id}`);

    // Emit Socket.IO event for real-time updates
    if (req.io) {
      console.log('Emitting productCreated event with data:', JSON.stringify(product, null, 2));
      req.io.emit('productCreated', product);
      console.log('Emitted productCreated event');
    } else {
      console.warn('Socket.IO instance not available in request object. Real-time updates will not work.');
    }

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return next(new ErrorResponse(messages.join(', '), 400));
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return next(new ErrorResponse(`Duplicate field value: ${field}`, 400));
    }
    
    return next(new ErrorResponse(`Failed to create product: ${error.message}`, 500));
  }
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Seller, Admin)
exports.updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is product owner or admin
  if (
    product.seller.toString() !== req.user.id &&
    req.user.role !== 'admin' &&
    req.user.role !== 'super_admin'
  ) {
    return next(
      new ErrorResponse(
        `User with ID ${req.user.id} is not authorized to update this product`,
        403
      )
    );
  }

  // Handle image uploads
  if (req.body.newImages && req.body.newImages.length > 0) {
    const uploadedImages = [...product.images];
    
    for (const image of req.body.newImages) {
      const result = await cloudinary.uploader.upload(image, {
        folder: 'products',
        transformation: [
          { width: 1000, height: 1000, crop: 'limit' },
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
    if (product.images && product.images.length > 0) {
      const remainingImages = product.images.filter(
        image => !req.body.deleteImages.includes(image.public_id)
      );
      
      req.body.images = remainingImages;
    }
    
    delete req.body.deleteImages;
  }

  // If seller updates, set status back to pending for admin approval
  if (req.user.role === 'seller') {
    req.body.status = 'pending';
  }

  // Update product
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  // Emit Socket.IO event for real-time updates
  if (req.io) {
    req.io.emit('productUpdated', product);
    console.log(`Emitted productUpdated event for product ID: ${product._id}`);
  }

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Seller, Admin)
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is product owner or admin
  if (
    product.seller.toString() !== req.user.id &&
    req.user.role !== 'admin' &&
    req.user.role !== 'super_admin'
  ) {
    return next(
      new ErrorResponse(
        `User with ID ${req.user.id} is not authorized to delete this product`,
        403
      )
    );
  }

  // Delete images from cloudinary
  if (product.images && product.images.length > 0) {
    for (const image of product.images) {
      await cloudinary.uploader.destroy(image.public_id);
    }
  }

  const productId = product._id;
  await product.remove();

  // Emit Socket.IO event for real-time updates
  if (req.io) {
    req.io.emit('productDeleted', productId);
    console.log(`Emitted productDeleted event for product ID: ${productId}`);
  }

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 8;

  const products = await Product.find({ featured: true, status: 'approved' })
    .limit(limit)
    .populate({
      path: 'seller',
      select: 'name sellerInfo.businessName'
    })
    .populate('category');

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

// @desc    Get top rated products
// @route   GET /api/products/top-rated
// @access  Public
exports.getTopRatedProducts = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 8;

  const products = await Product.find({ status: 'approved', rating: { $gte: 4 } })
    .sort({ rating: -1 })
    .limit(limit)
    .populate({
      path: 'seller',
      select: 'name sellerInfo.businessName'
    })
    .populate('category');

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

// @desc    Get new arrivals
// @route   GET /api/products/new-arrivals
// @access  Public
exports.getNewArrivals = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 8;

  const products = await Product.find({ status: 'approved' })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate({
      path: 'seller',
      select: 'name sellerInfo.businessName'
    })
    .populate('category');

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

// @desc    Get products by category
// @route   GET /api/products/category/:categoryId
// @access  Public
exports.getProductsByCategory = asyncHandler(async (req, res, next) => {
  const products = await Product.find({ 
    category: req.params.categoryId,
    status: 'approved'
  })
    .populate({
      path: 'seller',
      select: 'name sellerInfo.businessName'
    })
    .populate('category');

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
exports.getRelatedProducts = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }

  const limit = parseInt(req.query.limit) || 4;

  const products = await Product.find({
    _id: { $ne: req.params.id },
    category: product.category,
    status: 'approved'
  })
    .limit(limit)
    .populate({
      path: 'seller',
      select: 'name sellerInfo.businessName'
    })
    .populate('category');

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
exports.searchProducts = asyncHandler(async (req, res, next) => {
  const { query } = req.query;

  if (!query) {
    return next(new ErrorResponse('Please provide a search query', 400));
  }

  const products = await Product.find({
    $and: [
      { status: 'approved' },
      {
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } }
        ]
      }
    ]
  })
    .populate({
      path: 'seller',
      select: 'name sellerInfo.businessName'
    })
    .populate('category');

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

// @desc    Approve product (Admin only)
// @route   PUT /api/products/:id/approve
// @access  Private (Admin)
exports.approveProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is admin
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return next(
      new ErrorResponse(
        `User with ID ${req.user.id} is not authorized to approve products`,
        403
      )
    );
  }

  // Update product status
  product.status = 'approved';
  await product.save();

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc    Reject product (Admin only)
// @route   PUT /api/products/:id/reject
// @access  Private (Admin)
exports.rejectProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is admin
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return next(
      new ErrorResponse(
        `User with ID ${req.user.id} is not authorized to reject products`,
        403
      )
    );
  }

  // Update product status
  product.status = 'rejected';
  product.rejectionReason = req.body.reason || 'Product does not meet our guidelines';
  await product.save();

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc    Feature product (Admin only)
// @route   PUT /api/products/:id/feature
// @access  Private (Admin)
exports.featureProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is admin
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return next(
      new ErrorResponse(
        `User with ID ${req.user.id} is not authorized to feature products`,
        403
      )
    );
  }

  // Update product featured status
  product.featured = !product.featured;
  await product.save();

  res.status(200).json({
    success: true,
    data: product
  });
});
