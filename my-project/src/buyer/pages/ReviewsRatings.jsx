import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { luxuryTheme } from '../../styles/luxuryTheme';

const ReviewsRatings = () => {
  const [reviews, setReviews] = useState([
    {
      id: '1',
      productId: 'PROD-001',
      productName: 'Handcrafted Gold Watch',
      productImage: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      rating: 5,
      title: 'Exceptional Craftsmanship',
      review: 'This watch exceeds all expectations. The attention to detail is remarkable, and it has quickly become my favorite accessory. Worth every penny for the quality and elegance it provides.',
      date: '2025-05-10',
      helpful: 12,
      status: 'published'
    },
    {
      id: '2',
      productId: 'PROD-002',
      productName: 'Premium Leather Wallet',
      productImage: 'https://images.unsplash.com/photo-1517254797898-07c73c117e6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      rating: 4,
      title: 'Beautiful Quality Leather',
      review: 'The leather quality is superb and the stitching is impeccable. My only minor complaint is that it\'s slightly bulkier than I expected. Overall, a fantastic purchase that I\'m very happy with.',
      date: '2025-04-22',
      helpful: 8,
      status: 'published'
    },
    {
      id: '3',
      productId: 'PROD-003',
      productName: 'Crystal Whiskey Decanter Set',
      productImage: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      rating: 5,
      title: 'Stunning Addition to My Bar',
      review: 'This decanter set is absolutely stunning. The crystal catches the light beautifully and adds a touch of sophistication to my home bar. The glasses are perfectly weighted and feel luxurious in hand.',
      date: '2025-03-15',
      helpful: 15,
      status: 'published'
    }
  ]);

  const [pendingReviews, setPendingReviews] = useState([
    {
      id: '4',
      productId: 'PROD-004',
      productName: 'Silk Cashmere Scarf',
      productImage: 'https://images.unsplash.com/photo-1584736286279-75260e512fa8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      purchased: '2025-05-01',
      orderNumber: 'ORD-10036'
    },
    {
      id: '5',
      productId: 'PROD-005',
      productName: 'Artisanal Fountain Pen',
      productImage: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      purchased: '2025-04-10',
      orderNumber: 'ORD-10015'
    }
  ]);

  const [editingReview, setEditingReview] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewFormData, setReviewFormData] = useState({
    productId: '',
    productName: '',
    productImage: '',
    rating: 5,
    title: '',
    review: ''
  });

  const handleStartReview = (product) => {
    setReviewFormData({
      productId: product.productId,
      productName: product.productName,
      productImage: product.productImage,
      rating: 5,
      title: '',
      review: ''
    });
    setEditingReview(null);
    setShowReviewForm(true);
  };

  const handleEditReview = (review) => {
    setReviewFormData({
      productId: review.productId,
      productName: review.productName,
      productImage: review.productImage,
      rating: review.rating,
      title: review.title,
      review: review.review
    });
    setEditingReview(review.id);
    setShowReviewForm(true);
  };

  const handleDeleteReview = (id) => {
    setReviews(reviews.filter(review => review.id !== id));
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewFormData({
      ...reviewFormData,
      [name]: value
    });
  };

  const handleRatingChange = (rating) => {
    setReviewFormData({
      ...reviewFormData,
      rating
    });
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    
    if (editingReview) {
      // Update existing review
      const updatedReviews = reviews.map(review => 
        review.id === editingReview 
          ? { 
              ...review, 
              rating: reviewFormData.rating,
              title: reviewFormData.title,
              review: reviewFormData.review,
              date: new Date().toISOString().split('T')[0]
            } 
          : review
      );
      setReviews(updatedReviews);
    } else {
      // Add new review
      const newReview = {
        id: `review-${Date.now()}`,
        productId: reviewFormData.productId,
        productName: reviewFormData.productName,
        productImage: reviewFormData.productImage,
        rating: reviewFormData.rating,
        title: reviewFormData.title,
        review: reviewFormData.review,
        date: new Date().toISOString().split('T')[0],
        helpful: 0,
        status: 'published'
      };
      
      setReviews([newReview, ...reviews]);
      
      // Remove from pending reviews
      setPendingReviews(pendingReviews.filter(
        item => item.productId !== reviewFormData.productId
      ));
    }
    
    setShowReviewForm(false);
    setEditingReview(null);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`h-5 w-5 ${star <= rating ? 'text-[#D4AF37]' : 'text-gray-600'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const renderRatingInput = () => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingChange(star)}
            className="focus:outline-none"
          >
            <svg
              className={`h-8 w-8 ${star <= reviewFormData.rating ? 'text-[#D4AF37]' : 'text-gray-600'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    );
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
      className="container mx-auto px-4 py-8 max-w-6xl"
    >
      <h1 className="text-3xl font-playfair font-bold mb-8 text-center border-b border-[#D4AF37] pb-4">
        My Reviews & Ratings
      </h1>

      {showReviewForm ? (
        <div className="bg-[#121212] rounded-lg shadow-xl p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
              <img src={reviewFormData.productImage} alt={reviewFormData.productName} className="w-full h-full object-cover" />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-playfair font-semibold">
                {editingReview ? 'Edit Review' : 'Write a Review'}
              </h2>
              <p className="text-gray-400">{reviewFormData.productName}</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmitReview} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Your Rating</label>
              {renderRatingInput()}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Review Title</label>
              <input
                type="text"
                name="title"
                value={reviewFormData.title}
                onChange={handleReviewChange}
                required
                placeholder="Summarize your experience"
                className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Your Review</label>
              <textarea
                name="review"
                value={reviewFormData.review}
                onChange={handleReviewChange}
                required
                rows="6"
                placeholder="Share your thoughts about this product"
                className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              ></textarea>
            </div>
            
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-[#D4AF37] text-black font-medium rounded-md hover:bg-[#C4A137] transition-colors"
              >
                {editingReview ? 'Update Review' : 'Submit Review'}
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="px-6 py-2 bg-transparent border border-gray-600 text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          {/* Pending Reviews */}
          {pendingReviews.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-playfair font-semibold mb-6">Pending Reviews</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pendingReviews.map((product) => (
                  <div key={product.id} className="bg-[#121212] rounded-lg shadow-xl p-6 flex">
                    <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                      <img src={product.productImage} alt={product.productName} className="w-full h-full object-cover" />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-medium">{product.productName}</h3>
                      <p className="text-sm text-gray-400 mb-4">
                        Purchased on {new Date(product.purchased).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                      <button
                        onClick={() => handleStartReview(product)}
                        className="px-4 py-2 bg-[#D4AF37] text-black text-sm font-medium rounded-md hover:bg-[#C4A137] transition-colors"
                      >
                        Write a Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Published Reviews */}
          <div>
            <h2 className="text-2xl font-playfair font-semibold mb-6">Your Reviews</h2>
            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-[#121212] rounded-lg shadow-xl p-6">
                    <div className="flex flex-col md:flex-row">
                      <div className="w-full md:w-1/4 mb-4 md:mb-0">
                        <div className="w-24 h-24 rounded-md overflow-hidden">
                          <img src={review.productImage} alt={review.productName} className="w-full h-full object-cover" />
                        </div>
                        <h3 className="text-lg font-medium mt-2">{review.productName}</h3>
                        <p className="text-sm text-gray-400 mt-1">
                          Reviewed on {new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                      <div className="md:w-3/4 md:pl-6">
                        <div className="flex items-center mb-2">
                          {renderStars(review.rating)}
                          <span className="ml-2 text-sm text-gray-400">
                            {review.rating}/5
                          </span>
                        </div>
                        <h4 className="text-xl font-playfair font-semibold mb-2">{review.title}</h4>
                        <p className="text-gray-300 mb-4">{review.review}</p>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-400">
                            <span>{review.helpful} people found this helpful</span>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditReview(review)}
                              className="px-3 py-1 text-sm bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteReview(review.id)}
                              className="px-3 py-1 text-sm bg-red-900 text-red-200 rounded hover:bg-red-800 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#121212] rounded-lg shadow-xl p-12 text-center">
                <h3 className="text-xl font-playfair font-medium mb-4">No Reviews Yet</h3>
                <p className="text-gray-400 mb-6">You haven't written any reviews yet.</p>
                {pendingReviews.length > 0 ? (
                  <p>You have {pendingReviews.length} products waiting for your review.</p>
                ) : (
                  <Link
                    to="/products"
                    className="inline-flex items-center px-6 py-3 bg-[#D4AF37] text-black font-medium rounded-md hover:bg-[#C4A137] transition-colors"
                  >
                    Browse Products
                  </Link>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default ReviewsRatings;
