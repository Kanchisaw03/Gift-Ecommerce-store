import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { luxuryTheme } from '../../styles/luxuryTheme';
import DashboardLayout from '../../shared/components/DashboardLayout';

const SellerSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Profile settings
  const [profileData, setProfileData] = useState({
    storeName: 'Luxury Artisan',
    description: 'Purveyor of fine handcrafted luxury goods for the discerning customer.',
    email: 'contact@luxuryartisan.com',
    phone: '+1 (555) 123-4567',
    website: 'www.luxuryartisan.com',
    logo: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  });
  
  // Shipping settings
  const [shippingData, setShippingData] = useState({
    defaultShippingTime: '3-5',
    freeShippingThreshold: 200,
    internationalShipping: true,
    returnPolicy: 30,
    shippingFrom: {
      address: '123 Luxury Lane',
      city: 'Beverly Hills',
      state: 'CA',
      zip: '90210',
      country: 'United States'
    }
  });
  
  // Payment settings
  const [paymentData, setPaymentData] = useState({
    paymentMethod: 'bank',
    bankName: 'Luxury National Bank',
    accountNumber: '****4567',
    routingNumber: '****8901',
    paypalEmail: 'payments@luxuryartisan.com',
    taxId: '12-3456789'
  });
  
  // Notification settings
  const [notificationData, setNotificationData] = useState({
    emailNotifications: true,
    orderConfirmations: true,
    orderUpdates: true,
    lowStockAlerts: true,
    marketingEmails: false,
    smsNotifications: false
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  const handleShippingChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setShippingData({
        ...shippingData,
        [parent]: {
          ...shippingData[parent],
          [child]: value
        }
      });
    } else {
      setShippingData({
        ...shippingData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentData({
      ...paymentData,
      [name]: value
    });
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationData({
      ...notificationData,
      [name]: checked
    });
  };

  const handleSubmit = async (e, formType) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccessMessage(`${formType} settings updated successfully!`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error(`Error updating ${formType} settings:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <form onSubmit={(e) => handleSubmit(e, 'Profile')} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Store Name</label>
                <input
                  type="text"
                  name="storeName"
                  value={profileData.storeName}
                  onChange={handleProfileChange}
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Website</label>
                <input
                  type="text"
                  name="website"
                  value={profileData.website}
                  onChange={handleProfileChange}
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">Store Description</label>
                <textarea
                  name="description"
                  value={profileData.description}
                  onChange={handleProfileChange}
                  rows="4"
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                ></textarea>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 bg-[#D4AF37] text-black font-medium rounded-md hover:bg-[#C4A137] transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        );
      case 'shipping':
        return (
          <form onSubmit={(e) => handleSubmit(e, 'Shipping')} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Default Shipping Time (days)</label>
                <select
                  name="defaultShippingTime"
                  value={shippingData.defaultShippingTime}
                  onChange={handleShippingChange}
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                >
                  <option value="1-2">1-2 days</option>
                  <option value="3-5">3-5 days</option>
                  <option value="5-7">5-7 days</option>
                  <option value="7-10">7-10 days</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Free Shipping Threshold ($)</label>
                <input
                  type="number"
                  name="freeShippingThreshold"
                  value={shippingData.freeShippingThreshold}
                  onChange={handleShippingChange}
                  min="0"
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Return Policy (days)</label>
                <input
                  type="number"
                  name="returnPolicy"
                  value={shippingData.returnPolicy}
                  onChange={handleShippingChange}
                  min="0"
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="internationalShipping"
                  name="internationalShipping"
                  checked={shippingData.internationalShipping}
                  onChange={handleShippingChange}
                  className="h-4 w-4 text-[#D4AF37] focus:ring-[#D4AF37] border-gray-700 rounded"
                />
                <label htmlFor="internationalShipping" className="ml-2 block text-sm text-gray-300">
                  Offer International Shipping
                </label>
              </div>
            </div>
            
            <h3 className="text-lg font-medium border-b border-gray-700 pb-2 mt-8 mb-4">Shipping From Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">Address</label>
                <input
                  type="text"
                  name="shippingFrom.address"
                  value={shippingData.shippingFrom.address}
                  onChange={handleShippingChange}
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">City</label>
                <input
                  type="text"
                  name="shippingFrom.city"
                  value={shippingData.shippingFrom.city}
                  onChange={handleShippingChange}
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">State/Province</label>
                <input
                  type="text"
                  name="shippingFrom.state"
                  value={shippingData.shippingFrom.state}
                  onChange={handleShippingChange}
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">ZIP/Postal Code</label>
                <input
                  type="text"
                  name="shippingFrom.zip"
                  value={shippingData.shippingFrom.zip}
                  onChange={handleShippingChange}
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Country</label>
                <input
                  type="text"
                  name="shippingFrom.country"
                  value={shippingData.shippingFrom.country}
                  onChange={handleShippingChange}
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 bg-[#D4AF37] text-black font-medium rounded-md hover:bg-[#C4A137] transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        );
      case 'payment':
        return (
          <form onSubmit={(e) => handleSubmit(e, 'Payment')} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Payment Method</label>
              <select
                name="paymentMethod"
                value={paymentData.paymentMethod}
                onChange={handlePaymentChange}
                className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                <option value="bank">Bank Transfer</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>
            
            {paymentData.paymentMethod === 'bank' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Bank Name</label>
                  <input
                    type="text"
                    name="bankName"
                    value={paymentData.bankName}
                    onChange={handlePaymentChange}
                    className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Account Number</label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={paymentData.accountNumber}
                    onChange={handlePaymentChange}
                    className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Routing Number</label>
                  <input
                    type="text"
                    name="routingNumber"
                    value={paymentData.routingNumber}
                    onChange={handlePaymentChange}
                    className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">PayPal Email</label>
                <input
                  type="email"
                  name="paypalEmail"
                  value={paymentData.paypalEmail}
                  onChange={handlePaymentChange}
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Tax ID / Business Number</label>
              <input
                type="text"
                name="taxId"
                value={paymentData.taxId}
                onChange={handlePaymentChange}
                className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 bg-[#D4AF37] text-black font-medium rounded-md hover:bg-[#C4A137] transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        );
      case 'notifications':
        return (
          <form onSubmit={(e) => handleSubmit(e, 'Notification')} className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-800">
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-gray-400">Receive notifications via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={notificationData.emailNotifications}
                    onChange={handleNotificationChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-[#D4AF37] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-gray-800">
                <div>
                  <h3 className="font-medium">Order Confirmations</h3>
                  <p className="text-sm text-gray-400">Receive notifications when new orders are placed</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="orderConfirmations"
                    checked={notificationData.orderConfirmations}
                    onChange={handleNotificationChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-[#D4AF37] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-gray-800">
                <div>
                  <h3 className="font-medium">Order Updates</h3>
                  <p className="text-sm text-gray-400">Receive notifications when orders are updated</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="orderUpdates"
                    checked={notificationData.orderUpdates}
                    onChange={handleNotificationChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-[#D4AF37] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-gray-800">
                <div>
                  <h3 className="font-medium">Low Stock Alerts</h3>
                  <p className="text-sm text-gray-400">Receive notifications when product stock is low</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="lowStockAlerts"
                    checked={notificationData.lowStockAlerts}
                    onChange={handleNotificationChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-[#D4AF37] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-gray-800">
                <div>
                  <h3 className="font-medium">Marketing Emails</h3>
                  <p className="text-sm text-gray-400">Receive promotional emails and platform updates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="marketingEmails"
                    checked={notificationData.marketingEmails}
                    onChange={handleNotificationChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-[#D4AF37] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-gray-800">
                <div>
                  <h3 className="font-medium">SMS Notifications</h3>
                  <p className="text-sm text-gray-400">Receive notifications via SMS</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="smsNotifications"
                    checked={notificationData.smsNotifications}
                    onChange={handleNotificationChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-[#D4AF37] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                </label>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 bg-[#D4AF37] text-black font-medium rounded-md hover:bg-[#C4A137] transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        );
      default:
        return null;
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
        <h1 className="text-3xl font-playfair font-bold mb-8">Settings</h1>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-900 text-green-300 rounded-md">
            {successMessage}
          </div>
        )}

        <div className="bg-[#121212] rounded-lg shadow-xl overflow-hidden">
          <div className="flex border-b border-gray-800">
            <button
              className={`px-6 py-4 text-sm font-medium ${activeTab === 'profile' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setActiveTab('profile')}
            >
              Store Profile
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium ${activeTab === 'shipping' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setActiveTab('shipping')}
            >
              Shipping
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium ${activeTab === 'payment' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setActiveTab('payment')}
            >
              Payment
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium ${activeTab === 'notifications' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setActiveTab('notifications')}
            >
              Notifications
            </button>
          </div>
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default SellerSettings;
