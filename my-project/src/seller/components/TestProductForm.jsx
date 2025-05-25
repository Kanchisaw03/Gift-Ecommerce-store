import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Simple test form for product creation
const TestProductForm = () => {
  const [formData, setFormData] = useState({
    name: 'Test Product',
    description: 'This is a test product description that is long enough to pass validation.',
    price: '99.99',
    stock: '10',
    category: '64f5b3d5e85f95bd2f8a2c59' // Replace with a valid category ID from your database
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Direct API call without using any service
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        'http://localhost:5000/api/products', 
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setResult(response.data);
      toast.success('Product created successfully!');
      console.log('Product created:', response.data);
    } catch (error) {
      console.error('Error creating product:', error);
      setResult(error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto bg-gray-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-white">Test Product Creation</h2>
      
      <form onSubmit={handleSubmit}>
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Test Product'}
        </button>
      </form>
      
      {result && (
        <div className="mt-4 p-4 bg-gray-800 rounded overflow-auto max-h-60">
          <pre className="text-green-400 text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TestProductForm;
