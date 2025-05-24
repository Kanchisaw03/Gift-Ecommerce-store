import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { luxuryTheme } from "../styles/luxuryTheme";
import { useCart } from "../hooks/useCart";

export default function Cart() {
  const { cartItems, removeFromCart, addToCart, clearCart, total } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);

  // Handle quantity decrease
  const decreaseQuantity = (item) => {
    if (item.quantity > 1) {
      // Create a new item with one less quantity
      const updatedItem = { ...item, quantity: item.quantity - 1 };
      // Remove the current item
      removeFromCart(item.id);
      // Add the updated item
      addToCart(updatedItem);
      // Decrease the quantity by 1
      updatedItem.quantity -= 1;
    } else {
      removeFromCart(item.id);
    }
  };

  // Handle quantity increase
  const increaseQuantity = (item) => {
    addToCart(item);
  };

  // Apply coupon code
  const applyCoupon = () => {
    if (couponCode.toLowerCase() === "welcome10") {
      setCouponApplied(true);
      setCouponDiscount(total.price * 0.1); // 10% discount
    } else {
      setCouponApplied(false);
      setCouponDiscount(0);
    }
  };

  // Calculate order summary
  const subtotal = total.price;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const discount = couponApplied ? couponDiscount : 0;
  const orderTotal = subtotal + shipping - discount;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="pt-24 pb-12 min-h-screen w-full" style={{ backgroundColor: luxuryTheme.colors.primary.dark }}>
      <div className="container mx-auto px-4 w-full">
        <h1 
          className="text-3xl font-bold mb-8 text-gold"
          style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
        >
          Your Collection
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-16 bg-gray-900/50 border border-gold/10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gold/30 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2 
              className="text-2xl font-medium text-white mb-4"
              style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
            >
              Your collection is empty
            </h2>
            <p 
              className="text-gray-400 mb-8"
              style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
            >
              Looks like you haven't added any items to your collection yet.
            </p>
            <Link 
              to="/products" 
              className="px-8 py-3 border border-gold text-gold hover:bg-gold hover:text-black transition-all duration-300"
              style={{ fontFamily: luxuryTheme.typography.fontFamily.body, letterSpacing: '1px' }}
            >
              <span className="uppercase text-sm tracking-wider">Continue Shopping</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <motion.div 
                className="bg-gray-900/50 border border-gold/10 overflow-hidden"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="p-6 border-b border-gold/10">
                  <div className="flex justify-between items-center">
                    <h2 
                      className="text-lg font-semibold text-gold"
                      style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                    >
                      Collection Items ({total.quantity})
                    </h2>
                    <button 
                      onClick={clearCart}
                      className="text-sm uppercase tracking-wider text-gold/70 hover:text-gold border-b border-transparent hover:border-gold/30 pb-px transition-all duration-300"
                      style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                    >
                      Clear Collection
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-gold/10">
                  {cartItems.map((item) => (
                    <motion.div 
                      key={item.id} 
                      className="p-6 flex flex-col sm:flex-row"
                      variants={itemVariants}
                    >
                      <div className="w-full sm:w-24 h-24 bg-gray-800 overflow-hidden flex-shrink-0 mb-4 sm:mb-0 relative group">
                        <div className="absolute inset-0 border border-gold/20 group-hover:border-gold/40 transition-colors duration-300 z-10"></div>
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/100x100?text=Gift";
                          }}
                        />
                      </div>
                      <div className="sm:ml-6 flex-grow">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <div>
                            <h3 
                              className="text-base font-medium text-white mb-1"
                              style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                            >
                              {item.name}
                            </h3>
                            <p 
                              className="text-sm text-gray-400 mb-4"
                              style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                            >
                              ${item.price.toFixed(2)} each
                            </p>
                          </div>
                          <div className="flex items-center justify-between sm:justify-end sm:space-x-6">
                            <div className="flex items-center border border-gold/20 bg-gray-800">
                              <button 
                                onClick={() => decreaseQuantity(item)}
                                className="px-3 py-1 text-gold hover:bg-gray-700 transition-colors"
                              >
                                -
                              </button>
                              <span className="px-3 py-1 text-white">{item.quantity}</span>
                              <button 
                                onClick={() => increaseQuantity(item)}
                                className="px-3 py-1 text-gold hover:bg-gray-700 transition-colors"
                              >
                                +
                              </button>
                            </div>
                            <div className="text-right">
                              <p className="text-base font-semibold text-gold">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-xs uppercase tracking-wider text-gold/70 hover:text-gold border-b border-transparent hover:border-gold/30 pb-px transition-all duration-300 mt-1"
                                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="p-6 bg-gray-900/80 backdrop-blur-sm border-t border-gold/10 flex justify-between items-center">
                  <Link 
                    to="/products" 
                    className="text-gold hover:text-gold-light transition-colors flex items-center"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Continue Shopping
                  </Link>
                  <div className="text-right">
                    <p 
                      className="text-sm text-gray-400"
                      style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                    >
                      Subtotal
                    </p>
                    <p className="text-xl font-semibold text-gold">${subtotal.toFixed(2)}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900/50 border border-gold/10 overflow-hidden sticky top-24">
                <div className="p-6 border-b border-gold/10">
                  <h2 
                    className="text-lg font-semibold text-gold"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                  >
                    Order Summary
                  </h2>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex justify-between">
                    <span 
                      className="text-gray-400"
                      style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                    >
                      Subtotal
                    </span>
                    <span className="text-white">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span 
                      className="text-gray-400"
                      style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                    >
                      Shipping
                    </span>
                    <span className="text-white">
                      {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  
                  {couponApplied && (
                    <div className="flex justify-between text-gold">
                      <span style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}>Discount (10%)</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-gold/10 pt-4 mt-4">
                    <div className="flex justify-between font-semibold">
                      <span 
                        className="text-white uppercase text-sm tracking-wider"
                        style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                      >
                        Total
                      </span>
                      <span className="text-xl text-gold">${orderTotal.toFixed(2)}</span>
                    </div>
                    <p 
                      className="text-xs text-gray-400 mt-1"
                      style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                    >
                      Including taxes
                    </p>
                  </div>
                  
                  {/* Coupon Code */}
                  <div className="mt-6">
                    <label 
                      className="block text-sm font-medium text-gray-300 mb-2"
                      style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                    >
                      Coupon Code
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter coupon code"
                        className="flex-grow px-4 py-3 bg-gray-800 border border-gold/20 text-white focus:outline-none focus:border-gold/50"
                        style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                      />
                      <button
                        onClick={applyCoupon}
                        className="px-4 py-3 bg-gray-800 text-gold border border-gold/20 hover:bg-gray-700 transition-colors"
                        style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                      >
                        Apply
                      </button>
                    </div>
                    {couponApplied && (
                      <p 
                        className="text-sm text-gold mt-1"
                        style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                      >
                        Coupon applied successfully!
                      </p>
                    )}
                    {couponCode && !couponApplied && (
                      <p 
                        className="text-sm text-red-400 mt-1"
                        style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                      >
                        Invalid coupon code.
                      </p>
                    )}
                    <p 
                      className="text-xs text-gray-400 mt-2"
                      style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                    >
                      Try "WELCOME10" for 10% off your first order
                    </p>
                  </div>
                  
                  {/* Checkout Button */}
                  <Link
                    to="/checkout"
                    className="block w-full py-3 px-4 bg-gold text-black text-center hover:bg-gold-light transition-all duration-300 mt-6"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.body, letterSpacing: '1px' }}
                  >
                    <span className="uppercase text-sm tracking-wider">Proceed to Checkout</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
