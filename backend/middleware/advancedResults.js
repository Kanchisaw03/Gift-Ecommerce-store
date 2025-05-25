const advancedResults = (model, populate) => async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit', 'search'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource - parse query string once
  const parsedQuery = JSON.parse(queryStr);
  
  // Initial query
  let queryObj = parsedQuery;

  // Handle search more efficiently
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, 'i');
    
    // Determine searchable fields based on model - use a map for faster lookup
    const modelSearchFields = {
      'Product': ['name', 'description', 'tags'],
      'User': ['name', 'email'],
      'Category': ['name', 'description'],
      'Order': ['orderNumber'],
      'Review': ['title', 'content'],
      'AuditLog': ['description', 'action', 'resourceType']
    };
    
    // Get search fields or use default
    const searchFields = modelSearchFields[model.modelName] || ['name'];
    
    // Create search query with OR conditions for each field
    const searchQuery = searchFields.map(field => ({
      [field]: searchRegex
    }));
    
    // Add search query to main query
    queryObj = {
      $and: [
        parsedQuery,
        { $or: searchQuery }
      ]
    };
  }
  
  // Start building the query
  query = model.find(queryObj);
  
  // Use lean() for better performance when we don't need Mongoose documents
  if (model.modelName === 'Product' && !req.query.populate) {
    query = query.lean();
  }

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination - more efficient
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  
  // Apply pagination
  query = query.skip(startIndex).limit(limit);
  
  // Only count documents if pagination is actually being used
  // This avoids unnecessary count operations for simple queries
  let total = 0;
  if (req.query.page || req.query.limit) {
    // Use estimatedDocumentCount for better performance when no filters
    if (Object.keys(parsedQuery).length === 0 && !req.query.search) {
      total = await model.estimatedDocumentCount();
    } else {
      // Use countDocuments with the same query for consistency
      total = await model.countDocuments(queryObj);
    }
  }

  // Populate
  if (populate) {
    if (Array.isArray(populate)) {
      populate.forEach(pop => {
        query = query.populate(pop);
      });
    } else {
      query = query.populate(populate);
    }
  }

  // Executing query
  const results = await query;

  // Pagination result - only calculate if we have pagination
  const pagination = {};
  const endIndex = page * limit;

  if (total > 0) {
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    pagination.totalPages = Math.ceil(total / limit);
    pagination.currentPage = page;
  }

  // Construct response object
  res.advancedResults = {
    success: true,
    count: results.length,
    pagination: Object.keys(pagination).length > 0 ? pagination : undefined,
    total: total || results.length,
    data: results
  };

  next();
};

module.exports = advancedResults;
