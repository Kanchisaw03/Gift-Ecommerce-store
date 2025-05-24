import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { luxuryTheme } from '../../styles/luxuryTheme';
import DashboardLayout from '../../shared/components/DashboardLayout';

const AdminOrderManagement = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch orders data
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // For now, we'll simulate with mock data
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock orders data
        const mockOrders = [
          {
            id: 'ORD-001',
            customer: 'John Smith',
            email: 'john@example.com',
            date: '2025-05-01',
            total: 1250.00,
            status: 'completed',
            paymentStatus: 'paid',
            items: [
              { id: 1, name: 'Luxury Watch', price: 1200.00, quantity: 1 },
              { id: 2, name: 'Watch Box', price: 50.00, quantity: 1 }
            ],
            shipping: {
              method: 'Express',
              address: '123 Main St, New York, NY 10001',
              tracking: 'USP123456789'
            }
          },
          {
            id: 'ORD-002',
            customer: 'Emily Johnson',
            email: 'emily@example.com',
            date: '2025-05-05',
            total: 850.00,
            status: 'processing',
            paymentStatus: 'paid',
            items: [
              { id: 3, name: 'Gold Bracelet', price: 850.00, quantity: 1 }
            ],
            shipping: {
              method: 'Standard',
              address: '456 Park Ave, Boston, MA 02108',
              tracking: ''
            }
          },
          {
            id: 'ORD-003',
            customer: 'Michael Williams',
            email: 'michael@example.com',
            date: '2025-05-10',
            total: 3200.00,
            status: 'shipped',
            paymentStatus: 'paid',
            items: [
              { id: 4, name: 'Diamond Earrings', price: 1500.00, quantity: 1 },
              { id: 5, name: 'Diamond Necklace', price: 1700.00, quantity: 1 }
            ],
            shipping: {
              method: 'Express',
              address: '789 Oak St, Chicago, IL 60007',
              tracking: 'USP987654321'
            }
          },
          {
            id: 'ORD-004',
            customer: 'Sophia Brown',
            email: 'sophia@example.com',
            date: '2025-05-15',
            total: 120.00,
            status: 'delivered',
            paymentStatus: 'paid',
            items: [
              { id: 6, name: 'Silk Scarf', price: 120.00, quantity: 1 }
            ],
            shipping: {
              method: 'Standard',
              address: '101 Pine St, San Francisco, CA 94111',
              tracking: 'USP456789123'
            }
          },
          {
            id: 'ORD-005',
            customer: 'David Miller',
            email: 'david@example.com',
            date: '2025-05-18',
            total: 180.00,
            status: 'pending',
            paymentStatus: 'awaiting',
            items: [
              { id: 7, name: 'Leather Wallet', price: 180.00, quantity: 1 }
            ],
            shipping: {
              method: 'Standard',
              address: '202 Maple Ave, Austin, TX 78701',
              tracking: ''
            }
          },
          {
            id: 'ORD-006',
            customer: 'Olivia Davis',
            email: 'olivia@example.com',
            date: '2025-05-20',
            total: 2200.00,
            status: 'processing',
            paymentStatus: 'paid',
            items: [
              { id: 8, name: 'Designer Handbag', price: 2200.00, quantity: 1 }
            ],
            shipping: {
              method: 'Express',
              address: '303 Cedar St, Miami, FL 33101',
              tracking: ''
            }
          },
          {
            id: 'ORD-007',
            customer: 'James Wilson',
            email: 'james@example.com',
            date: '2025-05-22',
            total: 320.00,
            status: 'cancelled',
            paymentStatus: 'refunded',
            items: [
              { id: 9, name: 'Crystal Wine Glasses (Set of 4)', price: 320.00, quantity: 1 }
            ],
            shipping: {
              method: 'Standard',
              address: '404 Birch Rd, Seattle, WA 98101',
              tracking: ''
            }
          }
        ];
        
        setOrders(mockOrders);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update orders list
      const updatedOrders = orders.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            status: newStatus
          };
        }
        return order;
      });
      
      setOrders(updatedOrders);
      
      // Update selected order if modal is open
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({
          ...selectedOrder,
          status: newStatus
        });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const filteredOrders = orders.filter(order => {
    // Filter by status
    if (activeTab !== 'all' && order.status !== activeTab) return false;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        order.id.toLowerCase().includes(query) ||
        order.customer.toLowerCase().includes(query) ||
        order.email.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-900 text-yellow-300';
      case 'processing':
        return 'bg-blue-900 text-blue-300';
      case 'shipped':
        return 'bg-purple-900 text-purple-300';
      case 'delivered':
        return 'bg-green-900 text-green-300';
      case 'completed':
        return 'bg-green-900 text-green-300';
      case 'cancelled':
        return 'bg-red-900 text-red-300';
      default:
        return 'bg-gray-900 text-gray-300';
    }
  };

  const getPaymentStatusBadgeClass = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-900 text-green-300';
      case 'awaiting':
        return 'bg-yellow-900 text-yellow-300';
      case 'failed':
        return 'bg-red-900 text-red-300';
      case 'refunded':
        return 'bg-purple-900 text-purple-300';
      default:
        return 'bg-gray-900 text-gray-300';
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  if (isLoading) {
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
        <h1 className="text-3xl font-playfair font-bold mb-8">Order Management</h1>

        {/* Filters and Search */}
        <div className="mb-6 flex flex-col md:flex-row justify-between md:items-center">
          <div className="flex mb-4 md:mb-0 overflow-x-auto">
            <button
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeTab === 'all' ? 'bg-[#D4AF37] text-black' : 'bg-[#1E1E1E] text-white hover:bg-gray-800'} rounded-l-md`}
              onClick={() => setActiveTab('all')}
            >
              All Orders
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeTab === 'pending' ? 'bg-[#D4AF37] text-black' : 'bg-[#1E1E1E] text-white hover:bg-gray-800'}`}
              onClick={() => setActiveTab('pending')}
            >
              Pending
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeTab === 'processing' ? 'bg-[#D4AF37] text-black' : 'bg-[#1E1E1E] text-white hover:bg-gray-800'}`}
              onClick={() => setActiveTab('processing')}
            >
              Processing
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeTab === 'shipped' ? 'bg-[#D4AF37] text-black' : 'bg-[#1E1E1E] text-white hover:bg-gray-800'}`}
              onClick={() => setActiveTab('shipped')}
            >
              Shipped
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeTab === 'delivered' ? 'bg-[#D4AF37] text-black' : 'bg-[#1E1E1E] text-white hover:bg-gray-800'}`}
              onClick={() => setActiveTab('delivered')}
            >
              Delivered
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeTab === 'cancelled' ? 'bg-[#D4AF37] text-black' : 'bg-[#1E1E1E] text-white hover:bg-gray-800'} rounded-r-md`}
              onClick={() => setActiveTab('cancelled')}
            >
              Cancelled
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full md:w-64 bg-[#1E1E1E] border border-gray-700 rounded-md p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-[#121212] rounded-lg shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#1E1E1E] border-b border-gray-700">
                <tr>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-[#D4AF37]">Order ID</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-[#D4AF37]">Customer</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-[#D4AF37]">Date</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-[#D4AF37]">Total</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-[#D4AF37]">Status</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-[#D4AF37]">Payment</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-[#D4AF37]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#1A1A1A] transition-colors">
                    <td className="py-4 px-6 font-medium">{order.id}</td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-white">{order.customer}</p>
                        <p className="text-xs text-gray-400">{order.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm">
                      {new Date(order.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="py-4 px-6 font-medium">{formatCurrency(order.total)}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusBadgeClass(order.paymentStatus)}`}>
                        {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="px-3 py-1 bg-[#1E1E1E] text-white rounded hover:bg-gray-800 transition-colors"
                        >
                          View
                        </button>
                        <button
                          className="px-3 py-1 bg-[#D4AF37] text-black rounded hover:bg-[#B8860B] transition-colors"
                        >
                          Edit
                        </button>
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

        {/* Order Details Modal */}
        {isModalOpen && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-[#121212] rounded-lg shadow-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-playfair font-semibold">Order Details: {selectedOrder.id}</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-[#1A1A1A] p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-3 text-[#D4AF37]">Customer Information</h3>
                  <p className="mb-1"><span className="text-gray-400">Name:</span> {selectedOrder.customer}</p>
                  <p className="mb-1"><span className="text-gray-400">Email:</span> {selectedOrder.email}</p>
                </div>
                
                <div className="bg-[#1A1A1A] p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-3 text-[#D4AF37]">Order Information</h3>
                  <p className="mb-1"><span className="text-gray-400">Date:</span> {new Date(selectedOrder.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                  <p className="mb-1">
                    <span className="text-gray-400">Status:</span> 
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(selectedOrder.status)}`}>
                      {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                    </span>
                  </p>
                  <p className="mb-1">
                    <span className="text-gray-400">Payment:</span> 
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusBadgeClass(selectedOrder.paymentStatus)}`}>
                      {selectedOrder.paymentStatus.charAt(0).toUpperCase() + selectedOrder.paymentStatus.slice(1)}
                    </span>
                  </p>
                </div>
              </div>
              
              <div className="bg-[#1A1A1A] p-4 rounded-lg mb-6">
                <h3 className="text-lg font-medium mb-3 text-[#D4AF37]">Shipping Information</h3>
                <p className="mb-1"><span className="text-gray-400">Method:</span> {selectedOrder.shipping.method}</p>
                <p className="mb-1"><span className="text-gray-400">Address:</span> {selectedOrder.shipping.address}</p>
                {selectedOrder.shipping.tracking && (
                  <p className="mb-1"><span className="text-gray-400">Tracking:</span> {selectedOrder.shipping.tracking}</p>
                )}
              </div>
              
              <div className="bg-[#1A1A1A] p-4 rounded-lg mb-6">
                <h3 className="text-lg font-medium mb-3 text-[#D4AF37]">Order Items</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-gray-700">
                      <tr>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-[#D4AF37]">Item</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-[#D4AF37]">Price</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-[#D4AF37]">Quantity</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-[#D4AF37]">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {selectedOrder.items.map((item) => (
                        <tr key={item.id}>
                          <td className="py-3 px-4">{item.name}</td>
                          <td className="py-3 px-4">{formatCurrency(item.price)}</td>
                          <td className="py-3 px-4">{item.quantity}</td>
                          <td className="py-3 px-4">{formatCurrency(item.price * item.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="border-t border-gray-700">
                      <tr>
                        <td colSpan="3" className="py-3 px-4 text-right font-medium">Total:</td>
                        <td className="py-3 px-4 font-medium">{formatCurrency(selectedOrder.total)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              
              <div className="bg-[#1A1A1A] p-4 rounded-lg mb-6">
                <h3 className="text-lg font-medium mb-3 text-[#D4AF37]">Update Order Status</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'pending')}
                    className={`px-3 py-1 rounded text-sm ${selectedOrder.status === 'pending' ? 'bg-yellow-900 text-yellow-300 border border-yellow-700' : 'bg-[#1E1E1E] text-white hover:bg-gray-800'}`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'processing')}
                    className={`px-3 py-1 rounded text-sm ${selectedOrder.status === 'processing' ? 'bg-blue-900 text-blue-300 border border-blue-700' : 'bg-[#1E1E1E] text-white hover:bg-gray-800'}`}
                  >
                    Processing
                  </button>
                  <button
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'shipped')}
                    className={`px-3 py-1 rounded text-sm ${selectedOrder.status === 'shipped' ? 'bg-purple-900 text-purple-300 border border-purple-700' : 'bg-[#1E1E1E] text-white hover:bg-gray-800'}`}
                  >
                    Shipped
                  </button>
                  <button
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'delivered')}
                    className={`px-3 py-1 rounded text-sm ${selectedOrder.status === 'delivered' ? 'bg-green-900 text-green-300 border border-green-700' : 'bg-[#1E1E1E] text-white hover:bg-gray-800'}`}
                  >
                    Delivered
                  </button>
                  <button
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'completed')}
                    className={`px-3 py-1 rounded text-sm ${selectedOrder.status === 'completed' ? 'bg-green-900 text-green-300 border border-green-700' : 'bg-[#1E1E1E] text-white hover:bg-gray-800'}`}
                  >
                    Completed
                  </button>
                  <button
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'cancelled')}
                    className={`px-3 py-1 rounded text-sm ${selectedOrder.status === 'cancelled' ? 'bg-red-900 text-red-300 border border-red-700' : 'bg-[#1E1E1E] text-white hover:bg-gray-800'}`}
                  >
                    Cancelled
                  </button>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-800 transition-colors"
                >
                  Close
                </button>
                <button
                  className="px-4 py-2 bg-[#D4AF37] text-black rounded-md hover:bg-[#B8860B] transition-colors"
                >
                  Print Order
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminOrderManagement;
