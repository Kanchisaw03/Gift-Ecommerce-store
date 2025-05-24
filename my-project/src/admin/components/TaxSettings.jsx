import React, { useState } from 'react';
import { motion } from 'framer-motion';

const TaxSettings = () => {
  const [settings, setSettings] = useState({
    enableTaxCalculation: true,
    automaticTaxCalculation: true,
    taxProvider: 'manual', // 'manual', 'avalara', 'taxjar'
    defaultTaxRate: 7.5,
    pricesIncludeTax: false,
    displayPricesWithTax: false,
    enableVAT: true,
    vatNumber: 'GB123456789',
    enableGST: false,
    gstNumber: '',
    taxExemptionEnabled: true,
    requireTaxIdForExemption: true,
    shippingTaxable: true,
    digitalProductsTaxable: true
  });

  const [taxRates, setTaxRates] = useState([
    { id: 1, country: 'United States', state: 'California', rate: 8.25, active: true },
    { id: 2, country: 'United States', state: 'New York', rate: 8.875, active: true },
    { id: 3, country: 'United States', state: 'Texas', rate: 6.25, active: true },
    { id: 4, country: 'United Kingdom', state: '', rate: 20, active: true },
    { id: 5, country: 'Canada', state: 'Ontario', rate: 13, active: true },
    { id: 6, country: 'Australia', state: '', rate: 10, active: true }
  ]);

  const [editingRate, setEditingRate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
    });
  };

  const handleAddNewRate = () => {
    setEditingRate({
      id: null,
      country: '',
      state: '',
      rate: 0,
      active: true
    });
    setIsModalOpen(true);
  };

  const handleEditRate = (rate) => {
    setEditingRate({ ...rate });
    setIsModalOpen(true);
  };

  const handleDeleteRate = (id) => {
    setTaxRates(taxRates.filter(rate => rate.id !== id));
  };

  const handleRateChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingRate({
      ...editingRate,
      [name]: type === 'checkbox' ? checked : name === 'rate' ? parseFloat(value) : value
    });
  };

  const handleSaveRate = () => {
    if (editingRate.id) {
      // Update existing rate
      setTaxRates(taxRates.map(rate => 
        rate.id === editingRate.id ? editingRate : rate
      ));
    } else {
      // Add new rate
      const newId = Math.max(...taxRates.map(r => r.id), 0) + 1;
      setTaxRates([...taxRates, { ...editingRate, id: newId }]);
    }
    setIsModalOpen(false);
    setEditingRate(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Saving tax settings:', { settings, taxRates });
    // In a real app, this would be an API call
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      {/* General Tax Settings */}
      <div className="bg-[#121212] rounded-lg shadow-xl p-6 mb-6">
        <h3 className="text-xl font-playfair font-semibold mb-4 text-white">General Tax Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-white">Enable Tax Calculation</h4>
                <p className="text-xs text-gray-400">Calculate taxes on orders</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="enableTaxCalculation"
                  checked={settings.enableTaxCalculation}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>

            {settings.enableTaxCalculation && (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-white">Automatic Tax Calculation</h4>
                    <p className="text-xs text-gray-400">Use tax service provider</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="automaticTaxCalculation"
                      checked={settings.automaticTaxCalculation}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                  </label>
                </div>

                {settings.automaticTaxCalculation && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Tax Provider
                    </label>
                    <select
                      name="taxProvider"
                      value={settings.taxProvider}
                      onChange={handleChange}
                      className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    >
                      <option value="manual">Manual Rates</option>
                      <option value="avalara">Avalara</option>
                      <option value="taxjar">TaxJar</option>
                    </select>
                  </div>
                )}

                {!settings.automaticTaxCalculation && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Default Tax Rate (%)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="defaultTaxRate"
                        value={settings.defaultTaxRate}
                        onChange={handleChange}
                        min="0"
                        max="100"
                        step="0.01"
                        className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      />
                      <span className="absolute right-3 top-2 text-gray-400">%</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-white">Prices Include Tax</h4>
                <p className="text-xs text-gray-400">Product prices include tax</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="pricesIncludeTax"
                  checked={settings.pricesIncludeTax}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-white">Display Prices with Tax</h4>
                <p className="text-xs text-gray-400">Show tax-inclusive prices to customers</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="displayPricesWithTax"
                  checked={settings.displayPricesWithTax}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-white">Shipping is Taxable</h4>
                <p className="text-xs text-gray-400">Apply tax to shipping costs</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="shippingTaxable"
                  checked={settings.shippingTaxable}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* VAT & GST Settings */}
      <div className="bg-[#121212] rounded-lg shadow-xl p-6 mb-6">
        <h3 className="text-xl font-playfair font-semibold mb-4 text-white">VAT & GST Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-white">Enable VAT</h4>
                <p className="text-xs text-gray-400">Value Added Tax for EU/UK</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="enableVAT"
                  checked={settings.enableVAT}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>
            
            {settings.enableVAT && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  VAT Number
                </label>
                <input
                  type="text"
                  name="vatNumber"
                  value={settings.vatNumber}
                  onChange={handleChange}
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="e.g. GB123456789"
                />
              </div>
            )}
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-white">Enable GST</h4>
                <p className="text-xs text-gray-400">Goods & Services Tax</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="enableGST"
                  checked={settings.enableGST}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>
            
            {settings.enableGST && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  GST Number
                </label>
                <input
                  type="text"
                  name="gstNumber"
                  value={settings.gstNumber}
                  onChange={handleChange}
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="e.g. 29ABCDE1234F1Z5"
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-medium text-white">Tax Exemption</h4>
              <p className="text-xs text-gray-400">Allow tax-exempt purchases</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="taxExemptionEnabled"
                checked={settings.taxExemptionEnabled}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
            </label>
          </div>
          
          {settings.taxExemptionEnabled && (
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="require-tax-id"
                name="requireTaxIdForExemption"
                checked={settings.requireTaxIdForExemption}
                onChange={handleChange}
                className="w-4 h-4 text-[#D4AF37] bg-gray-700 border-gray-600 rounded focus:ring-[#D4AF37] focus:ring-opacity-25"
              />
              <label htmlFor="require-tax-id" className="ml-2 text-sm text-gray-300">
                Require Tax ID for exemption
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Tax Rates */}
      {!settings.automaticTaxCalculation && settings.enableTaxCalculation && (
        <div className="bg-[#121212] rounded-lg shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-playfair font-semibold text-white">Tax Rates by Location</h3>
            <button
              onClick={handleAddNewRate}
              className="px-3 py-1 bg-[#D4AF37] text-black rounded hover:bg-[#B8860B] transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Rate
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#1E1E1E] border-b border-gray-700">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Country</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">State/Region</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Rate</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Status</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {taxRates.map((rate) => (
                  <tr key={rate.id} className="hover:bg-[#1A1A1A] transition-colors">
                    <td className="py-3 px-4">
                      {rate.country}
                    </td>
                    <td className="py-3 px-4">
                      {rate.state || 'All Regions'}
                    </td>
                    <td className="py-3 px-4">
                      {rate.rate}%
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${rate.active ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300'}`}>
                        {rate.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditRate(rate)}
                          className="px-2 py-1 bg-[#1E1E1E] text-white rounded hover:bg-gray-800 text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteRate(rate.id)}
                          className="px-2 py-1 bg-red-900 text-red-300 rounded hover:bg-red-800 text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {taxRates.length === 0 && (
              <div className="p-4 text-center text-gray-400">
                No tax rates defined. Click "Add Rate" to create one.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Save Button */}
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

      {/* Edit Rate Modal */}
      {isModalOpen && editingRate && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-[#121212] rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-playfair font-semibold mb-4">
              {editingRate.id ? 'Edit Tax Rate' : 'Add Tax Rate'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={editingRate.country}
                  onChange={handleRateChange}
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="e.g. United States"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  State/Region (Optional)
                </label>
                <input
                  type="text"
                  name="state"
                  value={editingRate.state}
                  onChange={handleRateChange}
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="e.g. California"
                />
                <p className="text-xs text-gray-400 mt-1">Leave empty to apply to all regions</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Tax Rate (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="rate"
                    value={editingRate.rate}
                    onChange={handleRateChange}
                    min="0"
                    max="100"
                    step="0.01"
                    className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                  <span className="absolute right-3 top-2 text-gray-400">%</span>
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rate-active"
                  name="active"
                  checked={editingRate.active}
                  onChange={handleRateChange}
                  className="w-4 h-4 text-[#D4AF37] bg-gray-700 border-gray-600 rounded focus:ring-[#D4AF37] focus:ring-opacity-25"
                />
                <label htmlFor="rate-active" className="ml-2 text-sm text-gray-300">
                  Active
                </label>
              </div>
            </div>
            
            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRate}
                className="px-4 py-2 bg-[#D4AF37] text-black rounded-md hover:bg-[#B8860B] transition-colors"
              >
                Save Rate
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TaxSettings;
