import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AdminUsersList from '../components/AdminUsersList';
import AuditLogs from '../components/AuditLogs';
import SystemConfig from '../components/SystemConfig';

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for platform statistics
  const platformStats = {
    totalUsers: 12458,
    totalSellers: 342,
    totalProducts: 8756,
    totalOrders: 24689,
    totalRevenue: 1245890.75,
    pendingApprovals: 24,
    activeSessions: 876,
    systemHealth: 98.7, // percentage
    serverLoad: 42.3, // percentage
    diskUsage: 68.4, // percentage
    memoryUsage: 54.2, // percentage
    averageResponseTime: 187, // ms
    dailyVisitors: 4567,
    conversionRate: 3.2, // percentage
  };

  // Mock data for recent activities
  const recentActivities = [
    {
      id: 1,
      action: 'User Promotion',
      description: 'User John Doe was promoted to Admin role',
      user: 'SuperAdmin',
      timestamp: '2025-05-21 20:15:32',
      ip: '192.168.1.105',
    },
    {
      id: 2,
      action: 'System Setting Update',
      description: 'Platform commission rate changed from 5% to 4.5%',
      user: 'SuperAdmin',
      timestamp: '2025-05-21 19:42:18',
      ip: '192.168.1.105',
    },
    {
      id: 3,
      action: 'Admin User Created',
      description: 'New admin user "marketing@luxurygifts.com" was created',
      user: 'SuperAdmin',
      timestamp: '2025-05-21 18:30:45',
      ip: '192.168.1.105',
    },
    {
      id: 4,
      action: 'Backup Completed',
      description: 'System backup completed successfully',
      user: 'System',
      timestamp: '2025-05-21 18:00:00',
      ip: 'localhost',
    },
    {
      id: 5,
      action: 'Payment Gateway Update',
      description: 'Stripe API keys were updated',
      user: 'SuperAdmin',
      timestamp: '2025-05-21 17:22:10',
      ip: '192.168.1.105',
    },
  ];

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

  // Tab content renderer
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Platform Statistics */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              <div className="bg-gradient-to-br from-[#121212] to-[#1A1A1A] p-4 rounded-lg shadow-lg border border-gray-800">
                <h4 className="text-[#D4AF37] text-sm font-medium mb-1">Total Users</h4>
                <p className="text-2xl font-playfair font-semibold text-white">{platformStats.totalUsers.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <span className="text-green-400 text-xs">+2.4%</span>
                  <span className="text-gray-400 text-xs ml-2">vs last month</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-[#121212] to-[#1A1A1A] p-4 rounded-lg shadow-lg border border-gray-800">
                <h4 className="text-[#D4AF37] text-sm font-medium mb-1">Total Revenue</h4>
                <p className="text-2xl font-playfair font-semibold text-white">${platformStats.totalRevenue.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <span className="text-green-400 text-xs">+5.7%</span>
                  <span className="text-gray-400 text-xs ml-2">vs last month</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-[#121212] to-[#1A1A1A] p-4 rounded-lg shadow-lg border border-gray-800">
                <h4 className="text-[#D4AF37] text-sm font-medium mb-1">Total Orders</h4>
                <p className="text-2xl font-playfair font-semibold text-white">{platformStats.totalOrders.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <span className="text-green-400 text-xs">+3.2%</span>
                  <span className="text-gray-400 text-xs ml-2">vs last month</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-[#121212] to-[#1A1A1A] p-4 rounded-lg shadow-lg border border-gray-800">
                <h4 className="text-[#D4AF37] text-sm font-medium mb-1">Conversion Rate</h4>
                <p className="text-2xl font-playfair font-semibold text-white">{platformStats.conversionRate}%</p>
                <div className="flex items-center mt-2">
                  <span className="text-green-400 text-xs">+0.3%</span>
                  <span className="text-gray-400 text-xs ml-2">vs last month</span>
                </div>
              </div>
            </motion.div>

            {/* System Health */}
            <motion.div variants={itemVariants} className="bg-[#121212] rounded-lg shadow-lg p-6 border border-gray-800">
              <h3 className="text-xl font-playfair font-semibold mb-4 text-white">System Health</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-300">System Health</span>
                    <span className="text-sm font-medium text-green-400">{platformStats.systemHealth}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${platformStats.systemHealth}%` }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-300">Server Load</span>
                    <span className="text-sm font-medium text-yellow-400">{platformStats.serverLoad}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${platformStats.serverLoad}%` }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-300">Disk Usage</span>
                    <span className="text-sm font-medium text-yellow-400">{platformStats.diskUsage}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${platformStats.diskUsage}%` }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-300">Memory Usage</span>
                    <span className="text-sm font-medium text-yellow-400">{platformStats.memoryUsage}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${platformStats.memoryUsage}%` }}></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#1A1A1A] p-4 rounded-lg">
                  <h4 className="text-[#D4AF37] text-sm font-medium mb-2">Response Time</h4>
                  <p className="text-xl font-semibold text-white">{platformStats.averageResponseTime} ms</p>
                  <p className="text-xs text-gray-400 mt-1">Average API response time</p>
                </div>
                
                <div className="bg-[#1A1A1A] p-4 rounded-lg">
                  <h4 className="text-[#D4AF37] text-sm font-medium mb-2">Active Sessions</h4>
                  <p className="text-xl font-semibold text-white">{platformStats.activeSessions}</p>
                  <p className="text-xs text-gray-400 mt-1">Current active user sessions</p>
                </div>
                
                <div className="bg-[#1A1A1A] p-4 rounded-lg">
                  <h4 className="text-[#D4AF37] text-sm font-medium mb-2">Pending Approvals</h4>
                  <p className="text-xl font-semibold text-white">{platformStats.pendingApprovals}</p>
                  <p className="text-xs text-gray-400 mt-1">Items awaiting approval</p>
                </div>
              </div>
            </motion.div>

            {/* Recent Activities */}
            <motion.div variants={itemVariants} className="bg-[#121212] rounded-lg shadow-lg p-6 border border-gray-800">
              <h3 className="text-xl font-playfair font-semibold mb-4 text-white">Recent Activities</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#1E1E1E] border-b border-gray-700">
                    <tr>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Action</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Description</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">User</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Timestamp</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">IP Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {recentActivities.map((activity) => (
                      <tr key={activity.id} className="hover:bg-[#1A1A1A] transition-colors">
                        <td className="py-3 px-4 text-sm font-medium text-white">{activity.action}</td>
                        <td className="py-3 px-4 text-sm text-gray-300">{activity.description}</td>
                        <td className="py-3 px-4 text-sm text-gray-300">{activity.user}</td>
                        <td className="py-3 px-4 text-sm text-gray-300">{activity.timestamp}</td>
                        <td className="py-3 px-4 text-sm text-gray-300">{activity.ip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-right">
                <button className="text-[#D4AF37] hover:text-[#B8860B] text-sm font-medium">
                  View All Activities →
                </button>
              </div>
            </motion.div>
          </div>
        );
      case 'admins':
        return <AdminUsersList />;
      case 'audit':
        return <AuditLogs />;
      case 'system':
        return <SystemConfig />;
      default:
        return <div>Select a tab</div>;
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
            <h1 className="text-3xl font-playfair font-bold text-white">Super Admin Dashboard</h1>
            <p className="text-gray-400 mt-1">Platform-wide management and system configuration</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button className="px-4 py-2 bg-[#D4AF37] text-black rounded-md hover:bg-[#B8860B] transition-colors">
              System Status Report
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-800">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'overview'
                  ? 'border-[#D4AF37] text-[#D4AF37]'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('admins')}
              className={`py-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'admins'
                  ? 'border-[#D4AF37] text-[#D4AF37]'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              Admin Users
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`py-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'audit'
                  ? 'border-[#D4AF37] text-[#D4AF37]'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              Audit Logs
            </button>
            <button
              onClick={() => setActiveTab('system')}
              className={`py-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'system'
                  ? 'border-[#D4AF37] text-[#D4AF37]'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              System Configuration
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {renderTabContent()}
        </div>
      </div>
    </motion.div>
  );
};

export default SuperAdminDashboard;
