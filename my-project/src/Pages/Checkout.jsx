import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCheck, FiX, FiTag } from "react-icons/fi";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { createOrder } from "../services/api/orderService";
import { processPayment, createRazorpayOrder } from "../services/api/paymentService";
import { toast } from "react-toastify";
import luxuryTheme from "../styles/luxuryTheme";
import useRazorpay from "../hooks/useRazorpay";
import { useCoupon } from "../context/CouponContext";

export default function Checkout() {
  const { cartItems, clearCart, total } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { initializePayment, isLoading: isRazorpayLoading } = useRazorpay();
  const { validateCouponCode } = useCoupon();
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India", // Default to India
    phone: "", // Add phone field
    paymentMethod: "razorpay",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    couponCode: ""
  });
  
  // Error state
  const [errors, setErrors] = useState({});
  
  // Loading state for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState("");
  
  // Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  
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
    const requiredFields = ["firstName", "lastName", "email", "address", "city", "state", "zipCode", "country", "phone"];
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
      }
    });
    
    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Phone validation
    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
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
    // For Razorpay, we don't need to validate card details as they are handled by Razorpay
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Order service is now imported at the top of the file

  // Handle applying coupon
  const handleApplyCoupon = async () => {
    if (!formData.couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }
    
    setCouponLoading(true);
    setCouponError("");
    
    try {
      const result = await validateCouponCode(
        formData.couponCode,
        cartItems.map(item => ({
          product: item._id || item.id,
          quantity: item.quantity,
          price: item.price
        })),
        subtotal
      );
      
      if (result.valid) {
        setAppliedCoupon({
          code: formData.couponCode,
          discountAmount: result.discountAmount,
          details: result.couponDetails
        });
        toast.success(`Coupon applied: $${result.discountAmount.toFixed(2)} discount`);
      } else {
        setCouponError(result.message || "Invalid coupon code");
        setAppliedCoupon(null);
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      setCouponError(error.message || "Failed to apply coupon");
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };
  
  // Handle removing applied coupon
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setFormData(prev => ({ ...prev, couponCode: "" }));
    setCouponError("");
  };

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
            phone: formData.phone || '1234567890', // Add default phone if not provided
          },
          // Use shipping address as billing address if not specified
          billingAddress: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
            phone: formData.phone || '1234567890', // Add default phone if not provided
          },
          // Add payment info as required by the backend with correct enum values
          paymentInfo: {
            method: formData.paymentMethod === 'razorpay' ? 'stripe' : // Map razorpay to stripe since it's not in the enum
                   formData.paymentMethod === 'credit' ? 'credit_card' : 
                   formData.paymentMethod === 'paypal' ? 'paypal' : 'bank_transfer',
            status: 'pending',
            id: 'pending-' + Date.now(),
            // Add card details if using credit card payment
            ...(formData.paymentMethod === 'credit' && {
              cardDetails: {
                lastFour: formData.cardNumber ? formData.cardNumber.slice(-4) : '****',
                cardholderName: formData.cardName || '',
              }
            })
          },
          items: cartItems.map(item => {
            // Ensure we have valid strings for MongoDB ObjectIds
            let productId = '645e2d90675225374f91a05d'; // Default ID as fallback
            if (typeof item._id === 'string') {
              productId = item._id;
            } else if (typeof item.id === 'string') {
              productId = item.id;
            }
            
            // Always use a hardcoded seller ID for now to avoid ObjectId casting issues
            // This is a temporary fix until we properly implement seller references
            const sellerId = '645e2d90675225374f91a05d';
            
            return {
              product: productId,
              quantity: item.quantity,
              price: item.price,
              name: item.name || 'Product',
              image: item.image || '/assets/images/product-placeholder.jpg',
              seller: sellerId
            };
          }),
          subtotal,
          tax,
          shippingCost: shipping, // Match the backend field name
          discount,
          total: orderTotal,
          notes: '',
          isGift: false
        };
        
        console.log('Final order data being sent:', JSON.stringify(orderData, null, 2));
        
        // Create order in database
        const orderResponse = await createOrder(orderData);
        console.log('Order creation response:', orderResponse);
        
        if (!orderResponse || !orderResponse.data) {
          throw new Error('Failed to create order');
        }
        
        const orderId = orderResponse.data.orderId || orderResponse.data._id;
        
        // Handle payment based on selected method
        if (formData.paymentMethod === 'razorpay') {
          // For Razorpay, we first create the order then initiate payment
          setIsSubmitting(false); // Set to false as Razorpay will show its own loading UI
          
          try {
            // Create Razorpay order
            console.log('Creating Razorpay order for orderId:', orderId);
            // Ensure amount is never zero or negative
            const paymentAmount = Math.max(orderTotal, 1); // Minimum 1 unit of currency
            console.log('Payment amount:', paymentAmount);
            
            const razorpayOrderData = await createRazorpayOrder({
              orderId: orderId,
              amount: paymentAmount, // Backend will convert to paise
              currency: 'INR'
            });
            
            console.log('Razorpay order created:', razorpayOrderData);
            
            if (!razorpayOrderData || !razorpayOrderData.id) {
              throw new Error('Failed to create Razorpay order: Missing order ID in response');
            }
            
            // Initialize Razorpay payment
            const options = {
              key: razorpayOrderData.key_id || import.meta.env.VITE_RAZORPAY_KEY_ID, // Use key from backend or env
              amount: orderTotal * 100, // Amount in smallest currency unit (paise)
              currency: 'INR',
              name: 'Luxury Gifts',
              description: 'Payment for your order',
              order_id: razorpayOrderData.id,
              handler: function(response) {
                // Handle successful payment
                console.log('Payment successful:', response);
                // Clear cart and redirect to order confirmation page
                clearCart();
                toast.success('Payment successful! Order placed.');
                navigate(`/order-confirmation/${orderId}`);
              },
              prefill: {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                contact: formData.phone
              },
              theme: {
                color: '#D4AF37'
              }
            };
            
            // Load Razorpay script if not already loaded
            if (window.Razorpay) {
              const razorpay = new window.Razorpay(options);
              razorpay.open();
            } else {
              const script = document.createElement('script');
              script.src = 'https://checkout.razorpay.com/v1/checkout.js';
              script.async = true;
              script.onload = () => {
                const razorpay = new window.Razorpay(options);
                razorpay.open();
              };
              document.body.appendChild(script);
            }
          } catch (error) {
            console.error('Razorpay payment failed:', error);
            toast.error(error.message || 'Payment failed. Please try again.');
            setIsSubmitting(false);
          }
          
          return; // Exit early as Razorpay will handle the rest
        } else if (formData.paymentMethod === 'credit') {
          // Process credit card payment
          const paymentData = {
            cardNumber: formData.cardNumber.replace(/\s/g, ''),
            cardName: formData.cardName,
            expiryDate: formData.expiryDate,
            cvv: formData.cvv,
            amount: orderTotal
          };
          
          const paymentResult = await processPayment(paymentData);
          
          if (!paymentResult || !paymentResult.success) {
            throw new Error(paymentResult?.message || 'Payment processing failed');
          }
        }
        
        // Set order ID and complete the checkout process (for non-Razorpay methods)
        setOrderId(orderId);
        setOrderComplete(true);
        clearCart();
        toast.success('Order placed successfully!');
      } catch (error) {
        console.error("Error creating order:", error);
        toast.error(error.message || "There was an error processing your order. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  // Check if cart has romantic gift box products
  const hasRomanticGiftBox = cartItems.some(item => {
    // Check if product name or tags contain "romantic" and "gift box"
    const name = (item.name || '').toLowerCase();
    const tags = Array.isArray(item.tags) ? item.tags.map(tag => tag.toLowerCase()).join(' ') : '';
    const description = (item.description || '').toLowerCase();
    
    return (name.includes('romantic') && name.includes('gift')) || 
           (tags.includes('romantic') && tags.includes('gift')) ||
           (description.includes('romantic gift box'));
  });
  
  // Calculate order summary
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.05; // 5% tax
  const shipping = hasRomanticGiftBox ? 0 : 10; // Free shipping for romantic gift boxes
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const orderTotal = subtotal + tax + shipping - discount;
  
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
                        Phone Number*
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g., 9876543210"
                        className={`w-full px-4 py-2 border ${errors.phone ? 'border-red-500' : 'border-gold/30'} focus:outline-none focus:border-gold bg-black/20 text-white`}
                        style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
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
                        <option value="India">India</option>
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
                        id="razorpay"
                        name="paymentMethod"
                        type="radio"
                        value="razorpay"
                        checked={formData.paymentMethod === "razorpay"}
                        onChange={handleChange}
                        className="h-4 w-4 text-gold focus:ring-gold border-gold/30"
                      />
                      <label htmlFor="razorpay" className="ml-3 block text-sm font-medium text-white" style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}>
                        Razorpay
                      </label>
                      <div className="ml-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs px-2 py-1 rounded">
                        Recommended
                      </div>
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
                    
                    {formData.paymentMethod === "razorpay" && (
                      <div className="mt-4 p-4 border border-gold/20" style={{ backgroundColor: 'rgba(212, 175, 55, 0.05)' }}>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-white text-sm mb-1" style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}>
                              Secure payment powered by Razorpay
                            </p>
                            <p className="text-gray-400 text-xs" style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}>
                              You will be redirected to Razorpay's secure payment gateway after placing your order
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <img src="https://razorpay.com/assets/razorpay-logo.svg" alt="Razorpay" className="h-8" />
                            <div className="flex space-x-1">
                              <div className="w-6 h-4 bg-blue-600 rounded"></div>
                              <div className="w-6 h-4 bg-yellow-500 rounded"></div>
                              <div className="w-6 h-4 bg-red-500 rounded"></div>
                              <div className="w-6 h-4 bg-green-500 rounded"></div>
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 mt-2" style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}>
                          * All payment details will be securely handled by Razorpay
                        </div>
                      </div>
                    )}
                    
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
                              e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='40' viewBox='0 0 120 40' preserveAspectRatio='none'%3E%3Cg%3E%3Ctext style='font-family:Arial;font-size:12px;font-weight:bold;dominant-baseline:middle;text-anchor:middle;fill:rgba(100,100,100,0.8)' x='50%25' y='50%25'%3EPayPal%3C/text%3E%3C/g%3E%3C/svg%3E";
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
                    {cartItems.map((item, index) => (
                      <div key={item._id || item.id || `cart-item-${index}`} className="flex items-center py-2 border-b border-gold/10 last:border-b-0">
                        <div className="w-12 h-12 bg-black/30 border border-gold/20 overflow-hidden flex-shrink-0">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48' preserveAspectRatio='none'%3E%3Cg%3E%3Ctext style='font-family:Arial;font-size:10px;font-weight:bold;dominant-baseline:middle;text-anchor:middle;fill:rgba(100,100,100,0.8)' x='50%25' y='50%25'%3EGift%3C/text%3E%3C/g%3E%3C/svg%3E";
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
                  
                  {/* Coupon Code Input */}
                  <div className="mb-4 border-t border-gold/20 pt-4">
                    <div className="flex items-center mb-2">
                      <FiTag className="text-gold mr-2" />
                      <span 
                        className="text-white text-sm font-medium"
                        style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                      >
                        Apply Coupon
                      </span>
                    </div>
                    
                    {!appliedCoupon ? (
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          name="couponCode"
                          value={formData.couponCode}
                          onChange={handleChange}
                          placeholder="Enter coupon code"
                          className="flex-grow px-3 py-2 bg-black/30 border border-gold/30 text-white text-sm focus:outline-none focus:border-gold"
                          style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                          disabled={couponLoading}
                        />
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          className="px-3 py-2 bg-gold/20 hover:bg-gold/30 text-gold text-sm transition-colors duration-300"
                          disabled={couponLoading || !formData.couponCode.trim()}
                        >
                          {couponLoading ? "Applying..." : "Apply"}
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-2 bg-green-900/20 border border-green-500/30 text-sm">
                        <div className="flex items-center">
                          <FiCheck className="text-green-500 mr-2" />
                          <span className="text-white">
                            {appliedCoupon.code.toUpperCase()} applied
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          className="text-red-400 hover:text-red-300"
                          title="Remove coupon"
                        >
                          <FiX />
                        </button>
                      </div>
                    )}
                    
                    {couponError && (
                      <p className="mt-1 text-sm text-red-500">{couponError}</p>
                    )}
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
                    
                    {appliedCoupon && (
                      <div className="flex justify-between text-green-400">
                        <span 
                          style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                        >
                          Discount ({appliedCoupon.code})
                        </span>
                        <span 
                          style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                        >
                          -${appliedCoupon.discountAmount.toFixed(2)}
                        </span>
                      </div>
                    )}
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
