import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../../shared/components/DashboardLayout';
import SettingsTabs from '../components/SettingsTabs';
import PlatformSettings from '../components/PlatformSettings';
import EmailSettings from '../components/EmailSettings';
import PaymentSettings from '../components/PaymentSettings';
import ShippingSettings from '../components/ShippingSettings';
import TaxSettings from '../components/TaxSettings';
import GeneralSettings from '../components/GeneralSettings';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('platform');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveAll = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      // In a real app, this would be an API call to save all settings
      // await fetch('/api/admin/settings', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(allSettings)
      // });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Saving all settings');
      setSaveSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'platform':
        return <PlatformSettings />;
      case 'email':
        return <EmailSettings />;
      case 'payment':
        return <PaymentSettings />;
      case 'shipping':
        return <ShippingSettings />;
      case 'tax':
        return <TaxSettings />;
      case 'general':
        return <GeneralSettings />;
      default:
        return <PlatformSettings />;
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <DashboardLayout>
      <motion.div
        initial="initial"
        animate="in"
        exit="exit"
        variants={pageVariants}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-playfair font-bold">Platform Settings</h1>
          
          <div className="flex items-center">
            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="mr-4 px-3 py-1 bg-green-900/30 text-green-300 rounded-md flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Settings saved successfully
              </motion.div>
            )}
            
            <button
              onClick={handleSaveAll}
              disabled={isSaving}
              className="px-4 py-2 bg-[#D4AF37] text-black rounded-md hover:bg-[#B8860B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Save All Settings
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-[#121212] rounded-lg shadow-xl overflow-hidden">
          <div className="p-6">
            <SettingsTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminSettings;
