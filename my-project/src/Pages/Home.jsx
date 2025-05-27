import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useAnimation } from "framer-motion";
import { luxuryTheme } from "../styles/luxuryTheme";

// Components
import ProductCard from "../components/ProductCard";
import CategoryCard from "../components/CategoryCard";
import { ProductCardSkeleton } from "../components/Loader";

// Data
import products, { categories } from "../data/products";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [displayedCategories, setDisplayedCategories] = useState([]);
  
  // Refs for parallax scrolling
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  // Parallax effect values
  const heroImageY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const heroTextY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      // Get featured products
      const featured = products.filter(product => product.featured).slice(0, 4);
      setFeaturedProducts(featured);
      
      // Get main categories (excluding "all")
      const mainCategories = categories.filter(cat => cat.id !== "all").slice(0, 6);
      setDisplayedCategories(mainCategories);
      
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="pb-12" style={{ backgroundColor: luxuryTheme.colors.primary.dark }}>
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative overflow-hidden min-h-screen flex items-center justify-center py-16 md:py-24"
        style={{ 
          background: 'linear-gradient(135deg, #0A0A0A 0%, #121620 50%, #0A0A0A 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark luxury texture overlay */}
        <div 
          className="absolute inset-0 z-0 opacity-30" 
          style={{ 
            backgroundImage: 'url(https://www.transparenttextures.com/patterns/carbon-fibre.png)',
            mixBlendMode: 'overlay'
          }}
        />
        
        {/* Ambient lighting effects */}
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-gold/5 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gold/10 rounded-full blur-[80px] animate-pulse-slow" 
             style={{ animationDelay: '1s' }}/>
        
        {/* Gold accent lines */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-50" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-50" />
        
        {/* Main content container */}
        <div className="container mx-auto px-4 relative z-10 max-w-7xl ">
          {/* Hero title */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 
              className="text-3xl md:text-5xl font-bold mb-4 tracking-tight"
              style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
            >
              <span className="text-gradient-gold">Exquisite Gifts</span>
              <span className="block text-white mt-2">For Extraordinary Moments</span>
            </h1>
            <div className="w-24 h-px mx-auto bg-gradient-to-r from-transparent via-gold to-transparent my-6"></div>
          </motion.div>
          
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
                        background: luxuryTheme.colors.gradients.gold,
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
                      style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                    >
                      Royal Essence
                    </h3>
                    <p 
                      className="text-gold/80 text-sm"
                      style={{ fontFamily: luxuryTheme.typography.fontFamily.accent }}
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
                        background: luxuryTheme.colors.gradients.roseGold,
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
                      style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                    >
                      Opulent Collection
                    </h3>
                    <p 
                      className="text-gold/80 text-sm"
                      style={{ fontFamily: luxuryTheme.typography.fontFamily.accent }}
                    >
                      Handcrafted Excellence
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <Link 
              to="/products" 
              className="btn-luxury px-8 py-3 text-sm tracking-wider transform transition-transform active:scale-95"
              style={{
                boxShadow: '0 5px 15px rgba(212, 175, 55, 0.2)',
                transform: 'perspective(1px) translateZ(0)',
              }}
            >
              EXPLORE COLLECTION
            </Link>
            <Link 
              to="/about" 
              className="px-8 py-3 border border-gold/30 text-white hover:border-gold hover:text-gold  duration-300 text-sm tracking-wider transform transition-transform active:scale-95"
            >
              OUR STORY
            </Link>
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <span 
            className="text-white/70 text-sm mb-2" 
            style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
          >
            Scroll to discover
          </span>
          <motion.div 
            className="w-px h-10 bg-gold/50"
            animate={{ 
              scaleY: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          />
        </motion.div>
      </section>

      {/* Categories Section */}
      <section className="py-20 container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 
            className="text-3xl md:text-4xl font-bold mb-4 text-white"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
          >
            <span className="text-white">Shop by</span> <span className="text-gradient-gold">Category</span>
          </h2>
          <div className="w-24 h-px mx-auto bg-gradient-to-r from-transparent via-gold to-transparent my-6"></div>
          <p 
            className="text-gray-400 max-w-2xl mx-auto"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
          >
            Explore our carefully organized collections to find the perfect gift for every occasion
          </p>
        </motion.div>
        
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-gray-100 rounded-xl h-32 animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
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
            style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
          >
            View All Categories →
          </Link>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20" style={{ backgroundColor: luxuryTheme.colors.neutral.medium }}>
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
                style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
              >
                <span className="text-gradient-gold">Curated</span> Collection
              </h2>
              <div className="w-24 h-px mx-auto bg-gradient-to-r from-transparent via-gold to-transparent my-6"></div>
              <p 
                className="text-gray-400 max-w-2xl mx-auto"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
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

      {/* Testimonial/CTA Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="card-luxury rounded-lg shadow-xl overflow-hidden border border-gold/20">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <motion.div 
              className="p-8 md:p-12 flex flex-col justify-center"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center mb-4">
                <div className="flex text-gold">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <span className="ml-2 text-gold/80">5.0 (2,000+ reviews)</span>
              </div>
              <h2 
                className="text-2xl md:text-3xl font-bold mb-4 text-white"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
              >
                "The perfect gift for my anniversary. The packaging was exquisite and the delivery was impeccable."
              </h2>
              <p className="text-gray-400 mb-8" style={{ fontFamily: luxuryTheme.typography.fontFamily.accent }}>— Sarah T., Verified Customer</p>
              <Link 
                to="/products" 
                className="self-start btn-luxury px-6 py-3"
              >
                Find Your Perfect Gift
              </Link>
            </motion.div>
            
            <motion.div 
              className="flex items-center justify-center p-8"
              style={{ backgroundColor: luxuryTheme.colors.neutral.darkest }}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img 
                src="src/assets/happy cust.png" 
                alt="Happy customer with gift" 
                className="rounded-lg shadow-lg max-w-full h-auto"
                onError={(e) => {
                  e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='400' viewBox='0 0 500 400' preserveAspectRatio='none'%3E%3Cg%3E%3Ctext style='font-family:Arial;font-size:20px;font-weight:bold;dominant-baseline:middle;text-anchor:middle;fill:rgba(100,100,100,0.8)' x='50%25' y='50%25'%3EHappy Customer%3C/text%3E%3C/g%3E%3C/svg%3E";
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
