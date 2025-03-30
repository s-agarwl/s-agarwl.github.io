/**
 * Checks if a field value is meaningful (not empty, null, or undefined)
 * @param {any} value - The field value to check
 * @returns {boolean} - Whether the value is meaningful
 */
export const fieldHasValue = (value) => {
  // Handle null and undefined
  if (value === null || value === undefined) {
    return false;
  }

  // Handle arrays - check if they have items
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  // Handle objects - check if they have keys
  if (typeof value === 'object') {
    return Object.keys(value).length > 0;
  }

  // Handle strings - check if they're not empty
  if (typeof value === 'string') {
    return value.trim() !== '';
  }

  // Numbers (including 0) and booleans (including false) are considered valid values
  return true;
};

/**
 * Extracts a field value from an item, supporting nested paths
 * @param {object} item - The data item
 * @param {string} fieldPath - The field path (can be nested like 'links.video')
 * @returns {any} - The field value or null if not found
 */
export const getFieldValue = (item, fieldPath) => {
  if (!fieldPath || !item) return null;

  // Handle nested paths
  if (fieldPath.includes('.')) {
    const path = fieldPath.split('.');
    let value = item;
    for (const segment of path) {
      if (!value || value[segment] === undefined) return null;
      value = value[segment];
    }
    return value;
  }

  // Simple field lookup
  return item[fieldPath];
};
