import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { 
  getCategories, 
  getCategoryById, 
  createCategory, 
  updateCategory,
  deleteCategory
} from '../services/api/categoryService';
import { useAuth } from './useAuth';

/**
 * Custom hook for handling category operations
 * @param {Object} options - Hook options
 * @param {boolean} options.autoFetch - Whether to fetch categories automatically on mount
 * @returns {Object} - Category state and functions
 */
const useCategories = ({ autoFetch = true } = {}) => {
  const { isAuthenticated, user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all categories
   */
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getCategories();
      setCategories(response.data || response);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch categories';
      setError(errorMessage);
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch category by ID
   * @param {string} categoryId - Category ID
   * @returns {Object} - Category data
   */
  const fetchCategoryById = useCallback(async (categoryId) => {
    if (!categoryId) return null;

    setLoading(true);
    setError(null);

    try {
      const response = await getCategoryById(categoryId);
      const categoryData = response.data || response;
      setCurrentCategory(categoryData);
      return categoryData;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch category';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new category (admin only)
   * @param {Object} categoryData - Category data
   * @returns {Object} - Created category
   */
  const createNewCategory = useCallback(async (categoryData) => {
    // Check if user is admin or seller
    if (!isAuthenticated || !['admin', 'superadmin'].includes(user?.role)) {
      toast.error('Unauthorized: Only admins can create categories');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await createCategory(categoryData);
      const newCategory = response.data || response;
      
      // Add to categories list
      setCategories((prevCategories) => [...prevCategories, newCategory]);
      
      toast.success('Category created successfully');
      return newCategory;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create category';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  /**
   * Update category (admin only)
   * @param {string} categoryId - Category ID
   * @param {Object} categoryData - Updated category data
   * @returns {Object} - Updated category
   */
  const updateExistingCategory = useCallback(async (categoryId, categoryData) => {
    // Check if user is admin or seller
    if (!isAuthenticated || !['admin', 'superadmin'].includes(user?.role)) {
      toast.error('Unauthorized: Only admins can update categories');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await updateCategory(categoryId, categoryData);
      const updatedCategory = response.data || response;
      
      // Update categories list
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          (category._id || category.id) === categoryId ? updatedCategory : category
        )
      );
      
      // Update current category if it's the same
      if (currentCategory && (currentCategory._id || currentCategory.id) === categoryId) {
        setCurrentCategory(updatedCategory);
      }
      
      toast.success('Category updated successfully');
      return updatedCategory;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update category';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user, currentCategory]);

  /**
   * Delete category (admin only)
   * @param {string} categoryId - Category ID
   * @returns {boolean} - Whether deletion was successful
   */
  const deleteExistingCategory = useCallback(async (categoryId) => {
    // Check if user is admin or seller
    if (!isAuthenticated || !['admin', 'superadmin'].includes(user?.role)) {
      toast.error('Unauthorized: Only admins can delete categories');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      await deleteCategory(categoryId);
      
      // Remove from categories list
      setCategories((prevCategories) =>
        prevCategories.filter((category) => (category._id || category.id) !== categoryId)
      );
      
      // Reset current category if it's the same
      if (currentCategory && (currentCategory._id || currentCategory.id) === categoryId) {
        setCurrentCategory(null);
      }
      
      toast.success('Category deleted successfully');
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete category';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user, currentCategory]);

  // Fetch categories on mount if autoFetch is true
  useEffect(() => {
    if (autoFetch) {
      fetchCategories();
    }
  }, [autoFetch, fetchCategories]);

  return {
    categories,
    currentCategory,
    loading,
    error,
    fetchCategories,
    fetchCategoryById,
    createCategory: createNewCategory,
    updateCategory: updateExistingCategory,
    deleteCategory: deleteExistingCategory
  };
};

export default useCategories;
