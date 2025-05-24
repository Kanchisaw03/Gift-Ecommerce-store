import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { luxuryTheme } from '../../styles/luxuryTheme';
import DashboardLayout from '../../shared/components/DashboardLayout';

const SellerAnalytics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const [analyticsData, setAnalyticsData] = useState(null);

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // For now, we'll simulate with mock data
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock analytics data
        const mockMonthlyData = {
          revenue: {
            total: 8750,
            change: 12.5,
            data: [1200, 950, 1500, 1100, 1300, 1450, 1250]
          },
          orders: {
            total: 35,
            change: 8.2,
            data: [5, 4, 6, 5, 5, 6, 4]
          },
          averageOrderValue: {
            total: 250,
            change: 3.8,
            data: [240, 238, 250, 220, 260, 242, 250]
          },
          topProducts: [
            { id: 'PROD-001', name: 'Handcrafted Gold Watch', sales: 12, revenue: 9000 },
            { id: 'PROD-002', name: 'Premium Leather Wallet', sales: 18, revenue: 3600 },
            { id: 'PROD-003', name: 'Crystal Whiskey Decanter Set', sales: 8, revenue: 2800 },
            { id: 'PROD-004', name: 'Silk Cashmere Scarf', sales: 10, revenue: 1800 },
            { id: 'PROD-005', name: 'Artisanal Fountain Pen', sales: 7, revenue: 840 }
          ],
          salesByCategory: [
            { category: 'Accessories', sales: 30, revenue: 12600 },
            { category: 'Home', sales: 15, revenue: 4200 },
            { category: 'Stationery', sales: 10, revenue: 1240 }
          ],
          recentOrders: [
            { id: 'ORD-10042', customer: 'Alexander Wilson', date: '2025-05-15', total: 750 },
            { id: 'ORD-10036', customer: 'Sophia Martinez', date: '2025-05-01', total: 200 },
            { id: 'ORD-10028', customer: 'James Thompson', date: '2025-04-22', total: 350 }
          ]
        };
        
        const mockWeeklyData = {
          revenue: {
            total: 2450,
            change: 5.2,
            data: [350, 400, 300, 450, 250, 350, 350]
          },
          orders: {
            total: 10,
            change: -2.5,
            data: [1, 2, 1, 2, 1, 1, 2]
          },
          averageOrderValue: {
            total: 245,
            change: 7.8,
            data: [350, 200, 300, 225, 250, 350, 175]
          },
          topProducts: [
            { id: 'PROD-001', name: 'Handcrafted Gold Watch', sales: 3, revenue: 2250 },
            { id: 'PROD-002', name: 'Premium Leather Wallet', sales: 5, revenue: 1000 },
            { id: 'PROD-004', name: 'Silk Cashmere Scarf', sales: 2, revenue: 360 }
          ],
          salesByCategory: [
            { category: 'Accessories', sales: 8, revenue: 3250 },
            { category: 'Home', sales: 2, revenue: 700 }
          ],
          recentOrders: [
            { id: 'ORD-10042', customer: 'Alexander Wilson', date: '2025-05-15', total: 750 },
            { id: 'ORD-10036', customer: 'Sophia Martinez', date: '2025-05-01', total: 200 }
          ]
        };
        
        const mockYearlyData = {
          revenue: {
            total: 45800,
            change: 28.6,
            data: [3200, 3800, 4100, 3900, 4200, 3600, 3800, 4000, 3700, 3900, 4100, 3500]
          },
          orders: {
            total: 183,
            change: 22.0,
            data: [12, 15, 16, 14, 16, 14, 15, 16, 15, 16, 18, 16]
          },
          averageOrderValue: {
            total: 250,
            change: 5.4,
            data: [267, 253, 256, 279, 263, 257, 253, 250, 247, 244, 228, 219]
          },
          topProducts: [
            { id: 'PROD-001', name: 'Handcrafted Gold Watch', sales: 62, revenue: 46500 },
            { id: 'PROD-002', name: 'Premium Leather Wallet', sales: 85, revenue: 17000 },
            { id: 'PROD-003', name: 'Crystal Whiskey Decanter Set', sales: 45, revenue: 15750 },
            { id: 'PROD-004', name: 'Silk Cashmere Scarf', sales: 58, revenue: 10440 },
            { id: 'PROD-005', name: 'Artisanal Fountain Pen', sales: 40, revenue: 4800 }
          ],
          salesByCategory: [
            { category: 'Accessories', sales: 147, revenue: 63500 },
            { category: 'Home', sales: 85, revenue: 29750 },
            { category: 'Stationery', sales: 58, revenue: 6960 }
          ],
          recentOrders: [
            { id: 'ORD-10042', customer: 'Alexander Wilson', date: '2025-05-15', total: 750 },
            { id: 'ORD-10036', customer: 'Sophia Martinez', date: '2025-05-01', total: 200 },
            { id: 'ORD-10028', customer: 'James Thompson', date: '2025-04-22', total: 350 },
            { id: 'ORD-10015', customer: 'Emma Johnson', date: '2025-04-10', total: 400 },
            { id: 'ORD-10008', customer: 'William Davis', date: '2025-03-25', total: 180 }
          ]
        };
        
        // Set data based on selected time range
        if (timeRange === 'week') {
          setAnalyticsData(mockWeeklyData);
        } else if (timeRange === 'year') {
          setAnalyticsData(mockYearlyData);
        } else {
          setAnalyticsData(mockMonthlyData);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setIsLoading(false);
      }
    };
    
    fetchAnalytics();
  }, [timeRange]);

  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value);
  };

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case 'week':
        return 'Last 7 Days';
      case 'month':
        return 'Last 30 Days';
      case 'year':
        return 'Last 12 Months';
      default:
        return 'Last 30 Days';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const renderChangeIndicator = (change) => {
    const isPositive = change >= 0;
    return (
      <span className={`inline-flex items-center ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
        {isPositive ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12 7a1 1 0 01-1 1H9a1 1 0 01-1-1V6a1 1 0 011-1h2a1 1 0 011 1v1zm-2 5a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 01-1 1H11a1 1 0 01-1-1v-1z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M5 5a3 3 0 013-3h4a3 3 0 013 3v1h1a1 1 0 011 1v4a1 1 0 01-1 1h-1v1a3 3 0 01-3 3H8a3 3 0 01-3-3v-1H4a1 1 0 01-1-1v-4a1 1 0 011-1h1V5z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12 13a1 1 0 01-1 1H9a1 1 0 01-1-1v-1a1 1 0 011-1h2a1 1 0 011 1v1zm-2-8a1 1 0 00-1 1v1a1 1 0 001 1h2a1 1 0 001-1V6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M5 5a3 3 0 013-3h4a3 3 0 013 3v1h1a1 1 0 011 1v4a1 1 0 01-1 1h-1v1a3 3 0 01-3 3H8a3 3 0 01-3-3v-1H4a1 1 0 01-1-1v-4a1 1 0 011-1h1V5z" clipRule="evenodd" />
          </svg>
        )}
        {Math.abs(change)}%
      </span>
    );
  };

  const renderChart = (data, label, color = '#D4AF37') => {
    if (!data || data.length === 0) return null;
    
    const max = Math.max(...data);
    
    return (
      <div className="h-16">
        <div className="flex h-full items-end space-x-1">
          {data.map((value, index) => (
            <div
              key={index}
              className="flex-1 bg-opacity-30 rounded-t"
              style={{
                height: `${(value / max) * 100}%`,
                backgroundColor: color
              }}
            ></div>
          ))}
        </div>
        <div className="text-xs text-gray-400 mt-1">{label}</div>
      </div>
    );
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen bg-[#0A0A0A]">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#D4AF37]" />
            <div className="absolute inset-0 animate-ping opacity-30 rounded-full h-16 w-16 border border-[#D4AF37]" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div
        initial="initial"
        animate="in"
        exit="exit"
        variants={pageVariants}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-playfair font-bold">Analytics Dashboard</h1>
          <div className="mt-4 md:mt-0">
            <select
              value={timeRange}
              onChange={handleTimeRangeChange}
              className="bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">Last 12 Months</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Revenue */}
          <div className="bg-[#121212] rounded-lg shadow-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-gray-400 text-sm">Total Revenue</h2>
                <p className="text-2xl font-playfair font-bold text-white mt-1">
                  {formatCurrency(analyticsData.revenue.total)}
                </p>
                <div className="mt-1">
                  {renderChangeIndicator(analyticsData.revenue.change)}
                  <span className="text-xs text-gray-400 ml-1">vs previous {timeRange}</span>
                </div>
              </div>
              <div className="p-2 bg-[#1E1E1E] rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            {renderChart(
              analyticsData.revenue.data,
              timeRange === 'week' ? 'Last 7 Days' : timeRange === 'month' ? 'Last 30 Days' : 'Last 12 Months'
            )}
          </div>

          {/* Orders */}
          <div className="bg-[#121212] rounded-lg shadow-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-gray-400 text-sm">Total Orders</h2>
                <p className="text-2xl font-playfair font-bold text-white mt-1">
                  {analyticsData.orders.total}
                </p>
                <div className="mt-1">
                  {renderChangeIndicator(analyticsData.orders.change)}
                  <span className="text-xs text-gray-400 ml-1">vs previous {timeRange}</span>
                </div>
              </div>
              <div className="p-2 bg-[#1E1E1E] rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
            {renderChart(
              analyticsData.orders.data,
              timeRange === 'week' ? 'Last 7 Days' : timeRange === 'month' ? 'Last 30 Days' : 'Last 12 Months'
            )}
          </div>

          {/* Average Order Value */}
          <div className="bg-[#121212] rounded-lg shadow-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-gray-400 text-sm">Average Order Value</h2>
                <p className="text-2xl font-playfair font-bold text-white mt-1">
                  {formatCurrency(analyticsData.averageOrderValue.total)}
                </p>
                <div className="mt-1">
                  {renderChangeIndicator(analyticsData.averageOrderValue.change)}
                  <span className="text-xs text-gray-400 ml-1">vs previous {timeRange}</span>
                </div>
              </div>
              <div className="p-2 bg-[#1E1E1E] rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            {renderChart(
              analyticsData.averageOrderValue.data,
              timeRange === 'week' ? 'Last 7 Days' : timeRange === 'month' ? 'Last 30 Days' : 'Last 12 Months'
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Top Products */}
            <div className="bg-[#121212] rounded-lg shadow-xl overflow-hidden">
              <div className="p-6 border-b border-gray-800">
                <h2 className="text-xl font-playfair font-semibold">Top Products</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#1E1E1E] border-b border-gray-700">
                    <tr>
                      <th className="py-3 px-6 text-left text-sm font-semibold text-[#D4AF37]">Product</th>
                      <th className="py-3 px-6 text-left text-sm font-semibold text-[#D4AF37]">Sales</th>
                      <th className="py-3 px-6 text-left text-sm font-semibold text-[#D4AF37]">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {analyticsData.topProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-[#1A1A1A] transition-colors">
                        <td className="py-3 px-6 text-sm">{product.name}</td>
                        <td className="py-3 px-6 text-sm">{product.sales}</td>
                        <td className="py-3 px-6 text-sm">{formatCurrency(product.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sales by Category */}
            <div className="bg-[#121212] rounded-lg shadow-xl overflow-hidden">
              <div className="p-6 border-b border-gray-800">
                <h2 className="text-xl font-playfair font-semibold">Sales by Category</h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {analyticsData.salesByCategory.map((category) => (
                    <div key={category.category}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{category.category}</span>
                        <span className="text-sm text-gray-400">{category.sales} sales</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2.5">
                        <div
                          className="bg-[#D4AF37] h-2.5 rounded-full"
                          style={{
                            width: `${(category.revenue / analyticsData.revenue.total) * 100}%`
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-gray-400">{formatCurrency(category.revenue)}</span>
                        <span className="text-xs text-gray-400">
                          {((category.revenue / analyticsData.revenue.total) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Recent Orders */}
            <div className="bg-[#121212] rounded-lg shadow-xl overflow-hidden">
              <div className="p-6 border-b border-gray-800">
                <h2 className="text-xl font-playfair font-semibold">Recent Orders</h2>
              </div>
              <div className="divide-y divide-gray-800">
                {analyticsData.recentOrders.map((order) => (
                  <div key={order.id} className="p-4 hover:bg-[#1A1A1A] transition-colors">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{order.customer}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(order.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-[#D4AF37]">{formatCurrency(order.total)}</p>
                        <p className="text-xs text-gray-400">{order.id}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-gray-800">
                <a
                  href="/seller/orders"
                  className="text-sm text-[#D4AF37] hover:underline flex items-center justify-center"
                >
                  View All Orders
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Performance Summary */}
            <div className="bg-[#121212] rounded-lg shadow-xl overflow-hidden">
              <div className="p-6 border-b border-gray-800">
                <h2 className="text-xl font-playfair font-semibold">Performance Summary</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Conversion Rate</span>
                    <span className="text-sm font-medium">3.2%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Repeat Customers</span>
                    <span className="text-sm font-medium">42%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '42%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Avg. Rating</span>
                    <span className="text-sm font-medium">4.7/5</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div className="bg-[#D4AF37] h-2 rounded-full" style={{ width: '94%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default SellerAnalytics;
