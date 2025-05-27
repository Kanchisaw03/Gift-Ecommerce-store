import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiX, FiSearch, FiPackage, FiTruck, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';
import { getUserOrders, getOrderById } from '../../services/api/orderService';
import { formatCurrency } from '../../utils/formatters';

const OrderTrackingModal = ({ isOpen, onClose, userId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingDetails, setTrackingDetails] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'

  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) return;
      
      setLoading(true);
      try {
        const response = await getUserOrders();
        if (response && response.success) {
          setOrders(response.data);
        } else {
          throw new Error('Failed to fetch orders');
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load your orders. Please try again.');
        toast.error('Failed to load your orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    // Set up polling for real-time updates (every 10 seconds)
    const pollingInterval = setInterval(fetchOrders, 10000);

    return () => clearInterval(pollingInterval);
  }, [userId]);

  // Fetch order details when an order is selected
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!selectedOrder) return;
      
      setLoading(true);
      try {
        const response = await getOrderById(selectedOrder._id);
        if (response && response.success) {
          setTrackingDetails(response.data);
        } else {
          throw new Error('Failed to fetch order details');
        }
      } catch (err) {
        console.error('Error fetching order details:', err);
        toast.error('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [selectedOrder]);

  // Filter orders by search term
  const filteredOrders = orders.filter(order => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const orderNumber = order.orderNumber || order._id?.substring(0, 8) || '';
    
    return orderNumber.toLowerCase().includes(searchLower);
  });

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <FiCheckCircle className="text-green-500" />;
      case 'shipped':
        return <FiTruck className="text-blue-500" />;
      case 'processing':
        return <FiPackage className="text-yellow-500" />;
      case 'pending':
        return <FiClock className="text-gray-500" />;
      case 'cancelled':
        return <FiXCircle className="text-red-500" />;
      default:
        return <FiClock className="text-gray-500" />;
    }
  };

  // Get status color
  const getStatusColor = (status) => {
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

  // Calculate progress percentage based on status
  const getProgressPercentage = (status) => {
    switch (status) {
      case 'delivered':
        return 100;
      case 'shipped':
        return 75;
      case 'processing':
        return 50;
      case 'pending':
        return 25;
      case 'cancelled':
        return 0;
      default:
        return 0;
    }
  };

  // View order details
  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setViewMode('detail');
  };

  // Back to order list
  const backToList = () => {
    setViewMode('list');
    setSelectedOrder(null);
    setTrackingDetails(null);
  };

  // Modal animations
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/80 z-50"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-[#111111] rounded-lg shadow-xl border border-[#D4AF37]/20 w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-[#D4AF37]/20">
                <h2 className="text-xl font-bold text-white">
                  {viewMode === 'list' ? 'Track Your Orders' : 'Order Details'}
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                {viewMode === 'list' ? (
                  <div className="p-4">
                    {/* Search */}
                    <div className="relative mb-4">
                      <input
                        type="text"
                        placeholder="Search by order ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      />
                      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>

                    {loading ? (
                      <div className="flex items-center justify-center h-64">
                        <div className="relative">
                          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#D4AF37]" />
                          <div className="absolute inset-0 animate-ping opacity-30 rounded-full h-12 w-12 border border-[#D4AF37]" />
                        </div>
                      </div>
                    ) : error ? (
                      <div className="text-center p-8 text-red-500">
                        <p>{error}</p>
                        <button
                          onClick={() => window.location.reload()}
                          className="mt-4 px-4 py-2 bg-[#D4AF37] text-black font-semibold rounded hover:bg-[#B8860B] transition-colors"
                        >
                          Retry
                        </button>
                      </div>
                    ) : filteredOrders.length === 0 ? (
                      <div className="text-center p-8 text-gray-400">
                        {searchTerm ? (
                          <p>No orders found matching "{searchTerm}"</p>
                        ) : (
                          <p>You haven't placed any orders yet.</p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredOrders.map((order) => (
                          <div
                            key={order._id}
                            className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-4 hover:border-[#D4AF37]/30 transition-colors cursor-pointer"
                            onClick={() => viewOrderDetails(order)}
                          >
                            <div className="flex flex-col sm:flex-row justify-between mb-3">
                              <div>
                                <h3 className="text-lg font-semibold text-white">
                                  Order #{order.orderNumber || order._id?.substring(0, 8)}
                                </h3>
                                <p className="text-gray-400 text-sm">
                                  Placed on {formatDate(order.createdAt)}
                                </p>
                              </div>
                              <div className="mt-2 sm:mt-0">
                                <span className={`px-2 py-1 rounded-sm text-xs font-medium flex items-center gap-1 w-fit ${getStatusColor(order.status)}`}>
                                  {getStatusIcon(order.status)}
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                              </div>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full bg-gray-800 rounded-full h-2.5 mb-4">
                              <div
                                className="bg-[#D4AF37] h-2.5 rounded-full transition-all duration-500"
                                style={{ width: `${getProgressPercentage(order.status)}%` }}
                              ></div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-800 rounded-md overflow-hidden flex items-center justify-center">
                                  {order.items && order.items[0]?.product?.images?.[0] ? (
                                    <img
                                      src={order.items[0].product.images[0]}
                                      alt={order.items[0].product.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <FiPackage className="text-gray-500 w-6 h-6" />
                                  )}
                                </div>
                                <div>
                                  <p className="text-white">
                                    {order.items?.length > 1
                                      ? `${order.items[0]?.product?.name} and ${order.items.length - 1} more item(s)`
                                      : order.items?.[0]?.product?.name || 'Product'}
                                  </p>
                                  <p className="text-gray-400 text-sm">
                                    {order.items?.length} item(s) u2022 {formatCurrency(order.total)}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-3 sm:mt-0">
                                {order.estimatedDelivery && (
                                  <p className="text-sm text-gray-400">
                                    <span className="text-[#D4AF37]">Estimated Delivery:</span> {formatDate(order.estimatedDelivery)}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4">
                    {/* Back button */}
                    <button
                      onClick={backToList}
                      className="mb-4 text-[#D4AF37] hover:text-[#B8860B] transition-colors flex items-center gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                      </svg>
                      Back to orders
                    </button>

                    {loading ? (
                      <div className="flex items-center justify-center h-64">
                        <div className="relative">
                          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#D4AF37]" />
                          <div className="absolute inset-0 animate-ping opacity-30 rounded-full h-12 w-12 border border-[#D4AF37]" />
                        </div>
                      </div>
                    ) : !trackingDetails ? (
                      <div className="text-center p-8 text-red-500">
                        <p>Failed to load order details</p>
                        <button
                          onClick={() => viewOrderDetails(selectedOrder)}
                          className="mt-4 px-4 py-2 bg-[#D4AF37] text-black font-semibold rounded hover:bg-[#B8860B] transition-colors"
                        >
                          Retry
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Order header */}
                        <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-4">
                          <div className="flex flex-col sm:flex-row justify-between mb-3">
                            <div>
                              <h3 className="text-lg font-semibold text-white">
                                Order #{trackingDetails.orderNumber || trackingDetails._id?.substring(0, 8)}
                              </h3>
                              <p className="text-gray-400 text-sm">
                                Placed on {formatDate(trackingDetails.createdAt)}
                              </p>
                            </div>
                            <div className="mt-2 sm:mt-0">
                              <span className={`px-2 py-1 rounded-sm text-xs font-medium flex items-center gap-1 w-fit ${getStatusColor(trackingDetails.status)}`}>
                                {getStatusIcon(trackingDetails.status)}
                                {trackingDetails.status.charAt(0).toUpperCase() + trackingDetails.status.slice(1)}
                              </span>
                            </div>
                          </div>

                          {/* Order details */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                              <h4 className="text-[#D4AF37] text-sm mb-2">Shipping Address</h4>
                              <p className="text-white">{trackingDetails.shippingAddress?.name}</p>
                              <p className="text-gray-400 text-sm">{trackingDetails.shippingAddress?.street}</p>
                              <p className="text-gray-400 text-sm">
                                {trackingDetails.shippingAddress?.city}, {trackingDetails.shippingAddress?.state} {trackingDetails.shippingAddress?.zipCode}
                              </p>
                              <p className="text-gray-400 text-sm">{trackingDetails.shippingAddress?.country}</p>
                              <p className="text-gray-400 text-sm mt-2">{trackingDetails.shippingAddress?.phone}</p>
                            </div>
                            <div>
                              <h4 className="text-[#D4AF37] text-sm mb-2">Payment Information</h4>
                              <p className="text-white">Payment Method: {trackingDetails.paymentMethod}</p>
                              <p className="text-gray-400 text-sm">Subtotal: {formatCurrency(trackingDetails.subtotal)}</p>
                              <p className="text-gray-400 text-sm">Shipping: {formatCurrency(trackingDetails.shippingCost)}</p>
                              <p className="text-gray-400 text-sm">Tax: {formatCurrency(trackingDetails.tax)}</p>
                              <p className="text-white font-semibold mt-2">Total: {formatCurrency(trackingDetails.total)}</p>
                            </div>
                          </div>
                        </div>

                        {/* Tracking progress */}
                        <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-4">
                          <h3 className="text-lg font-semibold text-white mb-4">Tracking Information</h3>
                          
                          {/* Progress steps */}
                          <div className="relative">
                            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-700"></div>
                            <div className="space-y-8 relative">
                              {/* Ordered step */}
                              <div className="flex items-start">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${trackingDetails.status !== 'cancelled' ? 'bg-[#D4AF37] text-black' : 'bg-gray-700 text-gray-400'}`}>
                                  <FiClock className="w-4 h-4" />
                                </div>
                                <div className="ml-4">
                                  <h4 className="text-white font-medium">Order Placed</h4>
                                  <p className="text-gray-400 text-sm">{formatDate(trackingDetails.createdAt)}</p>
                                  <p className="text-gray-400 text-sm mt-1">Your order has been placed successfully.</p>
                                </div>
                              </div>

                              {/* Processing step */}
                              <div className="flex items-start">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${['processing', 'shipped', 'delivered'].includes(trackingDetails.status) ? 'bg-[#D4AF37] text-black' : 'bg-gray-700 text-gray-400'}`}>
                                  <FiPackage className="w-4 h-4" />
                                </div>
                                <div className="ml-4">
                                  <h4 className={`font-medium ${['processing', 'shipped', 'delivered'].includes(trackingDetails.status) ? 'text-white' : 'text-gray-500'}`}>Processing</h4>
                                  {['processing', 'shipped', 'delivered'].includes(trackingDetails.status) ? (
                                    <>
                                      <p className="text-gray-400 text-sm">{trackingDetails.trackingHistory?.find(h => h.status === 'processing')?.date ? formatDate(trackingDetails.trackingHistory.find(h => h.status === 'processing').date) : 'In progress'}</p>
                                      <p className="text-gray-400 text-sm mt-1">Your order is being processed and prepared for shipping.</p>
                                    </>
                                  ) : (
                                    <p className="text-gray-500 text-sm">Waiting for processing</p>
                                  )}
                                </div>
                              </div>

                              {/* Shipped step */}
                              <div className="flex items-start">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${['shipped', 'delivered'].includes(trackingDetails.status) ? 'bg-[#D4AF37] text-black' : 'bg-gray-700 text-gray-400'}`}>
                                  <FiTruck className="w-4 h-4" />
                                </div>
                                <div className="ml-4">
                                  <h4 className={`font-medium ${['shipped', 'delivered'].includes(trackingDetails.status) ? 'text-white' : 'text-gray-500'}`}>Shipped</h4>
                                  {['shipped', 'delivered'].includes(trackingDetails.status) ? (
                                    <>
                                      <p className="text-gray-400 text-sm">{trackingDetails.trackingHistory?.find(h => h.status === 'shipped')?.date ? formatDate(trackingDetails.trackingHistory.find(h => h.status === 'shipped').date) : 'In transit'}</p>
                                      {trackingDetails.trackingNumber && (
                                        <p className="text-[#D4AF37] text-sm mt-1">Tracking Number: {trackingDetails.trackingNumber}</p>
                                      )}
                                      <p className="text-gray-400 text-sm mt-1">Your order has been shipped and is on its way to you.</p>
                                    </>
                                  ) : (
                                    <p className="text-gray-500 text-sm">Not yet shipped</p>
                                  )}
                                </div>
                              </div>

                              {/* Delivered step */}
                              <div className="flex items-start">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${trackingDetails.status === 'delivered' ? 'bg-[#D4AF37] text-black' : 'bg-gray-700 text-gray-400'}`}>
                                  <FiCheckCircle className="w-4 h-4" />
                                </div>
                                <div className="ml-4">
                                  <h4 className={`font-medium ${trackingDetails.status === 'delivered' ? 'text-white' : 'text-gray-500'}`}>Delivered</h4>
                                  {trackingDetails.status === 'delivered' ? (
                                    <>
                                      <p className="text-gray-400 text-sm">{trackingDetails.trackingHistory?.find(h => h.status === 'delivered')?.date ? formatDate(trackingDetails.trackingHistory.find(h => h.status === 'delivered').date) : 'Completed'}</p>
                                      <p className="text-gray-400 text-sm mt-1">Your order has been delivered successfully.</p>
                                    </>
                                  ) : (
                                    <p className="text-gray-500 text-sm">
                                      {trackingDetails.estimatedDelivery ? `Estimated delivery: ${formatDate(trackingDetails.estimatedDelivery)}` : 'Not yet delivered'}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Cancelled step (conditional) */}
                              {trackingDetails.status === 'cancelled' && (
                                <div className="flex items-start">
                                  <div className="w-8 h-8 rounded-full bg-red-900 text-red-300 flex items-center justify-center z-10">
                                    <FiXCircle className="w-4 h-4" />
                                  </div>
                                  <div className="ml-4">
                                    <h4 className="text-white font-medium">Cancelled</h4>
                                    <p className="text-gray-400 text-sm">{trackingDetails.trackingHistory?.find(h => h.status === 'cancelled')?.date ? formatDate(trackingDetails.trackingHistory.find(h => h.status === 'cancelled').date) : 'Cancelled'}</p>
                                    <p className="text-gray-400 text-sm mt-1">Your order has been cancelled.</p>
                                    {trackingDetails.cancellationReason && (
                                      <p className="text-red-400 text-sm mt-1">Reason: {trackingDetails.cancellationReason}</p>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Order items */}
                        <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-4">
                          <h3 className="text-lg font-semibold text-white mb-4">Order Items</h3>
                          <div className="space-y-4">
                            {trackingDetails.items?.map((item, index) => (
                              <div key={index} className="flex items-start border-b border-gray-800 last:border-0 pb-4 last:pb-0">
                                <div className="w-16 h-16 bg-gray-800 rounded-md overflow-hidden flex-shrink-0">
                                  {item.product?.images?.[0] ? (
                                    <img
                                      src={item.product.images[0]}
                                      alt={item.product.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <FiPackage className="text-gray-500 w-6 h-6" />
                                    </div>
                                  )}
                                </div>
                                <div className="ml-4 flex-1">
                                  <h4 className="text-white font-medium">{item.product?.name || 'Product'}</h4>
                                  <p className="text-gray-400 text-sm">
                                    Quantity: {item.quantity} u2022 {formatCurrency(item.price)} each
                                  </p>
                                  {item.variant && (
                                    <p className="text-gray-400 text-sm">
                                      Variant: {item.variant}
                                    </p>
                                  )}
                                </div>
                                <div className="text-right">
                                  <p className="text-white font-medium">{formatCurrency(item.price * item.quantity)}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OrderTrackingModal;
