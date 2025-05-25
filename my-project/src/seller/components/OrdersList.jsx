import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DataTable from '../../shared/components/DataTable';
import { luxuryTheme } from '../../styles/luxuryTheme';
import { getSellerOrders, updateOrderStatus } from '../../services/api/orderService';
import { toast } from 'react-toastify';


const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Fetch orders from API
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setIsLoading(true);
        // Use the real API service to get seller orders
        const response = await getSellerOrders();
        
        if (response && response.data) {
          setOrders(response.data);
        } else {
          console.error('Unexpected API response format:', response);
          setOrders([]);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load orders. Please try again later.');
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderData();
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Handle view order details
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  // Handle update order status
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      // Call the real API to update order status
      await updateOrderStatus(orderId, { status: newStatus });
      
      // Update the local state
      setOrders(orders.map(order => 
        (order._id || order.id) === orderId ? { ...order, status: newStatus } : order
      ));
      
      // Show success message
      toast.success(`Order status updated to ${newStatus}`);
      
      // Update selected order if modal is open
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-900/30 text-emerald-400';
      case 'shipped':
        return 'bg-blue-900/30 text-blue-400';
      case 'processing':
        return 'bg-amber-900/30 text-amber-400';
      case 'pending':
        return 'bg-purple-900/30 text-purple-400';
      case 'cancelled':
        return 'bg-red-900/30 text-red-400';
      default:
        return 'bg-gray-900/30 text-gray-400';
    }
  };

  // Table columns
  const columns = [
    {
      key: 'id',
      label: 'Order ID'
    },
    {
      key: 'customer',
      label: 'Customer'
    },
    {
      key: 'date',
      label: 'Date'
    },
    {
      key: 'total',
      label: 'Total',
      render: (value) => formatCurrency(value)
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 rounded-sm text-xs uppercase ${getStatusColor(value)}`}>
          {value}
        </span>
      )
    }
  ];

  // Table actions
  const actions = [
    {
      label: 'View Details',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      onClick: handleViewDetails
    }
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 
          className="text-xl font-bold text-white"
          style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
        >
          Orders
        </h2>
      </div>
      
      {/* Orders Table */}
      {isLoading ? (
        <div className="animate-pulse bg-neutral-800 border border-gold/20 h-96 rounded-sm"></div>
      ) : (
        <DataTable
          columns={columns}
          data={orders}
          actions={actions}
          itemsPerPage={10}
          searchable={true}
          sortable={true}
        />
      )}
      
      {/* Order Details Modal */}
      {isDetailsModalOpen && selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-neutral-900 border border-gold/30 shadow-xl rounded-sm p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            style={{ boxShadow: luxuryTheme.shadows.lg }}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 
                className="text-lg font-bold text-white"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
              >
                Order Details: {selectedOrder.id}
              </h3>
              
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Order Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 
                  className="text-sm font-medium text-gold mb-2"
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                >
                  Customer Information
                </h4>
                <p 
                  className="text-white mb-1"
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                >
                  {selectedOrder.customer}
                </p>
                <p 
                  className="text-gray-400 text-sm"
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                >
                  {selectedOrder.email}
                </p>
              </div>
              
              <div>
                <h4 
                  className="text-sm font-medium text-gold mb-2"
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                >
                  Order Information
                </h4>
                <p 
                  className="text-white mb-1"
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                >
                  Date: {selectedOrder.date}
                </p>
                <p 
                  className="text-white mb-1"
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                >
                  Payment Method: {selectedOrder.payment.replace('_', ' ')}
                </p>
                <p 
                  className="text-white"
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                >
                  Status: 
                  <span className={`ml-2 px-2 py-1 rounded-sm text-xs uppercase ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </p>
              </div>
            </div>
            
            {/* Order Items */}
            <div className="mb-6">
              <h4 
                className="text-sm font-medium text-gold mb-4"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
              >
                Order Items
              </h4>
              
              <div className="bg-black/20 border border-gold/20 rounded-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gold/10">
                  <thead className="bg-black/30">
                    <tr>
                      <th 
                        className="px-4 py-3 text-left text-xs font-medium text-gold uppercase tracking-wider"
                        style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                      >
                        Product
                      </th>
                      <th 
                        className="px-4 py-3 text-left text-xs font-medium text-gold uppercase tracking-wider"
                        style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                      >
                        Quantity
                      </th>
                      <th 
                        className="px-4 py-3 text-left text-xs font-medium text-gold uppercase tracking-wider"
                        style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                      >
                        Price
                      </th>
                      <th 
                        className="px-4 py-3 text-left text-xs font-medium text-gold uppercase tracking-wider"
                        style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                      >
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold/10">
                    {selectedOrder.items.map((item) => (
                      <tr key={item.id}>
                        <td 
                          className="px-4 py-3 whitespace-nowrap text-sm text-white"
                          style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                        >
                          {item.name}
                        </td>
                        <td 
                          className="px-4 py-3 whitespace-nowrap text-sm text-gray-300"
                          style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                        >
                          {item.quantity}
                        </td>
                        <td 
                          className="px-4 py-3 whitespace-nowrap text-sm text-gray-300"
                          style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                        >
                          {formatCurrency(item.price)}
                        </td>
                        <td 
                          className="px-4 py-3 whitespace-nowrap text-sm text-gold"
                          style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                        >
                          {formatCurrency(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-black/30">
                    <tr>
                      <td colSpan="3" className="px-4 py-3 text-right text-sm font-medium text-white">
                        Total:
                      </td>
                      <td 
                        className="px-4 py-3 text-sm font-medium text-gold"
                        style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                      >
                        {formatCurrency(selectedOrder.total)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            
            {/* Update Status */}
            <div className="mb-6">
              <h4 
                className="text-sm font-medium text-gold mb-4"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
              >
                Update Status
              </h4>
              
              <div className="flex flex-wrap gap-2">
                {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleUpdateStatus(selectedOrder.id, status)}
                    disabled={selectedOrder.status === status}
                    className={`px-3 py-2 text-xs uppercase ${
                      selectedOrder.status === status
                        ? 'bg-gold/20 text-gold border border-gold/50 cursor-not-allowed'
                        : 'border border-gold/30 text-gray-300 hover:bg-gold/10 hover:text-gold'
                    }`}
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex justify-end">
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="px-4 py-2 bg-gold text-black hover:bg-gold-light transition-all duration-300"
                style={{ 
                  fontFamily: luxuryTheme.typography.fontFamily.body,
                  boxShadow: luxuryTheme.shadows.sm
                }}
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default OrdersList;
