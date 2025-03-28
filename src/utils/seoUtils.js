/**
 * Get the appropriate SEO text based on priority (LLM > Fallback)
 * @param {Object} seoTexts - Object containing LLM and fallback texts
 * @param {string} type - Type of text to get ('title' or 'description')
 * @returns {string} The selected text
 */
export function getSeoText(seoTexts, type) {
  if (!seoTexts) return '';

  // Try LLM version first
  if (seoTexts.llm && seoTexts.llm[type]) {
    return seoTexts.llm[type];
  }

  // Fall back to fallback version
  if (seoTexts.fallback && seoTexts.fallback[type]) {
    return seoTexts.fallback[type];
  }

  return '';
}

/**
 * Get SEO texts for a specific content item
 * @param {string} contentPath - Path to the content item (e.g., 'publications/123')
 * @param {Object} shortenedTexts - The complete shortened texts object
 * @returns {Object} SEO texts for the item
 */
export function getItemSeoTexts(contentPath, shortenedTexts) {
  if (!shortenedTexts || !shortenedTexts.items) {
    return null;
  }

  return shortenedTexts.items[contentPath] || null;
}
