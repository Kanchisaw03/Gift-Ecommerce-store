import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { luxuryTheme } from '../../styles/luxuryTheme';

const PlatformSettings = () => {
  const [settings, setSettings] = useState({
    commissionRate: 10,
    platformFee: 2.5,
    minimumOrderValue: 50,
    maximumOrderValue: 10000,
    enableGiftWrapping: true,
    giftWrappingFee: 5,
    enableWishlist: true,
    enableReviews: true,
    enableComparisons: true,
    maxProductImages: 8,
    productApprovalRequired: true,
    sellerVerificationRequired: true,
    enableBulkOrders: true,
    bulkOrderDiscount: 5
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Saving platform settings:', settings);
    // In a real app, this would be an API call
    // await fetch('/api/admin/settings/platform', {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(settings)
    // });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-[#121212] rounded-lg shadow-xl p-6 mb-6">
        <h3 className="text-xl font-playfair font-semibold mb-4 text-white">Platform Fees & Commission</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Commission Rate (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="commissionRate"
                  value={settings.commissionRate}
                  onChange={handleChange}
                  min="0"
                  max="50"
                  step="0.1"
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
                <span className="absolute right-3 top-2 text-gray-400">%</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Percentage of each sale that goes to the platform
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Platform Fee (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="platformFee"
                  value={settings.platformFee}
                  onChange={handleChange}
                  min="0"
                  max="20"
                  step="0.1"
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
                <span className="absolute right-3 top-2 text-gray-400">%</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Additional fee applied to each transaction
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Minimum Order Value ($)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-400">$</span>
                <input
                  type="number"
                  name="minimumOrderValue"
                  value={settings.minimumOrderValue}
                  onChange={handleChange}
                  min="0"
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 pl-8 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Maximum Order Value ($)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-400">$</span>
                <input
                  type="number"
                  name="maximumOrderValue"
                  value={settings.maximumOrderValue}
                  onChange={handleChange}
                  min="0"
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 pl-8 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="bg-[#121212] rounded-lg shadow-xl p-6 mb-6">
        <h3 className="text-xl font-playfair font-semibold mb-4 text-white">Feature Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-white">Gift Wrapping</h4>
                <p className="text-xs text-gray-400">Allow customers to add gift wrapping</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="enableGiftWrapping"
                  checked={settings.enableGiftWrapping}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>

            {settings.enableGiftWrapping && (
              <div className="pl-6 border-l border-gray-700">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Gift Wrapping Fee ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-400">$</span>
                  <input
                    type="number"
                    name="giftWrappingFee"
                    value={settings.giftWrappingFee}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 pl-8 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-white">Wishlist</h4>
                <p className="text-xs text-gray-400">Allow customers to save products to wishlist</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="enableWishlist"
                  checked={settings.enableWishlist}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-white">Product Reviews</h4>
                <p className="text-xs text-gray-400">Allow customers to leave reviews</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="enableReviews"
                  checked={settings.enableReviews}
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
                <h4 className="font-medium text-white">Product Comparisons</h4>
                <p className="text-xs text-gray-400">Allow customers to compare products</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="enableComparisons"
                  checked={settings.enableComparisons}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-white">Product Approval</h4>
                <p className="text-xs text-gray-400">Require admin approval for new products</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="productApprovalRequired"
                  checked={settings.productApprovalRequired}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-white">Seller Verification</h4>
                <p className="text-xs text-gray-400">Require verification for new sellers</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="sellerVerificationRequired"
                  checked={settings.sellerVerificationRequired}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>
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

export default PlatformSettings;
