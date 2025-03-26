/**
 * Content loader utility to fetch various types of content data
 */

/**
 * Load content from a specified JSON file
 * @param {string} contentType - The type of content to load (e.g., 'projects', 'talks')
 * @returns {Promise<Array>} - Promise resolving to the content items
 */
export const loadContent = async (contentType) => {
  try {
    const response = await fetch(`/${contentType}.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${contentType} data: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error loading ${contentType} data:`, error);
    return [];
  }
};

/**
 * Get a single content item by ID
 * @param {string} contentType - The type of content (e.g., 'projects', 'talks')
 * @param {string} id - The ID of the content item to find
 * @returns {Promise<Object|null>} - Promise resolving to the found item or null
 */
export const getContentItemById = async (contentType, id) => {
  try {
    const items = await loadContent(contentType);
    return items.find((item) => item.id === id) || null;
  } catch (error) {
    console.error(`Error getting ${contentType} item by ID:`, error);
    return null;
  }
};

/**
 * Get the content page configuration
 * @param {string} contentType - The type of content
 * @param {Object} config - The site configuration object
 * @returns {Object} - The content page configuration
 */
export const getContentPageConfig = (contentType, config) => {
  // Default configurations
  const defaultConfig = {
    pageTitle: contentType.charAt(0).toUpperCase() + contentType.slice(1),
    pageDescription: `Explore my ${contentType}.`,
  };

  // If there's a specific config for this content type in the site config, use it
  if (
    config.sections &&
    config.sections[contentType.charAt(0).toUpperCase() + contentType.slice(1)]
  ) {
    const sectionConfig =
      config.sections[contentType.charAt(0).toUpperCase() + contentType.slice(1)];
    return {
      pageTitle: sectionConfig.sectionHeading || defaultConfig.pageTitle,
      pageDescription: sectionConfig.content || defaultConfig.pageDescription,
    };
  }

  return defaultConfig;
};

/**
 * Load featured content items
 * @param {string} contentType - The type of content
 * @param {Array<string>} featuredIds - Array of IDs of featured items
 * @returns {Promise<Array>} - Promise resolving to the featured items
 */
export const loadFeaturedContent = async (contentType, featuredIds) => {
  try {
    const allItems = await loadContent(contentType);
    if (!featuredIds || !Array.isArray(featuredIds) || featuredIds.length === 0) {
      // If no featured IDs are provided, return the most recent items (up to 3)
      return allItems.slice(0, 3);
    }

    // Filter items with matching IDs and preserve the order specified in featuredIds
    return featuredIds
      .map((id) => allItems.find((item) => item.id === id))
      .filter((item) => item !== undefined);
  } catch (error) {
    console.error(`Error loading featured ${contentType}:`, error);
    return [];
  }
};
