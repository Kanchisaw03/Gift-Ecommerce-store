import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { useAdmin } from '../../hooks/useAdmin';
import DashboardLayout from '../../shared/components/DashboardLayout';
import StatsCard from '../../shared/components/StatsCard';
import { luxuryTheme } from '../../styles/luxuryTheme';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { 
    dashboardData, 
    loading: contextLoading, 
    error, 
    fetchDashboardData,
    users,
    products,
    pendingProducts,
    orders
  } = useAdmin();
  
  const [isLoading, setIsLoading] = useState(true);

  // Fetch dashboard data from backend
  useEffect(() => {
    // Only fetch data if user is authenticated and is an admin
    if (user?.role === 'admin' || user?.role === 'super_admin') {
      const loadDashboardData = async () => {
        setIsLoading(true);
        try {
          await fetchDashboardData();
        } catch (err) {
          console.error('Error fetching dashboard data:', err);
          toast.error('Failed to load dashboard data');
        } finally {
          setIsLoading(false);
        }
      };
      
      loadDashboardData();
    }
    // Remove fetchDashboardData from dependencies to prevent infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-emerald-400';
      case 'pending':
        return 'text-amber-400';
      case 'suspended':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Calculate stats from real data
  const stats = {
    totalUsers: dashboardData?.totalUsers || 0,
    totalProducts: dashboardData?.totalProducts || 0,
    pendingProducts: dashboardData?.pendingProducts || 0,
    totalOrders: dashboardData?.totalOrders || 0,
    revenue: dashboardData?.totalRevenue || 0
  };

  // Get recent users from real data
  const recentUsers = users?.slice(0, 5) || [];

  // Get pending products from real data
  const pendingProductsList = pendingProducts || [];

  const loading = isLoading || contextLoading;

  return (
    <DashboardLayout activeTab="dashboard" role="admin">
      {/* Welcome message */}
      <div className="mb-8">
        <h1 
          className="text-2xl font-bold text-white mb-2"
          style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
        >
          Welcome back, {user?.name}
        </h1>
        <p 
          className="text-gray-400"
          style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
        >
          Here's what's happening across the platform today.
        </p>
      </div>

      {/* Stats cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {[...Array(5)].map((_, index) => (
            <div 
              key={index} 
              className="bg-neutral-800 border border-gold/20 p-6 rounded-sm animate-pulse h-32"
            ></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatsCard
            title="Total Users"
            value={stats.totalUsers}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
            trend={dashboardData?.usersTrend?.direction || "none"}
            trendValue={dashboardData?.usersTrend?.value || "0%"}
            trendLabel="vs last month"
          />
          
          <StatsCard
            title="Total Products"
            value={stats.totalProducts}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            }
          />
          
          <StatsCard
            title="Pending Products"
            value={stats.pendingProducts}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            trend={parseInt(stats.pendingProducts) > 0 ? "up" : "none"}
            trendValue={`${stats.pendingProducts} new`}
            trendLabel="need review"
          />
          
          <StatsCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            }
            trend={dashboardData?.ordersTrend?.direction || "none"}
            trendValue={dashboardData?.ordersTrend?.value || "0%"}
            trendLabel="vs last month"
          />
          
          <StatsCard
            title="Total Revenue"
            value={formatCurrency(stats.revenue)}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            trend={dashboardData?.revenueTrend?.direction || "none"}
            trendValue={dashboardData?.revenueTrend?.value || "0%"}
            trendLabel="vs last month"
          />
        </div>
      )}

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-neutral-800 border border-gold/20 rounded-sm overflow-hidden"
          style={{ boxShadow: luxuryTheme.shadows.sm }}
        >
          <div className="p-6 border-b border-gold/20">
            <h2 
              className="text-lg font-semibold text-white"
              style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
            >
              Recent Users
            </h2>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="animate-pulse h-16 bg-neutral-700/50 rounded-sm"></div>
                ))}
              </div>
            ) : recentUsers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gold/10">
                  <thead>
                    <tr>
                      <th 
                        className="px-4 py-3 text-left text-xs font-medium text-gold uppercase tracking-wider"
                        style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                      >
                        Name
                      </th>
                      <th 
                        className="px-4 py-3 text-left text-xs font-medium text-gold uppercase tracking-wider"
                        style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                      >
                        Email
                      </th>
                      <th 
                        className="px-4 py-3 text-left text-xs font-medium text-gold uppercase tracking-wider"
                        style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                      >
                        Role
                      </th>
                      <th 
                        className="px-4 py-3 text-left text-xs font-medium text-gold uppercase tracking-wider"
                        style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                      >
                        Date
                      </th>
                      <th 
                        className="px-4 py-3 text-left text-xs font-medium text-gold uppercase tracking-wider"
                        style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold/10">
                    {recentUsers.map((user) => (
                      <tr key={user._id || user.id} className="hover:bg-neutral-700/30 transition-colors">
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-white">
                          {user.name}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                          {user.email}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <span className="px-2 py-1 text-xs font-medium rounded-full capitalize bg-gold/10 text-gold">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                          {new Date(user.createdAt || user.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <span className={`${getStatusColor(user.status)} capitalize`}>
                            {user.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>No recent users found</p>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-gold/20 text-center">
            <a 
              href="/admin/users" 
              className="text-gold hover:text-gold/80 text-sm font-medium"
              style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
            >
              View all users →
            </a>
          </div>
        </motion.div>
        
        {/* Pending products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-neutral-800 border border-gold/20 rounded-sm overflow-hidden"
          style={{ boxShadow: luxuryTheme.shadows.sm }}
        >
          <div className="p-6 border-b border-gold/20">
            <h2 
              className="text-lg font-semibold text-white"
              style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
            >
              Pending Products
            </h2>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="animate-pulse h-16 bg-neutral-700/50 rounded-sm"></div>
                ))}
              </div>
            ) : pendingProductsList.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gold/10">
                  <thead>
                    <tr>
                      <th 
                        className="px-4 py-3 text-left text-xs font-medium text-gold uppercase tracking-wider"
                        style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                      >
                        Product
                      </th>
                      <th 
                        className="px-4 py-3 text-left text-xs font-medium text-gold uppercase tracking-wider"
                        style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                      >
                        Seller
                      </th>
                      <th 
                        className="px-4 py-3 text-left text-xs font-medium text-gold uppercase tracking-wider"
                        style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                      >
                        Date
                      </th>
                      <th 
                        className="px-4 py-3 text-left text-xs font-medium text-gold uppercase tracking-wider"
                        style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                      >
                        Price
                      </th>
                      <th 
                        className="px-4 py-3 text-left text-xs font-medium text-gold uppercase tracking-wider"
                        style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold/10">
                    {pendingProductsList.map((product) => (
                      <tr key={product._id || product.id} className="hover:bg-neutral-700/30 transition-colors">
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-white">
                          {product.name}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                          {product.seller?.name || product.seller}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                          {new Date(product.createdAt || product.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-white">
                          {formatCurrency(product.price)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm space-x-2">
                          <button 
                            className="px-3 py-1 bg-emerald-500 text-white text-xs rounded hover:bg-emerald-600 transition-colors"
                            onClick={() => {
                              // In a real app, this would call an API to approve the product
                              toast.success(`Product ${product.name} approved`);
                            }}
                          >
                            Approve
                          </button>
                          <button 
                            className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                            onClick={() => {
                              // In a real app, this would call an API to reject the product
                              toast.info(`Product ${product.name} rejected`);
                            }}
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>No pending products found</p>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-gold/20 text-center">
            <a 
              href="/admin/products" 
              className="text-gold hover:text-gold/80 text-sm font-medium"
              style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
            >
              View all products →
            </a>
          </div>
        </motion.div>
      </div>
      
      {/* Recent activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-8 bg-neutral-800 border border-gold/20 rounded-sm overflow-hidden"
        style={{ boxShadow: luxuryTheme.shadows.sm }}
      >
        <div className="p-6 border-b border-gold/20">
          <h2 
            className="text-lg font-semibold text-white"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
          >
            Recent Activity
          </h2>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="animate-pulse h-12 bg-neutral-700/50 rounded-sm"></div>
              ))}
            </div>
          ) : dashboardData?.recentActivity?.length > 0 ? (
            <ul className="space-y-4">
              {dashboardData.recentActivity.map((activity, index) => (
                <li key={index} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold flex-shrink-0">
                    {activity.type === 'user' ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    ) : activity.type === 'product' ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    ) : activity.type === 'order' ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-white text-sm">{activity.message}</p>
                    <p className="text-gray-400 text-xs mt-1">{new Date(activity.timestamp).toLocaleString()}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p>No recent activity found</p>
            </div>
          )}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
