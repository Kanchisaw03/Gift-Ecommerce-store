import { useState } from "react";
import { motion } from "framer-motion";
import { luxuryTheme } from "../styles/luxuryTheme";

export default function Contact() {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  // Form status
  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null }
  });
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus(prevStatus => ({ ...prevStatus, submitting: true }));
    
    // Simulate API call
    setTimeout(() => {
      setStatus({
        submitted: true,
        submitting: false,
        info: { error: false, msg: "Message sent successfully!" }
      });
      
      // Reset form after successful submission
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setStatus({
          submitted: false,
          submitting: false,
          info: { error: false, msg: null }
        });
      }, 5000);
    }, 2000);
  };
  
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="pt-24 pb-12 min-h-screen w-full" style={{ backgroundColor: luxuryTheme.colors.primary.dark }}>
      <div className="container mx-auto px-4 w-full">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gray-900/30 border border-gold/10 py-16 px-8 mb-16">
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-6 text-white"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
            >
              Contact <span className="text-gold">GiftNest</span>
            </motion.h1>
            <motion.p 
              className="text-lg text-gray-300 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
            >
              We'd love to hear from you! Reach out with any questions, suggestions, or feedback.
            </motion.p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-gold/5 rounded-full opacity-30 blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-gold/5 rounded-full opacity-30 blur-3xl" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-16">
          {/* Contact Information */}
          <motion.div 
            className="lg:col-span-2"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.h2 
              className="text-3xl font-bold mb-6 text-gold"
              variants={itemVariants}
              style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
            >
              Get In Touch
            </motion.h2>
            
            <motion.div 
              className="space-y-8"
              variants={itemVariants}
            >
              <div className="flex items-start">
                <div className="w-12 h-12 bg-gray-800 border border-gold/30 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 
                    className="text-lg font-semibold mb-1 text-white"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                  >
                    Email
                  </h3>
                  <p className="text-gray-400" style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}>support@giftnest.com</p>
                  <p className="text-gray-400" style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}>info@giftnest.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 bg-gray-800 border border-gold/30 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 
                    className="text-lg font-semibold mb-1 text-white"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                  >
                    Phone
                  </h3>
                  <p className="text-gray-400" style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}>+1 (555) 123-4567</p>
                  <p className="text-gray-400" style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}>Monday-Friday, 9am-5pm EST</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 bg-gray-800 border border-gold/30 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 
                    className="text-lg font-semibold mb-1 text-white"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                  >
                    Location
                  </h3>
                  <p className="text-gray-400" style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}>123 Gift Street</p>
                  <p className="text-gray-400" style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}>New York, NY 10001</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="mt-12"
              variants={itemVariants}
            >
              <h3 
                className="text-lg font-semibold mb-4 text-white"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
              >
                Connect With Us
              </h3>
              <div className="flex space-x-4">
                <a 
                  href="#" 
                  className="w-10 h-10 bg-gray-800 border border-gold/30 flex items-center justify-center text-gold hover:bg-gray-700 hover:border-gold transition-all duration-300"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-gray-800 border border-gold/30 flex items-center justify-center text-gold hover:bg-gray-700 hover:border-gold transition-all duration-300"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-gray-800 border border-gold/30 flex items-center justify-center text-gold hover:bg-gray-700 hover:border-gold transition-all duration-300"
                  aria-label="Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-gray-800 border border-gold/30 flex items-center justify-center text-gold hover:bg-gray-700 hover:border-gold transition-all duration-300"
                  aria-label="Pinterest"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 0c-6.627 0-12 5.373-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" fillRule="evenodd" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Contact Form */}
          <motion.div 
            className="lg:col-span-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div 
              className="bg-gray-900/50 border border-gold/10 overflow-hidden"
              variants={itemVariants}
            >
              <div className="p-6 border-b border-gold/10">
                <h2 
                  className="text-xl font-semibold text-gold"
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                >
                  Send Us a Message
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label 
                      className="block text-sm font-medium text-gray-300 mb-2"
                      style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                    >
                      Your Name*
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800 border border-gold/20 text-white focus:outline-none focus:border-gold/50"
                      style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                    />
                  </div>
                  <div>
                    <label 
                      className="block text-sm font-medium text-gray-300 mb-2"
                      style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                    >
                      Your Email*
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800 border border-gold/20 text-white focus:outline-none focus:border-gold/50"
                      style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                    />
                  </div>
                </div>
                
                <div>
                  <label 
                    className="block text-sm font-medium text-gray-300 mb-2"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                  >
                    Subject*
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gold/20 text-white focus:outline-none focus:border-gold/50"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                  />
                </div>
                
                <div>
                  <label 
                    className="block text-sm font-medium text-gray-300 mb-2"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                  >
                    Message*
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-gray-800 border border-gold/20 text-white focus:outline-none focus:border-gold/50"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                  ></textarea>
                </div>
                
                <div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-8 py-3 bg-transparent border border-gold text-gold hover:bg-gold hover:text-black transition-all duration-300 w-full sm:w-auto"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.body, letterSpacing: '1px' }}
                    disabled={status.submitting}
                  >
                    {status.submitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      "Send Message"
                    )}
                  </motion.button>
                  
                  {status.info.msg && (
                    <div className={`mt-4 p-4 rounded-md ${status.info.error ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                      {status.info.msg}
                    </div>
                  )}
                </div>
              </form>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Map Section */}
        <motion.div 
          className="rounded-xl overflow-hidden shadow-sm h-96 bg-gray-100"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Placeholder for map - in a real app, you would integrate Google Maps or similar */}
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-gray-600">Map integration would be here</p>
              <p className="text-gray-500 text-sm">123 Gift Street, New York, NY 10001</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
