import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import useApiForm from '../../hooks/useApiForm';
import { createOrder } from '../../services/api/orderService';
import { getShippingMethods } from '../../services/api/cartService';

const CheckoutForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, total, clearCart } = useCart();
  const [shippingMethods, setShippingMethods] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState('');
  const [shippingCost, setShippingCost] = useState(0);
  
  // Validation rules for checkout form
  const validationRules = {
    fullName: {
      required: true,
      minLength: 3
    },
    email: {
      required: true,
      email: true
    },
    phone: {
      required: true,
      pattern: /^\+?[0-9]{10,15}$/,
      patternMessage: 'Please enter a valid phone number'
    },
    address: {
      required: true,
      minLength: 5
    },
    city: {
      required: true
    },
    state: {
      required: true
    },
    zipCode: {
      required: true,
      pattern: /^[0-9]{5,10}$/,
      patternMessage: 'Please enter a valid zip/postal code'
    },
    country: {
      required: true
    },
    paymentMethod: {
      required: true
    }
  };
  
  // Initialize form with user data if available
  const initialData = {
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || 'US',
    paymentMethod: 'card',
    saveAddress: true
  };
  
  // Initialize form with API integration
  const {
    formData,
    errors,
    loading,
    handleChange,
    handleSubmit,
    setFieldValue
  } = useApiForm({
    apiCall: async (data) => {
      // Prepare order data
      const orderData = {
        shippingAddress: {
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          street: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country
        },
        paymentMethod: data.paymentMethod,
        shippingMethod: selectedShipping,
        items: cartItems.map(item => ({
          product: item._id || item.id,
          quantity: item.quantity,
          price: item.price
        })),
        subtotal: total,
        shippingCost,
        total: total + shippingCost,
        saveAddress: data.saveAddress
      };
      
      return createOrder(orderData);
    },
    initialData,
    validationRules,
    onSuccess: (response) => {
      toast.success('Order placed successfully!');
      
      // Clear cart
      clearCart();
      
      // Navigate to order confirmation page
      setTimeout(() => {
        navigate(`/orders/${response.data._id}`, { 
          state: { 
            orderId: response.data._id,
            orderNumber: response.data.orderNumber
          } 
        });
      }, 1500);
    },
    onError: (error) => {
      console.error('Checkout error:', error);
    }
  });
  
  // Fetch shipping methods on component mount
  useEffect(() => {
    const fetchShippingMethods = async () => {
      try {
        const response = await getShippingMethods();
        if (response && response.data) {
          setShippingMethods(response.data);
          
          // Set default shipping method
          if (response.data.length > 0) {
            setSelectedShipping(response.data[0]._id);
            setShippingCost(response.data[0].cost);
          }
        }
      } catch (error) {
        console.error('Error fetching shipping methods:', error);
        toast.error('Failed to load shipping options');
      }
    };
    
    fetchShippingMethods();
  }, []);
  
  // Handle shipping method change
  const handleShippingChange = (e) => {
    const shippingId = e.target.value;
    setSelectedShipping(shippingId);
    
    // Update shipping cost
    const selectedMethod = shippingMethods.find(method => method._id === shippingId);
    if (selectedMethod) {
      setShippingCost(selectedMethod.cost);
    }
  };
  
  // Handle checkbox change
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFieldValue(name, checked);
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-lg shadow-lg border border-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Checkout</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shipping Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gold-400 mb-4">Shipping Information</h3>
            
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium mb-1 text-gray-300">
                Full Name*
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-gray-800 border ${
                  errors.fullName ? 'border-red-500' : 'border-gray-700'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 text-white`}
                disabled={loading}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
              )}
            </div>
            
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-300">
                Email*
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-gray-800 border ${
                  errors.email ? 'border-red-500' : 'border-gray-700'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 text-white`}
                disabled={loading}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            
            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1 text-gray-300">
                Phone*
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-gray-800 border ${
                  errors.phone ? 'border-red-500' : 'border-gray-700'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 text-white`}
                disabled={loading}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
              )}
            </div>
            
            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium mb-1 text-gray-300">
                Address*
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-gray-800 border ${
                  errors.address ? 'border-red-500' : 'border-gray-700'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 text-white`}
                disabled={loading}
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-500">{errors.address}</p>
              )}
            </div>
            
            {/* City */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium mb-1 text-gray-300">
                City*
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-gray-800 border ${
                  errors.city ? 'border-red-500' : 'border-gray-700'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 text-white`}
                disabled={loading}
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-500">{errors.city}</p>
              )}
            </div>
            
            {/* State */}
            <div>
              <label htmlFor="state" className="block text-sm font-medium mb-1 text-gray-300">
                State/Province*
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-gray-800 border ${
                  errors.state ? 'border-red-500' : 'border-gray-700'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 text-white`}
                disabled={loading}
              />
              {errors.state && (
                <p className="mt-1 text-sm text-red-500">{errors.state}</p>
              )}
            </div>
            
            {/* Zip Code */}
            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium mb-1 text-gray-300">
                Zip/Postal Code*
              </label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-gray-800 border ${
                  errors.zipCode ? 'border-red-500' : 'border-gray-700'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 text-white`}
                disabled={loading}
              />
              {errors.zipCode && (
                <p className="mt-1 text-sm text-red-500">{errors.zipCode}</p>
              )}
            </div>
            
            {/* Country */}
            <div>
              <label htmlFor="country" className="block text-sm font-medium mb-1 text-gray-300">
                Country*
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-gray-800 border ${
                  errors.country ? 'border-red-500' : 'border-gray-700'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 text-white`}
                disabled={loading}
              >
                <option value="">Select Country</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="GB">United Kingdom</option>
                <option value="AU">Australia</option>
                <option value="IN">India</option>
                {/* Add more countries as needed */}
              </select>
              {errors.country && (
                <p className="mt-1 text-sm text-red-500">{errors.country}</p>
              )}
            </div>
            
            {/* Save Address */}
            <div className="mt-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="saveAddress"
                  checked={formData.saveAddress}
                  onChange={handleCheckboxChange}
                  className="form-checkbox text-gold-500 h-5 w-5 rounded focus:ring-gold-500"
                  disabled={loading}
                />
                <span className="ml-2 text-gray-300">Save this address for future orders</span>
              </label>
            </div>
          </div>
          
          {/* Payment & Shipping */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gold-400 mb-4">Payment & Shipping</h3>
            
            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Payment Method*
              </label>
              <div className="space-y-2">
                <label className="flex items-center p-3 border border-gray-700 rounded-md bg-gray-800 cursor-pointer hover:border-gold-500 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleChange}
                    className="form-radio text-gold-500 focus:ring-gold-500"
                    disabled={loading}
                  />
                  <span className="ml-2 text-white">Credit/Debit Card</span>
                  <div className="ml-auto flex space-x-2">
                    <span className="text-gray-400">Visa, Mastercard, Amex</span>
                  </div>
                </label>
                
                <label className="flex items-center p-3 border border-gray-700 rounded-md bg-gray-800 cursor-pointer hover:border-gold-500 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={formData.paymentMethod === 'paypal'}
                    onChange={handleChange}
                    className="form-radio text-gold-500 focus:ring-gold-500"
                    disabled={loading}
                  />
                  <span className="ml-2 text-white">PayPal</span>
                </label>
              </div>
              {errors.paymentMethod && (
                <p className="mt-1 text-sm text-red-500">{errors.paymentMethod}</p>
              )}
            </div>
            
            {/* Shipping Method */}
            <div className="mt-6">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Shipping Method*
              </label>
              <div className="space-y-2">
                {shippingMethods.map(method => (
                  <label 
                    key={method._id} 
                    className="flex items-center p-3 border border-gray-700 rounded-md bg-gray-800 cursor-pointer hover:border-gold-500 transition-colors"
                  >
                    <input
                      type="radio"
                      name="shippingMethod"
                      value={method._id}
                      checked={selectedShipping === method._id}
                      onChange={handleShippingChange}
                      className="form-radio text-gold-500 focus:ring-gold-500"
                      disabled={loading}
                    />
                    <div className="ml-2 flex-grow">
                      <div className="text-white">{method.name}</div>
                      <div className="text-sm text-gray-400">{method.description}</div>
                    </div>
                    <div className="ml-auto font-medium text-gold-400">
                      ${method.cost.toFixed(2)}
                    </div>
                  </label>
                ))}
                
                {shippingMethods.length === 0 && (
                  <div className="text-gray-400 text-center py-4">
                    No shipping methods available
                  </div>
                )}
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="mt-6 bg-gray-800 p-4 rounded-md border border-gray-700">
              <h4 className="text-lg font-medium text-white mb-3">Order Summary</h4>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Shipping</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-700 my-2"></div>
                <div className="flex justify-between text-white font-bold">
                  <span>Total</span>
                  <span>${(total + shippingCost).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="mt-8">
          <button
            type="submit"
            disabled={loading || cartItems.length === 0}
            className="w-full bg-gold-600 hover:bg-gold-700 text-white font-medium py-3 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Order...
              </span>
            ) : (
              `Place Order - $${(total + shippingCost).toFixed(2)}`
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;
