import DOMPurify from 'dompurify';
import React from 'react';
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
