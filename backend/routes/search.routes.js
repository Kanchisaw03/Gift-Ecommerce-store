const express = require('express');
const router = express.Router();

// Import controllers
const {
  searchProducts,
  getAutocomplete,
  getTrendingSearches,
  getSearchFilters
} = require('../controllers/search.controller');

// Import middleware
const { protect, authorize } = require('../middleware/auth');

// Routes
router.route('/')
  .get(searchProducts);

router.route('/autocomplete')
  .get(getAutocomplete);

router.route('/trending')
  .get(getTrendingSearches);

router.route('/filters')
  .get(getSearchFilters);

module.exports = router;
