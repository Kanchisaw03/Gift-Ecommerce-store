import axiosInstance from './axiosConfig';

/**
 * Search products
 * @param {Object} params - Search parameters (query, page, limit, filters)
 * @returns {Promise} - Response from API
 */
export const searchProducts = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/search/products', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to search products' };
  }
};

/**
 * Get search suggestions
 * @param {string} query - Search query
 * @returns {Promise} - Response from API
 */
export const getSearchSuggestions = async (query) => {
  try {
    const response = await axiosInstance.get('/search/suggestions', { params: { query } });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get search suggestions' };
  }
};

/**
 * Get trending searches
 * @returns {Promise} - Response from API
 */
export const getTrendingSearches = async () => {
  try {
    const response = await axiosInstance.get('/search/trending');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get trending searches' };
  }
};

/**
 * Get search filters
 * @returns {Promise} - Response from API
 */
export const getSearchFilters = async () => {
  try {
    const response = await axiosInstance.get('/search/filters');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get search filters' };
  }
};

/**
 * Advanced search
 * @param {Object} searchData - Advanced search data
 * @returns {Promise} - Response from API
 */
export const advancedSearch = async (searchData) => {
  try {
    const response = await axiosInstance.post('/search/advanced', searchData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to perform advanced search' };
  }
};
