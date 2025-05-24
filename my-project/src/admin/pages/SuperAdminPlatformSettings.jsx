import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SuperAdminPlatformSettings = () => {
  const [commissionSettings, setCommissionSettings] = useState({
    platformCommissionRate: 5.0,
    sellerFee: 0.99,
    transactionFee: 0.3,
    minimumWithdrawalAmount: 50,
    withdrawalFee: 2.5,
  });

  const [featureToggles, setFeatureToggles] = useState({
    userRegistration: true,
    sellerApplications: true,
    productReviews: true,
    marketplace: true,
    maintenanceMode: false,
    guestCheckout: true,
    wishlist: true,
    comparisons: true,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: 'beforeChildren',
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 },
    },
  };

  const handleCommissionChange = (e) => {
    const { name, value } = e.target;
    setCommissionSettings({
      ...commissionSettings,
      [name]: parseFloat(value),
    });
  };

  const handleFeatureToggle = (feature) => {
    setFeatureToggles({
      ...featureToggles,
      [feature]: !featureToggles[feature],
    });
  };

  const handleSaveSettings = () => {
    console.log('Saving settings');
    console.log('Commission Settings:', commissionSettings);
    console.log('Feature Toggles:', featureToggles);
  };

  return (
    <motion.div
      className="min-h-screen bg-[#0A0A0A] text-white p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 variants={itemVariants} className="text-3xl font-bold mb-6">
        Super Admin Platform Settings
      </motion.h1>

      {/* Commission Settings */}
      <motion.div variants={itemVariants} className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Commission Settings</h2>
        {Object.entries(commissionSettings).map(([key, value]) => (
          <div key={key} className="mb-3">
            <label className="block capitalize mb-1">{key.replace(/([A-Z])/g, ' $1')}</label>
            <input
              type="number"
              name={key}
              value={value}
              onChange={handleCommissionChange}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
            />
          </div>
        ))}
      </motion.div>

      {/* Feature Toggles */}
      <motion.div variants={itemVariants} className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Feature Toggles</h2>
        {Object.entries(featureToggles).map(([feature, isEnabled]) => (
          <div key={feature} className="flex items-center mb-3">
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={() => handleFeatureToggle(feature)}
              className="mr-2"
            />
            <label className="capitalize">{feature.replace(/([A-Z])/g, ' $1')}</label>
          </div>
        ))}
      </motion.div>

      {/* Save Button */}
      <motion.button
        variants={itemVariants}
        onClick={handleSaveSettings}
        className="bg-blue-600 hover:bg-blue-700 transition-colors px-6 py-2 rounded text-white"
      >
        Save Settings
      </motion.button>
    </motion.div>
  );
};

export default SuperAdminPlatformSettings;
