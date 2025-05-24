import axiosInstance from './axiosConfig';

/**
 * Validate coupon
 * @param {Object} couponData - Coupon data (code)
 * @returns {Promise} - Response from API
 */
export const validateCoupon = async (couponData) => {
  try {
    const response = await axiosInstance.post('/coupons/validate', couponData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to validate coupon' };
  }
};

/**
 * Get all coupons (admin only)
 * @param {Object} params - Query parameters (page, limit, status)
 * @returns {Promise} - Response from API
 */
export const getAllCoupons = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/coupons', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch coupons' };
  }
};

/**
 * Get coupon by ID (admin only)
 * @param {string} couponId - Coupon ID
 * @returns {Promise} - Response from API
 */
export const getCouponById = async (couponId) => {
  try {
    const response = await axiosInstance.get(`/coupons/${couponId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch coupon details' };
  }
};

/**
 * Create coupon (admin only)
 * @param {Object} couponData - Coupon data
 * @returns {Promise} - Response from API
 */
export const createCoupon = async (couponData) => {
  try {
    const response = await axiosInstance.post('/coupons', couponData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create coupon' };
  }
};

/**
 * Update coupon (admin only)
 * @param {string} couponId - Coupon ID
 * @param {Object} couponData - Updated coupon data
 * @returns {Promise} - Response from API
 */
export const updateCoupon = async (couponId, couponData) => {
  try {
    const response = await axiosInstance.put(`/coupons/${couponId}`, couponData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update coupon' };
  }
};

/**
 * Delete coupon (admin only)
 * @param {string} couponId - Coupon ID
 * @returns {Promise} - Response from API
 */
export const deleteCoupon = async (couponId) => {
  try {
    const response = await axiosInstance.delete(`/coupons/${couponId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete coupon' };
  }
};

/**
 * Get active coupons for user
 * @returns {Promise} - Response from API
 */
export const getUserCoupons = async () => {
  try {
    const response = await axiosInstance.get('/coupons/user');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch user coupons' };
  }
};

/**
 * Get coupon usage statistics (admin only)
 * @param {string} couponId - Coupon ID
 * @returns {Promise} - Response from API
 */
export const getCouponUsageStats = async (couponId) => {
  try {
    const response = await axiosInstance.get(`/coupons/${couponId}/stats`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch coupon usage statistics' };
  }
};
