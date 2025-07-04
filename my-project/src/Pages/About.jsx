import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { luxuryTheme } from "../styles/luxuryTheme";

export default function About() {
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
              About <span className="text-gold">GiftNest</span>
            </motion.h1>
            <motion.p 
              className="text-lg text-gray-300 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
            >
              Curating the perfect gifts for every occasion since 2020
            </motion.p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-gold/5 rounded-full opacity-30 blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-gold/5 rounded-full opacity-30 blur-3xl" />
        </div>

       {/* Our Story */}
<motion.div 
  className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16"
  variants={containerVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.2 }}
>
  {/* Left Side - Text */}
  <motion.div variants={itemVariants}>
    <h2 
      className="text-3xl font-bold mb-6 text-gold"
      style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
    >
      Our Story
    </h2>
    <div className="space-y-4 text-gray-300" style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}>
      <p>
        GiftNest was founded in 2020 with a simple mission: to help people find the perfect gifts for their loved ones. We believe that gift-giving is an art, and we're here to make it easier and more meaningful.
      </p>
      <p>
        What started as a small online store has grown into a curated marketplace of unique, thoughtful gifts for every occasion. We work with artisans, designers, and brands who share our passion for quality and craftsmanship.
      </p>
      <p>
        Every gift in our collection is carefully selected to ensure it meets our standards of quality, uniqueness, and thoughtfulness. We believe that the best gifts are those that show you truly understand and appreciate the recipient.
      </p>
    </div>
  </motion.div>

  {/* Right Side - Image */}
  <motion.div variants={itemVariants} className="relative aspect-square w-full max-w-md mx-auto">
    <div className="absolute inset-0 border border-gold/30 transform rotate-3 scale-105 rounded-xl" />
    <img 
      src="/assets/our story.png" 
      alt="Our team selecting gifts" 
      className="relative z-10 w-full h-full object-cover border border-gold/20 rounded-xl"
      onError={(e) => {
        e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400' preserveAspectRatio='none'%3E%3Cg%3E%3Ctext style='font-family:Arial;font-size:24px;font-weight:bold;dominant-baseline:middle;text-anchor:middle;fill:rgba(100,100,100,0.8)' x='50%25' y='50%25'%3EOur Story%3C/text%3E%3C/g%3E%3C/svg%3E";
      }}
    />
  </motion.div>
</motion.div>


        {/* Our Values */}
        <motion.div 
          className="mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.h2 
            className="text-3xl font-bold mb-8 text-center text-gold"
            variants={itemVariants}
            style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
          >
            Our Values
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-gray-900/50 border border-gold/10 p-6 text-center"
              variants={itemVariants}
            >
              <div className="w-16 h-16 bg-gray-800 border border-gold/30 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 
                className="text-xl font-semibold mb-2 text-white"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
              >
                Quality
              </h3>
              <p 
                className="text-gray-400"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                We carefully select each item in our collection to ensure it meets our high standards of quality and craftsmanship.
              </p>
            </motion.div>
            <motion.div 
              className="bg-gray-900/50 border border-gold/10 p-6 text-center"
              variants={itemVariants}
            >
              <div className="w-16 h-16 bg-gray-800 border border-gold/30 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                </svg>
              </div>
              <h3 
                className="text-xl font-semibold mb-2 text-white"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
              >
                Uniqueness
              </h3>
              <p 
                className="text-gray-400"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                We seek out unique, thoughtful gifts that you won't find everywhere else, ensuring your gift stands out.
              </p>
            </motion.div>
            <motion.div 
              className="bg-gray-900/50 border border-gold/10 p-6 text-center"
              variants={itemVariants}
            >
              <div className="w-16 h-16 bg-gray-800 border border-gold/30 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 
                className="text-xl font-semibold mb-2 text-white"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
              >
                Thoughtfulness
              </h3>
              <p 
                className="text-gray-400"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                We believe the best gifts show thoughtfulness and consideration, creating meaningful connections between people.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Team Section */}
<motion.div 
  className="mb-16"
  variants={containerVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.2 }}
>
  <motion.h2 
    className="text-3xl font-bold mb-8 text-center text-gold"
    variants={itemVariants}
    style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
  >
    Meet Our Team
  </motion.h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
    {[
      { name: "Kanchi saw", title: "Founder & CEO", image: "/assets/50 Times Makeup Artists Pushed The Boundaries Of Creativity.jpg" },
      { name: "Aditi choubey", title: "Creative Director", image: "/assets/download (12).jpg" },
      { name: "Rohit bouri", title: "Api tester", image: "/assets/Leonardo.jpg" },
      { name: "Rohit sharma", title: "Analyst and report writer", image: "/assets/download (13).jpg" }
    ].map((member, index) => (
      <motion.div 
        key={index}
        className="bg-gray-900/50 border border-gold/10 overflow-hidden"
        variants={itemVariants}
      >
        <div className="aspect-square bg-gray-800 relative">
          <div className="absolute inset-0 border border-gold/20"></div>
          <img 
            src={member.image} 
            alt={member.name} 
            className="w-full h-full object-cover object-top"  // aligned image from top
            onError={(e) => {
              e.target.src = `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300' preserveAspectRatio='none'%3E%3Cg%3E%3Ctext style='font-family:Arial;font-size:16px;font-weight:bold;dominant-baseline:middle;text-anchor:middle;fill:rgba(100,100,100,0.8)' x='50%25' y='50%25'%3E${member.name}%3C/text%3E%3C/g%3E%3C/svg%3E`;
            }}
          />
        </div>
        <div className="p-4 text-center">
          <h3 
            className="text-lg font-semibold mb-1 text-white"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
          >
            {member.name}
          </h3>
          <p 
            className="text-gray-400"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
          >
            {member.title}
          </p>
        </div>
      </motion.div>
    ))}
  </div>
</motion.div>


        {/* CTA Section */}
        <motion.div 
          className="bg-gray-900/50 border border-gold/20 p-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 
            className="text-2xl md:text-3xl font-bold mb-4 text-gold"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
          >
            Ready to Find the Perfect Gift?
          </h2>
          <p 
            className="text-gray-300 mb-8 max-w-2xl mx-auto"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
          >
            Browse our curated collection of unique, thoughtful gifts for every occasion and person in your life.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              to="/products" 
              className="px-8 py-3 bg-gold text-black hover:bg-gold-light transition-all duration-300"
              style={{ fontFamily: luxuryTheme.typography.fontFamily.body, letterSpacing: '1px' }}
            >
              <span className="uppercase text-sm tracking-wider">Shop Now</span>
            </Link>
            <Link 
              to="/contact" 
              className="px-8 py-3 bg-transparent border border-gold text-gold hover:bg-gold hover:text-black transition-all duration-300"
              style={{ fontFamily: luxuryTheme.typography.fontFamily.body, letterSpacing: '1px' }}
            >
              <span className="uppercase text-sm tracking-wider">Contact Us</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
