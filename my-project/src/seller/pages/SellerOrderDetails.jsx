import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { luxuryTheme } from '../../styles/luxuryTheme';
import DashboardLayout from '../../shared/components/DashboardLayout';

const SellerOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  // Fetch order data
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // In a real app, this would be an API call
        // For now, we'll simulate with mock data
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock order data based on ID
        const mockOrder = {
          id: id,
          customer: 'Alexander Wilson',
          email: 'alexander@example.com',
          phone: '+1 (555) 123-4567',
          date: '2025-05-15',
          status: id === 'ORD-10028' ? 'processing' : (id === 'ORD-10036' ? 'shipped' : 'delivered'),
          total: 750.00,
          subtotal: 750.00,
          tax: 0.00,
          shipping: 0.00,
          items: [
            {
              id: 'PROD-001',
              name: 'Handcrafted Gold Watch',
              price: 750.00,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
            }
          ],
          paymentStatus: 'paid',
          paymentMethod: 'Credit Card (ending in 4242)',
          shippingAddress: {
            name: 'Alexander Wilson',
            street: '123 Luxury Lane',
            city: 'Beverly Hills',
            state: 'CA',
            zip: '90210',
            country: 'United States'
          },
          billingAddress: {
            name: 'Alexander Wilson',
            street: '123 Luxury Lane',
            city: 'Beverly Hills',
            state: 'CA',
            zip: '90210',
            country: 'United States'
          },
          trackingNumber: id === 'ORD-10036' || id === 'ORD-10042' ? 'TRK-8765432' : null,
          notes: '',
          timeline: [
            { status: 'Order Placed', date: '2025-05-15T09:30:00Z' },
            { status: 'Payment Confirmed', date: '2025-05-15T09:35:00Z' },
            { status: 'Processing', date: '2025-05-16T10:15:00Z' },
            { status: 'Shipped', date: id === 'ORD-10036' || id === 'ORD-10042' ? '2025-05-17T14:20:00Z' : null },
            { status: 'Delivered', date: id === 'ORD-10042' ? '2025-05-20T13:45:00Z' : null }
          ]
        };
        
        setOrder(mockOrder);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching order:', error);
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [id]);

  const handleUpdateStatus = async (newStatus) => {
    setStatusUpdateLoading(true);
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update order status
      const updatedOrder = { ...order, status: newStatus };
      
      // Update timeline
      const updatedTimeline = [...order.timeline];
      const now = new Date().toISOString();
      
      if (newStatus === 'shipped' && !order.timeline[3].date) {
        updatedTimeline[3].date = now;
        updatedOrder.trackingNumber = 'TRK-' + Math.floor(Math.random() * 10000000);
      } else if (newStatus === 'delivered' && !order.timeline[4].date) {
        updatedTimeline[4].date = now;
      }
      
      updatedOrder.timeline = updatedTimeline;
      setOrder(updatedOrder);
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const handleUpdateTracking = (e) => {
    e.preventDefault();
    const trackingNumber = e.target.trackingNumber.value;
    
    if (trackingNumber.trim()) {
      setOrder({
        ...order,
        trackingNumber
      });
    }
  };

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

  const getPaymentStatusBadgeClass = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-900 text-green-300';
      case 'pending':
        return 'bg-yellow-900 text-yellow-300';
      case 'refunded':
        return 'bg-purple-900 text-purple-300';
      case 'failed':
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
          <div>
            <h1 className="text-3xl font-playfair font-bold mb-2">Order #{order.id}</h1>
            <p className="text-gray-400">
              Placed on {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <button
              onClick={() => navigate('/seller/orders')}
              className="px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-800 transition-colors"
            >
              Back to Orders
            </button>
            {order.status === 'processing' && (
              <button
                onClick={() => handleUpdateStatus('shipped')}
                disabled={statusUpdateLoading}
                className={`px-4 py-2 bg-blue-900 text-blue-300 rounded-md hover:bg-blue-800 transition-colors ${statusUpdateLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {statusUpdateLoading ? 'Updating...' : 'Mark as Shipped'}
              </button>
            )}
            {order.status === 'shipped' && (
              <button
                onClick={() => handleUpdateStatus('delivered')}
                disabled={statusUpdateLoading}
                className={`px-4 py-2 bg-green-900 text-green-300 rounded-md hover:bg-green-800 transition-colors ${statusUpdateLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {statusUpdateLoading ? 'Updating...' : 'Mark as Delivered'}
              </button>
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
                {order.items.map((item) => (
                  <div key={item.id} className="p-6 flex flex-col sm:flex-row">
                    <div className="sm:w-24 h-24 rounded-md overflow-hidden mb-4 sm:mb-0 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="sm:ml-6 flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <h3 className="text-lg font-medium">{item.name}</h3>
                        <p className="text-[#D4AF37] font-medium mt-1 sm:mt-0">${item.price.toFixed(2)}</p>
                      </div>
                      <p className="text-gray-400 mt-1">Quantity: {item.quantity}</p>
                      <p className="text-gray-300 mt-2 font-medium">Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-[#121212] rounded-lg shadow-xl overflow-hidden">
              <div className="p-6 border-b border-gray-800">
                <h2 className="text-xl font-playfair font-semibold">Order Timeline</h2>
              </div>
              <div className="p-6">
                <div className="relative">
                  {order.timeline.map((event, index) => (
                    <div key={index} className="mb-8 flex items-start last:mb-0">
                      <div className="flex flex-col items-center mr-4">
                        <div className={`rounded-full h-4 w-4 ${event.date ? 'bg-[#D4AF37]' : 'bg-gray-700'} flex-shrink-0`}></div>
                        {index < order.timeline.length - 1 && (
                          <div className={`h-full w-0.5 ${event.date && order.timeline[index + 1].date ? 'bg-[#D4AF37]' : 'bg-gray-700'} mt-1`}></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-lg font-medium ${event.date ? 'text-white' : 'text-gray-500'}`}>{event.status}</h3>
                        {event.date ? (
                          <p className="text-gray-400 text-sm">
                            {new Date(event.date).toLocaleString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        ) : (
                          <p className="text-gray-500 text-sm">Pending</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-[#121212] rounded-lg shadow-xl overflow-hidden">
              <div className="p-6 border-b border-gray-800">
                <h2 className="text-xl font-playfair font-semibold">Shipping Information</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Shipping Address</h3>
                    <address className="not-italic text-gray-300 space-y-1">
                      <p>{order.shippingAddress.name}</p>
                      <p>{order.shippingAddress.street}</p>
                      <p>
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                      </p>
                      <p>{order.shippingAddress.country}</p>
                    </address>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Tracking Information</h3>
                    {order.trackingNumber ? (
                      <div>
                        <p className="text-gray-400">Tracking Number</p>
                        <p className="text-[#D4AF37] font-medium">{order.trackingNumber}</p>
                      </div>
                    ) : (
                      <form onSubmit={handleUpdateTracking} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Add Tracking Number</label>
                          <input
                            type="text"
                            name="trackingNumber"
                            required
                            className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                          />
                        </div>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-[#D4AF37] text-black rounded-md hover:bg-[#C4A137] transition-colors"
                        >
                          Save Tracking
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Order Summary */}
            <div className="bg-[#121212] rounded-lg shadow-xl overflow-hidden">
              <div className="p-6 border-b border-gray-800">
                <h2 className="text-xl font-playfair font-semibold">Order Summary</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Payment</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusBadgeClass(order.paymentStatus)}`}>
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subtotal</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Shipping</span>
                    <span>${order.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tax</span>
                    <span>${order.tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-700 pt-4 flex justify-between font-medium">
                    <span>Total</span>
                    <span className="text-[#D4AF37]">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-[#121212] rounded-lg shadow-xl overflow-hidden">
              <div className="p-6 border-b border-gray-800">
                <h2 className="text-xl font-playfair font-semibold">Customer Information</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400">Name</p>
                    <p className="font-medium">{order.customer}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Email</p>
                    <p className="font-medium">{order.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Phone</p>
                    <p className="font-medium">{order.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Payment Method</p>
                    <p className="font-medium">{order.paymentMethod}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Notes */}
            <div className="bg-[#121212] rounded-lg shadow-xl overflow-hidden">
              <div className="p-6 border-b border-gray-800">
                <h2 className="text-xl font-playfair font-semibold">Order Notes</h2>
              </div>
              <div className="p-6">
                {order.notes ? (
                  <p className="text-gray-300">{order.notes}</p>
                ) : (
                  <p className="text-gray-500 italic">No notes for this order</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default SellerOrderDetails;
