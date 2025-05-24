import { useState, useCallback } from 'react';
import useApi from './useApi';

/**
 * Custom hook for handling form state and submission
 * @param {Object} options - Hook options
 * @param {Object} options.initialValues - Initial form values
 * @param {Function} options.validationSchema - Yup validation schema
 * @param {Function} options.onSubmit - Form submission handler
 * @param {boolean} options.showSuccessToast - Whether to show success toast
 * @param {boolean} options.showErrorToast - Whether to show error toast
 * @param {string} options.successMessage - Success message to show
 * @returns {Object} - Hook state and functions
 */
const useForm = ({
  initialValues = {},
  validationSchema = null,
  onSubmit,
  showSuccessToast = true,
  showErrorToast = true,
  successMessage = 'Form submitted successfully'
}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // Use the useApi hook for API calls if onSubmit is an API function
  const { loading, error, execute } = useApi(onSubmit, {
    showSuccessToast,
    showErrorToast,
    successMessage
  });

  /**
   * Validate form values
   * @param {Object} formValues - Form values to validate
   * @returns {Object} - Validation errors
   */
  const validateForm = useCallback(
    async (formValues) => {
      if (!validationSchema) return {};

      try {
        await validationSchema.validate(formValues, { abortEarly: false });
        return {};
      } catch (err) {
        const validationErrors = {};
        
        if (err.inner) {
          err.inner.forEach((error) => {
            validationErrors[error.path] = error.message;
          });
        }
        
        return validationErrors;
      }
    },
    [validationSchema]
  );

  /**
   * Handle form input change
   * @param {Event} event - Input change event
   */
  const handleChange = useCallback((event) => {
    const { name, value, type, checked } = event.target;
    
    setValues((prevValues) => ({
      ...prevValues,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Mark field as touched
    setTouched((prevTouched) => ({
      ...prevTouched,
      [name]: true
    }));
  }, []);

  /**
   * Set form field value
   * @param {string} name - Field name
   * @param {any} value - Field value
   */
  const setFieldValue = useCallback((name, value) => {
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }));
  }, []);

  /**
   * Set form field error
   * @param {string} name - Field name
   * @param {string} error - Error message
   */
  const setFieldError = useCallback((name, error) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error
    }));
  }, []);

  /**
   * Set form field as touched
   * @param {string} name - Field name
   */
  const setFieldTouched = useCallback((name) => {
    setTouched((prevTouched) => ({
      ...prevTouched,
      [name]: true
    }));
  }, []);

  /**
   * Handle form blur event
   * @param {Event} event - Blur event
   */
  const handleBlur = useCallback(
    async (event) => {
      const { name } = event.target;
      
      // Mark field as touched
      setFieldTouched(name);
      
      // Validate field
      if (validationSchema) {
        try {
          await validationSchema.validateAt(name, values);
          setFieldError(name, '');
        } catch (err) {
          setFieldError(name, err.message);
        }
      }
    },
    [validationSchema, values, setFieldTouched, setFieldError]
  );

  /**
   * Handle form submission
   * @param {Event} event - Form submission event
   */
  const handleSubmit = useCallback(
    async (event) => {
      if (event) {
        event.preventDefault();
      }
      
      setIsSubmitting(true);
      
      // Validate form
      const formErrors = await validateForm(values);
      setErrors(formErrors);
      
      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      );
      setTouched(allTouched);
      
      // Check if form is valid
      const valid = Object.keys(formErrors).length === 0;
      setIsValid(valid);
      
      if (valid) {
        try {
          // If onSubmit is an API function, use execute
          if (typeof onSubmit === 'function') {
            await execute(values);
          }
        } catch (err) {
          console.error('Form submission error:', err);
        }
      }
      
      setIsSubmitting(false);
    },
    [values, validateForm, execute, onSubmit]
  );

  /**
   * Reset form to initial values
   */
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setIsValid(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting: isSubmitting || loading,
    isValid,
    apiError: error,
    
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    resetForm
  };
};

export default useForm;
