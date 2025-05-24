const Category = require('../models/category.model');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const cloudinary = require('../utils/cloudinary');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
exports.getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id)
    .populate('subcategories')
    .populate('parent');

  if (!category) {
    return next(
      new ErrorResponse(`Category not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: category
  });
});

// @desc    Create new category
// @route   POST /api/categories
// @access  Private (Admin)
exports.createCategory = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.createdBy = req.user.id;
  req.body.updatedBy = req.user.id;

  // Check if user is admin
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return next(
      new ErrorResponse(
        `User with ID ${req.user.id} is not authorized to create categories`,
        403
      )
    );
  }

  // Handle image upload
  if (req.body.image) {
    const result = await cloudinary.uploader.upload(req.body.image, {
      folder: 'categories',
      transformation: [
        { width: 500, height: 500, crop: 'limit' },
        { quality: 'auto:good' }
      ]
    });

    req.body.image = {
      public_id: result.public_id,
      url: result.secure_url
    };
  }

  // Set level based on parent
  if (req.body.parent) {
    const parentCategory = await Category.findById(req.body.parent);
    if (parentCategory) {
      req.body.level = parentCategory.level + 1;
    }
  }

  // Create category
  const category = await Category.create(req.body);

  res.status(201).json({
    success: true,
    data: category
  });
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (Admin)
exports.updateCategory = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.updatedBy = req.user.id;

  let category = await Category.findById(req.params.id);

  if (!category) {
    return next(
      new ErrorResponse(`Category not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if user is admin
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return next(
      new ErrorResponse(
        `User with ID ${req.user.id} is not authorized to update categories`,
        403
      )
    );
  }

  // Handle image upload
  if (req.body.image && req.body.image !== category.image?.url) {
    // Delete old image if exists
    if (category.image && category.image.public_id) {
      await cloudinary.uploader.destroy(category.image.public_id);
    }

    // Upload new image
    const result = await cloudinary.uploader.upload(req.body.image, {
      folder: 'categories',
      transformation: [
        { width: 500, height: 500, crop: 'limit' },
        { quality: 'auto:good' }
      ]
    });

    req.body.image = {
      public_id: result.public_id,
      url: result.secure_url
    };
  }

  // Update level if parent changed
  if (req.body.parent && req.body.parent !== category.parent?.toString()) {
    const parentCategory = await Category.findById(req.body.parent);
    if (parentCategory) {
      req.body.level = parentCategory.level + 1;
    }
  }

  // Update category
  category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: category
  });
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Admin)
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(
      new ErrorResponse(`Category not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if user is admin
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return next(
      new ErrorResponse(
        `User with ID ${req.user.id} is not authorized to delete categories`,
        403
      )
    );
  }

  // Check if category has subcategories
  const subcategories = await Category.find({ parent: req.params.id });
  if (subcategories.length > 0) {
    return next(
      new ErrorResponse(
        `Cannot delete category with subcategories. Please delete or reassign subcategories first.`,
        400
      )
    );
  }

  // Check if category has products
  const products = await require('../models/product.model').find({ category: req.params.id });
  if (products.length > 0) {
    return next(
      new ErrorResponse(
        `Cannot delete category with products. Please delete or reassign products first.`,
        400
      )
    );
  }

  // Delete image from cloudinary if exists
  if (category.image && category.image.public_id) {
    await cloudinary.uploader.destroy(category.image.public_id);
  }

  await category.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get category tree
// @route   GET /api/categories/tree
// @access  Public
exports.getCategoryTree = asyncHandler(async (req, res, next) => {
  // Get all categories
  const categories = await Category.find({ isActive: true }).sort('order');

  // Build tree structure
  const categoryMap = {};
  const rootCategories = [];

  // First pass: create map of categories
  categories.forEach(category => {
    categoryMap[category._id] = {
      _id: category._id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      icon: category.icon,
      featured: category.featured,
      level: category.level,
      order: category.order,
      children: []
    };
  });

  // Second pass: build tree structure
  categories.forEach(category => {
    if (category.parent) {
      // Has parent, add to parent's children
      if (categoryMap[category.parent]) {
        categoryMap[category.parent].children.push(categoryMap[category._id]);
      }
    } else {
      // No parent, add to root categories
      rootCategories.push(categoryMap[category._id]);
    }
  });

  // Sort root categories by order
  rootCategories.sort((a, b) => a.order - b.order);

  // Sort children by order
  const sortChildren = (categories) => {
    categories.forEach(category => {
      category.children.sort((a, b) => a.order - b.order);
      if (category.children.length > 0) {
        sortChildren(category.children);
      }
    });
  };

  sortChildren(rootCategories);

  res.status(200).json({
    success: true,
    data: rootCategories
  });
});

// @desc    Get featured categories
// @route   GET /api/categories/featured
// @access  Public
exports.getFeaturedCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({
    featured: true,
    isActive: true
  }).sort('order');

  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories
  });
});

// @desc    Toggle category featured status
// @route   PUT /api/categories/:id/toggle-featured
// @access  Private (Admin)
exports.toggleFeatured = asyncHandler(async (req, res, next) => {
  let category = await Category.findById(req.params.id);

  if (!category) {
    return next(
      new ErrorResponse(`Category not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if user is admin
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return next(
      new ErrorResponse(
        `User with ID ${req.user.id} is not authorized to update categories`,
        403
      )
    );
  }

  // Toggle featured status
  category.featured = !category.featured;
  category.updatedBy = req.user.id;

  await category.save();

  res.status(200).json({
    success: true,
    data: category
  });
});
