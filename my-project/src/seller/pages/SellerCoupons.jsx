import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiClock, FiPercent, FiDollarSign, FiTag } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useCoupon } from '../../context/CouponContext';
import { useAuth } from '../../hooks/useAuth';
import { luxuryTheme } from '../../styles/luxuryTheme';
import CouponForm from '../components/CouponForm';
import LoadingSpinner from '../../components/LoadingSpinner';
import DeleteConfirmModal from '../../components/DeleteConfirmModal';

const SellerCoupons = () => {
  const { coupons, loading, error, fetchCoupons, removeCoupon } = useCoupon();
  const { user } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch coupons on mount
  useEffect(() => {
    fetchCoupons();
  }, []);

  // Filter coupons based on status and seller
  const filteredCoupons = coupons.filter(coupon => {
    // Only show coupons created by this seller
    if (coupon.createdBy._id !== user.id) {
      return false;
    }

    const now = new Date();
    const isExpired = new Date(coupon.endDate) < now;
    const isActive = coupon.isActive;
    const hasStarted = new Date(coupon.startDate) <= now;

    if (filterStatus === 'active') {
      return isActive && hasStarted && !isExpired;
    } else if (filterStatus === 'scheduled') {
      return isActive && !hasStarted;
    } else if (filterStatus === 'expired') {
      return isExpired;
    } else if (filterStatus === 'inactive') {
      return !isActive;
    }
    
    return true; // 'all' filter
  });

  // Handle opening the form for editing
  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setIsFormOpen(true);
  };

  // Handle opening the delete confirmation modal
  const handleDeleteClick = (coupon) => {
    setCouponToDelete(coupon);
    setShowDeleteModal(true);
  };

  // Handle confirming deletion
  const handleConfirmDelete = async () => {
    if (couponToDelete) {
      const success = await removeCoupon(couponToDelete._id);
      if (success) {
        toast.success('Coupon deleted successfully');
      }
      setShowDeleteModal(false);
      setCouponToDelete(null);
    }
  };

  // Handle canceling deletion
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setCouponToDelete(null);
  };

  // Handle form close
  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingCoupon(null);
  };

  // Handle form submission success
  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingCoupon(null);
    fetchCoupons();
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get coupon status
  const getCouponStatus = (coupon) => {
    const now = new Date();
    const isExpired = new Date(coupon.endDate) < now;
    const isActive = coupon.isActive;
    const hasStarted = new Date(coupon.startDate) <= now;

    if (!isActive) {
      return { label: 'Inactive', color: 'bg-gray-500' };
    } else if (isExpired) {
      return { label: 'Expired', color: 'bg-red-500' };
    } else if (!hasStarted) {
      return { label: 'Scheduled', color: 'bg-blue-500' };
    } else {
      return { label: 'Active', color: 'bg-green-500' };
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
          <h3 className="text-red-400 font-semibold mb-2">Error</h3>
          <p className="text-white/80">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 
          className="text-2xl font-bold text-white"
          style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
        >
          Coupon Management
        </h1>
        <button
          onClick={() => {
            setEditingCoupon(null);
            setIsFormOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-amber-600 to-yellow-500 text-black rounded-md transition-all duration-300 hover:shadow-gold"
          style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
        >
          <FiPlus className="mr-2" />
          Create Coupon
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {['all', 'active', 'scheduled', 'expired', 'inactive'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
              filterStatus === status
                ? 'bg-gold text-black'
                : 'bg-neutral-800 text-white hover:bg-neutral-700'
            }`}
            style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {filteredCoupons.length === 0 ? (
        <div className="bg-neutral-800/50 border border-gold/20 rounded-lg p-8 text-center">
          <FiTag className="mx-auto text-4xl text-gold/50 mb-4" />
          <h3 
            className="text-xl font-semibold mb-2 text-white"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
          >
            No Coupons Found
          </h3>
          <p className="text-gray-400 mb-6">
            {filterStatus === 'all'
              ? "You haven't created any coupons yet."
              : `You don't have any ${filterStatus} coupons.`}
          </p>
          <button
            onClick={() => {
              setEditingCoupon(null);
              setIsFormOpen(true);
            }}
            className="px-4 py-2 bg-gold/20 hover:bg-gold/30 text-gold rounded-md transition-all duration-300"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
          >
            Create Your First Coupon
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCoupons.map((coupon) => {
            const status = getCouponStatus(coupon);
            return (
              <motion.div
                key={coupon._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-neutral-800/50 border border-gold/20 rounded-lg overflow-hidden shadow-lg hover:shadow-gold/10 transition-all duration-300"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 
                        className="text-xl font-semibold text-white mb-1"
                        style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                      >
                        {coupon.code}
                      </h3>
                      <p className="text-gray-400 text-sm mb-2">{coupon.description}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full text-white ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <div className="flex-1 flex items-center">
                      {coupon.type === 'percentage' ? (
                        <FiPercent className="text-gold mr-2" />
                      ) : (
                        <FiDollarSign className="text-gold mr-2" />
                      )}
                      <span className="text-white font-semibold">
                        {coupon.type === 'percentage' ? `${coupon.amount}% Off` : `$${coupon.amount} Off`}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-400 text-sm">
                      <FiClock className="mr-1" />
                      <span>
                        {formatDate(coupon.startDate)} - {formatDate(coupon.endDate)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {coupon.minPurchase > 0 && (
                      <div className="bg-neutral-700/30 rounded p-2 text-xs">
                        <span className="text-gray-400">Min. Purchase:</span>
                        <span className="text-white ml-1">${coupon.minPurchase}</span>
                      </div>
                    )}
                    {coupon.maxDiscount && (
                      <div className="bg-neutral-700/30 rounded p-2 text-xs">
                        <span className="text-gray-400">Max Discount:</span>
                        <span className="text-white ml-1">${coupon.maxDiscount}</span>
                      </div>
                    )}
                    {coupon.usageLimit && (
                      <div className="bg-neutral-700/30 rounded p-2 text-xs">
                        <span className="text-gray-400">Usage Limit:</span>
                        <span className="text-white ml-1">
                          {coupon.usageCount}/{coupon.usageLimit}
                        </span>
                      </div>
                    )}
                    {coupon.perUserLimit && (
                      <div className="bg-neutral-700/30 rounded p-2 text-xs">
                        <span className="text-gray-400">Per User:</span>
                        <span className="text-white ml-1">{coupon.perUserLimit}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between">
                    <button
                      onClick={() => handleEdit(coupon)}
                      className="flex items-center px-3 py-1.5 bg-blue-900/30 hover:bg-blue-900/50 text-blue-400 rounded transition-colors duration-300"
                    >
                      <FiEdit2 className="mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(coupon)}
                      className="flex items-center px-3 py-1.5 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded transition-colors duration-300"
                    >
                      <FiTrash2 className="mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Coupon Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-neutral-900 border border-gold/30 rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <CouponForm
              coupon={editingCoupon}
              onClose={handleFormClose}
              onSuccess={handleFormSuccess}
            />
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmModal
          title="Delete Coupon"
          message={`Are you sure you want to delete the coupon "${couponToDelete?.code}"? This action cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default SellerCoupons;
