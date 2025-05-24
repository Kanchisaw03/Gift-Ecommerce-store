import React from 'react';
import { motion } from 'framer-motion';
import { luxuryTheme } from '../../styles/luxuryTheme';
import AdminSettings from '../components/AdminSettings';
import DashboardLayout from '../../shared/components/DashboardLayout';

const AdminSettingsPage = () => {
  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <AdminSettings />
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminSettingsPage;
