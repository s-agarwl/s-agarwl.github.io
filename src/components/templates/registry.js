import React from 'react';

// Import template components
// These will be imported as we create them
const TemplateRegistry = {
  // Basic templates
  text: React.lazy(() => import('./sections/Text')),
  'text-with-image': React.lazy(() => import('./sections/TextWithImage')),
  timeline: React.lazy(() => import('./sections/Timeline')),
  grid: React.lazy(() => import('./sections/Grid')),
  carousel: React.lazy(() => import('./sections/Carousel')),
  contact: React.lazy(() => import('./sections/Contact')),
  awards: React.lazy(() => import('./sections/Grid')),
  article: React.lazy(() => import('./sections/Article')),

  // You can add more templates here as they are created
};

/**
 * Gets a template component based on template ID
 * @param {string} templateId - The template identifier
 * @returns {React.ComponentType|null} The React component for the template or null if not found
 */
export const getTemplate = (templateId) => {
  return TemplateRegistry[templateId] || null;
};

/**
 * Gets list of all available templates
 * @returns {Object} Object with template IDs as keys and components as values
 */
export const getAllTemplates = () => {
  return { ...TemplateRegistry };
};

/**
 * Checks if a template exists
 * @param {string} templateId - The template identifier
 * @returns {boolean} True if template exists, false otherwise
 */
export const templateExists = (templateId) => {
  return !!TemplateRegistry[templateId];
};

export default TemplateRegistry;
