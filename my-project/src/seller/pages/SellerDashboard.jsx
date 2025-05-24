import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import DashboardLayout from '../../shared/components/DashboardLayout';
import StatsCard from '../../shared/components/StatsCard';
import { luxuryTheme } from '../../styles/luxuryTheme';

// Mock data for seller dashboard
const mockStats = {
  totalProducts: 24,
  totalOrders: 156,
  totalRevenue: 12850,
  pendingOrders: 8,
  averageRating: 4.7
};

// Mock data for recent orders
const mockRecentOrders = [
  { id: 1, customer: 'John Doe', date: '2025-05-18', total: 350, status: 'delivered' },
  { id: 2, customer: 'Jane Smith', date: '2025-05-19', total: 210, status: 'processing' },
  { id: 3, customer: 'Robert Johnson', date: '2025-05-19', total: 175, status: 'shipped' },
  { id: 4, customer: 'Emily Davis', date: '2025-05-20', total: 420, status: 'processing' },
];

// Mock data for best-selling products
const mockBestSellers = [
  { id: 1, name: 'Luxury Watch', sold: 28, revenue: 5600 },
  { id: 2, name: 'Gold Bracelet', sold: 24, revenue: 3600 },
  { id: 3, name: 'Diamond Earrings', sold: 19, revenue: 2850 },
  { id: 4, name: 'Silk Scarf', sold: 15, revenue: 1800 },
];

const SellerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(mockStats);
  const [recentOrders, setRecentOrders] = useState(mockRecentOrders);
  const [bestSellers, setBestSellers] = useState(mockBestSellers);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data fetching
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real app, you would fetch data from your API here
        // const response = await fetch('/api/seller/dashboard');
        // const data = await response.json();
        
        // For now, we'll use mock data
        setStats(mockStats);
        setRecentOrders(mockRecentOrders);
        setBestSellers(mockBestSellers);
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
            trendValue="+12%"
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
            trend="up"
            trendValue="+8.5%"
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
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, index) => (
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
                      <tr key={order.id} className="hover:bg-black/20">
                        <td 
                          className="px-4 py-4 whitespace-nowrap text-sm text-gold"
                          style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                        >
                          #{order.id}
                        </td>
                        <td 
                          className="px-4 py-4 whitespace-nowrap text-sm text-white"
                          style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                        >
                          {order.customer}
                        </td>
                        <td 
                          className="px-4 py-4 whitespace-nowrap text-sm text-gray-300"
                          style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                        >
                          {order.date}
                        </td>
                        <td 
                          className="px-4 py-4 whitespace-nowrap text-sm text-white"
                          style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                        >
                          {formatCurrency(order.total)}
                        </td>
                        <td 
                          className={`px-4 py-4 whitespace-nowrap text-sm capitalize ${getStatusColor(order.status)}`}
                          style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                        >
                          {order.status}
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
                View All Orders
              </button>
            </div>
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
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, index) => (
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
                          {product.sold}
                        </td>
                        <td 
                          className="px-4 py-4 whitespace-nowrap text-sm text-gold"
                          style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                        >
                          {formatCurrency(product.revenue)}
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
                View All Products
              </button>
            </div>
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <h3 
            className="text-white font-medium mb-1"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
          >
            Add New Product
          </h3>
          <p 
            className="text-sm text-gray-400"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
          >
            Create a new product listing
          </p>
        </button>
        
        <button 
          className="p-6 bg-neutral-800 border border-gold/20 hover:border-gold/50 hover:bg-black/20 transition-all duration-300 flex flex-col items-center justify-center text-center"
          style={{ boxShadow: luxuryTheme.shadows.sm }}
        >
          <svg className="w-8 h-8 text-gold mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
          <h3 
            className="text-white font-medium mb-1"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
          >
            Create Promotion
          </h3>
          <p 
            className="text-sm text-gray-400"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
          >
            Set up discounts and offers
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

export default SellerDashboard;
