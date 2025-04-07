'use client';

import React, { useState } from 'react';
import { z } from 'zod';

type ValidationRule = {
  validator: (value: any) => boolean;
  message: string;
};

type FieldValidation = {
  required?: boolean | string;
  minLength?: [number, string];
  maxLength?: [number, string];
  pattern?: [RegExp, string];
  custom?: ValidationRule[];
  validate?: (value: any) => string | null;
};

type FormValidation = {
  [key: string]: FieldValidation;
};

type FormErrors = {
  [key: string]: string | null;
};

type UseFormValidationProps = {
  validationSchema: FormValidation;
  initialValues?: Record<string, any>;
};

export const useFormValidation = ({ validationSchema, initialValues = {} }: UseFormValidationProps) => {
  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: any): string | null => {
    const fieldValidation = validationSchema[name];
    if (!fieldValidation) return null;

    // Check if required
    if (fieldValidation.required) {
      const isEmptyValue = value === undefined || value === null || value === '';
      if (isEmptyValue) {
        return typeof fieldValidation.required === 'string'
          ? fieldValidation.required
          : `${name} is required`;
      }
    }

    // Check min length
    if (fieldValidation.minLength && typeof value === 'string') {
      const [min, message] = fieldValidation.minLength;
      if (value.length < min) {
        return message;
      }
    }

    // Check max length
    if (fieldValidation.maxLength && typeof value === 'string') {
      const [max, message] = fieldValidation.maxLength;
      if (value.length > max) {
        return message;
      }
    }

    // Check pattern
    if (fieldValidation.pattern && typeof value === 'string') {
      const [pattern, message] = fieldValidation.pattern;
      if (!pattern.test(value)) {
        return message;
      }
    }

    // Check custom validators
    if (fieldValidation.custom) {
      for (const rule of fieldValidation.custom) {
        if (!rule.validator(value)) {
          return rule.message;
        }
      }
    }

    // Check validate function
    if (fieldValidation.validate) {
      return fieldValidation.validate(value);
    }

    return null;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Validate all fields
    Object.keys(validationSchema).forEach((fieldName) => {
      const error = validateField(fieldName, values[fieldName]);
      newErrors[fieldName] = error;
      if (error) {
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle different input types
    let fieldValue = value;
    if (type === 'number') {
      fieldValue = value === '' ? '' : Number(value);
    } else if (type === 'checkbox' && 'checked' in e.target) {
      fieldValue = (e.target as HTMLInputElement).checked;
    }

    setValues({
      ...values,
      [name]: fieldValue,
    });

    // Validate field if it's been touched
    if (touched[name]) {
      const error = validateField(name, fieldValue);
      setErrors({
        ...errors,
        [name]: error,
      });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Mark field as touched
    setTouched({
      ...touched,
      [name]: true,
    });

    // Validate field
    const error = validateField(name, value);
    setErrors({
      ...errors,
      [name]: error,
    });
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setValues,
  };
};

// Zod schema validation hook
export const useZodForm = <T extends z.ZodType>(
  schema: T,
  initialValues: z.infer<T> = {} as z.infer<T>
) => {
  const [values, setValues] = useState<z.infer<T>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: string, formValues: z.infer<T> = values) => {
    try {
      // Create a partial schema with just this field
      const partialSchema = z.object({ [name]: schema.shape[name] });
      partialSchema.parse({ [name]: formValues[name] });
      return null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors.find(err => err.path[0] === name);
        return fieldError?.message || null;
      }
      return 'Validation error';
    }
  };

  const validateForm = () => {
    try {
      schema.parse(values);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          const path = err.path[0] as string;
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle different input types
    let fieldValue = value;
    if (type === 'number') {
      fieldValue = value === '' ? '' : Number(value);
    } else if (type === 'checkbox' && 'checked' in e.target) {
      fieldValue = (e.target as HTMLInputElement).checked;
    }

    const newValues = {
      ...values,
      [name]: fieldValue,
    };
    
    setValues(newValues as z.infer<T>);

    // Validate field if it's been touched
    if (touched[name]) {
      const error = validateField(name, newValues);
      if (error) {
        setErrors(prev => ({ ...prev, [name]: error }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target;
    
    // Mark field as touched
    setTouched(prev => ({ ...prev, [name]: true }));

    // Validate field
    const error = validateField(name);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setValues,
  };
};

export default useFormValidation;
