import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { luxuryTheme } from '../../styles/luxuryTheme';
import axiosInstance from '../../services/api/axiosConfig';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }
      
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/orders/${id}`);
        console.log('Order details response:', response.data);
        
        if (response.data && response.data.success) {
          setOrder(response.data.data);
        } else {
          setError('Failed to fetch order details');
          toast.error('Failed to fetch order details');
        }
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError(err.response?.data?.error || 'Failed to fetch order details');
        toast.error('Failed to fetch order details');
        
        // If 404, redirect to orders page
        if (err.response?.status === 404) {
          toast.error('Order not found');
          setTimeout(() => navigate('/orders'), 2000);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [id, isAuthenticated, navigate]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0A0A0A]">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#D4AF37]" />
          <div className="absolute inset-0 animate-ping opacity-30 rounded-full h-16 w-16 border border-[#D4AF37]" />
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="bg-[#121212] rounded-lg shadow-xl p-8 text-center">
          <h2 className="text-2xl font-playfair font-medium mb-4 text-red-400">Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#D4AF37] text-black rounded-md hover:bg-[#C4A137] transition-colors"
            >
              Try Again
            </button>
            <Link
              to="/orders"
              className="px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-800 transition-colors"
            >
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="bg-[#121212] rounded-lg shadow-xl p-8 text-center">
          <h2 className="text-2xl font-playfair font-medium mb-4">Order Not Found</h2>
          <p className="text-gray-400 mb-6">The order you're looking for doesn't exist or you don't have permission to view it.</p>
          <Link
            to="/orders"
            className="px-4 py-2 bg-[#D4AF37] text-black rounded-md hover:bg-[#C4A137] transition-colors"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 max-w-6xl"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-4 border-b border-gray-800">
        <div>
          <h1 className="text-3xl font-playfair font-bold">Order #{order.orderNumber || order._id}</h1>
          <p className="text-gray-400 mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <div className="mt-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status.charAt(0).toUpperCase() + order.status.slice(1))}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-4">
          <Link
            to="/orders"
            className="px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-800 transition-colors"
          >
            Back to Orders
          </Link>
          {order.trackingNumber && (
            <Link
              to={`/track-order/${order._id}`}
              className="px-4 py-2 bg-[#D4AF37] text-black rounded-md hover:bg-[#C4A137] transition-colors"
            >
              Track Order
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Order Items */}
          <div className="bg-[#121212] rounded-lg shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-xl font-playfair font-semibold">Order Items</h2>
            </div>
            <div className="divide-y divide-gray-800">
              {order.items && order.items.map((item) => (
                <div key={item._id || item.product?._id} className="p-6 flex flex-col sm:flex-row">
                  <div className="sm:w-24 h-24 rounded-md overflow-hidden mb-4 sm:mb-0 flex-shrink-0">
                    <img 
                      src={item.product?.images?.[0] || 'https://via.placeholder.com/150'} 
                      alt={item.product?.name || 'Product'} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="sm:ml-6 flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <h3 className="text-lg font-medium">{item.product?.name || 'Product'}</h3>
                      <p className="text-[#D4AF37] font-medium mt-1 sm:mt-0">${item.price?.toFixed(2) || '0.00'}</p>
                    </div>
                    <p className="text-gray-400 mt-1">Quantity: {item.quantity}</p>
                    <p className="text-gray-300 mt-2 font-medium">Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Timeline */}
          {order.timeline && order.timeline.length > 0 && (
            <div className="bg-[#121212] rounded-lg shadow-xl overflow-hidden">
              <div className="p-6 border-b border-gray-800">
                <h2 className="text-xl font-playfair font-semibold">Order Timeline</h2>
              </div>
              <div className="p-6">
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-700" />
                  {order.timeline.map((event, index) => (
                    <div key={index} className="relative pl-10 pb-8 last:pb-0">
                      <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-[#1A1A1A] border-2 border-[#D4AF37] flex items-center justify-center">
                        <span className="text-xs font-bold text-[#D4AF37]">{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">{event.status}</h3>
                        <p className="text-gray-400 mt-1">
                          {new Date(event.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                        {event.description && <p className="text-gray-300 mt-1">{event.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-8">
          {/* Order Summary */}
          <div className="bg-[#121212] rounded-lg shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-xl font-playfair font-semibold">Order Summary</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span>${order.subtotal?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tax</span>
                  <span>${order.tax?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping</span>
                  <span>${order.shippingCost?.toFixed(2) || '0.00'}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount</span>
                    <span>-${order.discount?.toFixed(2) || '0.00'}</span>
                  </div>
                )}
                <div className="pt-3 mt-3 border-t border-gray-800 flex justify-between font-medium">
                  <span>Total</span>
                  <span className="text-[#D4AF37]">${order.total?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-[#121212] rounded-lg shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-xl font-playfair font-semibold">Shipping Information</h2>
            </div>
            <div className="p-6">
              {order.shippingAddress && (
                <div className="space-y-1">
                  <p className="font-medium">{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              )}
              {order.trackingNumber && (
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <p className="text-gray-400">Tracking Number</p>
                  <p className="font-medium mt-1">{order.trackingNumber}</p>
                  {order.carrier && <p className="text-gray-400 mt-2">Carrier: {order.carrier}</p>}
                </div>
              )}
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-[#121212] rounded-lg shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-xl font-playfair font-semibold">Payment Information</h2>
            </div>
            <div className="p-6">
              {order.paymentInfo && (
                <p>{order.paymentInfo.method} {order.paymentInfo.cardLast4 && `(ending in ${order.paymentInfo.cardLast4})`}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderDetails;
