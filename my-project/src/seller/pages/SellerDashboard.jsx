import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { useSeller } from '../../hooks/useSeller';
import DashboardLayout from '../../shared/components/DashboardLayout';
import StatsCard from '../../shared/components/StatsCard';
import { luxuryTheme } from '../../styles/luxuryTheme';
import { toast } from 'react-toastify';

const SellerDashboard = () => {
  const { user } = useAuth();
  const { 
    dashboardData, 
    loading: contextLoading, 
    error, 
    fetchDashboardData,
    products,
    orders
  } = useSeller();
  
  const [isLoading, setIsLoading] = useState(true);

  // Fetch dashboard data from backend
  useEffect(() => {
    // Only fetch data if user is authenticated and is a seller
    if (user?.role === 'seller') {
      const loadDashboardData = async () => {
        setIsLoading(true);
        try {
          await fetchDashboardData();
        } catch (err) {
          console.error('Error fetching dashboard data:', err);
          // Don't show toast error for approval_pending errors
          if (!err.message || !err.message.includes('not approved')) {
            toast.error('Failed to load dashboard data');
          }
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
      case 'delivered':
        return 'text-emerald-400';
      case 'shipped':
        return 'text-blue-400';
      case 'processing':
        return 'text-amber-400';
      case 'cancelled':
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
    totalProducts: dashboardData?.totalProducts || 0,
    totalOrders: dashboardData?.totalOrders || 0,
    totalRevenue: dashboardData?.totalRevenue || 0,
    pendingOrders: dashboardData?.pendingOrders || 0,
    averageRating: dashboardData?.averageRating || 0
  };

  // Get recent orders from real data
  const recentOrders = orders?.slice(0, 5) || [];

  // Get best sellers from real data
  const bestSellers = dashboardData?.bestSellers || [];

  const loading = isLoading || contextLoading;

  // Check if seller approval is pending
  const isApprovalPending = error === 'approval_pending';

  return (
    <DashboardLayout activeTab="dashboard">
      {/* Welcome message */}
      <div className="mb-8">
        <h1 
          className="text-2xl font-bold text-white mb-2"
          style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
        >
          Welcome back, {user?.name}
        </h1>
        {isApprovalPending ? (
          <p 
            className="text-amber-400"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
          >
            Your seller account is pending approval. You'll have access to the full dashboard once approved.
          </p>
        ) : (
          <p 
            className="text-gray-400"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
          >
            Here's what's happening with your store today.
          </p>
        )}
      </div>

      {/* Stats cards */}
      {isApprovalPending ? (
        <div className="bg-neutral-800 border border-gold/20 p-8 rounded-sm mb-8">
          <div className="flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-400">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white">Seller Account Pending Approval</h2>
            <p className="text-gray-400 max-w-lg">
              Your seller application is currently under review. Once approved, you'll have access to all seller features including product management, orders, analytics, and more.
            </p>
            <div className="flex flex-col space-y-4 w-full max-w-md">
              <div className="bg-neutral-700/30 p-4 rounded-sm">
                <h3 className="text-white font-medium mb-2">What happens next?</h3>
                <ol className="text-gray-400 list-decimal list-inside space-y-2">
                  <li>Our admin team reviews your application</li>
                  <li>You'll receive an email notification when approved</li>
                  <li>Full dashboard access will be granted immediately</li>
                </ol>
              </div>
              <div className="bg-neutral-700/30 p-4 rounded-sm">
                <h3 className="text-white font-medium mb-2">While you wait</h3>
                <p className="text-gray-400">
                  You can update your profile information and prepare product details for when your account is approved.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, index) => (
            <div 
              key={index} 
              className="bg-neutral-800 border border-gold/20 p-6 rounded-sm animate-pulse h-32"
            ></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
            value={formatCurrency(stats.totalRevenue)}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            trend={dashboardData?.revenueTrend?.direction || "none"}
            trendValue={dashboardData?.revenueTrend?.value || "0%"}
            trendLabel="vs last month"
          />
          
          <StatsCard
            title="Average Rating"
            value={stats.averageRating}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            }
          />
        </div>
      )}

      {/* Main content */}
      {!isApprovalPending && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent orders */}
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
              Recent Orders
            </h2>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="animate-pulse h-16 bg-neutral-700/50 rounded-sm"></div>
                ))}
              </div>
            ) : recentOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gold/10">
                  <thead>
                    <tr>
                      <th 
                        className="px-4 py-3 text-left text-xs font-medium text-gold uppercase tracking-wider"
                        style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                      >
                        Order ID
                      </th>
                      <th 
                        className="px-4 py-3 text-left text-xs font-medium text-gold uppercase tracking-wider"
                        style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                      >
                        Customer
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
                        Total
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
                    {recentOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-neutral-700/30 transition-colors">
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                          #{order.orderNumber || order._id.substring(0, 8)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-white">
                          {order.user?.name || 'Customer'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-white">
                          {formatCurrency(order.sellerTotal || order.total)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <span className={`${getStatusColor(order.status)} capitalize`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}

                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>No recent orders found</p>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-gold/20 text-center">
            <a 
              href="/seller/orders" 
              className="text-gold hover:text-gold/80 text-sm font-medium"
              style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
            >
              View all orders →
            </a>
          </div>
        </motion.div>
        
        {/* Best selling products */}
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
              Best Selling Products
            </h2>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="animate-pulse h-16 bg-neutral-700/50 rounded-sm"></div>
                ))}
              </div>
            ) : bestSellers.length > 0 ? (
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
                        Units Sold
                      </th>
                      <th 
                        className="px-4 py-3 text-left text-xs font-medium text-gold uppercase tracking-wider"
                        style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                      >
                        Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold/10">
                    {bestSellers.map((product) => (
                      <tr key={product._id || product.id} className="hover:bg-neutral-700/30 transition-colors">
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-white">
                          {product.name}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                          {product.unitsSold || product.sold}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-white">
                          {formatCurrency(product.revenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>No best-selling products found</p>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-gold/20 text-center">
            <a 
              href="/seller/products" 
              className="text-gold hover:text-gold/80 text-sm font-medium"
              style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
            >
              View all products →
            </a>
          </div>
        </motion.div>
      </div>
      )}
      
      {/* Recent activity */}
      {!isApprovalPending && (
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
                    {activity.type === 'order' ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    ) : activity.type === 'product' ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
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
      )}
    </DashboardLayout>
  );
};

export default SellerDashboard;
