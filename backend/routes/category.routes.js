const express = require('express');
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryTree,
  getFeaturedCategories,
  toggleFeatured
} = require('../controllers/category.controller');

const router = express.Router();

// Import middleware
const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const Category = require('../models/category.model');

// Routes
router.route('/')
  .get(advancedResults(Category, 'subcategories'), getCategories)
  .post(protect, authorize('admin', 'super_admin'), createCategory);

router.route('/tree')
  .get(getCategoryTree);

router.route('/featured')
  .get(getFeaturedCategories);

router.route('/:id')
  .get(getCategory)
  .put(protect, authorize('admin', 'super_admin'), updateCategory)
  .delete(protect, authorize('admin', 'super_admin'), deleteCategory);

router.route('/:id/toggle-featured')
  .put(protect, authorize('admin', 'super_admin'), toggleFeatured);

module.exports = router;
