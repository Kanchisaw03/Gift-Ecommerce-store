import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AdminUsersList = () => {
  const [adminUsers, setAdminUsers] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john@luxurygifts.com',
      role: 'admin',
      department: 'Products',
      lastLogin: '2025-05-20 14:32:45',
      status: 'active',
      permissions: ['products', 'orders', 'customers']
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@luxurygifts.com',
      role: 'admin',
      department: 'Marketing',
      lastLogin: '2025-05-19 09:15:22',
      status: 'active',
      permissions: ['marketing', 'content', 'promotions']
    },
    {
      id: 3,
      name: 'Michael Brown',
      email: 'michael@luxurygifts.com',
      role: 'admin',
      department: 'Customer Support',
      lastLogin: '2025-05-21 08:45:11',
      status: 'active',
      permissions: ['customers', 'orders', 'returns']
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily@luxurygifts.com',
      role: 'admin',
      department: 'Finance',
      lastLogin: '2025-05-18 16:20:37',
      status: 'inactive',
      permissions: ['finance', 'reports']
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAddUser = () => {
    setEditingUser({
      id: null,
      name: '',
      email: '',
      role: 'admin',
      department: '',
      status: 'active',
      permissions: []
    });
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser({ ...user });
    setIsModalOpen(true);
  };

  const handleDeleteUser = (userId) => {
    setAdminUsers(adminUsers.filter(user => user.id !== userId));
  };

  const handleToggleStatus = (userId) => {
    setAdminUsers(adminUsers.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          status: user.status === 'active' ? 'inactive' : 'active'
        };
      }
      return user;
    }));
  };

  const handlePromoteToSuperAdmin = (userId) => {
    setAdminUsers(adminUsers.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          role: 'superadmin',
          permissions: ['all']
        };
      }
      return user;
    }));
  };

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setEditingUser({
      ...editingUser,
      [name]: value
    });
  };

  const handlePermissionChange = (permission) => {
    if (editingUser.permissions.includes(permission)) {
      setEditingUser({
        ...editingUser,
        permissions: editingUser.permissions.filter(p => p !== permission)
      });
    } else {
      setEditingUser({
        ...editingUser,
        permissions: [...editingUser.permissions, permission]
      });
    }
  };

  const handleSaveUser = () => {
    if (editingUser.id) {
      // Update existing user
      setAdminUsers(adminUsers.map(user => 
        user.id === editingUser.id ? editingUser : user
      ));
    } else {
      // Add new user
      const newId = Math.max(...adminUsers.map(u => u.id), 0) + 1;
      setAdminUsers([...adminUsers, { ...editingUser, id: newId, lastLogin: 'Never' }]);
    }
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const filteredUsers = adminUsers.filter(user => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.department.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <div className="bg-[#121212] rounded-lg shadow-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-playfair font-semibold text-white">Admin Users</h3>
        <div className="flex space-x-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-64 bg-[#1E1E1E] border border-gray-700 rounded-md p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button
            onClick={handleAddUser}
            className="px-4 py-2 bg-[#D4AF37] text-black rounded hover:bg-[#B8860B] transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Admin
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#1E1E1E] border-b border-gray-700">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Name</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Email</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Role</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Department</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Last Login</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Status</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-[#1A1A1A] transition-colors">
                <td className="py-3 px-4 font-medium">{user.name}</td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'superadmin' ? 'bg-purple-900 text-purple-300' : 'bg-blue-900 text-blue-300'}`}>
                    {user.role === 'superadmin' ? 'Super Admin' : 'Admin'}
                  </span>
                </td>
                <td className="py-3 px-4">{user.department}</td>
                <td className="py-3 px-4 text-sm text-gray-300">{user.lastLogin}</td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300'}`}>
                    {user.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="p-1 text-gray-300 hover:text-white"
                      title="Edit"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleToggleStatus(user.id)}
                      className={`p-1 ${user.status === 'active' ? 'text-yellow-500 hover:text-yellow-400' : 'text-green-500 hover:text-green-400'}`}
                      title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                    >
                      {user.status === 'active' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                    {user.role !== 'superadmin' && (
                      <button
                        onClick={() => handlePromoteToSuperAdmin(user.id)}
                        className="p-1 text-purple-500 hover:text-purple-400"
                        title="Promote to Super Admin"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 10.414V14a1 1 0 102 0v-3.586l1.293 1.293a1 1 0 001.414-1.414l-3-3z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="p-1 text-red-500 hover:text-red-400"
                      title="Delete"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredUsers.length === 0 && (
          <div className="p-4 text-center text-gray-400">
            No admin users found matching your search.
          </div>
        )}
      </div>

      {/* Edit/Add User Modal */}
      {isModalOpen && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-[#121212] rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-playfair font-semibold mb-4">
              {editingUser.id ? 'Edit Admin User' : 'Add Admin User'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editingUser.name}
                  onChange={handleUserChange}
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="Full Name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={editingUser.email}
                  onChange={handleUserChange}
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="email@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={editingUser.department}
                  onChange={handleUserChange}
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="e.g. Marketing"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Role
                </label>
                <select
                  name="role"
                  value={editingUser.role}
                  onChange={handleUserChange}
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                >
                  <option value="admin">Admin</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={editingUser.status}
                  onChange={handleUserChange}
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Permissions
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['products', 'orders', 'customers', 'marketing', 'content', 'promotions', 'finance', 'reports', 'settings', 'users'].map(permission => (
                    <div key={permission} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`permission-${permission}`}
                        checked={editingUser.permissions.includes(permission) || editingUser.permissions.includes('all')}
                        onChange={() => handlePermissionChange(permission)}
                        disabled={editingUser.permissions.includes('all')}
                        className="w-4 h-4 text-[#D4AF37] bg-gray-700 border-gray-600 rounded focus:ring-[#D4AF37] focus:ring-opacity-25"
                      />
                      <label htmlFor={`permission-${permission}`} className="ml-2 text-sm text-gray-300 capitalize">
                        {permission}
                      </label>
                    </div>
                  ))}
                  <div className="flex items-center col-span-2 mt-2 pt-2 border-t border-gray-700">
                    <input
                      type="checkbox"
                      id="permission-all"
                      checked={editingUser.permissions.includes('all')}
                      onChange={() => handlePermissionChange('all')}
                      className="w-4 h-4 text-[#D4AF37] bg-gray-700 border-gray-600 rounded focus:ring-[#D4AF37] focus:ring-opacity-25"
                    />
                    <label htmlFor="permission-all" className="ml-2 text-sm font-medium text-[#D4AF37]">
                      All Permissions (Super Admin)
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUser}
                className="px-4 py-2 bg-[#D4AF37] text-black rounded-md hover:bg-[#B8860B] transition-colors"
              >
                {editingUser.id ? 'Update User' : 'Add User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersList;
