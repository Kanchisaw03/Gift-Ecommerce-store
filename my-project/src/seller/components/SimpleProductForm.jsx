import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../../services/api/axiosConfig';
import { FiUpload, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const SimpleProductForm = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState([]);
  const [formData, setFormData] = useState({
    name: 'Test Luxury Product',
    description: 'This is a test luxury product with premium materials and exclusive design. It features high-quality craftsmanship and attention to detail.',
    price: '199.99',
    stock: '10',
    category: '',
    isOnSale: false,
    isFeatured: true,
    tags: 'luxury,premium,exclusive',
    images: []
  });

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setError(null);
        const response = await axiosInstance.get('/categories');
        
        if (response.data && response.data.data && Array.isArray(response.data.data)) {
          setCategories(response.data.data);
          if (response.data.data.length > 0) {
            setFormData(prev => ({
              ...prev,
              category: response.data.data[0]._id
            }));
          }
        } else {
          console.warn('Unexpected categories response format:', response.data);
          setError('Invalid category data received from server');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories: ' + (error.response?.data?.message || error.message));
        toast.error('Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    // Validate form data
    if (!formData.name || formData.name.trim().length < 3) {
      setError('Product name must be at least 3 characters');
      setSubmitting(false);
      return;
    }

    if (!formData.description || formData.description.trim().length < 20) {
      setError('Product description must be at least 20 characters');
      setSubmitting(false);
      return;
    }

    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      setError('Product price must be a valid number greater than 0');
      setSubmitting(false);
      return;
    }

    if (!formData.category) {
      setError('Please select a category');
      setSubmitting(false);
      return;
    }

    try {
      console.log('Submitting product data:', formData);
      
      // Create FormData object for file uploads
      const productFormData = new FormData();
      
      // Add all form fields to FormData
      Object.keys(formData).forEach(key => {
        if (key === 'images') {
          // Skip images array, we'll add files individually
          return;
        } else if (typeof formData[key] === 'boolean') {
          // Convert boolean values to strings
          productFormData.append(key, formData[key].toString());
        } else if (formData[key] !== null && formData[key] !== undefined && formData[key] !== '') {
          // Only add non-empty values
          productFormData.append(key, formData[key]);
        }
      });
      
      // Add images to FormData if any
      if (formData.images.length > 0) {
        console.log(`Adding ${formData.images.length} image files to form data`);
        formData.images.forEach(file => {
          productFormData.append('images', file);
        });
      }

      // Log the FormData contents (for debugging)
      console.log('FormData entries:');
      for (let pair of productFormData.entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? `File: ${pair[1].name} (${pair[1].type})` : pair[1]));
      }

      // Send the request directly with axios
      const response = await axiosInstance.post('/products', productFormData, {
        headers: {
          // Let the browser set the content type with proper boundary for FormData
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('Product created successfully:', response.data);
      setSuccess(true);
      toast.success('Product created successfully!');
      
      // Navigate back to products list after a short delay
      setTimeout(() => {
        navigate('/seller/products');
      }, 2000);
    } catch (error) {
      console.error('Error creating product:', error);
      setError(error.response?.data?.message || 'Failed to create product');
      toast.error(error.response?.data?.message || 'Failed to create product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate files
    const validFiles = files.filter(file => {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`);
        return false;
      }
      
      return true;
    });
    
    if (validFiles.length === 0) return;
    
    // Create image previews
    const newPreviews = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setImagePreview(prev => [...prev, ...newPreviews]);
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...validFiles]
    }));
  };
  
  // Remove image from preview and form data
  const removeImage = (index) => {
    // Release object URL to prevent memory leaks
    URL.revokeObjectURL(imagePreview[index].preview);
    
    setImagePreview(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-6 text-white flex items-center">
        <span className="text-gold-400 mr-2">Luxury</span> Product Form
      </h2>
      
      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-md text-red-200 flex items-start">
          <FiAlertCircle className="text-red-400 mt-0.5 mr-2 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
      
      {/* Success message */}
      {success && (
        <div className="mb-4 p-3 bg-green-900/50 border border-green-500 rounded-md text-green-200 flex items-start">
          <FiCheckCircle className="text-green-400 mt-0.5 mr-2 flex-shrink-0" />
          <p>Product created successfully! Redirecting to products list...</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Basic Info Section */}
        <div className="mb-6 p-4 bg-gray-800/50 rounded-md border border-gray-700">
          <h3 className="text-lg font-medium mb-4 text-gold-400">Basic Information</h3>
          
          {/* Product Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-300">
              Product Name*
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
              disabled={submitting}
              placeholder="Enter product name"
            />
          </div>
          
          {/* Category Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-300">
              Category*
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
              disabled={submitting}
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Price and Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">
                Price*
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                disabled={submitting}
                step="0.01"
                min="0"
                placeholder="99.99"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">
                Stock*
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                disabled={submitting}
                min="0"
                placeholder="10"
              />
            </div>
          </div>
        </div>
        
        {/* Description Section */}
        <div className="mb-6 p-4 bg-gray-800/50 rounded-md border border-gray-700">
          <h3 className="text-lg font-medium mb-4 text-gold-400">Description</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-300">
              Product Description*
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white min-h-[100px]"
              disabled={submitting}
              placeholder="Enter detailed product description (min 20 characters)"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-300">
              Tags (comma separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={(e) => setFormData({...formData, tags: e.target.value})}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
              disabled={submitting}
              placeholder="luxury, premium, exclusive"
            />
          </div>
        </div>
        
        {/* Product Options */}
        <div className="mb-6 p-4 bg-gray-800/50 rounded-md border border-gray-700">
          <h3 className="text-lg font-medium mb-4 text-gold-400">Product Options</h3>
          
          <div className="flex flex-col space-y-3">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                className="w-4 h-4 text-gold-500 bg-gray-800 border-gray-700 rounded focus:ring-gold-500"
                disabled={submitting}
              />
              <span className="text-white">Featured Product</span>
            </label>
            
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="isOnSale"
                checked={formData.isOnSale}
                onChange={(e) => setFormData({...formData, isOnSale: e.target.checked})}
                className="w-4 h-4 text-gold-500 bg-gray-800 border-gray-700 rounded focus:ring-gold-500"
                disabled={submitting}
              />
              <span className="text-white">On Sale</span>
            </label>
          </div>
        </div>
        
        {/* Image Upload Section */}
        <div className="mb-6 p-4 bg-gray-800/50 rounded-md border border-gray-700">
          <h3 className="text-lg font-medium mb-4 text-gold-400">Product Images</h3>
          
          {/* Image upload dropzone */}
          <label
            htmlFor="images"
            className="flex flex-col justify-center items-center px-4 py-6 bg-gray-800 border-2 border-dashed border-gray-600 rounded-md cursor-pointer hover:border-gold-400 transition-colors"
          >
            <div className="space-y-1 text-center">
              <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-400">
                <span className="relative font-medium text-gold-400 hover:text-gold-300">
                  Upload images
                </span>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
            <input
              id="images"
              type="file"
              name="images"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              disabled={submitting}
            />
          </label>
          
          {/* Image previews */}
          {imagePreview.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {imagePreview.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image.preview}
                    alt={`Preview ${index}`}
                    className="h-24 w-full object-cover rounded-md border border-gray-700"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    disabled={submitting}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full px-4 py-3 bg-gradient-to-r from-gold-600 to-gold-400 text-gray-900 font-medium rounded-md hover:from-gold-500 hover:to-gold-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
        >
          {submitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Product...
            </>
          ) : 'Create Luxury Product'}
        </button>
      </form>
    </div>
  );
};

export default SimpleProductForm;
