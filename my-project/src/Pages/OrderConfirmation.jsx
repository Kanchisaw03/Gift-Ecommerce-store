import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiCheckCircle, FiTruck, FiPackage, FiMapPin, FiClock } from 'react-icons/fi';
import { getOrderDetails } from '../services/api/orderService';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import luxuryTheme from '../styles/luxuryTheme';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const data = await getOrderDetails(orderId);
        console.log('Order details:', data);
        setOrder(data.data || data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError(error.message || 'Failed to fetch order details');
        setLoading(false);
        toast.error('Failed to fetch order details');
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gold animate-pulse text-2xl">Loading order details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
        <div className="text-red-500 text-xl mb-4">Error: {error}</div>
        <button 
          onClick={() => navigate('/account/orders')}
          className="px-6 py-2 bg-gold text-black font-semibold rounded hover:bg-gold/80"
        >
          View All Orders
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
        <div className="text-white text-xl mb-4">Order not found</div>
        <button 
          onClick={() => navigate('/shop')}
          className="px-6 py-2 bg-gold text-black font-semibold rounded hover:bg-gold/80"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get order status
  const getOrderStatus = () => {
    const status = order.status || 'pending';
    
    switch (status.toLowerCase()) {
      case 'pending':
        return { icon: <FiClock className="text-yellow-500 text-2xl" />, text: 'Pending', color: 'text-yellow-500' };
      case 'processing':
        return { icon: <FiPackage className="text-blue-500 text-2xl" />, text: 'Processing', color: 'text-blue-500' };
      case 'shipped':
        return { icon: <FiTruck className="text-purple-500 text-2xl" />, text: 'Shipped', color: 'text-purple-500' };
      case 'delivered':
        return { icon: <FiCheckCircle className="text-green-500 text-2xl" />, text: 'Delivered', color: 'text-green-500' };
      case 'cancelled':
        return { icon: <FiXCircle className="text-red-500 text-2xl" />, text: 'Cancelled', color: 'text-red-500' };
      default:
        return { icon: <FiClock className="text-yellow-500 text-2xl" />, text: 'Pending', color: 'text-yellow-500' };
    }
  };

  const orderStatus = getOrderStatus();

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-black p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gold" style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}>
                Order Confirmation
              </h1>
              <p className="text-gray-400 mt-1" style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}>
                Thank you for your order!
              </p>
            </div>
            <div className="flex items-center">
              {orderStatus.icon}
              <span className={`ml-2 font-semibold ${orderStatus.color}`} style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}>
                {orderStatus.text}
              </span>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold text-gold mb-4" style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}>
                Order Information
              </h2>
              <div className="space-y-3 text-gray-300" style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}>
                <p><span className="text-gray-400">Order Number:</span> {order.orderNumber || order._id}</p>
                <p><span className="text-gray-400">Date:</span> {formatDate(order.createdAt)}</p>
                <p><span className="text-gray-400">Payment Method:</span> {order.paymentInfo?.method || 'Not specified'}</p>
                <p><span className="text-gray-400">Payment Status:</span> {order.paymentInfo?.status || 'Pending'}</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gold mb-4" style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}>
                Shipping Information
              </h2>
              <div className="space-y-3 text-gray-300" style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}>
                <p>
                  {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                </p>
                <p>{order.shippingAddress?.address}</p>
                <p>
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
                </p>
                <p>{order.shippingAddress?.country}</p>
                <p>{order.shippingAddress?.phone}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gold mb-4" style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}>
              Order Items
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {order.items && order.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0">
                            <img 
                              className="h-12 w-12 object-cover rounded" 
                              src={item.image || '/assets/images/product-placeholder.jpg'} 
                              alt={item.name} 
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">{item.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mt-8 bg-gray-700 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gold mb-4" style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}>
              Order Summary
            </h2>
            <div className="space-y-2 text-gray-300" style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}>
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${order.subtotal?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>${order.shippingCost?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${order.tax?.toFixed(2) || '0.00'}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Discount:</span>
                  <span>-${order.discount?.toFixed(2) || '0.00'}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-gold pt-2 border-t border-gray-600">
                <span>Total:</span>
                <span>${order.total?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-wrap gap-4 justify-between">
            <Link 
              to="/account/orders"
              className="px-6 py-2 bg-gray-700 text-white font-semibold rounded hover:bg-gray-600 transition-colors"
            >
              View All Orders
            </Link>
            <Link 
              to={`/track-order/${order._id}`}
              className="px-6 py-2 bg-gold text-black font-semibold rounded hover:bg-gold/80 transition-colors"
            >
              Track Order
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
