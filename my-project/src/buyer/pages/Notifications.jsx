import React, { useState, useEffect } from 'react';
import { useNotification } from '../../context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { FiTrash2, FiCheck, FiFilter, FiRefreshCw } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Notifications = () => {
  const {
    notifications,
    loading,
    error,
    pagination,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearReadNotifications
  } = useNotification();

  const [filters, setFilters] = useState({
    read: '',
    type: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // Fetch notifications on component mount and when filters change
  useEffect(() => {
    fetchNotifications({
      page: 1,
      limit: 10,
      ...filters
    });
  }, [fetchNotifications, filters]);

  // Handle page change
  const handlePageChange = (page) => {
    fetchNotifications({
      page,
      limit: 10,
      ...filters
    });
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle notification click
  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order_confirmation':
        return '🛍️';
      case 'order_status_update':
      case 'order_shipped':
        return '📦';
      case 'order_delivered':
        return '✅';
      case 'order_cancelled':
        return '❌';
      case 'order_refunded':
        return '💸';
      case 'product':
        return '🏷️';
      case 'account':
        return '👤';
      case 'promotion':
        return '🎉';
      default:
        return '📢';
    }
  };

  // Get notification type display name
  const getNotificationTypeDisplay = (type) => {
    switch (type) {
      case 'order_confirmation':
        return 'Order Confirmation';
      case 'order_status_update':
        return 'Order Status Update';
      case 'order_shipped':
        return 'Order Shipped';
      case 'order_delivered':
        return 'Order Delivered';
      case 'order_cancelled':
        return 'Order Cancelled';
      case 'order_refunded':
        return 'Order Refunded';
      case 'product':
        return 'Product';
      case 'account':
        return 'Account';
      case 'promotion':
        return 'Promotion';
      default:
        return 'System';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <div className="flex space-x-2 mt-2 sm:mt-0">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                <FiFilter className="mr-2" /> Filters
              </button>
              <button
                onClick={() => fetchNotifications({
                  page: 1,
                  limit: 10,
                  ...filters
                })}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                disabled={loading}
              >
                <FiRefreshCw className={`mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
              </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-4 p-4 bg-gray-50 rounded-md"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="read" className="block text-sm font-medium text-gray-700 mb-1">
                    Read Status
                  </label>
                  <select
                    id="read"
                    name="read"
                    value={filters.read}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">All</option>
                    <option value="true">Read</option>
                    <option value="false">Unread</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">All Types</option>
                    <option value="order_confirmation">Order Confirmation</option>
                    <option value="order_status_update">Order Status Update</option>
                    <option value="order_shipped">Order Shipped</option>
                    <option value="order_delivered">Order Delivered</option>
                    <option value="order_cancelled">Order Cancelled</option>
                    <option value="order_refunded">Order Refunded</option>
                    <option value="product">Product</option>
                    <option value="account">Account</option>
                    <option value="promotion">Promotion</option>
                    <option value="system">System</option>
                  </select>
                </div>
                <div className="flex items-end space-x-2">
                  <button
                    onClick={() => setFilters({ read: '', type: '' })}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={markAllAsRead}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              disabled={loading}
            >
              <FiCheck className="mr-2" /> Mark All as Read
            </button>
            <button
              onClick={clearReadNotifications}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
              disabled={loading}
            >
              <FiTrash2 className="mr-2" /> Clear Read Notifications
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-gray-200">
          {loading && notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <div className="animate-spin inline-block w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full mb-2"></div>
              <p>Loading notifications...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">
              <p>{error}</p>
              <button
                onClick={() => fetchNotifications({
                  page: 1,
                  limit: 10,
                  ...filters
                })}
                className="mt-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-lg mb-2">No notifications found</p>
              <p className="text-sm">Any new notifications will appear here</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className={`relative p-6 hover:bg-gray-50 transition-colors ${!notification.isRead ? 'bg-blue-50' : ''}`}
              >
                <Link
                  to={notification.actionLink || '#'}
                  className="block"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4 text-2xl">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <h3 className={`text-base ${!notification.isRead ? 'font-semibold' : 'font-medium'} text-gray-900 truncate`}>
                          {notification.title}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                      <div className="mt-2 flex items-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {getNotificationTypeDisplay(notification.type)}
                        </span>
                        {notification.resourceType !== 'other' && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {notification.resourceType.charAt(0).toUpperCase() + notification.resourceType.slice(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
                <button
                  onClick={() => removeNotification(notification._id)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
                  aria-label="Delete notification"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>{' '}
                of <span className="font-medium">{pagination.total}</span> notifications
              </p>
              <nav className="flex space-x-1">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1 || loading}
                  className={`px-3 py-1 text-sm font-medium rounded-md ${pagination.page === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-200'}`}
                >
                  Previous
                </button>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    disabled={loading}
                    className={`px-3 py-1 text-sm font-medium rounded-md ${pagination.page === page ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages || loading}
                  className={`px-3 py-1 text-sm font-medium rounded-md ${pagination.page === pagination.totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-200'}`}
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
