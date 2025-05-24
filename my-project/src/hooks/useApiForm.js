import { useState } from 'react';
import { toast } from 'react-toastify';
import { formatError } from '../utils/apiUtils';
import { validateForm } from '../utils/formUtils';

/**
 * Custom hook for handling form submissions with API integration
 * @param {Object} options - Hook options
 * @param {Function} options.apiCall - API function to call
 * @param {Object} options.initialData - Initial form data
 * @param {Object} options.validationRules - Validation rules
 * @param {Function} options.onSuccess - Callback on success
 * @param {Function} options.onError - Callback on error
 * @returns {Object} - Form state and handlers
 */
const useApiForm = ({
  apiCall,
  initialData = {},
  validationRules = {},
  onSuccess,
  onError
}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  const [response, setResponse] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle different input types
    const inputValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: inputValue
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  // Set a specific field value programmatically
  const setFieldValue = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  // Reset form to initial state
  const resetForm = () => {
    setFormData(initialData);
    setErrors({});
    setResponse(null);
  };
  
  // Validate form without submission
  const validateFormData = () => {
    const result = validateForm(formData, validationRules);
    setErrors(result.errors);
    return result.isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    setSubmitCount(prev => prev + 1);
    setLoading(true);
    
    try {
      // Validate form data
      const { isValid, errors: validationErrors } = validateForm(formData, validationRules);
      
      if (!isValid) {
        setErrors(validationErrors);
        
        // Show first error as toast
        const firstError = Object.values(validationErrors)[0];
        if (firstError) toast.error(firstError);
        
        setLoading(false);
        return;
      }
      
      // Call API
      const apiResponse = await apiCall(formData);
      setResponse(apiResponse);
      
      // Handle success
      if (apiResponse && apiResponse.success !== false) {
        if (apiResponse.message) {
          toast.success(apiResponse.message);
        } else {
          toast.success('Operation completed successfully');
        }
        
        if (onSuccess) onSuccess(apiResponse);
      } else {
        // Handle API response that indicates failure
        const errorMessage = apiResponse?.message || 'Operation failed';
        toast.error(errorMessage);
        
        if (apiResponse?.errors) {
          setErrors(apiResponse.errors);
        }
        
        if (onError) onError(apiResponse);
      }
      
      return apiResponse;
    } catch (error) {
      console.error('Form submission error:', error);
      
      // Format error
      const formattedError = formatError(error);
      toast.error(formattedError.message);
      
      // Set form errors if available
      if (formattedError.errors && Object.keys(formattedError.errors).length > 0) {
        setErrors(formattedError.errors);
      }
      
      if (onError) onError(error);
      
      return { 
        success: false, 
        message: formattedError.message,
        error
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    errors,
    loading,
    submitCount,
    response,
    handleChange,
    setFieldValue,
    handleSubmit,
    resetForm,
    validateFormData,
    setFormData,
    setErrors
  };
};

export default useApiForm;
