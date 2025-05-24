import axiosInstance from './axiosConfig';

/**
 * Get public settings
 * @returns {Promise} - Response from API
 */
export const getPublicSettings = async () => {
  try {
    const response = await axiosInstance.get('/settings/public');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch public settings' };
  }
};

/**
 * Get all settings (admin/super admin only)
 * @returns {Promise} - Response from API
 */
export const getAllSettings = async () => {
  try {
    const response = await axiosInstance.get('/settings');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch all settings' };
  }
};

/**
 * Get settings by group
 * @param {string} group - Settings group
 * @returns {Promise} - Response from API
 */
export const getSettingsByGroup = async (group) => {
  try {
    const response = await axiosInstance.get(`/settings/group/${group}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch settings group' };
  }
};

/**
 * Update settings (admin/super admin only)
 * @param {Object} settingsData - Settings data
 * @returns {Promise} - Response from API
 */
export const updateSettings = async (settingsData) => {
  try {
    const response = await axiosInstance.put('/settings', settingsData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update settings' };
  }
};

/**
 * Update single setting (admin/super admin only)
 * @param {string} key - Setting key
 * @param {Object} valueData - Setting value data
 * @returns {Promise} - Response from API
 */
export const updateSetting = async (key, valueData) => {
  try {
    const response = await axiosInstance.put(`/settings/${key}`, valueData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update setting' };
  }
};

/**
 * Reset settings to default (super admin only)
 * @param {string} group - Settings group (optional)
 * @returns {Promise} - Response from API
 */
export const resetSettings = async (group = '') => {
  try {
    const response = await axiosInstance.post('/settings/reset', { group });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to reset settings' };
  }
};
