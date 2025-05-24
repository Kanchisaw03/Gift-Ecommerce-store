import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { 
  getOrders, 
  getOrderById, 
  createOrder, 
  updateOrderStatus,
  cancelOrder,
  trackOrder
} from '../services/api/orderService';
import { useAuth } from './useAuth';

/**
 * Custom hook for handling order operations
 * @param {Object} options - Hook options
 * @param {boolean} options.autoFetch - Whether to fetch orders automatically on mount
 * @returns {Object} - Order state and functions
 */
const useOrders = ({ autoFetch = true } = {}) => {
  const { isAuthenticated, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  /**
   * Fetch user orders
   * @param {Object} params - Query parameters
   */
  const fetchOrders = useCallback(async (params = {}) => {
    // Skip if not authenticated
    if (!isAuthenticated) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getOrders(params);
      
      // Handle different API response formats
      if (response.data) {
        setOrders(response.data);
        
        // Set pagination if available
        if (response.pagination) {
          setPagination({
            page: response.pagination.page || 1,
            limit: response.pagination.limit || 10,
            total: response.total || 0,
            totalPages: response.pagination.totalPages || 1
          });
        }
      } else if (Array.isArray(response)) {
        setOrders(response);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch orders';
      setError(errorMessage);
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * Fetch order by ID
   * @param {string} orderId - Order ID
   * @returns {Object} - Order data
   */
  const fetchOrderById = useCallback(async (orderId) => {
    if (!orderId) return null;

    setLoading(true);
    setError(null);

    try {
      const response = await getOrderById(orderId);
      const orderData = response.data || response;
      setCurrentOrder(orderData);
      return orderData;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch order';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new order
   * @param {Object} orderData - Order data
   * @returns {Object} - Created order
   */
  const placeOrder = useCallback(async (orderData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await createOrder(orderData);
      const newOrder = response.data || response;
      
      // Add to orders list
      setOrders((prevOrders) => [newOrder, ...prevOrders]);
      
      // Set as current order
      setCurrentOrder(newOrder);
      
      toast.success('Order placed successfully');
      return newOrder;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to place order';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update order status
   * @param {string} orderId - Order ID
   * @param {string} status - New status
   * @returns {Object} - Updated order
   */
  const updateStatus = useCallback(async (orderId, status) => {
    setLoading(true);
    setError(null);

    try {
      const response = await updateOrderStatus(orderId, { status });
      const updatedOrder = response.data || response;
      
      // Update orders list
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          (order._id || order.id) === orderId ? updatedOrder : order
        )
      );
      
      // Update current order if it's the same
      if (currentOrder && (currentOrder._id || currentOrder.id) === orderId) {
        setCurrentOrder(updatedOrder);
      }
      
      toast.success('Order status updated successfully');
      return updatedOrder;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update order status';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentOrder]);

  /**
   * Cancel order
   * @param {string} orderId - Order ID
   * @param {string} reason - Cancellation reason
   * @returns {Object} - Cancelled order
   */
  const cancelUserOrder = useCallback(async (orderId, reason = '') => {
    setLoading(true);
    setError(null);

    try {
      const response = await cancelOrder(orderId, { reason });
      const cancelledOrder = response.data || response;
      
      // Update orders list
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          (order._id || order.id) === orderId ? cancelledOrder : order
        )
      );
      
      // Update current order if it's the same
      if (currentOrder && (currentOrder._id || currentOrder.id) === orderId) {
        setCurrentOrder(cancelledOrder);
      }
      
      toast.success('Order cancelled successfully');
      return cancelledOrder;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to cancel order';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentOrder]);

  /**
   * Track order
   * @param {string} orderId - Order ID
   * @returns {Object} - Tracking information
   */
  const trackUserOrder = useCallback(async (orderId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await trackOrder(orderId);
      return response.data || response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to track order';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Change page
   * @param {number} page - Page number
   */
  const changePage = useCallback((page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchOrders({ page });
    }
  }, [fetchOrders, pagination.totalPages]);

  // Fetch orders on mount if autoFetch is true
  useEffect(() => {
    if (autoFetch && isAuthenticated) {
      fetchOrders();
    }
  }, [autoFetch, isAuthenticated, fetchOrders]);

  return {
    orders,
    currentOrder,
    loading,
    error,
    pagination,
    fetchOrders,
    fetchOrderById,
    placeOrder,
    updateStatus,
    cancelOrder: cancelUserOrder,
    trackOrder: trackUserOrder,
    changePage
  };
};

export default useOrders;
