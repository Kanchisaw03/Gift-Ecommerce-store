const rateLimit = require('express-rate-limit');

/**
 * Rate limiter middleware factory
 * @param {Object} options - Rate limiting options
 * @param {number} options.windowMs - Time window in milliseconds
 * @param {number} options.max - Maximum number of requests in the time window
 * @param {string} options.message - Error message to send when limit is exceeded
 * @returns {Function} Express middleware function
 */
const rateLimiter = (options = {}) => {
  const defaultOptions = {
    windowMs: 15 * 60 * 1000, // 15 minutes by default
    max: 100, // 100 requests per windowMs by default
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  };

  const limiterOptions = { ...defaultOptions, ...options };
  
  return rateLimit(limiterOptions);
};

module.exports = rateLimiter;
