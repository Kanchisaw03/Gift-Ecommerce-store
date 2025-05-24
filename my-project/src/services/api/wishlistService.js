import axiosInstance from './axiosConfig';

/**
 * Get user wishlist
 * @param {Object} params - Query parameters (page, limit)
 * @returns {Promise} - Response from API
 */
export const getWishlist = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/wishlist', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch wishlist' };
  }
};

/**
 * Add product to wishlist
 * @param {Object} wishlistItem - Wishlist item data (productId)
 * @returns {Promise} - Response from API
 */
export const addToWishlist = async (wishlistItem) => {
  try {
    const response = await axiosInstance.post('/wishlist', wishlistItem);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to add item to wishlist' };
  }
};

/**
 * Remove product from wishlist
 * @param {string} productId - Product ID
 * @returns {Promise} - Response from API
 */
export const removeFromWishlist = async (productId) => {
  try {
    const response = await axiosInstance.delete(`/wishlist/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to remove item from wishlist' };
  }
};

/**
 * Check if product is in wishlist
 * @param {string} productId - Product ID
 * @returns {Promise} - Response from API
 */
export const checkWishlistItem = async (productId) => {
  try {
    const response = await axiosInstance.get(`/wishlist/check/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to check wishlist item' };
  }
};

/**
 * Clear wishlist
 * @returns {Promise} - Response from API
 */
export const clearWishlist = async () => {
  try {
    const response = await axiosInstance.delete('/wishlist');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to clear wishlist' };
  }
};

/**
 * Move wishlist item to cart
 * @param {string} productId - Product ID
 * @param {Object} cartData - Cart data (quantity)
 * @returns {Promise} - Response from API
 */
export const moveToCart = async (productId, cartData) => {
  try {
    const response = await axiosInstance.post(`/wishlist/${productId}/move-to-cart`, cartData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to move item to cart' };
  }
};
