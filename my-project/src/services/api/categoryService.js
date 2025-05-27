import axiosInstance, { axiosPublic } from './axiosConfig';

/**
 * Get all categories
 * @param {Object} params - Query parameters (page, limit)
 * @returns {Promise} - Response from API
 */
export const getCategories = async (params = {}) => {
  try {
    // Use axiosPublic for fetching categories since this is public data
    const response = await axiosPublic.get('/categories', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Improved error handling
    if (!error.response) {
      return { success: false, message: 'Network error. Please check your connection.' };
    }
    throw error.response?.data || { message: 'Failed to fetch categories' };
  }
};

/**
 * Get category by ID
 * @param {string} categoryId - Category ID
 * @returns {Promise} - Response from API
 */
export const getCategoryById = async (categoryId) => {
  try {
    // Use axiosPublic for fetching category details
    const response = await axiosPublic.get(`/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching category details:', error);
    // Improved error handling
    if (!error.response) {
      return { success: false, message: 'Network error. Please check your connection.' };
    }
    throw error.response?.data || { message: 'Failed to fetch category' };
  }
};

/**
 * Get category with products
 * @param {string} categoryId - Category ID
 * @param {Object} params - Query parameters (page, limit, sort)
 * @returns {Promise} - Response from API
 */
export const getCategoryWithProducts = async (categoryId, params = {}) => {
  try {
    // Use axiosPublic for fetching category products
    const response = await axiosPublic.get(`/categories/${categoryId}/products`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching category products:', error);
    // Improved error handling
    if (!error.response) {
      return { success: false, message: 'Network error. Please check your connection.' };
    }
    throw error.response?.data || { message: 'Failed to fetch category products' };
  }
};

/**
 * Create category (admin only)
 * @param {Object} categoryData - Category data
 * @returns {Promise} - Response from API
 */
export const createCategory = async (categoryData) => {
  try {
    const response = await axiosInstance.post('/categories', categoryData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create category' };
  }
};

/**
 * Update category (admin only)
 * @param {string} categoryId - Category ID
 * @param {Object} categoryData - Updated category data
 * @returns {Promise} - Response from API
 */
export const updateCategory = async (categoryId, categoryData) => {
  try {
    const response = await axiosInstance.put(`/categories/${categoryId}`, categoryData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update category' };
  }
};

/**
 * Delete category (admin only)
 * @param {string} categoryId - Category ID
 * @returns {Promise} - Response from API
 */
export const deleteCategory = async (categoryId) => {
  try {
    const response = await axiosInstance.delete(`/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete category' };
  }
};

/**
 * Upload category image (admin only)
 * @param {string} categoryId - Category ID
 * @param {FormData} formData - Form data with image file
 * @returns {Promise} - Response from API
 */
export const uploadCategoryImage = async (categoryId, formData) => {
  try {
    const response = await axiosInstance.post(`/categories/${categoryId}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to upload category image' };
  }
};

/**
 * Get featured categories
 * @param {number} limit - Number of categories to return
 * @returns {Promise} - Response from API
 */
export const getFeaturedCategories = async (limit = 6) => {
  try {
    const response = await axiosInstance.get('/categories/featured', { params: { limit } });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch featured categories' };
  }
};
