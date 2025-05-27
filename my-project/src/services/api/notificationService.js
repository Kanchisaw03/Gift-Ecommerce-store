import axiosInstance from './axiosConfig';

/**
 * Get user notifications
 * @param {Object} params - Query parameters
 * @param {boolean} params.read - Filter by read status
 * @param {string} params.type - Filter by notification type
 * @param {number} params.page - Page number
 * @param {number} params.limit - Number of notifications per page
 * @returns {Promise} - Response from API
 */
export const getUserNotifications = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/notifications', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch notifications' };
  }
};

/**
 * Get unread notification count
 * @returns {Promise} - Response from API
 */
export const getUnreadNotificationCount = async () => {
  try {
    const response = await axiosInstance.get('/notifications/unread-count');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch unread notification count' };
  }
};

/**
 * Mark notification as read
 * @param {string} notificationId - Notification ID
 * @returns {Promise} - Response from API
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await axiosInstance.put(`/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to mark notification as read' };
  }
};

/**
 * Mark all notifications as read
 * @returns {Promise} - Response from API
 */
export const markAllNotificationsAsRead = async () => {
  try {
    const response = await axiosInstance.put('/notifications/read-all');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to mark all notifications as read' };
  }
};

/**
 * Delete notification
 * @param {string} notificationId - Notification ID
 * @returns {Promise} - Response from API
 */
export const deleteNotification = async (notificationId) => {
  try {
    const response = await axiosInstance.delete(`/notifications/${notificationId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete notification' };
  }
};

/**
 * Delete all read notifications
 * @returns {Promise} - Response from API
 */
export const deleteReadNotifications = async () => {
  try {
    const response = await axiosInstance.delete('/notifications/read');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete read notifications' };
  }
};
