import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { createOrder } from "../services/api/orderService";
import { luxuryTheme } from "../styles/luxuryTheme";

export default function Checkout() {
  const { cartItems, clearCart, total } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    paymentMethod: "credit",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: ""
  });
  
  // Error state
  const [errors, setErrors] = useState({});
  
  // Loading state for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState("");
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    const requiredFields = ["firstName", "lastName", "email", "address", "city", "state", "zipCode", "country"];
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
      }
    });
    
    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Payment validation
    if (formData.paymentMethod === "credit") {
      if (!formData.cardNumber) {
        newErrors.cardNumber = "Card number is required";
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
        newErrors.cardNumber = "Please enter a valid 16-digit card number";
      }
      
      if (!formData.cardName) {
        newErrors.cardName = "Name on card is required";
      }
      
      if (!formData.expiryDate) {
        newErrors.expiryDate = "Expiry date is required";
      } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = "Please use MM/YY format";
      }
      
      if (!formData.cvv) {
        newErrors.cvv = "CVV is required";
      } else if (!/^\d{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = "Please enter a valid CVV";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Order service is now imported at the top of the file

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Prepare order data
        const orderData = {
          shippingAddress: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
          },
          paymentMethod: formData.paymentMethod,
          items: cartItems.map(item => ({
            productId: item._id || item.id,
            quantity: item.quantity,
            price: item.price
          })),
          subtotal,
          shipping,
          tax,
          total: orderTotal
        };
        
        // DEVELOPMENT MODE: Check if we should use mock API
        const MOCK_API = true; // Set to false when backend is ready
        
        if (MOCK_API || !isAuthenticated) {
          // Simulate API call for development or guest checkout
          setTimeout(() => {
            // Generate random order ID
            const randomOrderId = "GN" + Math.floor(100000 + Math.random() * 900000);
            setOrderId(randomOrderId);
            
            // Clear cart and set order complete
            clearCart();
            setOrderComplete(true);
            setIsSubmitting(false);
          }, 2000);
        } else {
          // Use real API for production with authenticated users
          const response = await createOrder(orderData);
          setOrderId(response.orderId);
          clearCart();
          setOrderComplete(true);
        }
      } catch (error) {
        console.error('Error creating order:', error);
        // Show error message
        setErrors({
          submit: error.message || 'Failed to create order. Please try again.'
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  // Calculate order summary
  const subtotal = total.price;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08; // 8% tax
  const orderTotal = subtotal + shipping + tax;
  
  // If cart is empty and order not complete, redirect to products
  if (cartItems.length === 0 && !orderComplete) {
    return (
      <div className="pt-24 pb-12" style={{ backgroundColor: luxuryTheme.colors.primary.dark }}>
        <div className="container mx-auto px-4 text-center py-16">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gold/40 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h2 
            className="text-2xl font-medium text-white mb-4"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
          >
            Your Collection is Empty
          </h2>
          <p 
            className="text-gray-400 mb-8"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
          >
            Add some exquisite items to your collection before proceeding to checkout.
          </p>
          <Link 
            to="/products" 
            className="px-6 py-3 bg-gold text-black hover:bg-gold-light transition-all duration-300"
            style={{ 
              fontFamily: luxuryTheme.typography.fontFamily.body,
              letterSpacing: '1px',
              boxShadow: luxuryTheme.shadows.md
            }}
          >
            BROWSE COLLECTION
          </Link>
        </div>
      </div>
    );
  }
  
  // Order complete screen
  if (orderComplete) {
    return (
      <div className="pt-24 pb-12" style={{ backgroundColor: luxuryTheme.colors.primary.dark }}>
        <div className="container mx-auto px-4 max-w-2xl">
          <div 
            className="p-8 text-center border border-gold/30"
            style={{ 
              backgroundColor: luxuryTheme.colors.neutral.dark,
              boxShadow: luxuryTheme.shadows.md + ', ' + luxuryTheme.shadows.goldInset
            }}
          >
            <div className="w-16 h-16 bg-black/30 border border-gold/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 
              className="text-3xl font-bold text-white mb-4"
              style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
            >
              Order Confirmed
            </h1>
            <p 
              className="text-gray-300 mb-6"
              style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
            >
              Thank you for your purchase. Your order has been received and is being processed with care.
            </p>
            <div 
              className="p-4 mb-6 border border-gold/20"
              style={{ backgroundColor: 'rgba(212, 175, 55, 0.05)' }}
            >
              <p 
                className="text-white font-medium"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                Order Number:
              </p>
              <p 
                className="text-xl font-semibold text-gold"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.accent }}
              >
                {orderId}
              </p>
            </div>
            <p 
              className="text-gray-300 mb-8"
              style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
            >
              A confirmation email has been sent to {formData.email}. We'll notify you when your order ships.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/"
                className="px-6 py-3 bg-gold text-black hover:bg-gold-light transition-all duration-300"
                style={{ 
                  fontFamily: luxuryTheme.typography.fontFamily.body,
                  letterSpacing: '1px',
                  boxShadow: luxuryTheme.shadows.md
                }}
              >
                RETURN TO HOME
              </Link>
              <Link 
                to="/products"
                className="px-6 py-3 border border-gold/50 text-gold hover:border-gold hover:text-gold-light transition-all duration-300"
                style={{ 
                  fontFamily: luxuryTheme.typography.fontFamily.body,
                  letterSpacing: '1px'
                }}
              >
                CONTINUE SHOPPING
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="pt-24 pb-12" style={{ backgroundColor: luxuryTheme.colors.primary.dark }}>
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <h1 
            className="text-3xl font-bold mb-4 text-white"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
          >
            Checkout
          </h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold to-transparent mb-8"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form 
                onSubmit={handleSubmit} 
                className="overflow-hidden border border-gold/30"
                style={{ 
                  backgroundColor: luxuryTheme.colors.neutral.dark,
                  boxShadow: luxuryTheme.shadows.md
                }}
              >
                {/* Shipping Information */}
                <div className="p-6 border-b border-gold/20">
                  <h2 
                    className="text-xl font-semibold mb-4 text-white"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                  >
                    Shipping Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1" style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}>
                        First Name*
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border ${errors.firstName ? 'border-red-500' : 'border-gold/30'} focus:outline-none focus:border-gold bg-black/20 text-white`}
                        style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1" style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}>
                        Last Name*
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border ${errors.lastName ? 'border-red-500' : 'border-gold/30'} focus:outline-none focus:border-gold bg-black/20 text-white`}
                        style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                      )}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-1" style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}>
                        Email Address*
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gold/30'} focus:outline-none focus:border-gold bg-black/20 text-white`}
                        style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                      )}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-1" style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}>
                        Street Address*
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border ${errors.address ? 'border-red-500' : 'border-gold/30'} focus:outline-none focus:border-gold bg-black/20 text-white`}
                        style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                      />
                      {errors.address && (
                        <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1" style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}>
                        City*
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border ${errors.city ? 'border-red-500' : 'border-gold/30'} focus:outline-none focus:border-gold bg-black/20 text-white`}
                        style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                      />
                      {errors.city && (
                        <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1" style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}>
                        State/Province*
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border ${errors.state ? 'border-red-500' : 'border-gold/30'} focus:outline-none focus:border-gold bg-black/20 text-white`}
                        style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                      />
                      {errors.state && (
                        <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1" style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}>
                        ZIP/Postal Code*
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border ${errors.zipCode ? 'border-red-500' : 'border-gold/30'} focus:outline-none focus:border-gold bg-black/20 text-white`}
                        style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                      />
                      {errors.zipCode && (
                        <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1" style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}>
                        Country*
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border ${errors.country ? 'border-red-500' : 'border-gold/30'} focus:outline-none focus:border-gold bg-black/20 text-white`}
                        style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Australia">Australia</option>
                        <option value="Germany">Germany</option>
                        <option value="France">France</option>
                        <option value="Japan">Japan</option>
                      </select>
                      {errors.country && (
                        <p className="text-red-500 text-xs mt-1">{errors.country}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Payment Information */}
                <div className="p-6 border-b border-gold/20">
                  <h2 
                    className="text-xl font-semibold mb-4 text-white"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                  >
                    Payment Method
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        id="credit"
                        name="paymentMethod"
                        type="radio"
                        value="credit"
                        checked={formData.paymentMethod === "credit"}
                        onChange={handleChange}
                        className="h-4 w-4 text-gold focus:ring-gold border-gold/30"
                      />
                      <label htmlFor="credit" className="ml-3 block text-sm font-medium text-white" style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}>
                        Credit Card
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="paypal"
                        name="paymentMethod"
                        type="radio"
                        value="paypal"
                        checked={formData.paymentMethod === "paypal"}
                        onChange={handleChange}
                        className="h-4 w-4 text-gold focus:ring-gold border-gold/30"
                      />
                      <label htmlFor="paypal" className="ml-3 block text-sm font-medium text-white" style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}>
                        PayPal
                      </label>
                    </div>
                    
                    {formData.paymentMethod === "credit" && (
                      <div className="mt-4 p-4 border border-gold/20" style={{ backgroundColor: 'rgba(212, 175, 55, 0.05)' }}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-1" style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}>
                              Card Number*
                            </label>
                            <input
                              type="text"
                              name="cardNumber"
                              value={formData.cardNumber}
                              onChange={handleChange}
                              placeholder="1234 5678 9012 3456"
                              className={`w-full px-4 py-2 border ${errors.cardNumber ? 'border-red-500' : 'border-gold/30'} focus:outline-none focus:border-gold bg-black/20 text-white`}
                              style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                            />
                            {errors.cardNumber && (
                              <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
                            )}
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-1" style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}>
                              Name on Card*
                            </label>
                            <input
                              type="text"
                              name="cardName"
                              value={formData.cardName}
                              onChange={handleChange}
                              className={`w-full px-4 py-2 border ${errors.cardName ? 'border-red-500' : 'border-gold/30'} focus:outline-none focus:border-gold bg-black/20 text-white`}
                              style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                            />
                            {errors.cardName && (
                              <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1" style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}>
                              Expiry Date*
                            </label>
                            <input
                              type="text"
                              name="expiryDate"
                              value={formData.expiryDate}
                              onChange={handleChange}
                              placeholder="MM/YY"
                              className={`w-full px-4 py-2 border ${errors.expiryDate ? 'border-red-500' : 'border-gold/30'} focus:outline-none focus:border-gold bg-black/20 text-white`}
                              style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                            />
                            {errors.expiryDate && (
                              <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1" style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}>
                              CVV*
                            </label>
                            <input
                              type="text"
                              name="cvv"
                              value={formData.cvv}
                              onChange={handleChange}
                              placeholder="123"
                              className={`w-full px-4 py-2 border ${errors.cvv ? 'border-red-500' : 'border-gold/30'} focus:outline-none focus:border-gold bg-black/20 text-white`}
                              style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                            />
                            {errors.cvv && (
                              <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {formData.paymentMethod === "paypal" && (
                      <div className="mt-4 p-4 border border-gold/20 text-center" style={{ backgroundColor: 'rgba(212, 175, 55, 0.05)' }}>
                        <p 
                          className="text-gray-300 mb-2"
                          style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                        >
                          You will be redirected to PayPal to complete your purchase securely.
                        </p>
                        <div className="flex justify-center">
                          <img 
                            src="/assets/paypal-logo.png" 
                            alt="PayPal" 
                            className="h-10"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/120x40?text=PayPal";
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Submit Button */}
                <div className="p-6 flex justify-between items-center border-t border-gold/20">
                  <Link 
                    to="/cart" 
                    className="text-gold hover:text-gold-light transition-all duration-300 flex items-center"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Return to Cart
                  </Link>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-6 py-3 bg-gold text-black hover:bg-gold-light flex items-center transition-all duration-300"
                    disabled={isSubmitting}
                    style={{ 
                      fontFamily: luxuryTheme.typography.fontFamily.body,
                      letterSpacing: '1px',
                      boxShadow: luxuryTheme.shadows.md
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        PROCESSING...
                      </>
                    ) : (
                      <>
                        COMPLETE ORDER
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div 
                className="border border-gold/30 overflow-hidden sticky top-24"
                style={{ 
                  backgroundColor: luxuryTheme.colors.neutral.dark,
                  boxShadow: luxuryTheme.shadows.md + ', ' + luxuryTheme.shadows.goldInset
                }}
              >
                <div className="p-6 border-b border-gold/20">
                  <h2 
                    className="text-lg font-semibold text-white"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                  >
                    Order Summary
                  </h2>
                </div>
                
                <div className="p-6">
                  <div className="max-h-64 overflow-y-auto mb-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center py-2 border-b border-gold/10 last:border-b-0">
                        <div className="w-12 h-12 bg-black/30 border border-gold/20 overflow-hidden flex-shrink-0">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/48x48?text=Gift";
                            }}
                          />
                        </div>
                        <div className="ml-4 flex-grow">
                          <p 
                            className="text-sm font-medium text-white truncate"
                            style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                          >
                            {item.name}
                          </p>
                          <p 
                            className="text-xs text-gray-400"
                            style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                          >
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p 
                            className="text-sm font-semibold text-gold"
                            style={{ fontFamily: luxuryTheme.typography.fontFamily.accent }}
                          >
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-gold/20 pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span 
                        className="text-gray-300"
                        style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                      >
                        Subtotal
                      </span>
                      <span 
                        className="text-white"
                        style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                      >
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span 
                        className="text-gray-300"
                        style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                      >
                        Shipping
                      </span>
                      <span 
                        className="text-white"
                        style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                      >
                        {shipping === 0 ? "Complimentary" : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span 
                        className="text-gray-300"
                        style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                      >
                        Tax (8%)
                      </span>
                      <span 
                        className="text-white"
                        style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                      >
                        ${tax.toFixed(2)}
                      </span>
                    </div>
                    <div className="border-t border-gold/20 pt-2 mt-2">
                      <div className="flex justify-between font-semibold">
                        <span 
                          className="text-white"
                          style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                        >
                          Total
                        </span>
                        <span 
                          className="text-xl text-gold"
                          style={{ fontFamily: luxuryTheme.typography.fontFamily.accent }}
                        >
                          ${orderTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
