import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SuperAdminAuditLogs = () => {
  // Mock data for audit logs
  const initialLogs = [
    {
      id: 1,
      action: 'User Login',
      description: 'Admin user logged in to the system',
      user: 'admin@luxurygifts.com',
      userRole: 'Admin',
      timestamp: '2025-05-21 21:15:32',
      ip: '192.168.1.105',
      status: 'success'
    },
    {
      id: 2,
      action: 'Product Update',
      description: 'Product "Luxury Gold Watch" was updated',
      user: 'admin@luxurygifts.com',
      userRole: 'Admin',
      timestamp: '2025-05-21 20:42:18',
      ip: '192.168.1.105',
      status: 'success'
    },
    {
      id: 3,
      action: 'Order Status Change',
      description: 'Order #12345 status changed from "Processing" to "Shipped"',
      user: 'support@luxurygifts.com',
      userRole: 'Customer Support',
      timestamp: '2025-05-21 19:30:45',
      ip: '192.168.1.106',
      status: 'success'
    },
    {
      id: 4,
      action: 'User Creation',
      description: 'New admin user "marketing@luxurygifts.com" was created',
      user: 'superadmin@luxurygifts.com',
      userRole: 'Super Admin',
      timestamp: '2025-05-21 18:22:10',
      ip: '192.168.1.104',
      status: 'success'
    },
    {
      id: 5,
      action: 'Settings Update',
      description: 'Platform commission rate changed from 5% to 4.5%',
      user: 'superadmin@luxurygifts.com',
      userRole: 'Super Admin',
      timestamp: '2025-05-21 17:15:33',
      ip: '192.168.1.104',
      status: 'success'
    },
    {
      id: 6,
      action: 'Failed Login Attempt',
      description: 'Failed login attempt for user "admin@luxurygifts.com"',
      user: 'Unknown',
      userRole: 'Unknown',
      timestamp: '2025-05-21 16:45:12',
      ip: '203.0.113.42',
      status: 'error'
    },
    {
      id: 7,
      action: 'Category Creation',
      description: 'New category "Luxury Gifts" was created',
      user: 'admin@luxurygifts.com',
      userRole: 'Admin',
      timestamp: '2025-05-21 15:30:22',
      ip: '192.168.1.105',
      status: 'success'
    },
    {
      id: 8,
      action: 'Product Deletion',
      description: 'Product "Vintage Wine Set" was deleted',
      user: 'admin@luxurygifts.com',
      userRole: 'Admin',
      timestamp: '2025-05-21 14:18:05',
      ip: '192.168.1.105',
      status: 'success'
    },
    {
      id: 9,
      action: 'Backup Completed',
      description: 'System backup completed successfully',
      user: 'System',
      userRole: 'System',
      timestamp: '2025-05-21 12:00:00',
      ip: 'localhost',
      status: 'success'
    },
    {
      id: 10,
      action: 'API Key Reset',
      description: 'Stripe API keys were updated',
      user: 'superadmin@luxurygifts.com',
      userRole: 'Super Admin',
      timestamp: '2025-05-21 11:22:10',
      ip: '192.168.1.104',
      status: 'success'
    },
    {
      id: 11,
      action: 'User Role Change',
      description: 'User "support2@luxurygifts.com" role changed from "Customer Support" to "Admin"',
      user: 'superadmin@luxurygifts.com',
      userRole: 'Super Admin',
      timestamp: '2025-05-21 10:15:42',
      ip: '192.168.1.104',
      status: 'success'
    },
    {
      id: 12,
      action: 'Failed API Request',
      description: 'Failed API request to payment gateway',
      user: 'System',
      userRole: 'System',
      timestamp: '2025-05-21 09:32:18',
      ip: 'localhost',
      status: 'error'
    },
    {
      id: 13,
      action: 'User Logout',
      description: 'Admin user logged out of the system',
      user: 'admin@luxurygifts.com',
      userRole: 'Admin',
      timestamp: '2025-05-21 08:45:11',
      ip: '192.168.1.105',
      status: 'success'
    },
    {
      id: 14,
      action: 'Bulk Product Import',
      description: 'Imported 25 new products via CSV',
      user: 'admin@luxurygifts.com',
      userRole: 'Admin',
      timestamp: '2025-05-20 16:30:22',
      ip: '192.168.1.105',
      status: 'success'
    },
    {
      id: 15,
      action: 'System Settings Update',
      description: 'Email notification settings were updated',
      user: 'superadmin@luxurygifts.com',
      userRole: 'Super Admin',
      timestamp: '2025-05-20 15:12:33',
      ip: '192.168.1.104',
      status: 'success'
    }
  ];

  const [logs, setLogs] = useState(initialLogs);
  const [filters, setFilters] = useState({
    action: '',
    user: '',
    role: '',
    status: '',
    dateFrom: '',
    dateTo: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;

  // Apply filters
  const filteredLogs = logs.filter(log => {
    const matchesAction = !filters.action || log.action.toLowerCase().includes(filters.action.toLowerCase());
    const matchesUser = !filters.user || log.user.toLowerCase().includes(filters.user.toLowerCase());
    const matchesRole = !filters.role || log.userRole === filters.role;
    const matchesStatus = !filters.status || log.status === filters.status;
    
    let matchesDate = true;
    if (filters.dateFrom || filters.dateTo) {
      const logDate = new Date(log.timestamp);
      
      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom);
        if (logDate < fromDate) {
          matchesDate = false;
        }
      }
      
      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo);
        // Set time to end of day
        toDate.setHours(23, 59, 59, 999);
        if (logDate > toDate) {
          matchesDate = false;
        }
      }
    }
    
    return matchesAction && matchesUser && matchesRole && matchesStatus && matchesDate;
  });

  // Pagination
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleClearFilters = () => {
    setFilters({
      action: '',
      user: '',
      role: '',
      status: '',
      dateFrom: '',
      dateTo: ''
    });
    setCurrentPage(1);
  };

  const handleExportLogs = () => {
    console.log('Exporting logs:', filteredLogs);
    // In a real app, this would generate a CSV/Excel file for download
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-[#0A0A0A] text-white p-6"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-white">Audit Logs</h1>
            <p className="text-gray-400 mt-1">Track and monitor all system activities</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button 
              onClick={handleExportLogs}
              className="px-4 py-2 bg-[#D4AF37] text-black rounded-md hover:bg-[#B8860B] transition-colors"
            >
              Export Logs
            </button>
          </div>
        </div>

        {/* Filters */}
        <motion.div 
          variants={itemVariants}
          className="bg-[#121212] rounded-lg shadow-lg p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Action
              </label>
              <input
                type="text"
                name="action"
                value={filters.action}
                onChange={handleFilterChange}
                placeholder="Filter by action type"
                className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                User
              </label>
              <input
                type="text"
                name="user"
                value={filters.user}
                onChange={handleFilterChange}
                placeholder="Filter by username or email"
                className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Role
              </label>
              <select
                name="role"
                value={filters.role}
                onChange={handleFilterChange}
                className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                <option value="">All Roles</option>
                <option value="Super Admin">Super Admin</option>
                <option value="Admin">Admin</option>
                <option value="Customer Support">Customer Support</option>
                <option value="System">System</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Status
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                <option value="">All Statuses</option>
                <option value="success">Success</option>
                <option value="error">Error</option>
                <option value="warning">Warning</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Date From
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
                Date To
              </label>
              <input
                type="date"
                name="dateTo"
                value={filters.dateTo}
                onChange={handleFilterChange}
                className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </motion.div>

        {/* Logs Table */}
        <motion.div variants={itemVariants} className="bg-[#121212] rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#1E1E1E] border-b border-gray-700">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Action</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Description</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">User</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Role</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Timestamp</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">IP Address</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {currentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#1A1A1A] transition-colors">
                    <td className="py-3 px-4 font-medium text-white">{log.action}</td>
                    <td className="py-3 px-4 text-sm text-gray-300">{log.description}</td>
                    <td className="py-3 px-4 text-sm text-gray-300">{log.user}</td>
                    <td className="py-3 px-4 text-sm text-gray-300">{log.userRole}</td>
                    <td className="py-3 px-4 text-sm text-gray-300">{log.timestamp}</td>
                    <td className="py-3 px-4 text-sm text-gray-300">{log.ip}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        log.status === 'success' 
                          ? 'bg-green-900 text-green-300' 
                          : log.status === 'error'
                            ? 'bg-red-900 text-red-300'
                            : 'bg-yellow-900 text-yellow-300'
                      }`}>
                        {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredLogs.length === 0 && (
            <div className="py-8 text-center text-gray-400">
              No logs match your filters
            </div>
          )}
        </motion.div>

        {/* Pagination */}
        {filteredLogs.length > 0 && (
          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-400">
              Showing {indexOfFirstLog + 1}-{Math.min(indexOfLastLog, filteredLogs.length)} of {filteredLogs.length} logs
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1 
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                    : 'bg-[#1E1E1E] text-gray-300 hover:bg-[#2A2A2A]'
                } transition-colors`}
              >
                Previous
              </button>
              
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                // Calculate page numbers to show (centered around current page)
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 rounded ${
                      currentPage === pageNum 
                        ? 'bg-[#D4AF37] text-black' 
                        : 'bg-[#1E1E1E] text-gray-300 hover:bg-[#2A2A2A]'
                    } transition-colors`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button 
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages 
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                    : 'bg-[#1E1E1E] text-gray-300 hover:bg-[#2A2A2A]'
                } transition-colors`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SuperAdminAuditLogs;
