import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { luxuryTheme } from '../../styles/luxuryTheme';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import { getUserOrders } from '../../services/api/orderService';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) return;
      
      setLoading(true);
      try {
        console.log('Fetching user orders from OrderHistory component');
        const response = await getUserOrders();
        console.log('Orders response from service:', response);
        
        if (response && response.success) {
          setOrders(response.data);
          setError(null);
        } else {
          setError('No orders found or invalid response format');
          console.warn('Invalid response format:', response);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to fetch your orders. Please try again later.');
        toast.error(err.message || 'Failed to fetch your orders');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [isAuthenticated]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-900 text-green-300';
      case 'Shipped':
        return 'bg-blue-900 text-blue-300';
      case 'Processing':
        return 'bg-yellow-900 text-yellow-300';
      case 'Cancelled':
        return 'bg-red-900 text-red-300';
      default:
        return 'bg-gray-800 text-gray-300';
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 max-w-6xl"
    >
      <h1 className="text-3xl font-playfair font-bold mb-8 text-center border-b border-[#D4AF37] pb-4">
        Order History
      </h1>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37]"></div>
        </div>
      ) : error ? (
        <div className="bg-[#121212] rounded-lg shadow-xl p-8 text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 bg-[#D4AF37] text-black font-medium rounded-md hover:bg-[#C4A137] transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : orders.length > 0 ? (
        <div className="bg-[#121212] rounded-lg shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#1E1E1E] border-b border-gray-700">
                <tr>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-[#D4AF37]">Order ID</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-[#D4AF37]">Date</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-[#D4AF37]">Status</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-[#D4AF37]">Total</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-[#D4AF37]">Items</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-[#D4AF37]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-[#1A1A1A] transition-colors">
                    <td className="py-4 px-6 text-sm font-medium">{order.orderNumber || order._id}</td>
                    <td className="py-4 px-6 text-sm">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </td>
                    <td className="py-4 px-6 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm font-medium">${order.total ? order.total.toFixed(2) : '0.00'}</td>
                    <td className="py-4 px-6 text-sm">{order.items ? order.items.length : 0}</td>
                    <td className="py-4 px-6 text-sm space-x-2">
                      <Link
                        to={`/orders/${order._id}`}
                        className="inline-flex items-center px-3 py-1 bg-[#D4AF37] text-black text-xs font-medium rounded hover:bg-[#C4A137] transition-colors"
                      >
                        View Details
                      </Link>
                      {order.trackingNumber && (
                        <Link
                          to={`/track-order/${order._id}`}
                          className="inline-flex items-center px-3 py-1 border border-[#D4AF37] text-[#D4AF37] text-xs font-medium rounded hover:bg-[#1E1E1E] transition-colors"
                        >
                          Track Order
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-[#121212] rounded-lg shadow-xl p-12 text-center">
          <h2 className="text-2xl font-playfair font-medium mb-4">No Orders Yet</h2>
          <p className="text-gray-400 mb-6">You haven't placed any orders yet.</p>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 bg-[#D4AF37] text-black font-medium rounded-md hover:bg-[#C4A137] transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      )}
    </motion.div>
  );
};

export default OrderHistory;
