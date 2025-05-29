import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useAnimation } from "framer-motion";
import enhancedLuxuryTheme from "../styles/enhancedLuxuryTheme";
import { useInView } from "react-intersection-observer";

// Components
import ProductCard from "../components/ProductCard";
import CategoryCard from "../components/CategoryCard";
import { ProductCardSkeleton } from "../components/Loader";
import TestimonialCard from "../components/TestimonialCard";

// Lazy-loaded components for better performance
const ElegantGiftBoxes = lazy(() => import('../components/ElegantGiftBoxes'));

// Data
import products, { categories } from "../data/products";
import testimonials from "../data/testimonials";

// Import images for 3D gift boxes
import luxuryWatch from '../assets/watch.jpeg';
import luxuryPerfume from '../assets/Valentino born in Rome perfume.jpeg';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [displayedCategories, setDisplayedCategories] = useState([]);

  // Animation variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  // Parallax effect for hero section
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  // Ref for scroll to top functionality
  const topRef = useRef(null);
  
  // Intersection observer for animations
  const [featuredRef, featuredInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  const controls = useAnimation();
  
  useEffect(() => {
    if (featuredInView) {
      controls.start('visible');
    }
  }, [controls, featuredInView]);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setFeaturedProducts(products.filter(product => product.featured).slice(0, 8));
      setDisplayedCategories(categories.slice(0, 6));
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Scroll to top function
  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <div className="bg-rich-black min-h-screen" ref={topRef}>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(to bottom, #0a0a0a, #1a1a1a)' }}>
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute top-0 left-0 w-full h-full bg-[url('../assets/luxury-pattern.png')] bg-repeat opacity-5"></div>
          
          {/* Glowing orbs */}
          <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-gold/5 rounded-full blur-[100px] pulse-animation" />
          <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gold/10 rounded-full blur-[80px] pulse-animation" 
               style={{ animationDelay: '1s' }}/>
          <div className="absolute bottom-1/4 left-1/3 w-1/4 h-1/4 bg-gold/5 rounded-full blur-[80px] pulse-animation" 
               style={{ animationDelay: '1.5s' }}/>
          <div className="absolute top-1/3 right-1/4 w-1/5 h-1/5 bg-gold/5 rounded-full blur-[60px] pulse-animation" 
               style={{ animationDelay: '2s' }}/>
          
          {/* Gold accent lines */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-50" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-50" />
        </div>
        
        {/* Main content container */}
        <div className="container mx-auto px-4 relative z-10 max-w-7xl">
          {/* Hero title */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 
              className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight"
              style={{ fontFamily: enhancedLuxuryTheme.typography.fontFamily.heading }}
            >
              <span className="text-gradient-gold">Exquisite Gifts</span>
              <span className="block text-white mt-2">For Extraordinary Moments</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-white/70 max-w-2xl mx-auto mb-8 text-lg luxury-text">
              Discover our curated collection of premium gifts, meticulously crafted for those who appreciate elegance and sophistication.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <Link to="/products" className="btn-luxury btn-luxury-filled px-8 py-3">
                Explore Collection
              </Link>
              <Link to="/about" className="btn-luxury px-8 py-3">
                Our Story
              </Link>
            </div>
            
            {/* 3D Gift Boxes
            <Suspense fallback={
              <div className="w-full h-[300px] flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-2 border-gold border-t-transparent animate-spin"></div>
              </div>
            }>
              <ElegantGiftBoxes 
                leftProductImage={luxuryWatch}
                rightProductImage={luxuryPerfume}
                leftProductName="Luxury Watch"
                rightProductName="Valentino Perfume"
                leftProductPrice="$1,299"
                rightProductPrice="$899"
              />
            </Suspense>*/}
            {/* 3D Product Cards Section */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 relative mb-16 max-w-5xl mx-auto">
            {/* Golden connecting ribbon (SVG path) */}
            <svg 
              className="absolute top-1/2 left-0 right-0 w-full h-24 -mt-12 md:-mt-6 z-0 hidden md:block"
              viewBox="0 0 600 100"
              fill="none"
              preserveAspectRatio="none"
            >
              <motion.path
                d="M0,50 C150,100 450,0 600,50"
                stroke="url(#goldGradient)"
                strokeWidth="2"
                strokeDasharray="600"
                strokeDashoffset="600"
                initial={{ strokeDashoffset: 600 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
              />
              <defs>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="100%" y2="0">
                  <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="#D4AF37" stopOpacity="1" />
                  <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.3" />
                  <animate 
                    attributeName="x1" 
                    values="0%;100%;0%" 
                    dur="3s" 
                    repeatCount="indefinite" 
                  />
                  <animate 
                    attributeName="x2" 
                    values="100%;200%;100%" 
                    dur="3s" 
                    repeatCount="indefinite" 
                  />
                </linearGradient>
              </defs>
            </svg>

            {/* Left Product Card */}
            <motion.div
              className="w-full md:w-2/5 z-10"
              initial={{ opacity: 0, x: -50, rotateY: -15 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              whileHover={{ 
                scale: 1.03, 
                rotateY: 5, 
                rotateX: -2,
                transition: { duration: 0.3 }
              }}
            >
              <div 
                className="relative rounded-lg overflow-hidden group"
                style={{ 
                  background: 'rgba(30, 30, 34, 0.6)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(212, 175, 55, 0.1)',
                  transform: 'perspective(1000px)'
                }}
              >
                {/* Gold corner accents */}
                <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-gold/40"></div>
                <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-gold/40"></div>
                
                {/* Product image */}
                <div className="p-6 md:p-8">
                  <div className="relative">
                    <img 
                      src="src/assets/download (18).jpeg" 
                      alt="Luxury perfume bottle" 
                      className="w-full h-52 md:h-60 object-cover rounded-md"
                      style={{ 
                        boxShadow: '0 15px 25px rgba(0, 0, 0, 0.4)',
                        transition: 'all 0.5s ease'
                      }}
                      onError={(e) => {
                        e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500' preserveAspectRatio='none'%3E%3Cg%3E%3Ctext style='font-family:Arial;font-size:20px;font-weight:bold;dominant-baseline:middle;text-anchor:middle;fill:rgba(100,100,100,0.8)' x='50%25' y='50%25'%3ELuxury Perfume%3C/text%3E%3C/g%3E%3C/svg%3E";
                      }}
                    />
                    
                    {/* Shine effect */}
                    <div 
                      className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 rounded-md"
                      style={{ 
                        transform: 'translateX(-100%)', 
                        transition: 'all 0.6s ease',
                      }}
                    />
                    
                    {/* Product badge */}
                    <div 
                      className="absolute top-3 right-3 px-3 py-1 text-xs font-semibold"
                      style={{ 
                        background: enhancedLuxuryTheme.colors.gradients.gold,
                        color: '#000',
                        borderRadius: '2px'
                      }}
                    >
                      EXCLUSIVE
                    </div>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <h3 
                      className="text-xl font-bold text-white mb-1"
                      style={{ fontFamily: enhancedLuxuryTheme.typography.fontFamily.heading }}
                    >
                      Royal Essence
                    </h3>
                    <p 
                      className="text-gold/80 text-sm"
                      style={{ fontFamily: enhancedLuxuryTheme.typography.fontFamily.accent }}
                    >
                      Limited Edition Collection
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Product Card */}
            <motion.div
              className="w-full md:w-2/5 z-10 mt-8 md:mt-12"
              initial={{ opacity: 0, x: 50, rotateY: 15 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              whileHover={{ 
                scale: 1.03, 
                rotateY: -5, 
                rotateX: -2,
                transition: { duration: 0.3 }
              }}
            >
              <div 
                className="relative rounded-lg overflow-hidden group"
                style={{ 
                  background: 'rgba(30, 30, 34, 0.6)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(212, 175, 55, 0.1)',
                  transform: 'perspective(1000px)'
                }}
              >
                {/* Gold corner accents */}
                <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-gold/40"></div>
                <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-gold/40"></div>
                
                {/* Product image */}
                <div className="p-6 md:p-8">
                  <div className="relative">
                    <img 
                      src="src/assets/More than an accessory ⌚_ Learn about the craftsmanship behind women’s luxury watches_.jpeg" 
                      alt="Luxury gift box" 
                      className="w-full h-52 md:h-60 object-cover rounded-md"
                      style={{ 
                        boxShadow: '0 15px 25px rgba(0, 0, 0, 0.4)',
                        transition: 'all 0.5s ease'
                      }}
                      onError={(e) => {
                        e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500' preserveAspectRatio='none'%3E%3Cg%3E%3Ctext style='font-family:Arial;font-size:20px;font-weight:bold;dominant-baseline:middle;text-anchor:middle;fill:rgba(100,100,100,0.8)' x='50%25' y='50%25'%3ELuxury Gift Box%3C/text%3E%3C/g%3E%3C/svg%3E";
                      }}
                    />
                    
                    {/* Shine effect */}
                    <div 
                      className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 rounded-md"
                      style={{ 
                        transform: 'translateX(-100%)', 
                        transition: 'all 0.6s ease',
                      }}
                    />
                    
                    {/* Product badge */}
                    <div 
                      className="absolute top-3 right-3 px-3 py-1 text-xs font-semibold"
                      style={{ 
                        background: enhancedLuxuryTheme.colors.gradients.roseGold,
                        color: '#fff',
                        borderRadius: '2px'
                      }}
                    >
                      PREMIUM
                    </div>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <h3 
                      className="text-xl font-bold text-white mb-1"
                      style={{ fontFamily: enhancedLuxuryTheme.typography.fontFamily.heading }}
                    >
                      Opulent Collection
                    </h3>
                    <p 
                      className="text-gold/80 text-sm"
                      style={{ fontFamily: enhancedLuxuryTheme.typography.fontFamily.accent }}
                    >
                      Handcrafted Excellence
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
            
            <div className="w-24 h-px mx-auto bg-gradient-to-r from-transparent via-gold to-transparent my-6"></div>
          </motion.div>
        </div> 
        
        
       </section> 

    {/* Featured Products Section */}
      <section className="py-20" style={{ backgroundColor: enhancedLuxuryTheme.colors.neutral.medium }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
            >
              <h2 
                className="text-3xl md:text-4xl font-bold mb-4 text-white"
                style={{ fontFamily: enhancedLuxuryTheme.typography.fontFamily.heading }}
              >
                <span className="text-gradient-gold">Curated</span> Collection
              </h2>
              <div className="w-24 h-px mx-auto bg-gradient-to-r from-transparent via-gold to-transparent my-6"></div>
              <p 
                className="text-gray-400 max-w-2xl mx-auto"
                style={{ fontFamily: enhancedLuxuryTheme.typography.fontFamily.body }}
              >
                Discover our most exquisite and sought-after gifts, meticulously selected for those with discerning taste.
              </p>
            </motion.div>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {featuredProducts.map((product) => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
          
          <div className="text-center mt-16">
            <Link 
              to="/products" 
              className="btn-luxury px-8 py-3"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>
      
            <Suspense fallback={
              <div className="w-full h-[300px] flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-2 border-gold border-t-transparent animate-spin"></div>
              </div>
            }>
              <ElegantGiftBoxes 
                leftProductImage={luxuryWatch}
                rightProductImage={luxuryPerfume}
                leftProductName="Luxury Watch"
                rightProductName="Valentino Perfume"
                leftProductPrice="$1,299"
                rightProductPrice="$899"
              />
            </Suspense>*

      {/* Categories Section */}
      <section className="py-20 container mx-auto px-4 md:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 
            className="text-3xl md:text-4xl font-bold mb-4 text-white"
            style={{ fontFamily: enhancedLuxuryTheme.typography.fontFamily.heading }}
          >
            <span className="text-white">Shop by</span> <span className="text-gradient-gold">Category</span>
          </h2>
          <div className="w-24 h-px mx-auto bg-gradient-to-r from-transparent via-gold to-transparent my-6"></div>
          <p 
            className="text-gray-400 max-w-2xl mx-auto"
            style={{ fontFamily: enhancedLuxuryTheme.typography.fontFamily.body }}
          >
            Explore our carefully organized collections to find the perfect gift for every occasion
          </p>
        </motion.div>
        
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-gray-800 rounded-xl h-32 animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {displayedCategories.map((category) => (
              <motion.div key={category.id} variants={itemVariants}>
                <CategoryCard category={category} />
              </motion.div>
            ))}
          </motion.div>
        )}
        
        <div className="text-center mt-12">
          <Link 
            to="/products" 
            className="inline-block text-gold font-medium hover:text-gold/80 transition-colors gold-underline"
          >
            View All Categories
          </Link>
        </div>
      </section>
      
      <section className="py-20 bg-gradient-to-b from-rich-black-light to-rich-black">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ fontFamily: enhancedLuxuryTheme.typography.fontFamily.heading }}
            >
              <span className="text-white">Client</span> <span className="text-gradient-gold">Testimonials</span>
            </h2>
            <div className="w-24 h-px mx-auto bg-gradient-to-r from-transparent via-gold to-transparent my-6"></div>
            <p 
              className="text-gray-400 max-w-2xl mx-auto"
              style={{ fontFamily: enhancedLuxuryTheme.typography.fontFamily.body }}
            >
              Discover what our distinguished clientele has to say about their experience with our luxury gifts
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <motion.div 
                key={testimonial.id} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <TestimonialCard testimonial={testimonial} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Luxury Shopping Experience Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 
              className="text-3xl md:text-4xl font-bold mb-6"
              style={{ fontFamily: enhancedLuxuryTheme.typography.fontFamily.heading }}
            >
              <span className="text-white">Elevate Your</span> <br/>
              <span className="text-gradient-gold">Gift-Giving Experience</span>
            </h2>
            
            <div className="w-24 h-px bg-gradient-to-r from-gold via-gold to-transparent mb-8"></div>
            
            <p className="text-gray-300 mb-6 luxury-text">
              Our curated collection of luxury gifts represents the pinnacle of sophistication and elegance. Each item is meticulously selected to ensure it meets our exacting standards of quality and craftsmanship.
            </p>
            
            <p className="text-gray-400 mb-8 luxury-text">
              From personalized concierge service to elegant gift wrapping, we ensure that every aspect of your shopping experience is as exceptional as the gifts themselves.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/about" className="btn-luxury btn-luxury-filled px-6 py-3">
                Our Philosophy
              </Link>
              <Link to="/contact" className="btn-luxury px-6 py-3">
                Contact Us
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 overflow-hidden rounded-lg shadow-xl" 
                 style={{ boxShadow: '0 15px 30px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(212, 175, 55, 0.1)' }}>
              <img 
                src="src/assets/happy cust.png" 
                alt="Luxury shopping experience" 
                className="w-full h-auto object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600' preserveAspectRatio='none'%3E%3Cg%3E%3Ctext style='font-family:Arial;font-size:30px;font-weight:bold;dominant-baseline:middle;text-anchor:middle;fill:rgba(100,100,100,0.8)' x='50%25' y='50%25'%3ELuxury Shopping Experience%3C/text%3E%3C/g%3E%3C/svg%3E";
                }}
              />
              
              {/* Gold corner accents */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-gold/60"></div>
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-gold/60"></div>
            </div>
            
            {/* Background decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-2/3 h-2/3 rounded-lg border-2 border-gold/20 -z-10"></div>
            <div className="absolute -top-6 -left-6 w-2/3 h-2/3 rounded-lg border-2 border-gold/10 -z-10"></div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-gradient-to-b from-rich-black to-rich-black-light">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto bg-rich-black-light/80 p-8 md:p-12 rounded-xl border border-gold/10" 
               style={{ boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(212, 175, 55, 0.05)' }}>
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 
                className="text-2xl md:text-3xl font-bold mb-4"
                style={{ fontFamily: enhancedLuxuryTheme.typography.fontFamily.heading }}
              >
                <span className="text-white">Subscribe to Our</span> <span className="text-gradient-gold">Newsletter</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Be the first to receive exclusive offers, new collection announcements, and luxury insights
              </p>
            </motion.div>
            
            <motion.form 
              className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-grow bg-rich-black border border-gold/30 text-white px-4 py-3 rounded-md focus:outline-none focus:border-gold transition-colors"
                required
              />
              <button 
                type="submit" 
                className="btn-luxury btn-luxury-filled px-6 py-3 whitespace-nowrap"
              >
                Subscribe Now
              </button>
            </motion.form>
            
            <motion.p 
              className="text-gray-500 text-sm text-center mt-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              By subscribing, you agree to our Privacy Policy and consent to receive our promotional emails
            </motion.p>
          </div>
        </div>
      </section>

      {/* Back to top button */}
      <motion.button
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-gold/90 text-black flex items-center justify-center shadow-lg z-50 hover:bg-gold transition-colors"
        onClick={scrollToTop}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -3 }}
        aria-label="Back to top"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </motion.button>
    </div>
  );
}
