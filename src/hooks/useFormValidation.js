import { useState, useCallback } from 'react';

export const useFormValidation = (validationRules) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = useCallback((formData, field = null) => {
    const validateField = (fieldName) => {
      const rules = validationRules[fieldName];
      if (!rules) return null;

      for (const rule of rules) {
        const error = rule(formData[fieldName], formData);
        if (error) return error;
      }
      return null;
    };

    if (field) {
      const fieldError = validateField(field);
      setErrors(prev => ({
        ...prev,
        [field]: fieldError
      }));
      return { [field]: fieldError };
    }

    const newErrors = {};
    Object.keys(validationRules).forEach(fieldName => {
      newErrors[fieldName] = validateField(fieldName);
    });

    setErrors(newErrors);
    return newErrors;
  }, [validationRules]);

  const handleBlur = useCallback((field) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  const getFieldStatus = useCallback((field) => {
    if (!touched[field]) return '';
    return errors[field] ? 'error' : 'success';
  }, [errors, touched]);

  return {
    errors,
    touched,
    validate,
    handleBlur,
    clearErrors,
    getFieldStatus
  };
};

// Validation rules helpers
export const required = (value) => !value ? 'This field is required' : null;

export const minLength = (min) => (value) => 
  value && value.length < min ? `Must be at least ${min} characters` : null;

export const maxLength = (max) => (value) => 
  value && value.length > max ? `Must be no more than ${max} characters` : null;

export const pattern = (regex, message) => (value) => 
  value && !regex.test(value) ? message : null;

export const email = (value) => 
  value && !/\S+@\S+\.\S+/.test(value) ? 'Invalid email address' : null;