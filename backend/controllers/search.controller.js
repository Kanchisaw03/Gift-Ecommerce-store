const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const SearchService = require('../services/search.service');

// @desc    Search products
// @route   GET /api/search
// @access  Public
exports.searchProducts = asyncHandler(async (req, res, next) => {
  const { 
    q, 
    category, 
    price_min, 
    price_max, 
    rating,
    seller,
    tags,
    sort = 'newest',
    page = 1,
    limit = 10,
    in_stock
  } = req.query;

  // Build filters object
  const filters = {};
  
  if (category) {
    filters.category = category;
  }
  
  if (price_min !== undefined || price_max !== undefined) {
    filters.price = {};
    
    if (price_min !== undefined) {
      filters.price.min = parseFloat(price_min);
    }
    
    if (price_max !== undefined) {
      filters.price.max = parseFloat(price_max);
    }
  }
  
  if (rating) {
    filters.rating = parseInt(rating);
  }
  
  if (seller) {
    filters.seller = seller;
  }
  
  if (tags) {
    filters.tags = Array.isArray(tags) ? tags : [tags];
  }
  
  if (in_stock === 'true') {
    filters.inStock = true;
  }

  // Track search query if user is logged in
  if (q && req.user) {
    await SearchService.trackSearchQuery(q, req.user.id);
  } else if (q) {
    await SearchService.trackSearchQuery(q);
  }

  // Perform search
  const results = await SearchService.searchProducts({
    query: q,
    filters,
    sort,
    page,
    limit
  });

  res.status(200).json({
    success: true,
    ...results
  });
});

// @desc    Get autocomplete suggestions
// @route   GET /api/search/autocomplete
// @access  Public
exports.getAutocomplete = asyncHandler(async (req, res, next) => {
  const { q, limit = 8 } = req.query;

  if (!q || q.trim() === '') {
    return res.status(200).json({
      success: true,
      query: '',
      results: []
    });
  }

  // Get autocomplete results
  const results = await SearchService.autocomplete(q, parseInt(limit));

  res.status(200).json({
    success: true,
    ...results
  });
});

// @desc    Get trending searches
// @route   GET /api/search/trending
// @access  Public
exports.getTrendingSearches = asyncHandler(async (req, res, next) => {
  // This would typically come from a database of tracked searches
  // For now, we'll return some static trending searches
  const trendingSearches = [
    'luxury watch',
    'diamond necklace',
    'leather wallet',
    'gold bracelet',
    'designer perfume'
  ];

  res.status(200).json({
    success: true,
    data: trendingSearches
  });
});

// @desc    Get search filters
// @route   GET /api/search/filters
// @access  Public
exports.getSearchFilters = asyncHandler(async (req, res, next) => {
  // Get search filters from search service
  const { filters } = await SearchService.searchProducts({
    query: '',
    page: 1,
    limit: 1
  });

  res.status(200).json({
    success: true,
    data: filters
  });
});
