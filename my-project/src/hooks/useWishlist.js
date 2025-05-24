import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { 
  getWishlist, 
  addToWishlist, 
  removeFromWishlist, 
  checkWishlistItem,
  moveToCart
} from '../services/api/wishlistService';
import { useAuth } from './useAuth';
import { useCart } from './useCart';

/**
 * Custom hook for handling wishlist operations
 * @returns {Object} - Wishlist state and functions
 */
const useWishlist = () => {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch wishlist items
   */
  const fetchWishlist = useCallback(async () => {
    // Skip if not authenticated
    if (!isAuthenticated) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getWishlist();
      setWishlistItems(response.data || []);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch wishlist';
      setError(errorMessage);
      console.error('Error fetching wishlist:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * Add item to wishlist
   * @param {Object} product - Product to add to wishlist
   */
  const addItemToWishlist = useCallback(async (product) => {
    // Skip if not authenticated
    if (!isAuthenticated) {
      toast.info('Please log in to add items to your wishlist');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const productId = product._id || product.id;
      await addToWishlist({ productId });
      
      // Update wishlist items
      await fetchWishlist();
      
      toast.success('Item added to wishlist');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to add item to wishlist';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, fetchWishlist]);

  /**
   * Remove item from wishlist
   * @param {string} productId - Product ID to remove from wishlist
   */
  const removeItemFromWishlist = useCallback(async (productId) => {
    // Skip if not authenticated
    if (!isAuthenticated) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await removeFromWishlist(productId);
      
      // Update wishlist items
      setWishlistItems((prevItems) => 
        prevItems.filter((item) => (item._id || item.id) !== productId)
      );
      
      toast.success('Item removed from wishlist');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to remove item from wishlist';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * Check if product is in wishlist
   * @param {string} productId - Product ID to check
   * @returns {boolean} - Whether product is in wishlist
   */
  const isInWishlist = useCallback((productId) => {
    return wishlistItems.some((item) => (item._id || item.id) === productId);
  }, [wishlistItems]);

  /**
   * Toggle product in wishlist
   * @param {Object} product - Product to toggle in wishlist
   */
  const toggleWishlistItem = useCallback((product) => {
    const productId = product._id || product.id;
    
    if (isInWishlist(productId)) {
      removeItemFromWishlist(productId);
    } else {
      addItemToWishlist(product);
    }
  }, [isInWishlist, removeItemFromWishlist, addItemToWishlist]);

  /**
   * Move item from wishlist to cart
   * @param {string} productId - Product ID to move to cart
   * @param {number} quantity - Quantity to add to cart
   */
  const moveItemToCart = useCallback(async (productId, quantity = 1) => {
    // Skip if not authenticated
    if (!isAuthenticated) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // For authenticated users, use the API
      await moveToCart(productId, { quantity });
      
      // Remove from wishlist
      setWishlistItems((prevItems) => 
        prevItems.filter((item) => (item._id || item.id) !== productId)
      );
      
      toast.success('Item moved to cart');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to move item to cart';
      setError(errorMessage);
      toast.error(errorMessage);
      
      // Fallback: Try to add to cart directly
      try {
        const product = wishlistItems.find((item) => (item._id || item.id) === productId);
        if (product) {
          await addToCart(product, quantity);
          await removeItemFromWishlist(productId);
        }
      } catch (cartErr) {
        console.error('Fallback cart add failed:', cartErr);
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, wishlistItems, addToCart, removeItemFromWishlist]);

  // Fetch wishlist on mount and when auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [isAuthenticated, fetchWishlist]);

  return {
    wishlistItems,
    loading,
    error,
    fetchWishlist,
    addItemToWishlist,
    removeItemFromWishlist,
    isInWishlist,
    toggleWishlistItem,
    moveItemToCart
  };
};

export default useWishlist;
