import React from 'react';
import { motion } from 'framer-motion';
import { FiAlertTriangle } from 'react-icons/fi';
import { luxuryTheme } from '../styles/luxuryTheme';

const DeleteConfirmModal = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-neutral-900 border border-red-500/30 rounded-lg p-6 max-w-md w-full"
      >
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-red-900/30 flex items-center justify-center mr-3">
            <FiAlertTriangle className="text-red-500 text-xl" />
          </div>
          <h2 
            className="text-xl font-bold text-white"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
          >
            {title || 'Confirm Deletion'}
          </h2>
        </div>
        
        <p 
          className="text-gray-300 mb-6"
          style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
        >
          {message || 'Are you sure you want to delete this item? This action cannot be undone.'}
        </p>
        
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-neutral-700 text-white rounded-md transition-colors duration-300 hover:bg-neutral-600"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md transition-colors duration-300 hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DeleteConfirmModal;
