import axiosInstance from './axiosConfig';

/**
 * Get admin dashboard statistics
 * @returns {Promise} - Response from API
 */
export const getAdminDashboardStats = async () => {
  try {
    const response = await axiosInstance.get('/admin/dashboard');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch dashboard statistics' };
  }
};

/**
 * Get all users (admin only)
 * @param {Object} params - Query parameters (page, limit, role, search)
 * @returns {Promise} - Response from API
 */
export const getUsers = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/admin/users', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch users' };
  }
};

/**
 * Get user details (admin only)
 * @param {string} userId - User ID
 * @returns {Promise} - Response from API
 */
export const getUserDetails = async (userId) => {
  try {
    const response = await axiosInstance.get(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch user details' };
  }
};

/**
 * Update user (admin only)
 * @param {string} userId - User ID
 * @param {Object} userData - Updated user data
 * @returns {Promise} - Response from API
 */
export const updateUser = async (userId, userData) => {
  try {
    const response = await axiosInstance.put(`/admin/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update user' };
  }
};

/**
 * Delete user (admin only)
 * @param {string} userId - User ID
 * @returns {Promise} - Response from API
 */
export const deleteUser = async (userId) => {
  try {
    const response = await axiosInstance.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete user' };
  }
};

/**
 * Get all products (admin only)
 * @param {Object} params - Query parameters (page, limit, status, search)
 * @returns {Promise} - Response from API
 */
export const getAdminProducts = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/admin/products', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch products' };
  }
};

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

/**
 * Get all orders (admin only)
 * @param {Object} params - Query parameters (page, limit, status, search)
 * @returns {Promise} - Response from API
 */
export const getAdminOrders = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/admin/orders', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch orders' };
  }
};

/**
 * Update order status (admin only)
 * @param {string} orderId - Order ID
 * @param {Object} statusData - Status update data
 * @returns {Promise} - Response from API
 */
export const updateAdminOrderStatus = async (orderId, statusData) => {
  try {
    const response = await axiosInstance.put(`/admin/orders/${orderId}/status`, statusData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update order status' };
  }
};

/**
 * Get all reviews (admin only)
 * @param {Object} params - Query parameters (page, limit, status)
 * @returns {Promise} - Response from API
 */
export const getAdminReviews = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/admin/reviews', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch reviews' };
  }
};

/**
 * Moderate review (admin only)
 * @param {string} reviewId - Review ID
 * @param {Object} moderationData - Moderation data (status, reason)
 * @returns {Promise} - Response from API
 */
export const moderateReview = async (reviewId, moderationData) => {
  try {
    const response = await axiosInstance.put(`/admin/reviews/${reviewId}/moderate`, moderationData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to moderate review' };
  }
};

/**
 * Get seller applications (admin only)
 * @param {Object} params - Query parameters (page, limit, status)
 * @returns {Promise} - Response from API
 */
export const getSellerApplications = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/admin/seller-applications', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch seller applications' };
  }
};

/**
 * Approve/reject seller application (admin only)
 * @param {string} userId - User ID
 * @param {Object} approvalData - Approval data (status, reason)
 * @returns {Promise} - Response from API
 */
export const approveSellerApplication = async (userId, approvalData) => {
  try {
    const response = await axiosInstance.put(`/admin/seller-applications/${userId}`, approvalData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to approve/reject seller application' };
  }
};

/**
 * Get all contacts/inquiries (admin only)
 * @param {Object} params - Query parameters (page, limit, status)
 * @returns {Promise} - Response from API
 */
export const getContacts = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/admin/contacts', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch contacts' };
  }
};

/**
 * Respond to contact/inquiry (admin only)
 * @param {string} contactId - Contact ID
 * @param {Object} responseData - Response data
 * @returns {Promise} - Response from API
 */
export const respondToContact = async (contactId, responseData) => {
  try {
    const response = await axiosInstance.put(`/admin/contacts/${contactId}/respond`, responseData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to respond to contact' };
  }
};

/**
 * Get admin analytics
 * @param {Object} params - Query parameters (period, startDate, endDate)
 * @returns {Promise} - Response from API
 */
export const getAdminAnalytics = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/admin/analytics', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch analytics' };
  }
};

/**
 * Get admin settings
 * @returns {Promise} - Response from API
 */
export const getAdminSettings = async () => {
  try {
    const response = await axiosInstance.get('/admin/settings');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch settings' };
  }
};

/**
 * Update admin settings
 * @param {Object} settingsData - Settings data
 * @returns {Promise} - Response from API
 */
export const updateAdminSettings = async (settingsData) => {
  try {
    const response = await axiosInstance.put('/admin/settings', settingsData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update settings' };
  }
};
