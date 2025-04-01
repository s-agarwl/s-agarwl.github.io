/**
 * Utility functions for BibTeX generation and handling
 */

/**
 * Generate a BibTeX entry from a publication entry
 * @param {Object} entry - The publication entry object
 * @param {Object} config - Optional configuration with additionalCitationFields
 * @returns {string} - Formatted BibTeX entry
 */
export const generateBibTexEntry = (entry, config = {}) => {
  if (!entry) return '';

  let bibEntry = `@${entry.entryType}{${entry.citationKey},\n`;

  // Standard BibTeX fields in preferred order
  const standardFieldOrder = [
    'author',
    'title',
    'journal',
    'booktitle',
    'volume',
    'number',
    'pages',
    'year',
    'month',
    'publisher',
    'address',
    'doi',
    'url',
    'note',
    'abstract',
  ];

  // Additional fields to include from configuration
  const additionalFields = config?.bibtexFieldConfig?.additionalCitationFields || [];

  // Collect valid fields - only include standard fields and additional fields
  const validFields = {};
  Object.entries(entry.entryTags).forEach(([key, value]) => {
    // Include if it's a standard field or specified in additionalCitationFields
    if (standardFieldOrder.includes(key) || additionalFields.includes(key)) {
      validFields[key] = value;
    }
  });

  // Sort fields according to standard order + additional fields
  const sortedFields = Object.keys(validFields).sort((a, b) => {
    const indexA = standardFieldOrder.indexOf(a);
    const indexB = standardFieldOrder.indexOf(b);

    // Both fields are standard fields
    if (indexA >= 0 && indexB >= 0) {
      return indexA - indexB;
    }

    // Only a is standard
    if (indexA >= 0) return -1;

    // Only b is standard
    if (indexB >= 0) return 1;

    // Both are non-standard, but a is in additionalFields
    if (additionalFields.includes(a) && !additionalFields.includes(b)) {
      return -1;
    }

    // Both are non-standard, but b is in additionalFields
    if (!additionalFields.includes(a) && additionalFields.includes(b)) {
      return 1;
    }

    // Both are in additionalFields or neither is, sort alphabetically
    return a.localeCompare(b);
  });

  // Add fields in sorted order with consistent indentation
  sortedFields.forEach((key) => {
    // Use 2 spaces for indentation and align the values
    const value = validFields[key];
    bibEntry += `  ${key.padEnd(10)} = {${value}},\n`;
  });

  // Remove the last comma and close the entry
  bibEntry = bibEntry.slice(0, -2) + '\n}';

  return bibEntry;
};

/**
 * Generate an enhanced BibTeX entry from a publication entry for SEO purposes
 * This version includes additional fields like paperurl, github, demo, etc.
 * @param {Object} entry - The publication entry object
 * @returns {string} - Formatted BibTeX entry with additional fields
 */
export const generateEnhancedBibTexEntry = (entry) => {
  if (!entry) return '';

  let bibEntry = `@${entry.entryType}{${entry.citationKey},\n`;

  // Enhanced field order (standard fields first, then resource links, then others)
  const enhancedFieldOrder = [
    'author',
    'title',
    'journal',
    'booktitle',
    'volume',
    'number',
    'pages',
    'year',
    'month',
    'publisher',
    'address',
    'doi',
    'url',
    'paperurl', // Paper URL included for SEO
    'github', // GitHub URL included for SEO
    'demo', // Demo URL included for SEO
    'poster', // Poster URL included for SEO
    'slides', // Slides URL included for SEO
    'note',
    'abstract',
  ];

  // Collect valid fields - only include fields defined in enhancedFieldOrder
  const validFields = {};
  Object.entries(entry.entryTags).forEach(([key, value]) => {
    if (enhancedFieldOrder.includes(key)) {
      validFields[key] = value;
    }
  });

  // Sort fields according to enhanced order
  const sortedFields = Object.keys(validFields).sort((a, b) => {
    const indexA = enhancedFieldOrder.indexOf(a);
    const indexB = enhancedFieldOrder.indexOf(b);

    // If both fields are in the enhanced order list
    if (indexA >= 0 && indexB >= 0) {
      return indexA - indexB;
    }

    // If neither field is in the enhanced order list, sort alphabetically
    return a.localeCompare(b);
  });

  // Add fields in sorted order with consistent indentation
  sortedFields.forEach((key) => {
    // Use 2 spaces for indentation and align the values
    const value = validFields[key];
    bibEntry += `  ${key.padEnd(10)} = {${value}},\n`;
  });

  // Remove the last comma and close the entry
  bibEntry = bibEntry.slice(0, -2) + '\n}';

  return bibEntry;
};

/**
 * Copy BibTeX to clipboard and handle success/failure states
 * @param {string} bibTexEntry - The BibTeX entry to copy
 * @param {Function} setSuccessState - Function to set success state
 */
export const copyBibTexToClipboard = (bibTexEntry, setSuccessState) => {
  navigator.clipboard
    .writeText(bibTexEntry)
    .then(() => {
      setSuccessState(true);
      setTimeout(() => setSuccessState(false), 2000);
    })
    .catch((err) => console.error('Failed to copy: ', err));
};
