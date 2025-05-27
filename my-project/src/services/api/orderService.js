import axiosInstance from './axiosConfig';

/**
 * Create a new order
 * @param {Object} orderData - Order data
 * @returns {Promise} - Response from API
 */
export const createOrder = async (orderData) => {
  try {
    console.log('Creating order with data:', JSON.stringify(orderData, null, 2));
    
    // Process order items to ensure valid MongoDB ObjectIds
    const processedOrderData = {
      ...orderData,
      items: orderData.items.map(item => ({
        ...item,
        // Ensure seller is a string, not an object
        seller: typeof item.seller === 'string' ? item.seller : '645e2d90675225374f91a05d'
      }))
    };
    
    const response = await axiosInstance.post('/orders', processedOrderData);
    console.log('Order creation response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Order creation error:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to create order' };
  }
};

/**
 * Get user orders (for buyers)
 * @param {Object} params - Query parameters (page, limit, status)
 * @returns {Promise} - Response from API
 */
export const getUserOrders = async (params = {}) => {
  try {
    console.log('Attempting to fetch user orders with params:', params);
    
    // Try multiple endpoints with detailed error logging
    try {
      console.log('Trying /orders/user endpoint');
      const response = await axiosInstance.get('/orders/user', { params });
      console.log('User orders response from /orders/user:', response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching from /orders/user:', err);
      console.log('Error details:', err.response?.status, err.response?.statusText);
      console.log('Trying fallback to /orders/my-orders endpoint');
      
      // Try the fallback endpoint
      const fallbackResponse = await axiosInstance.get('/orders/my-orders', { params });
      console.log('User orders response from /orders/my-orders:', fallbackResponse.data);
      return fallbackResponse.data;
    }
  } catch (error) {
    console.error('Failed to fetch user orders:', error);
    throw error.response?.data || { message: 'Failed to fetch orders' };
  }
};

/**
 * Get order details
 * @param {string} orderId - Order ID
 * @returns {Promise} - Response from API
 */
export const getOrderById = async (orderId) => {
  try {
    console.log(`Fetching order details for ID: ${orderId}`);
    const response = await axiosInstance.get(`/orders/${orderId}`);
    console.log('Order details response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch order details:', error);
    throw error.response?.data || { message: 'Failed to fetch order details' };
  }
};

// Alias for backward compatibility
export const getOrderDetails = getOrderById;

/**
 * Get seller orders
 * @param {Object} params - Query parameters (page, limit, status)
 * @returns {Promise} - Response from API
 */
export const getSellerOrders = async (params = {}) => {
  try {
    console.log('Fetching seller orders with params:', params);
    const response = await axiosInstance.get('/seller/orders', { params });
    console.log('Seller orders response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch seller orders:', error);
    throw error.response?.data || { message: 'Failed to fetch seller orders' };
  }
};

/**
 * Get admin orders
 * @param {Object} params - Query parameters (page, limit, status)
 * @returns {Promise} - Response from API
 */
export const getAdminOrders = async (params = {}) => {
  try {
    console.log('Fetching admin orders with params:', params);
    const response = await axiosInstance.get('/admin/orders', { params });
    console.log('Admin orders response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch admin orders:', error);
    throw error.response?.data || { message: 'Failed to fetch admin orders' };
  }
};

/**
 * Get super admin orders
 * @param {Object} params - Query parameters (page, limit, status)
 * @returns {Promise} - Response from API
 */
export const getSuperAdminOrders = async (params = {}) => {
  try {
    console.log('Fetching super admin orders with params:', params);
    const response = await axiosInstance.get('/super-admin/orders', { params });
    console.log('Super admin orders response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch super admin orders:', error);
    throw error.response?.data || { message: 'Failed to fetch super admin orders' };
  }
};

/**
 * Update order status
 * @param {string} orderId - Order ID
 * @param {Object} statusData - Status data (status, notes)
 * @param {string} userRole - User role (seller, admin, super_admin)
 * @returns {Promise} - Response from API
 */
export const updateOrderStatus = async (orderId, statusData, userRole = 'admin') => {
  try {
    let endpoint = `/orders/${orderId}/status`;
    
    // Use the appropriate endpoint based on user role
    if (userRole === 'seller') {
      endpoint = `/seller/orders/${orderId}/status`;
    } else if (userRole === 'admin') {
      endpoint = `/admin/orders/${orderId}/status`;
    } else if (userRole === 'super_admin') {
      endpoint = `/super-admin/orders/${orderId}/status`;
    }
    
    console.log(`Updating order status for ${orderId} as ${userRole}:`, statusData);
    const response = await axiosInstance.put(endpoint, statusData);
    return response.data;
  } catch (error) {
    console.error('Failed to update order status:', error);
    throw error.response?.data || { message: 'Failed to update order status' };
  }
};

/**
 * Add tracking information to an order
 * @param {string} orderId - Order ID
 * @param {Object} trackingData - Tracking data (trackingNumber, carrier, estimatedDelivery)
 * @param {string} userRole - User role (seller, admin, super_admin)
 * @returns {Promise} - Response from API
 */
export const addOrderTracking = async (orderId, trackingData, userRole = 'admin') => {
  try {
    let endpoint = `/orders/${orderId}/tracking`;
    
    // Use the appropriate endpoint based on user role
    if (userRole === 'seller') {
      endpoint = `/seller/orders/${orderId}/tracking`;
    } else if (userRole === 'admin') {
      endpoint = `/admin/orders/${orderId}/tracking`;
    } else if (userRole === 'super_admin') {
      endpoint = `/super-admin/orders/${orderId}/tracking`;
    }
    
    console.log(`Adding tracking info for ${orderId} as ${userRole}:`, trackingData);
    const response = await axiosInstance.put(endpoint, trackingData);
    return response.data;
  } catch (error) {
    console.error('Failed to add tracking information:', error);
    throw error.response?.data || { message: 'Failed to add tracking information' };
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
    console.log(`Cancelling order ${orderId} with data:`, cancelData);
    const response = await axiosInstance.put(`/api/orders/${orderId}/cancel`, cancelData);
    console.log('Cancel order response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to cancel order:', error);
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
    console.log(`Creating payment intent for order: ${orderId}`);
    const response = await axiosInstance.post(`/api/payments/create-payment-intent/${orderId}`);
    console.log('Payment intent response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to create payment intent:', error);
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
 * @returns {Promise} - Response from API with tracking information
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
 * Create Razorpay order
 * @param {Object} orderData - Order data for Razorpay
 * @returns {Promise} - Response from API with Razorpay order details
 */
export const createRazorpayOrder = async (orderData) => {
  try {
    const response = await axiosInstance.post('/payments/razorpay', orderData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create Razorpay order' };
  }
};

/**
 * Verify Razorpay payment
 * @param {Object} paymentData - Payment verification data
 * @returns {Promise} - Response from API with verification result
 */
export const verifyRazorpayPayment = async (paymentData) => {
  try {
    const response = await axiosInstance.post('/payments/razorpay/verify', paymentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to verify payment' };
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
