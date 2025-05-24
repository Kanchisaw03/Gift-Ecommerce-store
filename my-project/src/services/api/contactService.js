import axiosInstance from './axiosConfig';

/**
 * Submit contact form
 * @param {Object} contactData - Contact form data
 * @returns {Promise} - Response from API
 */
export const submitContactForm = async (contactData) => {
  try {
    const response = await axiosInstance.post('/contact', contactData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to submit contact form' };
  }
};

/**
 * Get contact submissions (admin only)
 * @param {Object} params - Query parameters (page, limit, status)
 * @returns {Promise} - Response from API
 */
export const getContactSubmissions = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/contact', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch contact submissions' };
  }
};

/**
 * Get contact submission details (admin only)
 * @param {string} contactId - Contact submission ID
 * @returns {Promise} - Response from API
 */
export const getContactSubmissionDetails = async (contactId) => {
  try {
    const response = await axiosInstance.get(`/contact/${contactId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch contact submission details' };
  }
};

/**
 * Update contact submission status (admin only)
 * @param {string} contactId - Contact submission ID
 * @param {Object} statusData - Status update data
 * @returns {Promise} - Response from API
 */
export const updateContactSubmissionStatus = async (contactId, statusData) => {
  try {
    const response = await axiosInstance.put(`/contact/${contactId}/status`, statusData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update contact submission status' };
  }
};

/**
 * Respond to contact submission (admin only)
 * @param {string} contactId - Contact submission ID
 * @param {Object} responseData - Response data
 * @returns {Promise} - Response from API
 */
export const respondToContactSubmission = async (contactId, responseData) => {
  try {
    const response = await axiosInstance.post(`/contact/${contactId}/respond`, responseData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to respond to contact submission' };
  }
};

/**
 * Delete contact submission (admin only)
 * @param {string} contactId - Contact submission ID
 * @returns {Promise} - Response from API
 */
export const deleteContactSubmission = async (contactId) => {
  try {
    const response = await axiosInstance.delete(`/contact/${contactId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete contact submission' };
  }
};
