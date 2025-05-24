import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SuperAdminUserRoles = () => {
  const [roles, setRoles] = useState([
    {
      id: 1,
      name: 'Super Admin',
      description: 'Full access to all system features and settings',
      permissions: [
        'manage_admins', 'manage_roles', 'manage_platform_settings', 
        'view_analytics', 'manage_users', 'manage_sellers', 
        'manage_products', 'manage_orders', 'manage_reviews',
        'manage_categories', 'manage_features', 'manage_system'
      ],
      users: 2,
      editable: false
    },
    {
      id: 2,
      name: 'Admin',
      description: 'Access to most admin features except system configuration',
      permissions: [
        'view_analytics', 'manage_users', 'manage_sellers', 
        'manage_products', 'manage_orders', 'manage_reviews',
        'manage_categories'
      ],
      users: 5,
      editable: true
    },
    {
      id: 3,
      name: 'Moderator',
      description: 'Can moderate products, reviews, and user content',
      permissions: [
        'manage_products', 'manage_reviews', 'view_users', 
        'view_orders', 'view_analytics'
      ],
      users: 8,
      editable: true
    },
    {
      id: 4,
      name: 'Analytics',
      description: 'View-only access to analytics and reports',
      permissions: [
        'view_analytics', 'view_users', 'view_sellers', 
        'view_products', 'view_orders', 'view_reviews'
      ],
      users: 3,
      editable: true
    },
    {
      id: 5,
      name: 'Customer Support',
      description: 'Handle customer inquiries and order management',
      permissions: [
        'view_users', 'view_orders', 'manage_orders', 
        'view_products', 'view_reviews'
      ],
      users: 12,
      editable: true
    }
  ]);

  const [editingRole, setEditingRole] = useState(null);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [showNewRoleForm, setShowNewRoleForm] = useState(false);

  // All available permissions
  const allPermissions = [
    { id: 'manage_admins', name: 'Manage Administrators', category: 'System' },
    { id: 'manage_roles', name: 'Manage Roles & Permissions', category: 'System' },
    { id: 'manage_platform_settings', name: 'Manage Platform Settings', category: 'System' },
    { id: 'manage_system', name: 'Manage System Configuration', category: 'System' },
    { id: 'view_analytics', name: 'View Analytics & Reports', category: 'Analytics' },
    { id: 'export_analytics', name: 'Export Analytics Data', category: 'Analytics' },
    { id: 'manage_users', name: 'Manage Users', category: 'Users' },
    { id: 'view_users', name: 'View Users', category: 'Users' },
    { id: 'manage_sellers', name: 'Manage Sellers', category: 'Sellers' },
    { id: 'view_sellers', name: 'View Sellers', category: 'Sellers' },
    { id: 'manage_products', name: 'Manage Products', category: 'Products' },
    { id: 'view_products', name: 'View Products', category: 'Products' },
    { id: 'manage_categories', name: 'Manage Categories', category: 'Products' },
    { id: 'manage_orders', name: 'Manage Orders', category: 'Orders' },
    { id: 'view_orders', name: 'View Orders', category: 'Orders' },
    { id: 'manage_reviews', name: 'Manage Reviews', category: 'Content' },
    { id: 'view_reviews', name: 'View Reviews', category: 'Content' },
    { id: 'manage_features', name: 'Manage Featured Content', category: 'Content' }
  ];

  // Group permissions by category
  const permissionsByCategory = allPermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {});

  const handleEditRole = (role) => {
    setEditingRole({
      ...role,
      permissions: [...role.permissions]
    });
  };

  const handleCancelEdit = () => {
    setEditingRole(null);
  };

  const handleSaveRole = () => {
    setRoles(roles.map(role => 
      role.id === editingRole.id ? editingRole : role
    ));
    setEditingRole(null);
  };

  const handlePermissionToggle = (permissionId) => {
    if (editingRole.permissions.includes(permissionId)) {
      setEditingRole({
        ...editingRole,
        permissions: editingRole.permissions.filter(id => id !== permissionId)
      });
    } else {
      setEditingRole({
        ...editingRole,
        permissions: [...editingRole.permissions, permissionId]
      });
    }
  };

  const handleDeleteRole = (id) => {
    setRoles(roles.filter(role => role.id !== id));
  };

  const handleAddNewRole = () => {
    const newRole = {
      id: roles.length + 1,
      name: newRoleName,
      description: newRoleDescription,
      permissions: [],
      users: 0,
      editable: true
    };
    
    setRoles([...roles, newRole]);
    setNewRoleName('');
    setNewRoleDescription('');
    setShowNewRoleForm(false);
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
            <h1 className="text-3xl font-playfair font-bold text-white">User Roles & Permissions</h1>
            <p className="text-gray-400 mt-1">Manage access control for platform administrators</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button 
              onClick={() => setShowNewRoleForm(true)}
              className="px-4 py-2 bg-[#D4AF37] text-black rounded-md hover:bg-[#B8860B] transition-colors"
            >
              Add New Role
            </button>
          </div>
        </div>

        {/* New Role Form */}
        {showNewRoleForm && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#121212] rounded-lg shadow-lg p-6 mb-8 border border-gray-800"
          >
            <h3 className="text-xl font-playfair font-semibold mb-4 text-white">Create New Role</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Role Name
                </label>
                <input
                  type="text"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="e.g. Content Manager"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={newRoleDescription}
                  onChange={(e) => setNewRoleDescription(e.target.value)}
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="Brief description of role responsibilities"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowNewRoleForm(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNewRole}
                disabled={!newRoleName}
                className={`px-4 py-2 rounded-md ${
                  newRoleName 
                    ? 'bg-[#D4AF37] text-black hover:bg-[#B8860B]' 
                    : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                } transition-colors`}
              >
                Create Role
              </button>
            </div>
          </motion.div>
        )}

        {/* Roles List */}
        {!editingRole && (
          <motion.div variants={itemVariants} className="bg-[#121212] rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#1E1E1E] border-b border-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Role</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Description</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Permissions</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Users</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {roles.map((role) => (
                    <tr key={role.id} className="hover:bg-[#1A1A1A] transition-colors">
                      <td className="py-3 px-4 font-medium text-white">{role.name}</td>
                      <td className="py-3 px-4 text-gray-300">{role.description}</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.slice(0, 3).map((permission, index) => (
                            <span 
                              key={index}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#1E1E1E] text-gray-300"
                            >
                              {permission.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </span>
                          ))}
                          {role.permissions.length > 3 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#1E1E1E] text-gray-300">
                              +{role.permissions.length - 3} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-300">{role.users}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditRole(role)}
                            className="px-2 py-1 bg-[#1E1E1E] text-white rounded hover:bg-gray-800 transition-colors text-xs"
                            disabled={!role.editable}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteRole(role.id)}
                            className="px-2 py-1 bg-red-900 text-red-300 rounded hover:bg-red-800 transition-colors text-xs"
                            disabled={!role.editable || role.users > 0}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Edit Role Form */}
        {editingRole && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[#121212] rounded-lg shadow-lg p-6 border border-gray-800"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-playfair font-semibold text-white">Edit Role: {editingRole.name}</h3>
              <div className="flex space-x-3">
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveRole}
                  className="px-4 py-2 bg-[#D4AF37] text-black rounded-md hover:bg-[#B8860B] transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Role Name
                </label>
                <input
                  type="text"
                  value={editingRole.name}
                  onChange={(e) => setEditingRole({...editingRole, name: e.target.value})}
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={editingRole.description}
                  onChange={(e) => setEditingRole({...editingRole, description: e.target.value})}
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
            </div>
            
            <h4 className="text-lg font-medium text-[#D4AF37] mb-4">Permissions</h4>
            
            <div className="space-y-6">
              {Object.entries(permissionsByCategory).map(([category, permissions]) => (
                <div key={category} className="bg-[#1A1A1A] p-4 rounded-lg">
                  <h5 className="font-medium text-white mb-3">{category}</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {permissions.map((permission) => (
                      <div key={permission.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={permission.id}
                          checked={editingRole.permissions.includes(permission.id)}
                          onChange={() => handlePermissionToggle(permission.id)}
                          className="w-4 h-4 text-[#D4AF37] bg-[#1E1E1E] border-gray-700 rounded focus:ring-[#D4AF37] focus:ring-opacity-25"
                        />
                        <label htmlFor={permission.id} className="ml-2 text-sm text-gray-300">
                          {permission.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default SuperAdminUserRoles;
