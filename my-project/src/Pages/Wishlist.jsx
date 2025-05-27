import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaTrash, FaHeart } from 'react-icons/fa';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../hooks/useAuth';
import { luxuryTheme } from '../styles/luxuryTheme';
import PageTransition from '../components/PageTransition';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';

const Wishlist = () => {
  const { wishlistItems, loading, error, removeItem, moveItemToCart, clearItems } = useWishlist();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/wishlist' } });
    }
  }, [isAuthenticated, navigate]);

  const handleRemoveItem = async (productId) => {
    await removeItem(productId);
  };

  const handleMoveToCart = async (productId) => {
    await moveItemToCart(productId);
  };

  const handleClearWishlist = async () => {
    setIsDeleting(true);
    await clearItems();
    setIsDeleting(false);
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="container mx-auto px-4 py-16 min-h-screen">
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        </div>
      </PageTransition>
    );
  }

  if (error) {
    return (
      <PageTransition>
        <div className="container mx-auto px-4 py-16 min-h-screen">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 my-8">
            <h2 className="text-xl font-semibold mb-2 text-red-400">Error Loading Wishlist</h2>
            <p className="text-white/80">{error}</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <PageTransition>
        <div className="container mx-auto px-4 py-16 min-h-screen">
          <EmptyState
            icon={<FaHeart className="text-4xl text-gold/50" />}
            title="Your Wishlist is Empty"
            message="Save items you love for later by adding them to your wishlist."
            actionText="Explore Products"
            actionLink="/products"
          />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-16 min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <h1 
            className="text-3xl font-bold text-white"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
          >
            My Wishlist
          </h1>
          <button
            onClick={handleClearWishlist}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-white rounded-md transition-colors duration-300 flex items-center"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
          >
            {isDeleting ? 'Clearing...' : (
              <>
                <FaTrash className="mr-2" />
                Clear Wishlist
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <motion.div
              key={item._id || item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-[#111111] border border-gold/20 rounded-lg overflow-hidden shadow-xl hover:shadow-gold/10 transition-all duration-300"
            >
              <Link to={`/product/${item._id || item.id}`}>
                <div className="h-64 overflow-hidden relative">
                  <img
                    src={item.images && item.images.length > 0 ? item.images[0] : '/placeholder.jpg'}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  {item.discount > 0 && (
                    <div className="absolute top-2 right-2 bg-gold text-black text-xs font-bold px-2 py-1 rounded">
                      {item.discount}% OFF
                    </div>
                  )}
                </div>
              </Link>

              <div className="p-4">
                <Link to={`/product/${item._id || item.id}`}>
                  <h3 
                    className="text-lg font-semibold text-white mb-2 hover:text-gold transition-colors duration-300"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                  >
                    {item.name}
                  </h3>
                </Link>
                
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <p className="text-gold font-semibold">
                      ${item.price.toFixed(2)}
                    </p>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <p className="text-gray-400 text-sm line-through">
                        ${item.originalPrice.toFixed(2)}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleMoveToCart(item._id || item.id)}
                      className="p-2 bg-gold/20 hover:bg-gold/30 text-gold rounded-full transition-colors duration-300"
                      title="Add to Cart"
                    >
                      <FaShoppingCart />
                    </button>
                    <button
                      onClick={() => handleRemoveItem(item._id || item.id)}
                      className="p-2 bg-red-900/20 hover:bg-red-900/30 text-red-400 rounded-full transition-colors duration-300"
                      title="Remove from Wishlist"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                
                <div className="text-sm text-gray-400">
                  Added on {new Date(item.addedAt).toLocaleDateString()}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

export default Wishlist;
