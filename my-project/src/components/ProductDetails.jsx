import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiHeart } from 'react-icons/fi';
import ProductImage from './ProductImage';
import enhancedLuxuryTheme from '../styles/enhancedLuxuryTheme';

const ProductDetails = ({ product }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Ensure we have an array of images, even if empty
  const productImages = product?.images?.length > 0 
    ? product.images 
    : product?.image 
      ? [{ url: product.image }] 
      : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images Section */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square w-full rounded-lg overflow-hidden">
            <ProductImage
              product={{ ...product, images: [productImages[selectedImageIndex]] }}
              className="w-full h-full"
              aspectRatio="1/1"
            />
          </div>

          {/* Thumbnail Gallery */}
          {productImages.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative aspect-square rounded-md overflow-hidden ${
                    selectedImageIndex === index 
                      ? 'ring-2 ring-gold-400' 
                      : 'ring-1 ring-gray-200'
                  }`}
                >
                  <ProductImage
                    product={{ ...product, images: [image] }}
                    className="w-full h-full"
                    showPlaceholder={false}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info Section */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gold-400">{product.name}</h1>
          <div className="flex items-center space-x-4">
            <span className="text-2xl font-semibold">${product.price}</span>
            {product.originalPrice && (
              <span className="text-lg line-through text-gray-400">
                ${product.originalPrice}
              </span>
            )}
          </div>

          <p className="text-gray-300">{product.description}</p>

          {/* Product Actions */}
          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-6 bg-gold-400 text-black rounded-lg flex items-center justify-center space-x-2 hover:bg-gold-500 transition-colors"
            >
              <FiShoppingBag className="w-5 h-5" />
              <span>Add to Cart</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-6 border border-gold-400 text-gold-400 rounded-lg flex items-center justify-center space-x-2 hover:bg-gold-400/10 transition-colors"
            >
              <FiHeart className="w-5 h-5" />
              <span>Add to Wishlist</span>
            </motion.button>
          </div>

          {/* Product Details */}
          {product.details && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gold-400">Product Details</h2>
              <ul className="space-y-2">
                {Object.entries(product.details).map(([key, value]) => (
                  <li key={key} className="flex">
                    <span className="w-1/3 text-gray-400">{key}:</span>
                    <span className="w-2/3 text-gray-200">{value}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
