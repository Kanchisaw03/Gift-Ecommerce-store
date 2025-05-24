import React, { useState } from 'react';
import { motion } from 'framer-motion';

const PaymentSettings = () => {
  const [settings, setSettings] = useState({
    // Payment Gateways
    enableStripe: true,
    stripePublicKey: 'pk_test_sample123456789',
    stripeSecretKey: '••••••••••••••••••••••••••',
    stripeWebhookSecret: '••••••••••••••••••••••••••',
    enablePayPal: true,
    paypalClientId: 'test_client_id_12345',
    paypalClientSecret: '••••••••••••••••••••••',
    enableCreditCard: true,
    enableApplePay: true,
    enableGooglePay: true,
    enableCryptocurrency: false,
    
    // Payment Options
    allowGuestCheckout: true,
    requirePhoneNumber: true,
    enableCoupons: true,
    enableGiftCards: true,
    minOrderAmount: 10,
    maxOrderAmount: 10000,
    
    // Currencies
    defaultCurrency: 'USD',
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
    
    // Tax Settings
    automaticTaxCalculation: true,
    defaultTaxRate: 7.5,
    
    // Environment
    paymentMode: 'test' // 'test' or 'live'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
    });
  };

  const handleCurrencyChange = (currency, isChecked) => {
    if (isChecked) {
      setSettings({
        ...settings,
        supportedCurrencies: [...settings.supportedCurrencies, currency]
      });
    } else {
      setSettings({
        ...settings,
        supportedCurrencies: settings.supportedCurrencies.filter(c => c !== currency)
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Saving payment settings:', settings);
    // In a real app, this would be an API call
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      {/* Environment Toggle */}
      <div className="bg-[#121212] rounded-lg shadow-xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-playfair font-semibold text-white">Environment</h3>
          <div className="flex items-center">
            <span className={`mr-2 text-sm ${settings.paymentMode === 'test' ? 'text-yellow-400' : 'text-gray-400'}`}>Test</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.paymentMode === 'live'}
                onChange={() => setSettings({...settings, paymentMode: settings.paymentMode === 'test' ? 'live' : 'test'})}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-900"></div>
            </label>
            <span className={`ml-2 text-sm ${settings.paymentMode === 'live' ? 'text-green-400' : 'text-gray-400'}`}>Live</span>
          </div>
        </div>
        {settings.paymentMode === 'test' && (
          <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-800 rounded-md">
            <p className="text-yellow-400 text-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Test mode is active. Payments will not be processed.
            </p>
          </div>
        )}
        {settings.paymentMode === 'live' && (
          <div className="mt-4 p-3 bg-green-900/20 border border-green-800 rounded-md">
            <p className="text-green-400 text-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Live mode is active. Real payments will be processed.
            </p>
          </div>
        )}
      </div>

      {/* Payment Gateways */}
      <div className="bg-[#121212] rounded-lg shadow-xl p-6 mb-6">
        <h3 className="text-xl font-playfair font-semibold mb-4 text-white">Payment Gateways</h3>
        
        {/* Stripe */}
        <div className="mb-6 pb-6 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <svg className="w-8 h-8 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="4" fill="#635BFF" />
                <path d="M12.5 8.5C14.5 8.5 16 9.5 16 11.5C16 13.5 14.5 14.5 12.5 14.5H10V17H8V8.5H12.5ZM12.5 12.5C13.4 12.5 14 12.1 14 11.5C14 10.9 13.4 10.5 12.5 10.5H10V12.5H12.5Z" fill="white" />
              </svg>
              <div>
                <h4 className="font-medium text-white">Stripe</h4>
                <p className="text-xs text-gray-400">Credit card processing</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="enableStripe"
                checked={settings.enableStripe}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
            </label>
          </div>
          
          {settings.enableStripe && (
            <div className="pl-11 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Public Key
                </label>
                <input
                  type="text"
                  name="stripePublicKey"
                  value={settings.stripePublicKey}
                  onChange={handleChange}
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Secret Key
                </label>
                <input
                  type="password"
                  name="stripeSecretKey"
                  value={settings.stripeSecretKey}
                  onChange={handleChange}
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Webhook Secret
                </label>
                <input
                  type="password"
                  name="stripeWebhookSecret"
                  value={settings.stripeWebhookSecret}
                  onChange={handleChange}
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
            </div>
          )}
        </div>
        
        {/* PayPal */}
        <div className="mb-6 pb-6 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <svg className="w-8 h-8 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="4" fill="#003087" />
                <path d="M7 11.5L8 7H11C12.7 7 13.5 8 13 9.5C12.5 11 11 11.5 9.5 11.5H7ZM8.8 14.5L9.5 11.5H12C13.7 11.5 14.5 12.5 14 14C13.5 15.5 12 16 10.5 16H8.8L8 19H6L8.8 14.5Z" fill="white" />
                <path d="M15 7L13 19H15L17 7H15Z" fill="#009CDE" />
              </svg>
              <div>
                <h4 className="font-medium text-white">PayPal</h4>
                <p className="text-xs text-gray-400">Express checkout</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="enablePayPal"
                checked={settings.enablePayPal}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
            </label>
          </div>
          
          {settings.enablePayPal && (
            <div className="pl-11 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Client ID
                </label>
                <input
                  type="text"
                  name="paypalClientId"
                  value={settings.paypalClientId}
                  onChange={handleChange}
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Client Secret
                </label>
                <input
                  type="password"
                  name="paypalClientSecret"
                  value={settings.paypalClientSecret}
                  onChange={handleChange}
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Additional Payment Methods */}
        <div>
          <h4 className="font-medium text-white mb-4">Additional Payment Methods</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-[#1A1A1A] rounded-md">
              <div>
                <h5 className="font-medium text-white">Credit Card</h5>
                <p className="text-xs text-gray-400">Direct card processing</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="enableCreditCard"
                  checked={settings.enableCreditCard}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-[#1A1A1A] rounded-md">
              <div>
                <h5 className="font-medium text-white">Apple Pay</h5>
                <p className="text-xs text-gray-400">iOS and macOS devices</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="enableApplePay"
                  checked={settings.enableApplePay}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-[#1A1A1A] rounded-md">
              <div>
                <h5 className="font-medium text-white">Google Pay</h5>
                <p className="text-xs text-gray-400">Android devices</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="enableGooglePay"
                  checked={settings.enableGooglePay}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-[#1A1A1A] rounded-md">
              <div>
                <h5 className="font-medium text-white">Cryptocurrency</h5>
                <p className="text-xs text-gray-400">Bitcoin, Ethereum, etc.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="enableCryptocurrency"
                  checked={settings.enableCryptocurrency}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Currency Settings */}
      <div className="bg-[#121212] rounded-lg shadow-xl p-6 mb-6">
        <h3 className="text-xl font-playfair font-semibold mb-4 text-white">Currency Settings</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Default Currency
          </label>
          <select
            name="defaultCurrency"
            value={settings.defaultCurrency}
            onChange={handleChange}
            className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          >
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="CAD">CAD - Canadian Dollar</option>
            <option value="AUD">AUD - Australian Dollar</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Supported Currencies
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CNY', 'INR'].map(currency => (
              <div key={currency} className="flex items-center">
                <input
                  type="checkbox"
                  id={`currency-${currency}`}
                  checked={settings.supportedCurrencies.includes(currency)}
                  onChange={(e) => handleCurrencyChange(currency, e.target.checked)}
                  className="w-4 h-4 text-[#D4AF37] bg-gray-700 border-gray-600 rounded focus:ring-[#D4AF37] focus:ring-opacity-25"
                />
                <label htmlFor={`currency-${currency}`} className="ml-2 text-sm text-gray-300">
                  {currency}
                </label>
              </div>
            ))}
          </div>
        </div>
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

export default PaymentSettings;
