import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ShippingSettings = () => {
  const [shippingMethods, setShippingMethods] = useState([
    {
      id: 1,
      name: 'Standard Shipping',
      description: '5-7 business days',
      price: 8.99,
      freeAbove: 100,
      estimatedDays: '5-7',
      active: true,
      default: true
    },
    {
      id: 2,
      name: 'Express Shipping',
      description: '2-3 business days',
      price: 14.99,
      freeAbove: 200,
      estimatedDays: '2-3',
      active: true,
      default: false
    },
    {
      id: 3,
      name: 'Next Day Delivery',
      description: 'Next business day',
      price: 24.99,
      freeAbove: 0,
      estimatedDays: '1',
      active: true,
      default: false
    },
    {
      id: 4,
      name: 'International Shipping',
      description: '7-14 business days',
      price: 29.99,
      freeAbove: 300,
      estimatedDays: '7-14',
      active: true,
      default: false
    }
  ]);

  const [editingMethod, setEditingMethod] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [settings, setSettings] = useState({
    enableShipping: true,
    enableLocalPickup: true,
    enableInternationalShipping: true,
    restrictedCountries: ['Cuba', 'Iran', 'North Korea', 'Syria'],
    shippingOriginAddress: {
      address1: '123 Luxury Ave',
      address2: 'Suite 100',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States'
    },
    requireShippingPhone: true,
    enableShippingInsurance: true,
    enableOrderTracking: true,
    defaultWeightUnit: 'lb',
    defaultDimensionUnit: 'in'
  });

  const handleSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      shippingOriginAddress: {
        ...settings.shippingOriginAddress,
        [name]: value
      }
    });
  };

  const handleToggleMethodActive = (id) => {
    setShippingMethods(shippingMethods.map(method => 
      method.id === id ? { ...method, active: !method.active } : method
    ));
  };

  const handleSetDefaultMethod = (id) => {
    setShippingMethods(shippingMethods.map(method => 
      ({ ...method, default: method.id === id })
    ));
  };

  const handleEditMethod = (method) => {
    setEditingMethod({ ...method });
    setIsModalOpen(true);
  };

  const handleAddNewMethod = () => {
    const newId = Math.max(...shippingMethods.map(m => m.id), 0) + 1;
    setEditingMethod({
      id: newId,
      name: '',
      description: '',
      price: 0,
      freeAbove: 0,
      estimatedDays: '',
      active: true,
      default: false
    });
    setIsModalOpen(true);
  };

  const handleDeleteMethod = (id) => {
    setShippingMethods(shippingMethods.filter(method => method.id !== id));
  };

  const handleSaveMethod = () => {
    if (editingMethod.id) {
      // Update existing method
      setShippingMethods(shippingMethods.map(method => 
        method.id === editingMethod.id ? editingMethod : method
      ));
    } else {
      // Add new method
      const newId = Math.max(...shippingMethods.map(m => m.id), 0) + 1;
      setShippingMethods([...shippingMethods, { ...editingMethod, id: newId }]);
    }
    setIsModalOpen(false);
    setEditingMethod(null);
  };

  const handleMethodChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingMethod({
      ...editingMethod,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Saving shipping settings:', { settings, shippingMethods });
    // In a real app, this would be an API call
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      {/* General Shipping Settings */}
      <div className="bg-[#121212] rounded-lg shadow-xl p-6 mb-6">
        <h3 className="text-xl font-playfair font-semibold mb-4 text-white">General Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-white">Enable Shipping</h4>
                <p className="text-xs text-gray-400">Allow products to be shipped</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="enableShipping"
                  checked={settings.enableShipping}
                  onChange={handleSettingChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-white">Local Pickup</h4>
                <p className="text-xs text-gray-400">Allow in-store pickup</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="enableLocalPickup"
                  checked={settings.enableLocalPickup}
                  onChange={handleSettingChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-white">International Shipping</h4>
                <p className="text-xs text-gray-400">Ship to international addresses</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="enableInternationalShipping"
                  checked={settings.enableInternationalShipping}
                  onChange={handleSettingChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-white">Require Phone Number</h4>
                <p className="text-xs text-gray-400">For shipping address</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="requireShippingPhone"
                  checked={settings.requireShippingPhone}
                  onChange={handleSettingChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-white">Shipping Insurance</h4>
                <p className="text-xs text-gray-400">Offer optional insurance</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="enableShippingInsurance"
                  checked={settings.enableShippingInsurance}
                  onChange={handleSettingChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-white">Order Tracking</h4>
                <p className="text-xs text-gray-400">Enable shipment tracking</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="enableOrderTracking"
                  checked={settings.enableOrderTracking}
                  onChange={handleSettingChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Default Weight Unit
            </label>
            <select
              name="defaultWeightUnit"
              value={settings.defaultWeightUnit}
              onChange={handleSettingChange}
              className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            >
              <option value="lb">Pounds (lb)</option>
              <option value="kg">Kilograms (kg)</option>
              <option value="oz">Ounces (oz)</option>
              <option value="g">Grams (g)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Default Dimension Unit
            </label>
            <select
              name="defaultDimensionUnit"
              value={settings.defaultDimensionUnit}
              onChange={handleSettingChange}
              className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            >
              <option value="in">Inches (in)</option>
              <option value="cm">Centimeters (cm)</option>
              <option value="mm">Millimeters (mm)</option>
              <option value="ft">Feet (ft)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Shipping Origin Address */}
      <div className="bg-[#121212] rounded-lg shadow-xl p-6 mb-6">
        <h3 className="text-xl font-playfair font-semibold mb-4 text-white">Shipping Origin Address</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Address Line 1
            </label>
            <input
              type="text"
              name="address1"
              value={settings.shippingOriginAddress.address1}
              onChange={handleAddressChange}
              className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Address Line 2
            </label>
            <input
              type="text"
              name="address2"
              value={settings.shippingOriginAddress.address2}
              onChange={handleAddressChange}
              className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              City
            </label>
            <input
              type="text"
              name="city"
              value={settings.shippingOriginAddress.city}
              onChange={handleAddressChange}
              className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              State / Province
            </label>
            <input
              type="text"
              name="state"
              value={settings.shippingOriginAddress.state}
              onChange={handleAddressChange}
              className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              ZIP / Postal Code
            </label>
            <input
              type="text"
              name="zipCode"
              value={settings.shippingOriginAddress.zipCode}
              onChange={handleAddressChange}
              className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Country
            </label>
            <input
              type="text"
              name="country"
              value={settings.shippingOriginAddress.country}
              onChange={handleAddressChange}
              className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>
        </div>
      </div>

      {/* Shipping Methods */}
      <div className="bg-[#121212] rounded-lg shadow-xl p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-playfair font-semibold text-white">Shipping Methods</h3>
          <button
            onClick={handleAddNewMethod}
            className="px-3 py-1 bg-[#D4AF37] text-black rounded hover:bg-[#B8860B] transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Method
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#1E1E1E] border-b border-gray-700">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Name</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Price</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Free Above</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Delivery Time</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Status</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Default</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {shippingMethods.map((method) => (
                <tr key={method.id} className="hover:bg-[#1A1A1A] transition-colors">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-white">{method.name}</p>
                      <p className="text-xs text-gray-400">{method.description}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    ${method.price.toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    {method.freeAbove > 0 ? `$${method.freeAbove.toFixed(2)}` : 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    {method.estimatedDays} {parseInt(method.estimatedDays) === 1 ? 'day' : 'days'}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${method.active ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300'}`}>
                      {method.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        checked={method.default}
                        onChange={() => handleSetDefaultMethod(method.id)}
                        className="w-4 h-4 text-[#D4AF37] bg-gray-700 border-gray-600 focus:ring-[#D4AF37] focus:ring-opacity-25"
                      />
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleToggleMethodActive(method.id)}
                        className={`px-2 py-1 rounded text-xs ${method.active ? 'bg-yellow-900 text-yellow-300 hover:bg-yellow-800' : 'bg-green-900 text-green-300 hover:bg-green-800'}`}
                      >
                        {method.active ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        onClick={() => handleEditMethod(method)}
                        className="px-2 py-1 bg-[#1E1E1E] text-white rounded hover:bg-gray-800 text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteMethod(method.id)}
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
          
          {shippingMethods.length === 0 && (
            <div className="p-4 text-center text-gray-400">
              No shipping methods defined. Click "Add Method" to create one.
            </div>
          )}
        </div>
      </div>

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

      {/* Edit Method Modal */}
      {isModalOpen && editingMethod && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-[#121212] rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-playfair font-semibold mb-4">
              {editingMethod.id ? 'Edit Shipping Method' : 'Add Shipping Method'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Method Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editingMethod.name}
                  onChange={handleMethodChange}
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="e.g. Standard Shipping"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={editingMethod.description}
                  onChange={handleMethodChange}
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="e.g. 5-7 business days"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Price ($)
                </label>
                <input
                  type="number"
                  name="price"
                  value={editingMethod.price}
                  onChange={handleMethodChange}
                  min="0"
                  step="0.01"
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Free Above ($)
                </label>
                <input
                  type="number"
                  name="freeAbove"
                  value={editingMethod.freeAbove}
                  onChange={handleMethodChange}
                  min="0"
                  step="0.01"
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
                <p className="text-xs text-gray-400 mt-1">Set to 0 if not applicable</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Estimated Delivery Time (days)
                </label>
                <input
                  type="text"
                  name="estimatedDays"
                  value={editingMethod.estimatedDays}
                  onChange={handleMethodChange}
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="e.g. 3-5"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="method-active"
                  name="active"
                  checked={editingMethod.active}
                  onChange={handleMethodChange}
                  className="w-4 h-4 text-[#D4AF37] bg-gray-700 border-gray-600 rounded focus:ring-[#D4AF37] focus:ring-opacity-25"
                />
                <label htmlFor="method-active" className="ml-2 text-sm text-gray-300">
                  Active
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="method-default"
                  name="default"
                  checked={editingMethod.default}
                  onChange={handleMethodChange}
                  className="w-4 h-4 text-[#D4AF37] bg-gray-700 border-gray-600 rounded focus:ring-[#D4AF37] focus:ring-opacity-25"
                />
                <label htmlFor="method-default" className="ml-2 text-sm text-gray-300">
                  Set as Default Method
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
                onClick={handleSaveMethod}
                className="px-4 py-2 bg-[#D4AF37] text-black rounded-md hover:bg-[#B8860B] transition-colors"
              >
                Save Method
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ShippingSettings;
