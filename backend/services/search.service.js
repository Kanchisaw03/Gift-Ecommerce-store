const Product = require('../models/product.model');
const Category = require('../models/category.model');
const User = require('../models/user.model');

/**
 * Search Service
 * This service provides advanced search functionality for products
 */
class SearchService {
  /**
   * Search products with advanced filtering and sorting
   * @param {Object} options - Search options
   * @param {string} options.query - Search query
   * @param {Object} options.filters - Filters to apply
   * @param {Object} options.sort - Sort options
   * @param {number} options.page - Page number
   * @param {number} options.limit - Items per page
   * @returns {Promise<Object>} Search results
   */
  static async searchProducts({
    query = '',
    filters = {},
    sort = { createdAt: -1 },
    page = 1,
    limit = 10
  }) {
    try {
      // Build search query
      const searchQuery = {
        status: 'approved',
        stock: { $gt: 0 }
      };

      // Add text search if query provided
      if (query && query.trim() !== '') {
        // Create text index if it doesn't exist
        const collection = Product.collection;
        const indexes = await collection.indexes();
        const hasTextIndex = indexes.some(index => index.name === 'text_search_index');
        
        if (!hasTextIndex) {
          await collection.createIndex({
            name: 'text',
            description: 'text',
            tags: 'text'
          }, { name: 'text_search_index' });
        }
        
        searchQuery.$text = { $search: query };
      }

      // Apply category filter
      if (filters.category) {
        // Get category and all its subcategories
        const categoryIds = await this.getCategoryAndSubcategories(filters.category);
        searchQuery.category = { $in: categoryIds };
      }

      // Apply price filter
      if (filters.price) {
        if (filters.price.min !== undefined) {
          searchQuery.price = { ...searchQuery.price, $gte: filters.price.min };
        }
        
        if (filters.price.max !== undefined) {
          searchQuery.price = { ...searchQuery.price, $lte: filters.price.max };
        }
      }

      // Apply rating filter
      if (filters.rating) {
        searchQuery.rating = { $gte: filters.rating };
      }

      // Apply seller filter
      if (filters.seller) {
        searchQuery.seller = filters.seller;
      }

      // Apply tag filter
      if (filters.tags && filters.tags.length > 0) {
        searchQuery.tags = { $in: filters.tags };
      }

      // Apply availability filter
      if (filters.inStock === true) {
        searchQuery.stock = { $gt: 0 };
      }

      // Calculate pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Build sort object
      let sortObj = {};
      
      if (typeof sort === 'object') {
        sortObj = sort;
      } else {
        switch (sort) {
          case 'price_asc':
            sortObj = { price: 1 };
            break;
          case 'price_desc':
            sortObj = { price: -1 };
            break;
          case 'newest':
            sortObj = { createdAt: -1 };
            break;
          case 'rating':
            sortObj = { rating: -1 };
            break;
          case 'popularity':
            sortObj = { views: -1 };
            break;
          default:
            sortObj = { createdAt: -1 };
        }
      }

      // If using text search, add text score to sort
      if (query && query.trim() !== '') {
        sortObj.score = { $meta: 'textScore' };
      }

      // Execute query
      const products = await Product.find(searchQuery)
        .select(query && query.trim() !== '' ? { score: { $meta: 'textScore' } } : '')
        .populate('category', 'name')
        .populate('seller', 'name sellerInfo.businessName')
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit));

      // Get total count
      const total = await Product.countDocuments(searchQuery);

      // Get price range for filter
      const priceStats = await Product.aggregate([
        { $match: { status: 'approved' } },
        {
          $group: {
            _id: null,
            min: { $min: '$price' },
            max: { $max: '$price' }
          }
        }
      ]);

      // Get top categories
      const topCategories = await Product.aggregate([
        { $match: { status: 'approved' } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: 'categories',
            localField: '_id',
            foreignField: '_id',
            as: 'categoryDetails'
          }
        },
        { $unwind: '$categoryDetails' },
        {
          $project: {
            _id: 1,
            name: '$categoryDetails.name',
            count: 1
          }
        }
      ]);

      // Get top sellers
      const topSellers = await Product.aggregate([
        { $match: { status: 'approved' } },
        { $group: { _id: '$seller', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'sellerDetails'
          }
        },
        { $unwind: '$sellerDetails' },
        {
          $project: {
            _id: 1,
            name: '$sellerDetails.name',
            businessName: '$sellerDetails.sellerInfo.businessName',
            count: 1
          }
        }
      ]);

      // Get all tags
      const tags = await Product.aggregate([
        { $match: { status: 'approved' } },
        { $unwind: '$tags' },
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 20 },
        {
          $project: {
            _id: 0,
            tag: '$_id',
            count: 1
          }
        }
      ]);

      return {
        products,
        total,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit))
        },
        filters: {
          priceRange: priceStats.length > 0 ? {
            min: priceStats[0].min,
            max: priceStats[0].max
          } : { min: 0, max: 1000 },
          categories: topCategories,
          sellers: topSellers,
          tags: tags.map(t => t.tag)
        }
      };
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }

  /**
   * Get a category and all its subcategories
   * @param {string} categoryId - Category ID
   * @returns {Promise<Array>} Array of category IDs
   */
  static async getCategoryAndSubcategories(categoryId) {
    try {
      const categoryIds = [categoryId];
      
      // Get all categories
      const categories = await Category.find();
      
      // Build category tree
      const categoryMap = {};
      categories.forEach(category => {
        categoryMap[category._id.toString()] = category;
      });
      
      // Function to get subcategories recursively
      const getSubcategories = (parentId) => {
        const subcategories = categories.filter(
          c => c.parent && c.parent.toString() === parentId.toString()
        );
        
        subcategories.forEach(subcategory => {
          categoryIds.push(subcategory._id);
          getSubcategories(subcategory._id);
        });
      };
      
      // Get all subcategories
      getSubcategories(categoryId);
      
      return categoryIds;
    } catch (error) {
      console.error('Error getting category and subcategories:', error);
      throw error;
    }
  }

  /**
   * Search for products by autocomplete
   * @param {string} query - Search query
   * @param {number} limit - Maximum number of results
   * @returns {Promise<Array>} Autocomplete results
   */
  static async autocompleteProducts(query, limit = 5) {
    try {
      if (!query || query.trim() === '') {
        return [];
      }

      // Create text index if it doesn't exist
      const collection = Product.collection;
      const indexes = await collection.indexes();
      const hasTextIndex = indexes.some(index => index.name === 'text_search_index');
      
      if (!hasTextIndex) {
        await collection.createIndex({
          name: 'text',
          description: 'text',
          tags: 'text'
        }, { name: 'text_search_index' });
      }

      // Search for products
      const products = await Product.find({
        $text: { $search: query },
        status: 'approved',
        stock: { $gt: 0 }
      })
        .select('name images price')
        .sort({ score: { $meta: 'textScore' } })
        .limit(parseInt(limit));

      return products.map(product => ({
        id: product._id,
        name: product.name,
        image: product.images.length > 0 ? product.images[0].url : null,
        price: product.price,
        type: 'product'
      }));
    } catch (error) {
      console.error('Error autocompleting products:', error);
      throw error;
    }
  }

  /**
   * Search for categories by autocomplete
   * @param {string} query - Search query
   * @param {number} limit - Maximum number of results
   * @returns {Promise<Array>} Autocomplete results
   */
  static async autocompleteCategories(query, limit = 3) {
    try {
      if (!query || query.trim() === '') {
        return [];
      }

      // Search for categories
      const categories = await Category.find({
        name: { $regex: query, $options: 'i' }
      })
        .select('name image')
        .limit(parseInt(limit));

      return categories.map(category => ({
        id: category._id,
        name: category.name,
        image: category.image ? category.image.url : null,
        type: 'category'
      }));
    } catch (error) {
      console.error('Error autocompleting categories:', error);
      throw error;
    }
  }

  /**
   * Get combined autocomplete results
   * @param {string} query - Search query
   * @param {number} limit - Maximum number of results
   * @returns {Promise<Object>} Autocomplete results
   */
  static async autocomplete(query, limit = 8) {
    try {
      // Get product and category results
      const [products, categories] = await Promise.all([
        this.autocompleteProducts(query, Math.ceil(limit * 0.7)), // 70% of results are products
        this.autocompleteCategories(query, Math.floor(limit * 0.3)) // 30% of results are categories
      ]);

      // Combine and sort results
      const results = [...products, ...categories];
      
      return {
        query,
        results
      };
    } catch (error) {
      console.error('Error getting autocomplete results:', error);
      throw error;
    }
  }

  /**
   * Track search query
   * @param {string} query - Search query
   * @param {string} userId - User ID (optional)
   * @returns {Promise<void>}
   */
  static async trackSearchQuery(query, userId = null) {
    try {
      // This could be implemented with a SearchLog model
      // For now, we'll just log the query
      console.log(`Search query: ${query}, User: ${userId || 'Anonymous'}`);
    } catch (error) {
      console.error('Error tracking search query:', error);
      // Don't throw error, just log it
    }
  }
}

module.exports = SearchService;
