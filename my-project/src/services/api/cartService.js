import axiosInstance from './axiosConfig';

/**
 * Get cart items
 * @returns {Promise} - Response from API
 */
export const getCart = async () => {
  try {
    const response = await axiosInstance.get('/cart');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch cart' };
  }
};

/**
 * Add item to cart
 * @param {Object} cartItem - Cart item data (productId, quantity, etc.)
 * @returns {Promise} - Response from API
 */
export const addToCart = async (cartItem) => {
  try {
    const response = await axiosInstance.post('/cart', cartItem);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to add item to cart' };
  }
};

/**
 * Update cart item quantity
 * @param {string} itemId - Cart item ID
 * @param {Object} updateData - Update data (quantity)
 * @returns {Promise} - Response from API
 */
export const updateCartItem = async (itemId, updateData) => {
  try {
    const response = await axiosInstance.put(`/cart/${itemId}`, updateData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update cart item' };
  }
};

/**
 * Remove item from cart
 * @param {string} itemId - Cart item ID
 * @returns {Promise} - Response from API
 */
export const removeFromCart = async (itemId) => {
  try {
    const response = await axiosInstance.delete(`/cart/${itemId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to remove item from cart' };
  }
};

/**
 * Clear cart
 * @returns {Promise} - Response from API
 */
export const clearCart = async () => {
  try {
    const response = await axiosInstance.delete('/cart');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to clear cart' };
  }
};

/**
 * Apply coupon to cart
 * @param {Object} couponData - Coupon data (code)
 * @returns {Promise} - Response from API
 */
export const applyCoupon = async (couponData) => {
  try {
    const response = await axiosInstance.post('/cart/apply-coupon', couponData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to apply coupon' };
  }
};

/**
 * Remove coupon from cart
 * @returns {Promise} - Response from API
 */
export const removeCoupon = async () => {
  try {
    const response = await axiosInstance.delete('/cart/remove-coupon');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to remove coupon' };
  }
};

/**
 * Get shipping methods
 * @returns {Promise} - Response from API
 */
export const getShippingMethods = async () => {
  try {
    const response = await axiosInstance.get('/cart/shipping-methods');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch shipping methods' };
  }
};

/**
 * Set shipping method
 * @param {Object} shippingData - Shipping method data
 * @returns {Promise} - Response from API
 */
export const setShippingMethod = async (shippingData) => {
  try {
    const response = await axiosInstance.post('/cart/shipping-method', shippingData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to set shipping method' };
  }
};

/**
 * Calculate cart totals
 * @returns {Promise} - Response from API
 */
export const calculateCartTotals = async () => {
  try {
    const response = await axiosInstance.get('/cart/calculate');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to calculate cart totals' };
  }
};

/**
 * Sync local cart with server (for guest to logged-in transition)
 * @param {Array} cartItems - Local cart items
 * @returns {Promise} - Response from API
 */
export const syncCart = async (cartItems) => {
  try {
    const response = await axiosInstance.post('/cart/sync', { items: cartItems });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to sync cart' };
  }
};
