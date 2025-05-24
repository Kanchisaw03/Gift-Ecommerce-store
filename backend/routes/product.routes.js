const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getTopRatedProducts,
  getNewArrivals,
  getProductsByCategory,
  getRelatedProducts,
  searchProducts,
  approveProduct,
  rejectProduct,
  featureProduct
} = require('../controllers/product.controller');

// Include review router
const reviewRouter = require('./review.routes');

const router = express.Router();

// Import middleware
const { protect, authorize, isApprovedSeller, optionalAuth } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const Product = require('../models/product.model');

// Re-route into other resource routers
router.use('/:productId/reviews', reviewRouter);

// Routes
router.route('/')
  .get(advancedResults(
    Product,
    [
      { path: 'seller', select: 'name sellerInfo.businessName' },
      { path: 'category', select: 'name' }
    ]
  ), getProducts)
  .post(protect, authorize('seller', 'admin', 'super_admin'), createProduct);

router.route('/featured')
  .get(getFeaturedProducts);

router.route('/top-rated')
  .get(getTopRatedProducts);

router.route('/new-arrivals')
  .get(getNewArrivals);

router.route('/category/:categoryId')
  .get(getProductsByCategory);

router.route('/search')
  .get(searchProducts);

router.route('/:id')
  .get(optionalAuth, getProduct)
  .put(protect, authorize('seller', 'admin', 'super_admin'), updateProduct)
  .delete(protect, authorize('seller', 'admin', 'super_admin'), deleteProduct);

router.route('/:id/related')
  .get(getRelatedProducts);

router.route('/:id/approve')
  .put(protect, authorize('admin', 'super_admin'), approveProduct);

router.route('/:id/reject')
  .put(protect, authorize('admin', 'super_admin'), rejectProduct);

router.route('/:id/feature')
  .put(protect, authorize('admin', 'super_admin'), featureProduct);

module.exports = router;
