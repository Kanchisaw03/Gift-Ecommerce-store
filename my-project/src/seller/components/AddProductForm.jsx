import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { luxuryTheme } from '../../styles/luxuryTheme';

// Mock categories for the dropdown
const productCategories = [
  'Watches',
  'Jewelry',
  'Accessories',
  'Fragrances',
  'Home Decor',
  'Leather Goods',
  'Apparel',
  'Gifts'
];

const AddProductForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    stock: '',
    description: '',
    images: []
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState([]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 0) {
      // Create preview URLs for the images
      const newImagePreview = files.map(file => URL.createObjectURL(file));
      
      setImagePreview([...imagePreview, ...newImagePreview]);
      setFormData({
        ...formData,
        images: [...formData.images, ...files]
      });
      
      // Clear error when user uploads images
      if (errors.images) {
        setErrors({
          ...errors,
          images: ''
        });
      }
    }
  };

  // Remove image from preview
  const removeImage = (index) => {
    const newImagePreview = [...imagePreview];
    const newImages = [...formData.images];
    
    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(newImagePreview[index]);
    
    newImagePreview.splice(index, 1);
    newImages.splice(index, 1);
    
    setImagePreview(newImagePreview);
    setFormData({
      ...formData,
      images: newImages
    });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    // Price validation
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    // Category validation
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    // Stock validation
    if (!formData.stock) {
      newErrors.stock = 'Stock quantity is required';
    } else if (isNaN(formData.stock) || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Stock must be a non-negative number';
    }
    
    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }
    
    // Images validation
    if (formData.images.length === 0) {
      newErrors.images = 'At least one image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      
      // In a real app, you would upload images to a server and get URLs back
      // For now, we'll simulate this process
      
      // Create a new product object with image URLs
      const newProduct = {
        ...formData,
        // In a real app, these would be URLs from your server
        imageUrls: imagePreview
      };
      
      // Call the onSubmit callback
      if (onSubmit) {
        await onSubmit(newProduct);
      }
      
      // Reset form
      setFormData({
        name: '',
        price: '',
        category: '',
        stock: '',
        description: '',
        images: []
      });
      setImagePreview([]);
    } catch (error) {
      console.error('Error adding product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-neutral-900 border border-gold/30 shadow-xl rounded-sm p-8"
      style={{ boxShadow: luxuryTheme.shadows.lg + ', ' + luxuryTheme.shadows.goldInset }}
    >
      <h2 
        className="text-xl font-bold text-white mb-6"
        style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
      >
        Add New Product
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Product Name */}
          <div>
            <label 
              htmlFor="name" 
              className="block text-sm font-medium text-gray-300 mb-2"
              style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
            >
              Product Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-black/20 border ${
                errors.name ? 'border-red-500' : 'border-gold/30'
              } focus:outline-none focus:border-gold text-white`}
              style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>
          
          {/* Price */}
          <div>
            <label 
              htmlFor="price" 
              className="block text-sm font-medium text-gray-300 mb-2"
              style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
            >
              Price ($)
            </label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-black/20 border ${
                errors.price ? 'border-red-500' : 'border-gold/30'
              } focus:outline-none focus:border-gold text-white`}
              style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-500">{errors.price}</p>
            )}
          </div>
          
          {/* Category */}
          <div>
            <label 
              htmlFor="category" 
              className="block text-sm font-medium text-gray-300 mb-2"
              style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-black/20 border ${
                errors.category ? 'border-red-500' : 'border-gold/30'
              } focus:outline-none focus:border-gold text-white`}
              style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
            >
              <option value="">Select a category</option>
              {productCategories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-500">{errors.category}</p>
            )}
          </div>
          
          {/* Stock */}
          <div>
            <label 
              htmlFor="stock" 
              className="block text-sm font-medium text-gray-300 mb-2"
              style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
            >
              Stock Quantity
            </label>
            <input
              id="stock"
              name="stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-black/20 border ${
                errors.stock ? 'border-red-500' : 'border-gold/30'
              } focus:outline-none focus:border-gold text-white`}
              style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
            />
            {errors.stock && (
              <p className="mt-1 text-sm text-red-500">{errors.stock}</p>
            )}
          </div>
        </div>
        
        {/* Description */}
        <div className="mb-6">
          <label 
            htmlFor="description" 
            className="block text-sm font-medium text-gray-300 mb-2"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-black/20 border ${
              errors.description ? 'border-red-500' : 'border-gold/30'
            } focus:outline-none focus:border-gold text-white`}
            style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
          ></textarea>
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description}</p>
          )}
        </div>
        
        {/* Image Upload */}
        <div className="mb-6">
          <label 
            className="block text-sm font-medium text-gray-300 mb-2"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
          >
            Product Images
          </label>
          
          <div className={`border-2 border-dashed ${
            errors.images ? 'border-red-500' : 'border-gold/30'
          } p-6 text-center`}>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label 
              htmlFor="image-upload"
              className="cursor-pointer"
            >
              <svg className="mx-auto h-12 w-12 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p 
                className="mt-2 text-sm text-gray-400"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                Click to upload images
              </p>
              <p 
                className="mt-1 text-xs text-gray-500"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                PNG, JPG, GIF up to 5MB
              </p>
            </label>
          </div>
          
          {errors.images && (
            <p className="mt-1 text-sm text-red-500">{errors.images}</p>
          )}
          
          {/* Image Preview */}
          {imagePreview.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {imagePreview.map((src, index) => (
                <div key={index} className="relative">
                  <img 
                    src={src} 
                    alt={`Preview ${index + 1}`} 
                    className="h-24 w-24 object-cover border border-gold/30"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 -mt-2 -mr-2 bg-black rounded-full p-1 text-red-500 hover:text-red-700"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gold/30 text-gold hover:bg-gold/10 transition-all duration-300"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
          >
            Cancel
          </button>
          
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-gold text-black hover:bg-gold-light transition-all duration-300"
            style={{ 
              fontFamily: luxuryTheme.typography.fontFamily.body,
              letterSpacing: '1px',
              boxShadow: luxuryTheme.shadows.md
            }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? (
              <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Add Product'
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddProductForm;
