import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSuperAdmin } from '../../hooks/useSuperAdmin';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import AdminUsersList from '../components/AdminUsersList';
import AuditLogs from '../components/AuditLogs';
import SystemConfig from '../components/SystemConfig';
import DashboardLayout from '../../shared/components/DashboardLayout';
import StatsCard from '../../shared/components/StatsCard';
import { luxuryTheme } from '../../styles/luxuryTheme';

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();
  const { 
    dashboardData, 
    loading: contextLoading, 
    error, 
    fetchDashboardData,
    auditLogs,
    systemSettings
  } = useSuperAdmin();
  
  const [isLoading, setIsLoading] = useState(true);

  // Fetch dashboard data from backend
  useEffect(() => {
    // Only fetch data if user is authenticated and is a super admin
    if (user?.role === 'super_admin') {
      const loadDashboardData = async () => {
        setIsLoading(true);
        try {
          await fetchDashboardData();
        } catch (err) {
          console.error('Error fetching dashboard data:', err);
          toast.error('Failed to load dashboard data');
        } finally {
          setIsLoading(false);
        }
      };
      
      loadDashboardData();
    }
    // Remove fetchDashboardData from dependencies to prevent infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Format percentage
  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  // Calculate stats from real data
  const platformStats = dashboardData?.platformStats || {
    totalUsers: 0,
    totalSellers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingApprovals: 0,
    activeSessions: 0,
    systemHealth: 0,
    serverLoad: 0,
    diskUsage: 0,
    memoryUsage: 0,
    averageResponseTime: 0,
    dailyVisitors: 0,
    conversionRate: 0,
  };

  // Get recent activities from real data
  const recentActivities = auditLogs || [];

  const loading = isLoading || contextLoading;

  // Render different content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Platform Statistics */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-6 border-b border-gold/20 pb-2">
                Platform Statistics
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard
                  title="Total Users"
                  value={platformStats.totalUsers}
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  }
                />
                
                <StatsCard
                  title="Total Sellers"
                  value={platformStats.totalSellers}
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  }
                />
                
                <StatsCard
                  title="Total Products"
                  value={platformStats.totalProducts}
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  }
                />
                
                <StatsCard
                  title="Total Orders"
                  value={platformStats.totalOrders}
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  }
                />
                
                <StatsCard
                  title="Total Revenue"
                  value={formatCurrency(platformStats.totalRevenue)}
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                />
                
                <StatsCard
                  title="Pending Approvals"
                  value={platformStats.pendingApprovals}
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                  trend={parseInt(platformStats.pendingApprovals) > 0 ? "up" : "none"}
                  trendValue={`${platformStats.pendingApprovals} new`}
                  trendLabel="need review"
                />
                
                <StatsCard
                  title="Active Sessions"
                  value={platformStats.activeSessions}
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  }
                />
                
                <StatsCard
                  title="Daily Visitors"
                  value={platformStats.dailyVisitors}
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  }
                />
              </div>
            </div>
            
            {/* System Health */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-6 border-b border-gold/20 pb-2">
                System Health
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                  title="System Health"
                  value={formatPercentage(platformStats.systemHealth)}
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  }
                  trend={platformStats.systemHealth > 95 ? "up" : platformStats.systemHealth < 90 ? "down" : "none"}
                  trendValue={platformStats.systemHealth > 95 ? "Good" : platformStats.systemHealth < 90 ? "Warning" : "Stable"}
                />
                
                <StatsCard
                  title="Server Load"
                  value={formatPercentage(platformStats.serverLoad)}
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                    </svg>
                  }
                  trend={platformStats.serverLoad > 80 ? "down" : "none"}
                  trendValue={platformStats.serverLoad > 80 ? "High" : "Normal"}
                />
                
                <StatsCard
                  title="Disk Usage"
                  value={formatPercentage(platformStats.diskUsage)}
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  }
                  trend={platformStats.diskUsage > 85 ? "down" : "none"}
                  trendValue={platformStats.diskUsage > 85 ? "Warning" : "Normal"}
                />
                
                <StatsCard
                  title="Memory Usage"
                  value={formatPercentage(platformStats.memoryUsage)}
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  }
                  trend={platformStats.memoryUsage > 80 ? "down" : "none"}
                  trendValue={platformStats.memoryUsage > 80 ? "High" : "Normal"}
                />
              </div>
            </div>
            
            {/* Recent Activities */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-6 border-b border-gold/20 pb-2">
                Recent Activities
              </h2>
              
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="animate-pulse h-16 bg-neutral-700/50 rounded-sm"></div>
                  ))}
                </div>
              ) : recentActivities.length > 0 ? (
                <div className="bg-neutral-800 border border-gold/20 rounded-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gold/10">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gold uppercase tracking-wider">
                            Action
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gold uppercase tracking-wider">
                            Description
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gold uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gold uppercase tracking-wider">
                            Timestamp
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gold uppercase tracking-wider">
                            IP
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gold/10">
                        {recentActivities.slice(0, 5).map((activity) => (
                          <tr key={activity._id || activity.id} className="hover:bg-neutral-700/30 transition-colors">
                            <td className="px-4 py-4 whitespace-nowrap text-sm">
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-gold/10 text-gold">
                                {activity.action}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-white">
                              {activity.description}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                              {activity.user}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                              {new Date(activity.timestamp).toLocaleString()}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                              {activity.ip}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400 bg-neutral-800 border border-gold/20 rounded-sm">
                  <p>No recent activities found</p>
                </div>
              )}
              
              <div className="mt-4 text-center">
                <button 
                  onClick={() => setActiveTab('audit')}
                  className="text-gold hover:text-gold/80 text-sm font-medium"
                >
                  View all activities →
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'users':
        return <AdminUsersList />;
      
      case 'audit':
        return <AuditLogs />;
      
      case 'system':
        return <SystemConfig />;
      
      default:
        return null;
    }
  };

  return (
    <DashboardLayout activeTab="dashboard" role="superadmin">
      {/* Welcome message */}
      <div className="mb-8">
        <h1 
          className="text-2xl font-bold text-white mb-2"
          style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
        >
          Super Admin Dashboard
        </h1>
        <p 
          className="text-gray-400"
          style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
        >
          Welcome back, {user?.name}. You have full control over the platform.
        </p>
      </div>
      
      {/* Navigation tabs */}
      <div className="mb-8 border-b border-gold/20">
        <nav className="flex space-x-8">
          <button
            className={`pb-4 px-1 ${activeTab === 'overview' ? 'text-gold border-b-2 border-gold font-medium' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`pb-4 px-1 ${activeTab === 'users' ? 'text-gold border-b-2 border-gold font-medium' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('users')}
          >
            User Management
          </button>
          <button
            className={`pb-4 px-1 ${activeTab === 'audit' ? 'text-gold border-b-2 border-gold font-medium' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('audit')}
          >
            Audit Logs
          </button>
          <button
            className={`pb-4 px-1 ${activeTab === 'system' ? 'text-gold border-b-2 border-gold font-medium' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('system')}
          >
            System Configuration
          </button>
        </nav>
      </div>
      
      {/* Main content */}
      {loading && activeTab === 'overview' ? (
        <div className="space-y-8">
          <div className="animate-pulse h-64 bg-neutral-800 rounded-sm"></div>
          <div className="animate-pulse h-64 bg-neutral-800 rounded-sm"></div>
        </div>
      ) : (
        renderTabContent()
      )}
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;
