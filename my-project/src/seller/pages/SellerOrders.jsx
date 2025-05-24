import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { luxuryTheme } from '../../styles/luxuryTheme';
import DashboardLayout from '../../shared/components/DashboardLayout';

const SellerOrders = () => {
  // Mock data for orders
  const [orders, setOrders] = useState([
    {
      id: 'ORD-10042',
      customer: 'Alexander Wilson',
      email: 'alexander@example.com',
      date: '2025-05-15',
      status: 'delivered',
      total: 750.00,
      items: [
        {
          id: 'PROD-001',
          name: 'Handcrafted Gold Watch',
          price: 750.00,
          quantity: 1
        }
      ],
      paymentStatus: 'paid',
      shippingAddress: '123 Luxury Lane, Beverly Hills, CA 90210'
    },
    {
      id: 'ORD-10036',
      customer: 'Sophia Martinez',
      email: 'sophia@example.com',
      date: '2025-05-01',
      status: 'shipped',
      total: 200.00,
      items: [
        {
          id: 'PROD-002',
          name: 'Premium Leather Wallet',
          price: 200.00,
          quantity: 1
        }
      ],
      paymentStatus: 'paid',
      shippingAddress: '456 Elite Street, New York, NY 10001'
    },
    {
      id: 'ORD-10028',
      customer: 'James Thompson',
      email: 'james@example.com',
      date: '2025-04-22',
      status: 'processing',
      total: 350.00,
      items: [
        {
          id: 'PROD-003',
          name: 'Crystal Whiskey Decanter Set',
          price: 350.00,
          quantity: 1
        }
      ],
      paymentStatus: 'paid',
      shippingAddress: '789 Prestige Ave, Chicago, IL 60007'
    },
    {
      id: 'ORD-10015',
      customer: 'Emma Johnson',
      email: 'emma@example.com',
      date: '2025-04-10',
      status: 'delivered',
      total: 400.00,
      items: [
        {
          id: 'PROD-002',
          name: 'Premium Leather Wallet',
          price: 200.00,
          quantity: 2
        }
      ],
      paymentStatus: 'paid',
      shippingAddress: '101 Opulent Road, Los Angeles, CA 90048'
    },
    {
      id: 'ORD-10008',
      customer: 'William Davis',
      email: 'william@example.com',
      date: '2025-03-25',
      status: 'cancelled',
      total: 180.00,
      items: [
        {
          id: 'PROD-004',
          name: 'Silk Cashmere Scarf',
          price: 180.00,
          quantity: 1
        }
      ],
      paymentStatus: 'refunded',
      shippingAddress: '222 Wealth Way, Miami, FL 33101'
    }
  ]);

  const [filter, setFilter] = useState({
    status: 'all',
    dateRange: 'all',
    search: ''
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({
      ...filter,
      [name]: value
    });
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    // In a real app, this would be an API call
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        return { ...order, status: newStatus };
      }
      return order;
    }));
  };

  // Apply filters
  const filteredOrders = orders.filter(order => {
    // Status filter
    if (filter.status !== 'all' && order.status !== filter.status) {
      return false;
    }
    
    // Date range filter
    if (filter.dateRange !== 'all') {
      const orderDate = new Date(order.date);
      const today = new Date();
      
      switch (filter.dateRange) {
        case 'today':
          if (orderDate.toDateString() !== today.toDateString()) {
            return false;
          }
          break;
        case 'week':
          const weekAgo = new Date();
          weekAgo.setDate(today.getDate() - 7);
          if (orderDate < weekAgo) {
            return false;
          }
          break;
        case 'month':
          const monthAgo = new Date();
          monthAgo.setMonth(today.getMonth() - 1);
          if (orderDate < monthAgo) {
            return false;
          }
          break;
        default:
          break;
      }
    }
    
    // Search filter
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      return (
        order.id.toLowerCase().includes(searchLower) ||
        order.customer.toLowerCase().includes(searchLower) ||
        order.email.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

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
        <h1 className="text-3xl font-playfair font-bold mb-8">Orders</h1>

        {/* Filters */}
        <div className="bg-[#121212] rounded-lg shadow-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Order Status</label>
              <select
                name="status"
                value={filter.status}
                onChange={handleFilterChange}
                className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Date Range</label>
              <select
                name="dateRange"
                value={filter.dateRange}
                onChange={handleFilterChange}
                className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Search</label>
              <input
                type="text"
                name="search"
                value={filter.search}
                onChange={handleFilterChange}
                placeholder="Search by order ID, customer..."
                className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-[#121212] rounded-lg shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#1E1E1E] border-b border-gray-700">
                <tr>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-[#D4AF37]">Order ID</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-[#D4AF37]">Customer</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-[#D4AF37]">Date</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-[#D4AF37]">Status</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-[#D4AF37]">Payment</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-[#D4AF37]">Total</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-[#D4AF37]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#1A1A1A] transition-colors">
                    <td className="py-4 px-6 text-sm font-medium">{order.id}</td>
                    <td className="py-4 px-6 text-sm">
                      <div>
                        <p>{order.customer}</p>
                        <p className="text-xs text-gray-400">{order.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm">
                      {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-4 px-6 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusBadgeClass(order.paymentStatus)}`}>
                        {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm font-medium">${order.total.toFixed(2)}</td>
                    <td className="py-4 px-6 text-sm">
                      <div className="flex space-x-2">
                        <Link
                          to={`/seller/orders/${order.id}`}
                          className="px-2 py-1 bg-[#D4AF37] text-black rounded hover:bg-[#C4A137] transition-colors"
                        >
                          View
                        </Link>
                        {order.status === 'processing' && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'shipped')}
                            className="px-2 py-1 bg-blue-900 text-blue-300 rounded hover:bg-blue-800 transition-colors"
                          >
                            Ship
                          </button>
                        )}
                        {order.status === 'shipped' && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'delivered')}
                            className="px-2 py-1 bg-green-900 text-green-300 rounded hover:bg-green-800 transition-colors"
                          >
                            Deliver
                          </button>
                        )}
                        {(order.status === 'processing' || order.status === 'pending') && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                            className="px-2 py-1 bg-red-900 text-red-300 rounded hover:bg-red-800 transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredOrders.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-gray-400">No orders found matching your filters.</p>
            </div>
          )}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default SellerOrders;
