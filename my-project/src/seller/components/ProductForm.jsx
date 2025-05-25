import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../../services/api/axiosConfig';
import useApiForm from '../../hooks/useApiForm';
import useApi from '../../hooks/useApi';
import { createProduct, updateProduct, getProduct } from '../../services/api/productService';
import { getCategories } from '../../services/api/categoryService';

const ProductForm = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    salePrice: '',
    stock: '',
    category: '',
    tags: '',
    weight: '',
    dimensions: '',
    material: '',
    isOnSale: false,
    isFeatured: false
  });
  
  // State for form validation errors
  const [formErrors, setFormErrors] = useState({});
  
  // State for loading status
  const [submitting, setSubmitting] = useState(false);
  
  // State for categories
  const [categories, setCategories] = useState([]);
  
  // State for image files
  const [imageFiles, setImageFiles] = useState([]);
  
  // State for image previews
  const [imagePreviews, setImagePreviews] = useState([]);
  
  // API hooks for fetching data
  const categoriesApi = useApi(getCategories);
  const productApi = useApi(getProduct);
  
  // Validation rules for product form
  const validationRules = {
    name: {
      required: true,
      minLength: 3,
      maxLength: 100
    },
    description: {
      required: true,
      minLength: 20,
      maxLength: 2000
    },
    price: {
      required: true,
      custom: (value) => parseFloat(value) > 0,
      customMessage: 'Price must be greater than 0'
    },
    stock: {
      required: true,
      custom: (value) => parseInt(value) >= 0,
      customMessage: 'Stock cannot be negative'
    },
    category: {
      required: true
    }
  };
  
  // Update the initial form data state with additional fields
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      brand: '',
      sku: '',
      features: ''
    }));
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Validate form data
  const validateForm = () => {
    const errors = {};
    
    // Required fields
    if (!formData.name || formData.name.length < 3) {
      errors.name = 'Name is required and must be at least 3 characters';
    }
    
    if (!formData.description || formData.description.length < 20) {
      errors.description = 'Description is required and must be at least 20 characters';
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      errors.price = 'Price is required and must be greater than 0';
    }
    
    if (!formData.stock || parseInt(formData.stock) < 0) {
      errors.stock = 'Stock is required and cannot be negative';
    }
    
    if (!formData.category) {
      errors.category = 'Category is required';
    }
    
    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateForm();
    setFormErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setSubmitting(true);
    
    try {
      console.log('Starting product submission with data:', formData);
      
      // Create FormData for file upload
      const productFormData = new FormData();
      
      // Add all form fields to FormData
      Object.keys(formData).forEach(key => {
        // Convert boolean values to strings
        if (typeof formData[key] === 'boolean') {
          productFormData.append(key, formData[key].toString());
        } else if (formData[key] !== '') { // Only add non-empty values
          productFormData.append(key, formData[key]);
        }
      });
      
      // Add image files
      if (imageFiles && imageFiles.length > 0) {
        console.log(`Adding ${imageFiles.length} image files to form data`);
        imageFiles.forEach(file => {
          productFormData.append('images', file);
        });
      } else {
        console.log('No image files to upload');
      }
      
      // Log the FormData contents (for debugging)
      for (let pair of productFormData.entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
      }

      // Make direct API call with axios
      let response;
      if (isEdit && id) {
        console.log(`Updating product with ID: ${id}`);
        response = await axiosInstance.put(`/products/${id}`, productFormData);
      } else {
        console.log('Creating new product');
        response = await axiosInstance.post('/products', productFormData);
      }
      
      console.log('API response:', response.data);
      
      // Show success message
      toast.success(isEdit ? 'Product updated successfully' : 'Product created successfully');
      
      // Navigate back to products list after a short delay
      setTimeout(() => {
        navigate('/seller/products');
      }, 1500);
      
    } catch (error) {
      console.error('Error in product form submission:', error);
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesApi.execute();
        if (data) {
          setCategories(data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Fetch product data if in edit mode
  useEffect(() => {
    if (isEdit && id) {
      const fetchProduct = async () => {
        try {
          const data = await productApi.execute(id);
          if (data) {
            // Set form data from product
            setFormData({
              name: data.name || '',
              description: data.description || '',
              price: data.price || '',
              salePrice: data.salePrice || '',
              stock: data.stock || '',
              category: data.category?._id || data.category || '',
              brand: data.brand || '',
              sku: data.sku || '',
              weight: data.weight || '',
              dimensions: data.dimensions || '',
              material: data.material || '',
              features: data.features || '',
              isOnSale: data.isOnSale || false,
              isFeatured: data.isFeatured || false
            });
            
            // Set images if available
            if (data.images && data.images.length > 0) {
              setImages(data.images);
              setImagePreview(data.images.map(img => img.url));
            }
          }
        } catch (error) {
          console.error('Error fetching product:', error);
          toast.error('Failed to load product data');
        }
      };
      
      fetchProduct();
    }
  }, [isEdit, id]);
  
  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    console.log('Files selected:', files.map(f => f.name));
    
    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB max
      
      if (!isValidType) {
        toast.error(`Invalid file type: ${file.name}. Only JPEG, PNG, GIF, and WebP are allowed.`);
      }
      
      if (!isValidSize) {
        toast.error(`File too large: ${file.name}. Maximum size is 5MB.`);
      }
      
      return isValidType && isValidSize;
    });
    
    if (validFiles.length === 0) return;
    
    console.log('Valid files to upload:', validFiles.length);
    
    // Update state with valid files
    setImageFiles(prevFiles => [...prevFiles, ...validFiles]);
    
    // Create preview URLs
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
  };
  
  // Remove image from preview
  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  // Toggle checkbox fields is now handled by the main handleChange function
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-lg shadow-lg border border-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          {isEdit ? 'Edit Product' : 'Add New Product'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gold-400 mb-4">Basic Information</h3>
            
            {/* Product Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1 text-gray-300">
                Product Name*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-gray-800 border ${
                  formErrors.name ? 'border-red-500' : 'border-gray-700'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 text-white`}
                placeholder="Luxury Watch"
                disabled={submitting}
              />
              {formErrors.name && (
                <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
              )}
            </div>
            
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-1 text-gray-300">
                Category*
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-gray-800 border ${
                  formErrors.category ? 'border-red-500' : 'border-gray-700'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 text-white`}
                disabled={submitting}
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {formErrors.category && (
                <p className="mt-1 text-sm text-red-500">{formErrors.category}</p>
              )}
            </div>
            
            {/* Brand */}
            <div>
              <label htmlFor="brand" className="block text-sm font-medium mb-1 text-gray-300">
                Brand
              </label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 text-white"
                placeholder="Brand Name"
                disabled={submitting}
              />
            </div>
            
            {/* SKU */}
            <div>
              <label htmlFor="sku" className="block text-sm font-medium mb-1 text-gray-300">
                SKU
              </label>
              <input
                type="text"
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 text-white"
                placeholder="LUX-WATCH-001"
                disabled={submitting}
              />
            </div>
          </div>
          
          {/* Pricing & Inventory */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gold-400 mb-4">Pricing & Inventory</h3>
            
            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium mb-1 text-gray-300">
                Price*
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  $
                </span>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={`w-full pl-8 px-4 py-2 bg-gray-800 border ${
                    formErrors.price ? 'border-red-500' : 'border-gray-700'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 text-white`}
                  placeholder="0.00"
                  disabled={submitting}
                />
              </div>
              {formErrors.price && (
                <p className="mt-1 text-sm text-red-500">{formErrors.price}</p>
              )}
            </div>
            
            {/* Sale Price */}
            <div>
              <label htmlFor="salePrice" className="block text-sm font-medium mb-1 text-gray-300">
                Sale Price
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  $
                </span>
                <input
                  type="number"
                  id="salePrice"
                  name="salePrice"
                  value={formData.salePrice}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full pl-8 px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 text-white"
                  placeholder="0.00"
                  disabled={submitting}
                />
              </div>
            </div>
            
            {/* Stock */}
            <div>
              <label htmlFor="stock" className="block text-sm font-medium mb-1 text-gray-300">
                Stock*
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                className={`w-full px-4 py-2 bg-gray-800 border ${
                  formErrors.stock ? 'border-red-500' : 'border-gray-700'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 text-white`}
                placeholder="10"
                disabled={submitting}
              />
              {formErrors.stock && (
                <p className="mt-1 text-sm text-red-500">{formErrors.stock}</p>
              )}
            </div>
            
            {/* Checkboxes */}
            <div className="flex space-x-6 mt-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="isOnSale"
                  checked={formData.isOnSale}
                  onChange={handleChange}
                  className="form-checkbox text-gold-500 h-5 w-5 rounded focus:ring-gold-500"
                  disabled={submitting}
                />
                <span className="ml-2 text-gray-300">On Sale</span>
              </label>
              
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="form-checkbox text-gold-500 h-5 w-5 rounded focus:ring-gold-500"
                  disabled={submitting}
                />
                <span className="ml-2 text-gray-300">Featured</span>
              </label>
            </div>
          </div>
        </div>
        
        {/* Description */}
        <div className="mt-6">
          <label htmlFor="description" className="block text-sm font-medium mb-1 text-gray-300">
            Description*
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            className={`w-full px-4 py-2 bg-gray-800 border ${
              formErrors.description ? 'border-red-500' : 'border-gray-700'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 text-white`}
            placeholder="Detailed product description..."
            disabled={submitting}
          ></textarea>
          {formErrors.description && (
            <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>
          )}
        </div>
        
        {/* Additional Details */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="weight" className="block text-sm font-medium mb-1 text-gray-300">
              Weight
            </label>
            <input
              type="text"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 text-white"
              placeholder="e.g., 150g"
              disabled={submitting}
            />
          </div>
          
          <div>
            <label htmlFor="dimensions" className="block text-sm font-medium mb-1 text-gray-300">
              Dimensions
            </label>
            <input
              type="text"
              id="dimensions"
              name="dimensions"
              value={formData.dimensions}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 text-white"
              placeholder="e.g., 10 x 5 x 2 cm"
              disabled={submitting}
            />
          </div>
          
          <div>
            <label htmlFor="material" className="block text-sm font-medium mb-1 text-gray-300">
              Material
            </label>
            <input
              type="text"
              id="material"
              name="material"
              value={formData.material}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 text-white"
              placeholder="e.g., Stainless Steel, Leather"
              disabled={submitting}
            />
          </div>
          
          <div>
            <label htmlFor="features" className="block text-sm font-medium mb-1 text-gray-300">
              Features
            </label>
            <input
              type="text"
              id="features"
              name="features"
              value={formData.features}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 text-white"
              placeholder="e.g., Waterproof, Scratch-resistant"
              disabled={submitting}
            />
          </div>
        </div>
        
        {/* Images */}
        <div className="mt-6">
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Product Images
          </label>
          
          {/* Image Previews */}
          {imagePreview.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
              {imagePreview.map((src, index) => (
                <div key={index} className="relative group">
                  <img
                    src={src}
                    alt={`Preview ${index + 1}`}
                    className="h-32 w-32 object-cover rounded-md border border-gray-700"
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
          
          {/* Image Upload */}
          <div className="mt-2">
            <label
              htmlFor="images"
              className="flex justify-center items-center px-4 py-6 bg-gray-800 border-2 border-dashed border-gray-600 rounded-md cursor-pointer hover:border-gold-400 transition-colors"
            >
              <div className="space-y-1 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <div className="flex text-sm text-gray-400">
                  <span className="relative font-medium text-gold-400 hover:text-gold-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-gold-500">
                    Upload images
                  </span>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
              <input
                id="images"
                name="images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="sr-only"
                disabled={submitting}
              />
            </label>
          </div>
        </div>
        
        {/* Submit and Cancel Buttons */}
        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/seller/products')}
            className="px-6 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            disabled={submitting}
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-gold-600 hover:bg-gold-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isEdit ? 'Updating...' : 'Creating...'}
              </span>
            ) : (
              isEdit ? 'Update Product' : 'Create Product'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
