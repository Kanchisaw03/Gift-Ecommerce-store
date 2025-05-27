import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { getWishlist, addToWishlist, removeFromWishlist, clearWishlist, moveToCart } from '../services/api/wishlistService';
import { useAuth } from '../hooks/useAuth';
import CartContext from './CartContext';

// Create context
const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useAuth();
  const cartContext = useContext(CartContext);

  // Fetch wishlist on mount and when auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      // Clear wishlist when user logs out
      setWishlistItems([]);
    }
  }, [isAuthenticated]);

  // Fetch wishlist items from API
  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getWishlist();
      
      if (response.success && response.data) {
        // Format wishlist items for easier consumption
        const items = response.data.products.map(item => ({
          ...item.product,
          addedAt: item.addedAt
        }));
        setWishlistItems(items);
      } else if (response.success === false) {
        // Handle specific error from the API
        console.warn('API returned success: false when fetching wishlist:', response.message);
        setWishlistItems([]);
        setError(response.message || 'Failed to fetch wishlist');
      } else {
        // No data but no error either
        setWishlistItems([]);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      // Improved error handling for network errors
      if (error.message === 'Network Error' || !error.response) {
        setError('Unable to connect to the server. Please check your internet connection.');
      } else if (error.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
      } else if (error.response?.status === 403) {
        setError('You do not have permission to access this wishlist.');
      } else {
        setError(error.message || 'Failed to fetch wishlist');
      }
    } finally {
      setLoading(false);
    }
  };

  // Add item to wishlist
  const addItem = async (productId) => {
    if (!isAuthenticated) {
      toast.info('Please login to add items to your wishlist');
      return false;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Ensure we're passing a valid productId
      if (!productId) {
        throw new Error('Invalid product ID');
      }
      
      // Check if item is already in wishlist to avoid duplicate API calls
      if (isInWishlist(productId)) {
        toast.info('Item is already in your wishlist');
        setLoading(false);
        return true;
      }
      
      const response = await addToWishlist(productId);
      
      if (response && response.success) {
        toast.success('Item added to wishlist');
        await fetchWishlist(); // Refresh wishlist
        return true;
      } else if (response && response.success === false) {
        // Handle specific API error responses
        console.warn('API returned success: false when adding to wishlist:', response.message);
        throw new Error(response.message || 'Failed to add item to wishlist');
      } else {
        // Handle case where response exists but success is false
        throw new Error('Failed to add item to wishlist');
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      
      // Improved error handling for different types of errors
      let errorMessage;
      
      if (error.message === 'Network Error' || !error.response) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to add items to this wishlist.';
      } else if (error.response?.status === 409) {
        errorMessage = 'This item is already in your wishlist.';
      } else {
        errorMessage = error.message || 'Failed to add item to wishlist';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remove item from wishlist
  const removeItem = async (productId) => {
    if (!isAuthenticated) {
      toast.info('Please login to manage your wishlist');
      return false;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Check if item is in wishlist before trying to remove
      if (!isInWishlist(productId)) {
        // Item is not in wishlist, so no need to call API
        setLoading(false);
        return true;
      }
      
      const response = await removeFromWishlist(productId);
      
      if (response && response.success) {
        toast.success('Item removed from wishlist');
        // Update local state without fetching again
        setWishlistItems(prev => prev.filter(item => (item._id || item.id) !== productId));
        return true;
      } else if (response && response.success === false) {
        // Handle specific API error responses
        console.warn('API returned success: false when removing from wishlist:', response.message);
        throw new Error(response.message || 'Failed to remove item from wishlist');
      } else {
        throw new Error('Failed to remove item from wishlist');
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      
      // Improved error handling for different types of errors
      let errorMessage;
      
      if (error.message === 'Network Error' || !error.response) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to modify this wishlist.';
      } else if (error.response?.status === 404) {
        // Item not found in wishlist on server, update local state
        setWishlistItems(prev => prev.filter(item => (item._id || item.id) !== productId));
        return true;
      } else {
        errorMessage = error.message || 'Failed to remove item from wishlist';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Clear wishlist
  const clearItems = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to manage your wishlist');
      return false;
    }

    // If wishlist is already empty, no need to call API
    if (wishlistItems.length === 0) {
      toast.info('Your wishlist is already empty');
      return true;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await clearWishlist();
      
      if (response && response.success) {
        toast.success('Wishlist cleared');
        setWishlistItems([]);
        return true;
      } else if (response && response.success === false) {
        // Handle specific API error responses
        console.warn('API returned success: false when clearing wishlist:', response.message);
        throw new Error(response.message || 'Failed to clear wishlist');
      } else {
        throw new Error('Failed to clear wishlist');
      }
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      
      // Improved error handling for different types of errors
      let errorMessage;
      
      if (error.message === 'Network Error' || !error.response) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to clear this wishlist.';
      } else {
        errorMessage = error.message || 'Failed to clear wishlist';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Move item to cart
  const moveItemToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      toast.info('Please login to add items to your cart');
      return false;
    }

    // Validate productId
    if (!productId) {
      toast.error('Invalid product ID');
      return false;
    }

    // Check if item is in wishlist before trying to move
    if (!isInWishlist(productId)) {
      toast.info('Item is not in your wishlist');
      return false;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Validate quantity
      if (quantity <= 0) {
        throw new Error('Quantity must be greater than zero');
      }
      
      console.log(`Moving product ${productId} to cart with quantity ${quantity}`);
      const response = await moveToCart(productId, { quantity });
      
      if (response && response.success) {
        toast.success('Item moved to cart');
        
        // Update local wishlist state without fetching again
        setWishlistItems(prev => prev.filter(item => (item._id || item.id) !== productId));
        
        // Refresh the cart to show the newly added item
        if (cartContext && typeof cartContext.fetchCart === 'function') {
          console.log('Refreshing cart after moving item from wishlist');
          await cartContext.fetchCart();
        } else {
          console.warn('CartContext not available or fetchCart is not a function');
        }
        
        return true;
      } else if (response && response.success === false) {
        // Handle specific API error responses
        console.warn('API returned success: false when moving item to cart:', response.message);
        throw new Error(response.message || 'Failed to move item to cart');
      } else {
        throw new Error('Failed to move item to cart');
      }
    } catch (error) {
      console.error('Error moving item to cart:', error);
      
      // Improved error handling for different types of errors
      let errorMessage;
      
      if (error.message === 'Network Error' || !error.response) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to move items to cart.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Product not found or no longer available.';
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid request. Please try again with correct information.';
      } else {
        errorMessage = error.message || 'Failed to move item to cart';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Check if item is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some(item => (item._id || item.id) === productId);
  };

  // Toggle wishlist item (add if not in wishlist, remove if in wishlist)
  const toggleWishlistItem = async (productId) => {
    if (isInWishlist(productId)) {
      return await removeItem(productId);
    } else {
      return await addItem(productId);
    }
  };

  // Context value
  const value = {
    wishlistItems,
    loading,
    error,
    addItem,
    removeItem,
    clearItems,
    moveItemToCart,
    isInWishlist,
    toggleWishlistItem,
    refreshWishlist: fetchWishlist,
    wishlistCount: wishlistItems.length
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

// Custom hook to use the wishlist context
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  
  return context;
};

export default WishlistContext;
