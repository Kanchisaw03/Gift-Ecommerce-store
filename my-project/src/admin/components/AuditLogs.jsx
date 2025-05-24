import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AuditLogs = () => {
  const [logs, setLogs] = useState([
    {
      id: 1,
      timestamp: '2025-05-21 15:32:45',
      user: 'John Smith',
      email: 'john@luxurygifts.com',
      action: 'product_create',
      details: 'Created product "Luxury Watch" (ID: P12345)',
      ip: '192.168.1.105',
      userAgent: 'Chrome 105.0.0.0 / Windows'
    },
    {
      id: 2,
      timestamp: '2025-05-21 14:18:22',
      user: 'Sarah Johnson',
      email: 'sarah@luxurygifts.com',
      action: 'order_status_update',
      details: 'Updated order #ORD-001 status from "processing" to "shipped"',
      ip: '192.168.1.107',
      userAgent: 'Safari 15.4 / macOS'
    },
    {
      id: 3,
      timestamp: '2025-05-21 12:05:11',
      user: 'Michael Brown',
      email: 'michael@luxurygifts.com',
      action: 'user_login',
      details: 'Admin user login',
      ip: '192.168.1.110',
      userAgent: 'Firefox 98.0 / Linux'
    },
    {
      id: 4,
      timestamp: '2025-05-21 11:45:37',
      user: 'System',
      email: 'system@luxurygifts.com',
      action: 'backup_created',
      details: 'Daily database backup completed successfully',
      ip: 'localhost',
      userAgent: 'System Process'
    },
    {
      id: 5,
      timestamp: '2025-05-21 10:22:19',
      user: 'Emily Davis',
      email: 'emily@luxurygifts.com',
      action: 'settings_update',
      details: 'Updated payment gateway settings',
      ip: '192.168.1.112',
      userAgent: 'Chrome 105.0.0.0 / Windows'
    },
    {
      id: 6,
      timestamp: '2025-05-21 09:15:52',
      user: 'David Wilson',
      email: 'david@luxurygifts.com',
      action: 'product_delete',
      details: 'Deleted product "Vintage Earrings" (ID: P12340)',
      ip: '192.168.1.115',
      userAgent: 'Edge 99.0.1150.30 / Windows'
    },
    {
      id: 7,
      timestamp: '2025-05-20 17:40:33',
      user: 'John Smith',
      email: 'john@luxurygifts.com',
      action: 'user_create',
      details: 'Created new admin user "Jennifer Brown"',
      ip: '192.168.1.105',
      userAgent: 'Chrome 105.0.0.0 / Windows'
    },
    {
      id: 8,
      timestamp: '2025-05-20 16:28:15',
      user: 'System',
      email: 'system@luxurygifts.com',
      action: 'maintenance_mode',
      details: 'Maintenance mode activated',
      ip: 'localhost',
      userAgent: 'System Process'
    },
    {
      id: 9,
      timestamp: '2025-05-20 16:05:47',
      user: 'System',
      email: 'system@luxurygifts.com',
      action: 'maintenance_mode',
      details: 'Maintenance mode deactivated',
      ip: 'localhost',
      userAgent: 'System Process'
    },
    {
      id: 10,
      timestamp: '2025-05-20 15:12:29',
      user: 'Sarah Johnson',
      email: 'sarah@luxurygifts.com',
      action: 'discount_create',
      details: 'Created new discount code "SUMMER25"',
      ip: '192.168.1.107',
      userAgent: 'Safari 15.4 / macOS'
    }
  ]);

  const [filters, setFilters] = useState({
    user: '',
    action: '',
    dateFrom: '',
    dateTo: '',
    searchQuery: ''
  });

  const [selectedLog, setSelectedLog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleClearFilters = () => {
    setFilters({
      user: '',
      action: '',
      dateFrom: '',
      dateTo: '',
      searchQuery: ''
    });
  };

  const handleViewDetails = (log) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  const uniqueUsers = [...new Set(logs.map(log => log.user))];
  const uniqueActions = [...new Set(logs.map(log => log.action))];

  const filteredLogs = logs.filter(log => {
    // Filter by user
    if (filters.user && log.user !== filters.user) return false;
    
    // Filter by action
    if (filters.action && log.action !== filters.action) return false;
    
    // Filter by date range
    if (filters.dateFrom) {
      const logDate = new Date(log.timestamp);
      const fromDate = new Date(filters.dateFrom);
      if (logDate < fromDate) return false;
    }
    
    if (filters.dateTo) {
      const logDate = new Date(log.timestamp);
      const toDate = new Date(filters.dateTo);
      // Add one day to include the end date fully
      toDate.setDate(toDate.getDate() + 1);
      if (logDate > toDate) return false;
    }
    
    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return (
        log.user.toLowerCase().includes(query) ||
        log.email.toLowerCase().includes(query) ||
        log.action.toLowerCase().includes(query) ||
        log.details.toLowerCase().includes(query) ||
        log.ip.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  const getActionBadgeClass = (action) => {
    switch (action) {
      case 'user_login':
      case 'user_logout':
        return 'bg-blue-900 text-blue-300';
      case 'user_create':
      case 'product_create':
      case 'discount_create':
        return 'bg-green-900 text-green-300';
      case 'user_delete':
      case 'product_delete':
        return 'bg-red-900 text-red-300';
      case 'settings_update':
      case 'order_status_update':
      case 'user_update':
      case 'product_update':
        return 'bg-yellow-900 text-yellow-300';
      case 'backup_created':
        return 'bg-purple-900 text-purple-300';
      case 'maintenance_mode':
        return 'bg-orange-900 text-orange-300';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  const formatActionName = (action) => {
    return action
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="bg-[#121212] rounded-lg shadow-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-playfair font-semibold text-white">Audit Logs</h3>
        <button
          onClick={() => console.log('Export logs')}
          className="px-4 py-2 bg-[#1E1E1E] text-white rounded hover:bg-gray-800 transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Export CSV
        </button>
      </div>
      
      {/* Filters */}
      <div className="mb-6 bg-[#1A1A1A] p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              User
            </label>
            <select
              name="user"
              value={filters.user}
              onChange={handleFilterChange}
              className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            >
              <option value="">All Users</option>
              {uniqueUsers.map(user => (
                <option key={user} value={user}>{user}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Action
            </label>
            <select
              name="action"
              value={filters.action}
              onChange={handleFilterChange}
              className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            >
              <option value="">All Actions</option>
              {uniqueActions.map(action => (
                <option key={action} value={action}>{formatActionName(action)}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              From Date
            </label>
            <input
              type="date"
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleFilterChange}
              className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              To Date
            </label>
            <input
              type="date"
              name="dateTo"
              value={filters.dateTo}
              onChange={handleFilterChange}
              className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Search
            </label>
            <input
              type="text"
              name="searchQuery"
              value={filters.searchQuery}
              onChange={handleFilterChange}
              placeholder="Search logs..."
              className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleClearFilters}
            className="px-3 py-1 border border-gray-600 rounded hover:bg-gray-800 transition-colors text-sm"
          >
            Clear Filters
          </button>
        </div>
      </div>
      
      {/* Logs Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#1E1E1E] border-b border-gray-700">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Timestamp</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">User</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Action</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Details</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">IP Address</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-[#1A1A1A] transition-colors">
                <td className="py-3 px-4 text-sm">{log.timestamp}</td>
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium">{log.user}</p>
                    <p className="text-xs text-gray-400">{log.email}</p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionBadgeClass(log.action)}`}>
                    {formatActionName(log.action)}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm max-w-xs truncate">{log.details}</td>
                <td className="py-3 px-4 text-sm">{log.ip}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleViewDetails(log)}
                    className="px-3 py-1 bg-[#1E1E1E] text-white rounded hover:bg-gray-800 transition-colors text-sm"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredLogs.length === 0 && (
          <div className="p-4 text-center text-gray-400">
            No audit logs found matching your filters.
          </div>
        )}
      </div>

      {/* Log Details Modal */}
      {isModalOpen && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-[#121212] rounded-lg shadow-xl p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-playfair font-semibold">Log Details</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="bg-[#1A1A1A] rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Timestamp</p>
                  <p className="font-medium">{selectedLog.timestamp}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Action</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionBadgeClass(selectedLog.action)}`}>
                    {formatActionName(selectedLog.action)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-400">User</p>
                  <p className="font-medium">{selectedLog.user}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="font-medium">{selectedLog.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">IP Address</p>
                  <p className="font-medium">{selectedLog.ip}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">User Agent</p>
                  <p className="font-medium">{selectedLog.userAgent}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-1">Details</p>
              <div className="bg-[#1A1A1A] rounded-lg p-4">
                <p>{selectedLog.details}</p>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-[#1E1E1E] text-white rounded hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogs;
