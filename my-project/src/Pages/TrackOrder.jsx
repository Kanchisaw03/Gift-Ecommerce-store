import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiTruck, FiPackage, FiClock, FiShoppingBag } from 'react-icons/fi';
import { getOrderDetails } from '../services/api/orderService';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import luxuryTheme from '../styles/luxuryTheme';

const TrackOrder = () => {
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
        <div className="text-gold animate-pulse text-2xl">Loading order tracking...</div>
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
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get order status and step
  const getOrderStatusStep = () => {
    const status = order.status || 'pending';
    
    switch (status.toLowerCase()) {
      case 'pending':
        return 1;
      case 'processing':
        return 2;
      case 'shipped':
        return 3;
      case 'delivered':
        return 4;
      case 'cancelled':
        return -1;
      default:
        return 1;
    }
  };

  const currentStep = getOrderStatusStep();
  const isCancelled = currentStep === -1;

  // Timeline data
  const timeline = [
    {
      step: 1,
      title: 'Order Placed',
      description: 'Your order has been received',
      icon: <FiShoppingBag />,
      date: order.createdAt ? formatDate(order.createdAt) : 'N/A'
    },
    {
      step: 2,
      title: 'Processing',
      description: 'Your order is being processed',
      icon: <FiPackage />,
      date: currentStep >= 2 ? formatDate(order.updatedAt) : 'Pending'
    },
    {
      step: 3,
      title: 'Shipped',
      description: 'Your order has been shipped',
      icon: <FiTruck />,
      date: currentStep >= 3 ? formatDate(order.updatedAt) : 'Pending'
    },
    {
      step: 4,
      title: 'Delivered',
      description: 'Your order has been delivered',
      icon: <FiCheckCircle />,
      date: currentStep >= 4 ? formatDate(order.updatedAt) : 'Pending'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-black p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gold" style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}>
                Track Your Order
              </h1>
              <p className="text-gray-400 mt-1" style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}>
                Order #{order.orderNumber || order._id}
              </p>
            </div>
            {isCancelled ? (
              <div className="bg-red-900/30 text-red-500 px-4 py-2 rounded-full text-sm font-semibold">
                Cancelled
              </div>
            ) : (
              <div className="bg-gold/10 text-gold px-4 py-2 rounded-full text-sm font-semibold">
                {timeline[currentStep - 1]?.title || 'Processing'}
              </div>
            )}
          </div>
        </div>

        {/* Order Tracking */}
        <div className="p-6">
          {isCancelled ? (
            <div className="bg-red-900/20 border border-red-900 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-red-500 mb-2" style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}>
                Order Cancelled
              </h2>
              <p className="text-gray-300" style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}>
                This order has been cancelled. If you have any questions, please contact our customer support.
              </p>
            </div>
          ) : (
            <div className="mb-8">
              <div className="relative">
                {/* Progress bar */}
                <div className="absolute top-5 left-5 right-5 h-1 bg-gray-700">
                  <div 
                    className="h-1 bg-gold transition-all duration-500" 
                    style={{ width: `${(currentStep - 1) * 33.33}%` }}
                  ></div>
                </div>
                
                {/* Timeline steps */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {timeline.map((item, index) => (
                    <div key={index} className="relative pt-10">
                      <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center ${
                        index + 1 <= currentStep ? 'bg-gold text-black' : 'bg-gray-700 text-gray-400'
                      }`}>
                        {item.icon}
                      </div>
                      <div className="text-center">
                        <h3 className={`font-semibold ${
                          index + 1 <= currentStep ? 'text-gold' : 'text-gray-400'
                        }`} style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}>
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-400 mt-1" style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}>
                          {item.description}
                        </p>
                        <p className={`text-xs mt-2 ${
                          index + 1 <= currentStep ? 'text-gray-300' : 'text-gray-500'
                        }`} style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}>
                          {item.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Order Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div>
              <h2 className="text-xl font-semibold text-gold mb-4" style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}>
                Shipping Information
              </h2>
              <div className="bg-gray-700/30 p-4 rounded-lg">
                <div className="space-y-2 text-gray-300" style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}>
                  <p className="font-semibold">
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

            <div>
              <h2 className="text-xl font-semibold text-gold mb-4" style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}>
                Order Summary
              </h2>
              <div className="bg-gray-700/30 p-4 rounded-lg">
                <div className="space-y-2 text-gray-300" style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}>
                  <div className="flex justify-between">
                    <span>Order Date:</span>
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Items:</span>
                    <span>{order.items?.length || 0}</span>
                  </div>
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
            </div>
          </div>

          {/* Order Items */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gold mb-4" style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}>
              Order Items
            </h2>
            <div className="bg-gray-700/30 rounded-lg overflow-hidden">
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
                  <tbody className="divide-y divide-gray-700">
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
                          ${item.price?.toFixed(2) || '0.00'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-wrap gap-4">
            <button 
              onClick={() => navigate('/account/orders')}
              className="px-6 py-2 bg-gray-700 text-white font-semibold rounded hover:bg-gray-600 transition-colors"
            >
              Back to Orders
            </button>
            <button 
              onClick={() => navigate('/shop')}
              className="px-6 py-2 bg-gold text-black font-semibold rounded hover:bg-gold/80 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
