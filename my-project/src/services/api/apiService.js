import axiosInstance from './axiosConfig';
import { formatError, formatSuccess } from '../../utils/apiUtils';

/**
 * Generic API service for making requests to the backend
 */
class ApiService {
  /**
   * Make a GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response
   */
  static async get(endpoint, params = {}) {
    try {
      const response = await axiosInstance.get(endpoint, { params });
      return formatSuccess(response);
    } catch (error) {
      throw formatError(error);
    }
  }

  /**
   * Make a POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body
   * @returns {Promise} - API response
   */
  static async post(endpoint, data = {}) {
    try {
      const response = await axiosInstance.post(endpoint, data);
      return formatSuccess(response);
    } catch (error) {
      throw formatError(error);
    }
  }

  /**
   * Make a PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body
   * @returns {Promise} - API response
   */
  static async put(endpoint, data = {}) {
    try {
      const response = await axiosInstance.put(endpoint, data);
      return formatSuccess(response);
    } catch (error) {
      throw formatError(error);
    }
  }

  /**
   * Make a PATCH request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body
   * @returns {Promise} - API response
   */
  static async patch(endpoint, data = {}) {
    try {
      const response = await axiosInstance.patch(endpoint, data);
      return formatSuccess(response);
    } catch (error) {
      throw formatError(error);
    }
  }

  /**
   * Make a DELETE request
   * @param {string} endpoint - API endpoint
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response
   */
  static async delete(endpoint, params = {}) {
    try {
      const response = await axiosInstance.delete(endpoint, { params });
      return formatSuccess(response);
    } catch (error) {
      throw formatError(error);
    }
  }

  /**
   * Upload a file
   * @param {string} endpoint - API endpoint
   * @param {FormData} formData - Form data with file
   * @param {Function} onProgress - Progress callback
   * @returns {Promise} - API response
   */
  static async uploadFile(endpoint, formData, onProgress = null) {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      if (onProgress) {
        config.onUploadProgress = (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        };
      }

      const response = await axiosInstance.post(endpoint, formData, config);
      return formatSuccess(response);
    } catch (error) {
      throw formatError(error);
    }
  }
}

export default ApiService;
