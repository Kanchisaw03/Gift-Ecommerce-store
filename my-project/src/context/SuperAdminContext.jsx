import { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import useSocket from '../hooks/useSocket';
import { 
  getSuperAdminDashboardStats,
  getAdmins as getUserRoles,
  updateAdmin as updateUserRole,
  getPlatformSettings,
  updatePlatformSettings,
  getSystemLogs as getAuditLogs,
  getPlatformAnalytics
} from '../services/api/superAdminService';
import { useAuth } from '../hooks/useAuth';

const SuperAdminContext = createContext();

export const SuperAdminProvider = ({ children }) => {
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    systemHealth: {},
    recentActivities: []
  });
  const [userRoles, setUserRoles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [platformSettings, setPlatformSettings] = useState({});
  const [auditLogs, setAuditLogs] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const socket = useSocket();
  const { user, isAuthenticated } = useAuth();
  
  // Check if user is super_admin
  const isSuperAdmin = user?.role === 'super_admin';
  
  // Fetch super admin dashboard data
  const fetchDashboardData = async () => {
    if (!isAuthenticated || !isSuperAdmin) return;
    
    setLoading(true);
    try {
      const data = await getSuperAdminDashboardStats();
      if (data && data.success) {
        setDashboardData(data.data);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching super admin dashboard data:', err);
      setError(err.message || 'Failed to fetch dashboard data');
      toast.error(err.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch user roles
  const fetchUserRoles = async (filters = {}) => {
    if (!isAuthenticated || !isSuperAdmin) return;
    
    setLoading(true);
    try {
      const data = await getUserRoles(filters);
      if (data && data.success) {
        setUserRoles(data.data);
      }
      setError(null);
      return data;
    } catch (err) {
      console.error('Error fetching user roles:', err);
      setError(err.message || 'Failed to fetch user roles');
      toast.error(err.message || 'Failed to fetch user roles');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Update user role
  const changeUserRole = async (userId, role) => {
    if (!isAuthenticated || !isSuperAdmin) return;
    
    setLoading(true);
    try {
      const data = await updateUserRole(userId, role);
      if (data && data.success) {
        setUserRoles(prevRoles => 
          prevRoles.map(user => 
            user._id === userId ? { ...user, role } : user
          )
        );
        toast.success(`User role updated to ${role}`);
      }
      setError(null);
      return data;
    } catch (err) {
      console.error('Error updating user role:', err);
      setError(err.message || 'Failed to update user role');
      toast.error(err.message || 'Failed to update user role');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch categories
  const fetchCategories = async () => {
    if (!isAuthenticated || !isSuperAdmin) return;
    
    setLoading(true);
    try {
      const data = await getCategories();
      if (data && data.success) {
        setCategories(data.data);
      }
      setError(null);
      return data;
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message || 'Failed to fetch categories');
      toast.error(err.message || 'Failed to fetch categories');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Create category
  const addCategory = async (categoryData) => {
    if (!isAuthenticated || !isSuperAdmin) return;
    
    setLoading(true);
    try {
      const data = await createCategory(categoryData);
      if (data && data.success) {
        setCategories(prevCategories => [data.data, ...prevCategories]);
        toast.success('Category created successfully');
      }
      setError(null);
      return data;
    } catch (err) {
      console.error('Error creating category:', err);
      setError(err.message || 'Failed to create category');
      toast.error(err.message || 'Failed to create category');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Update category
  const editCategory = async (categoryId, categoryData) => {
    if (!isAuthenticated || !isSuperAdmin) return;
    
    setLoading(true);
    try {
      const data = await updateCategory(categoryId, categoryData);
      if (data && data.success) {
        setCategories(prevCategories => 
          prevCategories.map(category => 
            category._id === categoryId ? data.data : category
          )
        );
        toast.success('Category updated successfully');
      }
      setError(null);
      return data;
    } catch (err) {
      console.error('Error updating category:', err);
      setError(err.message || 'Failed to update category');
      toast.error(err.message || 'Failed to update category');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Delete category
  const removeCategory = async (categoryId) => {
    if (!isAuthenticated || !isSuperAdmin) return;
    
    setLoading(true);
    try {
      const data = await deleteCategory(categoryId);
      if (data && data.success) {
        setCategories(prevCategories => 
          prevCategories.filter(category => category._id !== categoryId)
        );
        toast.success('Category deleted successfully');
      }
      setError(null);
      return data;
    } catch (err) {
      console.error('Error deleting category:', err);
      setError(err.message || 'Failed to delete category');
      toast.error(err.message || 'Failed to delete category');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch platform settings
  const fetchPlatformSettings = async () => {
    if (!isAuthenticated || !isSuperAdmin) return;
    
    setLoading(true);
    try {
      const data = await getPlatformSettings();
      if (data && data.success) {
        setPlatformSettings(data.data);
      }
      setError(null);
      return data;
    } catch (err) {
      console.error('Error fetching platform settings:', err);
      setError(err.message || 'Failed to fetch platform settings');
      toast.error(err.message || 'Failed to fetch platform settings');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Update platform settings
  const savePlatformSettings = async (settingsData) => {
    if (!isAuthenticated || !isSuperAdmin) return;
    
    setLoading(true);
    try {
      const data = await updatePlatformSettings(settingsData);
      if (data && data.success) {
        setPlatformSettings(data.data);
        toast.success('Platform settings updated successfully');
      }
      setError(null);
      return data;
    } catch (err) {
      console.error('Error updating platform settings:', err);
      setError(err.message || 'Failed to update platform settings');
      toast.error(err.message || 'Failed to update platform settings');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch audit logs
  const fetchAuditLogs = async (filters = {}) => {
    if (!isAuthenticated || !isSuperAdmin) return;
    
    setLoading(true);
    try {
      const data = await getAuditLogs(filters);
      if (data && data.success) {
        setAuditLogs(data.data);
      }
      setError(null);
      return data;
    } catch (err) {
      console.error('Error fetching audit logs:', err);
      setError(err.message || 'Failed to fetch audit logs');
      toast.error(err.message || 'Failed to fetch audit logs');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch featured products
  const fetchFeaturedProducts = async () => {
    if (!isAuthenticated || !isSuperAdmin) return;
    
    setLoading(true);
    try {
      const data = await getFeaturedProducts();
      if (data && data.success) {
        setFeaturedProducts(data.data);
      }
      setError(null);
      return data;
    } catch (err) {
      console.error('Error fetching featured products:', err);
      setError(err.message || 'Failed to fetch featured products');
      toast.error(err.message || 'Failed to fetch featured products');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Update featured products
  const saveFeaturedProducts = async (productIds) => {
    if (!isAuthenticated || !isSuperAdmin) return;
    
    setLoading(true);
    try {
      const data = await updateFeaturedProducts(productIds);
      if (data && data.success) {
        setFeaturedProducts(data.data);
        toast.success('Featured products updated successfully');
      }
      setError(null);
      return data;
    } catch (err) {
      console.error('Error updating featured products:', err);
      setError(err.message || 'Failed to update featured products');
      toast.error(err.message || 'Failed to update featured products');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Socket.IO event listeners for real-time updates
  useEffect(() => {
    if (!socket || !isAuthenticated || !isSuperAdmin) {
      return;
    }
    
    console.log('Setting up super admin Socket.IO event listeners');
    
    // Listen for system events
    socket.on('systemAlert', (alert) => {
      console.log('Socket event received: systemAlert', alert);
      setDashboardData(prev => ({
        ...prev,
        systemHealth: {
          ...prev.systemHealth,
          alerts: [alert, ...(prev.systemHealth.alerts || []).slice(0, 9)]
        },
        recentActivities: [
          { type: 'alert', data: alert, timestamp: new Date().toISOString() },
          ...prev.recentActivities.slice(0, 9)
        ]
      }));
      toast.warning(`System Alert: ${alert.message}`);
    });
    
    // Listen for user role changes
    socket.on('userRoleChanged', (userData) => {
      console.log('Socket event received: userRoleChanged', userData);
      setUserRoles(prevRoles => 
        prevRoles.map(user => 
          user._id === userData._id ? { ...user, role: userData.role } : user
        )
      );
      setDashboardData(prev => ({
        ...prev,
        recentActivities: [
          { 
            type: 'roleChange', 
            data: userData, 
            timestamp: new Date().toISOString() 
          },
          ...prev.recentActivities.slice(0, 9)
        ]
      }));
    });
    
    // Listen for category changes
    socket.on('categoryCreated', (category) => {
      console.log('Socket event received: categoryCreated', category);
      setCategories(prevCategories => [category, ...prevCategories]);
    });
    
    socket.on('categoryUpdated', (category) => {
      console.log('Socket event received: categoryUpdated', category);
      setCategories(prevCategories => 
        prevCategories.map(cat => 
          cat._id === category._id ? category : cat
        )
      );
    });
    
    socket.on('categoryDeleted', (categoryId) => {
      console.log('Socket event received: categoryDeleted', categoryId);
      setCategories(prevCategories => 
        prevCategories.filter(cat => cat._id !== categoryId)
      );
    });
    
    // Listen for platform settings changes
    socket.on('platformSettingsUpdated', (settings) => {
      console.log('Socket event received: platformSettingsUpdated', settings);
      setPlatformSettings(settings);
    });
    
    // Listen for audit log events
    socket.on('auditLogCreated', (log) => {
      console.log('Socket event received: auditLogCreated', log);
      setAuditLogs(prevLogs => [log, ...prevLogs]);
      setDashboardData(prev => ({
        ...prev,
        recentActivities: [
          { type: 'audit', data: log, timestamp: new Date().toISOString() },
          ...prev.recentActivities.slice(0, 9)
        ]
      }));
    });
    
    return () => {
      socket.off('systemAlert');
      socket.off('userRoleChanged');
      socket.off('categoryCreated');
      socket.off('categoryUpdated');
      socket.off('categoryDeleted');
      socket.off('platformSettingsUpdated');
      socket.off('auditLogCreated');
    };
  }, [socket, user, isAuthenticated, isSuperAdmin]);
  
  return (
    <SuperAdminContext.Provider
      value={{
        dashboardData,
        userRoles,
        categories,
        platformSettings,
        auditLogs,
        featuredProducts,
        loading,
        error,
        fetchDashboardData,
        fetchUserRoles,
        changeUserRole,
        fetchCategories,
        addCategory,
        editCategory,
        removeCategory,
        fetchPlatformSettings,
        savePlatformSettings,
        fetchAuditLogs,
        fetchFeaturedProducts,
        saveFeaturedProducts
      }}
    >
      {children}
    </SuperAdminContext.Provider>
  );
};

export default SuperAdminContext;
