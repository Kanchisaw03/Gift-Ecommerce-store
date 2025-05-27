import { useCart } from "../hooks/useCart";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { luxuryTheme } from "../styles/luxuryTheme";

export default function CartSidebar({ isOpen, onClose }) {
  const { cartItems, removeFromCart, total, addToCart } = useCart();

  // Animation variants
  const sidebarVariants = {
    closed: { x: "100%", opacity: 0 },
    open: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } }
  };

  const overlayVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3
      }
    })
  };

  // Increase quantity
  const increaseQuantity = (item) => {
    addToCart(item);
  };

  // Decrease quantity
  const decreaseQuantity = (item) => {
    if (item.quantity > 1) {
      // Create a new item with one less quantity
      const updatedItem = { ...item, quantity: item.quantity - 1 };
      // Remove the current item
      removeFromCart(item._id || item.id);
      // Add the updated item
      addToCart(updatedItem);
    } else {
      removeFromCart(item._id || item.id);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
          />

          {/* Sidebar */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full sm:w-96 z-50 overflow-hidden"
            style={{ 
              backgroundColor: luxuryTheme.colors.primary.dark, 
              boxShadow: '0 0 30px rgba(0, 0, 0, 0.7), -1px 0 0 rgba(212, 175, 55, 0.1)'
            }}
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {/* Header */}
            <div className="p-6 flex justify-between items-center border-b border-gold/10">
              <h2 
                className="text-xl font-semibold text-gold flex items-center"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Your Collection ({total.quantity})
              </h2>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-800/50 transition-colors"
                aria-label="Close cart"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gold/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Cart Items */}
            <div className="p-6 overflow-y-auto h-[calc(100%-13rem)] space-y-6">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gold/30 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <p 
                    className="text-gray-400 mb-6"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                  >
                    Your collection is empty
                  </p>
                  <button 
                    onClick={onClose}
                    className="px-6 py-3 border border-gold text-gold hover:bg-gold hover:text-black transition-all duration-300"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.body, letterSpacing: '1px' }}
                  >
                    <span className="uppercase text-sm tracking-wider">Continue Shopping</span>
                  </button>
                </div>
              ) : (
                cartItems.map((item, index) => (
                  <motion.div 
                    key={item._id || item.id || index} 
                    custom={index}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex border-b border-gold/10 pb-6 pt-2"
                  >
                    <div className="w-20 h-20 overflow-hidden bg-gray-800 flex-shrink-0 relative group">
                      <div className="absolute inset-0 border border-gold/20 group-hover:border-gold/40 transition-colors duration-300 z-10"></div>
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          // Use a data URI as fallback instead of external placeholder service
                          e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2280%22%20height%3D%2280%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2080%2080%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_189e%20text%20%7B%20fill%3A%23333%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A10pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder%22%3E%3Crect%20width%3D%2280%22%20height%3D%2280%22%20fill%3D%22%23555%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2226%22%20y%3D%2245%22%3EGift%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';
                        }}
                      />
                    </div>
                    <div className="ml-4 flex-grow">
                      <div className="flex justify-between">
                        <h3 
                          className="font-medium text-white"
                          style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                        >
                          {item.name}
                        </h3>
                        <p className="font-semibold text-gold">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">${item.price.toFixed(2)} each</p>
                      

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-gold/20 bg-gray-800">
                          <button 
                            onClick={() => decreaseQuantity(item)}
                            className="px-3 py-1 text-gold hover:bg-gray-700 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 text-white">{item.quantity}</span>
                          <button 
                            onClick={() => increaseQuantity(item)}
                            className="px-3 py-1 text-gold hover:bg-gray-700 transition-colors"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item._id || item.id)}
                          className="text-xs uppercase tracking-wider text-gold/70 hover:text-gold border-b border-transparent hover:border-gold/30 pb-px transition-all duration-300"
                          style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                          aria-label="Remove item"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="absolute bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm border-t border-gold/10 p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span 
                    className="font-medium text-white uppercase text-sm tracking-wider"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                  >
                    Subtotal:
                  </span>
                  <span className="font-semibold text-gold">${total.price.toFixed(2)}</span>
                </div>
                <p 
                  className="text-xs text-gray-400"
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                >
                  Shipping & taxes calculated at checkout
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/cart"
                    className="py-3 px-4 text-center border border-gold/50 text-gold hover:border-gold transition-all duration-300"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.body, letterSpacing: '1px' }}
                    onClick={onClose}
                  >
                    <span className="uppercase text-xs tracking-wider">View Cart</span>
                  </Link>
                  <Link
                    to="/checkout"
                    className="py-3 px-4 text-center bg-gold text-black hover:bg-gold-light transition-all duration-300"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.body, letterSpacing: '1px' }}
                    onClick={onClose}
                  >
                    <span className="uppercase text-xs tracking-wider">Checkout</span>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
