import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { luxuryTheme } from '../../styles/luxuryTheme';

const AddressBook = () => {
  const [addresses, setAddresses] = useState([
    {
      id: '1',
      name: 'Alexander Wilson',
      street: '123 Luxury Lane',
      city: 'Beverly Hills',
      state: 'CA',
      zip: '90210',
      country: 'United States',
      phone: '+1 (555) 123-4567',
      isDefault: true
    },
    {
      id: '2',
      name: 'Alexander Wilson',
      street: '456 Business Ave, Suite 789',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'United States',
      phone: '+1 (555) 987-6543',
      isDefault: false
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    phone: '',
    isDefault: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAddNew = () => {
    setFormData({
      name: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      phone: '',
      isDefault: false
    });
    setEditingAddress(null);
    setShowAddForm(true);
  };

  const handleEdit = (address) => {
    setFormData({ ...address });
    setEditingAddress(address.id);
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    // Check if deleting default address
    const isDefaultAddress = addresses.find(addr => addr.id === id)?.isDefault;
    
    // Remove the address
    const updatedAddresses = addresses.filter(address => address.id !== id);
    
    // If we deleted the default address and there are other addresses, set a new default
    if (isDefaultAddress && updatedAddresses.length > 0) {
      updatedAddresses[0].isDefault = true;
    }
    
    setAddresses(updatedAddresses);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // If setting this as default, unset other defaults
    let updatedAddresses = [...addresses];
    if (formData.isDefault) {
      updatedAddresses = updatedAddresses.map(address => ({
        ...address,
        isDefault: false
      }));
    }
    
    if (editingAddress) {
      // Update existing address
      updatedAddresses = updatedAddresses.map(address => 
        address.id === editingAddress ? { ...formData, id: editingAddress } : address
      );
    } else {
      // Add new address
      const newId = `${Date.now()}`;
      updatedAddresses.push({ ...formData, id: newId });
    }
    
    // If no default address exists, set the first one as default
    if (!updatedAddresses.some(address => address.isDefault)) {
      updatedAddresses[0].isDefault = true;
    }
    
    setAddresses(updatedAddresses);
    setShowAddForm(false);
    setEditingAddress(null);
  };

  const handleSetDefault = (id) => {
    const updatedAddresses = addresses.map(address => ({
      ...address,
      isDefault: address.id === id
    }));
    
    setAddresses(updatedAddresses);
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 max-w-6xl"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-playfair font-bold">Address Book</h1>
        <button
          onClick={handleAddNew}
          className="mt-4 md:mt-0 px-6 py-2 bg-[#D4AF37] text-black font-medium rounded-md hover:bg-[#C4A137] transition-colors"
        >
          Add New Address
        </button>
      </div>

      {showAddForm ? (
        <div className="bg-[#121212] rounded-lg shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-playfair font-semibold mb-6">
            {editingAddress ? 'Edit Address' : 'Add New Address'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">Street Address</label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">State/Province</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">ZIP/Postal Code</label>
                <input
                  type="text"
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#D4AF37] focus:ring-[#D4AF37] border-gray-700 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-300">Set as default address</span>
                </label>
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-[#D4AF37] text-black font-medium rounded-md hover:bg-[#C4A137] transition-colors"
              >
                {editingAddress ? 'Update Address' : 'Save Address'}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-2 bg-transparent border border-gray-600 text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.length > 0 ? (
            addresses.map((address) => (
              <div key={address.id} className={`bg-[#121212] rounded-lg shadow-xl p-6 ${address.isDefault ? 'border-2 border-[#D4AF37]' : ''}`}>
                {address.isDefault && (
                  <div className="mb-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#D4AF37] text-black">
                      Default Address
                    </span>
                  </div>
                )}
                <div className="mb-4">
                  <h3 className="text-lg font-medium">{address.name}</h3>
                  <address className="not-italic text-gray-300 mt-2 space-y-1">
                    <p>{address.street}</p>
                    <p>{address.city}, {address.state} {address.zip}</p>
                    <p>{address.country}</p>
                    <p className="text-gray-400 mt-2">{address.phone}</p>
                  </address>
                </div>
                <div className="flex flex-wrap gap-2">
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      className="px-3 py-1 text-sm border border-[#D4AF37] text-[#D4AF37] rounded hover:bg-[#1E1E1E] transition-colors"
                    >
                      Set as Default
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(address)}
                    className="px-3 py-1 text-sm bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="px-3 py-1 text-sm bg-red-900 text-red-200 rounded hover:bg-red-800 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="md:col-span-2 bg-[#121212] rounded-lg shadow-xl p-12 text-center">
              <h2 className="text-2xl font-playfair font-medium mb-4">No Addresses Saved</h2>
              <p className="text-gray-400 mb-6">You haven't added any addresses yet.</p>
              <button
                onClick={handleAddNew}
                className="px-6 py-3 bg-[#D4AF37] text-black font-medium rounded-md hover:bg-[#C4A137] transition-colors"
              >
                Add Your First Address
              </button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default AddressBook;
