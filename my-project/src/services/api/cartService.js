import axiosInstance, { axiosPublic } from './axiosConfig';

/**
 * Get cart items
 * @returns {Promise} - Response from API
 */
export const getCart = async () => {
  try {
    const response = await axiosInstance.get('/cart');
    return response.data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    
    // Improved error handling
    if (!error.response) {
      return { success: false, message: 'Network error. Please check your connection.' };
    }
    
    // Return a structured error response
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to fetch cart',
      status: error.response?.status
    };
  }
};

/**
 * Add item to cart
 * @param {Object} cartItem - Cart item data (productId, quantity, etc.)
 * @returns {Promise} - Response from API
 */
export const addToCart = async (cartItem) => {
  try {
    // Validate input
    if (!cartItem || !cartItem.productId) {
      return { success: false, message: 'Invalid product information' };
    }
    
    const response = await axiosInstance.post('/cart', cartItem);
    return response.data;
  } catch (error) {
    console.error('Error adding item to cart:', error);
    
    // Improved error handling
    if (!error.response) {
      return { success: false, message: 'Network error. Please check your connection.' };
    }
    
    // Return a structured error response
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to add item to cart',
      status: error.response?.status
    };
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
    // Validate input
    if (!itemId) {
      return { success: false, message: 'Invalid item ID' };
    }
    
    if (!updateData || typeof updateData.quantity !== 'number' || updateData.quantity < 1) {
      return { success: false, message: 'Invalid quantity. Must be a positive number.' };
    }
    
    const response = await axiosInstance.put(`/cart/${itemId}`, updateData);
    return response.data;
  } catch (error) {
    console.error('Error updating cart item:', error);
    
    // Improved error handling
    if (!error.response) {
      return { success: false, message: 'Network error. Please check your connection.' };
    }
    
    // Return a structured error response
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to update cart item',
      status: error.response?.status
    };
  }
};

/**
 * Remove item from cart
 * @param {string} itemId - Cart item ID
 * @returns {Promise} - Response from API
 */
export const removeFromCart = async (itemId) => {
  try {
    // Validate input
    if (!itemId) {
      return { success: false, message: 'Invalid item ID' };
    }
    
    const response = await axiosInstance.delete(`/cart/${itemId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing item from cart:', error);
    
    // Improved error handling
    if (!error.response) {
      return { success: false, message: 'Network error. Please check your connection.' };
    }
    
    // Return a structured error response
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to remove item from cart',
      status: error.response?.status
    };
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
    console.error('Error clearing cart:', error);
    
    // Improved error handling
    if (!error.response) {
      return { success: false, message: 'Network error. Please check your connection.' };
    }
    
    // Return a structured error response
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to clear cart',
      status: error.response?.status
    };
  }
};

/**
 * Apply coupon to cart
 * @param {Object} couponData - Coupon data (code)
 * @returns {Promise} - Response from API
 */
export const applyCoupon = async (couponData) => {
  try {
    // Validate input
    if (!couponData || !couponData.code) {
      return { success: false, message: 'Invalid coupon code' };
    }
    
    const response = await axiosInstance.post('/cart/apply-coupon', couponData);
    return response.data;
  } catch (error) {
    console.error('Error applying coupon:', error);
    
    // Improved error handling
    if (!error.response) {
      return { success: false, message: 'Network error. Please check your connection.' };
    }
    
    // Special handling for common coupon errors
    if (error.response?.status === 400) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Invalid coupon code',
        status: 400
      };
    }
    
    if (error.response?.status === 404) {
      return { 
        success: false, 
        message: 'Coupon not found',
        status: 404
      };
    }
    
    // Return a structured error response
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to apply coupon',
      status: error.response?.status
    };
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
    console.error('Error removing coupon:', error);
    
    // Improved error handling
    if (!error.response) {
      return { success: false, message: 'Network error. Please check your connection.' };
    }
    
    // Return a structured error response
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to remove coupon',
      status: error.response?.status
    };
  }
};

/**
 * Get shipping methods
 * @returns {Promise} - Response from API
 */
export const getShippingMethods = async () => {
  try {
    // Use axiosPublic since this is public information that doesn't require authentication
    const response = await axiosPublic.get('/cart/shipping-methods');
    return response.data;
  } catch (error) {
    console.error('Error fetching shipping methods:', error);
    
    // Improved error handling
    if (!error.response) {
      return { success: false, message: 'Network error. Please check your connection.' };
    }
    
    // Return a structured error response
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to fetch shipping methods',
      status: error.response?.status
    };
  }
};

/**
 * Set shipping method
 * @param {Object} shippingData - Shipping method data
 * @returns {Promise} - Response from API
 */
export const setShippingMethod = async (shippingData) => {
  try {
    // Validate input
    if (!shippingData || !shippingData.methodId) {
      return { success: false, message: 'Invalid shipping method data' };
    }
    
    const response = await axiosInstance.post('/cart/shipping-method', shippingData);
    return response.data;
  } catch (error) {
    console.error('Error setting shipping method:', error);
    
    // Improved error handling
    if (!error.response) {
      return { success: false, message: 'Network error. Please check your connection.' };
    }
    
    // Special handling for common shipping method errors
    if (error.response?.status === 400) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Invalid shipping method',
        status: 400
      };
    }
    
    if (error.response?.status === 404) {
      return { 
        success: false, 
        message: 'Shipping method not found',
        status: 404
      };
    }
    
    // Return a structured error response
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to set shipping method',
      status: error.response?.status
    };
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
    console.error('Error calculating cart totals:', error);
    
    // Improved error handling
    if (!error.response) {
      return { success: false, message: 'Network error. Please check your connection.' };
    }
    
    // Return a structured error response
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to calculate cart totals',
      status: error.response?.status
    };
  }
};

/**
 * Sync local cart with server (for guest to logged-in transition)
 * @param {Array} cartItems - Local cart items
 * @returns {Promise} - Response from API
 */
export const syncCart = async (cartItems) => {
  try {
    // Validate input
    if (!Array.isArray(cartItems)) {
      return { 
        success: false, 
        message: 'Invalid cart items format. Expected an array.' 
      };
    }
    
    // If cart is empty, return success immediately
    if (cartItems.length === 0) {
      return { 
        success: true, 
        message: 'Cart is empty, nothing to sync.', 
        data: { items: [] } 
      };
    }
    
    const response = await axiosInstance.post('/cart/sync', { items: cartItems });
    return response.data;
  } catch (error) {
    console.error('Error syncing cart:', error);
    
    // Improved error handling
    if (!error.response) {
      return { 
        success: false, 
        message: 'Network error. Please check your connection.',
        // Return the original cart items so the UI can still display them
        data: { items: cartItems }
      };
    }
    
    // Special handling for authentication errors
    if (error.response?.status === 401) {
      return { 
        success: false, 
        message: 'You must be logged in to sync your cart.',
        status: 401,
        // Return the original cart items so the UI can still display them
        data: { items: cartItems }
      };
    }
    
    // Return a structured error response
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to sync cart',
      status: error.response?.status,
      // Return the original cart items so the UI can still display them
      data: { items: cartItems }
    };
  }
};
