import React from 'react';
import { motion } from 'framer-motion';
import enhancedLuxuryTheme from '../styles/enhancedLuxuryTheme';

const TestimonialCard = ({ testimonial }) => {
  return (
    <motion.div 
      className="bg-rich-black-light/80 p-6 md:p-8 rounded-lg border border-gold/20 h-full"
      style={{ 
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(212, 175, 55, 0.05)',
        backdropFilter: 'blur(10px)'
      }}
      whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(212, 175, 55, 0.1)' }}
      transition={{ duration: 0.3 }}
    >
      {/* Quote icon */}
      <div className="text-gold/30 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
        </svg>
      </div>
      
      {/* Testimonial text */}
      <p 
        className="text-gray-300 mb-6 italic"
        style={{ fontFamily: enhancedLuxuryTheme.typography.fontFamily.body }}
      >
        {testimonial.text}
      </p>
      
      {/* Divider */}
      <div className="w-12 h-px bg-gradient-to-r from-gold/40 to-transparent mb-4"></div>
      
      {/* Author info */}
      <div className="flex items-center">
        <div 
          className="w-12 h-12 rounded-full overflow-hidden mr-4 border border-gold/30"
          style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }}
        >
          <img 
            src={testimonial.avatar || 'src/assets/default-avatar.jpg'} 
            alt={testimonial.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100' preserveAspectRatio='none'%3E%3Cg%3E%3Ccircle cx='50' cy='50' r='48' fill='%23333' /%3E%3Ctext style='font-family:Arial;font-size:15px;font-weight:bold;dominant-baseline:middle;text-anchor:middle;fill:%23gold' x='50%25' y='50%25'%3E{testimonial.name.charAt(0)}%3C/text%3E%3C/g%3E%3C/svg%3E";
            }}
          />
        </div>
        <div>
          <h4 
            className="text-white font-semibold"
            style={{ fontFamily: enhancedLuxuryTheme.typography.fontFamily.heading }}
          >
            {testimonial.name}
          </h4>
          <p className="text-gold/70 text-sm">{testimonial.title}</p>
        </div>
      </div>
      
      {/* Rating stars if available */}
      {testimonial.rating && (
        <div className="flex mt-4">
          {[...Array(5)].map((_, i) => (
            <svg 
              key={i} 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill={i < testimonial.rating ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="1"
              className={i < testimonial.rating ? 'text-gold' : 'text-gray-600'}
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default TestimonialCard;
