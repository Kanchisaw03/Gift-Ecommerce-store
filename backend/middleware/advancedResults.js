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

  // Finding resource
  query = model.find(JSON.parse(queryStr));

  // Handle search
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, 'i');
    
    // Determine searchable fields based on model
    let searchFields = [];
    
    switch (model.modelName) {
      case 'Product':
        searchFields = ['name', 'description', 'tags'];
        break;
      case 'User':
        searchFields = ['name', 'email'];
        break;
      case 'Category':
        searchFields = ['name', 'description'];
        break;
      case 'Order':
        searchFields = ['orderNumber'];
        break;
      case 'Review':
        searchFields = ['title', 'content'];
        break;
      case 'AuditLog':
        searchFields = ['description', 'action', 'resourceType'];
        break;
      default:
        searchFields = ['name']; // Default search field
    }
    
    // Create search query with OR conditions for each field
    const searchQuery = searchFields.map(field => ({
      [field]: searchRegex
    }));
    
    // Add search query to main query
    query = model.find({
      $and: [
        JSON.parse(queryStr),
        { $or: searchQuery }
      ]
    });
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

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

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

  // Pagination result
  const pagination = {};

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

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    total,
    data: results
  };

  next();
};

module.exports = advancedResults;
