import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { luxuryTheme } from '../../styles/luxuryTheme';

const EmailSettings = () => {
  const [settings, setSettings] = useState({
    smtpHost: 'smtp.example.com',
    smtpPort: 587,
    smtpUsername: 'notifications@luxurygifts.com',
    smtpPassword: '••••••••••••',
    senderEmail: 'notifications@luxurygifts.com',
    senderName: 'Luxury Gifts',
    enableSsl: true,
    enableOrderConfirmation: true,
    enableShippingUpdates: true,
    enableDeliveryNotifications: true,
    enableAccountNotifications: true,
    enableMarketingEmails: true,
    enableAdminNotifications: true,
    adminNotificationEmail: 'admin@luxurygifts.com',
    emailFooterText: '© 2025 Luxury Gifts. All rights reserved.',
    emailLogoUrl: '/assets/images/email-logo.png'
  });

  const [testEmailAddress, setTestEmailAddress] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value, 10) : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Saving email settings:', settings);
    // In a real app, this would be an API call
    // await fetch('/api/admin/settings/email', {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(settings)
    // });
  };

  const handleSendTestEmail = async () => {
    if (!testEmailAddress) return;
    
    setIsSending(true);
    setTestResult(null);
    
    try {
      // In a real app, this would be an API call
      // const response = await fetch('/api/admin/settings/email/test', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ ...settings, testEmailAddress })
      // });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate success
      console.log('Sending test email to:', testEmailAddress);
      setTestResult({ success: true, message: 'Test email sent successfully!' });
    } catch (error) {
      setTestResult({ success: false, message: 'Failed to send test email. Please check your SMTP settings.' });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-[#121212] rounded-lg shadow-xl p-6 mb-6">
        <h3 className="text-xl font-playfair font-semibold mb-4 text-white">SMTP Configuration</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                SMTP Host
              </label>
              <input
                type="text"
                name="smtpHost"
                value={settings.smtpHost}
                onChange={handleChange}
                className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                placeholder="smtp.example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                SMTP Port
              </label>
              <input
                type="number"
                name="smtpPort"
                value={settings.smtpPort}
                onChange={handleChange}
                className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                placeholder="587"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                SMTP Username
              </label>
              <input
                type="text"
                name="smtpUsername"
                value={settings.smtpUsername}
                onChange={handleChange}
                className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                placeholder="username@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                SMTP Password
              </label>
              <input
                type="password"
                name="smtpPassword"
                value={settings.smtpPassword}
                onChange={handleChange}
                className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Sender Email
              </label>
              <input
                type="email"
                name="senderEmail"
                value={settings.senderEmail}
                onChange={handleChange}
                className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                placeholder="notifications@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Sender Name
              </label>
              <input
                type="text"
                name="senderName"
                value={settings.senderName}
                onChange={handleChange}
                className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                placeholder="Your Company Name"
              />
            </div>
          </div>

          <div className="flex items-center mb-6">
            <label className="relative inline-flex items-center cursor-pointer mr-4">
              <input
                type="checkbox"
                name="enableSsl"
                checked={settings.enableSsl}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
            </label>
            <span className="text-sm font-medium text-gray-300">Enable SSL/TLS</span>
          </div>

          <div className="bg-[#1A1A1A] p-4 rounded-lg mb-6">
            <h4 className="font-medium text-white mb-3">Send Test Email</h4>
            <div className="flex">
              <input
                type="email"
                value={testEmailAddress}
                onChange={(e) => setTestEmailAddress(e.target.value)}
                className="flex-grow bg-[#1E1E1E] border border-gray-700 rounded-l-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                placeholder="test@example.com"
              />
              <button
                type="button"
                onClick={handleSendTestEmail}
                disabled={isSending || !testEmailAddress}
                className="px-4 py-2 bg-[#D4AF37] text-black rounded-r-md hover:bg-[#B8860B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? 'Sending...' : 'Send Test'}
              </button>
            </div>
            {testResult && (
              <div className={`mt-3 p-2 rounded text-sm ${testResult.success ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'}`}>
                {testResult.message}
              </div>
            )}
          </div>
        </form>
      </div>

      <div className="bg-[#121212] rounded-lg shadow-xl p-6 mb-6">
        <h3 className="text-xl font-playfair font-semibold mb-4 text-white">Email Notifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-white">Order Confirmation</h4>
                <p className="text-xs text-gray-400">Send email when order is placed</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="enableOrderConfirmation"
                  checked={settings.enableOrderConfirmation}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-white">Shipping Updates</h4>
                <p className="text-xs text-gray-400">Send email when order is shipped</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="enableShippingUpdates"
                  checked={settings.enableShippingUpdates}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-white">Delivery Notifications</h4>
                <p className="text-xs text-gray-400">Send email when order is delivered</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="enableDeliveryNotifications"
                  checked={settings.enableDeliveryNotifications}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-white">Account Notifications</h4>
                <p className="text-xs text-gray-400">Password resets, profile updates</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="enableAccountNotifications"
                  checked={settings.enableAccountNotifications}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-white">Marketing Emails</h4>
                <p className="text-xs text-gray-400">Promotions, newsletters, updates</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="enableMarketingEmails"
                  checked={settings.enableMarketingEmails}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-white">Admin Notifications</h4>
                <p className="text-xs text-gray-400">New orders, product approvals</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="enableAdminNotifications"
                  checked={settings.enableAdminNotifications}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>
          </div>
        </div>

        {settings.enableAdminNotifications && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Admin Notification Email
            </label>
            <input
              type="email"
              name="adminNotificationEmail"
              value={settings.adminNotificationEmail}
              onChange={handleChange}
              className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              placeholder="admin@example.com"
            />
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          className="px-4 py-2 mr-2 border border-gray-600 rounded-md hover:bg-gray-800 transition-colors"
        >
          Reset
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-[#D4AF37] text-black rounded-md hover:bg-[#B8860B] transition-colors"
        >
          Save Changes
        </button>
      </div>
    </motion.div>
  );
};

export default EmailSettings;
