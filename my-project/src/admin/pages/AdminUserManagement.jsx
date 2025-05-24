import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { luxuryTheme } from '../../styles/luxuryTheme';
import DataTable from '../../shared/components/DataTable';
import UsersList from '../components/UsersList';

// Mock data for user activity
const mockUserActivity = [
  {
    id: 1,
    user: 'John Doe',
    email: 'john@example.com',
    action: 'Login',
    timestamp: '2025-05-20 22:15:42',
    ipAddress: '192.168.1.105',
    device: 'Chrome / Windows'
  },
  {
    id: 2,
    user: 'Sarah Williams',
    email: 'sarah@example.com',
    action: 'Purchase',
    timestamp: '2025-05-20 21:45:18',
    ipAddress: '192.168.1.107',
    device: 'Safari / macOS'
  },
  {
    id: 3,
    user: 'Michael Johnson',
    email: 'michael@example.com',
    action: 'Account Update',
    timestamp: '2025-05-20 20:32:33',
    ipAddress: '192.168.1.110',
    device: 'Firefox / Linux'
  },
  {
    id: 4,
    user: 'Emily Davis',
    email: 'emily@example.com',
    action: 'Password Reset',
    timestamp: '2025-05-20 19:15:27',
    ipAddress: '192.168.1.112',
    device: 'Chrome / Android'
  },
  {
    id: 5,
    user: 'David Wilson',
    email: 'david@example.com',
    action: 'Login',
    timestamp: '2025-05-20 18:40:12',
    ipAddress: '192.168.1.115',
    device: 'Safari / iOS'
  },
  {
    id: 6,
    user: 'Jennifer Brown',
    email: 'jennifer@example.com',
    action: 'Logout',
    timestamp: '2025-05-20 18:22:48',
    ipAddress: '192.168.1.118',
    device: 'Edge / Windows'
  }
];

const AdminUserManagement = () => {
  const [userActivity, setUserActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  // Simulate data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, you would fetch data from your API here
        // const activityResponse = await fetch('/api/admin/user-activity');
        // const activityData = await activityResponse.json();
        
        // For now, we'll use mock data
        setUserActivity(mockUserActivity);
      } catch (error) {
        console.error('Error fetching user activity data:', error);
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

  // Handle view activity details
  const handleViewActivity = (activity) => {
    setSelectedActivity(activity);
    setIsActivityModalOpen(true);
  };

  // Activity table columns
  const activityColumns = [
    {
      key: 'timestamp',
      label: 'Time'
    },
    {
      key: 'user',
      label: 'User',
      render: (value, row) => (
        <div>
          <div className="text-white">{value}</div>
          <div className="text-xs text-gray-400">{row.email}</div>
        </div>
      )
    },
    {
      key: 'action',
      label: 'Action',
      render: (value) => {
        let colorClass = '';
        switch (value) {
          case 'Login':
            colorClass = 'bg-green-900/50 text-green-300 border border-green-700/50';
            break;
          case 'Logout':
            colorClass = 'bg-blue-900/50 text-blue-300 border border-blue-700/50';
            break;
          case 'Purchase':
            colorClass = 'bg-purple-900/50 text-purple-300 border border-purple-700/50';
            break;
          case 'Password Reset':
            colorClass = 'bg-amber-900/50 text-amber-300 border border-amber-700/50';
            break;
          case 'Account Update':
            colorClass = 'bg-indigo-900/50 text-indigo-300 border border-indigo-700/50';
            break;
          default:
            colorClass = 'bg-gray-900/50 text-gray-300 border border-gray-700/50';
        }
        
        return (
          <span className={`px-2 py-1 text-xs rounded ${colorClass}`}>
            {value}
          </span>
        );
      }
    },
    {
      key: 'device',
      label: 'Device'
    },
    {
      key: 'ipAddress',
      label: 'IP Address'
    }
  ];

  // Activity table actions
  const activityActions = [
    {
      label: 'View Details',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      onClick: handleViewActivity
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
          User Management
        </h2>
        <p 
          className="text-gray-400"
          style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
        >
          Manage users and monitor user activity
        </p>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-gold/30 mb-6">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'users'
              ? 'text-gold border-b-2 border-gold'
              : 'text-gray-400 hover:text-white'
          }`}
          style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
        >
          All Users
        </button>
        
        <button
          onClick={() => setActiveTab('activity')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'activity'
              ? 'text-gold border-b-2 border-gold'
              : 'text-gray-400 hover:text-white'
          }`}
          style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
        >
          User Activity
        </button>
      </div>
      
      {/* All Users Tab */}
      {activeTab === 'users' && (
        <UsersList />
      )}
      
      {/* User Activity Tab */}
      {activeTab === 'activity' && (
        <div>
          {isLoading ? (
            <div className="animate-pulse bg-neutral-800 border border-gold/20 h-96 rounded-sm"></div>
          ) : (
            <DataTable
              columns={activityColumns}
              data={userActivity}
              actions={activityActions}
              itemsPerPage={10}
              searchable={true}
              sortable={true}
            />
          )}
        </div>
      )}
      
      {/* Activity Details Modal */}
      {isActivityModalOpen && selectedActivity && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-neutral-900 border border-gold/30 shadow-xl rounded-sm p-6 max-w-lg w-full"
            style={{ boxShadow: luxuryTheme.shadows.lg }}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 
                className="text-lg font-bold text-white"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
              >
                Activity Details
              </h3>
              
              <button
                onClick={() => setIsActivityModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Activity Content */}
            <div className="space-y-4">
              <div>
                <span 
                  className="text-gray-400 text-sm"
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                >
                  User
                </span>
                <p 
                  className="text-white"
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                >
                  {selectedActivity.user}
                </p>
              </div>
              
              <div>
                <span 
                  className="text-gray-400 text-sm"
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                >
                  Email
                </span>
                <p 
                  className="text-white"
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                >
                  {selectedActivity.email}
                </p>
              </div>
              
              <div>
                <span 
                  className="text-gray-400 text-sm"
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                >
                  Action
                </span>
                <p>
                  {(() => {
                    let colorClass = '';
                    switch (selectedActivity.action) {
                      case 'Login':
                        colorClass = 'bg-green-900/50 text-green-300 border border-green-700/50';
                        break;
                      case 'Logout':
                        colorClass = 'bg-blue-900/50 text-blue-300 border border-blue-700/50';
                        break;
                      case 'Purchase':
                        colorClass = 'bg-purple-900/50 text-purple-300 border border-purple-700/50';
                        break;
                      case 'Password Reset':
                        colorClass = 'bg-amber-900/50 text-amber-300 border border-amber-700/50';
                        break;
                      case 'Account Update':
                        colorClass = 'bg-indigo-900/50 text-indigo-300 border border-indigo-700/50';
                        break;
                      default:
                        colorClass = 'bg-gray-900/50 text-gray-300 border border-gray-700/50';
                    }
                    
                    return (
                      <span className={`px-2 py-1 text-xs rounded ${colorClass}`}>
                        {selectedActivity.action}
                      </span>
                    );
                  })()}
                </p>
              </div>
              
              <div>
                <span 
                  className="text-gray-400 text-sm"
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                >
                  Timestamp
                </span>
                <p 
                  className="text-white"
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                >
                  {selectedActivity.timestamp}
                </p>
              </div>
              
              <div>
                <span 
                  className="text-gray-400 text-sm"
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                >
                  IP Address
                </span>
                <p 
                  className="text-white"
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                >
                  {selectedActivity.ipAddress}
                </p>
              </div>
              
              <div>
                <span 
                  className="text-gray-400 text-sm"
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                >
                  Device / Browser
                </span>
                <p 
                  className="text-white"
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                >
                  {selectedActivity.device}
                </p>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setIsActivityModalOpen(false)}
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

export default AdminUserManagement;
