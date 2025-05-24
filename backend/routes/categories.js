const express = require('express');
const router = express.Router();

// Import controllers
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getSubcategories,
  getProductsByCategory
} = require('../controllers/category.controller');

// Import middleware
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.get('/:id/subcategories', getSubcategories);
router.get('/:id/products', getProductsByCategory);

// Protected routes - only admin and super_admin can modify categories
router.post('/', protect, authorize('admin', 'super_admin'), createCategory);
router.put('/:id', protect, authorize('admin', 'super_admin'), updateCategory);
router.delete('/:id', protect, authorize('admin', 'super_admin'), deleteCategory);

module.exports = router;