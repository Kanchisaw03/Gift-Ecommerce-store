import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { luxuryTheme } from '../../styles/luxuryTheme';
import DashboardLayout from '../../shared/components/DashboardLayout';

const SellerEarnings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const [earningsData, setEarningsData] = useState(null);

  // Fetch earnings data
  useEffect(() => {
    const fetchEarnings = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // For now, we'll simulate with mock data
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock earnings data
        const mockMonthlyData = {
          summary: {
            totalEarnings: 7875.00,
            pendingPayouts: 1250.00,
            lastPayout: 6625.00,
            lastPayoutDate: '2025-05-01'
          },
          chart: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            data: [1800, 2100, 1750, 2225]
          },
          transactions: [
            { id: 'TRX-10042', type: 'order', orderId: 'ORD-10042', date: '2025-05-15', amount: 750.00, status: 'pending' },
            { id: 'TRX-10036', type: 'order', orderId: 'ORD-10036', date: '2025-05-01', amount: 200.00, status: 'paid' },
            { id: 'TRX-10028', type: 'order', orderId: 'ORD-10028', date: '2025-04-22', amount: 350.00, status: 'paid' },
            { id: 'TRX-10015', type: 'order', orderId: 'ORD-10015', date: '2025-04-10', amount: 400.00, status: 'paid' },
            { id: 'TRX-PAYOUT-1', type: 'payout', date: '2025-05-01', amount: -6625.00, status: 'completed' }
          ],
          payoutSchedule: {
            nextPayoutDate: '2025-06-01',
            estimatedAmount: 1250.00,
            method: 'Bank Transfer',
            accountEnding: '4567'
          }
        };
        
        const mockWeeklyData = {
          summary: {
            totalEarnings: 1250.00,
            pendingPayouts: 1250.00,
            lastPayout: 6625.00,
            lastPayoutDate: '2025-05-01'
          },
          chart: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: [0, 0, 0, 0, 0, 500, 750]
          },
          transactions: [
            { id: 'TRX-10042', type: 'order', orderId: 'ORD-10042', date: '2025-05-15', amount: 750.00, status: 'pending' },
            { id: 'TRX-10036', type: 'order', orderId: 'ORD-10036', date: '2025-05-01', amount: 200.00, status: 'paid' }
          ],
          payoutSchedule: {
            nextPayoutDate: '2025-06-01',
            estimatedAmount: 1250.00,
            method: 'Bank Transfer',
            accountEnding: '4567'
          }
        };
        
        const mockYearlyData = {
          summary: {
            totalEarnings: 41220.00,
            pendingPayouts: 1250.00,
            lastPayout: 6625.00,
            lastPayoutDate: '2025-05-01'
          },
          chart: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            data: [2800, 3200, 3600, 3900, 4200, 3800, 3600, 3900, 3700, 3500, 3800, 1220]
          },
          transactions: [
            { id: 'TRX-10042', type: 'order', orderId: 'ORD-10042', date: '2025-05-15', amount: 750.00, status: 'pending' },
            { id: 'TRX-10036', type: 'order', orderId: 'ORD-10036', date: '2025-05-01', amount: 200.00, status: 'paid' },
            { id: 'TRX-10028', type: 'order', orderId: 'ORD-10028', date: '2025-04-22', amount: 350.00, status: 'paid' },
            { id: 'TRX-10015', type: 'order', orderId: 'ORD-10015', date: '2025-04-10', amount: 400.00, status: 'paid' },
            { id: 'TRX-PAYOUT-1', type: 'payout', date: '2025-05-01', amount: -6625.00, status: 'completed' },
            { id: 'TRX-PAYOUT-2', type: 'payout', date: '2025-04-01', amount: -5890.00, status: 'completed' },
            { id: 'TRX-PAYOUT-3', type: 'payout', date: '2025-03-01', amount: -6120.00, status: 'completed' },
            { id: 'TRX-PAYOUT-4', type: 'payout', date: '2025-02-01', amount: -5780.00, status: 'completed' }
          ],
          payoutSchedule: {
            nextPayoutDate: '2025-06-01',
            estimatedAmount: 1250.00,
            method: 'Bank Transfer',
            accountEnding: '4567'
          }
        };
        
        // Set data based on selected time range
        if (timeRange === 'week') {
          setEarningsData(mockWeeklyData);
        } else if (timeRange === 'year') {
          setEarningsData(mockYearlyData);
        } else {
          setEarningsData(mockMonthlyData);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching earnings:', error);
        setIsLoading(false);
      }
    };
    
    fetchEarnings();
  }, [timeRange]);

  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-900 text-green-300';
      case 'pending':
        return 'bg-yellow-900 text-yellow-300';
      case 'paid':
        return 'bg-blue-900 text-blue-300';
      case 'failed':
        return 'bg-red-900 text-red-300';
      default:
        return 'bg-gray-800 text-gray-300';
    }
  };

  const renderChart = (labels, data) => {
    if (!data || data.length === 0) return null;
    
    const max = Math.max(...data);
    
    return (
      <div className="h-64">
        <div className="flex h-[90%] items-end space-x-2">
          {data.map((value, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-[#D4AF37] bg-opacity-30 rounded-t hover:bg-opacity-50 transition-all relative group"
                style={{
                  height: `${(value / max) * 100}%`
                }}
              >
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-[#1E1E1E] text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {formatCurrency(value)}
                </div>
              </div>
              <div className="text-xs text-gray-400 mt-2 whitespace-nowrap">{labels[index]}</div>
            </div>
          ))}
        </div>
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
          <h1 className="text-3xl font-playfair font-bold">Earnings</h1>
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

        {/* Earnings Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#121212] rounded-lg shadow-xl p-6">
            <h2 className="text-gray-400 text-sm">Total Earnings</h2>
            <p className="text-2xl font-playfair font-bold text-white mt-1">
              {formatCurrency(earningsData.summary.totalEarnings)}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Lifetime earnings
            </p>
          </div>
          
          <div className="bg-[#121212] rounded-lg shadow-xl p-6">
            <h2 className="text-gray-400 text-sm">Pending Payout</h2>
            <p className="text-2xl font-playfair font-bold text-white mt-1">
              {formatCurrency(earningsData.summary.pendingPayouts)}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Next payout on {new Date(earningsData.payoutSchedule.nextPayoutDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          
          <div className="bg-[#121212] rounded-lg shadow-xl p-6">
            <h2 className="text-gray-400 text-sm">Last Payout</h2>
            <p className="text-2xl font-playfair font-bold text-white mt-1">
              {formatCurrency(earningsData.summary.lastPayout)}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Processed on {new Date(earningsData.summary.lastPayoutDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          
          <div className="bg-[#121212] rounded-lg shadow-xl p-6">
            <h2 className="text-gray-400 text-sm">Payout Method</h2>
            <p className="text-xl font-playfair font-bold text-white mt-1">
              {earningsData.payoutSchedule.method}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Account ending in {earningsData.payoutSchedule.accountEnding}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Earnings Chart */}
            <div className="bg-[#121212] rounded-lg shadow-xl overflow-hidden">
              <div className="p-6 border-b border-gray-800">
                <h2 className="text-xl font-playfair font-semibold">Earnings Overview</h2>
              </div>
              <div className="p-6">
                {renderChart(earningsData.chart.labels, earningsData.chart.data)}
              </div>
            </div>

            {/* Transactions */}
            <div className="bg-[#121212] rounded-lg shadow-xl overflow-hidden">
              <div className="p-6 border-b border-gray-800">
                <h2 className="text-xl font-playfair font-semibold">Transaction History</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#1E1E1E] border-b border-gray-700">
                    <tr>
                      <th className="py-3 px-6 text-left text-sm font-semibold text-[#D4AF37]">Transaction ID</th>
                      <th className="py-3 px-6 text-left text-sm font-semibold text-[#D4AF37]">Date</th>
                      <th className="py-3 px-6 text-left text-sm font-semibold text-[#D4AF37]">Type</th>
                      <th className="py-3 px-6 text-left text-sm font-semibold text-[#D4AF37]">Reference</th>
                      <th className="py-3 px-6 text-left text-sm font-semibold text-[#D4AF37]">Amount</th>
                      <th className="py-3 px-6 text-left text-sm font-semibold text-[#D4AF37]">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {earningsData.transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-[#1A1A1A] transition-colors">
                        <td className="py-3 px-6 text-sm">{transaction.id}</td>
                        <td className="py-3 px-6 text-sm">
                          {new Date(transaction.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="py-3 px-6 text-sm capitalize">{transaction.type}</td>
                        <td className="py-3 px-6 text-sm">
                          {transaction.type === 'order' ? transaction.orderId : '-'}
                        </td>
                        <td className={`py-3 px-6 text-sm font-medium ${transaction.amount < 0 ? 'text-red-400' : 'text-green-400'}`}>
                          {formatCurrency(transaction.amount)}
                        </td>
                        <td className="py-3 px-6 text-sm">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(transaction.status)}`}>
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {earningsData.transactions.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-gray-400">No transactions found for this period.</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8">
            {/* Next Payout */}
            <div className="bg-[#121212] rounded-lg shadow-xl overflow-hidden">
              <div className="p-6 border-b border-gray-800">
                <h2 className="text-xl font-playfair font-semibold">Next Payout</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400 text-sm">Estimated Amount</p>
                    <p className="text-2xl font-playfair font-bold text-[#D4AF37] mt-1">
                      {formatCurrency(earningsData.payoutSchedule.estimatedAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Payout Date</p>
                    <p className="text-lg font-medium mt-1">
                      {new Date(earningsData.payoutSchedule.nextPayoutDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-gray-800">
                    <p className="text-gray-400 text-sm">Payout Method</p>
                    <p className="text-lg font-medium mt-1">
                      {earningsData.payoutSchedule.method}
                    </p>
                    <p className="text-sm text-gray-400">
                      Account ending in {earningsData.payoutSchedule.accountEnding}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-800">
                <button className="w-full px-4 py-2 bg-[#D4AF37] text-black font-medium rounded-md hover:bg-[#C4A137] transition-colors">
                  Update Payout Settings
                </button>
              </div>
            </div>

            {/* Earnings Breakdown */}
            <div className="bg-[#121212] rounded-lg shadow-xl overflow-hidden">
              <div className="p-6 border-b border-gray-800">
                <h2 className="text-xl font-playfair font-semibold">Earnings Breakdown</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Product Sales</span>
                      <span className="text-sm font-medium">90%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div className="bg-[#D4AF37] h-2 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Shipping Fees</span>
                      <span className="text-sm font-medium">8%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '8%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Tax</span>
                      <span className="text-sm font-medium">2%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '2%' }}></div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-800">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Platform Fee</span>
                    <span className="text-sm text-gray-400">10%</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-gray-400">Payment Processing</span>
                    <span className="text-sm text-gray-400">2.9% + $0.30</span>
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

export default SellerEarnings;
