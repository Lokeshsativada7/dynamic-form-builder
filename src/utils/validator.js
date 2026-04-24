/**
 * Validates a single value against a set of rules.
 * @param {any} value - The field value (string, number, boolean, array, etc)
 * @param {Object} rules - The corresponding validation rules
 * @returns {string|null} - Error message or null if valid
 */
export const validateField = (value, rules) => {
  if (!rules) return null;

  // For repeatable arrays of objects
  if (Array.isArray(value) && rules.maxItems !== undefined) {
    if (value.length > rules.maxItems) return `Maximum ${rules.maxItems} items allowed`;
  }

  // Treat missing simple values
  const isMissing = value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0);

  if (rules.required && isMissing) {
    if (typeof value === 'boolean') return 'Must be checked';
    return 'This field is required';
  }

  // If not required and empty, pass other validations
  if (isMissing) return null;

  if (typeof value === 'string') {
    if (rules.minLength && value.length < rules.minLength) {
      return `Must be at least ${rules.minLength} characters`;
    }
    if (rules.maxLength && value.length > rules.maxLength) {
      return `Must be no more than ${rules.maxLength} characters`;
    }
    if (rules.pattern) {
      const regex = new RegExp(rules.pattern);
      if (!regex.test(value)) {
        // Specific error for commonly known patterns based on type could go here
        return 'Format is invalid';
      }
    }
  }

  if (typeof value === 'number' || (typeof value === 'string' && !isNaN(value))) {
    const num = Number(value);
    if (rules.min !== undefined && num < rules.min) {
      return `Minimum value is ${rules.min}`;
    }
    if (rules.max !== undefined && num > rules.max) {
      return `Maximum value is ${rules.max}`;
    }
  }

  // Support for completely custom validator function if needed
  if (rules.customValidator && typeof rules.customValidator === 'function') {
    return rules.customValidator(value);
  }

  return null;
};

/**
 * Evaluates visibility rule against the entire form state.
 * @param {Object} showIf - { dependency: "fieldName", equals: "value" }
 * @param {Object} formValues - All current form values
 * @returns {boolean} - True if field should be shown
 */
export const evalCondition = (showIf, formValues) => {
  if (!showIf) return true;
  if (showIf.dependency && showIf.equals !== undefined) {
    return formValues[showIf.dependency] === showIf.equals;
  }
  return true;
};
