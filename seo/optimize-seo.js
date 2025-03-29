import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import convertBibtexToJson from '../../src/utils/bibtexToJson.js';
import { processContentItem } from '../../src/utils/textOptimization.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '..');
const seoDir = path.resolve(__dirname);

// Load configurations
const config = JSON.parse(fs.readFileSync(path.join(seoDir, 'config.json'), 'utf8'));

// Helper function to clean text
function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/\s+/g, ' ')
    .replace(/[^\x20-\x7E]/g, '')
    .trim();
}

// Helper function to truncate text at sentence boundary
function truncateAtSentence(text, maxLength) {
  if (!text) return '';
  if (text.length <= maxLength) return text;

  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  let result = '';

  for (const sentence of sentences) {
    if ((result + sentence).length > maxLength) break;
    result += sentence;
  }

  return result.trim();
}

// Generate fallback shortened text
function generateFallbackText(text, type) {
  if (!text) return '';

  const fallbackConfig = config.fallback[type];
  let result = cleanText(text);

  if (type === 'title') {
    // Remove common suffixes
    for (const suffix of fallbackConfig.suffixes) {
      if (result.endsWith(suffix)) {
        result = result.slice(0, -suffix.length).trim();
      }
    }

    // Truncate if still too long
    if (result.length > fallbackConfig.maxLength) {
      result = result.slice(0, fallbackConfig.maxLength - 3) + '...';
    }
  } else {
    // For descriptions, try to break at sentence boundary
    if (fallbackConfig.sentenceBreaks) {
      result = truncateAtSentence(result, fallbackConfig.maxLength);
    } else {
      result = result.slice(0, fallbackConfig.maxLength - 3) + '...';
    }
  }

  return result;
}

// Process BibTeX entries
function processBibtexEntries(filePath) {
  const bibtexData = fs.readFileSync(filePath, 'utf8');
  const entries = convertBibtexToJson(bibtexData);

  return entries.map((entry) => processContentItem(entry, 'publication', config));
}

// Process JSON content
function processJsonContent(filePath, type) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return data.map((item) => processContentItem(item, type, config));
}

// Main function to process all content
async function processAllContent() {
  const shortenedTexts = {
    items: {},
  };

  // Process publications
  const publications = processBibtexEntries(path.join(publicDir, 'data/pubs.bib'));
  publications.forEach((pub) => {
    shortenedTexts.items[`publications/${pub.id}`] = pub;
  });

  // Process projects
  const projects = processJsonContent(path.join(publicDir, 'data/projects.json'), 'project');
  projects.forEach((proj) => {
    shortenedTexts.items[`projects/${proj.id}`] = proj;
  });

  // Process talks
  const talks = processJsonContent(path.join(publicDir, 'data/talks.json'), 'talk');
  talks.forEach((talk) => {
    shortenedTexts.items[`talks/${talk.id}`] = talk;
  });

  // Process blog posts
  const blogPosts = processJsonContent(path.join(publicDir, 'data/blog.json'), 'blog');
  blogPosts.forEach((post) => {
    shortenedTexts.items[`blog/${post.id}`] = post;
  });

  // Process teaching content
  const teaching = processJsonContent(path.join(publicDir, 'data/teaching.json'), 'teaching');
  teaching.forEach((item) => {
    shortenedTexts.items[`teaching/${item.id}`] = item;
  });

  // Save the results
  fs.writeFileSync(
    path.join(seoDir, 'shortened-texts.json'),
    JSON.stringify(shortenedTexts, null, 2),
  );

  console.log('SEO text optimization complete!');
  console.log(`Processed ${Object.keys(shortenedTexts.items).length} items`);
}

// Run the optimization
processAllContent().catch(console.error);
