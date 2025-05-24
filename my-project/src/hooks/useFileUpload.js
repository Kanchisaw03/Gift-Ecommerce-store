import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../services/api/axiosConfig';

/**
 * Custom hook for handling file uploads with progress tracking
 * @param {Object} options - Hook options
 * @param {string} options.url - Upload URL
 * @param {boolean} options.multiple - Whether to allow multiple file uploads
 * @param {Array<string>} options.acceptedFileTypes - Accepted file types
 * @param {number} options.maxFileSize - Maximum file size in bytes
 * @returns {Object} - Hook state and functions
 */
const useFileUpload = ({
  url,
  multiple = false,
  acceptedFileTypes = ['image/jpeg', 'image/png', 'image/webp'],
  maxFileSize = 5 * 1024 * 1024 // 5MB
} = {}) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  /**
   * Validate file
   * @param {File} file - File to validate
   * @returns {boolean} - Whether file is valid
   */
  const validateFile = useCallback(
    (file) => {
      // Check file type
      if (!acceptedFileTypes.includes(file.type)) {
        setError(`File type ${file.type} is not supported`);
        toast.error(`File type ${file.type} is not supported`);
        return false;
      }

      // Check file size
      if (file.size > maxFileSize) {
        setError(`File size exceeds ${maxFileSize / (1024 * 1024)}MB limit`);
        toast.error(`File size exceeds ${maxFileSize / (1024 * 1024)}MB limit`);
        return false;
      }

      return true;
    },
    [acceptedFileTypes, maxFileSize]
  );

  /**
   * Handle file selection
   * @param {Event} event - File input change event
   */
  const handleFileSelect = useCallback(
    (event) => {
      const selectedFiles = Array.from(event.target.files);
      
      // Validate files
      const validFiles = selectedFiles.filter(validateFile);
      
      if (validFiles.length === 0) {
        return;
      }
      
      // Set files state
      if (multiple) {
        setFiles((prevFiles) => [...prevFiles, ...validFiles]);
      } else {
        setFiles(validFiles.slice(0, 1));
      }
      
      // Reset form to allow selecting the same file again
      event.target.value = '';
    },
    [multiple, validateFile]
  );

  /**
   * Remove file from selection
   * @param {number} index - File index to remove
   */
  const removeFile = useCallback((index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  }, []);

  /**
   * Clear all selected files
   */
  const clearFiles = useCallback(() => {
    setFiles([]);
  }, []);

  /**
   * Upload files
   * @param {Object} additionalData - Additional form data
   * @returns {Promise<Array>} - Uploaded files data
   */
  const uploadFiles = useCallback(
    async (additionalData = {}) => {
      if (files.length === 0) {
        setError('No files selected');
        toast.error('No files selected');
        return [];
      }

      setUploading(true);
      setProgress(0);
      setError(null);

      try {
        const formData = new FormData();
        
        // Append files
        if (multiple) {
          files.forEach((file) => {
            formData.append('files', file);
          });
        } else {
          formData.append('file', files[0]);
        }
        
        // Append additional data
        Object.entries(additionalData).forEach(([key, value]) => {
          formData.append(key, value);
        });

        // Upload files
        const response = await axiosInstance.post(url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          }
        });

        // Set uploaded files
        const uploadedFilesData = response.data.data || response.data;
        setUploadedFiles(uploadedFilesData);
        
        // Show success message
        toast.success('Files uploaded successfully');
        
        // Clear selected files
        setFiles([]);
        
        return uploadedFilesData;
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'File upload failed';
        setError(errorMessage);
        toast.error(errorMessage);
        return [];
      } finally {
        setUploading(false);
      }
    },
    [files, multiple, url]
  );

  return {
    files,
    uploading,
    progress,
    error,
    uploadedFiles,
    handleFileSelect,
    removeFile,
    clearFiles,
    uploadFiles
  };
};

export default useFileUpload;
