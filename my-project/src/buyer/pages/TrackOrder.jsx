import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { luxuryTheme } from '../../styles/luxuryTheme';

const TrackOrder = () => {
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
        status: 'Shipped',
        estimatedDelivery: '2025-05-22',
        trackingNumber: 'TRK-8765432',
        carrier: 'Premium Logistics',
        items: [
          {
            id: 'PROD-001',
            name: 'Handcrafted Gold Watch',
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
          },
          {
            id: 'PROD-002',
            name: 'Premium Leather Wallet',
            quantity: 2,
            image: 'https://images.unsplash.com/photo-1517254797898-07c73c117e6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
          }
        ],
        timeline: [
          { status: 'Order Placed', date: '2025-05-15T09:30:00Z', completed: true },
          { status: 'Payment Confirmed', date: '2025-05-15T09:35:00Z', completed: true },
          { status: 'Processing', date: '2025-05-16T10:15:00Z', completed: true },
          { status: 'Shipped', date: '2025-05-17T14:20:00Z', completed: true },
          { status: 'Out for Delivery', date: null, completed: false },
          { status: 'Delivered', date: null, completed: false }
        ],
        shippingAddress: {
          name: 'Alexander Wilson',
          street: '123 Luxury Lane',
          city: 'Beverly Hills',
          state: 'CA',
          zip: '90210',
          country: 'United States'
        },
        trackingHistory: [
          { status: 'Package received by carrier', location: 'New York, NY', date: '2025-05-17T14:20:00Z' },
          { status: 'Departed shipping facility', location: 'New York, NY', date: '2025-05-18T08:45:00Z' },
          { status: 'Arrived at sorting facility', location: 'Chicago, IL', date: '2025-05-19T11:30:00Z' },
          { status: 'In transit', location: 'Chicago, IL', date: '2025-05-19T16:15:00Z' },
          { status: 'Arrived at regional facility', location: 'Los Angeles, CA', date: '2025-05-20T09:20:00Z' }
        ]
      };
      
      setOrder(mockOrder);
      setLoading(false);
    }, 800);
  }, [id]);

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
          <h1 className="text-3xl font-playfair font-bold mb-2">Track Order #{order.id}</h1>
          <p className="text-gray-400">
            Placed on {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link
            to={`/orders/${order.id}`}
            className="px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-800 transition-colors"
          >
            View Order Details
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Tracking Status */}
          <div className="bg-[#121212] rounded-lg shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-xl font-playfair font-semibold">Tracking Status</h2>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <p className="text-gray-400">Tracking Number</p>
                  <p className="text-[#D4AF37] font-medium">{order.trackingNumber}</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <p className="text-gray-400">Carrier</p>
                  <p className="font-medium">{order.carrier}</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <p className="text-gray-400">Estimated Delivery</p>
                  <p className="font-medium">{new Date(order.estimatedDelivery).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="relative">
                  <div className="overflow-hidden h-2 mb-4 flex rounded bg-gray-800">
                    <div 
                      className="bg-[#D4AF37]" 
                      style={{ width: `${(order.timeline.filter(step => step.completed).length / order.timeline.length) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Order Placed</span>
                    <span className="text-sm text-gray-400">Delivered</span>
                  </div>
                </div>
              </div>
              
              {/* Timeline */}
              <div className="relative">
                {order.timeline.map((event, index) => (
                  <div key={index} className="mb-8 flex items-start last:mb-0">
                    <div className="flex flex-col items-center mr-4">
                      <div className={`rounded-full h-4 w-4 ${event.completed ? 'bg-[#D4AF37]' : 'bg-gray-700'} flex-shrink-0`}></div>
                      {index < order.timeline.length - 1 && (
                        <div className={`h-full w-0.5 ${event.completed && order.timeline[index + 1].completed ? 'bg-[#D4AF37]' : 'bg-gray-700'} mt-1`}></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-lg font-medium ${event.completed ? 'text-white' : 'text-gray-500'}`}>{event.status}</h3>
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

          {/* Tracking History */}
          <div className="bg-[#121212] rounded-lg shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-xl font-playfair font-semibold">Detailed Tracking History</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {order.trackingHistory.map((event, index) => (
                  <div key={index} className={index !== 0 ? "pt-6 border-t border-gray-800" : ""}>
                    <div className="flex justify-between flex-wrap">
                      <h3 className="text-lg font-medium">{event.status}</h3>
                      <p className="text-gray-400">
                        {new Date(event.date).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <p className="text-gray-400 mt-1">{event.location}</p>
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
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center">
                    <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium">{item.name}</h3>
                      <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-[#121212] rounded-lg shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-xl font-playfair font-semibold">Shipping Address</h2>
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
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-[#121212] rounded-lg shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-xl font-playfair font-semibold">Need Help?</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <button className="w-full px-4 py-2 bg-[#D4AF37] text-black font-medium rounded-md hover:bg-[#C4A137] transition-colors">
                  Contact Support
                </button>
                <button className="w-full px-4 py-2 border border-gray-600 text-white font-medium rounded-md hover:bg-gray-800 transition-colors">
                  Report an Issue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TrackOrder;
