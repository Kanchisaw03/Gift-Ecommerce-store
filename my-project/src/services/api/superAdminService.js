import axiosInstance from './axiosConfig';

/**
 * Get super admin dashboard statistics
 * @returns {Promise} - Response from API
 */
export const getSuperAdminDashboardStats = async () => {
  try {
    const response = await axiosInstance.get('/super-admin/dashboard');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch dashboard statistics' };
  }
};

/**
 * Get all admins (super admin only)
 * @param {Object} params - Query parameters (page, limit)
 * @returns {Promise} - Response from API
 */
export const getAdmins = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/super-admin/admins', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch admins' };
  }
};

/**
 * Create admin (super admin only)
 * @param {Object} adminData - Admin data
 * @returns {Promise} - Response from API
 */
export const createAdmin = async (adminData) => {
  try {
    const response = await axiosInstance.post('/super-admin/admins', adminData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create admin' };
  }
};

/**
 * Update admin (super admin only)
 * @param {string} adminId - Admin ID
 * @param {Object} adminData - Updated admin data
 * @returns {Promise} - Response from API
 */
export const updateAdmin = async (adminId, adminData) => {
  try {
    const response = await axiosInstance.put(`/super-admin/admins/${adminId}`, adminData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update admin' };
  }
};

/**
 * Delete admin (super admin only)
 * @param {string} adminId - Admin ID
 * @returns {Promise} - Response from API
 */
export const deleteAdmin = async (adminId) => {
  try {
    const response = await axiosInstance.delete(`/super-admin/admins/${adminId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete admin' };
  }
};

/**
 * Get system logs (super admin only)
 * @param {Object} params - Query parameters (page, limit, level, startDate, endDate)
 * @returns {Promise} - Response from API
 */
export const getSystemLogs = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/super-admin/logs', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch system logs' };
  }
};

/**
 * Get system health (super admin only)
 * @returns {Promise} - Response from API
 */
export const getSystemHealth = async () => {
  try {
    const response = await axiosInstance.get('/super-admin/health');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch system health' };
  }
};

/**
 * Get platform settings (super admin only)
 * @returns {Promise} - Response from API
 */
export const getPlatformSettings = async () => {
  try {
    const response = await axiosInstance.get('/super-admin/settings');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch platform settings' };
  }
};

/**
 * Update platform settings (super admin only)
 * @param {Object} settingsData - Settings data
 * @returns {Promise} - Response from API
 */
export const updatePlatformSettings = async (settingsData) => {
  try {
    const response = await axiosInstance.put('/super-admin/settings', settingsData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update platform settings' };
  }
};

/**
 * Get database backup status (super admin only)
 * @returns {Promise} - Response from API
 */
export const getDatabaseBackupStatus = async () => {
  try {
    const response = await axiosInstance.get('/super-admin/database/backup');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch database backup status' };
  }
};

/**
 * Create database backup (super admin only)
 * @returns {Promise} - Response from API
 */
export const createDatabaseBackup = async () => {
  try {
    const response = await axiosInstance.post('/super-admin/database/backup');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create database backup' };
  }
};

/**
 * Restore database from backup (super admin only)
 * @param {Object} backupData - Backup data
 * @returns {Promise} - Response from API
 */
export const restoreDatabaseBackup = async (backupData) => {
  try {
    const response = await axiosInstance.post('/super-admin/database/restore', backupData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to restore database backup' };
  }
};

/**
 * Get full platform analytics (super admin only)
 * @param {Object} params - Query parameters (period, startDate, endDate)
 * @returns {Promise} - Response from API
 */
export const getPlatformAnalytics = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/super-admin/analytics', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch platform analytics' };
  }
};
