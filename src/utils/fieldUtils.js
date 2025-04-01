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

/**
 * Checks if an item contains any of the selected keywords in its tag fields
 * @param {object} item - The data item
 * @param {Array} fields - The fields configuration array
 * @param {Array} selectedKeywords - The selected keywords to match against
 * @param {Array} sourceSectionFields - The sourceFields from section configuration (optional)
 * @returns {boolean} - Whether the item contains any selected keywords
 */
export const itemContainsSelectedKeywords = (
  item,
  fields,
  selectedKeywords,
  sourceSectionFields = [],
) => {
  // If no selected keywords, return false immediately
  if (!selectedKeywords || selectedKeywords.length === 0) return false;

  const sourceFieldsMatch = sourceSectionFields.some((fieldConfig) => {
    const field = typeof fieldConfig === 'string' ? fieldConfig : fieldConfig.field;

    if (!item[field]) return false;

    // Extract keywords using the same logic as KeywordCloud component
    const keywords = Array.isArray(item[field])
      ? item[field]
      : typeof item[field] === 'string'
        ? item[field].split(',').map((k) => k.trim())
        : [item[field]];

    // Normalize for comparison
    const normalizedKeywords = keywords.map((kw) =>
      typeof kw === 'string' ? kw.toLowerCase().trim() : kw,
    );

    const normalizedSelectedKeywords = selectedKeywords.map((kw) =>
      typeof kw === 'string' ? kw.toLowerCase().trim() : kw,
    );

    const hasMatch = normalizedKeywords.some((kw) => normalizedSelectedKeywords.includes(kw));

    return hasMatch;
  });

  const result = sourceFieldsMatch;
  console.log('Item contains keywords result:', result);
  return result;
};
