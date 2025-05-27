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
 * @param {string|Object} productId - Product ID or object containing productId
 * @returns {Promise} - Response from API
 */
export const addToWishlist = async (productId) => {
  try {
    // Extract the actual product ID
    const actualProductId = typeof productId === 'object' ? productId.productId : productId;
    
    if (!actualProductId) {
      return { success: false, message: 'Invalid product ID' };
    }
    
    // Send request with productId in the URL path as expected by the backend
    const response = await axiosInstance.post(`/wishlist/${actualProductId}`);
    return response.data;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    
    // Handle network errors gracefully
    if (!error.response) {
      return { success: false, message: 'Network error. Please check your connection.' };
    }
    
    // Handle specific error codes
    if (error.response?.status === 404) {
      return { success: false, message: 'Product not found' };
    }
    
    if (error.response?.status === 400) {
      return { success: false, message: error.response.data?.message || 'Product is not available' };
    }
    
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to add item to wishlist',
      status: error.response?.status
    };
  }
};

/**
 * Remove product from wishlist
 * @param {string} productId - Product ID
 * @returns {Promise} - Response from API
 */
export const removeFromWishlist = async (productId) => {
  try {
    if (!productId) {
      return { success: false, message: 'Invalid product ID' };
    }
    
    const response = await axiosInstance.delete(`/wishlist/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    
    // Handle network errors gracefully
    if (!error.response) {
      return { success: false, message: 'Network error. Please check your connection.' };
    }
    
    // Handle specific error codes
    if (error.response?.status === 404) {
      return { success: false, message: 'Product not found in wishlist' };
    }
    
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to remove item from wishlist',
      status: error.response?.status
    };
  }
};

/**
 * Check if product is in wishlist
 * @param {string} productId - Product ID
 * @returns {Promise} - Response from API
 */
export const checkWishlistItem = async (productId) => {
  try {
    if (!productId) {
      return { success: false, message: 'Invalid product ID' };
    }
    
    const response = await axiosInstance.get(`/wishlist/check/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error checking wishlist item:', error);
    
    // Handle network errors gracefully
    if (!error.response) {
      return { success: false, message: 'Network error. Please check your connection.' };
    }
    
    // Handle specific error codes
    if (error.response?.status === 404) {
      // If endpoint doesn't exist, return a default response
      return { success: true, inWishlist: false };
    }
    
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to check wishlist item',
      status: error.response?.status
    };
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
    console.error('Error clearing wishlist:', error);
    
    // Handle network errors gracefully
    if (!error.response) {
      return { success: false, message: 'Network error. Please check your connection.' };
    }
    
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to clear wishlist',
      status: error.response?.status
    };
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
    // Validate productId is not null, undefined, or empty string
    if (!productId) {
      console.error('moveToCart called with invalid productId:', productId);
      return { success: false, message: 'Invalid product ID' };
    }
    
    // Convert productId to string if it's an object with _id property
    const actualProductId = typeof productId === 'object' && productId._id ? productId._id : productId;
    
    // Log the productId being used
    console.log('Moving to cart with productId:', actualProductId);
    
    // Ensure cartData has valid quantity
    const validCartData = {
      quantity: (cartData && typeof cartData.quantity === 'number' && cartData.quantity > 0) 
        ? cartData.quantity 
        : 1
    };
    
    console.log(`Calling API: POST /wishlist/${actualProductId}/move-to-cart with data:`, validCartData);
    const response = await axiosInstance.post(`/wishlist/${actualProductId}/move-to-cart`, validCartData);
    
    console.log('Move to cart response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error moving item to cart:', error);
    
    // Handle network errors gracefully
    if (!error.response) {
      return { success: false, message: 'Network error. Please check your connection.' };
    }
    
    // Handle specific error codes
    if (error.response?.status === 404) {
      return { success: false, message: 'Product not found in wishlist' };
    }
    
    if (error.response?.status === 400) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Product is not available or out of stock',
        status: 400
      };
    }
    
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to move item to cart',
      status: error.response?.status
    };
  }
};
