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
    console.log('Fetching system logs with params:', params);
    const response = await axiosInstance.get('/super-admin/audit-logs', { params });
    console.log('System logs response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch system logs:', error);
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
    console.log('Fetching platform analytics with params:', params);
    const response = await axiosInstance.get('/super-admin/analytics', { params });
    console.log('Platform analytics response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch platform analytics:', error);
    throw error.response?.data || { message: 'Failed to fetch platform analytics' };
  }
};

/**
 * Get all orders across the platform (super admin only)
 * @param {Object} params - Query parameters (page, limit, status, seller, date)
 * @returns {Promise} - Response from API with all orders
 */
export const getAllOrders = async (params = {}) => {
  try {
    console.log('Fetching all orders with params:', params);
    // Try multiple possible endpoints
    try {
      console.log('Trying /super-admin/orders endpoint');
      const response = await axiosInstance.get('/super-admin/orders', { params });
      console.log('Success with /super-admin/orders endpoint:', response.data);
      
      // Ensure we return a properly formatted response with pagination and data
      if (response.data && response.data.success) {
        // If the response already has pagination, use it
        if (response.data.pagination) {
          return response.data;
        }
        
        // Otherwise, construct pagination from the response
        return {
          success: response.data.success,
          data: response.data.data || [],
          pagination: {
            page: params.page || 1,
            limit: params.limit || 10,
            total: response.data.count || 0,
            pages: Math.ceil((response.data.count || 0) / (params.limit || 10))
          }
        };
      }
      return response.data;
      
    } catch (err) {
      console.log('Error with /super-admin/orders, trying fallback:', err.message);
      
      // Try alternative endpoints
      try {
        console.log('Trying /orders endpoint with super_admin role');
        const fallbackResponse = await axiosInstance.get('/orders', { 
          params: { ...params, role: 'super_admin' } 
        });
        console.log('Success with /orders endpoint:', fallbackResponse.data);
        return fallbackResponse.data;
      } catch (fallbackErr) {
        console.log('Error with /orders endpoint, trying another fallback:', fallbackErr.message);
        
        // Final fallback
        const lastFallbackResponse = await axiosInstance.get('/admin/orders', { 
          params: { ...params, role: 'super_admin' } 
        });
        console.log('Success with /admin/orders endpoint:', lastFallbackResponse.data);
        return lastFallbackResponse.data;
      }
    }
  
  } catch (error) {
    console.error('Error fetching super admin orders:', error);
    throw error.response?.data || { message: 'Failed to fetch all orders' };
  }
};

/**
 * Update order status (super admin only)
 * @param {string} orderId - Order ID
 * @param {Object} statusData - Status update data
 * @returns {Promise} - Response from API
 */
export const updateSuperAdminOrderStatus = async (orderId, statusData, role = 'super_admin') => {
  try {
    console.log(`Updating order status for ${orderId} as ${role}:`, statusData);
    const response = await axiosInstance.put(`/super-admin/orders/${orderId}/status`, statusData);
    console.log('Update order status response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to update order status:', error);
    throw error.response?.data || { message: 'Failed to update order status' };
  }
};
