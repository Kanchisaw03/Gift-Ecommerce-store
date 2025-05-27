import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { luxuryTheme } from '../../styles/luxuryTheme';
import DashboardLayout from '../../shared/components/DashboardLayout';
import { useSuperAdmin } from '../../hooks/useSuperAdmin';
import { toast } from 'react-toastify';
import axiosInstance from '../../services/api/axiosConfig';
import { FiEye, FiTruck, FiPackage, FiClock, FiCheckCircle, FiXCircle, FiSearch, FiFilter } from 'react-icons/fi';

const SuperAdminOrders = () => {
  const { orders, fetchAllOrders, updateOrderStatus, loading: contextLoading } = useSuperAdmin();
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [sellerFilter, setSellerFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);
  
  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        console.log('SuperAdminOrders: Attempting to fetch orders with filters');
        
        const filters = {};
        if (selectedStatus) {
          filters.status = selectedStatus;
          console.log(`Filtering by status: ${selectedStatus}`);
        }
        if (sellerFilter) {
          filters.seller = sellerFilter;
          console.log(`Filtering by seller: ${sellerFilter}`);
        }
        if (dateFilter) {
          filters.date = dateFilter;
          console.log(`Filtering by date: ${dateFilter}`);
        }
        
        console.log('Calling fetchAllOrders with params:', {
          page: currentPage,
          limit: 10,
          ...filters
        });
        
        try {
          const response = await fetchAllOrders({
            page: currentPage,
            limit: 10,
            ...filters
          });
          
          console.log('SuperAdminOrders: Response received:', response);
          
          if (response?.pagination) {
            console.log(`Setting total pages to ${response.pagination.pages}`);
            setTotalPages(response.pagination.pages);
          } else {
            console.warn('Response does not contain pagination information');
          }
        } catch (fetchError) {
          console.error('Error with primary fetch method:', fetchError);
          
          // Try an alternative approach if the first one fails
          console.log('Attempting alternative fetch method');
          try {
            const altResponse = await axiosInstance.get('/super-admin/orders/debug');
            console.log('Debug endpoint response:', altResponse.data);
          } catch (debugError) {
            console.error('Debug endpoint also failed:', debugError);
            
            // Try another alternative endpoint
            try {
              const altResponse2 = await axiosInstance.get('/super-admin/debug');
              console.log('Super admin debug endpoint response:', altResponse2.data);
            } catch (debugError2) {
              console.error('All debug endpoints failed:', debugError2);
            }
          }
          
          toast.info('Using alternative fetch method. Please check console for details.');
          throw fetchError; // Re-throw to be caught by the outer catch block
        }
      } catch (error) {
        console.error('Error loading orders:', error);
        toast.error(`Failed to load orders: ${error.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };
    
    loadOrders();
  }, [fetchAllOrders, currentPage, selectedStatus, sellerFilter, dateFilter]);
  
  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'text-green-500';
      case 'shipped':
        return 'text-purple-500';
      case 'processing':
        return 'text-blue-500';
      case 'pending':
        return 'text-yellow-500';
      case 'cancelled':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-900 text-green-300';
      case 'shipped':
        return 'bg-blue-900 text-blue-300';
      case 'processing':
        return 'bg-yellow-900 text-yellow-300';
      case 'cancelled':
        return 'bg-red-900 text-red-300';
      case 'pending':
        return 'bg-gray-800 text-gray-300';
      default:
        return 'bg-gray-800 text-gray-300';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <FiCheckCircle className="text-green-500" />;
      case 'shipped':
        return <FiTruck className="text-purple-500" />;
      case 'processing':
        return <FiPackage className="text-blue-500" />;
      case 'pending':
        return <FiClock className="text-yellow-500" />;
      case 'cancelled':
        return <FiXCircle className="text-red-500" />;
      default:
        return <FiClock className="text-gray-500" />;
    }
  };
  
  // Filter orders by search term
  const filteredOrders = orders?.filter(order => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const orderNumber = order.orderNumber || order._id?.substring(0, 8) || '';
    const customerName = order.user?.name || 'Customer';
    const sellerName = order.items && order.items[0]?.seller?.name || '';
    
    return (
      orderNumber.toLowerCase().includes(searchLower) ||
      customerName.toLowerCase().includes(searchLower) ||
      sellerName.toLowerCase().includes(searchLower)
    );
  }) || [];
  
  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  
  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };
  
  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Toggle advanced filters
  const toggleAdvancedFilters = () => {
    setAdvancedFiltersOpen(!advancedFiltersOpen);
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 
            className="text-3xl font-bold text-white mb-2"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
          >
            Platform Orders
          </h1>
          <p 
            className="text-gray-400"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
          >
            View and manage all orders across the platform
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-neutral-800 border border-gold/20 p-4 rounded-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative w-full sm:w-48">
                <select
                  value={selectedStatus}
                  onChange={handleStatusFilterChange}
                  className="w-full bg-neutral-700 border border-neutral-600 text-white py-2 px-3 rounded-sm appearance-none focus:outline-none focus:ring-1 focus:ring-gold/50"
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
              
              <button 
                onClick={toggleAdvancedFilters}
                className="flex items-center gap-2 bg-neutral-700 border border-neutral-600 text-white py-2 px-3 rounded-sm hover:bg-neutral-600 transition-colors"
              >
                <FiFilter />
                Advanced Filters
              </button>
            </div>

            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full bg-neutral-700 border border-neutral-600 text-white py-2 pl-10 pr-3 rounded-sm focus:outline-none focus:ring-1 focus:ring-gold/50"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
            </div>
          </div>
          
          {/* Advanced Filters */}
          {advancedFiltersOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="pt-4 border-t border-neutral-700"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Seller</label>
                  <input
                    type="text"
                    placeholder="Filter by seller name"
                    value={sellerFilter}
                    onChange={(e) => setSellerFilter(e.target.value)}
                    className="w-full bg-neutral-700 border border-neutral-600 text-white py-2 px-3 rounded-sm focus:outline-none focus:ring-1 focus:ring-gold/50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Date Range</label>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full bg-neutral-700 border border-neutral-600 text-white py-2 px-3 rounded-sm appearance-none focus:outline-none focus:ring-1 focus:ring-gold/50"
                  >
                    <option value="">All Time</option>
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="last7days">Last 7 Days</option>
                    <option value="last30days">Last 30 Days</option>
                    <option value="thisMonth">This Month</option>
                    <option value="lastMonth">Last Month</option>
                  </select>
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSellerFilter('');
                      setDateFilter('');
                      setSelectedStatus('');
                      setSearchTerm('');
                    }}
                    className="bg-neutral-700 border border-neutral-600 text-white py-2 px-4 rounded-sm hover:bg-neutral-600 transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Orders Table */}
        <div className="bg-neutral-800 border border-gold/20 rounded-sm overflow-hidden">
          {loading || contextLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
                <div className="absolute inset-0 animate-ping opacity-30 rounded-full h-12 w-12 border border-gold"></div>
              </div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-2">
                <svg className="w-16 h-16 mx-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-1">No orders found</h3>
              <p className="text-gray-400 max-w-md mx-auto">
                {searchTerm || selectedStatus || sellerFilter || dateFilter ? 
                  'Try adjusting your search or filter criteria.' : 
                  'There are no orders in the system yet.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gold/20 bg-neutral-900">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gold uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gold uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gold uppercase tracking-wider">
                      Seller
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gold uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gold uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gold uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gold uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold/10">
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-neutral-700/30 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                        #{order.orderNumber || order._id?.substring(0, 8)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-white">
                        {order.user?.name || 'Customer'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-white">
                        {order.items && order.items[0]?.seller?.name || 'Multiple Sellers'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-white">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-sm text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                        <div className="flex space-x-2">
                          <div className="relative inline-block text-left">
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order._id, e.target.value)}
                              disabled={updatingOrderId === order._id}
                              className="bg-neutral-700 border border-neutral-600 text-white py-1 px-2 rounded-sm text-xs appearance-none focus:outline-none focus:ring-1 focus:ring-gold/50"
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            {updatingOrderId === order._id && (
                              <div className="absolute right-0 top-0 h-full flex items-center pr-2">
                                <div className="animate-spin h-3 w-3 border-t-2 border-gold rounded-full"></div>
                              </div>
                            )}
                          </div>
                          
                          <Link 
                            to={`/orders/${order._id}`}
                            className="text-gold hover:text-gold/80 transition-colors"
                            title="View Order Details"
                          >
                            <FiEye />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Pagination */}
          {!loading && !contextLoading && filteredOrders.length > 0 && totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 p-4 border-t border-gold/20">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-neutral-700 text-white rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <div className="text-white">
                Page {currentPage} of {totalPages}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-neutral-700 text-white rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminOrders;
