import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { luxuryTheme } from "../styles/luxuryTheme";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { isAuthenticated } = useAuth();

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
    <footer className="bg-gradient-to-b from-gray-900 to-black pt-16 pb-8 mt-24 border-t border-gold/10">
      <div className="container mx-auto px-4 relative">
        {/* Gold accent line at top */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-px w-48 h-px bg-gradient-to-r from-transparent via-gold to-transparent"></div>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Brand Column */}
          <motion.div variants={itemVariants} className="space-y-5">
            <Link to="/" className="inline-block">
              <h2 className="text-2xl font-bold flex items-center" style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}>
                <span className="text-gold mr-2">✦</span>
                <span className="bg-gradient-to-r from-gold-light via-gold to-gold-light text-transparent bg-clip-text">GiftNest</span>
              </h2>
            </Link>
            <p className="text-gray-400 text-sm" style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}>
              Exquisite gifts for discerning tastes, delivered with elegance and sophistication.
            </p>
            <div className="flex space-x-5 mt-4">
              <SocialIcon icon="facebook" />
              <SocialIcon icon="instagram" />
              <SocialIcon icon="twitter" />
              <SocialIcon icon="pinterest" />
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-gold font-medium mb-6 text-sm tracking-widest uppercase" style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}>Quick Links</h3>
            <ul className="space-y-3">
              <FooterLink to="/" label="Home" />
              <FooterLink to="/products" label="Shop All" />
              <FooterLink to="/about" label="About Us" />
              <FooterLink to="/contact" label="Contact" />
            </ul>
          </motion.div>

          {/* Categories */}
          <motion.div variants={itemVariants}>
            <h3 className="text-gold font-medium mb-6 text-sm tracking-widest uppercase" style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}>Collections</h3>
            <ul className="space-y-3">
              <FooterLink to="/products?category=Love" label="Love & Romance" />
              <FooterLink to="/products?category=Birthday" label="Birthday Gifts" />
              <FooterLink to="/products?category=Wellness" label="Wellness & Spa" />
              <FooterLink to="/products?category=Personalized" label="Personalized Gifts" />
              <FooterLink to="/products?category=Seasonal" label="Seasonal Gifts" />
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div variants={itemVariants}>
            <h3 className="text-gold font-medium mb-6 text-sm tracking-widest uppercase" style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}>Exclusive Updates</h3>
            <p className="text-gray-400 text-sm mb-5" style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}>
              Subscribe for exclusive offers and curated gift inspirations.
            </p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full px-4 py-3 bg-gray-900 border border-gold/20 text-gray-300 focus:outline-none focus:border-gold/50 transition-colors rounded-none"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              />
              <button 
                className="absolute right-0 top-0 h-full px-4 text-sm uppercase tracking-wider text-black bg-gold hover:bg-gold-light transition-colors flex items-center justify-center"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                Subscribe
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Gold divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent my-12"></div>
        
        {/* Seller/Admin Section */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Link 
            to="/signup?role=seller"
            className="px-4 py-2 bg-gold/10 border border-gold/30 text-gold hover:bg-gold/20 transition-all duration-300 text-sm"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
          >
            Become a Seller
          </Link>
          
          <Link 
            to="/signup?role=admin"
            className="px-4 py-2 bg-neutral-800 border border-gold/20 text-white hover:bg-neutral-700 transition-all duration-300 text-sm"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
          >
            Apply for Admin
          </Link>
          
          <Link 
            to="/signup?role=super_admin"
            className="px-4 py-2 bg-purple-900/30 border border-purple-500/30 text-purple-300 hover:bg-purple-900/50 transition-all duration-300 text-sm"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
          >
            Super Admin
          </Link>
        </div>
        
        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-500 mb-6 md:mb-0" style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}>
            © {currentYear} <span className="text-gold">GiftNest</span>. All rights reserved.
          </p>
          <div className="flex space-x-8">
            <Link to="/privacy" className="text-xs text-gray-500 hover:text-gold transition-colors uppercase tracking-wider" style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}>
              Privacy
            </Link>
            <Link to="/terms" className="text-xs text-gray-500 hover:text-gold transition-colors uppercase tracking-wider" style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}>
              Terms
            </Link>
            <Link to="/shipping" className="text-xs text-gray-500 hover:text-gold transition-colors uppercase tracking-wider" style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}>
              Shipping
            </Link>
          </div>
        </div>
        
        {/* Gold accent line at bottom */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-px w-24 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent"></div>
      </div>
    </footer>
  );
}

// Footer link component
function FooterLink({ to, label }) {
  return (
    <li>
      <Link 
        to={to} 
        className="text-gray-400 hover:text-gold transition-colors text-sm relative group flex items-center"
        style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
      >
        <span className="absolute left-0 bottom-0 w-0 h-px bg-gold opacity-0 group-hover:w-full group-hover:opacity-100 transition-all duration-300"></span>
        {label}
      </Link>
    </li>
  );
}

// Social icon component
function SocialIcon({ icon }) {
  const getIcon = () => {
    switch (icon) {
      case "facebook":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
          </svg>
        );
      case "instagram":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
          </svg>
        );
      case "twitter":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
          </svg>
        );
      case "pinterest":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 0c-6.627 0-12 5.373-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" fillRule="evenodd" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <a 
      href={`#${icon}`} 
      className="text-gray-500 hover:text-gold transition-colors relative group"
      aria-label={`Follow us on ${icon}`}
    >
      <div className="absolute inset-0 rounded-full border border-gold/0 group-hover:border-gold/30 transition-all duration-300"></div>
      <div className="relative z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-900 group-hover:bg-gray-800 transition-colors duration-300">
        {getIcon()}
      </div>
    </a>
  );
}

