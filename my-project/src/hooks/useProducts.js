import { useState, useEffect, useCallback } from 'react';
import { 
  getProducts, 
  getFeaturedProducts, 
  getNewArrivals, 
  getBestSellingProducts,
  getProductById
} from '../services/api/productService';
import { toast } from 'react-toastify';

/**
 * Custom hook for handling product data
 * @param {Object} options - Hook options
 * @param {string} options.type - Product fetch type (all, featured, new, bestselling)
 * @param {Object} options.params - Query parameters
 * @param {boolean} options.autoFetch - Whether to fetch data automatically on mount
 * @returns {Object} - Hook state and functions
 */
const useProducts = ({
  type = 'all',
  params = {},
  autoFetch = true
} = {}) => {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });

  /**
   * Fetch products based on type
   * @param {Object} queryParams - Query parameters
   * @returns {Promise} - Promise with products data
   */
  const fetchProducts = useCallback(async (queryParams = {}) => {
    setLoading(true);
    setError(null);

    try {
      let response;
      const mergedParams = { ...params, ...queryParams };

      switch (type) {
        case 'featured':
          response = await getFeaturedProducts(mergedParams.limit || 6);
          break;
        case 'new':
          response = await getNewArrivals(mergedParams.limit || 8);
          break;
        case 'bestselling':
          response = await getBestSellingProducts(mergedParams.limit || 8);
          break;
        case 'all':
        default:
          response = await getProducts(mergedParams);
          break;
      }

      // Handle different API response formats
      if (response.data) {
        setProducts(response.data);
        
        // Set pagination if available
        if (response.pagination) {
          setPagination({
            page: response.pagination.page || 1,
            limit: response.pagination.limit || 12,
            total: response.total || 0,
            totalPages: response.pagination.totalPages || 1
          });
        }
      } else if (Array.isArray(response)) {
        setProducts(response);
      }

      return response.data || response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch products';
      setError(errorMessage);
      toast.error(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, [type, params]);

  /**
   * Fetch single product by ID
   * @param {string} productId - Product ID
   * @returns {Promise} - Promise with product data
   */
  const fetchProductById = useCallback(async (productId) => {
    if (!productId) return null;

    setLoading(true);
    setError(null);

    try {
      const response = await getProductById(productId);
      const productData = response.data || response;
      setProduct(productData);
      return productData;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch product';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Change page
   * @param {number} page - Page number
   */
  const changePage = useCallback((page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchProducts({ page });
    }
  }, [fetchProducts, pagination.totalPages]);

  // Fetch products on mount if autoFetch is true
  useEffect(() => {
    if (autoFetch) {
      fetchProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFetch]);

  return {
    products,
    product,
    loading,
    error,
    pagination,
    fetchProducts,
    fetchProductById,
    changePage
  };
};

export default useProducts;
