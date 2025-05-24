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
  
  // DEVELOPMENT MODE flag - set to false before production deployment
  // TODO: Remove this when moving to production
  const DEVELOPMENT_MODE = true;

  // Fetch cart from API when user logs in
  useEffect(() => {
    const fetchCart = async () => {
      if (isAuthenticated) {
        setLoading(true);
        try {
          // In development mode, handle API failures gracefully
          if (DEVELOPMENT_MODE) {
            try {
              const response = await getCart();
              if (response.data && response.data.items) {
                setCartItems(response.data.items);
                // Clear local storage cart as we're now using the server cart
                localStorage.removeItem("cart");
              }
            } catch (err) {
              console.log('Development mode: Using local cart data');
              // In development mode, continue with local cart if API fails
              const localCart = localStorage.getItem("cart");
              if (localCart) {
                setCartItems(JSON.parse(localCart));
              } else {
                // Initialize with empty cart
                setCartItems([]);
                localStorage.setItem("cart", JSON.stringify([]));
              }
            }
          } else {
            // Production mode - normal flow
            const response = await getCart();
            if (response.data && response.data.items) {
              setCartItems(response.data.items);
              // Clear local storage cart as we're now using the server cart
              localStorage.removeItem("cart");
            }
          }
        } catch (err) {
          console.error("Error fetching cart:", err);
          setError("Failed to load your cart. Please try again.");
          if (!DEVELOPMENT_MODE) {
            toast.error("Failed to fetch cart");
          }
        } finally {
          setLoading(false);
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
          // In development mode, handle potential API failures gracefully
          if (DEVELOPMENT_MODE) {
            try {
              await syncCartApi(cartItems);
            } catch (syncErr) {
              console.log('Development mode: Using local cart instead of syncing to server');
              // Continue with local cart in development mode
              localStorage.setItem("cart", JSON.stringify(cartItems));
              return;
            }
          } else {
            await syncCartApi(cartItems);
          }
          
          // After successful sync, fetch the updated cart from server
          try {
            const response = await getCart();
            if (response.data && response.data.items) {
              setCartItems(response.data.items);
              // Clear local storage cart as we're now using the server cart
              localStorage.removeItem("cart");
              toast.success("Your cart has been synced");
            }
          } catch (fetchErr) {
            if (DEVELOPMENT_MODE) {
              console.log('Development mode: Using local cart after sync');
              // Continue with local cart in development mode
              return;
            } else {
              throw fetchErr;
            }
          }
        } catch (err) {
          console.error("Error syncing cart:", err);
          if (!DEVELOPMENT_MODE) {
            toast.error("Failed to sync your cart");
          }
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
    if (isAuthenticated) {
      // For logged-in users, use the API
      setLoading(true);
      try {
        const response = await addToCartApi({
          productId: product._id || product.id,
          quantity
        });
        if (response.data && response.data.items) {
          setCartItems(response.data.items);
          toast.success("Item added to cart");
        }
      } catch (err) {
        console.error("Error adding to cart:", err);
        toast.error("Failed to add item to cart");
      } finally {
        setLoading(false);
      }
    } else {
      // For non-logged-in users, use local state
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
      toast.success("Item added to cart");
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    if (isAuthenticated) {
      // For logged-in users, use the API
      setLoading(true);
      try {
        const response = await updateCartItemApi(itemId, { quantity });
        if (response.data && response.data.items) {
          setCartItems(response.data.items);
        }
      } catch (err) {
        console.error("Error updating cart item:", err);
        toast.error("Failed to update cart item");
      } finally {
        setLoading(false);
      }
    } else {
      // For non-logged-in users, use local state
      setCartItems((prev) =>
        prev.map((item) =>
          (item._id || item.id) === itemId ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeFromCart = async (itemId) => {
    if (isAuthenticated) {
      // For logged-in users, use the API
      setLoading(true);
      try {
        const response = await removeFromCartApi(itemId);
        if (response.data && response.data.items) {
          setCartItems(response.data.items);
          toast.success("Item removed from cart");
        }
      } catch (err) {
        console.error("Error removing from cart:", err);
        toast.error("Failed to remove item from cart");
      } finally {
        setLoading(false);
      }
    } else {
      // For non-logged-in users, use local state
      setCartItems((prev) => prev.filter((item) => (item._id || item.id) !== itemId));
      toast.success("Item removed from cart");
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      // For logged-in users, use the API
      setLoading(true);
      try {
        await clearCartApi();
        setCartItems([]);
        toast.success("Cart cleared");
      } catch (err) {
        console.error("Error clearing cart:", err);
        toast.error("Failed to clear cart");
      } finally {
        setLoading(false);
      }
    } else {
      // For non-logged-in users, use local state
      setCartItems([]);
      localStorage.removeItem("cart");
      toast.success("Cart cleared");
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

