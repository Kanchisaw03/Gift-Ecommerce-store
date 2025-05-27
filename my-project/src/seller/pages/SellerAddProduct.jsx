import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { luxuryTheme } from '../../styles/luxuryTheme';
import DashboardLayout from '../../shared/components/DashboardLayout';
import { createProduct, getCategories } from '../../services/api/productService';
import { toast } from 'react-toastify';

const SellerAddProduct = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    salePrice: '',
    category: '',
    stock: '',
    shippingTime: '3-5',
    tags: '',
    images: []
  });
  const [errors, setErrors] = useState({});
  const [previewImages, setPreviewImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await getCategories();
        
        // Check if we got a valid response with categories
        if (response && response.success && response.data && Array.isArray(response.data.data)) {
          console.log('Categories fetched successfully:', response.data.data);
          setCategories(response.data.data);
        } else if (response && response.data && Array.isArray(response.data)) {
          // Alternative response format
          console.log('Categories fetched (alternative format):', response.data);
          setCategories(response.data);
        } else {
          console.error('Failed to fetch categories or invalid format:', response);
          toast.error('Failed to load categories. Please contact support.');
          
          // Create a temporary category for testing purposes only
          // In a production environment, you would want to handle this differently
          const tempCategoryId = '645a9f8b0c5d2a1f1c9f1234'; // This is a fake MongoDB ObjectId format for testing
          setCategories([
            { _id: tempCategoryId, name: 'Temporary Category' }
          ]);
          
          // Set the form data to use this temporary category
          setFormData(prev => ({
            ...prev,
            category: tempCategoryId
          }));
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories. Please contact support.');
        
        // Create a temporary category for testing purposes only
        const tempCategoryId = '645a9f8b0c5d2a1f1c9f1234'; // This is a fake MongoDB ObjectId format for testing
        setCategories([
          { _id: tempCategoryId, name: 'Temporary Category' }
        ]);
        
        // Set the form data to use this temporary category
        setFormData(prev => ({
          ...prev,
          category: tempCategoryId
        }));
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const shippingOptions = [
    '1-2',
    '3-5',
    '5-7',
    '7-10',
    '10-14'
  ];

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === 'file') {
      return; // Handled by handleImageUpload
    }
    
    // Convert numeric inputs to numbers
    const processedValue = (name === 'price' || name === 'salePrice' || name === 'stock') 
      ? value === '' ? '' : parseFloat(value)
      : value;
    
    setFormData({
      ...formData,
      [name]: processedValue
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Create local URLs for preview and store the actual files for submission
    const newPreviewImages = files.map(file => URL.createObjectURL(file));
    
    console.log(`Adding ${files.length} new images`);
    
    setPreviewImages([...previewImages, ...newPreviewImages]);
    setFormData({
      ...formData,
      images: [...formData.images, ...files]
    });
    
    // Clear any image-related errors
    if (errors.images) {
      setErrors({
        ...errors,
        images: ''
      });
    }
  };

  const removeImage = (index) => {
    const updatedPreviews = [...previewImages];
    const updatedImages = [...formData.images];
    
    updatedPreviews.splice(index, 1);
    updatedImages.splice(index, 1);
    
    setPreviewImages(updatedPreviews);
    setFormData({
      ...formData,
      images: updatedImages
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Valid price is required';
    }
    
    if (formData.salePrice && (formData.salePrice <= 0 || formData.salePrice >= formData.price)) {
      newErrors.salePrice = 'Sale price must be less than regular price';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (formData.stock === '' || formData.stock < 0) {
      newErrors.stock = 'Valid stock quantity is required';
    }
    
    if (formData.images.length === 0) {
      newErrors.images = 'At least one product image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare form data for API submission
      const productFormData = new FormData();
      
      // Add text fields
      productFormData.append('name', formData.name);
      productFormData.append('description', formData.description);
      productFormData.append('price', formData.price);
      if (formData.salePrice) {
        productFormData.append('salePrice', formData.salePrice);
      }
      
      // Log the category ID for debugging
      console.log('Category ID being sent:', formData.category);
      productFormData.append('category', formData.category);
      
      productFormData.append('stock', formData.stock);
      productFormData.append('shippingTime', formData.shippingTime);
      
      // Add tags if any
      if (formData.tags) {
        const tagsArray = formData.tags.split(',').map(tag => tag.trim());
        productFormData.append('tags', JSON.stringify(tagsArray));
      }
      
      // Add images
      if (formData.images.length > 0) {
        console.log(`Adding ${formData.images.length} images to FormData`);
        formData.images.forEach((image, index) => {
          console.log(`Adding image ${index + 1}:`, image.name);
          productFormData.append('images', image);
        });
      } else {
        console.warn('No images to upload');
      }
      
      console.log('Submitting product data to API');
      
      // Call the real API to create the product
      const response = await createProduct(productFormData);
      
      console.log('Product created successfully:', response);
      toast.success('Product added successfully!');
      
      // Success! Redirect to products page
      navigate('/seller/products');
    } catch (error) {
      console.error('Error adding product:', error);
      
      // More detailed error logging
      if (error.response) {
        console.error('Error response:', error.response);
        console.error('Error status:', error.response.status);
        console.error('Error data:', error.response.data);
      }
      
      toast.error(`Failed to add product: ${error.message || 'Unknown error'}`);
      setErrors({
        ...errors,
        submit: error.message || 'Failed to add product. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <DashboardLayout>
      <motion.div
        initial="initial"
        animate="in"
        exit="exit"
        variants={pageVariants}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-playfair font-bold">Add New Product</h1>
          <button
            onClick={() => navigate('/seller/products')}
            className="px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-[#121212] rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-playfair font-semibold mb-6 pb-2 border-b border-gray-800">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">Product Name*</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full bg-[#1E1E1E] border ${errors.name ? 'border-red-500' : 'border-gray-700'} rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]`}
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">Description*</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  className={`w-full bg-[#1E1E1E] border ${errors.description ? 'border-red-500' : 'border-gray-700'} rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]`}
                ></textarea>
                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Regular Price ($)*</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={`w-full bg-[#1E1E1E] border ${errors.price ? 'border-red-500' : 'border-gray-700'} rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]`}
                />
                {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Sale Price ($)</label>
                <input
                  type="number"
                  name="salePrice"
                  value={formData.salePrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={`w-full bg-[#1E1E1E] border ${errors.salePrice ? 'border-red-500' : 'border-gray-700'} rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]`}
                />
                {errors.salePrice && <p className="mt-1 text-sm text-red-500">{errors.salePrice}</p>}
                <p className="mt-1 text-xs text-gray-400">Leave empty if not on sale</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Category*</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={loadingCategories}
                  className={`w-full bg-[#1E1E1E] border ${errors.category ? 'border-red-500' : 'border-gray-700'} rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]`}
                >
                  <option value="">Select Category</option>
                  {loadingCategories ? (
                    <option value="" disabled>Loading categories...</option>
                  ) : (
                    categories.map((category) => (
                      <option key={category._id} value={category._id}>{category.name}</option>
                    ))
                  )}
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Stock Quantity*</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  className={`w-full bg-[#1E1E1E] border ${errors.stock ? 'border-red-500' : 'border-gray-700'} rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]`}
                />
                {errors.stock && <p className="mt-1 text-sm text-red-500">{errors.stock}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Shipping Time (days)</label>
                <select
                  name="shippingTime"
                  value={formData.shippingTime}
                  onChange={handleChange}
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                >
                  {shippingOptions.map((option) => (
                    <option key={option} value={option}>{option} days</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Tags</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="Separate with commas"
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
                <p className="mt-1 text-xs text-gray-400">E.g. luxury, gift, handmade</p>
              </div>
            </div>
          </div>

          {/* Product Images */}
          <div className="bg-[#121212] rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-playfair font-semibold mb-6 pb-2 border-b border-gray-800">Product Images*</h2>
            
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                {previewImages.map((src, index) => (
                  <div key={index} className="relative w-24 h-24 rounded-md overflow-hidden border border-gray-700">
                    <img src={src} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-900 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-800"
                    >
                      ×
                    </button>
                  </div>
                ))}
                
                <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-700 rounded-md cursor-pointer hover:border-[#D4AF37] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="mt-2 text-xs text-gray-400">Add Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              
              {errors.images && <p className="mt-1 text-sm text-red-500">{errors.images}</p>}
              <p className="text-xs text-gray-400">Upload high-quality images of your product. First image will be used as the main image.</p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            {errors.submit && (
              <p className="text-sm text-red-500 mr-4 self-center">{errors.submit}</p>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-8 py-3 bg-[#D4AF37] text-black font-medium rounded-md hover:bg-[#C4A137] transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding Product...
                </span>
              ) : 'Add Product'}
            </button>
          </div>
        </form>
      </motion.div>
    </DashboardLayout>
  );
};

export default SellerAddProduct;
