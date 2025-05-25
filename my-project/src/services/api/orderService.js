import axiosInstance from './axiosConfig';

/**
 * Create a new order
 * @param {Object} orderData - Order data
 * @returns {Promise} - Response from API
 */
export const createOrder = async (orderData) => {
  try {
    const response = await axiosInstance.post('/orders', orderData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create order' };
  }
};

/**
 * Get user orders
 * @param {Object} params - Query parameters (page, limit, status)
 * @returns {Promise} - Response from API
 */
export const getUserOrders = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/orders', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch orders' };
  }
};

/**
 * Get order details
 * @param {string} orderId - Order ID
 * @returns {Promise} - Response from API
 */
export const getOrderDetails = async (orderId) => {
  try {
    const response = await axiosInstance.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch order details' };
  }
};

/**
 * Cancel order
 * @param {string} orderId - Order ID
 * @param {Object} cancelData - Cancellation data (reason)
 * @returns {Promise} - Response from API
 */
export const cancelOrder = async (orderId, cancelData) => {
  try {
    const response = await axiosInstance.put(`/orders/${orderId}/cancel`, cancelData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to cancel order' };
  }
};

/**
 * Create payment intent for order
 * @param {string} orderId - Order ID
 * @returns {Promise} - Response from API with client secret
 */
export const createPaymentIntent = async (orderId) => {
  try {
    const response = await axiosInstance.post(`/payments/create-payment-intent/${orderId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create payment intent' };
  }
};

/**
 * Confirm payment for order
 * @param {string} orderId - Order ID
 * @param {Object} paymentData - Payment confirmation data
 * @returns {Promise} - Response from API
 */
export const confirmPayment = async (orderId, paymentData) => {
  try {
    const response = await axiosInstance.post(`/payments/confirm/${orderId}`, paymentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to confirm payment' };
  }
};

/**
 * Get order tracking information
 * @param {string} orderId - Order ID
 * @returns {Promise} - Response from API
 */
export const getOrderTracking = async (orderId) => {
  try {
    const response = await axiosInstance.get(`/orders/${orderId}/tracking`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch tracking information' };
  }
};

/**
 * Request order return
 * @param {string} orderId - Order ID
 * @param {Object} returnData - Return request data
 * @returns {Promise} - Response from API
 */
export const requestReturn = async (orderId, returnData) => {
  try {
    const response = await axiosInstance.post(`/orders/${orderId}/return`, returnData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to request return' };
  }
};

/**
 * Get order invoice
 * @param {string} orderId - Order ID
 * @returns {Promise} - Response from API
 */
export const getOrderInvoice = async (orderId) => {
  try {
    const response = await axiosInstance.get(`/orders/${orderId}/invoice`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch invoice' };
  }
};

/**
 * Get order receipt
 * @param {string} orderId - Order ID
 * @returns {Promise} - Response from API
 */
export const getOrderReceipt = async (orderId) => {
  try {
    const response = await axiosInstance.get(`/orders/${orderId}/receipt`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch receipt' };
  }
};

/**
 * Get seller orders (seller only)
 * @param {Object} params - Query parameters (page, limit, status)
 * @returns {Promise} - Response from API
 */
export const getSellerOrders = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/seller/orders', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch seller orders' };
  }
};

/**
 * Update order status
 * @param {string} orderId - Order ID
 * @param {Object} statusData - Status update data (status, notes)
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
 * Get all orders (admin only)
 * @param {Object} params - Query parameters (page, limit, status)
 * @returns {Promise} - Response from API
 */
export const getAllOrders = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/admin/orders', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch all orders' };
  }
};
