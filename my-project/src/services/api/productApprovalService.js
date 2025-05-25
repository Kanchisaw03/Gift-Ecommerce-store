import axiosInstance from './axiosConfig';

/**
 * Get pending products awaiting approval (admin only)
 * @param {Object} params - Query parameters (page, limit)
 * @returns {Promise} - Response from API
 */
export const getPendingProducts = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/admin/products/pending', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch pending products' };
  }
};

/**
 * Approve product (admin only)
 * @param {string} productId - Product ID
 * @returns {Promise} - Response from API
 */
export const approveProduct = async (productId) => {
  try {
    const response = await axiosInstance.put(`/admin/products/${productId}/approve`, { status: 'approved' });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to approve product' };
  }
};

/**
 * Reject product (admin only)
 * @param {string} productId - Product ID
 * @param {Object} rejectionData - Rejection data (reason)
 * @returns {Promise} - Response from API
 */
export const rejectProduct = async (productId, rejectionData) => {
  try {
    const response = await axiosInstance.put(`/admin/products/${productId}/reject`, rejectionData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to reject product' };
  }
};
