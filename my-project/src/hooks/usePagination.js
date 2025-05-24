import { useState, useEffect, useCallback } from 'react';
import useApi from './useApi';

/**
 * Custom hook for handling pagination with API requests
 * @param {Function} apiFunction - API function to call for fetching data
 * @param {Object} options - Hook options
 * @param {number} options.initialPage - Initial page number
 * @param {number} options.initialLimit - Initial page size
 * @param {Object} options.initialParams - Initial API parameters
 * @param {boolean} options.autoFetch - Whether to fetch data automatically on mount
 * @returns {Object} - Hook state and functions
 */
const usePagination = (
  apiFunction,
  {
    initialPage = 1,
    initialLimit = 10,
    initialParams = {},
    autoFetch = true
  } = {}
) => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [params, setParams] = useState(initialParams);
  const [items, setItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Use the useApi hook for API calls
  const { loading, error, execute } = useApi(apiFunction, {
    showErrorToast: true
  });

  /**
   * Fetch data with current pagination state
   */
  const fetchData = useCallback(async () => {
    try {
      const response = await execute({
        page,
        limit,
        ...params
      });

      // Handle different API response formats
      if (response.data) {
        setItems(response.data);
        setTotalItems(response.total || 0);
        
        // Calculate total pages
        const total = response.total || 0;
        setTotalPages(Math.ceil(total / limit));
      } else if (Array.isArray(response)) {
        setItems(response);
        setTotalItems(response.length);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching paginated data:', error);
    }
  }, [execute, page, limit, params]);

  // Fetch data on mount if autoFetch is true
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  /**
   * Go to a specific page
   * @param {number} newPage - Page number to go to
   */
  const goToPage = useCallback(
    (newPage) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setPage(newPage);
      }
    },
    [totalPages]
  );

  /**
   * Go to the next page
   */
  const nextPage = useCallback(() => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [page, totalPages]);

  /**
   * Go to the previous page
   */
  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  }, [page]);

  /**
   * Change the page size
   * @param {number} newLimit - New page size
   */
  const changeLimit = useCallback((newLimit) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  }, []);

  /**
   * Update API parameters
   * @param {Object} newParams - New API parameters
   * @param {boolean} resetPage - Whether to reset to first page
   */
  const updateParams = useCallback((newParams, resetPage = true) => {
    setParams((prevParams) => ({
      ...prevParams,
      ...newParams
    }));
    
    if (resetPage) {
      setPage(1);
    }
  }, []);

  /**
   * Refresh data with current pagination state
   */
  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    // State
    items,
    page,
    limit,
    totalItems,
    totalPages,
    loading,
    error,
    params,
    
    // Actions
    goToPage,
    nextPage,
    prevPage,
    changeLimit,
    updateParams,
    refresh,
    fetchData
  };
};

export default usePagination;
