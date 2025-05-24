/**
 * Utility functions for API error handling and response formatting
 */

/**
 * Format error response for consistent error handling
 * @param {Error} error - Error object from API call
 * @returns {Object} - Formatted error object
 */
export const formatError = (error) => {
  // Default error message
  let errorMessage = 'An unexpected error occurred. Please try again.';
  let statusCode = 500;
  let errors = [];

  // Check if it's an axios error with response data
  if (error.response) {
    statusCode = error.response.status;
    
    // Extract error message from response
    if (error.response.data) {
      if (error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.response.data.error) {
        errorMessage = error.response.data.error;
      }
      
      // Extract validation errors if available
      if (error.response.data.errors) {
        errors = error.response.data.errors;
      }
    }
    
    // Handle specific status codes
    switch (statusCode) {
      case 400:
        if (!errorMessage || errorMessage === 'Bad Request') {
          errorMessage = 'Invalid request. Please check your input.';
        }
        break;
      case 401:
        errorMessage = 'Authentication required. Please log in.';
        break;
      case 403:
        errorMessage = 'You do not have permission to perform this action.';
        break;
      case 404:
        errorMessage = 'The requested resource was not found.';
        break;
      case 422:
        errorMessage = 'Validation failed. Please check your input.';
        break;
      case 429:
        errorMessage = 'Too many requests. Please try again later.';
        break;
      default:
        // Keep default error message
    }
  } else if (error.request) {
    // The request was made but no response was received
    errorMessage = 'No response from server. Please check your internet connection.';
    statusCode = 0;
  } else if (error.message) {
    // Something happened in setting up the request
    errorMessage = error.message;
  }

  return {
    message: errorMessage,
    statusCode,
    errors,
    originalError: error
  };
};

/**
 * Format success response for consistent handling
 * @param {Object} response - Response from API call
 * @returns {Object} - Formatted success object
 */
export const formatSuccess = (response) => {
  // Default success message
  let successMessage = 'Operation completed successfully.';
  let data = null;
  
  // Extract success message and data from response
  if (response.data) {
    if (response.data.message) {
      successMessage = response.data.message;
    }
    data = response.data.data || response.data;
  } else {
    data = response;
  }
  
  return {
    message: successMessage,
    data,
    originalResponse: response
  };
};

/**
 * Handle API errors and optionally show toast notification
 * @param {Error} error - Error object from API call
 * @param {Function} [toastFn] - Toast function to show error message
 * @returns {Object} - Formatted error object
 */
export const handleApiError = (error, toastFn) => {
  const formattedError = formatError(error);
  
  if (toastFn) {
    toastFn(formattedError.message);
  }
  
  // Log error to console in development
  if (process.env.NODE_ENV !== 'production') {
    console.error('API Error:', formattedError);
  }
  
  return formattedError;
};

/**
 * Create URL with query parameters
 * @param {string} baseUrl - Base URL
 * @param {Object} params - Query parameters
 * @returns {string} - URL with query parameters
 */
export const createUrlWithParams = (baseUrl, params = {}) => {
  const url = new URL(baseUrl);
  
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
      url.searchParams.append(key, params[key]);
    }
  });
  
  return url.toString();
};

/**
 * Format price with currency symbol
 * @param {number} price - Price to format
 * @param {string} [currencyCode='USD'] - Currency code
 * @returns {string} - Formatted price
 */
export const formatPrice = (price, currencyCode = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2
  }).format(price);
};

/**
 * Format date
 * @param {string|Date} date - Date to format
 * @param {Object} [options] - Intl.DateTimeFormat options
 * @returns {string} - Formatted date
 */
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(new Date(date));
};
