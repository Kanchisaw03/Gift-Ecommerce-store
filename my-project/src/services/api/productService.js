import axiosInstance, { axiosPublic } from './axiosConfig';

/**
 * Get all products with pagination and filters
 * @param {Object} params - Query parameters (page, limit, category, price, etc.)
 * @returns {Promise} - Response from API
 */
export const getProducts = async (params = {}) => {
  try {
    // Use axiosPublic for fetching products since this doesn't require authentication
    const response = await axiosPublic.get('/products', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    // Improved error handling
    if (!error.response) {
      return { success: false, message: 'Network error. Please check your connection.' };
    }
    throw error.response?.data || { message: 'Failed to fetch products' };
  }
};

/**
 * Get a single product by ID
 * @param {string} productId - Product ID
 * @returns {Promise} - Response from API
 */
export const getProductById = async (productId) => {
  try {
    // Use axiosPublic for fetching product details since this doesn't require authentication
    const response = await axiosPublic.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product details:', error);
    // Improved error handling
    if (!error.response) {
      return { success: false, message: 'Network error. Please check your connection.' };
    }
    throw error.response?.data || { message: 'Failed to fetch product' };
  }
};

/**
 * Get featured products
 * @param {number} limit - Number of products to return
 * @returns {Promise} - Response from API
 */
export const getFeaturedProducts = async (limit = 6) => {
  try {
    // Use axiosPublic for fetching featured products
    const response = await axiosPublic.get('/products/featured', { params: { limit } });
    return response.data;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    // Improved error handling
    if (!error.response) {
      return { success: false, message: 'Network error. Please check your connection.' };
    }
    throw error.response?.data || { message: 'Failed to fetch featured products' };
  }
};

/**
 * Get new arrivals
 * @param {number} limit - Number of products to return
 * @returns {Promise} - Response from API
 */
export const getNewArrivals = async (limit = 8) => {
  try {
    // Use axiosPublic for fetching new arrivals
    const response = await axiosPublic.get('/products/new-arrivals', { params: { limit } });
    return response.data;
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    // Improved error handling
    if (!error.response) {
      return { success: false, message: 'Network error. Please check your connection.' };
    }
    throw error.response?.data || { message: 'Failed to fetch new arrivals' };
  }
};

/**
 * Get best selling products
 * @param {number} limit - Number of products to return
 * @returns {Promise} - Response from API
 */
export const getBestSellingProducts = async (limit = 8) => {
  try {
    // Use axiosPublic for fetching best selling products
    const response = await axiosPublic.get('/products/best-selling', { params: { limit } });
    return response.data;
  } catch (error) {
    console.error('Error fetching best selling products:', error);
    // Improved error handling
    if (!error.response) {
      return { success: false, message: 'Network error. Please check your connection.' };
    }
    throw error.response?.data || { message: 'Failed to fetch best selling products' };
  }
};

/**
 * Get related products
 * @param {string} productId - Product ID
 * @param {number} limit - Number of products to return
 * @returns {Promise} - Response from API
 */
export const getRelatedProducts = async (productId, limit = 4) => {
  try {
    // Use axiosPublic for fetching related products
    const response = await axiosPublic.get(`/products/${productId}/related`, { params: { limit } });
    return response.data;
  } catch (error) {
    console.error('Error fetching related products:', error);
    // Improved error handling
    if (!error.response) {
      return { success: false, message: 'Network error. Please check your connection.' };
    }
    throw error.response?.data || { message: 'Failed to fetch related products' };
  }
};

/**
 * Create a new product (seller only)
 * @param {Object} productData - Product data
 * @returns {Promise} - Response from API
 */
export const createProduct = async (productData) => {
  try {
    // Log form data entries for debugging
    if (productData instanceof FormData) {
      console.log('Creating product with FormData:');
      for (let [key, value] of productData.entries()) {
        // Don't log the full image data, just indicate it's there
        if (key === 'images' && value instanceof File) {
          console.log(`${key}: [File] ${value.name} (${value.type}, ${value.size} bytes)`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }
    } else {
      console.log('Creating product with data:', productData);
    }
    
    // Set the correct headers for FormData
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };
    
    const response = await axiosInstance.post('/products', productData, config);
    console.log('Product creation response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    console.error('Error response:', error.response?.data);
    throw error.response?.data || { message: 'Failed to create product' };
  }
};

/**
 * Update a product (seller only)
 * @param {string} productId - Product ID
 * @param {Object} productData - Updated product data
 * @returns {Promise} - Response from API
 */
/**
 * Get all categories
 * @returns {Promise} - Response from API
 */
export const getCategories = async () => {
  try {
    console.log('Fetching categories from backend');
    const response = await axiosPublic.get('/categories');
    console.log('Categories response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Improved error handling
    if (!error.response) {
      return { success: false, message: 'Network error. Please check your connection.' };
    }
    
    // For debugging purposes
    if (error.response) {
      console.error('Error response status:', error.response.status);
      console.error('Error response data:', error.response.data);
    }
    
    throw error.response?.data || { message: 'Failed to fetch categories' };
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    const response = await axiosInstance.put(`/products/${productId}`, productData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update product' };
  }
};

/**
 * Delete a product (seller only)
 * @param {string} productId - Product ID
 * @returns {Promise} - Response from API
 */
export const deleteProduct = async (productId) => {
  try {
    const response = await axiosInstance.delete(`/products/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete product' };
  }
};

/**
 * Upload product images
 * @param {string} productId - Product ID
 * @param {FormData} formData - Form data with image files
 * @returns {Promise} - Response from API
 */
export const uploadProductImages = async (productId, formData) => {
  try {
    const response = await axiosInstance.post(`/products/${productId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to upload product images' };
  }
};

/**
 * Delete product image
 * @param {string} productId - Product ID
 * @param {string} imageId - Image ID
 * @returns {Promise} - Response from API
 */
export const deleteProductImage = async (productId, imageId) => {
  try {
    const response = await axiosInstance.delete(`/products/${productId}/images/${imageId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete product image' };
  }
};

/**
 * Get product reviews
 * @param {string} productId - Product ID
 * @param {Object} params - Query parameters (page, limit)
 * @returns {Promise} - Response from API
 */
export const getProductReviews = async (productId, params = {}) => {
  try {
    const response = await axiosInstance.get(`/products/${productId}/reviews`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch product reviews' };
  }
};

/**
 * Add product review
 * @param {string} productId - Product ID
 * @param {Object} reviewData - Review data
 * @returns {Promise} - Response from API
 */
export const addProductReview = async (productId, reviewData) => {
  try {
    const response = await axiosInstance.post(`/products/${productId}/reviews`, reviewData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to add product review' };
  }
};

/**
 * Update product review
 * @param {string} reviewId - Review ID
 * @param {Object} reviewData - Updated review data
 * @returns {Promise} - Response from API
 */
export const updateProductReview = async (reviewId, reviewData) => {
  try {
    const response = await axiosInstance.put(`/reviews/${reviewId}`, reviewData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update product review' };
  }
};

/**
 * Delete product review
 * @param {string} reviewId - Review ID
 * @returns {Promise} - Response from API
 */
export const deleteProductReview = async (reviewId) => {
  try {
    const response = await axiosInstance.delete(`/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete product review' };
  }
};
