import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { formatError } from '../utils/apiUtils';

/**
 * Custom hook for handling API requests with loading and error states
 * @param {Function} apiFunction - API function to call
 * @param {Object} options - Hook options
 * @param {boolean} options.showSuccessToast - Whether to show success toast
 * @param {boolean} options.showErrorToast - Whether to show error toast
 * @param {string} options.successMessage - Success message to show
 * @returns {Object} - Hook state and functions
 */
const useApi = (
  apiFunction,
  {
    showSuccessToast = false,
    showErrorToast = true,
    successMessage = 'Operation successful'
  } = {}
) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Execute API request
   * @param {...any} args - Arguments to pass to API function
   * @returns {Promise<any>} - Promise with API response data
   */
  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiFunction(...args);
        setData(response.data || response);
        
        if (showSuccessToast) {
          toast.success(
            response.message || 
            (response.data && response.data.message) || 
            successMessage
          );
        }
        
        return response.data || response;
      } catch (err) {
        const formattedError = formatError(err);
        setError(formattedError);
        
        if (showErrorToast) {
          toast.error(formattedError.message);
        }
        
        throw formattedError;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, showSuccessToast, showErrorToast, successMessage]
  );

  /**
   * Reset hook state
   */
  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset
  };
};

export default useApi;
