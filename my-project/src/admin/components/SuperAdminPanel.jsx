import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { luxuryTheme } from '../../styles/luxuryTheme';
import DataTable from '../../shared/components/DataTable';

// Mock data for admin users
const mockAdmins = [
  { 
    id: 1, 
    name: 'John Smith', 
    email: 'john@luxehaven.com',
    role: 'Super Admin',
    lastLogin: '2025-05-20 18:45:22',
    status: 'active'
  },
  { 
    id: 2, 
    name: 'Emily Davis', 
    email: 'emily@luxehaven.com',
    role: 'Admin',
    lastLogin: '2025-05-19 14:30:15',
    status: 'active'
  },
  { 
    id: 3, 
    name: 'Michael Johnson', 
    email: 'michael@luxehaven.com',
    role: 'Admin',
    lastLogin: '2025-05-18 09:15:43',
    status: 'active'
  },
  { 
    id: 4, 
    name: 'Sarah Williams', 
    email: 'sarah@luxehaven.com',
    role: 'Admin',
    lastLogin: '2025-05-17 16:22:10',
    status: 'inactive'
  }
];

// Mock data for system logs
const mockSystemLogs = [
  {
    id: 1,
    action: 'User Login',
    user: 'John Smith',
    details: 'Super Admin login from 192.168.1.105',
    timestamp: '2025-05-20 23:15:42',
    level: 'info'
  },
  {
    id: 2,
    action: 'Settings Updated',
    user: 'John Smith',
    details: 'Commission rate changed from 8% to 10%',
    timestamp: '2025-05-20 22:45:18',
    level: 'warning'
  },
  {
    id: 3,
    action: 'Product Deleted',
    user: 'Emily Davis',
    details: 'Product ID #5892 removed from catalog',
    timestamp: '2025-05-20 20:12:33',
    level: 'warning'
  },
  {
    id: 4,
    action: 'User Suspended',
    user: 'Michael Johnson',
    details: 'User ID #342 suspended for policy violation',
    timestamp: '2025-05-20 19:05:27',
    level: 'error'
  },
  {
    id: 5,
    action: 'Backup Completed',
    user: 'System',
    details: 'Daily database backup completed successfully',
    timestamp: '2025-05-20 04:00:12',
    level: 'info'
  },
  {
    id: 6,
    action: 'New Admin Added',
    user: 'John Smith',
    details: 'New admin account created for Sarah Williams',
    timestamp: '2025-05-19 15:22:48',
    level: 'warning'
  }
];

const SuperAdminPanel = () => {
  const [admins, setAdmins] = useState([]);
  const [systemLogs, setSystemLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('admins');
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Admin'
  });
  const [formErrors, setFormErrors] = useState({});

  // Simulate data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, you would fetch data from your API here
        // const adminsResponse = await fetch('/api/super-admin/admins');
        // const adminsData = await adminsResponse.json();
        // const logsResponse = await fetch('/api/super-admin/logs');
        // const logsData = await logsResponse.json();
        
        // For now, we'll use mock data
        setAdmins(mockAdmins);
        setSystemLogs(mockSystemLogs);
      } catch (error) {
        console.error('Error fetching super admin data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Simulate API delay
    const timer = setTimeout(() => {
      fetchData();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Handle input changes for new admin form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin({
      ...newAdmin,
      [name]: value
    });
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!newAdmin.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!newAdmin.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(newAdmin.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!newAdmin.password) {
      errors.password = 'Password is required';
    } else if (newAdmin.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle add admin form submission
  const handleAddAdmin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      // In a real app, you would call your API here
      // await fetch('/api/super-admin/admins', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newAdmin)
      // });
      
      // For now, we'll just update the local state
      const newAdminWithId = {
        ...newAdmin,
        id: admins.length + 1,
        lastLogin: 'Never',
        status: 'active'
      };
      
      setAdmins([...admins, newAdminWithId]);
      setShowAddAdminModal(false);
      setNewAdmin({
        name: '',
        email: '',
        password: '',
        role: 'Admin'
      });
    } catch (error) {
      console.error('Error adding admin:', error);
    }
  };

  // Handle toggle admin status
  const handleToggleStatus = async (adminId) => {
    try {
      // In a real app, you would call your API here
      // await fetch(`/api/super-admin/admins/${adminId}/toggle-status`, {
      //   method: 'PATCH'
      // });
      
      // For now, we'll just update the local state
      setAdmins(admins.map(admin => {
        if (admin.id === adminId) {
          return {
            ...admin,
            status: admin.status === 'active' ? 'inactive' : 'active'
          };
        }
        return admin;
      }));
    } catch (error) {
      console.error('Error toggling admin status:', error);
    }
  };

  // Admin table columns
  const adminColumns = [
    {
      key: 'name',
      label: 'Name'
    },
    {
      key: 'email',
      label: 'Email'
    },
    {
      key: 'role',
      label: 'Role',
      render: (value) => (
        <span 
          className={`px-2 py-1 text-xs rounded ${
            value === 'Super Admin' 
              ? 'bg-purple-900/50 text-purple-300 border border-purple-700/50' 
              : 'bg-blue-900/50 text-blue-300 border border-blue-700/50'
          }`}
        >
          {value}
        </span>
      )
    },
    {
      key: 'lastLogin',
      label: 'Last Login'
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span 
          className={`px-2 py-1 text-xs rounded ${
            value === 'active' 
              ? 'bg-green-900/50 text-green-300 border border-green-700/50' 
              : 'bg-red-900/50 text-red-300 border border-red-700/50'
          }`}
        >
          {value === 'active' ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ];

  // Admin table actions
  const adminActions = [
    {
      label: 'Toggle Status',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      ),
      onClick: (row) => handleToggleStatus(row.id),
      color: 'text-amber-500 hover:bg-amber-900/20'
    }
  ];

  // System logs table columns
  const logColumns = [
    {
      key: 'timestamp',
      label: 'Timestamp'
    },
    {
      key: 'action',
      label: 'Action'
    },
    {
      key: 'user',
      label: 'User'
    },
    {
      key: 'level',
      label: 'Level',
      render: (value) => {
        let colorClass = '';
        switch (value) {
          case 'info':
            colorClass = 'bg-blue-900/50 text-blue-300 border border-blue-700/50';
            break;
          case 'warning':
            colorClass = 'bg-amber-900/50 text-amber-300 border border-amber-700/50';
            break;
          case 'error':
            colorClass = 'bg-red-900/50 text-red-300 border border-red-700/50';
            break;
          default:
            colorClass = 'bg-gray-900/50 text-gray-300 border border-gray-700/50';
        }
        
        return (
          <span className={`px-2 py-1 text-xs rounded ${colorClass}`}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </span>
        );
      }
    },
    {
      key: 'details',
      label: 'Details'
    }
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 
          className="text-xl font-bold text-white mb-2"
          style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
        >
          Super Admin Panel
        </h2>
        <p 
          className="text-gray-400"
          style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
        >
          Manage platform administrators and system logs
        </p>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-gold/30 mb-6">
        <button
          onClick={() => setActiveTab('admins')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'admins'
              ? 'text-gold border-b-2 border-gold'
              : 'text-gray-400 hover:text-white'
          }`}
          style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
        >
          Administrators
        </button>
        
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'logs'
              ? 'text-gold border-b-2 border-gold'
              : 'text-gray-400 hover:text-white'
          }`}
          style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
        >
          System Logs
        </button>
      </div>
      
      {/* Admin Management */}
      {activeTab === 'admins' && (
        <div>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowAddAdminModal(true)}
              className="px-4 py-2 bg-gold text-black hover:bg-gold/90 transition-all duration-300 flex items-center"
              style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Administrator
            </button>
          </div>
          
          {isLoading ? (
            <div className="animate-pulse bg-neutral-800 border border-gold/20 h-96 rounded-sm"></div>
          ) : (
            <DataTable
              columns={adminColumns}
              data={admins}
              actions={adminActions}
              itemsPerPage={10}
              searchable={true}
              sortable={true}
            />
          )}
        </div>
      )}
      
      {/* System Logs */}
      {activeTab === 'logs' && (
        <div>
          <div className="flex justify-end mb-4">
            <button
              className="px-4 py-2 border border-gold/30 text-gold hover:bg-gold/10 transition-all duration-300 flex items-center"
              style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export Logs
            </button>
          </div>
          
          {isLoading ? (
            <div className="animate-pulse bg-neutral-800 border border-gold/20 h-96 rounded-sm"></div>
          ) : (
            <DataTable
              columns={logColumns}
              data={systemLogs}
              itemsPerPage={10}
              searchable={true}
              sortable={true}
            />
          )}
        </div>
      )}
      
      {/* Add Admin Modal */}
      {showAddAdminModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-neutral-900 border border-gold/30 shadow-xl rounded-sm p-6 max-w-md w-full"
            style={{ boxShadow: luxuryTheme.shadows.lg }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 
                className="text-lg font-bold text-white"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
              >
                Add Administrator
              </h3>
              
              <button
                onClick={() => setShowAddAdminModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleAddAdmin}>
              <div className="mb-4">
                <label 
                  htmlFor="name" 
                  className="block text-sm font-medium text-gray-300 mb-2"
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newAdmin.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 bg-black/20 border ${
                    formErrors.name ? 'border-red-500' : 'border-gold/30'
                  } focus:outline-none focus:border-gold text-white`}
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.name}
                  </p>
                )}
              </div>
              
              <div className="mb-4">
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-gray-300 mb-2"
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={newAdmin.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 bg-black/20 border ${
                    formErrors.email ? 'border-red-500' : 'border-gold/30'
                  } focus:outline-none focus:border-gold text-white`}
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.email}
                  </p>
                )}
              </div>
              
              <div className="mb-4">
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium text-gray-300 mb-2"
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={newAdmin.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 bg-black/20 border ${
                    formErrors.password ? 'border-red-500' : 'border-gold/30'
                  } focus:outline-none focus:border-gold text-white`}
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                />
                {formErrors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.password}
                  </p>
                )}
              </div>
              
              <div className="mb-6">
                <label 
                  htmlFor="role" 
                  className="block text-sm font-medium text-gray-300 mb-2"
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                >
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={newAdmin.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-black/20 border border-gold/30 focus:outline-none focus:border-gold text-white"
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                >
                  <option value="Admin">Admin</option>
                  <option value="Super Admin">Super Admin</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddAdminModal(false)}
                  className="px-4 py-2 border border-gold/30 text-gold hover:bg-gold/10 transition-all duration-300"
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  className="px-4 py-2 bg-gold text-black hover:bg-gold/90 transition-all duration-300"
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                >
                  Add Administrator
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminPanel;
