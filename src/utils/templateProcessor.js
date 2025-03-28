/**
 * Process an HTML template by replacing placeholders with values from config
 * @param {string} template - The HTML template string
 * @param {Object} config - Configuration object containing values to replace
 * @returns {string} Processed HTML with replaced values
 */
export function processTemplate(template, config) {
  if (!template || !config) {
    throw new Error('Template and config are required');
  }

  // Helper function to safely get nested config values
  function getConfigValue(path) {
    return path.split('.').reduce((obj, key) => obj?.[key], config) || '';
  }

  // Replace all placeholders in the format {{config.path}}
  return template.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
    const value = getConfigValue(path.trim());
    return value !== '' ? value : match; // Return original if no value found
  });
}

/**
 * Generate Google Analytics script if ID is provided
 * @param {string} googleAnalyticsId - Google Analytics tracking ID
 * @returns {string} Google Analytics script tags or empty string if no ID
 */
export function generateGoogleAnalytics(googleAnalyticsId) {
  if (!googleAnalyticsId) return '';

  return `
    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag('js', new Date());
      gtag('config', '${googleAnalyticsId}', {
        custom_map: {
          dimension1: 'paper_title',
          dimension2: 'paper_authors',
          dimension3: 'paper_year',
        },
      });
    </script>
  `;
}
