import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { luxuryTheme } from '../../styles/luxuryTheme';

const AdminSettings = () => {
  // State for form values
  const [settings, setSettings] = useState({
    siteName: 'Luxe Haven',
    siteDescription: 'Premium luxury e-commerce platform for discerning customers.',
    contactEmail: 'admin@luxehaven.com',
    supportPhone: '+1 (800) 555-1234',
    commissionRate: 10,
    minOrderAmount: 50,
    freeShippingThreshold: 200,
    maintenanceMode: false,
    allowNewRegistrations: true,
    requireProductApproval: true,
    autoApproveSellerAccounts: false,
    enableGuestCheckout: true
  });

  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      // In a real app, you would call your API here
      // await fetch('/api/admin/settings', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings)
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccessMessage('Settings updated successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error updating settings:', error);
      setErrorMessage('Failed to update settings. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 
          className="text-xl font-bold text-white mb-2"
          style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
        >
          Admin Settings
        </h2>
        <p 
          className="text-gray-400"
          style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
        >
          Configure platform settings and policies
        </p>
      </div>
      
      {/* Settings Form */}
      <form onSubmit={handleSubmit}>
        <div className="bg-neutral-800 border border-gold/20 p-6 rounded-sm mb-8">
          <h3 
            className="text-lg font-medium text-gold mb-4"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
          >
            General Settings
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label 
                htmlFor="siteName" 
                className="block text-sm font-medium text-gray-300 mb-2"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                Site Name
              </label>
              <input
                type="text"
                id="siteName"
                name="siteName"
                value={settings.siteName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-black/20 border border-gold/30 focus:outline-none focus:border-gold text-white"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              />
            </div>
            
            <div>
              <label 
                htmlFor="contactEmail" 
                className="block text-sm font-medium text-gray-300 mb-2"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                Contact Email
              </label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={settings.contactEmail}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-black/20 border border-gold/30 focus:outline-none focus:border-gold text-white"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              />
            </div>
            
            <div>
              <label 
                htmlFor="supportPhone" 
                className="block text-sm font-medium text-gray-300 mb-2"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                Support Phone
              </label>
              <input
                type="text"
                id="supportPhone"
                name="supportPhone"
                value={settings.supportPhone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-black/20 border border-gold/30 focus:outline-none focus:border-gold text-white"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label 
              htmlFor="siteDescription" 
              className="block text-sm font-medium text-gray-300 mb-2"
              style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
            >
              Site Description
            </label>
            <textarea
              id="siteDescription"
              name="siteDescription"
              value={settings.siteDescription}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-2 bg-black/20 border border-gold/30 focus:outline-none focus:border-gold text-white"
              style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
            ></textarea>
          </div>
        </div>
        
        <div className="bg-neutral-800 border border-gold/20 p-6 rounded-sm mb-8">
          <h3 
            className="text-lg font-medium text-gold mb-4"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
          >
            Commerce Settings
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label 
                htmlFor="commissionRate" 
                className="block text-sm font-medium text-gray-300 mb-2"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                Commission Rate (%)
              </label>
              <input
                type="number"
                id="commissionRate"
                name="commissionRate"
                value={settings.commissionRate}
                onChange={handleInputChange}
                min="0"
                max="100"
                step="0.1"
                className="w-full px-4 py-2 bg-black/20 border border-gold/30 focus:outline-none focus:border-gold text-white"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              />
            </div>
            
            <div>
              <label 
                htmlFor="minOrderAmount" 
                className="block text-sm font-medium text-gray-300 mb-2"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                Minimum Order Amount ($)
              </label>
              <input
                type="number"
                id="minOrderAmount"
                name="minOrderAmount"
                value={settings.minOrderAmount}
                onChange={handleInputChange}
                min="0"
                step="1"
                className="w-full px-4 py-2 bg-black/20 border border-gold/30 focus:outline-none focus:border-gold text-white"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              />
            </div>
            
            <div>
              <label 
                htmlFor="freeShippingThreshold" 
                className="block text-sm font-medium text-gray-300 mb-2"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                Free Shipping Threshold ($)
              </label>
              <input
                type="number"
                id="freeShippingThreshold"
                name="freeShippingThreshold"
                value={settings.freeShippingThreshold}
                onChange={handleInputChange}
                min="0"
                step="1"
                className="w-full px-4 py-2 bg-black/20 border border-gold/30 focus:outline-none focus:border-gold text-white"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              />
            </div>
          </div>
        </div>
        
        <div className="bg-neutral-800 border border-gold/20 p-6 rounded-sm mb-8">
          <h3 
            className="text-lg font-medium text-gold mb-4"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
          >
            Platform Settings
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="maintenanceMode"
                name="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={handleInputChange}
                className="w-4 h-4 border border-gold/30 bg-black/20 focus:ring-gold"
              />
              <label 
                htmlFor="maintenanceMode" 
                className="ml-2 text-sm text-white"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                Enable Maintenance Mode
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="allowNewRegistrations"
                name="allowNewRegistrations"
                checked={settings.allowNewRegistrations}
                onChange={handleInputChange}
                className="w-4 h-4 border border-gold/30 bg-black/20 focus:ring-gold"
              />
              <label 
                htmlFor="allowNewRegistrations" 
                className="ml-2 text-sm text-white"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                Allow New User Registrations
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="requireProductApproval"
                name="requireProductApproval"
                checked={settings.requireProductApproval}
                onChange={handleInputChange}
                className="w-4 h-4 border border-gold/30 bg-black/20 focus:ring-gold"
              />
              <label 
                htmlFor="requireProductApproval" 
                className="ml-2 text-sm text-white"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                Require Product Approval
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoApproveSellerAccounts"
                name="autoApproveSellerAccounts"
                checked={settings.autoApproveSellerAccounts}
                onChange={handleInputChange}
                className="w-4 h-4 border border-gold/30 bg-black/20 focus:ring-gold"
              />
              <label 
                htmlFor="autoApproveSellerAccounts" 
                className="ml-2 text-sm text-white"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                Auto-Approve Seller Accounts
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableGuestCheckout"
                name="enableGuestCheckout"
                checked={settings.enableGuestCheckout}
                onChange={handleInputChange}
                className="w-4 h-4 border border-gold/30 bg-black/20 focus:ring-gold"
              />
              <label 
                htmlFor="enableGuestCheckout" 
                className="ml-2 text-sm text-white"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                Enable Guest Checkout
              </label>
            </div>
          </div>
        </div>
        
        {/* Form Submission */}
        <div className="flex justify-end">
          {errorMessage && (
            <div className="mr-4 text-red-500" style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}>
              {errorMessage}
            </div>
          )}
          
          {successMessage && (
            <div className="mr-4 text-emerald-500" style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}>
              {successMessage}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 bg-gold text-black hover:bg-gold/90 transition-all duration-300 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
          >
            {isSubmitting ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
