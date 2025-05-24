import axiosInstance from './axiosConfig';

/**
 * Create payment intent
 * @param {Object} paymentData - Payment data (orderId, amount)
 * @returns {Promise} - Response from API with client secret
 */
export const createPaymentIntent = async (paymentData) => {
  try {
    const response = await axiosInstance.post('/payments/create-payment-intent', paymentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create payment intent' };
  }
};

/**
 * Confirm payment
 * @param {string} paymentIntentId - Payment intent ID
 * @param {Object} confirmData - Confirmation data
 * @returns {Promise} - Response from API
 */
export const confirmPayment = async (paymentIntentId, confirmData) => {
  try {
    const response = await axiosInstance.post(`/payments/confirm/${paymentIntentId}`, confirmData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to confirm payment' };
  }
};

/**
 * Get payment methods
 * @returns {Promise} - Response from API
 */
export const getPaymentMethods = async () => {
  try {
    const response = await axiosInstance.get('/payments/methods');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch payment methods' };
  }
};

/**
 * Add payment method
 * @param {Object} paymentMethodData - Payment method data
 * @returns {Promise} - Response from API
 */
export const addPaymentMethod = async (paymentMethodData) => {
  try {
    const response = await axiosInstance.post('/payments/methods', paymentMethodData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to add payment method' };
  }
};

/**
 * Delete payment method
 * @param {string} paymentMethodId - Payment method ID
 * @returns {Promise} - Response from API
 */
export const deletePaymentMethod = async (paymentMethodId) => {
  try {
    const response = await axiosInstance.delete(`/payments/methods/${paymentMethodId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete payment method' };
  }
};

/**
 * Set default payment method
 * @param {string} paymentMethodId - Payment method ID
 * @returns {Promise} - Response from API
 */
export const setDefaultPaymentMethod = async (paymentMethodId) => {
  try {
    const response = await axiosInstance.put(`/payments/methods/${paymentMethodId}/default`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to set default payment method' };
  }
};

/**
 * Get payment history
 * @param {Object} params - Query parameters (page, limit)
 * @returns {Promise} - Response from API
 */
export const getPaymentHistory = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/payments/history', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch payment history' };
  }
};

/**
 * Request refund
 * @param {string} paymentId - Payment ID
 * @param {Object} refundData - Refund data (reason, amount)
 * @returns {Promise} - Response from API
 */
export const requestRefund = async (paymentId, refundData) => {
  try {
    const response = await axiosInstance.post(`/payments/${paymentId}/refund`, refundData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to request refund' };
  }
};

/**
 * Get seller payout history (seller only)
 * @param {Object} params - Query parameters (page, limit, startDate, endDate)
 * @returns {Promise} - Response from API
 */
export const getSellerPayoutHistory = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/payments/seller/payouts', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch payout history' };
  }
};

/**
 * Update seller payout settings (seller only)
 * @param {Object} payoutSettingsData - Payout settings data
 * @returns {Promise} - Response from API
 */
export const updateSellerPayoutSettings = async (payoutSettingsData) => {
  try {
    const response = await axiosInstance.put('/payments/seller/payout-settings', payoutSettingsData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update payout settings' };
  }
};
