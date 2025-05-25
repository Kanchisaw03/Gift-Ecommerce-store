import axiosInstance from './axiosConfig';

/**
 * Get user profile
 * @param {string} userId - User ID (optional, defaults to current user)
 * @returns {Promise} - Response from API
 */
export const getUserProfile = async (userId = 'me') => {
  try {
    // If userId is 'me', use the auth/me endpoint instead of users/me
    if (userId === 'me') {
      const response = await axiosInstance.get('/auth/me');
      return response.data;
    } else {
      // For specific user IDs, use the users/:id endpoint
      const response = await axiosInstance.get(`/users/${userId}`);
      return response.data;
    }
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    throw error.response?.data || { message: 'Failed to get user profile' };
  }
};

/**
 * Update user profile
 * @param {Object} userData - User profile data to update
 * @returns {Promise} - Response from API
 */
export const updateUserProfile = async (userData) => {
  try {
    const response = await axiosInstance.put('/users/profile', userData);
    
    // Update stored user data if available
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const updatedUser = { ...JSON.parse(storedUser), ...response.data.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update profile' };
  }
};

/**
 * Upload user avatar
 * @param {FormData} formData - Form data with image file
 * @returns {Promise} - Response from API
 */
export const uploadAvatar = async (formData) => {
  try {
    const response = await axiosInstance.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    // Update stored user data if available
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const updatedUser = { 
        ...JSON.parse(storedUser), 
        avatar: response.data.data.avatar 
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to upload avatar' };
  }
};

/**
 * Get user addresses
 * @returns {Promise} - Response from API
 */
export const getUserAddresses = async () => {
  try {
    const response = await axiosInstance.get('/addresses');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get addresses' };
  }
};

/**
 * Add new address
 * @param {Object} addressData - Address data
 * @returns {Promise} - Response from API
 */
export const addAddress = async (addressData) => {
  try {
    const response = await axiosInstance.post('/addresses', addressData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to add address' };
  }
};

/**
 * Update address
 * @param {string} addressId - Address ID
 * @param {Object} addressData - Updated address data
 * @returns {Promise} - Response from API
 */
export const updateAddress = async (addressId, addressData) => {
  try {
    const response = await axiosInstance.put(`/addresses/${addressId}`, addressData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update address' };
  }
};

/**
 * Delete address
 * @param {string} addressId - Address ID
 * @returns {Promise} - Response from API
 */
export const deleteAddress = async (addressId) => {
  try {
    const response = await axiosInstance.delete(`/addresses/${addressId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete address' };
  }
};

/**
 * Set default shipping address
 * @param {string} addressId - Address ID
 * @returns {Promise} - Response from API
 */
export const setDefaultShippingAddress = async (addressId) => {
  try {
    const response = await axiosInstance.put(`/addresses/${addressId}/default-shipping`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to set default shipping address' };
  }
};

/**
 * Set default billing address
 * @param {string} addressId - Address ID
 * @returns {Promise} - Response from API
 */
export const setDefaultBillingAddress = async (addressId) => {
  try {
    const response = await axiosInstance.put(`/addresses/${addressId}/default-billing`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to set default billing address' };
  }
};

/**
 * Get user notifications
 * @param {Object} params - Query parameters (page, limit)
 * @returns {Promise} - Response from API
 */
export const getUserNotifications = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/notifications', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get notifications' };
  }
};

/**
 * Mark notification as read
 * @param {string} notificationId - Notification ID
 * @returns {Promise} - Response from API
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await axiosInstance.put(`/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to mark notification as read' };
  }
};

/**
 * Mark all notifications as read
 * @returns {Promise} - Response from API
 */
export const markAllNotificationsAsRead = async () => {
  try {
    const response = await axiosInstance.put('/notifications/read-all');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to mark all notifications as read' };
  }
};

/**
 * Delete user
 * @param {string} userId - User ID to delete
 * @returns {Promise} - Response from API
 */
export const deleteUser = async (userId) => {
  try {
    const response = await axiosInstance.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete user' };
  }
};

/**
 * Update user status (active/inactive)
 * @param {string} userId - User ID
 * @param {Object} statusData - Status data (isActive: boolean)
 * @returns {Promise} - Response from API
 */
export const updateUserStatus = async (userId, statusData) => {
  try {
    const response = await axiosInstance.put(`/users/${userId}/status`, statusData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update user status' };
  }
};

/**
 * Get all users (admin only)
 * @param {Object} params - Query parameters (page, limit, role, search)
 * @returns {Promise} - Response from API
 */
export const getAllUsers = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/users', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch users' };
  }
};
