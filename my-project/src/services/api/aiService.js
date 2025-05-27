import axiosInstance from './axiosConfig';

/**
 * Send a message to the AI chatbot
 * @param {string} message - User's message
 * @param {Array} chatHistory - Previous chat messages for context
 * @param {string} userId - User ID if logged in
 * @param {string} userRole - User role if logged in
 * @returns {Promise} - Response from API
 */
export const sendChatMessage = async (message, chatHistory = [], userId = null, userRole = 'guest') => {
  try {
    const response = await axiosInstance.post('/ai/chat', {
      message,
      chatHistory,
      userId,
      userRole
    });
    return response.data;
  } catch (error) {
    console.error('Error sending message to AI:', error);
    throw error.response?.data || { message: 'Failed to communicate with AI assistant' };
  }
};

/**
 * Get product suggestions based on criteria
 * @param {Object} criteria - Criteria for product suggestions
 * @param {string} criteria.occasion - Occasion (e.g., "birthday", "anniversary")
 * @param {string} criteria.gender - Gender (e.g., "male", "female", "neutral")
 * @param {string} criteria.ageRange - Age range (e.g., "18-25", "26-40")
 * @param {string} criteria.priceRange - Price range (e.g., "0-50", "50-100")
 * @param {Array} criteria.interests - Array of interests
 * @returns {Promise} - Response from API
 */
export const getProductSuggestions = async (criteria) => {
  try {
    const response = await axiosInstance.post('/ai/suggestions', criteria);
    return response.data;
  } catch (error) {
    console.error('Error getting product suggestions:', error);
    throw error.response?.data || { message: 'Failed to get product suggestions' };
  }
};

/**
 * Log chat feedback for training
 * @param {string} userId - User ID if logged in
 * @param {string} message - User's message
 * @param {string} response - AI's response
 * @param {string} feedback - Feedback ("positive" or "negative")
 * @returns {Promise} - Response from API
 */
export const logChatFeedback = async (userId, message, response, feedback) => {
  try {
    const logResponse = await axiosInstance.post('/ai/log', {
      userId,
      message,
      response,
      feedback
    });
    return logResponse.data;
  } catch (error) {
    console.error('Error logging chat feedback:', error);
    // Silently fail - this shouldn't affect the user experience
    return { success: false };
  }
};
