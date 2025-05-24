import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { luxuryTheme } from '../../styles/luxuryTheme';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data fetch
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // Mock order data
      const mockOrder = {
        id: id,
        date: '2025-05-15',
        status: 'Delivered',
        total: 1250.00,
        subtotal: 1150.00,
        tax: 50.00,
        shipping: 50.00,
        shippingAddress: {
          name: 'Alexander Wilson',
          street: '123 Luxury Lane',
          city: 'Beverly Hills',
          state: 'CA',
          zip: '90210',
          country: 'United States'
        },
        paymentMethod: 'Credit Card (ending in 4242)',
        trackingNumber: 'TRK-8765432',
        items: [
          {
            id: 'PROD-001',
            name: 'Handcrafted Gold Watch',
            price: 750.00,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
          },
          {
            id: 'PROD-002',
            name: 'Premium Leather Wallet',
            price: 200.00,
            quantity: 2,
            image: 'https://images.unsplash.com/photo-1517254797898-07c73c117e6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
          }
        ],
        timeline: [
          { status: 'Order Placed', date: '2025-05-15T09:30:00Z' },
          { status: 'Payment Confirmed', date: '2025-05-15T09:35:00Z' },
          { status: 'Processing', date: '2025-05-16T10:15:00Z' },
          { status: 'Shipped', date: '2025-05-17T14:20:00Z' },
          { status: 'Delivered', date: '2025-05-20T13:45:00Z' }
        ]
      };
      
      setOrder(mockOrder);
      setLoading(false);
    }, 800);
  }, [id]);

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

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 max-w-6xl"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-playfair font-bold mb-2">Order #{order.id}</h1>
          <p className="text-gray-400">
            Placed on {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
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
              to={`/track/${order.id}`}
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
                      <div className="rounded-full h-4 w-4 bg-[#D4AF37] flex-shrink-0"></div>
                      {index < order.timeline.length - 1 && (
                        <div className="h-full w-0.5 bg-gray-700 mt-1"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium">{event.status}</h3>
                      <p className="text-gray-400 text-sm">
                        {new Date(event.date).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
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
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
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

          {/* Shipping Information */}
          <div className="bg-[#121212] rounded-lg shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-xl font-playfair font-semibold">Shipping Information</h2>
            </div>
            <div className="p-6">
              <address className="not-italic text-gray-300 space-y-1">
                <p>{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                </p>
                <p>{order.shippingAddress.country}</p>
              </address>
              {order.trackingNumber && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-gray-400">Tracking Number</p>
                  <p className="text-[#D4AF37] font-medium">{order.trackingNumber}</p>
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
              <p className="text-gray-300">{order.paymentMethod}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderDetails;
