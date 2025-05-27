import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiTruck, FiPackage, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { getUserOrders } from '../services/api/orderService';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import luxuryTheme from '../styles/luxuryTheme';

const UserOrders = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await getUserOrders({ page: currentPage, limit: 10 });
        console.log('User orders:', response);
        
        if (response.data) {
          setOrders(response.data);
          setTotalPages(response.pagination?.pages || 1);
        } else {
          setOrders(response);
          setTotalPages(1);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError(error.message || 'Failed to fetch orders');
        setLoading(false);
        toast.error('Failed to fetch your orders');
      }
    };

    fetchOrders();
  }, [isAuthenticated, navigate, currentPage]);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get order status icon and color
  const getOrderStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return { icon: <FiClock />, color: 'text-yellow-500 bg-yellow-500/10' };
      case 'processing':
        return { icon: <FiPackage />, color: 'text-blue-500 bg-blue-500/10' };
      case 'shipped':
        return { icon: <FiTruck />, color: 'text-purple-500 bg-purple-500/10' };
      case 'delivered':
        return { icon: <FiCheckCircle />, color: 'text-green-500 bg-green-500/10' };
      case 'cancelled':
        return { icon: <FiXCircle />, color: 'text-red-500 bg-red-500/10' };
      default:
        return { icon: <FiClock />, color: 'text-yellow-500 bg-yellow-500/10' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gold animate-pulse text-2xl">Loading your orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
        <div className="text-red-500 text-xl mb-4">Error: {error}</div>
        <button 
          onClick={() => navigate('/shop')}
          className="px-6 py-2 bg-gold text-black font-semibold rounded hover:bg-gold/80"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-black p-6 border-b border-gray-700">
            <h1 className="text-2xl font-bold text-gold" style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}>
              My Orders
            </h1>
            <p className="text-gray-400 mt-1" style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}>
              View and track all your orders
            </p>
          </div>

          {/* Orders List */}
          <div className="p-6">
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-xl mb-6" style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}>
                  You haven't placed any orders yet
                </div>
                <Link 
                  to="/shop"
                  className="px-6 py-2 bg-gold text-black font-semibold rounded hover:bg-gold/80 transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Total
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Items
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {orders.map((order) => {
                      const statusInfo = getOrderStatusInfo(order.status);
                      return (
                        <tr key={order._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-white">
                              {order.orderNumber || order._id.substring(0, 8)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-300">
                              {formatDate(order.createdAt)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                              <span className="mr-1">{statusInfo.icon}</span>
                              {order.status || 'Pending'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-300">
                              ${order.total?.toFixed(2) || '0.00'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-300">
                              {order.items?.length || 0}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <Link 
                                to={`/order-confirmation/${order._id}`}
                                className="text-gold hover:text-gold/80"
                                title="View Order Details"
                              >
                                <FiEye className="w-5 h-5" />
                              </Link>
                              <Link 
                                to={`/track-order/${order._id}`}
                                className="text-blue-400 hover:text-blue-300"
                                title="Track Order"
                              >
                                <FiTruck className="w-5 h-5" />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-l-md ${
                      currentPage === 1 
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    Previous
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 ${
                        currentPage === i + 1
                          ? 'bg-gold text-black'
                          : 'bg-gray-700 text-white hover:bg-gray-600'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-r-md ${
                      currentPage === totalPages 
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOrders;
