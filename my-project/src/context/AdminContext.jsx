import { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import useSocket from '../hooks/useSocket';
import { 
  getAdminDashboardStats, 
  getUsers as getAdminUsers,
  getAdminProducts,
  getAdminOrders,
  getAdminReviews,
  getAdminAnalytics
} from '../services/api/adminService';
import { useAuth } from '../hooks/useAuth';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    recentOrders: [],
    recentUsers: [],
    recentProducts: []
  });
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const socket = useSocket();
  const { user, isAuthenticated } = useAuth();
  
  // Check if user is admin or super_admin
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  
  // Fetch admin dashboard data
  const fetchDashboardData = async () => {
    if (!isAuthenticated || !isAdmin) return;
    
    setLoading(true);
    try {
      const data = await getAdminDashboardStats();
      if (data && data.success) {
        setDashboardData(data.data);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
      setError(err.message || 'Failed to fetch dashboard data');
      toast.error(err.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch admin users
  const fetchUsers = async (filters = {}) => {
    if (!isAuthenticated || !isAdmin) return;
    
    setLoading(true);
    try {
      const data = await getAdminUsers(filters);
      if (data && data.success) {
        setUsers(data.data);
      }
      setError(null);
      return data;
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Failed to fetch users');
      toast.error(err.message || 'Failed to fetch users');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch admin products
  const fetchProducts = async (filters = {}) => {
    if (!isAuthenticated || !isAdmin) return;
    
    setLoading(true);
    try {
      const data = await getAdminProducts(filters);
      if (data && data.success) {
        setProducts(data.data);
      }
      setError(null);
      return data;
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to fetch products');
      toast.error(err.message || 'Failed to fetch products');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch admin orders
  const fetchOrders = async (filters = {}) => {
    if (!isAuthenticated || !isAdmin) return;
    
    setLoading(true);
    try {
      const data = await getAdminOrders(filters);
      if (data && data.success) {
        setOrders(data.data);
      }
      setError(null);
      return data;
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Failed to fetch orders');
      toast.error(err.message || 'Failed to fetch orders');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch admin sellers
  const fetchSellers = async (filters = {}) => {
    if (!isAuthenticated || !isAdmin) return;
    
    setLoading(true);
    try {
      const data = await getAdminSellers(filters);
      if (data && data.success) {
        setSellers(data.data);
      }
      setError(null);
      return data;
    } catch (err) {
      console.error('Error fetching sellers:', err);
      setError(err.message || 'Failed to fetch sellers');
      toast.error(err.message || 'Failed to fetch sellers');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch admin reviews
  const fetchReviews = async (filters = {}) => {
    if (!isAuthenticated || !isAdmin) return;
    
    setLoading(true);
    try {
      const data = await getAdminReviews(filters);
      if (data && data.success) {
        setReviews(data.data);
      }
      setError(null);
      return data;
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError(err.message || 'Failed to fetch reviews');
      toast.error(err.message || 'Failed to fetch reviews');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch admin analytics
  const fetchAnalytics = async (period = 'month') => {
    if (!isAuthenticated || !isAdmin) return;
    
    setLoading(true);
    try {
      const data = await getAdminAnalytics(period);
      if (data && data.success) {
        setAnalytics(data.data);
      }
      setError(null);
      return data;
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err.message || 'Failed to fetch analytics');
      toast.error(err.message || 'Failed to fetch analytics');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Socket.IO event listeners for real-time updates
  useEffect(() => {
    if (!socket || !isAuthenticated || !isAdmin) {
      return;
    }
    
    console.log('Setting up admin Socket.IO event listeners');
    
    // Listen for new user registration
    socket.on('userRegistered', (newUser) => {
      console.log('Socket event received: userRegistered', newUser);
      setUsers(prevUsers => [newUser, ...prevUsers]);
      setDashboardData(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          totalUsers: (prev.stats.totalUsers || 0) + 1
        },
        recentUsers: [newUser, ...prev.recentUsers.slice(0, 3)]
      }));
      toast.info(`New user registered: ${newUser.name}`);
    });
    
    // Listen for new order
    socket.on('newOrder', (order) => {
      console.log('Socket event received: newOrder', order);
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
    });
    
    // Listen for new product
    socket.on('productCreated', (product) => {
      console.log('Socket event received: productCreated', product);
      setProducts(prevProducts => [product, ...prevProducts]);
      setDashboardData(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          totalProducts: (prev.stats.totalProducts || 0) + 1,
          pendingProducts: product.status === 'pending' ? 
            (prev.stats.pendingProducts || 0) + 1 : 
            (prev.stats.pendingProducts || 0)
        },
        recentProducts: [product, ...prev.recentProducts.slice(0, 3)]
      }));
      toast.info(`New product added: ${product.name}`);
    });
    
    // Listen for product update
    socket.on('productUpdated', (product) => {
      console.log('Socket event received: productUpdated', product);
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p._id === product._id ? product : p
        )
      );
      setDashboardData(prev => ({
        ...prev,
        recentProducts: prev.recentProducts.map(p => 
          p._id === product._id ? product : p
        )
      }));
    });
    
    // Listen for order status change
    socket.on('orderStatusChanged', (updatedOrder) => {
      console.log('Socket event received: orderStatusChanged', updatedOrder);
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
    });
    
    // Listen for new review
    socket.on('reviewCreated', (review) => {
      console.log('Socket event received: reviewCreated', review);
      setReviews(prevReviews => [review, ...prevReviews]);
    });
    
    return () => {
      socket.off('userRegistered');
      socket.off('newOrder');
      socket.off('productCreated');
      socket.off('productUpdated');
      socket.off('orderStatusChanged');
      socket.off('reviewCreated');
    };
  }, [socket, user, isAuthenticated, isAdmin]);
  
  return (
    <AdminContext.Provider
      value={{
        dashboardData,
        users,
        products,
        orders,
        sellers,
        reviews,
        analytics,
        loading,
        error,
        fetchDashboardData,
        fetchUsers,
        fetchProducts,
        fetchOrders,
        fetchSellers,
        fetchReviews,
        fetchAnalytics
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContext;
