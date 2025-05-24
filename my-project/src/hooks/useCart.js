import { useContext } from 'react';
import CartContext from '../context/CartContext';

/**
 * Custom hook for accessing cart context
 * @returns {Object} - Cart context
 */
export const useCart = () => {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
};

// Also export as default for backward compatibility
export default useCart;
