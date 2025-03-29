/**
 * Enhanced Static Pages Generator Script
 *
 * This script generates pre-rendered HTML pages for all content types to improve SEO.
 * It dynamically processes all data sources defined in config.json and creates:
 *
 * - Static HTML files with proper metadata for all content items
 * - SEO optimization with appropriate meta tags
 * - Open Graph and Twitter card data for social sharing
 * - JSON-LD structured data based on content type
 * - Short URL redirects for all content items with shorturl properties
 * - A comprehensive sitemap with all content URLs
 *
 * The script is designed to be content-type agnostic and uses the configuration
 * in config.json to determine what to generate.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';
import bibtexParse from 'bibtex-parse-js';
import { generateEnhancedBibTexEntry } from '../src/utils/bibTexUtils.js';
import { generateSeoTexts } from './generate-seo-texts.js';
import { getSeoText, getItemSeoTexts } from '../src/utils/seoUtils.js';
import { processTemplate, generateGoogleAnalytics } from '../src/utils/templateProcessor.js';
import process from 'process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');
const publicDir = path.resolve(__dirname, '../public');

// Function to clean BibTeX entry tags
function cleanEntryTags(entryTags) {
  const cleanedTags = {};
  for (const [key, value] of Object.entries(entryTags)) {
    // Remove LaTeX-style curly braces
    cleanedTags[key] = value ? value.replace(/\{([^{}]*)\}/g, '$1') : '';
  }
  return cleanedTags;
}

// Function to format author names
function formatAuthorNames(entries) {
  return entries.map((entry) => {
    if (entry.entryTags.author) {
      const authors = entry.entryTags.author.split(' and ');
      const formattedAuthors = authors.map((author) => {
        const [lastName, firstName] = author.split(', ');
        return firstName && lastName ? `${firstName} ${lastName}` : author;
      });

      if (formattedAuthors.length === 2) {
        entry.entryTags.author = formattedAuthors.join(' and ');
      } else if (formattedAuthors.length > 2) {
        const lastAuthor = formattedAuthors.pop();
        entry.entryTags.author = formattedAuthors.join(', ') + ', and ' + lastAuthor;
      } else {
        entry.entryTags.author = formattedAuthors[0];
      }
    }
    return entry;
  });
}

// Process BibTeX data
async function processBibtexData(filePath, sectionId, config) {
  try {
    const bibtexData = fs.readFileSync(filePath, 'utf8');

    // Parse BibTeX entries
    const parsedEntries = bibtexParse.toJSON(bibtexData);
    const cleanedEntries = parsedEntries.map((entry) => {
      const cleanedTags = cleanEntryTags(entry.entryTags);

      // Add content type and section ID for proper URL construction
      return {
        ...entry,
        contentType: sectionId,
        sectionPath: getSectionPath(config, sectionId),
        entryTags: cleanedTags,
      };
    });

    const formattedEntries = formatAuthorNames(cleanedEntries);

    // Sort entries by year (newest first) if year is available
    const sortedEntries = formattedEntries.sort((a, b) => {
      const yearA = parseInt(a.entryTags.year, 10) || 0;
      const yearB = parseInt(b.entryTags.year, 10) || 0;
      return yearB - yearA;
    });

    return sortedEntries;
  } catch (error) {
    console.error(`Error processing BibTeX data from ${filePath}:`, error);
    return [];
  }
}

// Process JSON data
async function processJsonData(filePath, sectionId, config) {
  try {
    const jsonData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(jsonData);

    // Convert to a standard format
    const entries = Array.isArray(data)
      ? data
      : Object.entries(data).map(([id, item]) => ({
          ...item,
          id: item.id || id,
        }));

    // Add content type and section path for proper URL construction
    return entries.map((item) => ({
      ...item,
      contentType: sectionId,
      sectionPath: getSectionPath(config, sectionId),
    }));
  } catch (error) {
    console.error(`Error processing JSON data from ${filePath}:`, error);
    return [];
  }
}

// Helper to get section path from config
function getSectionPath(config, sectionId) {
  const section = config.sections.find((s) => s.id === sectionId);
  return section?.path || `/${sectionId.toLowerCase()}`;
}

// Get display configuration for a section
function getDisplayConfig(config, sectionId) {
  const section = config.sections.find((s) => s.id === sectionId);
  if (!section || !section.display) {
    // Return a default display config if none exists
    return {
      detail: {
        fields: [
          { field: 'title', component: 'Heading', options: { level: 1 } },
          { field: 'description', component: 'Text' },
        ],
      },
    };
  }
  return section.display;
}

// Render a field based on its component type
function renderField(item, field) {
  // Extract field definition
  const { field: fieldName, component, label, heading, options, format, condition } = field;

  // Skip rendering if condition is specified but not met
  if (condition && !getNestedValue(item, condition)) {
    return '';
  }

  // Get field value - handle both normal fields and nested fields like entryTags.title
  const value = getNestedValue(item, fieldName);

  // Skip if no value
  if (value === undefined || value === null || value === '') {
    return '';
  }

  // Handle different component types
  switch (component) {
    case 'Heading': {
      const level = options?.level || 2;
      return `<h${level}>${value}</h${level}>`;
    }

    case 'Text':
      if (format) {
        // Handle format strings like "{journal}, {year}"
        return `${label ? `<strong>${label}:</strong> ` : ''}${formatValue(item, format)}`;
      }
      return `${label ? `<strong>${label}:</strong> ` : ''}${value}`;

    case 'AuthorList':
      return `${label ? `<strong>${label}:</strong> ` : ''}${value}`;

    case 'Tags':
      if (Array.isArray(value)) {
        return `
          ${heading ? `<h3>${heading}</h3>` : ''}
          <div class="tags">${value.map((tag) => `<span class="tag">${tag}</span>`).join(' ')}</div>
        `;
      }
      return `
        ${heading ? `<h3>${heading}</h3>` : ''}
        <div class="tags">${value
          .split(',')
          .map((tag) => `<span class="tag">${tag.trim()}</span>`)
          .join(' ')}</div>
      `;

    case 'Image':
      return `
        <div class="image-container">
          <img src="${value}" alt="${item.title || ''}" />
        </div>
      `;

    case 'PublicationLinks':
    case 'LinkButtons': {
      if (!value) return '';
      const links = typeof value === 'object' ? value : item.links;
      if (!links || Object.keys(links).length === 0) return '';

      return `
        ${heading ? `<h3>${heading}</h3>` : ''}
        <div class="links">
          ${Object.entries(links)
            .filter(([, url]) => url)
            .map(([key, url]) => `<a href="${url}" class="link-button">${key}</a>`)
            .join(' ')}
        </div>
      `;
    }

    case 'ExpandableMarkdown':
    case 'Markdown':
      return `
        ${heading ? `<h3>${heading}</h3>` : ''}
        <div class="markdown-content">${value}</div>
      `;

    case 'Award':
      return value ? `<div class="award"><span class="award-icon">🏆</span> ${value}</div>` : '';

    case 'Section':
      return `
        ${heading ? `<h3>${heading}</h3>` : ''}
        <div class="section-content">${value}</div>
      `;

    default:
      return `${label ? `<strong>${label}:</strong> ` : ''}${value}`;
  }
}

// Helper to get a nested value from an object
function getNestedValue(obj, path) {
  if (!path) return undefined;

  // Handle entryTags.field syntax
  if (path.includes('.')) {
    const parts = path.split('.');
    let current = obj;

    for (const part of parts) {
      if (current === undefined || current === null) return undefined;
      current = current[part];
    }

    return current;
  }

  // Handle direct properties - check both direct and in entryTags
  return obj[path] !== undefined
    ? obj[path]
    : obj.entryTags && obj.entryTags[path]
      ? obj.entryTags[path]
      : undefined;
}

// Format a string with object values
function formatValue(item, format) {
  return format.replace(/\{([^}]+)\}/g, (match, key) => {
    const value = getNestedValue(item, key);
    return value !== undefined ? value : '';
  });
}

// eslint-disable-next-line no-unused-vars
function createContentHtml(item, config) {
  // Get the display configuration for this content type
  const displayConfig = getDisplayConfig(config, item.contentType);

  if (!displayConfig.detail || !displayConfig.detail.fields) {
    // Fallback for missing configuration
    const title = getNestedValue(item, 'title') || '';
    const description = getNestedValue(item, 'description') || '';

    return `
      <h1>${title}</h1>
      ${description ? `<p>${description}</p>` : ''}
    `;
  }

  // Generate HTML based on configured fields
  let html = '';

  // Special case for Publications to add citation
  const isPub = item.contentType === 'Publications' || (item.entryTags && item.citationKey);
  let citationHtml = '';

  if (isPub) {
    citationHtml = `
      <h2>Citation</h2>
      <pre><code class="language-bibtex">${generateEnhancedBibTexEntry(item)}</code></pre>
    `;
  }

  // Render each field according to its component type
  for (const field of displayConfig.detail.fields) {
    html += renderField(item, field);
  }

  // Add citation for publications at the end
  if (isPub) {
    html += citationHtml;
  }

  return html;
}

// Define schema.org mappings based on section templates
const schemaTypeMappings = {
  listOfItems: {
    Publications: 'ScholarlyArticle',
    Projects: 'SoftwareApplication',
    Talks: 'Event',
    Teaching: 'Course',
    Blog: 'BlogPosting',
    _default: 'CreativeWork',
  },
  article: 'Article',
  timeline: 'ItemList',
  gallery: 'ImageGallery',
  _default: 'WebPage',
};

// eslint-disable-next-line no-unused-vars
function addStructuredData(item, document, config) {
  const section = config.sections.find((s) => s.id === item.contentType);
  const title = getNestedValue(item, 'title') || '';
  const description =
    getNestedValue(item, 'description') || (item.entryTags ? item.entryTags.abstract : '');
  const baseUrl = config.baseUrl || 'https://example.com';

  const scriptLD = document.createElement('script');
  scriptLD.setAttribute('type', 'application/ld+json');

  // Determine schema type based on section template and content type
  let schemaType = 'CreativeWork';
  if (section && section.template) {
    const templateMapping = schemaTypeMappings[section.template] || schemaTypeMappings._default;
    schemaType =
      typeof templateMapping === 'object'
        ? templateMapping[item.contentType] || templateMapping._default
        : templateMapping;
  }

  let jsonLD = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: title,
    description: description,
  };

  // Add properties based on content type and available data
  if (item.contentType === 'Publications' || (item.entryTags && item.citationKey)) {
    // Publications
    if (item.entryTags.author) {
      jsonLD.author = item.entryTags.author.split(', ').map((name) => ({
        '@type': 'Person',
        name: name.replace(' and ', ''),
      }));
    }

    if (item.entryTags.year) {
      jsonLD.datePublished = item.entryTags.year;
    }

    if (item.entryTags.journal) {
      jsonLD.publisher = item.entryTags.journal;
    } else if (item.entryTags.booktitle) {
      jsonLD.publisher = item.entryTags.booktitle;
    }

    if (item.entryTags.doi) {
      jsonLD.identifier = {
        '@type': 'PropertyValue',
        propertyID: 'DOI',
        value: item.entryTags.doi,
      };
    }

    // Add resources
    const resources = [];
    if (item.entryTags.paperurl) {
      resources.push({
        '@type': 'CreativeWork',
        name: 'Full Paper',
        url: new URL(item.entryTags.paperurl, baseUrl).href,
        encodingFormat: 'application/pdf',
      });
    }

    if (item.entryTags.github) {
      resources.push({
        '@type': 'SoftwareSourceCode',
        name: 'Source Code',
        codeRepository: item.entryTags.github,
      });
    }

    if (resources.length > 0) {
      jsonLD.associatedMedia = resources;
    }
  } else {
    // Common properties for all other content types
    if (item.date) {
      jsonLD.datePublished = item.date;
    }

    // Add links
    if (item.links && Object.keys(item.links).length > 0) {
      jsonLD.url = Object.values(item.links)[0]; // Use first link as primary URL
    }

    // Add keywords if available
    const keywords = item.tags || item.keywords || item.technologies;
    if (keywords) {
      jsonLD.keywords = Array.isArray(keywords) ? keywords.join(', ') : keywords;
    }

    // Add organization for courses
    if (item.contentType === 'Teaching' && item.institution) {
      jsonLD.provider = {
        '@type': 'Organization',
        name: item.institution,
      };
    }

    // Add venue for talks/events
    if (item.contentType === 'Talks' && item.venue) {
      jsonLD.location = {
        '@type': 'Place',
        name: item.venue,
      };

      if (item.date) {
        jsonLD.startDate = item.date;
      }
    }
  }

  scriptLD.textContent = JSON.stringify(jsonLD);
  document.querySelector('head').appendChild(scriptLD);
}

// eslint-disable-next-line no-unused-vars
function addMetaTags(item, document, config) {
  const head = document.querySelector('head');
  const title = getNestedValue(item, 'title') || '';
  const description =
    getNestedValue(item, 'description') || (item.entryTags ? item.entryTags.abstract : '');
  const baseUrl = config.baseUrl || 'https://example.com';

  // Set page title
  const titleElement = document.querySelector('title');
  if (titleElement) {
    titleElement.textContent = title;
  }

  // Add basic meta tags
  // Meta description
  const metaDescription = document.createElement('meta');
  metaDescription.setAttribute('name', 'description');
  metaDescription.setAttribute(
    'content',
    description ? description.substring(0, 160) + (description.length > 160 ? '...' : '') : title,
  );
  head.appendChild(metaDescription);

  // Canonical URL
  const itemPath = `${item.sectionPath}/${item.id || item.citationKey}`;
  const canonicalLink = document.createElement('link');
  canonicalLink.setAttribute('rel', 'canonical');
  canonicalLink.setAttribute('href', `${config.site.baseUrl}${itemPath}`);
  head.appendChild(canonicalLink);

  // Open Graph tags
  const ogTitle = document.createElement('meta');
  ogTitle.setAttribute('property', 'og:title');
  ogTitle.setAttribute('content', title);
  head.appendChild(ogTitle);

  const ogDescription = document.createElement('meta');
  ogDescription.setAttribute('property', 'og:description');
  ogDescription.setAttribute(
    'content',
    description ? description.substring(0, 300) + (description.length > 300 ? '...' : '') : title,
  );
  head.appendChild(ogDescription);

  const ogUrl = document.createElement('meta');
  ogUrl.setAttribute('property', 'og:url');
  ogUrl.setAttribute('content', `${config.site.baseUrl}${itemPath}`);
  head.appendChild(ogUrl);

  const ogType = document.createElement('meta');
  ogType.setAttribute('property', 'og:type');

  // Set appropriate OG type
  const section = config.sections.find((s) => s.id === item.contentType);
  if (
    section &&
    section.template === 'listOfItems' &&
    (item.contentType === 'Publications' || item.contentType === 'Blog')
  ) {
    ogType.setAttribute('content', 'article');
  } else {
    ogType.setAttribute('content', 'website');
  }
  head.appendChild(ogType);

  // Image if available
  const image = getNestedValue(item, 'image');
  if (image) {
    const ogImage = document.createElement('meta');
    ogImage.setAttribute('property', 'og:image');
    ogImage.setAttribute('content', image.startsWith('http') ? image : `${baseUrl}${image}`);
    head.appendChild(ogImage);
  }

  // Twitter Card tags
  const twitterCard = document.createElement('meta');
  twitterCard.setAttribute('name', 'twitter:card');
  twitterCard.setAttribute('content', image ? 'summary_large_image' : 'summary');
  head.appendChild(twitterCard);

  const twitterTitle = document.createElement('meta');
  twitterTitle.setAttribute('name', 'twitter:title');
  twitterTitle.setAttribute('content', title);
  head.appendChild(twitterTitle);

  const twitterDescription = document.createElement('meta');
  twitterDescription.setAttribute('name', 'twitter:description');
  twitterDescription.setAttribute(
    'content',
    description ? description.substring(0, 200) + (description.length > 200 ? '...' : '') : title,
  );
  head.appendChild(twitterDescription);

  if (image) {
    const twitterImage = document.createElement('meta');
    twitterImage.setAttribute('name', 'twitter:image');
    twitterImage.setAttribute('content', image.startsWith('http') ? image : `${baseUrl}${image}`);
    head.appendChild(twitterImage);
  }

  // Add content-specific metadata
  // Publications get academic citation meta tags
  if (item.contentType === 'Publications' || (item.entryTags && item.citationKey)) {
    // Citation title
    if (title) {
      const metaTitle = document.createElement('meta');
      metaTitle.setAttribute('name', 'citation_title');
      metaTitle.setAttribute('content', title);
      head.appendChild(metaTitle);

      // Dublin Core metadata
      const dcTitle = document.createElement('meta');
      dcTitle.setAttribute('name', 'DC.title');
      dcTitle.setAttribute('content', title);
      head.appendChild(dcTitle);
    }

    // Citation authors
    const authors = item.entryTags?.author;
    if (authors) {
      authors.split(', ').forEach((author) => {
        const metaAuthor = document.createElement('meta');
        metaAuthor.setAttribute('name', 'citation_author');
        metaAuthor.setAttribute('content', author.replace(' and ', ''));
        head.appendChild(metaAuthor);

        // Dublin Core author
        const dcAuthor = document.createElement('meta');
        dcAuthor.setAttribute('name', 'DC.creator');
        dcAuthor.setAttribute('content', author.replace(' and ', ''));
        head.appendChild(dcAuthor);
      });
    }

    // Citation date
    const year = item.entryTags?.year;
    if (year) {
      const metaYear = document.createElement('meta');
      metaYear.setAttribute('name', 'citation_publication_date');
      metaYear.setAttribute('content', year);
      head.appendChild(metaYear);

      // Dublin Core date
      const dcDate = document.createElement('meta');
      dcDate.setAttribute('name', 'DC.date');
      dcDate.setAttribute('content', year);
      head.appendChild(dcDate);
    }

    // Citation venue
    const journal = item.entryTags?.journal;
    const booktitle = item.entryTags?.booktitle;

    if (journal) {
      const metaJournal = document.createElement('meta');
      metaJournal.setAttribute('name', 'citation_journal_title');
      metaJournal.setAttribute('content', journal);
      head.appendChild(metaJournal);

      // Add publication venue type
      const metaPublicationType = document.createElement('meta');
      metaPublicationType.setAttribute('name', 'citation_publication_type');
      metaPublicationType.setAttribute('content', 'journal');
      head.appendChild(metaPublicationType);
    } else if (booktitle) {
      const metaConference = document.createElement('meta');
      metaConference.setAttribute('name', 'citation_conference_title');
      metaConference.setAttribute('content', booktitle);
      head.appendChild(metaConference);

      // Add publication venue type
      const metaPublicationType = document.createElement('meta');
      metaPublicationType.setAttribute('name', 'citation_publication_type');
      metaPublicationType.setAttribute('content', 'conference');
      head.appendChild(metaPublicationType);
    }

    // Citation DOI
    const doi = item.entryTags?.doi;
    if (doi) {
      const metaDoi = document.createElement('meta');
      metaDoi.setAttribute('name', 'citation_doi');
      metaDoi.setAttribute('content', doi);
      head.appendChild(metaDoi);

      // Dublin Core identifier
      const dcIdentifier = document.createElement('meta');
      dcIdentifier.setAttribute('name', 'DC.identifier');
      dcIdentifier.setAttribute('content', `doi:${doi}`);
      head.appendChild(dcIdentifier);
    }

    // Citation PDF
    const paperurl = item.entryTags?.paperurl;
    if (paperurl) {
      const metaPdf = document.createElement('meta');
      metaPdf.setAttribute('name', 'citation_pdf_url');
      // Use absolute URL for PDF
      const pdfUrl = paperurl.startsWith('http') ? paperurl : new URL(paperurl, baseUrl).href;
      metaPdf.setAttribute('content', pdfUrl);
      head.appendChild(metaPdf);

      // Dublin Core format
      const dcFormat = document.createElement('meta');
      dcFormat.setAttribute('name', 'DC.format');
      dcFormat.setAttribute('content', 'application/pdf');
      head.appendChild(dcFormat);
    }

    // Keywords
    const keywords = item.entryTags?.keywords;
    if (keywords) {
      // Add keywords meta tag
      const metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      metaKeywords.setAttribute('content', keywords);
      head.appendChild(metaKeywords);

      // Dublin Core subject
      const dcSubject = document.createElement('meta');
      dcSubject.setAttribute('name', 'DC.subject');
      dcSubject.setAttribute('content', keywords);
      head.appendChild(dcSubject);
    }
  } else {
    // Other content types

    // Keywords for all content types
    let keywords;
    if (item.keywords) {
      keywords = item.keywords;
    } else if (item.tags) {
      keywords = Array.isArray(item.tags) ? item.tags.join(', ') : item.tags;
    } else if (item.technologies) {
      keywords = Array.isArray(item.technologies)
        ? item.technologies.join(', ')
        : item.technologies;
    }

    if (keywords) {
      const metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      metaKeywords.setAttribute('content', keywords);
      head.appendChild(metaKeywords);

      // For blog posts, add article:tag for each tag
      if (item.contentType === 'Blog' && item.tags && Array.isArray(item.tags)) {
        item.tags.forEach((tag) => {
          const metaTag = document.createElement('meta');
          metaTag.setAttribute('property', 'article:tag');
          metaTag.setAttribute('content', tag);
          head.appendChild(metaTag);
        });
      }
    }

    // Published date for blog posts
    if (item.date) {
      const metaPublishedDate = document.createElement('meta');
      metaPublishedDate.setAttribute('name', 'article:published_time');
      metaPublishedDate.setAttribute('content', item.date);
      head.appendChild(metaPublishedDate);
    }
  }

  // Add language meta tag for all content types
  const metaLang = document.createElement('meta');
  metaLang.setAttribute('name', 'DC.language');
  metaLang.setAttribute('content', 'en');
  head.appendChild(metaLang);
}

// Function to create HTML content for an item
async function createContentHtmlFile(item, templateHtml, config, shortenedTextsData) {
  try {
    const contentType = item.contentType;
    const id = item.id || item.citationKey;

    if (!id) {
      console.error('Item has no ID or citation key:', item);
      return null;
    }

    // Properly construct section path and item directory path
    const sectionPath = item.sectionPath || `/${contentType.toLowerCase()}`;
    let itemPath = sectionPath;
    if (!itemPath.endsWith('/')) {
      itemPath += '/';
    }
    itemPath += id;

    const outputDir = path.join(distDir, itemPath);

    console.log(`Creating HTML file for: ${itemPath}`);

    // Create the directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, 'index.html');

    // Get SEO texts for this content
    const contentPath = `${contentType.toLowerCase()}/${id}`;
    const seoTexts = getItemSeoTexts(contentPath, shortenedTextsData);

    // Get optimized title and description
    const title = getSeoText(seoTexts, 'title') || item.title || config.site.title;
    const description =
      getSeoText(seoTexts, 'description') ||
      (item.abstract ? item.abstract.substring(0, 160) + '...' : '') ||
      config.site.description;

    // Apply template variables
    const processedHtml = processTemplate(templateHtml, {
      ...config,
      contentType,
      contentItem: item,
      site: config.site,
      seoTitle: title,
      seoDescription: description,
      canonicalUrl: `${config.site.baseUrl}${itemPath}`,
      googleAnalytics: generateGoogleAnalytics(config.site.googleAnalyticsId),
      publicationDOI:
        contentType.toLowerCase() === 'publications' && item.entryTags?.doi
          ? item.entryTags.doi
          : contentType.toLowerCase() === 'publications' && item.doi
            ? item.doi
            : '',
    });

    // Create DOM from processed HTML template
    const dom = new JSDOM(processedHtml);
    const { document } = dom.window;

    // Set meta tags
    const metaTags = document.querySelector('head');

    // Define helper function to update meta tags
    function updateMetaTag(name, content, isProperty = false) {
      // Skip if content is undefined or null
      if (content === undefined || content === null) {
        return;
      }

      const attr = isProperty ? 'property' : 'name';
      const meta = document.querySelector(`meta[${attr}="${name}"]`);
      if (meta) {
        meta.setAttribute('content', content);
      } else {
        const newMeta = document.createElement('meta');
        newMeta.setAttribute(attr, name);
        newMeta.setAttribute('content', content);
        metaTags.appendChild(newMeta);
      }
    }

    // Update or set title
    const titleTag = document.querySelector('title');
    if (titleTag) {
      titleTag.textContent = title;
    } else {
      const newTitle = document.createElement('title');
      newTitle.textContent = title;
      metaTags.appendChild(newTitle);
    }

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', config.site.keywords);
    updateMetaTag('author', config.site.author);
    updateMetaTag('google-site-verification', config.site.googleSiteVerification);

    // OpenGraph meta tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:url', `${config.site.baseUrl}${itemPath}`, true);
    updateMetaTag(
      'og:type',
      contentType.toLowerCase() === 'publications' ? 'article' : 'website',
      true,
    );
    if (item.image) {
      updateMetaTag('og:image', `${config.site.baseUrl}${item.image}`, true);
    } else {
      updateMetaTag('og:image', `${config.site.baseUrl}/logo.svg`, true);
    }

    // Twitter card meta tags
    updateMetaTag('twitter:card', 'summary_large_image', true);
    updateMetaTag('twitter:title', title, true);
    updateMetaTag('twitter:description', description, true);
    updateMetaTag('twitter:url', `${config.site.baseUrl}${itemPath}`, true);
    if (item.image) {
      updateMetaTag('twitter:image', `${config.site.baseUrl}${item.image}`, true);
    } else {
      updateMetaTag('twitter:image', `${config.site.baseUrl}/logo.svg`, true);
    }

    // Add canonical URL
    const canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    canonicalLink.setAttribute('href', `${config.site.baseUrl}${itemPath}`);
    metaTags.appendChild(canonicalLink);

    // Add citation meta tags for publications
    if (contentType === 'publications') {
      updateMetaTag('citation_title', item.title, true);
      updateMetaTag('DC.title', item.title, true);

      if (item.authors) {
        const authors = Array.isArray(item.authors) ? item.authors : [item.authors];
        authors.forEach((author) => {
          updateMetaTag('citation_author', author, true);
          updateMetaTag('DC.creator', author, true);
        });
      }

      if (item.year) {
        updateMetaTag('citation_publication_date', item.year, true);
        updateMetaTag('DC.date', item.year, true);
      }

      if (item.journal) {
        updateMetaTag('citation_journal_title', item.journal, true);
      }

      if (item.doi) {
        updateMetaTag('citation_doi', item.doi, true);
        updateMetaTag('DC.identifier', `doi:${item.doi}`, true);
      }

      if (item.pdf || item.paperurl) {
        const pdfUrl = item.pdf || item.paperurl;
        if (pdfUrl) {
          updateMetaTag('citation_pdf_url', `${config.site.baseUrl}${pdfUrl}`, true);
          updateMetaTag('DC.format', 'application/pdf', true);
        }
      }
    }

    // Add keyword meta tags
    if (item.keywords) {
      const keywords = Array.isArray(item.keywords) ? item.keywords.join(', ') : item.keywords;
      updateMetaTag('keywords', keywords, true);
      updateMetaTag('DC.subject', keywords, true);
    }

    // Set language
    updateMetaTag('DC.language', 'en', true);

    // Add JSON-LD structured data for publications
    if (contentType === 'publications') {
      const jsonLd = generateJsonLd(item, `${config.site.baseUrl}${itemPath}`, config.site.baseUrl);
      const script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.textContent = JSON.stringify(jsonLd);
      metaTags.appendChild(script);
    }

    // Add the full item data to the page in a script tag with ID 'publication-data'
    // This will allow React to rehydrate with the correct data when directly accessing the page
    const dataSectionConfig = config.sections.find(
      (s) => s.id.toLowerCase() === contentType.toLowerCase(),
    );
    const publicationDataScript = document.createElement('script');
    publicationDataScript.id = 'publication-data';
    publicationDataScript.setAttribute('type', 'application/json');

    // Create a clean version of the config with only the essential information
    const essentialConfig = {
      site: config.site,
      sections: config.sections.map((s) => ({
        id: s.id,
        title: s.title,
        path: s.path,
        dataSource: s.dataSource,
        dataType: s.dataType,
      })),
    };

    // Create the data object to be embedded
    const publicationData = {
      entry: item,
      config: essentialConfig,
      sectionConfig: dataSectionConfig,
    };

    publicationDataScript.textContent = JSON.stringify(publicationData);
    metaTags.appendChild(publicationDataScript);

    // Add prerendered content
    const contentDiv = document.createElement('div');
    contentDiv.id = 'prerendered-content';

    // Add content based on type
    renderPrerenderContent(contentDiv, item, document, contentType);

    // Insert content before the root div
    const root = document.getElementById('root');
    if (root && root.parentNode) {
      root.parentNode.insertBefore(contentDiv, root);
    }

    // Write the HTML to the output file
    fs.writeFileSync(outputPath, dom.serialize());
    console.log(`Created HTML file: ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error(`Error creating HTML for item ${item.title}:`, error);
    throw error;
  }
}

// Create a redirect HTML file for a short URL
function createShortUrlRedirect(shortUrl, targetPath, config) {
  try {
    const shortUrlDir = path.join(distDir, shortUrl);
    fs.mkdirSync(shortUrlDir, { recursive: true });

    // Create a redirect HTML file with appropriate meta tags for SEO
    const redirectHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Redirecting...</title>
          <meta http-equiv="refresh" content="0;url=${targetPath}">
          <link rel="canonical" href="${config.baseUrl || ''}${targetPath}">
          
          <!-- Additional meta tags for better SEO -->
          <meta name="robots" content="noindex, follow">
          
          <!-- Open Graph tags -->
          <meta property="og:url" content="${config.baseUrl || ''}${targetPath}">
          <meta property="og:type" content="website">
          <meta property="og:title" content="Redirecting...">
          
          <!-- Script-based redirect for better reliability -->
          <script>window.location.href = "${targetPath}";</script>
        </head>
        <body>
          <p>Redirecting to <a href="${targetPath}">${targetPath}</a></p>
        </body>
      </html>
    `;

    fs.writeFileSync(path.join(shortUrlDir, 'index.html'), redirectHtml);
    console.log(`Generated redirect for short URL ${shortUrl} -> ${targetPath}`);
    return true;
  } catch (error) {
    console.error(`Error creating short URL redirect for ${shortUrl}:`, error);
    return false;
  }
}

// Main function to generate all static pages
async function generateStaticPages() {
  try {
    console.log('Starting static page generation...');

    // Generate SEO texts first
    const shortenedTexts = await generateSeoTexts();

    // Read the config file
    const config = JSON.parse(fs.readFileSync(path.join(publicDir, 'config.json'), 'utf8'));

    // Read the index.html template
    const indexPath = path.join(distDir, 'index.html');
    const indexHtml = fs.readFileSync(indexPath, 'utf8');

    // Process the main index.html with config values
    const processedIndexHtml = processTemplate(indexHtml, {
      ...config,
      site: config.site,
      seoTitle: config.site.title,
      seoDescription: config.site.description,
      canonicalUrl: config.site.baseUrl,
      googleAnalytics: generateGoogleAnalytics(config.site.googleAnalyticsId),
      publicationDOI: '', // Empty for main page
    });

    // Create DOM for the main index page and update meta tags
    const mainDom = new JSDOM(processedIndexHtml);
    const { document } = mainDom.window;
    const metaTags = document.querySelector('head');

    // Define helper function to update meta tags
    function updateMetaTag(name, content, isProperty = false) {
      // Skip if content is undefined or null
      if (content === undefined || content === null) {
        return;
      }

      const attr = isProperty ? 'property' : 'name';
      const meta = document.querySelector(`meta[${attr}="${name}"]`);
      if (meta) {
        meta.setAttribute('content', content);
      } else {
        const newMeta = document.createElement('meta');
        newMeta.setAttribute(attr, name);
        newMeta.setAttribute('content', content);
        metaTags.appendChild(newMeta);
      }
    }

    // Update or set title
    const titleTag = document.querySelector('title');
    if (titleTag) {
      titleTag.textContent = config.site.title;
    } else {
      const newTitle = document.createElement('title');
      newTitle.textContent = config.site.title;
      metaTags.appendChild(newTitle);
    }

    // Basic meta tags
    updateMetaTag('description', config.site.description);
    updateMetaTag('keywords', config.site.keywords);
    updateMetaTag('author', config.site.author);
    updateMetaTag('google-site-verification', config.site.googleSiteVerification);

    // OpenGraph meta tags
    updateMetaTag('og:title', config.site.title, true);
    updateMetaTag('og:description', config.site.description, true);
    updateMetaTag('og:url', config.site.baseUrl, true);
    updateMetaTag('og:type', 'website', true);
    updateMetaTag('og:image', `${config.site.baseUrl}/logo.svg`, true);

    // Twitter card meta tags
    updateMetaTag('twitter:card', 'summary_large_image', true);
    updateMetaTag('twitter:title', config.site.title, true);
    updateMetaTag('twitter:description', config.site.description, true);
    updateMetaTag('twitter:url', config.site.baseUrl, true);
    updateMetaTag('twitter:image', `${config.site.baseUrl}/logo.svg`, true);

    // Add canonical URL
    const canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    canonicalLink.setAttribute('href', config.site.baseUrl);
    metaTags.appendChild(canonicalLink);

    // Write the processed HTML back to the file
    fs.writeFileSync(indexPath, mainDom.serialize());
    console.log('Processed main index.html with configuration values');

    // Process all content
    const content = await processAllContent(config);
    console.log('Content processed, generating static pages...');

    // Generate content pages
    const allContentItems = [];

    // Process each section's content
    for (const [section, items] of Object.entries(content)) {
      for (const item of items) {
        item.contentType = section;
        allContentItems.push(item);
      }
    }

    // Create HTML files for all content items
    console.log(`Creating HTML files for ${allContentItems.length} content items...`);
    const htmlPromises = allContentItems.map((item) =>
      createContentHtmlFile(item, processedIndexHtml, config, shortenedTexts),
    );

    await Promise.all(htmlPromises);
    console.log('All content HTML files created successfully');

    // Extract shorturls from all content items
    const shortUrlMap = extractShortUrls(allContentItems);
    console.log(`Found ${Object.keys(shortUrlMap).length} short URLs`);

    // Generate short URL redirects
    console.log('Generating short URL redirects...');
    for (const [shortUrl, targetPath] of Object.entries(shortUrlMap)) {
      createShortUrlRedirect(shortUrl, targetPath, config);
    }

    // Note: Sitemap generation is handled by generate-sitemap.js
    console.log('Static page generation completed! Run generate-sitemap.js to update the sitemap.');
  } catch (error) {
    console.error('Error in static page generation:', error);
  }
}

// Extract shorturls from all content items
function extractShortUrls(allContentItems) {
  const shortUrlMap = {};

  allContentItems.forEach((item) => {
    // Get ID based on item type
    const id = item.id || item.citationKey;
    if (!id) return;

    // First check for shorturl at root level
    let shorturl = item.shorturl;

    // Then check in entryTags for bibtex entries
    if (!shorturl && item.entryTags?.shorturl) {
      shorturl = item.entryTags.shorturl;
    }

    // If we found a shorturl, add it to the map
    if (shorturl) {
      const sectionPath = item.sectionPath || `/${item.contentType.toLowerCase()}`;
      shortUrlMap[shorturl] = `${sectionPath}/${id}`;
      console.log(`Found shorturl: ${shorturl} -> ${sectionPath}/${id}`);
    }
  });

  return shortUrlMap;
}

// Function to generate JSON-LD structured data
function generateJsonLd(item, pageUrl, baseUrl) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    name: item.title,
    description: item.abstract || '',
  };

  if (item.authors) {
    const authors = Array.isArray(item.authors) ? item.authors : [item.authors];
    jsonLd.author = authors.map((name) => ({
      '@type': 'Person',
      name: name,
    }));
  }

  if (item.year) {
    jsonLd.datePublished = item.year;
  }

  if (item.journal || item.booktitle) {
    jsonLd.publisher = item.journal || item.booktitle;
  }

  if (item.doi) {
    jsonLd.identifier = {
      '@type': 'PropertyValue',
      propertyID: 'DOI',
      value: item.doi,
    };
  }

  const mediaItems = [];
  if (item.pdf || item.paperurl) {
    mediaItems.push({
      '@type': 'CreativeWork',
      name: 'Full Paper',
      url: `${baseUrl}${item.pdf || item.paperurl}`,
      encodingFormat: 'application/pdf',
    });
  }

  if (item.github) {
    mediaItems.push({
      '@type': 'SoftwareSourceCode',
      name: 'Source Code',
      codeRepository: item.github,
    });
  }

  if (mediaItems.length > 0) {
    jsonLd.associatedMedia = mediaItems;
  }

  return jsonLd;
}

// Function to render prerendered content
function renderPrerenderContent(contentDiv, item, document, contentType) {
  // Debug logging
  console.log(`Rendering content for ${contentType} item:`, {
    title: item.title,
    hasImage: !!item.image,
    hasAbstract: !!item.abstract,
    hasKeywords: !!item.keywords,
  });

  // Create content heading
  const h1 = document.createElement('h1');
  h1.textContent = item.title || (item.entryTags && item.entryTags.title) || '';
  contentDiv.appendChild(h1);

  // Log the title we're setting
  console.log(`Setting title to: "${h1.textContent}"`);

  // Add image if available
  if (item.image) {
    const imageContainer = document.createElement('div');
    imageContainer.className = 'image-container';
    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.title || '';
    imageContainer.appendChild(img);
    contentDiv.appendChild(imageContainer);
  }

  // Add award if available
  if (item.awards) {
    const awardDiv = document.createElement('div');
    awardDiv.className = 'award';
    const awardIcon = document.createElement('span');
    awardIcon.className = 'award-icon';
    awardIcon.textContent = '🏆';
    awardDiv.appendChild(awardIcon);
    awardDiv.appendChild(document.createTextNode(' ' + item.awards));
    contentDiv.appendChild(awardDiv);
  }

  // Basic metadata
  const metadataDiv = document.createElement('div');
  metadataDiv.className = 'metadata';
  contentDiv.appendChild(metadataDiv);

  // Year
  const year = item.year || (item.entryTags && item.entryTags.year);
  if (year) {
    const yearP = document.createElement('p');
    const yearStrong = document.createElement('strong');
    yearStrong.textContent = 'Year: ';
    yearP.appendChild(yearStrong);
    yearP.appendChild(document.createTextNode(year));
    metadataDiv.appendChild(yearP);
  }

  // Journal/Conference
  const journal = item.journal || (item.entryTags && item.entryTags.journal);
  const booktitle = item.booktitle || (item.entryTags && item.entryTags.booktitle);

  if (journal) {
    const journalP = document.createElement('p');
    const journalStrong = document.createElement('strong');
    journalStrong.textContent = 'Journal: ';
    journalP.appendChild(journalStrong);
    journalP.appendChild(document.createTextNode(journal));
    metadataDiv.appendChild(journalP);
  } else if (booktitle) {
    const confP = document.createElement('p');
    const confStrong = document.createElement('strong');
    confStrong.textContent = 'Conference: ';
    confP.appendChild(confStrong);
    confP.appendChild(document.createTextNode(booktitle));
    metadataDiv.appendChild(confP);
  }

  // Authors
  const authors = item.authors || (item.entryTags && item.entryTags.author);
  if (authors) {
    const authorsP = document.createElement('p');
    const authorsStrong = document.createElement('strong');
    authorsStrong.textContent = 'Authors: ';
    authorsP.appendChild(authorsStrong);
    authorsP.appendChild(document.createTextNode(authors));
    metadataDiv.appendChild(authorsP);
  }

  // DOI
  const doi = item.doi || (item.entryTags && item.entryTags.doi);
  if (doi && (contentType.toLowerCase() === 'publications' || contentType === 'Publications')) {
    const doiP = document.createElement('p');
    const doiStrong = document.createElement('strong');
    doiStrong.textContent = 'DOI: ';
    doiP.appendChild(doiStrong);

    // Create a clickable DOI link
    const doiLink = document.createElement('a');
    doiLink.href = `https://doi.org/${doi}`;
    doiLink.textContent = doi;
    doiLink.target = '_blank';
    doiLink.rel = 'noopener noreferrer';

    doiP.appendChild(doiLink);
    metadataDiv.appendChild(doiP);
  }

  // Abstract
  const abstract = item.abstract || (item.entryTags && item.entryTags.abstract);
  if (abstract) {
    const h3 = document.createElement('h3');
    h3.textContent = 'Abstract';
    contentDiv.appendChild(h3);

    const abstractDiv = document.createElement('div');
    abstractDiv.className = 'markdown-content';
    abstractDiv.textContent = abstract;
    contentDiv.appendChild(abstractDiv);
  }

  // Keywords
  const itemKeywords = item.keywords || (item.entryTags && item.entryTags.keywords);
  if (itemKeywords) {
    const h3 = document.createElement('h3');
    h3.textContent = 'Keywords';
    contentDiv.appendChild(h3);

    const tagsDiv = document.createElement('div');
    tagsDiv.className = 'tags';

    const keywords = Array.isArray(itemKeywords) ? itemKeywords : itemKeywords.split(',');
    keywords.forEach((keyword) => {
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = keyword.trim();
      tagsDiv.appendChild(tag);
      tagsDiv.appendChild(document.createTextNode(' '));
    });

    contentDiv.appendChild(tagsDiv);
  }

  // Citation (for publications)
  if (
    (contentType.toLowerCase() === 'publications' || contentType === 'Publications') &&
    (item.entryType || (item.entryTags && item.entryTags.entryType))
  ) {
    const h2 = document.createElement('h2');
    h2.textContent = 'Citation';
    contentDiv.appendChild(h2);

    const pre = document.createElement('pre');
    const code = document.createElement('code');
    code.className = 'language-bibtex';
    code.textContent = generateEnhancedBibTexEntry(item);
    pre.appendChild(code);
    contentDiv.appendChild(pre);
  }
}

// Process all content from different sources
async function processAllContent(config) {
  try {
    const content = {};

    // Process content sections
    const contentSections = config.sections.filter(
      (section) => section.dataSource && !section.hideSection,
    );
    console.log(`Found ${contentSections.length} content sections with data sources`);

    // Process each section
    for (const section of contentSections) {
      const dataSourcePath = path.join(publicDir, section.dataSource.replace(/^\//, ''));

      // Check if data source file exists
      if (!fs.existsSync(dataSourcePath)) {
        console.error(`Data source file not found: ${dataSourcePath}`);
        content[section.id] = [];
        continue;
      }

      console.log(`Processing ${section.id} data from ${dataSourcePath}`);

      // Process data based on type
      let sectionItems = [];
      if (section.dataType === 'bibtex') {
        sectionItems = await processBibtexData(dataSourcePath, section.id, config);
      } else {
        sectionItems = await processJsonData(dataSourcePath, section.id, config);
      }

      content[section.id] = sectionItems;
      console.log(`Processed ${sectionItems.length} items for ${section.id}`);
    }

    return content;
  } catch (error) {
    console.error('Error processing content:', error);
    return {};
  }
}

// Run the static page generator
generateStaticPages().catch((error) => {
  console.error('Unhandled error in static page generation:', error);
  // Use a safer approach to exit the process
  setTimeout(() => {
    process.exit(1);
  }, 0);
});
