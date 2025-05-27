import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { 
  getAllCoupons, 
  getCouponById, 
  createCoupon, 
  updateCoupon, 
  deleteCoupon,
  validateCoupon
} from '../services/api/couponService';
import { useAuth } from '../hooks/useAuth';

// Create context
const CouponContext = createContext();

export const CouponProvider = ({ children }) => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentCoupon, setCurrentCoupon] = useState(null);
  const { isAuthenticated, user } = useAuth();

  // Fetch coupons on mount and when auth state changes
  useEffect(() => {
    if (isAuthenticated && (user?.role === 'admin' || user?.role === 'super_admin' || user?.role === 'seller')) {
      fetchCoupons();
    } else {
      // Clear coupons when user logs out or doesn't have permission
      setCoupons([]);
    }
  }, [isAuthenticated, user]);

  // Fetch coupons from API
  const fetchCoupons = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllCoupons(params);
      
      if (response.success) {
        setCoupons(response.data || []);
      } else {
        setCoupons([]);
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
      setError(error.message || 'Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  // Get coupon by ID
  const getCoupon = async (couponId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCouponById(couponId);
      
      if (response.success) {
        setCurrentCoupon(response.data);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch coupon');
      }
    } catch (error) {
      console.error('Error fetching coupon:', error);
      setError(error.message || 'Failed to fetch coupon');
      toast.error(error.message || 'Failed to fetch coupon');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create new coupon
  const addCoupon = async (couponData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await createCoupon(couponData);
      
      if (response.success) {
        setCoupons(prevCoupons => [...prevCoupons, response.data]);
        toast.success('Coupon created successfully');
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to create coupon');
      }
    } catch (error) {
      console.error('Error creating coupon:', error);
      setError(error.message || 'Failed to create coupon');
      toast.error(error.message || 'Failed to create coupon');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update existing coupon
  const editCoupon = async (couponId, couponData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await updateCoupon(couponId, couponData);
      
      if (response.success) {
        setCoupons(prevCoupons => 
          prevCoupons.map(coupon => 
            coupon._id === couponId ? response.data : coupon
          )
        );
        setCurrentCoupon(response.data);
        toast.success('Coupon updated successfully');
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to update coupon');
      }
    } catch (error) {
      console.error('Error updating coupon:', error);
      setError(error.message || 'Failed to update coupon');
      toast.error(error.message || 'Failed to update coupon');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete coupon
  const removeCoupon = async (couponId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await deleteCoupon(couponId);
      
      if (response.success) {
        setCoupons(prevCoupons => 
          prevCoupons.filter(coupon => coupon._id !== couponId)
        );
        toast.success('Coupon deleted successfully');
        return true;
      } else {
        throw new Error(response.message || 'Failed to delete coupon');
      }
    } catch (error) {
      console.error('Error deleting coupon:', error);
      setError(error.message || 'Failed to delete coupon');
      toast.error(error.message || 'Failed to delete coupon');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Validate coupon
  const validateCouponCode = async (code, cartItems, cartTotal) => {
    try {
      setLoading(true);
      setError(null);
      const response = await validateCoupon({
        code,
        cartItems,
        cartTotal
      });
      
      if (response.success) {
        return {
          valid: true,
          discountAmount: response.data.discountAmount,
          couponDetails: response.data
        };
      } else {
        throw new Error(response.message || 'Invalid coupon');
      }
    } catch (error) {
      console.error('Error validating coupon:', error);
      setError(error.message || 'Invalid coupon');
      return {
        valid: false,
        message: error.message || 'Invalid coupon'
      };
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    coupons,
    loading,
    error,
    currentCoupon,
    fetchCoupons,
    getCoupon,
    addCoupon,
    editCoupon,
    removeCoupon,
    validateCouponCode,
    refreshCoupons: fetchCoupons
  };

  return (
    <CouponContext.Provider value={value}>
      {children}
    </CouponContext.Provider>
  );
};

// Custom hook to use the coupon context
export const useCoupon = () => {
  const context = useContext(CouponContext);
  
  if (!context) {
    throw new Error('useCoupon must be used within a CouponProvider');
  }
  
  return context;
};

export default CouponContext;
