import DOMPurify from 'dompurify';
import {
  FaLinkedin,
  FaGithub,
  FaOrcid,
  FaResearchgate,
  FaYoutube,
  FaSlideshare,
  FaDatabase,
  FaUniversity,
  FaNewspaper,
  FaBook,
} from 'react-icons/fa';
import { FaGoogleScholar, FaXTwitter } from 'react-icons/fa6';
import { MdEmail, MdScience } from 'react-icons/md';
import {
  SiAcademia,
  SiScopus,
  SiArxiv,
  SiSemanticscholar,
  SiFigshare,
  SiMendeley,
  SiZotero,
} from 'react-icons/si';
import { IoMdDocument } from 'react-icons/io';

export const getPath = (filename, citationKey) => {
  if (!filename) return null;
  if (!citationKey) return null;
  return `/publications/${citationKey}/${filename}`;
};

export const getPublicationDetailsPath = (citationKey) => {
  if (!citationKey) return null;
  const pathName = `/publication/${citationKey}`;
  console.log('pathName', pathName);
  return pathName;
};

// Utility function to remove LaTeX-style curly braces
const removeLaTeXBraces = (text) => {
  return text ? text.replace(/\{([^{}]*)\}/g, '$1') : '';
};

// Function to clean entry tags and add file paths
export const cleanEntryTags = (entryTags, citationKey) => {
  const cleanedTags = {};
  for (const [key, value] of Object.entries(entryTags)) {
    cleanedTags[key] = removeLaTeXBraces(value);
  }
  // Add image and paper paths
  if (cleanedTags.image) {
    cleanedTags.image = getPath(cleanedTags.image, citationKey);
  }
  if (cleanedTags.paperurl) {
    cleanedTags.paperurl = getPath(cleanedTags.paperurl, citationKey);
  }
  if (cleanedTags.blogpost) {
    cleanedTags.blogpost = getPath(cleanedTags.blogpost, citationKey);
  }
  if (cleanedTags.slides) {
    cleanedTags.slides = getPath(cleanedTags.slides, citationKey);
  }
  return cleanedTags;
};

export const parseHtml = (html) => {
  return { __html: DOMPurify.sanitize(html) };
};

export function formatAuthorNames(entries) {
  return entries.map((entry) => {
    if (entry.entryTags.author) {
      const authors = entry.entryTags.author.split(' and ');
      const formattedAuthors = authors.map((author) => {
        const [lastName, firstName] = author.split(', ');
        return `${firstName} ${lastName}`;
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

export const iconMap = {
  linkedin: FaLinkedin,
  googleScholar: FaGoogleScholar,
  github: FaGithub,
  orcid: FaOrcid,
  researchGate: FaResearchgate,
  academiaEdu: SiAcademia,
  webOfScience: FaBook,
  scopus: SiScopus,
  twitter: FaXTwitter,
  arxiv: SiArxiv,
  semanticScholar: SiSemanticscholar,
  youTube: FaYoutube,
  slideshare: FaSlideshare,
  figshare: SiFigshare,
  mendeley: SiMendeley,
  zotero: SiZotero,
  dblp: FaDatabase,
  universityProfile: FaUniversity,
  publons: IoMdDocument,
  microsoftAcademic: MdScience,
  impactStory: FaNewspaper,
  email: MdEmail,
};

// Function to update meta tags for SEO
export const updateMetaTags = (publication, baseUrl = 'https://s-agarwl.github.io') => {
  if (!publication) return;

  // Update basic meta tags
  document.title = `${publication.entryTags.title} | Research Publication`;

  // Find or create meta description
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.name = 'description';
    document.head.appendChild(metaDescription);
  }
  metaDescription.content = publication.entryTags.abstract
    ? publication.entryTags.abstract.substring(0, 160) + '...'
    : `Research publication: ${publication.entryTags.title}`;

  // Update Open Graph tags
  updateOrCreateMetaTag('og:title', publication.entryTags.title);
  updateOrCreateMetaTag(
    'og:description',
    publication.entryTags.abstract
      ? publication.entryTags.abstract.substring(0, 160) + '...'
      : `Research publication: ${publication.entryTags.title}`,
  );
  updateOrCreateMetaTag('og:type', 'article');

  // Create canonical URL and set it for Open Graph
  const canonicalUrl = `${baseUrl}/publication/${publication.citationKey}`;
  updateOrCreateMetaTag('og:url', canonicalUrl);
  setCanonicalUrl(canonicalUrl);

  if (publication.entryTags.image) {
    updateOrCreateMetaTag('og:image', publication.entryTags.image);
  }

  // Update Twitter Card tags
  updateOrCreateMetaTag('twitter:title', publication.entryTags.title);
  updateOrCreateMetaTag(
    'twitter:description',
    publication.entryTags.abstract
      ? publication.entryTags.abstract.substring(0, 160) + '...'
      : `Research publication: ${publication.entryTags.title}`,
  );
  updateOrCreateMetaTag('twitter:card', 'summary_large_image');

  if (publication.entryTags.image) {
    updateOrCreateMetaTag('twitter:image', publication.entryTags.image);
  }

  // Add publication-specific schema.org metadata
  addSchemaOrgMetadata(publication);
};

// Helper function to update or create meta tags
const updateOrCreateMetaTag = (property, content) => {
  let metaTag = document.querySelector(`meta[property="${property}"]`);
  if (!metaTag) {
    metaTag = document.createElement('meta');
    metaTag.setAttribute('property', property);
    document.head.appendChild(metaTag);
  }
  metaTag.content = content;
};

// Add schema.org metadata for publications
const addSchemaOrgMetadata = (publication) => {
  // Remove any existing schema
  const existingSchema = document.querySelector('script[type="application/ld+json"]');
  if (existingSchema) {
    existingSchema.remove();
  }

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    headline: publication.entryTags.title,
    author: publication.entryTags.author.split(', ').map((name) => ({
      '@type': 'Person',
      name: name,
    })),
    datePublished: publication.entryTags.year,
    description: publication.entryTags.abstract || '',
    keywords: publication.entryTags.keywords || '',
  };

  // Add optional fields if they exist
  if (publication.entryTags.doi) {
    schemaData.identifier = publication.entryTags.doi;
  }

  if (publication.entryTags.journal) {
    schemaData.isPartOf = {
      '@type': 'Periodical',
      name: publication.entryTags.journal,
    };
  }

  if (publication.entryTags.url) {
    schemaData.url = publication.entryTags.url;
  }

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(schemaData);
  document.head.appendChild(script);
};

// Function to set canonical URL
export const setCanonicalUrl = (url) => {
  // Remove any existing canonical link
  const existingCanonical = document.querySelector('link[rel="canonical"]');
  if (existingCanonical) {
    existingCanonical.remove();
  }

  // Create and add the canonical link
  const canonicalLink = document.createElement('link');
  canonicalLink.rel = 'canonical';
  canonicalLink.href = url;
  document.head.appendChild(canonicalLink);
};
