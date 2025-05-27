import { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import useSocket from '../hooks/useSocket';
import { 
  getSellerDashboardStats, 
  getSellerProducts, 
  getSellerAnalytics,
  getSellerEarnings
} from '../services/api/sellerService';
import { getSellerOrders, updateOrderStatus } from '../services/api/orderService';
import { useAuth } from '../hooks/useAuth';

const SellerContext = createContext();

export const SellerProvider = ({ children }) => {
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    recentOrders: [],
    bestSellers: []
  });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [earnings, setEarnings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const socket = useSocket();
  const { user, isAuthenticated } = useAuth();
  
  // Fetch seller dashboard data
  const fetchDashboardData = async () => {
    if (!isAuthenticated || user?.role !== 'seller') return;
    
    setLoading(true);
    try {
      const data = await getSellerDashboardStats();
      if (data && data.success) {
        setDashboardData(data.data);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching seller dashboard data:', err);
      // Check if the error is due to seller not being approved
      if (err.message && err.message.includes('not approved')) {
        setError('approval_pending');
      } else {
        setError(err.message || 'Failed to fetch dashboard data');
        toast.error(err.message || 'Failed to fetch dashboard data');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch seller products
  const fetchSellerProducts = async (filters = {}) => {
    if (!isAuthenticated || user?.role !== 'seller') return;
    
    setLoading(true);
    try {
      const data = await getSellerProducts(filters);
      if (data && data.success) {
        setProducts(data.data);
      }
      setError(null);
      return data;
    } catch (err) {
      console.error('Error fetching seller products:', err);
      setError(err.message || 'Failed to fetch products');
      toast.error(err.message || 'Failed to fetch products');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch seller orders
  const fetchSellerOrders = async (filters = {}) => {
    if (!isAuthenticated || user?.role !== 'seller') return;
    
    setLoading(true);
    try {
      const data = await getSellerOrders(filters);
      if (data && data.success) {
        setOrders(data.data);
      }
      setError(null);
      return data;
    } catch (err) {
      console.error('Error fetching seller orders:', err);
      setError(err.message || 'Failed to fetch orders');
      toast.error(err.message || 'Failed to fetch orders');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Update order status
  const handleUpdateOrderStatus = async (orderId, status) => {
    if (!isAuthenticated || user?.role !== 'seller') return;
    
    try {
      console.log(`Seller updating order status for ${orderId} to ${status}`);
      // Pass 'seller' as the role parameter to use the correct API endpoint
      const response = await updateOrderStatus(orderId, { status }, 'seller');
      console.log('Update order status response:', response);
      
      if (response && response.success) {
        // Update the order in the local state
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === orderId ? { ...order, status } : order
          )
        );
        toast.success('Order status updated successfully');
        return response;
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      toast.error(err.message || 'Failed to update order status');
      return null;
    }
  };
  
  // Fetch seller analytics
  const fetchSellerAnalytics = async (period = 'month') => {
    if (!isAuthenticated || user?.role !== 'seller') return;
    
    setLoading(true);
    try {
      const data = await getSellerAnalytics(period);
      if (data && data.success) {
        setAnalytics(data.data);
      }
      setError(null);
      return data;
    } catch (err) {
      console.error('Error fetching seller analytics:', err);
      setError(err.message || 'Failed to fetch analytics');
      toast.error(err.message || 'Failed to fetch analytics');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch seller earnings
  const fetchSellerEarnings = async (period = 'month') => {
    if (!isAuthenticated || user?.role !== 'seller') return;
    
    setLoading(true);
    try {
      const data = await getSellerEarnings(period);
      if (data && data.success) {
        setEarnings(data.data);
      }
      setError(null);
      return data;
    } catch (err) {
      console.error('Error fetching seller earnings:', err);
      setError(err.message || 'Failed to fetch earnings');
      toast.error(err.message || 'Failed to fetch earnings');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Socket.IO event listeners for real-time updates
  useEffect(() => {
    if (!socket || !isAuthenticated || user?.role !== 'seller') {
      return;
    }
    
    console.log('Setting up seller Socket.IO event listeners');
    
    // Listen for new order
    socket.on('newOrder', (order) => {
      console.log('Socket event received: newOrder', order);
      if (order.seller === user.id) {
        setOrders(prevOrders => [order, ...prevOrders]);
        setDashboardData(prev => ({
          ...prev,
          stats: {
            ...prev.stats,
            totalOrders: (prev.stats.totalOrders || 0) + 1,
            pendingOrders: (prev.stats.pendingOrders || 0) + 1
          },
          recentOrders: [order, ...prev.recentOrders.slice(0, 3)]
        }));
        toast.info(`New order received: #${order.orderNumber}`);
      }
    });
    
    // Listen for order status change
    socket.on('orderStatusChanged', (updatedOrder) => {
      console.log('Socket event received: orderStatusChanged', updatedOrder);
      if (updatedOrder.seller === user.id) {
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === updatedOrder._id ? updatedOrder : order
          )
        );
        setDashboardData(prev => ({
          ...prev,
          recentOrders: prev.recentOrders.map(order => 
            order._id === updatedOrder._id ? updatedOrder : order
          )
        }));
        toast.info(`Order #${updatedOrder.orderNumber} status updated to ${updatedOrder.status}`);
      }
    });
    
    // Listen for product update
    socket.on('productUpdated', (product) => {
      console.log('Socket event received: productUpdated', product);
      if (product.seller === user.id) {
        setProducts(prevProducts => 
          prevProducts.map(p => 
            p._id === product._id ? product : p
          )
        );
      }
    });
    
    return () => {
      socket.off('newOrder');
      socket.off('orderStatusChanged');
      socket.off('productUpdated');
    };
  }, [socket, user, isAuthenticated]);
  
  return (
    <SellerContext.Provider
      value={{
        dashboardData,
        products,
        orders,
        analytics,
        earnings,
        loading,
        error,
        fetchDashboardData,
        fetchSellerProducts,
        fetchSellerOrders,
        fetchSellerAnalytics,
        fetchSellerEarnings,
        updateOrderStatus: handleUpdateOrderStatus
      }}
    >
      {children}
    </SellerContext.Provider>
  );
};

export default SellerContext;
