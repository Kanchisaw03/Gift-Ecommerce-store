import axiosInstance from './axiosConfig';

/**
 * Get seller dashboard data
 * @returns {Promise} - Response from API with seller dashboard data
 */
export const getSellerDashboardData = async () => {
  try {
    console.log('Fetching seller dashboard data');
    const response = await axiosInstance.get('/seller/dashboard');
    console.log('Seller dashboard response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch seller dashboard data:', error);
    throw error.response?.data || { message: 'Failed to fetch seller dashboard data' };
  }
};

/**
 * Get seller orders
 * @param {Object} params - Query parameters (page, limit, status)
 * @returns {Promise} - Response from API with seller orders
 */
export const getSellerOrders = async (params = {}) => {
  try {
    console.log('Fetching seller orders with params:', params);
    const response = await axiosInstance.get('/seller/orders', { params });
    console.log('Seller orders response:', response.data);
    
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
  } catch (error) {
    console.error('Error fetching seller orders:', error);
    throw error.response?.data || { message: 'Failed to fetch seller orders' };
  }
};

/**
 * Get admin dashboard data
 * @returns {Promise} - Response from API with admin dashboard data
 */
export const getAdminDashboardData = async () => {
  try {
    console.log('Fetching admin dashboard data');
    const response = await axiosInstance.get('/admin/dashboard');
    console.log('Admin dashboard response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch admin dashboard data:', error);
    throw error.response?.data || { message: 'Failed to fetch admin dashboard data' };
  }
};

/**
 * Get admin orders
 * @param {Object} params - Query parameters (page, limit, status)
 * @returns {Promise} - Response from API with admin orders
 */
export const getAdminOrders = async (params = {}) => {
  try {
    console.log('Fetching admin orders with params:', params);
    const response = await axiosInstance.get('/admin/orders', { params });
    console.log('Admin orders response:', response.data);
    
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
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    throw error.response?.data || { message: 'Failed to fetch admin orders' };
  }
};

/**
 * Update order status
 * @param {string} orderId - Order ID
 * @param {Object} statusData - Status data (status)
 * @returns {Promise} - Response from API
 */
export const updateOrderStatus = async (orderId, statusData) => {
  try {
    const response = await axiosInstance.put(`/orders/${orderId}/status`, statusData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update order status' };
  }
};

/**
 * Get super admin dashboard data
 * @returns {Promise} - Response from API with super admin dashboard data
 */
export const getSuperAdminDashboardData = async () => {
  try {
    const response = await axiosInstance.get('/super-admin/dashboard');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch super admin dashboard data' };
  }
};

/**
 * Get all orders for super admin
 * @param {Object} params - Query parameters (page, limit, status)
 * @returns {Promise} - Response from API with all orders
 */
export const getAllOrders = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/orders', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch all orders' };
  }
};
