import bibtexParse from 'bibtex-parse-js';

// Default configuration for backward compatibility
const defaultConfig = {
  arrayFields: [
    'keywords',
    'data_type',
    'application_domain',
    'analysis_focus',
    'visualization_type',
  ],
  arraySeparator: ',',
  dateFields: ['year', 'date'],
  linkFields: ['url', 'paperurl', 'slides', 'video', 'supplementary', 'demo', 'github', 'poster'],
};

// Helper function to process array fields
const processArrayField = (value, separator = ',') => {
  return value ? value.split(separator).map((item) => item.trim()) : [];
};

const convertBibtexToJson = (bibtexData, config = {}) => {
  // Merge default config with provided config
  const mergedConfig = { ...defaultConfig, ...config };
  const parsedEntries = bibtexParse.toJSON(bibtexData);

  return parsedEntries.map((entry) => {
    const tags = entry.entryTags;
    const result = {
      id: entry.citationKey,
      entryType: entry.entryType,
      citationKey: entry.citationKey,
      bibtex: entry.entryTags,
    };

    // Process authors specifically since it needs special handling
    const authors = tags.author ? tags.author.split(' and ').map((author) => author.trim()) : [];
    result.authors = authors;

    // Initialize links object
    const links = {};

    // Process all tags using config
    Object.keys(tags).forEach((key) => {
      const value = tags[key];

      // Skip author as we already processed it
      if (key === 'author') return;

      // Process array fields
      if (mergedConfig.arrayFields.includes(key)) {
        result[key] = processArrayField(value, mergedConfig.arraySeparator);
      }
      // Process link fields into a links object
      else if (mergedConfig.linkFields.includes(key)) {
        links[key] = value;
      }
      // Default processing for other fields
      else {
        result[key] = value;
      }
    });

    // Add links object if not empty
    if (Object.keys(links).length > 0) {
      result.links = {
        url: links.url || '',
        pdf: links.paperurl || '',
        slides: links.slides || '',
        video: links.video || '',
        supplementary: links.supplementary || '',
        demo: links.demo || '',
        github: links.github || '',
        poster: links.poster || '',
        ...links, // Add any other link fields not explicitly mapped above
      };
    }

    // Ensure common expected fields exist with defaults
    result.title = tags.title || '';
    result.description = tags.abstract || '';
    result.year = tags.year || '';
    result.date = tags.date || tags.year || '';
    result.abstract = tags.abstract || '';
    result.journal = tags.journal || '';
    result.booktitle = tags.booktitle || '';
    result.doi = tags.doi || '';
    result.awards = tags.awards || '';
    result.image = tags.image || '';
    result.markdownContent = tags.markdownContent || '';
    result.shorturl = tags.shorturl || '';

    return result;
  });
};

export default convertBibtexToJson;
