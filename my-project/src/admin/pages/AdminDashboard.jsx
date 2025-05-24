import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import DashboardLayout from '../../shared/components/DashboardLayout';
import StatsCard from '../../shared/components/StatsCard';
import { luxuryTheme } from '../../styles/luxuryTheme';

// Mock data for admin dashboard
const mockStats = {
  totalUsers: 254,
  totalProducts: 186,
  pendingProducts: 12,
  totalOrders: 1247,
  revenue: 156750
};

// Mock data for recent users
const mockRecentUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'buyer', date: '2025-05-18', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'seller', date: '2025-05-19', status: 'active' },
  { id: 3, name: 'Robert Johnson', email: 'robert@example.com', role: 'buyer', date: '2025-05-19', status: 'active' },
  { id: 4, name: 'Emily Davis', email: 'emily@example.com', role: 'seller', date: '2025-05-20', status: 'pending' },
  { id: 5, name: 'Michael Brown', email: 'michael@example.com', role: 'buyer', date: '2025-05-20', status: 'active' },
];

// Mock data for pending products
const mockPendingProducts = [
  { id: 1, name: 'Luxury Watch', seller: 'Jane Smith', date: '2025-05-19', price: 1200, status: 'pending' },
  { id: 2, name: 'Gold Bracelet', seller: 'Emily Davis', date: '2025-05-20', price: 850, status: 'pending' },
  { id: 3, name: 'Diamond Earrings', seller: 'Jane Smith', date: '2025-05-20', price: 1500, status: 'pending' },
  { id: 4, name: 'Silk Scarf', seller: 'Emily Davis', date: '2025-05-20', price: 120, status: 'pending' },
];

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(mockStats);
  const [recentUsers, setRecentUsers] = useState(mockRecentUsers);
  const [pendingProducts, setPendingProducts] = useState(mockPendingProducts);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data fetching
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real app, you would fetch data from your API here
        // const response = await fetch('/api/admin/dashboard');
        // const data = await response.json();
        
        // For now, we'll use mock data
        setStats(mockStats);
        setRecentUsers(mockRecentUsers);
        setPendingProducts(mockPendingProducts);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Simulate API delay
    const timer = setTimeout(() => {
      fetchDashboardData();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Handle approve product
  const handleApproveProduct = async (productId) => {
    try {
      // In a real app, you would call your API here
      // await fetch(`/api/admin/products/${productId}/approve`, {
      //   method: 'PATCH'
      // });
      
      // For now, we'll just update the local state
      setPendingProducts(pendingProducts.filter(p => p.id !== productId));
      
      // Update stats
      setStats({
        ...stats,
        pendingProducts: stats.pendingProducts - 1
      });
    } catch (error) {
      console.error('Error approving product:', error);
    }
  };

  // Handle reject product
  const handleRejectProduct = async (productId) => {
    try {
      // In a real app, you would call your API here
      // await fetch(`/api/admin/products/${productId}/reject`, {
      //   method: 'PATCH'
      // });
      
      // For now, we'll just update the local state
      setPendingProducts(pendingProducts.filter(p => p.id !== productId));
      
      // Update stats
      setStats({
        ...stats,
        pendingProducts: stats.pendingProducts - 1
      });
    } catch (error) {
      console.error('Error rejecting product:', error);
    }
  };

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
        <p 
          className="text-gray-400"
          style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
        >
          Here's what's happening with your store today.
        </p>
      </div>

      {/* Stats cards */}
      {isLoading ? (
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
            title="Total Users"
            value={stats.totalUsers}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
            trend="up"
            trendValue="+5.2%"
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
            title="Total Orders"
            value={stats.totalOrders}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            }
            trend="up"
            trendValue="+12.8%"
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
            trend="up"
            trendValue="+8.5%"
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
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="animate-pulse h-16 bg-neutral-700/50 rounded-sm"></div>
                ))}
              </div>
            ) : (
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
                      <tr key={user.id} className="hover:bg-black/20">
                        <td 
                          className="px-4 py-4 whitespace-nowrap"
                          style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                              <span className="text-gold text-sm font-semibold">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-white">{user.name}</p>
                              <p className="text-xs text-gray-400">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td 
                          className="px-4 py-4 whitespace-nowrap text-sm text-gray-300 capitalize"
                          style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                        >
                          {user.role}
                        </td>
                        <td 
                          className="px-4 py-4 whitespace-nowrap text-sm text-gray-300"
                          style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                        >
                          {user.date}
                        </td>
                        <td 
                          className="px-4 py-4 whitespace-nowrap text-sm"
                          style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                        >
                          <span className={`px-2 py-1 rounded-sm text-xs uppercase ${
                            user.status === 'active' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-amber-900/30 text-amber-400'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            <div className="mt-4 text-center">
              <button 
                className="text-gold hover:text-gold-light text-sm"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                View All Users
              </button>
            </div>
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
            <div className="flex justify-between items-center">
              <h2 
                className="text-lg font-semibold text-white"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
              >
                Pending Products
              </h2>
              
              <span 
                className="bg-amber-900/30 text-amber-400 px-2 py-1 rounded-sm text-xs"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                {stats.pendingProducts} pending
              </span>
            </div>
          </div>
          
          <div className="p-6">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="animate-pulse h-16 bg-neutral-700/50 rounded-sm"></div>
                ))}
              </div>
            ) : pendingProducts.length > 0 ? (
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
                    {pendingProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-black/20">
                        <td 
                          className="px-4 py-4 whitespace-nowrap text-sm text-white"
                          style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                        >
                          {product.name}
                        </td>
                        <td 
                          className="px-4 py-4 whitespace-nowrap text-sm text-gray-300"
                          style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                        >
                          {product.seller}
                        </td>
                        <td 
                          className="px-4 py-4 whitespace-nowrap text-sm text-gold"
                          style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                        >
                          {formatCurrency(product.price)}
                        </td>
                        <td 
                          className="px-4 py-4 whitespace-nowrap text-sm"
                          style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                        >
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApproveProduct(product.id)}
                              className="px-2 py-1 bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50 rounded-sm text-xs"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectProduct(product.id)}
                              className="px-2 py-1 bg-red-900/30 text-red-400 hover:bg-red-900/50 rounded-sm text-xs"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p 
                  className="text-gray-400"
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                >
                  No pending products to review
                </p>
              </div>
            )}
            
            {pendingProducts.length > 0 && (
              <div className="mt-4 text-center">
                <button 
                  className="text-gold hover:text-gold-light text-sm"
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                >
                  View All Pending Products
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <button 
          className="p-6 bg-neutral-800 border border-gold/20 hover:border-gold/50 hover:bg-black/20 transition-all duration-300 flex flex-col items-center justify-center text-center"
          style={{ boxShadow: luxuryTheme.shadows.sm }}
        >
          <svg className="w-8 h-8 text-gold mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <h3 
            className="text-white font-medium mb-1"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
          >
            Manage Users
          </h3>
          <p 
            className="text-sm text-gray-400"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
          >
            View and manage user accounts
          </p>
        </button>
        
        <button 
          className="p-6 bg-neutral-800 border border-gold/20 hover:border-gold/50 hover:bg-black/20 transition-all duration-300 flex flex-col items-center justify-center text-center"
          style={{ boxShadow: luxuryTheme.shadows.sm }}
        >
          <svg className="w-8 h-8 text-gold mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 
            className="text-white font-medium mb-1"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
          >
            Manage Products
          </h3>
          <p 
            className="text-sm text-gray-400"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
          >
            Review and moderate products
          </p>
        </button>
        
        <button 
          className="p-6 bg-neutral-800 border border-gold/20 hover:border-gold/50 hover:bg-black/20 transition-all duration-300 flex flex-col items-center justify-center text-center"
          style={{ boxShadow: luxuryTheme.shadows.sm }}
        >
          <svg className="w-8 h-8 text-gold mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 
            className="text-white font-medium mb-1"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
          >
            View Reports
          </h3>
          <p 
            className="text-sm text-gray-400"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
          >
            Analyze sales and performance
          </p>
        </button>
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
