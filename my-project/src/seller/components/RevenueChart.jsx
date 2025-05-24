import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { luxuryTheme } from '../../styles/luxuryTheme';

// Mock data for revenue chart
const mockMonthlyData = [
  { month: 'Jan', revenue: 8500, orders: 42 },
  { month: 'Feb', revenue: 7200, orders: 36 },
  { month: 'Mar', revenue: 9800, orders: 48 },
  { month: 'Apr', revenue: 11200, orders: 55 },
  { month: 'May', revenue: 12850, orders: 62 },
  { month: 'Jun', revenue: 0, orders: 0 }, // Future month
  { month: 'Jul', revenue: 0, orders: 0 }, // Future month
  { month: 'Aug', revenue: 0, orders: 0 }, // Future month
  { month: 'Sep', revenue: 0, orders: 0 }, // Future month
  { month: 'Oct', revenue: 0, orders: 0 }, // Future month
  { month: 'Nov', revenue: 0, orders: 0 }, // Future month
  { month: 'Dec', revenue: 0, orders: 0 }, // Future month
];

// Mock data for category breakdown
const mockCategoryData = [
  { category: 'Watches', revenue: 18500, percentage: 37 },
  { category: 'Jewelry', revenue: 12800, percentage: 26 },
  { category: 'Accessories', revenue: 9500, percentage: 19 },
  { category: 'Home Decor', revenue: 5200, percentage: 10 },
  { category: 'Fragrances', revenue: 4000, percentage: 8 },
];

const RevenueChart = () => {
  const [timeframe, setTimeframe] = useState('monthly');
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Find the highest revenue value for scaling
  const maxRevenue = Math.max(...monthlyData.map(item => item.revenue));
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Simulate data fetching
  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        // In a real app, you would fetch data from your API here
        // const response = await fetch(`/api/seller/revenue?timeframe=${timeframe}`);
        // const data = await response.json();
        
        // For now, we'll use mock data
        setMonthlyData(mockMonthlyData);
        setCategoryData(mockCategoryData);
      } catch (error) {
        console.error('Error fetching revenue data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Simulate API delay
    const timer = setTimeout(() => {
      fetchRevenueData();
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeframe]);

  // Calculate total revenue
  const totalRevenue = monthlyData.reduce((sum, item) => sum + item.revenue, 0);
  
  // Calculate total orders
  const totalOrders = monthlyData.reduce((sum, item) => sum + item.orders, 0);

  return (
    <div>
      {/* Header with timeframe selector */}
      <div className="flex justify-between items-center mb-6">
        <h2 
          className="text-xl font-bold text-white"
          style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
        >
          Revenue Analytics
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
      
      {/* Revenue summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="bg-neutral-800 border border-gold/20 p-6 rounded-sm"
          style={{ boxShadow: luxuryTheme.shadows.sm }}
        >
          <h3 
            className="text-sm font-medium text-gray-300 mb-2"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
          >
            Total Revenue (2025)
          </h3>
          <p 
            className="text-3xl font-semibold text-white mb-2"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
          >
            {formatCurrency(totalRevenue)}
          </p>
          <div className="flex items-center">
            <span className="flex items-center text-emerald-400">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span 
                className="text-sm font-medium"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                14.8%
              </span>
            </span>
            <span 
              className="ml-2 text-xs text-gray-400"
              style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
            >
              vs last year
            </span>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-neutral-800 border border-gold/20 p-6 rounded-sm"
          style={{ boxShadow: luxuryTheme.shadows.sm }}
        >
          <h3 
            className="text-sm font-medium text-gray-300 mb-2"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
          >
            Total Orders (2025)
          </h3>
          <p 
            className="text-3xl font-semibold text-white mb-2"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
          >
            {totalOrders}
          </p>
          <div className="flex items-center">
            <span className="flex items-center text-emerald-400">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span 
                className="text-sm font-medium"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                9.2%
              </span>
            </span>
            <span 
              className="ml-2 text-xs text-gray-400"
              style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
            >
              vs last year
            </span>
          </div>
        </motion.div>
      </div>
      
      {/* Revenue chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="bg-neutral-800 border border-gold/20 p-6 rounded-sm mb-8"
        style={{ boxShadow: luxuryTheme.shadows.sm }}
      >
        <h3 
          className="text-lg font-medium text-white mb-6"
          style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
        >
          Revenue Trend
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
              {monthlyData.map((item, index) => (
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
      
      {/* Category breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="bg-neutral-800 border border-gold/20 p-6 rounded-sm"
        style={{ boxShadow: luxuryTheme.shadows.sm }}
      >
        <h3 
          className="text-lg font-medium text-white mb-6"
          style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
        >
          Revenue by Category
        </h3>
        
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, index) => (
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
  );
};

export default RevenueChart;
