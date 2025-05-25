import { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import useSocket from '../hooks/useSocket';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../services/api/productService';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const socket = useSocket();
  
  // Fetch all products
  const fetchProducts = async (filters = {}) => {
    setLoading(true);
    try {
      const response = await getProducts(filters);
      if (response && response.success) {
        setProducts(response.data || []);
        setFeaturedProducts((response.data || []).filter(product => product.featured));
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to fetch products');
      toast.error(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch single product
  const fetchProduct = async (id) => {
    setLoading(true);
    try {
      const data = await getProductById(id);
      setError(null);
      return data;
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err.message || 'Failed to fetch product');
      toast.error(err.message || 'Failed to fetch product');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Add product
  const addProduct = async (productData) => {
    setLoading(true);
    try {
      console.log('ProductContext: Adding product with data:', productData);
      const data = await createProduct(productData);
      console.log('ProductContext: Product added successfully:', data);
      // We don't update the state here as the Socket.IO event will handle it
      // But let's manually update the state in case the Socket.IO event doesn't fire
      setProducts(prevProducts => {
        const newProducts = [...prevProducts];
        if (data && data.data) {
          newProducts.unshift(data.data);
        }
        return newProducts;
      });
      setError(null);
      toast.success('Product added successfully');
      return data;
    } catch (err) {
      console.error('ProductContext: Error adding product:', err);
      setError(err.message || 'Failed to add product');
      toast.error(err.message || 'Failed to add product');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Update product
  const editProduct = async (id, productData) => {
    setLoading(true);
    try {
      const data = await updateProduct(id, productData);
      // We don't update the state here as the Socket.IO event will handle it
      setError(null);
      toast.success('Product updated successfully');
      return data;
    } catch (err) {
      console.error('Error updating product:', err);
      setError(err.message || 'Failed to update product');
      toast.error(err.message || 'Failed to update product');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Delete product
  const removeProduct = async (id) => {
    setLoading(true);
    try {
      await deleteProduct(id);
      // We don't update the state here as the Socket.IO event will handle it
      setError(null);
      toast.success('Product deleted successfully');
      return true;
    } catch (err) {
      console.error('Error deleting product:', err);
      setError(err.message || 'Failed to delete product');
      toast.error(err.message || 'Failed to delete product');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Initial fetch
  useEffect(() => {
    fetchProducts();
  }, []);
  
  // Socket.IO event listeners for real-time updates
  useEffect(() => {
    if (!socket) {
      console.log('Socket not available for event listeners');
      return;
    }
    
    console.log('Setting up Socket.IO event listeners');
    
    // Listen for welcome event to confirm connection
    socket.on('welcome', (data) => {
      console.log('Received welcome event from server:', data);
      toast.success('Connected to real-time updates');
    });
    
    // Listen for product created
    socket.on('productCreated', (product) => {
      console.log('Socket event received: productCreated', product);
      setProducts(prevProducts => {
        // Check if product already exists
        if (prevProducts.some(p => p._id === product._id)) {
          console.log('Product already exists in state, not adding again');
          return prevProducts;
        }
        console.log('Adding new product to state:', product.name);
        return [product, ...prevProducts];
      });
      
      // Update featured products if needed
      if (product.featured) {
        setFeaturedProducts(prevFeatured => {
          if (prevFeatured.some(p => p._id === product._id)) {
            return prevFeatured;
          }
          return [product, ...prevFeatured];
        });
      }
      
      toast.info(`New product added: ${product.name}`);
    });
    
    // Listen for product updated
    socket.on('productUpdated', (product) => {
      console.log('Socket event: productUpdated', product);
      setProducts(prevProducts => 
        prevProducts.map(p => p._id === product._id ? product : p)
      );
      
      setFeaturedProducts(prevFeatured => {
        // If product is featured, ensure it's in the featured list
        if (product.featured) {
          const exists = prevFeatured.some(p => p._id === product._id);
          if (exists) {
            return prevFeatured.map(p => p._id === product._id ? product : p);
          } else {
            return [...prevFeatured, product];
          }
        } else {
          // If not featured, remove from featured list
          return prevFeatured.filter(p => p._id !== product._id);
        }
      });
      
      toast.info(`Product updated: ${product.name}`);
    });
    
    // Listen for product deleted
    socket.on('productDeleted', (productId) => {
      console.log('Socket event: productDeleted', productId);
      setProducts(prevProducts => 
        prevProducts.filter(p => p._id !== productId)
      );
      
      setFeaturedProducts(prevFeatured => 
        prevFeatured.filter(p => p._id !== productId)
      );
      
      toast.info('A product has been removed');
    });
    
    return () => {
      // Clean up event listeners
      socket.off('productCreated');
      socket.off('productUpdated');
      socket.off('productDeleted');
    };
  }, [socket]);
  
  return (
    <ProductContext.Provider
      value={{
        products,
        featuredProducts,
        loading,
        error,
        fetchProducts,
        fetchProduct,
        addProduct,
        editProduct,
        removeProduct
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContext;
