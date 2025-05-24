/**
 * Utility helper functions for the application
 */

/**
 * Debounce function to limit how often a function is called
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @param {boolean} immediate - Whether to invoke immediately
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait, immediate = false) => {
  let timeout;
  
  return function executedFunction(...args) {
    const context = this;
    
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    
    const callNow = immediate && !timeout;
    
    clearTimeout(timeout);
    
    timeout = setTimeout(later, wait);
    
    if (callNow) func.apply(context, args);
  };
};

/**
 * Format price with currency symbol
 * @param {number} price - Price to format
 * @param {string} currencyCode - Currency code (default: USD)
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
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} - Formatted date
 */
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  return new Intl.DateTimeFormat('en-US', mergedOptions).format(
    typeof date === 'string' ? new Date(date) : date
  );
};

/**
 * Truncate text to a specified length
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @param {string} suffix - Suffix to add when truncated
 * @returns {string} - Truncated text
 */
export const truncateText = (text, length = 100, suffix = '...') => {
  if (!text) return '';
  
  if (text.length <= length) {
    return text;
  }
  
  return text.substring(0, length).trim() + suffix;
};

/**
 * Generate a random ID
 * @param {number} length - ID length
 * @returns {string} - Random ID
 */
export const generateId = (length = 8) => {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
};

/**
 * Check if an object is empty
 * @param {Object} obj - Object to check
 * @returns {boolean} - Whether object is empty
 */
export const isEmpty = (obj) => {
  return (
    obj === null ||
    obj === undefined ||
    (typeof obj === 'object' && Object.keys(obj).length === 0) ||
    (typeof obj === 'string' && obj.trim().length === 0)
  );
};

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} - Cloned object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Get query parameters from URL
 * @param {string} url - URL to parse
 * @returns {Object} - Query parameters
 */
export const getQueryParams = (url = window.location.href) => {
  const params = {};
  const queryString = url.split('?')[1];
  
  if (!queryString) {
    return params;
  }
  
  const pairs = queryString.split('&');
  
  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    params[decodeURIComponent(key)] = decodeURIComponent(value || '');
  }
  
  return params;
};

/**
 * Create URL with query parameters
 * @param {string} baseUrl - Base URL
 * @param {Object} params - Query parameters
 * @returns {string} - URL with query parameters
 */
export const createUrlWithParams = (baseUrl, params = {}) => {
  const url = new URL(baseUrl, window.location.origin);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.append(key, value);
    }
  });
  
  return url.toString();
};

/**
 * Capitalize first letter of a string
 * @param {string} string - String to capitalize
 * @returns {string} - Capitalized string
 */
export const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

/**
 * Convert camelCase to Title Case
 * @param {string} camelCase - CamelCase string
 * @returns {string} - Title Case string
 */
export const camelCaseToTitleCase = (camelCase) => {
  if (!camelCase) return '';
  
  const result = camelCase
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
  
  return result;
};

/**
 * Scroll to top of page
 * @param {boolean} smooth - Whether to use smooth scrolling
 */
export const scrollToTop = (smooth = true) => {
  window.scrollTo({
    top: 0,
    behavior: smooth ? 'smooth' : 'auto'
  });
};

/**
 * Scroll to element
 * @param {string} elementId - Element ID
 * @param {boolean} smooth - Whether to use smooth scrolling
 * @param {number} offset - Offset from top
 */
export const scrollToElement = (elementId, smooth = true, offset = 0) => {
  const element = document.getElementById(elementId);
  
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: smooth ? 'smooth' : 'auto'
    });
  }
};
