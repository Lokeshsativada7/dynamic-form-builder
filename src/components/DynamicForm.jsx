import React, { useState, useEffect } from 'react';
import { FieldRenderer } from './FieldRenderer';
import { validateField, evalCondition } from '../utils/validator';

export const DynamicForm = ({ schema, onSubmit }) => {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize or update values from schema when it changes
  useEffect(() => {
    setValues(prev => {
      const newValues = { ...prev };
      schema.forEach(field => {
        // Only set default if it's a new field without an existing value
        if (newValues[field.name] === undefined) {
          newValues[field.name] = field.defaultValue !== undefined ? field.defaultValue : '';
        }
      });
      return newValues;
    });
  }, [schema]);

  const handleChange = (name, value) => {
    setValues(prev => {
      const newValues = { ...prev, [name]: value };
      
      // Auto-validate on change if touched
      if (touched[name]) {
        const fieldConfig = schema.find(f => f.name === name);
        if (fieldConfig) {
          const err = validateField(value, fieldConfig.rules);
          setErrors(e => ({ ...e, [name]: err }));
        }
      }
      return newValues;
    });
  };

  const handleRepeaterAction = (repeaterName, action, index, nestedFieldName, nestedValue) => {
    setValues(prev => {
      const currentList = Array.isArray(prev[repeaterName]) ? [...prev[repeaterName]] : [];
      let newValues = { ...prev };

      if (action === 'add') {
        const fieldConfig = schema.find(f => f.name === repeaterName);
        const newItem = {};
        fieldConfig.itemSchema?.forEach(itemF => {
          newItem[itemF.name] = itemF.defaultValue !== undefined ? itemF.defaultValue : '';
        });
        currentList.push(newItem);
      } else if (action === 'remove') {
        currentList.splice(index, 1);
      } else if (action === 'update') {
        currentList[index] = { ...currentList[index], [nestedFieldName]: nestedValue };
      }

      newValues[repeaterName] = currentList;

      // Validate repeater if touched
      if (touched[repeaterName]) {
        const fieldConfig = schema.find(f => f.name === repeaterName);
        const err = validateField(currentList, fieldConfig.rules);
        // We'll keep complex repeater errors simple for this demo (only track top-level repeater errors like maxItems)
        // Nested array errors can be computed during full validation round
        setErrors(e => ({ ...e, [repeaterName]: err }));
      }
      return newValues;
    });
  };

  const handleBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const fieldConfig = schema.find(f => f.name === name);
    if (fieldConfig) {
      const err = validateField(values[name], fieldConfig.rules);
      setErrors(e => ({ ...e, [name]: err }));
    }
  };

  const validateAll = () => {
    const newErrors = {};
    let isValid = true;
    
    // We only validate fields that are currently visible
    schema.forEach(field => {
      const isVisible = evalCondition(field.showIf, values);
      if (!isVisible) return; // Skip validation for hidden fields

      const topLevelError = validateField(values[field.name], field.rules);
      if (topLevelError) {
        newErrors[field.name] = topLevelError;
        isValid = false;
      }

      // Check nested schema if repeater and no top level error yet
      if (field.type === 'repeater' && Array.isArray(values[field.name])) {
        const itemErrors = [];
        let hasItemErrors = false;
        
        values[field.name].forEach((itemValue, i) => {
          const rowErrs = {};
          field.itemSchema?.forEach(nestedF => {
            const err = validateField(itemValue[nestedF.name], nestedF.rules);
            if (err) {
              rowErrs[nestedF.name] = err;
              hasItemErrors = true;
            }
          });
          itemErrors[i] = rowErrs;
        });

        if (hasItemErrors) {
          newErrors[field.name] = itemErrors;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    
    // Mark ALL visible fields as touched so errors show up
    const allTouched = {};
    schema.forEach(field => {
      if (evalCondition(field.showIf, values)) {
        allTouched[field.name] = true;
      }
    });
    setTouched(allTouched);

    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (validateAll()) {
      // Clean up values: Remove hidden fields from payload
      const payload = { ...values };
      schema.forEach(field => {
        const isVisible = evalCondition(field.showIf, values);
        if (!isVisible) {
          delete payload[field.name];
        }
      });
      onSubmit(payload);
    }
    
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {schema.map(field => {
        const isVisible = evalCondition(field.showIf, values);
        if (!isVisible) return null;

        return (
          <FieldRenderer
            key={field.name}
            field={field}
            value={values[field.name]}
            error={errors[field.name]}
            onChange={handleChange}
            onBlur={handleBlur}
            onRepeaterAction={handleRepeaterAction}
          />
        );
      })}

      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Form'}
      </button>
    </form>
  );
};
