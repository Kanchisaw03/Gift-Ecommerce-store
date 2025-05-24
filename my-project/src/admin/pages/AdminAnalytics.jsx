import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AdminAnalytics = () => {
  const [dateRange, setDateRange] = useState('last30days');
  
  // Mock data for analytics
  const salesData = {
    last7days: {
      totalSales: 24680,
      totalOrders: 342,
      averageOrderValue: 72.16,
      conversionRate: 3.2,
      dailyData: [
        { date: '05/15', sales: 3200, orders: 45 },
        { date: '05/16', sales: 3450, orders: 48 },
        { date: '05/17', sales: 3100, orders: 43 },
        { date: '05/18', sales: 3800, orders: 52 },
        { date: '05/19', sales: 3600, orders: 50 },
        { date: '05/20', sales: 3730, orders: 51 },
        { date: '05/21', sales: 3800, orders: 53 }
      ]
    },
    last30days: {
      totalSales: 98450,
      totalOrders: 1342,
      averageOrderValue: 73.36,
      conversionRate: 3.4,
      dailyData: [
        { date: '04/22', sales: 3100, orders: 42 },
        { date: '04/25', sales: 3250, orders: 44 },
        { date: '04/28', sales: 3300, orders: 45 },
        { date: '05/01', sales: 3400, orders: 46 },
        { date: '05/04', sales: 3350, orders: 45 },
        { date: '05/07', sales: 3500, orders: 48 },
        { date: '05/10', sales: 3450, orders: 47 },
        { date: '05/13', sales: 3600, orders: 49 },
        { date: '05/16', sales: 3450, orders: 48 },
        { date: '05/19', sales: 3600, orders: 50 },
        { date: '05/21', sales: 3800, orders: 53 }
      ]
    },
    last90days: {
      totalSales: 287650,
      totalOrders: 3897,
      averageOrderValue: 73.81,
      conversionRate: 3.5,
      dailyData: [
        { date: '02/21', sales: 3000, orders: 40 },
        { date: '03/01', sales: 3100, orders: 42 },
        { date: '03/10', sales: 3200, orders: 43 },
        { date: '03/20', sales: 3150, orders: 42 },
        { date: '04/01', sales: 3300, orders: 45 },
        { date: '04/10', sales: 3400, orders: 46 },
        { date: '04/20', sales: 3350, orders: 45 },
        { date: '05/01', sales: 3400, orders: 46 },
        { date: '05/10', sales: 3450, orders: 47 },
        { date: '05/21', sales: 3800, orders: 53 }
      ]
    },
    thisYear: {
      totalSales: 578920,
      totalOrders: 7845,
      averageOrderValue: 73.79,
      conversionRate: 3.6,
      dailyData: [
        { date: 'Jan', sales: 45000, orders: 610 },
        { date: 'Feb', sales: 48000, orders: 650 },
        { date: 'Mar', sales: 52000, orders: 705 },
        { date: 'Apr', sales: 54000, orders: 730 },
        { date: 'May', sales: 58000, orders: 785 }
      ]
    }
  };

  const topProducts = [
    { id: 1, name: 'Luxury Gold Watch', sales: 145, revenue: 21750, conversion: 4.2 },
    { id: 2, name: 'Crystal Champagne Flutes (Set of 2)', sales: 132, revenue: 7920, conversion: 3.8 },
    { id: 3, name: 'Cashmere Throw Blanket', sales: 128, revenue: 12800, conversion: 3.7 },
    { id: 4, name: 'Marble Cheese Board', sales: 120, revenue: 7200, conversion: 3.5 },
    { id: 5, name: 'Leather Journal', sales: 115, revenue: 5750, conversion: 3.3 }
  ];

  const topCategories = [
    { id: 1, name: 'Jewelry & Watches', sales: 345, revenue: 51750, conversion: 4.5 },
    { id: 2, name: 'Home Decor', sales: 312, revenue: 28080, conversion: 4.1 },
    { id: 3, name: 'Glassware & Bar', sales: 287, revenue: 20090, conversion: 3.9 },
    { id: 4, name: 'Textiles & Bedding', sales: 265, revenue: 23850, conversion: 3.7 },
    { id: 5, name: 'Stationery & Desk', sales: 234, revenue: 14040, conversion: 3.4 }
  ];

  const customerData = {
    newCustomers: 487,
    returningCustomers: 855,
    customerRetentionRate: 68.4,
    averageCustomerValue: 142.5,
    topCountries: [
      { country: 'United States', customers: 645, revenue: 48375 },
      { country: 'United Kingdom', customers: 234, revenue: 17550 },
      { country: 'Canada', customers: 187, revenue: 14025 },
      { country: 'Australia', customers: 156, revenue: 11700 },
      { country: 'Germany', customers: 120, revenue: 9000 }
    ]
  };

  // Get current data based on selected date range
  const currentData = salesData[dateRange];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-[#0A0A0A] text-white p-6"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-white">Analytics Dashboard</h1>
            <p className="text-gray-400 mt-1">Detailed insights into your store's performance</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-white"
            >
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="last90days">Last 90 Days</option>
              <option value="thisYear">This Year</option>
            </select>
            <button className="px-4 py-2 bg-[#D4AF37] text-black rounded-md hover:bg-[#B8860B] transition-colors">
              Export Report
            </button>
          </div>
        </div>

        {/* Overview Stats */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-gradient-to-br from-[#121212] to-[#1A1A1A] p-4 rounded-lg shadow-lg border border-gray-800">
            <h4 className="text-[#D4AF37] text-sm font-medium mb-1">Total Sales</h4>
            <p className="text-2xl font-playfair font-semibold text-white">${currentData.totalSales.toLocaleString()}</p>
            <div className="flex items-center mt-2">
              <span className="text-green-400 text-xs">+5.2%</span>
              <span className="text-gray-400 text-xs ml-2">vs previous period</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-[#121212] to-[#1A1A1A] p-4 rounded-lg shadow-lg border border-gray-800">
            <h4 className="text-[#D4AF37] text-sm font-medium mb-1">Total Orders</h4>
            <p className="text-2xl font-playfair font-semibold text-white">{currentData.totalOrders.toLocaleString()}</p>
            <div className="flex items-center mt-2">
              <span className="text-green-400 text-xs">+3.8%</span>
              <span className="text-gray-400 text-xs ml-2">vs previous period</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-[#121212] to-[#1A1A1A] p-4 rounded-lg shadow-lg border border-gray-800">
            <h4 className="text-[#D4AF37] text-sm font-medium mb-1">Average Order Value</h4>
            <p className="text-2xl font-playfair font-semibold text-white">${currentData.averageOrderValue.toFixed(2)}</p>
            <div className="flex items-center mt-2">
              <span className="text-green-400 text-xs">+1.4%</span>
              <span className="text-gray-400 text-xs ml-2">vs previous period</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-[#121212] to-[#1A1A1A] p-4 rounded-lg shadow-lg border border-gray-800">
            <h4 className="text-[#D4AF37] text-sm font-medium mb-1">Conversion Rate</h4>
            <p className="text-2xl font-playfair font-semibold text-white">{currentData.conversionRate}%</p>
            <div className="flex items-center mt-2">
              <span className="text-green-400 text-xs">+0.3%</span>
              <span className="text-gray-400 text-xs ml-2">vs previous period</span>
            </div>
          </div>
        </motion.div>

        {/* Sales Chart */}
        <motion.div variants={itemVariants} className="bg-[#121212] rounded-lg shadow-lg p-6 mb-8 border border-gray-800">
          <h3 className="text-xl font-playfair font-semibold mb-4 text-white">Sales Performance</h3>
          <div className="h-64 relative">
            {/* This would be a real chart in a production app */}
            <div className="absolute inset-0 flex items-end justify-between px-4">
              {currentData.dailyData.map((day, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="w-8 bg-gradient-to-t from-[#D4AF37] to-[#F5D76E] rounded-t"
                    style={{ height: `${(day.sales / 4000) * 100}%` }}
                  ></div>
                  <div className="text-xs text-gray-400 mt-2">{day.date}</div>
                </div>
              ))}
            </div>
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400">
              <div>$4000</div>
              <div>$3000</div>
              <div>$2000</div>
              <div>$1000</div>
              <div>$0</div>
            </div>
          </div>
        </motion.div>

        {/* Top Products and Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div variants={itemVariants} className="bg-[#121212] rounded-lg shadow-lg p-6 border border-gray-800">
            <h3 className="text-xl font-playfair font-semibold mb-4 text-white">Top Products</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#1E1E1E] border-b border-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Product</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Sales</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Revenue</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Conversion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {topProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-[#1A1A1A] transition-colors">
                      <td className="py-3 px-4 font-medium text-white">{product.name}</td>
                      <td className="py-3 px-4 text-gray-300">{product.sales}</td>
                      <td className="py-3 px-4 text-gray-300">${product.revenue.toLocaleString()}</td>
                      <td className="py-3 px-4 text-gray-300">{product.conversion}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-right">
              <button className="text-[#D4AF37] hover:text-[#B8860B] text-sm font-medium">
                View All Products →
              </button>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="bg-[#121212] rounded-lg shadow-lg p-6 border border-gray-800">
            <h3 className="text-xl font-playfair font-semibold mb-4 text-white">Top Categories</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#1E1E1E] border-b border-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Category</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Sales</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Revenue</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Conversion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {topCategories.map((category) => (
                    <tr key={category.id} className="hover:bg-[#1A1A1A] transition-colors">
                      <td className="py-3 px-4 font-medium text-white">{category.name}</td>
                      <td className="py-3 px-4 text-gray-300">{category.sales}</td>
                      <td className="py-3 px-4 text-gray-300">${category.revenue.toLocaleString()}</td>
                      <td className="py-3 px-4 text-gray-300">{category.conversion}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-right">
              <button className="text-[#D4AF37] hover:text-[#B8860B] text-sm font-medium">
                View All Categories →
              </button>
            </div>
          </motion.div>
        </div>

        {/* Customer Insights */}
        <motion.div variants={itemVariants} className="bg-[#121212] rounded-lg shadow-lg p-6 mb-8 border border-gray-800">
          <h3 className="text-xl font-playfair font-semibold mb-4 text-white">Customer Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="bg-[#1A1A1A] p-4 rounded-lg">
                <h4 className="text-[#D4AF37] text-sm font-medium mb-2">New Customers</h4>
                <p className="text-xl font-semibold text-white">{customerData.newCustomers}</p>
                <div className="flex items-center mt-2">
                  <span className="text-green-400 text-xs">+8.2%</span>
                  <span className="text-gray-400 text-xs ml-2">vs previous period</span>
                </div>
              </div>
              
              <div className="bg-[#1A1A1A] p-4 rounded-lg">
                <h4 className="text-[#D4AF37] text-sm font-medium mb-2">Returning Customers</h4>
                <p className="text-xl font-semibold text-white">{customerData.returningCustomers}</p>
                <div className="flex items-center mt-2">
                  <span className="text-green-400 text-xs">+4.5%</span>
                  <span className="text-gray-400 text-xs ml-2">vs previous period</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-[#1A1A1A] p-4 rounded-lg">
                <h4 className="text-[#D4AF37] text-sm font-medium mb-2">Customer Retention Rate</h4>
                <p className="text-xl font-semibold text-white">{customerData.customerRetentionRate}%</p>
                <div className="flex items-center mt-2">
                  <span className="text-green-400 text-xs">+1.8%</span>
                  <span className="text-gray-400 text-xs ml-2">vs previous period</span>
                </div>
              </div>
              
              <div className="bg-[#1A1A1A] p-4 rounded-lg">
                <h4 className="text-[#D4AF37] text-sm font-medium mb-2">Average Customer Value</h4>
                <p className="text-xl font-semibold text-white">${customerData.averageCustomerValue}</p>
                <div className="flex items-center mt-2">
                  <span className="text-green-400 text-xs">+3.2%</span>
                  <span className="text-gray-400 text-xs ml-2">vs previous period</span>
                </div>
              </div>
            </div>
            
            <div className="bg-[#1A1A1A] p-4 rounded-lg">
              <h4 className="text-[#D4AF37] text-sm font-medium mb-2">Top Countries</h4>
              <div className="space-y-3 mt-3">
                {customerData.topCountries.map((country, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="text-sm text-white">{country.country}</div>
                    <div className="text-sm text-gray-400">${country.revenue.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Additional Metrics */}
        <motion.div variants={itemVariants} className="bg-[#121212] rounded-lg shadow-lg p-6 border border-gray-800">
          <h3 className="text-xl font-playfair font-semibold mb-4 text-white">Additional Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#1A1A1A] p-4 rounded-lg">
              <h4 className="text-[#D4AF37] text-sm font-medium mb-2">Cart Abandonment Rate</h4>
              <p className="text-xl font-semibold text-white">32.4%</p>
              <div className="flex items-center mt-2">
                <span className="text-red-400 text-xs">+2.1%</span>
                <span className="text-gray-400 text-xs ml-2">vs previous period</span>
              </div>
            </div>
            
            <div className="bg-[#1A1A1A] p-4 rounded-lg">
              <h4 className="text-[#D4AF37] text-sm font-medium mb-2">Average Session Duration</h4>
              <p className="text-xl font-semibold text-white">4m 32s</p>
              <div className="flex items-center mt-2">
                <span className="text-green-400 text-xs">+0:15</span>
                <span className="text-gray-400 text-xs ml-2">vs previous period</span>
              </div>
            </div>
            
            <div className="bg-[#1A1A1A] p-4 rounded-lg">
              <h4 className="text-[#D4AF37] text-sm font-medium mb-2">Pages per Session</h4>
              <p className="text-xl font-semibold text-white">5.7</p>
              <div className="flex items-center mt-2">
                <span className="text-green-400 text-xs">+0.3</span>
                <span className="text-gray-400 text-xs ml-2">vs previous period</span>
              </div>
            </div>
            
            <div className="bg-[#1A1A1A] p-4 rounded-lg">
              <h4 className="text-[#D4AF37] text-sm font-medium mb-2">Bounce Rate</h4>
              <p className="text-xl font-semibold text-white">28.3%</p>
              <div className="flex items-center mt-2">
                <span className="text-green-400 text-xs">-1.2%</span>
                <span className="text-gray-400 text-xs ml-2">vs previous period</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminAnalytics;
