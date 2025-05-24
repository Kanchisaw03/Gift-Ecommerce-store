import { createContext, useContext, useState, useMemo, useEffect } from "react";
import AuthContext from "./AuthContext";
import { toast } from "react-toastify";
import {
  getCart,
  addToCart as addToCartApi,
  updateCartItem as updateCartItemApi,
  removeFromCart as removeFromCartApi,
  clearCart as clearCartApi,
  syncCart as syncCartApi
} from "../services/api/cartService";

// Create context
const CartContext = createContext();

// Note: useCart hook is now defined in src/hooks/useCart.js

// Export the context as default
export default CartContext;

// Provider component
export const CartProvider = ({ children }) => {
  // Get auth context directly
  const authContext = useContext(AuthContext);
  const isAuthenticated = authContext?.isAuthenticated || false;
  const user = authContext?.user || null;
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Production-ready cart management

  // Fetch cart from API when user logs in
  useEffect(() => {
    const fetchCart = async () => {
      if (isAuthenticated) {
        setLoading(true);
        try {
          const response = await getCart();
          if (response && response.success && response.data) {
            setCartItems(response.data.items || []);
            // Clear local storage cart as we're now using the server cart
            localStorage.removeItem("cart");
          } else {
            // Initialize with empty cart if response is not as expected
            setCartItems([]);
          }
        } catch (err) {
          console.error("Error fetching cart:", err);
          setError("Failed to load your cart. Please try again.");
          toast.error("Failed to fetch cart");
          
          // Fallback to local cart if available
          const localCart = localStorage.getItem("cart");
          if (localCart) {
            try {
              setCartItems(JSON.parse(localCart));
            } catch (parseErr) {
              setCartItems([]);
              localStorage.setItem("cart", JSON.stringify([]));
            }
          } else {
            // Initialize with empty cart
            setCartItems([]);
            localStorage.setItem("cart", JSON.stringify([]));
          }
        } finally {
          setLoading(false);
        }
      } else {
        // For non-authenticated users, use local storage
        const localCart = localStorage.getItem("cart");
        if (localCart) {
          try {
            setCartItems(JSON.parse(localCart));
          } catch (parseErr) {
            setCartItems([]);
            localStorage.setItem("cart", JSON.stringify([]));
          }
        }
      }
    };

    fetchCart();
  }, [isAuthenticated]);

  // Sync local cart to server when user logs in
  useEffect(() => {
    const syncCartToServer = async () => {
      // Only sync if user just logged in and we have local cart items
      if (isAuthenticated && user && cartItems.length > 0 && localStorage.getItem("cart")) {
        setLoading(true);
        try {
          console.log('Syncing local cart to server:', cartItems);
          
          // Ensure cart items have all necessary properties for sync
          const formattedCartItems = cartItems.map(item => ({
            id: item._id || item.id,
            _id: item._id || item.id,
            name: item.name || 'Unknown Product',
            price: parseFloat(item.price) || 0,
            quantity: parseInt(item.quantity) || 1,
            image: item.image || item.images?.[0]?.url || '/assets/images/product-placeholder.jpg',
            // Include any other properties that might be useful for product lookup
            category: item.category,
            seller: item.seller,
            // Add any additional identifiers that might help with product matching
            sku: item.sku,
            brand: item.brand,
            description: item.description
          }));
          
          console.log('Formatted cart items for sync:', formattedCartItems);
          
          // Sync local cart to server
          const syncResponse = await syncCartApi(formattedCartItems);
          
          if (syncResponse && syncResponse.success) {
            // Check if there were any invalid products that couldn't be synced
            if (syncResponse.invalidProducts && syncResponse.invalidProducts.length > 0) {
              console.log('Some products could not be synced:', syncResponse.invalidProducts);
              
              // Show warning to user about invalid products
              toast.warning(
                `Some items in your cart were removed because they no longer exist: ${syncResponse.invalidProducts
                  .map(p => p.name)
                  .join(', ')}`
              );
              
              // Clean up local cart by removing invalid products
              const validProductIds = syncResponse.validProducts.map(p => p.id);
              const cleanedCartItems = cartItems.filter(item => {
                const itemId = item._id || item.id;
                return validProductIds.includes(itemId);
              });
              
              // Update local storage with cleaned cart
              localStorage.setItem("cart", JSON.stringify(cleanedCartItems));
            }
            
            // After successful sync, fetch the updated cart from server
            try {
              const response = await getCart();
              if (response && response.success && response.data) {
                setCartItems(response.data.items || []);
                // Clear local storage cart as we're now using the server cart
                localStorage.removeItem("cart");
                toast.success(syncResponse.message || "Your cart has been synced");
              }
            } catch (fetchErr) {
              console.error("Error fetching cart after sync:", fetchErr);
              // Keep using the local cart if fetch fails after sync
              toast.warning("Cart synced but couldn't refresh. Some items may be outdated.");
            }
          } else {
            // If sync response is not successful, keep using local cart
            console.error("Cart sync returned unsuccessful response", syncResponse);
            toast.error(syncResponse?.message || "Failed to sync your cart");
          }
        } catch (err) {
          console.error("Error syncing cart:", err);
          toast.error(err?.response?.data?.message || "Failed to sync your cart");
          
          // Keep the local cart in localStorage if sync fails
          localStorage.setItem("cart", JSON.stringify(cartItems));
        } finally {
          setLoading(false);
        }
      }
    };

    syncCartToServer();
  }, [isAuthenticated, user, cartItems]);

  // Sync to localStorage only for non-authenticated users
  useEffect(() => {
    if (!isAuthenticated && cartItems.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);

  const addToCart = async (product, quantity = 1) => {
    // Validate inputs
    if (!product || !product._id && !product.id) {
      toast.error("Invalid product");
      return;
    }
    
    if (quantity <= 0) {
      toast.error("Quantity must be greater than zero");
      return;
    }
    
    if (isAuthenticated) {
      // For logged-in users, use the API
      setLoading(true);
      try {
        const response = await addToCartApi({
          productId: product._id || product.id,
          quantity
        });
        
        if (response && response.success && response.data) {
          setCartItems(response.data.items || []);
          toast.success("Item added to cart");
        } else {
          throw new Error("Failed to add item to cart");
        }
      } catch (err) {
        console.error("Error adding to cart:", err);
        const errorMessage = err.response?.data?.message || err.message || "Failed to add item to cart";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    } else {
      // For non-logged-in users, use local state
      try {
        setCartItems((prev) => {
          const productId = product._id || product.id;
          const exists = prev.find((item) => (item._id || item.id) === productId);
          
          if (exists) {
            return prev.map((item) =>
              (item._id || item.id) === productId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            return [...prev, { ...product, quantity }];
          }
        });
        
        // Save to localStorage
        setTimeout(() => {
          localStorage.setItem("cart", JSON.stringify(cartItems));
        }, 0);
        
        toast.success("Item added to cart");
      } catch (err) {
        console.error("Error adding to local cart:", err);
        toast.error("Failed to add item to cart");
      }
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    // Validate inputs
    if (!itemId) {
      toast.error("Invalid item ID");
      return;
    }
    
    if (quantity <= 0) {
      // If quantity is 0 or negative, remove the item instead
      return removeFromCart(itemId);
    }
    
    if (isAuthenticated) {
      // For logged-in users, use the API
      setLoading(true);
      try {
        const response = await updateCartItemApi(itemId, { quantity });
        if (response && response.success && response.data) {
          setCartItems(response.data.items || []);
          toast.success("Cart updated");
        } else {
          throw new Error("Failed to update cart");
        }
      } catch (err) {
        console.error("Error updating cart item:", err);
        const errorMessage = err.response?.data?.message || err.message || "Failed to update cart item";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    } else {
      // For non-logged-in users, use local state
      try {
        setCartItems((prev) =>
          prev.map((item) =>
            (item._id || item.id) === itemId ? { ...item, quantity } : item
          )
        );
        
        // Save to localStorage
        setTimeout(() => {
          localStorage.setItem("cart", JSON.stringify(cartItems));
        }, 0);
        
        toast.success("Cart updated");
      } catch (err) {
        console.error("Error updating local cart:", err);
        toast.error("Failed to update cart");
      }
    }
  };

  const removeFromCart = async (itemId) => {
    // Validate input
    if (!itemId) {
      toast.error("Invalid item ID");
      return;
    }
    
    if (isAuthenticated) {
      // For logged-in users, use the API
      setLoading(true);
      try {
        const response = await removeFromCartApi(itemId);
        if (response && response.success && response.data) {
          setCartItems(response.data.items || []);
          toast.success("Item removed from cart");
        } else {
          throw new Error("Failed to remove item from cart");
        }
      } catch (err) {
        console.error("Error removing from cart:", err);
        const errorMessage = err.response?.data?.message || err.message || "Failed to remove item from cart";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    } else {
      // For non-logged-in users, use local state
      try {
        setCartItems((prev) => prev.filter((item) => (item._id || item.id) !== itemId));
        
        // Save to localStorage
        setTimeout(() => {
          localStorage.setItem("cart", JSON.stringify(cartItems));
        }, 0);
        
        toast.success("Item removed from cart");
      } catch (err) {
        console.error("Error removing from local cart:", err);
        toast.error("Failed to remove item from cart");
      }
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      // For logged-in users, use the API
      setLoading(true);
      try {
        const response = await clearCartApi();
        if (response && response.success) {
          setCartItems([]);
          toast.success("Cart cleared");
        } else {
          throw new Error("Failed to clear cart");
        }
      } catch (err) {
        console.error("Error clearing cart:", err);
        const errorMessage = err.response?.data?.message || err.message || "Failed to clear cart";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    } else {
      // For non-logged-in users, use local state
      try {
        setCartItems([]);
        localStorage.removeItem("cart");
        toast.success("Cart cleared");
      } catch (err) {
        console.error("Error clearing local cart:", err);
        toast.error("Failed to clear cart");
      }
    }
  };

  const total = useMemo(() => {
    return cartItems.reduce(
      (acc, item) => {
        const price = item.price || 0;
        const quantity = item.quantity || 0;
        acc.price += price * quantity;
        acc.quantity += quantity;
        return acc;
      },
      { price: 0, quantity: 0 }
    );
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

