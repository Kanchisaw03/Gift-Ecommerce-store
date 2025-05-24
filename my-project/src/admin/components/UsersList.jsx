import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DataTable from '../../shared/components/DataTable';
import { ROLES } from '../../context/AuthContext';
import { luxuryTheme } from '../../styles/luxuryTheme';

// Mock data for users
const mockUsers = [
  { 
    id: 1, 
    name: 'John Doe', 
    email: 'john@example.com', 
    role: ROLES.BUYER, 
    joinDate: '2025-04-10', 
    status: 'active',
    orders: 12
  },
  { 
    id: 2, 
    name: 'Jane Smith', 
    email: 'jane@example.com', 
    role: ROLES.SELLER, 
    joinDate: '2025-03-15', 
    status: 'active',
    orders: 0,
    products: 8
  },
  { 
    id: 3, 
    name: 'Robert Johnson', 
    email: 'robert@example.com', 
    role: ROLES.BUYER, 
    joinDate: '2025-05-01', 
    status: 'active',
    orders: 3
  },
  { 
    id: 4, 
    name: 'Emily Davis', 
    email: 'emily@example.com', 
    role: ROLES.SELLER, 
    joinDate: '2025-04-22', 
    status: 'suspended',
    orders: 0,
    products: 5
  },
  { 
    id: 5, 
    name: 'Michael Brown', 
    email: 'michael@example.com', 
    role: ROLES.BUYER, 
    joinDate: '2025-02-18', 
    status: 'active',
    orders: 7
  },
  { 
    id: 6, 
    name: 'Sarah Wilson', 
    email: 'sarah@example.com', 
    role: ROLES.ADMIN, 
    joinDate: '2025-01-05', 
    status: 'active',
    orders: 0
  },
  { 
    id: 7, 
    name: 'David Miller', 
    email: 'david@example.com', 
    role: ROLES.BUYER, 
    joinDate: '2025-03-30', 
    status: 'active',
    orders: 5
  },
  { 
    id: 8, 
    name: 'Jennifer Taylor', 
    email: 'jennifer@example.com', 
    role: ROLES.SELLER, 
    joinDate: '2025-04-15', 
    status: 'active',
    orders: 0,
    products: 12
  },
  { 
    id: 9, 
    name: 'James Anderson', 
    email: 'james@example.com', 
    role: ROLES.BUYER, 
    joinDate: '2025-05-10', 
    status: 'active',
    orders: 1
  },
  { 
    id: 10, 
    name: 'Lisa Thomas', 
    email: 'lisa@example.com', 
    role: ROLES.BUYER, 
    joinDate: '2025-04-05', 
    status: 'suspended',
    orders: 2
  }
];

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [activeRoleFilter, setActiveRoleFilter] = useState('all');

  // Simulate data fetching
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // In a real app, you would fetch data from your API here
        // const response = await fetch('/api/admin/users');
        // const data = await response.json();
        
        // For now, we'll use mock data
        setUsers(mockUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Simulate API delay
    const timer = setTimeout(() => {
      fetchUsers();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filter users by role
  const filteredUsers = activeRoleFilter === 'all' 
    ? users 
    : users.filter(user => user.role === activeRoleFilter);

  // Handle view user details
  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  };

  // Handle suspend/reactivate user
  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
      
      // In a real app, you would call your API here
      // await fetch(`/api/admin/users/${userId}/status`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: newStatus })
      // });
      
      // For now, we'll just update the local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));
      
      // Update selected user if modal is open
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({ ...selectedUser, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  // Handle delete user
  const handleDeleteUser = async (userId) => {
    try {
      // In a real app, you would call your API here
      // await fetch(`/api/admin/users/${userId}`, {
      //   method: 'DELETE'
      // });
      
      // For now, we'll just update the local state
      setUsers(users.filter(user => user.id !== userId));
      
      // Close modal if the deleted user was being viewed
      if (selectedUser && selectedUser.id === userId) {
        setIsDetailsModalOpen(false);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Table columns
  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (value, row) => (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
            <span className="text-gold text-sm font-semibold">
              {value.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">{value}</p>
            <p className="text-xs text-gray-400">{row.email}</p>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      label: 'Role',
      render: (value) => (
        <span className="capitalize">{value.replace('_', ' ')}</span>
      )
    },
    {
      key: 'joinDate',
      label: 'Join Date'
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 rounded-sm text-xs uppercase ${
          value === 'active' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-red-900/30 text-red-400'
        }`}>
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
    },
    {
      label: 'Toggle Status',
      icon: (row) => (
        row.status === 'active' ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
          </svg>
        )
      ),
      color: (row) => row.status === 'active' ? 'text-amber-500 hover:bg-amber-900/20' : 'text-emerald-500 hover:bg-emerald-900/20',
      onClick: (row) => handleToggleUserStatus(row.id, row.status)
    },
    {
      label: 'Delete',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ),
      color: 'text-red-500 hover:bg-red-900/20',
      onClick: (row) => handleDeleteUser(row.id)
    }
  ];

  return (
    <div>
      {/* Header with role filters */}
      <div className="mb-6">
        <h2 
          className="text-xl font-bold text-white mb-4"
          style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
        >
          Users Management
        </h2>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveRoleFilter('all')}
            className={`px-3 py-2 text-sm ${
              activeRoleFilter === 'all'
                ? 'bg-gold/20 text-gold border border-gold/50'
                : 'border border-gold/30 text-gray-300 hover:bg-gold/10 hover:text-gold'
            }`}
            style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
          >
            All Users
          </button>
          
          {Object.values(ROLES).map((role) => (
            <button
              key={role}
              onClick={() => setActiveRoleFilter(role)}
              className={`px-3 py-2 text-sm capitalize ${
                activeRoleFilter === role
                  ? 'bg-gold/20 text-gold border border-gold/50'
                  : 'border border-gold/30 text-gray-300 hover:bg-gold/10 hover:text-gold'
              }`}
              style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
            >
              {role.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>
      
      {/* Users Table */}
      {isLoading ? (
        <div className="animate-pulse bg-neutral-800 border border-gold/20 h-96 rounded-sm"></div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredUsers}
          actions={actions}
          itemsPerPage={10}
          searchable={true}
          sortable={true}
        />
      )}
      
      {/* User Details Modal */}
      {isDetailsModalOpen && selectedUser && (
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
                User Details
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
            
            {/* User Profile */}
            <div className="flex items-center mb-6 pb-6 border-b border-gold/20">
              <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center">
                <span className="text-gold text-2xl font-semibold">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </span>
              </div>
              
              <div className="ml-4">
                <h4 
                  className="text-xl font-semibold text-white"
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                >
                  {selectedUser.name}
                </h4>
                <p 
                  className="text-gray-400"
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                >
                  {selectedUser.email}
                </p>
                <div className="flex items-center mt-2">
                  <span className={`px-2 py-1 rounded-sm text-xs uppercase mr-2 ${
                    selectedUser.status === 'active' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-red-900/30 text-red-400'
                  }`}>
                    {selectedUser.status}
                  </span>
                  <span className="px-2 py-1 bg-gold/10 text-gold rounded-sm text-xs uppercase">
                    {selectedUser.role.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
            
            {/* User Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h5 
                  className="text-sm font-medium text-gold mb-2"
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                >
                  Account Information
                </h5>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span 
                      className="text-gray-400"
                      style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                    >
                      User ID
                    </span>
                    <span 
                      className="text-white"
                      style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                    >
                      #{selectedUser.id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span 
                      className="text-gray-400"
                      style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                    >
                      Join Date
                    </span>
                    <span 
                      className="text-white"
                      style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                    >
                      {selectedUser.joinDate}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span 
                      className="text-gray-400"
                      style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                    >
                      Role
                    </span>
                    <span 
                      className="text-white capitalize"
                      style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                    >
                      {selectedUser.role.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h5 
                  className="text-sm font-medium text-gold mb-2"
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                >
                  Activity
                </h5>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span 
                      className="text-gray-400"
                      style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                    >
                      Orders
                    </span>
                    <span 
                      className="text-white"
                      style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                    >
                      {selectedUser.orders}
                    </span>
                  </div>
                  {selectedUser.role === ROLES.SELLER && (
                    <div className="flex justify-between">
                      <span 
                        className="text-gray-400"
                        style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                      >
                        Products
                      </span>
                      <span 
                        className="text-white"
                        style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                      >
                        {selectedUser.products}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span 
                      className="text-gray-400"
                      style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                    >
                      Last Login
                    </span>
                    <span 
                      className="text-white"
                      style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                    >
                      2025-05-20
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => handleToggleUserStatus(selectedUser.id, selectedUser.status)}
                className={`px-4 py-2 ${
                  selectedUser.status === 'active'
                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                } transition-all duration-300`}
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                {selectedUser.status === 'active' ? 'Suspend User' : 'Reactivate User'}
              </button>
              
              <button
                onClick={() => {
                  handleDeleteUser(selectedUser.id);
                  setIsDetailsModalOpen(false);
                }}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition-all duration-300"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                Delete User
              </button>
              
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="px-4 py-2 border border-gold/30 text-gold hover:bg-gold/10 transition-all duration-300"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
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

export default UsersList;
