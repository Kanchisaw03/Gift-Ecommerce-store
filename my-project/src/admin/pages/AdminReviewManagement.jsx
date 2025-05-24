import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AdminReviewManagement = () => {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      productId: 'p123',
      productName: 'Luxury Gold Watch',
      userId: 'u456',
      userName: 'John Smith',
      rating: 5,
      content: 'Absolutely stunning watch. The craftsmanship is impeccable and it looks even better in person than in the photos.',
      date: '2025-05-10',
      status: 'approved',
      reported: false
    },
    {
      id: 2,
      productId: 'p124',
      productName: 'Crystal Champagne Flutes (Set of 2)',
      userId: 'u789',
      userName: 'Emma Johnson',
      rating: 4,
      content: 'Beautiful glasses that sparkle wonderfully in the light. Took off one star because one glass had a tiny imperfection.',
      date: '2025-05-12',
      status: 'approved',
      reported: false
    },
    {
      id: 3,
      productId: 'p125',
      productName: 'Cashmere Throw Blanket',
      userId: 'u234',
      userName: 'Michael Brown',
      rating: 2,
      content: 'The blanket is much thinner than I expected for the price. Also arrived with a small stain on one corner.',
      date: '2025-05-15',
      status: 'pending',
      reported: false
    },
    {
      id: 4,
      productId: 'p126',
      productName: 'Marble Cheese Board',
      userId: 'u567',
      userName: 'Sarah Wilson',
      rating: 5,
      content: 'Gorgeous piece! The marble is high quality and the gold accents are a beautiful touch. Perfect for entertaining.',
      date: '2025-05-16',
      status: 'approved',
      reported: false
    },
    {
      id: 5,
      productId: 'p127',
      productName: 'Leather Journal',
      userId: 'u890',
      userName: 'David Lee',
      rating: 1,
      content: 'This is clearly not real leather as advertised. The stitching is coming apart after just one week of use. Complete waste of money.',
      date: '2025-05-18',
      status: 'pending',
      reported: true
    },
    {
      id: 6,
      productId: 'p128',
      productName: 'Scented Candle Set',
      userId: 'u123',
      userName: 'Jennifer Garcia',
      rating: 4,
      content: 'The scents are lovely and subtle. The packaging is beautiful and makes for a great gift.',
      date: '2025-05-19',
      status: 'approved',
      reported: false
    },
    {
      id: 7,
      productId: 'p129',
      productName: 'Silk Pillowcase',
      userId: 'u456',
      userName: 'John Smith',
      rating: 3,
      content: 'The quality is good but the color is slightly different than what was shown in the product images.',
      date: '2025-05-20',
      status: 'pending',
      reported: false
    }
  ]);

  const [filter, setFilter] = useState({
    status: 'all',
    rating: 'all',
    reported: 'all'
  });

  const [searchTerm, setSearchTerm] = useState('');

  const handleApprove = (id) => {
    setReviews(reviews.map(review => 
      review.id === id ? { ...review, status: 'approved' } : review
    ));
  };

  const handleReject = (id) => {
    setReviews(reviews.map(review => 
      review.id === id ? { ...review, status: 'rejected' } : review
    ));
  };

  const handleDelete = (id) => {
    setReviews(reviews.filter(review => review.id !== id));
  };

  const filteredReviews = reviews.filter(review => {
    const matchesStatus = filter.status === 'all' || review.status === filter.status;
    const matchesRating = filter.rating === 'all' || review.rating === parseInt(filter.rating);
    const matchesReported = filter.reported === 'all' || 
      (filter.reported === 'reported' && review.reported) || 
      (filter.reported === 'not-reported' && !review.reported);
    
    const matchesSearch = searchTerm === '' || 
      review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesRating && matchesReported && matchesSearch;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-[#0A0A0A] text-white p-6"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-white">Review Management</h1>
            <p className="text-gray-400 mt-1">Manage customer reviews and ratings</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button className="px-4 py-2 bg-[#D4AF37] text-black rounded-md hover:bg-[#B8860B] transition-colors">
              Export Reviews
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <motion.div 
          variants={itemVariants}
          className="bg-[#121212] rounded-lg shadow-lg p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Status
              </label>
              <select
                value={filter.status}
                onChange={(e) => setFilter({...filter, status: e.target.value})}
                className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Rating
              </label>
              <select
                value={filter.rating}
                onChange={(e) => setFilter({...filter, rating: e.target.value})}
                className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Reported
              </label>
              <select
                value={filter.reported}
                onChange={(e) => setFilter({...filter, reported: e.target.value})}
                className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                <option value="all">All Reviews</option>
                <option value="reported">Reported Only</option>
                <option value="not-reported">Not Reported</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Search
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by product, user, or content..."
                className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
          </div>
        </motion.div>

        {/* Reviews List */}
        <motion.div variants={itemVariants} className="bg-[#121212] rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#1E1E1E] border-b border-gray-700">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Product</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">User</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Rating</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Review</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Date</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Status</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredReviews.map((review) => (
                  <tr key={review.id} className="hover:bg-[#1A1A1A] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-medium text-white">{review.productName}</div>
                      <div className="text-xs text-gray-400">ID: {review.productId}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-white">{review.userName}</div>
                      <div className="text-xs text-gray-400">ID: {review.userId}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? 'text-[#D4AF37]' : 'text-gray-600'}`}
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="max-w-xs truncate text-sm">{review.content}</div>
                      {review.reported && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-900 text-red-300 mt-1">
                          Reported
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-300">{review.date}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        review.status === 'approved' 
                          ? 'bg-green-900 text-green-300' 
                          : review.status === 'rejected'
                            ? 'bg-red-900 text-red-300'
                            : 'bg-yellow-900 text-yellow-300'
                      }`}>
                        {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        {review.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(review.id)}
                              className="px-2 py-1 bg-green-900 text-green-300 rounded hover:bg-green-800 transition-colors text-xs"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(review.id)}
                              className="px-2 py-1 bg-red-900 text-red-300 rounded hover:bg-red-800 transition-colors text-xs"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="px-2 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredReviews.length === 0 && (
            <div className="py-8 text-center text-gray-400">
              No reviews match your filters
            </div>
          )}
        </motion.div>

        {/* Pagination */}
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-400">
            Showing {filteredReviews.length} of {reviews.length} reviews
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-[#1E1E1E] text-gray-300 rounded hover:bg-[#2A2A2A] transition-colors">
              Previous
            </button>
            <button className="px-3 py-1 bg-[#D4AF37] text-black rounded hover:bg-[#B8860B] transition-colors">
              1
            </button>
            <button className="px-3 py-1 bg-[#1E1E1E] text-gray-300 rounded hover:bg-[#2A2A2A] transition-colors">
              2
            </button>
            <button className="px-3 py-1 bg-[#1E1E1E] text-gray-300 rounded hover:bg-[#2A2A2A] transition-colors">
              3
            </button>
            <button className="px-3 py-1 bg-[#1E1E1E] text-gray-300 rounded hover:bg-[#2A2A2A] transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminReviewManagement;
