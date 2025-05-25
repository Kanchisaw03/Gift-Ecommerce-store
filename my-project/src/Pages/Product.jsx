import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { luxuryTheme } from "../styles/luxuryTheme";
import { getProductById, getRelatedProducts } from "../services/api/productService";
import { getProductReviews, addProductReview } from "../services/api/productService";



export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuth();

  // State for product data
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);

  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [activeImage, setActiveImage] = useState(0);

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ""
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Fetch product data
  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);

      try {
        // Real API calls
        const productResponse = await getProductById(id);
        
        if (!productResponse || !productResponse.data) {
          throw new Error("Product not found");
        }
        
        setProduct(productResponse.data);
        
        // Fetch related products
        const relatedResponse = await getRelatedProducts(id);
        if (relatedResponse && relatedResponse.data) {
          setRelatedProducts(relatedResponse.data);
        }
        
        // Fetch product reviews
        const reviewsResponse = await getProductReviews(id);
        if (reviewsResponse && reviewsResponse.data) {
          setReviews(reviewsResponse.data);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.message || "Failed to load product");
        toast.error(err.message || "Failed to load product");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  // Handle quantity changes
  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (!product) return;
    
    try {
      // Add to cart using context
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity: quantity
      });
      
      toast.success(`${product.name} added to cart`);
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Failed to add item to cart");
    }
  };

  // Handle review submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please log in to submit a review");
      navigate("/login");
      return;
    }
    
    if (!reviewForm.comment.trim()) {
      toast.error("Please enter a review comment");
      return;
    }
    
    setIsSubmittingReview(true);
    
    try {
      // Call the real API to add a product review
      const reviewData = {
        rating: reviewForm.rating,
        comment: reviewForm.comment.trim()
      };
      
      const response = await addProductReview(id, reviewData);
      
      if (response && response.data) {
        // Add the new review to the state
        setReviews([response.data, ...reviews]);
        setReviewForm({ rating: 5, comment: "" });
        toast.success("Review submitted successfully!");
      } else {
        throw new Error("Unexpected API response");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Show error message if product fails to load
  if (error) {
    return (
      <div className="pt-24 pb-12 container mx-auto px-4 text-center" style={{ backgroundColor: "#0A0A0A" }}>
        <div className="max-w-2xl mx-auto py-16">
          <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}>
            Error Loading Product
          </h2>
          <p className="text-gray-300 mb-8" style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}>
            {error}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gold text-black hover:bg-gold-light transition-all duration-300"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Render loading state
  if (isLoading) {
    return (
      <div className="pt-24 pb-12 container mx-auto px-4 flex justify-center items-center" style={{ backgroundColor: "#0A0A0A", minHeight: "80vh" }}>
        <LoadingSpinner size="large" color="#D4AF37" />
      </div>
    );
  }

  // Calculate discounted price
  const discountedPrice = product?.discount ? product.price * (1 - product.discount / 100) : product?.price;

  return (
    <div className="pt-24 pb-12" style={{ backgroundColor: "#0A0A0A" }}>
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="text-sm mb-6">
          <ol className="flex items-center space-x-2">
            <li>
              <Link to="/" className="text-gray-400 hover:text-gold transition-colors">
                Home
              </Link>
            </li>
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li>
              <Link to="/products" className="text-gray-400 hover:text-gold transition-colors">
                Products
              </Link>
            </li>
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li>
              <span className="text-gold">{product?.name}</span>
            </li>
          </ol>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Product Images */}
          <div>
            {/* Main Image */}
            <div className="mb-4 overflow-hidden rounded bg-black/30 border border-gold/10">
              <img 
                src={product?.images[activeImage]} 
                alt={product?.name} 
                className="w-full h-auto object-cover"
              />
            </div>
            
            {/* Thumbnail Images */}
            {product?.images.length > 1 && (
              <div className="flex space-x-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`p-1 border ${activeImage === index ? 'border-gold' : 'border-gold/30'}`}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} - ${index + 1}`} 
                      className="w-16 h-16 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div>
            <div className="mb-6">
              <h1 
                className="text-2xl md:text-3xl font-bold mb-2 text-white"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
              >
                {product?.name}
              </h1>
              
              {/* Price */}
              <div className="flex items-center mb-4">
                {product?.discount > 0 ? (
                  <>
                    <span 
                      className="text-2xl font-bold text-gold mr-2"
                      style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                    >
                      ${discountedPrice?.toFixed(2)}
                    </span>
                    <span 
                      className="text-lg text-gray-400 line-through"
                      style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                    >
                      ${product?.price.toFixed(2)}
                    </span>
                    <span 
                      className="ml-2 px-2 py-1 text-xs bg-gold/10 text-gold border border-gold/30"
                      style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                    >
                      {product?.discount}% OFF
                    </span>
                  </>
                ) : (
                  <span 
                    className="text-2xl font-bold text-gold"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                  >
                    ${product?.price.toFixed(2)}
                  </span>
                )}
              </div>
              
              {/* Availability */}
              <div className="mb-6">
                <div className="flex items-center">
                  <span 
                    className={`inline-block w-3 h-3 rounded-full mr-2 ${product?.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}
                  ></span>
                  <span 
                    className="text-gray-300"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                  >
                    {product?.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                  {product?.stock > 0 && (
                    <span className="ml-2 text-gray-400">{product.stock} {product.stock === 1 ? 'item' : 'items'} left</span>
                  )}
                </div>
              </div>
              
              {/* Tags */}
              {product?.tags && product.tags.length > 0 && (
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map(tag => (
                      <Link 
                        key={tag} 
                        to={`/products?search=${tag}`}
                        className="px-3 py-1 text-sm border border-gold/30 text-gold/80 hover:border-gold hover:text-gold transition-all duration-300"
                        style={{ 
                          backgroundColor: 'rgba(212, 175, 55, 0.05)',
                          fontFamily: luxuryTheme.typography.fontFamily.body
                        }}
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Quantity Selector */}
              <div className="mb-6">
                <label 
                  className="block text-white font-medium mb-2"
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                >
                  Quantity
                </label>
                <div className="flex items-center">
                  <button 
                    onClick={decreaseQuantity}
                    className="w-10 h-10 flex items-center justify-center border border-gold/30 hover:border-gold/50 text-gold bg-transparent hover:bg-black/30 transition-all duration-300"
                    disabled={quantity <= 1}
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    min="1" 
                    max={product?.stock} 
                    value={quantity}
                    onChange={(e) => setQuantity(Math.min(product?.stock, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-16 h-10 border-y border-gold/30 text-center focus:outline-none focus:border-gold bg-black/20 text-white"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                  />
                  <button 
                    onClick={increaseQuantity}
                    className="w-10 h-10 flex items-center justify-center border border-gold/30 hover:border-gold/50 text-gold bg-transparent hover:bg-black/30 transition-all duration-300"
                    disabled={quantity >= product?.stock}
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                  >
                    +
                  </button>
                </div>
              </div>
              
              {/* Add to Cart Button */}
              <div className="mb-6">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddToCart}
                  className="w-full py-3 bg-gold text-black hover:bg-gold-light flex items-center justify-center transition-all duration-300"
                  disabled={product?.stock <= 0}
                  style={{ 
                    fontFamily: luxuryTheme.typography.fontFamily.body,
                    letterSpacing: '1px'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  ADD TO CART
                </motion.button>
              </div>
              
              {/* Shipping & Returns */}
              <div className="border-t border-gold/20 pt-6 space-y-4">
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gold mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  <div>
                    <h4 
                      className="font-medium text-white"
                      style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                    >
                      Complimentary Shipping
                    </h4>
                    <p 
                      className="text-sm text-gray-400"
                      style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                    >
                      On all orders over $50
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gold mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
                  </svg>
                  <div>
                    <h4 
                      className="font-medium text-white"
                      style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                    >
                      Hassle-Free Returns
                    </h4>
                    <p 
                      className="text-sm text-gray-400"
                      style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                    >
                      30 day satisfaction guarantee
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Tabs */}
        <div className="mb-16">
          <div className="border-b border-gold/20">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("description")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "description" ? "border-gold text-gold" : "border-transparent text-gray-400 hover:text-gold/70 hover:border-gold/30"}`}
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body, letterSpacing: '1px' }}
              >
                DESCRIPTION
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "reviews" ? "border-gold text-gold" : "border-transparent text-gray-400 hover:text-gold/70 hover:border-gold/30"}`}
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body, letterSpacing: '1px' }}
              >
                REVIEWS ({reviews.length})
              </button>
            </nav>
          </div>
          
          <div className="py-6">
            {activeTab === "description" ? (
              <div className="prose max-w-none">
                <p 
                  className="text-gray-300 leading-relaxed"
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                >
                  {product?.description}
                </p>
                <p 
                  className="text-gray-300 leading-relaxed mt-4"
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                >
                  Our gifts are carefully curated to ensure the highest quality and satisfaction. Each item is inspected before shipping to guarantee that your gift arrives in perfect condition.
                </p>
                <h3 
                  className="text-lg font-medium mt-6 mb-2 text-white"
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                >
                  Features:
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-300" style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}>
                  <li>Premium quality materials</li>
                  <li>Beautifully packaged</li>
                  <li>Perfect for {product?.category.toLowerCase()} occasions</li>
                  <li>Satisfaction guaranteed</li>
                </ul>
              </div>
            ) : (
              <div>
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="flex text-gold text-xl mr-2">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>{i < Math.floor(product?.rating) ? "★" : "☆"}</span>
                      ))}
                    </div>
                    <span 
                      className="text-lg font-medium text-white"
                      style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                    >
                      {product?.rating} out of 5
                    </span>
                  </div>
                  <p 
                    className="text-gray-400"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                  >
                    Based on {reviews.length} reviews
                  </p>
                </div>
                
                {/* Review submission form */}
                <div className="mb-10 border border-gold/20 p-6 rounded bg-black/30">
                  <h3 
                    className="text-xl font-medium mb-4 text-white"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                  >
                    Write a Review
                  </h3>
                  <form onSubmit={handleReviewSubmit}>
                    <div className="mb-4">
                      <label 
                        className="block text-gold mb-2 text-sm"
                        style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                      >
                        Your Rating
                      </label>
                      <div className="flex text-gold text-2xl">
                        {[...Array(5)].map((_, i) => (
                          <button
                            type="button"
                            key={i}
                            onClick={() => setReviewForm(prev => ({ ...prev, rating: i + 1 }))}
                            className="focus:outline-none mr-1"
                          >
                            {i < reviewForm.rating ? "★" : "☆"}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mb-4">
                      <label 
                        className="block text-gold mb-2 text-sm"
                        style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                      >
                        Your Review
                      </label>
                      <textarea
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                        className="w-full p-3 bg-gray-900 border border-gold/30 text-white rounded focus:border-gold focus:outline-none"
                        style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                        rows="4"
                        placeholder="Share your thoughts about this product..."
                        required
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmittingReview || !reviewForm.comment.trim()}
                      className={`px-6 py-3 ${isSubmittingReview || !reviewForm.comment.trim() ? 'bg-gray-700 cursor-not-allowed' : 'bg-gold hover:bg-gold-light'} text-black transition-all duration-300`}
                      style={{ 
                        fontFamily: luxuryTheme.typography.fontFamily.body,
                        letterSpacing: '1px',
                      }}
                    >
                      {isSubmittingReview ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
                    </button>
                  </form>
                </div>
                
                {/* Reviews list */}
                <div className="space-y-6">
                  <h3 
                    className="text-xl font-medium mb-4 text-white"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                  >
                    Customer Reviews
                  </h3>
                  {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                      <div key={review.id || index} className="border-b border-gold/10 pb-6 mb-6">
                        <div className="flex justify-between mb-2">
                          <h4 
                            className="font-medium text-white"
                            style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                          >
                            {review.user}
                          </h4>
                          <span className="text-gray-400 text-sm">{new Date(review.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex text-gold mb-2">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                          ))}
                        </div>
                        <p 
                          className="text-gray-300"
                          style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                        >
                          {review.content}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400" style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}>
                      No reviews yet. Be the first to review this product!
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 
              className="text-2xl font-bold mb-6 text-white"
              style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
            >
              <span className="text-gold">You May Also</span> Like
            </h2>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold to-transparent mb-10"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}