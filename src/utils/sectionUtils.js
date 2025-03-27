/**
 * Utility functions for working with sections
 */

/**
 * Find a section by its ID
 * @param {Array} sections - The array of sections
 * @param {string} id - The ID of the section to find
 * @returns {Object|undefined} The found section or undefined
 */
export const findSectionById = (sections, id) => {
  return sections.find((section) => section.id === id);
};

/**
 * Find a subsection by its ID within a parent section
 * @param {Array} sections - The array of sections
 * @param {string} subsectionId - The ID of the subsection to find
 * @returns {Object|undefined} The found subsection and its parent, or undefined
 */
export const findSubsectionById = (sections, subsectionId) => {
  for (const section of sections) {
    if (section.subsections && Array.isArray(section.subsections)) {
      const subsection = section.subsections.find((sub) => sub.id === subsectionId);
      if (subsection) {
        return {
          subsection,
          parentSection: section,
        };
      }
    }
  }
  return undefined;
};

/**
 * Get section details by ID (section or subsection)
 * @param {Array} sections - The array of sections
 * @param {string} id - The ID to look up
 * @returns {Object} The section details with text, path and other properties
 */
export const getSectionDetails = (sections, id) => {
  // Check if it's a main section
  const section = findSectionById(sections, id);
  if (section) {
    return {
      id,
      text: section.title || section.sectionHeading || id,
      path: section.path || `/#${id}`,
    };
  }

  // If not a main section, check if it's a subsection
  const subsectionInfo = findSubsectionById(sections, id);
  if (subsectionInfo) {
    const { subsection, parentSection } = subsectionInfo;
    return {
      id,
      text: subsection.title || id,
      path: subsection.path || `/#${id}`,
      parentId: parentSection.id,
    };
  }

  // Fallback if not found
  return { id, text: id, path: `/#${id}` };
};
