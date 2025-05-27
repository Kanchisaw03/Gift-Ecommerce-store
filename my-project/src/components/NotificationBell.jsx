import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import { BiBell } from 'react-icons/bi';
import { FiX, FiCheck, FiTrash2 } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationBell = () => {
  const {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearReadNotifications
  } = useNotification();
  
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch notifications when dropdown is opened
  useEffect(() => {
    if (isOpen) {
      fetchNotifications({ limit: 5 });
    }
  }, [isOpen, fetchNotifications]);

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

  // Handle notification click
  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell */}
      <button
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <BiBell className="text-2xl" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 z-50 w-80 mt-2 bg-white rounded-md shadow-lg overflow-hidden"
          >
            <div className="p-3 bg-gray-50 border-b flex justify-between items-center">
              <h3 className="font-semibold text-gray-700">Notifications</h3>
              <div className="flex space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                    disabled={loading}
                  >
                    <FiCheck className="mr-1" /> Mark all read
                  </button>
                )}
                <button
                  onClick={clearReadNotifications}
                  className="text-xs text-gray-600 hover:text-gray-800 flex items-center"
                  disabled={loading}
                >
                  <FiTrash2 className="mr-1" /> Clear read
                </button>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-500">Loading...</div>
              ) : notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No notifications</div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <li
                      key={notification._id}
                      className={`relative ${!notification.isRead ? 'bg-blue-50' : ''}`}
                    >
                      <Link
                        to={notification.actionLink || '#'}
                        className="block p-4 hover:bg-gray-50 transition duration-150"
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex">
                          <div className="mr-3 text-xl">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm ${!notification.isRead ? 'font-semibold' : 'font-normal'} text-gray-900`}>
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      </Link>
                      <button
                        onClick={() => removeNotification(notification._id)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-1"
                        aria-label="Delete notification"
                      >
                        <FiX size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="p-2 bg-gray-50 border-t text-center">
              <Link
                to="/notifications"
                className="text-sm text-blue-600 hover:text-blue-800"
                onClick={() => setIsOpen(false)}
              >
                View all notifications
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
