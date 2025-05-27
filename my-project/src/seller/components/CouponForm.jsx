import React, { useState, useEffect } from 'react';
import { FiX, FiSave, FiCalendar, FiDollarSign, FiPercent, FiTag } from 'react-icons/fi';
import { useCoupon } from '../../context/CouponContext';
import { useAuth } from '../../hooks/useAuth';
import { luxuryTheme } from '../../styles/luxuryTheme';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CouponForm = ({ coupon, onClose, onSuccess }) => {
  const { addCoupon, editCoupon, loading } = useCoupon();
  const { user } = useAuth();
  const [formErrors, setFormErrors] = useState({});
  
  // Initialize form state
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    amount: '',
    minPurchase: 0,
    maxDiscount: '',
    description: '',
    isActive: true,
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    usageLimit: '',
    perUserLimit: '',
    userRestriction: 'none',
    userGroups: ['buyer']
  });

  // Populate form with coupon data if editing
  useEffect(() => {
    if (coupon) {
      setFormData({
        code: coupon.code || '',
        type: coupon.type || 'percentage',
        amount: coupon.amount || '',
        minPurchase: coupon.minPurchase || 0,
        maxDiscount: coupon.maxDiscount || '',
        description: coupon.description || '',
        isActive: coupon.isActive !== undefined ? coupon.isActive : true,
        startDate: coupon.startDate ? new Date(coupon.startDate) : new Date(),
        endDate: coupon.endDate ? new Date(coupon.endDate) : new Date(new Date().setMonth(new Date().getMonth() + 1)),
        usageLimit: coupon.usageLimit || '',
        perUserLimit: coupon.perUserLimit || '',
        userRestriction: coupon.userRestriction || 'none',
        userGroups: coupon.userGroups || ['buyer']
      });
    }
  }, [coupon]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle date changes
  const handleDateChange = (date, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: date
    }));
    
    // Clear error for this field
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle user group selection
  const handleUserGroupChange = (e) => {
    const { value, checked } = e.target;
    
    setFormData(prev => {
      if (checked) {
        return { ...prev, userGroups: [...prev.userGroups, value] };
      } else {
        return { ...prev, userGroups: prev.userGroups.filter(group => group !== value) };
      }
    });
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.code.trim()) {
      errors.code = 'Coupon code is required';
    } else if (formData.code.length < 3) {
      errors.code = 'Coupon code must be at least 3 characters';
    }
    
    if (!formData.amount || formData.amount <= 0) {
      errors.amount = 'Discount amount is required and must be greater than 0';
    } else if (formData.type === 'percentage' && formData.amount > 100) {
      errors.amount = 'Percentage discount cannot exceed 100%';
    }
    
    if (formData.minPurchase < 0) {
      errors.minPurchase = 'Minimum purchase cannot be negative';
    }
    
    if (formData.maxDiscount && formData.maxDiscount <= 0) {
      errors.maxDiscount = 'Maximum discount must be greater than 0';
    }
    
    if (!formData.startDate) {
      errors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      errors.endDate = 'End date is required';
    } else if (formData.endDate <= formData.startDate) {
      errors.endDate = 'End date must be after start date';
    }
    
    if (formData.usageLimit && formData.usageLimit <= 0) {
      errors.usageLimit = 'Usage limit must be greater than 0';
    }
    
    if (formData.perUserLimit && formData.perUserLimit <= 0) {
      errors.perUserLimit = 'Per user limit must be greater than 0';
    }
    
    if (formData.userGroups.length === 0) {
      errors.userGroups = 'At least one user group must be selected';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      if (coupon) {
        // Update existing coupon
        await editCoupon(coupon._id, formData);
      } else {
        // Create new coupon
        await addCoupon(formData);
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving coupon:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 
          className="text-2xl font-bold text-white"
          style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
        >
          {coupon ? 'Edit Coupon' : 'Create New Coupon'}
        </h2>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-white transition-colors duration-300"
          aria-label="Close"
        >
          <FiX size={24} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-neutral-800/50 border border-gold/20 rounded-lg p-4">
          <h3 
            className="text-lg font-semibold mb-4 text-white flex items-center"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
          >
            <FiTag className="mr-2 text-gold" />
            Basic Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label 
                htmlFor="code" 
                className="block text-sm font-medium text-gray-300 mb-1"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                Coupon Code*
              </label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-neutral-700 border ${
                  formErrors.code ? 'border-red-500' : 'border-gold/30'
                } rounded-md text-white focus:outline-none focus:ring-1 focus:ring-gold`}
                placeholder="e.g. SUMMER25"
              />
              {formErrors.code && (
                <p className="mt-1 text-sm text-red-500">{formErrors.code}</p>
              )}
            </div>
            
            <div>
              <label 
                htmlFor="description" 
                className="block text-sm font-medium text-gray-300 mb-1"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                Description
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-neutral-700 border border-gold/30 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-gold"
                placeholder="e.g. Summer Sale Discount"
              />
            </div>
            
            <div>
              <label 
                className="block text-sm font-medium text-gray-300 mb-1"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                Discount Type*
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="percentage"
                    checked={formData.type === 'percentage'}
                    onChange={handleChange}
                    className="h-4 w-4 text-gold focus:ring-gold border-gold/30"
                  />
                  <span className="ml-2 text-white">Percentage</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="fixed"
                    checked={formData.type === 'fixed'}
                    onChange={handleChange}
                    className="h-4 w-4 text-gold focus:ring-gold border-gold/30"
                  />
                  <span className="ml-2 text-white">Fixed Amount</span>
                </label>
              </div>
            </div>
            
            <div>
              <label 
                htmlFor="amount" 
                className="block text-sm font-medium text-gray-300 mb-1"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                Discount Amount*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {formData.type === 'percentage' ? (
                    <FiPercent className="text-gray-400" />
                  ) : (
                    <FiDollarSign className="text-gray-400" />
                  )}
                </div>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className={`w-full pl-10 px-3 py-2 bg-neutral-700 border ${
                    formErrors.amount ? 'border-red-500' : 'border-gold/30'
                  } rounded-md text-white focus:outline-none focus:ring-1 focus:ring-gold`}
                  placeholder={formData.type === 'percentage' ? "e.g. 25" : "e.g. 10"}
                  min="0"
                  step={formData.type === 'percentage' ? "1" : "0.01"}
                />
              </div>
              {formErrors.amount && (
                <p className="mt-1 text-sm text-red-500">{formErrors.amount}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Discount Conditions */}
        <div className="bg-neutral-800/50 border border-gold/20 rounded-lg p-4">
          <h3 
            className="text-lg font-semibold mb-4 text-white flex items-center"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
          >
            <FiDollarSign className="mr-2 text-gold" />
            Discount Conditions
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label 
                htmlFor="minPurchase" 
                className="block text-sm font-medium text-gray-300 mb-1"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                Minimum Purchase Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiDollarSign className="text-gray-400" />
                </div>
                <input
                  type="number"
                  id="minPurchase"
                  name="minPurchase"
                  value={formData.minPurchase}
                  onChange={handleChange}
                  className={`w-full pl-10 px-3 py-2 bg-neutral-700 border ${
                    formErrors.minPurchase ? 'border-red-500' : 'border-gold/30'
                  } rounded-md text-white focus:outline-none focus:ring-1 focus:ring-gold`}
                  placeholder="e.g. 50"
                  min="0"
                  step="0.01"
                />
              </div>
              {formErrors.minPurchase && (
                <p className="mt-1 text-sm text-red-500">{formErrors.minPurchase}</p>
              )}
            </div>
            
            <div>
              <label 
                htmlFor="maxDiscount" 
                className="block text-sm font-medium text-gray-300 mb-1"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                Maximum Discount Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiDollarSign className="text-gray-400" />
                </div>
                <input
                  type="number"
                  id="maxDiscount"
                  name="maxDiscount"
                  value={formData.maxDiscount}
                  onChange={handleChange}
                  className={`w-full pl-10 px-3 py-2 bg-neutral-700 border ${
                    formErrors.maxDiscount ? 'border-red-500' : 'border-gold/30'
                  } rounded-md text-white focus:outline-none focus:ring-1 focus:ring-gold`}
                  placeholder="Leave blank for no limit"
                  min="0"
                  step="0.01"
                />
              </div>
              {formErrors.maxDiscount && (
                <p className="mt-1 text-sm text-red-500">{formErrors.maxDiscount}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Validity Period */}
        <div className="bg-neutral-800/50 border border-gold/20 rounded-lg p-4">
          <h3 
            className="text-lg font-semibold mb-4 text-white flex items-center"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
          >
            <FiCalendar className="mr-2 text-gold" />
            Validity Period
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label 
                htmlFor="startDate" 
                className="block text-sm font-medium text-gray-300 mb-1"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                Start Date*
              </label>
              <DatePicker
                selected={formData.startDate}
                onChange={(date) => handleDateChange(date, 'startDate')}
                className={`w-full px-3 py-2 bg-neutral-700 border ${
                  formErrors.startDate ? 'border-red-500' : 'border-gold/30'
                } rounded-md text-white focus:outline-none focus:ring-1 focus:ring-gold`}
                dateFormat="MMMM d, yyyy"
                minDate={new Date()}
              />
              {formErrors.startDate && (
                <p className="mt-1 text-sm text-red-500">{formErrors.startDate}</p>
              )}
            </div>
            
            <div>
              <label 
                htmlFor="endDate" 
                className="block text-sm font-medium text-gray-300 mb-1"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                End Date*
              </label>
              <DatePicker
                selected={formData.endDate}
                onChange={(date) => handleDateChange(date, 'endDate')}
                className={`w-full px-3 py-2 bg-neutral-700 border ${
                  formErrors.endDate ? 'border-red-500' : 'border-gold/30'
                } rounded-md text-white focus:outline-none focus:ring-1 focus:ring-gold`}
                dateFormat="MMMM d, yyyy"
                minDate={formData.startDate}
              />
              {formErrors.endDate && (
                <p className="mt-1 text-sm text-red-500">{formErrors.endDate}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Usage Limits */}
        <div className="bg-neutral-800/50 border border-gold/20 rounded-lg p-4">
          <h3 
            className="text-lg font-semibold mb-4 text-white flex items-center"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
          >
            Usage Limits
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label 
                htmlFor="usageLimit" 
                className="block text-sm font-medium text-gray-300 mb-1"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                Total Usage Limit
              </label>
              <input
                type="number"
                id="usageLimit"
                name="usageLimit"
                value={formData.usageLimit}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-neutral-700 border ${
                  formErrors.usageLimit ? 'border-red-500' : 'border-gold/30'
                } rounded-md text-white focus:outline-none focus:ring-1 focus:ring-gold`}
                placeholder="Leave blank for unlimited"
                min="1"
                step="1"
              />
              {formErrors.usageLimit && (
                <p className="mt-1 text-sm text-red-500">{formErrors.usageLimit}</p>
              )}
            </div>
            
            <div>
              <label 
                htmlFor="perUserLimit" 
                className="block text-sm font-medium text-gray-300 mb-1"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                Per User Limit
              </label>
              <input
                type="number"
                id="perUserLimit"
                name="perUserLimit"
                value={formData.perUserLimit}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-neutral-700 border ${
                  formErrors.perUserLimit ? 'border-red-500' : 'border-gold/30'
                } rounded-md text-white focus:outline-none focus:ring-1 focus:ring-gold`}
                placeholder="Leave blank for unlimited"
                min="1"
                step="1"
              />
              {formErrors.perUserLimit && (
                <p className="mt-1 text-sm text-red-500">{formErrors.perUserLimit}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* User Restrictions */}
        <div className="bg-neutral-800/50 border border-gold/20 rounded-lg p-4">
          <h3 
            className="text-lg font-semibold mb-4 text-white flex items-center"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
          >
            User Restrictions
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label 
                className="block text-sm font-medium text-gray-300 mb-1"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                Customer Type
              </label>
              <select
                name="userRestriction"
                value={formData.userRestriction}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-neutral-700 border border-gold/30 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-gold"
              >
                <option value="none">All Customers</option>
                <option value="new">New Customers Only</option>
                <option value="existing">Existing Customers Only</option>
              </select>
            </div>
            
            <div>
              <label 
                className="block text-sm font-medium text-gray-300 mb-1"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                User Groups*
              </label>
              <div className="space-y-2">
                <label className="inline-flex items-center mr-4">
                  <input
                    type="checkbox"
                    value="buyer"
                    checked={formData.userGroups.includes('buyer')}
                    onChange={handleUserGroupChange}
                    className="h-4 w-4 text-gold focus:ring-gold border-gold/30"
                  />
                  <span className="ml-2 text-white">Buyers</span>
                </label>
                <label className="inline-flex items-center mr-4">
                  <input
                    type="checkbox"
                    value="seller"
                    checked={formData.userGroups.includes('seller')}
                    onChange={handleUserGroupChange}
                    className="h-4 w-4 text-gold focus:ring-gold border-gold/30"
                  />
                  <span className="ml-2 text-white">Sellers</span>
                </label>
              </div>
              {formErrors.userGroups && (
                <p className="mt-1 text-sm text-red-500">{formErrors.userGroups}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Active Status */}
        <div className="bg-neutral-800/50 border border-gold/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <label 
              className="text-lg font-semibold text-white flex items-center"
              style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
            >
              Active Status
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-5 w-5 text-gold focus:ring-gold border-gold/30 rounded"
              />
              <span className="ml-2 text-white">
                {formData.isActive ? 'Active' : 'Inactive'}
              </span>
            </label>
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-neutral-700 text-white rounded-md transition-colors duration-300 hover:bg-neutral-600"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center px-4 py-2 bg-gradient-to-r from-amber-600 to-yellow-500 text-black rounded-md transition-all duration-300 hover:shadow-gold"
            disabled={loading}
          >
            <FiSave className="mr-2" />
            {loading ? 'Saving...' : (coupon ? 'Update Coupon' : 'Create Coupon')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CouponForm;
