import { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import useSocket from '../hooks/useSocket';
import { getUserProfile, updateUserProfile } from '../services/api/userService';
import { useAuth } from '../hooks/useAuth';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const socket = useSocket();
  const { user, isAuthenticated } = useAuth();
  
  // Fetch user profile
  const fetchUserProfile = async () => {
    if (!isAuthenticated || !user) return;
    
    setLoading(true);
    try {
      const data = await getUserProfile();
      if (data && data.success) {
        setUserProfile(data.data);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err.message || 'Failed to fetch user profile');
      toast.error(err.message || 'Failed to fetch user profile');
    } finally {
      setLoading(false);
    }
  };
  
  // Update user profile
  const updateProfile = async (profileData) => {
    setLoading(true);
    try {
      console.log('Updating user profile with data:', profileData);
      const data = await updateUserProfile(profileData);
      console.log('Profile update response:', data);
      
      if (data && data.success) {
        setUserProfile(data.data);
        toast.success('Profile updated successfully');
      }
      setError(null);
      return data;
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
      toast.error(err.message || 'Failed to update profile');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Initial fetch
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserProfile();
    }
  }, [isAuthenticated, user]);
  
  // Socket.IO event listeners for real-time updates
  useEffect(() => {
    if (!socket || !isAuthenticated) {
      return;
    }
    
    console.log('Setting up user profile Socket.IO event listeners');
    
    // Listen for profile updates
    socket.on('userProfileUpdated', (updatedProfile) => {
      console.log('Socket event received: userProfileUpdated', updatedProfile);
      if (updatedProfile && updatedProfile._id === userProfile?._id) {
        setUserProfile(updatedProfile);
        toast.info('Your profile has been updated');
      }
    });
    
    return () => {
      socket.off('userProfileUpdated');
    };
  }, [socket, userProfile, isAuthenticated]);
  
  return (
    <UserContext.Provider
      value={{
        userProfile,
        loading,
        error,
        fetchUserProfile,
        updateProfile
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
