/**
 * Utility functions for handling form submissions and API requests
 */
import { toast } from 'react-toastify';

/**
 * Validate form data based on validation rules
 * @param {Object} formData - Form data to validate
 * @param {Object} validationRules - Validation rules
 * @returns {Object} - Validation result with isValid and errors
 */
export const validateForm = (formData, validationRules) => {
  const errors = {};
  let isValid = true;

  Object.keys(validationRules).forEach(field => {
    const value = formData[field];
    const rules = validationRules[field];

    // Required field validation
    if (rules.required && (!value || value.trim() === '')) {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      isValid = false;
    }

    // Email validation
    if (rules.email && value && !/\S+@\S+\.\S+/.test(value)) {
      errors[field] = 'Please enter a valid email address';
      isValid = false;
    }

    // Min length validation
    if (rules.minLength && value && value.length < rules.minLength) {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} must be at least ${rules.minLength} characters`;
      isValid = false;
    }

    // Max length validation
    if (rules.maxLength && value && value.length > rules.maxLength) {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} cannot exceed ${rules.maxLength} characters`;
      isValid = false;
    }

    // Pattern validation
    if (rules.pattern && value && !rules.pattern.test(value)) {
      errors[field] = rules.patternMessage || `Invalid ${field}`;
      isValid = false;
    }

    // Custom validation
    if (rules.custom && !rules.custom(value, formData)) {
      errors[field] = rules.customMessage || `Invalid ${field}`;
      isValid = false;
    }
  });

  return { isValid, errors };
};

/**
 * Handle form submission with API request
 * @param {Object} options - Options for form submission
 * @param {Function} options.apiCall - API function to call
 * @param {Object} options.formData - Form data to submit
 * @param {Object} options.validationRules - Validation rules
 * @param {Function} options.onSuccess - Callback on success
 * @param {Function} options.onError - Callback on error
 * @param {Function} options.setLoading - Function to set loading state
 * @param {Function} options.setErrors - Function to set error state
 * @returns {Promise} - Promise resolving to API response
 */
export const handleFormSubmit = async ({
  apiCall,
  formData,
  validationRules,
  onSuccess,
  onError,
  setLoading,
  setErrors
}) => {
  // Set loading state if provided
  if (setLoading) setLoading(true);
  
  try {
    // Validate form data if validation rules provided
    if (validationRules) {
      const { isValid, errors } = validateForm(formData, validationRules);
      
      if (!isValid) {
        if (setErrors) setErrors(errors);
        
        // Show first error as toast
        const firstError = Object.values(errors)[0];
        if (firstError) toast.error(firstError);
        
        if (setLoading) setLoading(false);
        return { success: false, errors };
      }
    }
    
    // Call API
    const response = await apiCall(formData);
    
    // Handle success
    if (response && response.success) {
      if (onSuccess) onSuccess(response);
      return response;
    } else {
      // Handle API response that indicates failure
      const errorMessage = response?.message || 'Operation failed';
      toast.error(errorMessage);
      
      if (onError) onError(response);
      return response;
    }
  } catch (error) {
    console.error('Form submission error:', error);
    
    // Extract error message
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message || 
                        'An unexpected error occurred';
    
    toast.error(errorMessage);
    
    // Set form errors if available
    if (error.response?.data?.errors && setErrors) {
      setErrors(error.response.data.errors);
    }
    
    if (onError) onError(error);
    
    return { 
      success: false, 
      message: errorMessage,
      error
    };
  } finally {
    // Reset loading state
    if (setLoading) setLoading(false);
  }
};

/**
 * Format form data for API submission
 * @param {Object} formData - Raw form data
 * @param {Array} excludeFields - Fields to exclude
 * @returns {Object} - Formatted form data
 */
export const formatFormData = (formData, excludeFields = []) => {
  const formatted = {};
  
  Object.keys(formData).forEach(key => {
    // Skip excluded fields
    if (excludeFields.includes(key)) return;
    
    // Skip empty values
    if (formData[key] === '' || formData[key] === null || formData[key] === undefined) return;
    
    // Trim string values
    if (typeof formData[key] === 'string') {
      formatted[key] = formData[key].trim();
    } else {
      formatted[key] = formData[key];
    }
  });
  
  return formatted;
};
