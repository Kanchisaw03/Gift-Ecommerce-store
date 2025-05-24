import React from 'react';
import { motion } from 'framer-motion';
import { luxuryTheme } from '../../styles/luxuryTheme';
import SuperAdminPanel from '../components/SuperAdminPanel';
import DashboardLayout from '../../shared/components/DashboardLayout';

const SuperAdminPage = () => {
  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <SuperAdminPanel />
      </motion.div>
    </DashboardLayout>
  );
};

export default SuperAdminPage;
