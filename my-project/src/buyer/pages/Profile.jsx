import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { luxuryTheme } from '../../styles/luxuryTheme';
import { useUser } from '../../hooks/useUser';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import OrderTrackingModal from '../components/OrderTrackingModal';

const Profile = () => {
  const { userProfile, loading, error, updateProfile } = useUser();
  const { user: authUser } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  
  // Initialize form data when user profile is loaded
  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        email: userProfile.email || '',
        phone: userProfile.phone || ''
      });
    }
  }, [userProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await updateProfile(formData);
      if (result && result.success) {
        toast.success('Profile updated successfully');
        setIsEditing(false);
      }
    } catch (err) {
      toast.error('Failed to update profile');
      console.error('Error updating profile:', err);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 max-w-4xl"
    >
      <h1 className="text-3xl font-playfair font-bold mb-8 text-center border-b border-[#D4AF37] pb-4">
        My Profile
      </h1>

      <div className="bg-[#111111] rounded-lg shadow-lg p-6 border border-[#D4AF37]/20 mb-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#D4AF37]" />
              <div className="absolute inset-0 animate-ping opacity-30 rounded-full h-16 w-16 border border-[#D4AF37]" />
            </div>
          </div>
        ) : error ? (
          <div className="text-center p-8 text-red-500">
            <p>Error loading profile data. Please try again later.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-[#D4AF37] text-black font-semibold rounded hover:bg-[#B8860B] transition-colors"
            >
              Retry
            </button>
          </div>
        ) : !isEditing ? (
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#D4AF37] flex-shrink-0">
              <img 
                src={userProfile?.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'} 
                alt={userProfile?.name} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-playfair font-bold text-white mb-2">{userProfile?.name}</h2>
              <div className="space-y-3 text-gray-300">
                <p className="flex items-center gap-2">
                  <span className="text-[#D4AF37]">Email:</span> {userProfile?.email}
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-[#D4AF37]">Phone:</span> {userProfile?.phone || 'Not provided'}
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-[#D4AF37]">Member Since:</span> {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : 'N/A'}
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-[#D4AF37]">Role:</span> <span className="capitalize">{userProfile?.role || authUser?.role || 'User'}</span>
                </p>
              </div>
              <div className="flex flex-wrap gap-3 mt-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-[#D4AF37] text-black font-semibold rounded hover:bg-[#B8860B] transition-colors"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => setIsTrackingModalOpen(true)}
                  className="px-4 py-2 bg-transparent border border-[#D4AF37] text-[#D4AF37] font-semibold rounded hover:bg-[#D4AF37]/10 transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Track Orders
                </button>
                <Link
                  to="/orders"
                  className="px-4 py-2 bg-transparent border border-gray-600 text-white font-semibold rounded hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Order History
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
            
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-[#D4AF37] text-black font-medium rounded-md hover:bg-[#C4A137] transition-colors"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  if (userProfile) {
                    setFormData({
                      name: userProfile.name || '',
                      email: userProfile.email || '',
                      phone: userProfile.phone || ''
                    });
                  }
                }}
                className="px-6 py-2 bg-transparent border border-gray-600 text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="bg-[#121212] rounded-lg shadow-xl p-8">
        <h2 className="text-2xl font-playfair font-semibold mb-6 border-b border-gray-700 pb-2">Account Settings</h2>
        
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">Password</h3>
              <p className="text-gray-400 text-sm">Change your account password</p>
            </div>
            <button className="px-4 py-2 border border-[#D4AF37] text-[#D4AF37] rounded-md hover:bg-[#D4AF37] hover:text-black transition-colors">
              Change Password
            </button>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">Notifications</h3>
              <p className="text-gray-400 text-sm">Manage your notification preferences</p>
            </div>
            <button className="px-4 py-2 border border-[#D4AF37] text-[#D4AF37] rounded-md hover:bg-[#D4AF37] hover:text-black transition-colors">
              Manage
            </button>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">Privacy Settings</h3>
              <p className="text-gray-400 text-sm">Control your privacy preferences</p>
            </div>
            <button className="px-4 py-2 border border-[#D4AF37] text-[#D4AF37] rounded-md hover:bg-[#D4AF37] hover:text-black transition-colors">
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Order Tracking Modal */}
      {isTrackingModalOpen && (
        <OrderTrackingModal
          isOpen={isTrackingModalOpen}
          onClose={() => setIsTrackingModalOpen(false)}
          userId={userProfile?._id || authUser?._id}
        />
      )}
    </motion.div>
  );
};

export default Profile;
