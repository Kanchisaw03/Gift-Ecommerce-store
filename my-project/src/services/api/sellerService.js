import axiosInstance from './axiosConfig';

/**
 * Get seller dashboard statistics
 * @returns {Promise} - Response from API
 */
export const getSellerDashboardStats = async () => {
  try {
    const response = await axiosInstance.get('/seller/dashboard');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch dashboard statistics' };
  }
};

/**
 * Get seller products
 * @param {Object} params - Query parameters (page, limit, status)
 * @returns {Promise} - Response from API
 */
export const getSellerProducts = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/seller/products', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch seller products' };
  }
};

/**
 * Get seller orders
 * @param {Object} params - Query parameters (page, limit, status)
 * @returns {Promise} - Response from API
 */
export const getSellerOrders = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/seller/orders', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch seller orders' };
  }
};

/**
 * Update seller profile
 * @param {Object} profileData - Profile data
 * @returns {Promise} - Response from API
 */
export const updateSellerProfile = async (profileData) => {
  try {
    const response = await axiosInstance.put('/seller/profile', profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update seller profile' };
  }
};

/**
 * Get seller analytics
 * @param {Object} params - Query parameters (period: 'week', 'month', 'year')
 * @returns {Promise} - Response from API
 */
export const getSellerAnalytics = async (params = { period: 'month' }) => {
  try {
    const response = await axiosInstance.get('/seller/analytics', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch seller analytics' };
  }
};

/**
 * Get seller earnings
 * @returns {Promise} - Response from API
 */
export const getSellerEarnings = async () => {
  try {
    const response = await axiosInstance.get('/seller/earnings');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch seller earnings' };
  }
};

/**
 * Update order status (seller only)
 * @param {string} orderId - Order ID
 * @param {Object} statusData - Status update data
 * @returns {Promise} - Response from API
 */
export const updateOrderStatus = async (orderId, statusData) => {
  try {
    const response = await axiosInstance.put(`/seller/orders/${orderId}/status`, statusData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update order status' };
  }
};

/**
 * Get seller reviews
 * @param {Object} params - Query parameters (page, limit)
 * @returns {Promise} - Response from API
 */
export const getSellerReviews = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/seller/reviews', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch seller reviews' };
  }
};

/**
 * Respond to a review
 * @param {string} reviewId - Review ID
 * @param {Object} responseData - Response data
 * @returns {Promise} - Response from API
 */
export const respondToReview = async (reviewId, responseData) => {
  try {
    const response = await axiosInstance.post(`/seller/reviews/${reviewId}/respond`, responseData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to respond to review' };
  }
};

/**
 * Get seller inventory status
 * @returns {Promise} - Response from API
 */
export const getInventoryStatus = async () => {
  try {
    const response = await axiosInstance.get('/seller/inventory');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch inventory status' };
  }
};

/**
 * Update product inventory
 * @param {string} productId - Product ID
 * @param {Object} inventoryData - Inventory update data
 * @returns {Promise} - Response from API
 */
export const updateProductInventory = async (productId, inventoryData) => {
  try {
    const response = await axiosInstance.put(`/seller/products/${productId}/inventory`, inventoryData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update product inventory' };
  }
};
