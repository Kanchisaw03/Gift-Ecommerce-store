import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { luxuryTheme } from '../../styles/luxuryTheme';

const Profile = () => {
  const [user, setUser] = useState({
    id: '1',
    name: 'Alexander Wilson',
    email: 'alexander@example.com',
    phone: '+1 (555) 123-4567',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    joinDate: '2023-05-15'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement API call to update profile
    setUser(formData);
    setIsEditing(false);
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

      <div className="bg-[#121212] rounded-lg shadow-xl p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-[#D4AF37] flex-shrink-0">
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          </div>
          
          <div className="flex-1">
            {isEditing ? (
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
                      setFormData({ ...user });
                    }}
                    className="px-6 py-2 bg-transparent border border-gray-600 text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <h2 className="text-2xl font-playfair font-semibold">{user.name}</h2>
                <div className="space-y-2 text-gray-300">
                  <p><span className="text-[#D4AF37]">Email:</span> {user.email}</p>
                  <p><span className="text-[#D4AF37]">Phone:</span> {user.phone}</p>
                  <p><span className="text-[#D4AF37]">Member Since:</span> {new Date(user.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-4 px-6 py-2 bg-[#D4AF37] text-black font-medium rounded-md hover:bg-[#C4A137] transition-colors"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>
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
    </motion.div>
  );
};

export default Profile;
