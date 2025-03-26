/**
 * Utility functions for BibTeX generation and handling
 */

/**
 * Generate a BibTeX entry from a publication entry
 * @param {Object} entry - The publication entry object
 * @returns {string} - Formatted BibTeX entry
 */
export const generateBibTexEntry = (entry) => {
  if (!entry) return '';

  let bibEntry = `@${entry.entryType}{${entry.citationKey},\n`;

  // Fields to exclude from BibTeX output (non-standard or website-specific fields)
  const excludedFields = [
    'image', // Visual element, not relevant for citation
    'video', // Visual element, not relevant for citation
    'paperurl', // Website-specific URL
    'shorturl', // Website-specific redirect
    'demo', // Demo URL
    'poster', // Poster URL
    'slides', // Slides URL
    'github', // GitHub URL
    'type', // Internal classification
    'abstract',
    'markdownContent',
    'supplementary',
  ];

  // Standard BibTeX field order (common fields first, then alphabetical)
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

  // Collect all valid fields
  const validFields = {};
  Object.entries(entry.entryTags).forEach(([key, value]) => {
    if (!excludedFields.includes(key)) {
      validFields[key] = value;
    }
  });

  // Sort fields according to standard order
  const sortedFields = Object.keys(validFields).sort((a, b) => {
    const indexA = standardFieldOrder.indexOf(a);
    const indexB = standardFieldOrder.indexOf(b);

    // If both fields are in the standard order list
    if (indexA >= 0 && indexB >= 0) {
      return indexA - indexB;
    }

    // If only one field is in the standard order list
    if (indexA >= 0) return -1;
    if (indexB >= 0) return 1;

    // If neither field is in the standard order list, sort alphabetically
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

  // Fields to exclude from BibTeX output (only exclude purely visual or website-specific fields)
  const excludedFields = [
    'image', // Visual element, not relevant for citation
    'video', // Visual element, not relevant for citation
    'blogpost', // Website-specific content
    'shorturl', // Website-specific redirect
    'type', // Internal classification
  ];

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

  // Collect all valid fields
  const validFields = {};
  Object.entries(entry.entryTags).forEach(([key, value]) => {
    if (!excludedFields.includes(key)) {
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

    // If only one field is in the enhanced order list
    if (indexA >= 0) return -1;
    if (indexB >= 0) return 1;

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
