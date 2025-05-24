import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StatsCard from '../../shared/components/StatsCard';
import { luxuryTheme } from '../../styles/luxuryTheme';

// Mock data for dashboard stats
const mockStatsData = {
  totalUsers: 254,
  totalSellers: 48,
  totalBuyers: 206,
  totalProducts: 186,
  pendingProducts: 12,
  totalOrders: 1247,
  revenue: 156750,
  revenueGrowth: 14.8,
  ordersGrowth: 12.8,
  usersGrowth: 5.2
};

// Mock data for sales by category
const mockCategoryData = [
  { category: 'Watches', revenue: 42500, percentage: 27 },
  { category: 'Jewelry', revenue: 38200, percentage: 24 },
  { category: 'Accessories', revenue: 25000, percentage: 16 },
  { category: 'Fragrances', revenue: 18500, percentage: 12 },
  { category: 'Home Decor', revenue: 16800, percentage: 11 },
  { category: 'Leather Goods', revenue: 15750, percentage: 10 }
];

// Mock data for monthly sales
const mockMonthlySales = [
  { month: 'Jan', revenue: 8500, orders: 42 },
  { month: 'Feb', revenue: 7200, orders: 36 },
  { month: 'Mar', revenue: 9800, orders: 48 },
  { month: 'Apr', revenue: 11200, orders: 55 },
  { month: 'May', revenue: 12850, orders: 62 }
];

const DashboardStats = () => {
  const [statsData, setStatsData] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('monthly');

  // Simulate data fetching
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        // In a real app, you would fetch data from your API here
        // const response = await fetch(`/api/admin/stats?timeframe=${timeframe}`);
        // const data = await response.json();
        
        // For now, we'll use mock data
        setStatsData(mockStatsData);
        setCategoryData(mockCategoryData);
        setMonthlySales(mockMonthlySales);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Simulate API delay
    const timer = setTimeout(() => {
      fetchDashboardStats();
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeframe]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Find the highest revenue value for scaling
  const maxRevenue = monthlySales.length > 0 
    ? Math.max(...monthlySales.map(item => item.revenue))
    : 0;

  return (
    <div>
      {/* Header with timeframe selector */}
      <div className="flex justify-between items-center mb-6">
        <h2 
          className="text-xl font-bold text-white"
          style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
        >
          Dashboard Statistics
        </h2>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeframe('monthly')}
            className={`px-3 py-1 text-sm ${
              timeframe === 'monthly'
                ? 'bg-gold/20 text-gold border border-gold/50'
                : 'border border-gold/30 text-gray-300 hover:bg-gold/10 hover:text-gold'
            }`}
            style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
          >
            Monthly
          </button>
          
          <button
            onClick={() => setTimeframe('quarterly')}
            className={`px-3 py-1 text-sm ${
              timeframe === 'quarterly'
                ? 'bg-gold/20 text-gold border border-gold/50'
                : 'border border-gold/30 text-gray-300 hover:bg-gold/10 hover:text-gold'
            }`}
            style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
          >
            Quarterly
          </button>
          
          <button
            onClick={() => setTimeframe('yearly')}
            className={`px-3 py-1 text-sm ${
              timeframe === 'yearly'
                ? 'bg-gold/20 text-gold border border-gold/50'
                : 'border border-gold/30 text-gray-300 hover:bg-gold/10 hover:text-gold'
            }`}
            style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
          >
            Yearly
          </button>
        </div>
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
            value={statsData.totalUsers}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
            trend="up"
            trendValue={`+${statsData.usersGrowth}%`}
            trendLabel="vs last month"
          />
          
          <StatsCard
            title="Total Products"
            value={statsData.totalProducts}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            }
          />
          
          <StatsCard
            title="Total Orders"
            value={statsData.totalOrders}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            }
            trend="up"
            trendValue={`+${statsData.ordersGrowth}%`}
            trendLabel="vs last month"
          />
          
          <StatsCard
            title="Total Revenue"
            value={formatCurrency(statsData.revenue)}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            trend="up"
            trendValue={`+${statsData.revenueGrowth}%`}
            trendLabel="vs last month"
          />
        </div>
      )}
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Monthly Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-neutral-800 border border-gold/20 p-6 rounded-sm"
          style={{ boxShadow: luxuryTheme.shadows.sm }}
        >
          <h3 
            className="text-lg font-medium text-white mb-6"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
          >
            Monthly Revenue
          </h3>
          
          {isLoading ? (
            <div className="animate-pulse h-64 bg-neutral-700/50 rounded-sm"></div>
          ) : (
            <div className="h-64 relative">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 py-2">
                <span>{formatCurrency(maxRevenue)}</span>
                <span>{formatCurrency(maxRevenue * 0.75)}</span>
                <span>{formatCurrency(maxRevenue * 0.5)}</span>
                <span>{formatCurrency(maxRevenue * 0.25)}</span>
                <span>$0</span>
              </div>
              
              {/* Chart */}
              <div className="ml-12 h-full flex items-end">
                {monthlySales.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex-1 flex flex-col items-center justify-end h-full"
                  >
                    {/* Bar */}
                    <motion.div 
                      className="w-6 bg-gradient-to-t from-gold/50 to-gold mb-2"
                      style={{ 
                        height: `${(item.revenue / maxRevenue) * 100}%`,
                        minHeight: item.revenue > 0 ? '4px' : '0'
                      }}
                      initial={{ height: 0 }}
                      animate={{ height: `${(item.revenue / maxRevenue) * 100}%` }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                    ></motion.div>
                    
                    {/* Month label */}
                    <span 
                      className="text-xs text-gray-400"
                      style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                    >
                      {item.month}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
        
        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-neutral-800 border border-gold/20 p-6 rounded-sm"
          style={{ boxShadow: luxuryTheme.shadows.sm }}
        >
          <h3 
            className="text-lg font-medium text-white mb-6"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
          >
            Sales by Category
          </h3>
          
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="h-10 bg-neutral-700/50 rounded-sm"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {categoryData.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span 
                      className="text-sm text-white"
                      style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                    >
                      {item.category}
                    </span>
                    <span 
                      className="text-sm text-gold"
                      style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                    >
                      {formatCurrency(item.revenue)} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-black/30 h-2 rounded-sm overflow-hidden">
                    <motion.div 
                      className="h-full bg-gold"
                      style={{ width: '0%' }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ duration: 0.8, delay: 0.2 * index }}
                    ></motion.div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
      
      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-neutral-800 border border-gold/20 p-6 rounded-sm"
          style={{ boxShadow: luxuryTheme.shadows.sm }}
        >
          <h3 
            className="text-lg font-medium text-white mb-4"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
          >
            User Breakdown
          </h3>
          
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-40 bg-neutral-700/50 rounded-sm"></div>
            </div>
          ) : (
            <div>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span 
                      className="text-xs font-semibold inline-block text-gold"
                      style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                    >
                      Buyers
                    </span>
                  </div>
                  <div>
                    <span 
                      className="text-xs font-semibold inline-block text-gold"
                      style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                    >
                      {Math.round((statsData.totalBuyers / statsData.totalUsers) * 100)}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-sm bg-black/30">
                  <motion.div 
                    style={{ width: "0%" }}
                    animate={{ width: `${(statsData.totalBuyers / statsData.totalUsers) * 100}%` }}
                    transition={{ duration: 0.8 }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gold"
                  ></motion.div>
                </div>
              </div>
              
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span 
                      className="text-xs font-semibold inline-block text-gold"
                      style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                    >
                      Sellers
                    </span>
                  </div>
                  <div>
                    <span 
                      className="text-xs font-semibold inline-block text-gold"
                      style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                    >
                      {Math.round((statsData.totalSellers / statsData.totalUsers) * 100)}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-sm bg-black/30">
                  <motion.div 
                    style={{ width: "0%" }}
                    animate={{ width: `${(statsData.totalSellers / statsData.totalUsers) * 100}%` }}
                    transition={{ duration: 0.8 }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gold/70"
                  ></motion.div>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-black/20 p-3 border border-gold/20">
                  <div 
                    className="text-xs text-gray-400 mb-1"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                  >
                    Total Buyers
                  </div>
                  <div 
                    className="text-xl text-white"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                  >
                    {statsData.totalBuyers}
                  </div>
                </div>
                
                <div className="bg-black/20 p-3 border border-gold/20">
                  <div 
                    className="text-xs text-gray-400 mb-1"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                  >
                    Total Sellers
                  </div>
                  <div 
                    className="text-xl text-white"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                  >
                    {statsData.totalSellers}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
        
        {/* Pending Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-neutral-800 border border-gold/20 p-6 rounded-sm"
          style={{ boxShadow: luxuryTheme.shadows.sm }}
        >
          <h3 
            className="text-lg font-medium text-white mb-4"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
          >
            Pending Approvals
          </h3>
          
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-40 bg-neutral-700/50 rounded-sm"></div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40">
              <div 
                className="text-4xl font-bold text-gold mb-2"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
              >
                {statsData.pendingProducts}
              </div>
              <div 
                className="text-gray-400 text-center"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                Products awaiting approval
              </div>
              
              <button 
                className="mt-4 px-4 py-2 border border-gold/30 text-gold hover:bg-gold/10 transition-all duration-300"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                Review Products
              </button>
            </div>
          )}
        </motion.div>
        
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="bg-neutral-800 border border-gold/20 p-6 rounded-sm"
          style={{ boxShadow: luxuryTheme.shadows.sm }}
        >
          <h3 
            className="text-lg font-medium text-white mb-4"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
          >
            Recent Activity
          </h3>
          
          {isLoading ? (
            <div className="animate-pulse space-y-3">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="h-10 bg-neutral-700/50 rounded-sm"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500 mr-2"></div>
                <div>
                  <div 
                    className="text-white text-sm"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                  >
                    New order placed
                  </div>
                  <div 
                    className="text-gray-400 text-xs"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                  >
                    10 minutes ago
                  </div>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 mr-2"></div>
                <div>
                  <div 
                    className="text-white text-sm"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                  >
                    New user registered
                  </div>
                  <div 
                    className="text-gray-400 text-xs"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                  >
                    25 minutes ago
                  </div>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-amber-500 mr-2"></div>
                <div>
                  <div 
                    className="text-white text-sm"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                  >
                    New product submitted
                  </div>
                  <div 
                    className="text-gray-400 text-xs"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                  >
                    1 hour ago
                  </div>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500 mr-2"></div>
                <div>
                  <div 
                    className="text-white text-sm"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                  >
                    Product approved
                  </div>
                  <div 
                    className="text-gray-400 text-xs"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                  >
                    2 hours ago
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardStats;
