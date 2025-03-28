import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import convertBibtexToJson from '../src/utils/bibtexToJson.js';
import { processContentItem } from '../src/utils/textOptimization.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '../public');
const seoDir = path.resolve(publicDir, 'seo');

// Helper function to safely read JSON file
function readJsonFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`Required file not found: ${filePath}`);
    }
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON in file: ${filePath}`);
    }
    throw new Error(`Error reading file ${filePath}: ${error.message}`);
  }
}

// Helper function to safely write JSON file
function writeJsonFile(filePath, data) {
  try {
    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write file with pretty formatting
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    throw new Error(`Error writing file ${filePath}: ${error.message}`);
  }
}

// Load configurations
const config = JSON.parse(fs.readFileSync(path.join(seoDir, 'config.json'), 'utf8'));

// Process BibTeX entries with error handling
function processBibtexEntries(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`BibTeX file not found: ${filePath}`);
      return [];
    }

    const bibtexData = fs.readFileSync(filePath, 'utf8');
    const entries = convertBibtexToJson(bibtexData);

    if (!Array.isArray(entries)) {
      throw new Error('Invalid BibTeX data format');
    }

    return entries.map((entry) => processContentItem(entry, 'publication', config));
  } catch (error) {
    console.error(`Error processing BibTeX file ${filePath}:`, error.message);
    return [];
  }
}

// Process JSON content with error handling
function processJsonContent(filePath, type) {
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`JSON file not found: ${filePath}`);
      return [];
    }

    const data = readJsonFile(filePath);
    if (!Array.isArray(data)) {
      throw new Error(`Invalid JSON data format in ${filePath}`);
    }

    return data.map((item) => processContentItem(item, type, config));
  } catch (error) {
    console.error(`Error processing JSON file ${filePath}:`, error.message);
    return [];
  }
}

// Main function to process all content
export async function generateSeoTexts() {
  try {
    console.log('Starting SEO text generation...');

    // Load configurations with error handling
    const configPath = path.join(seoDir, 'config.json');
    const config = readJsonFile(configPath);

    if (!config || !config.fallback) {
      throw new Error('Invalid config.json: missing required fields');
    }

    const shortenedTexts = {
      items: {},
      metadata: {
        generatedAt: new Date().toISOString(),
        version: '1.0',
      },
    };

    // Process publications
    console.log('Processing publications...');
    const publications = processBibtexEntries(path.join(publicDir, 'data/pubs.bib'));
    publications.forEach((pub) => {
      if (pub && pub.id) {
        shortenedTexts.items[`publications/${pub.id}`] = pub;
      }
    });
    console.log(`Processed ${publications.length} publications`);

    // Process projects
    console.log('Processing projects...');
    const projects = processJsonContent(path.join(publicDir, 'data/projects.json'), 'project');
    projects.forEach((proj) => {
      if (proj && proj.id) {
        shortenedTexts.items[`projects/${proj.id}`] = proj;
      }
    });
    console.log(`Processed ${projects.length} projects`);

    // Process talks
    console.log('Processing talks...');
    const talks = processJsonContent(path.join(publicDir, 'data/talks.json'), 'talk');
    talks.forEach((talk) => {
      if (talk && talk.id) {
        shortenedTexts.items[`talks/${talk.id}`] = talk;
      }
    });
    console.log(`Processed ${talks.length} talks`);

    // Process blog posts
    console.log('Processing blog posts...');
    const blogPosts = processJsonContent(path.join(publicDir, 'data/blog.json'), 'blog');
    blogPosts.forEach((post) => {
      if (post && post.id) {
        shortenedTexts.items[`blog/${post.id}`] = post;
      }
    });
    console.log(`Processed ${blogPosts.length} blog posts`);

    // Process teaching content
    console.log('Processing teaching content...');
    const teaching = processJsonContent(path.join(publicDir, 'data/teaching.json'), 'teaching');
    teaching.forEach((item) => {
      if (item && item.id) {
        shortenedTexts.items[`teaching/${item.id}`] = item;
      }
    });
    console.log(`Processed ${teaching.length} teaching items`);

    // Save the results
    const outputPath = path.join(seoDir, 'shortened-texts.json');
    writeJsonFile(outputPath, shortenedTexts);

    console.log('SEO text generation complete!');
    console.log(`Total items processed: ${Object.keys(shortenedTexts.items).length}`);
    console.log(`Output saved to: ${outputPath}`);

    return shortenedTexts;
  } catch (error) {
    console.error('Fatal error in SEO text generation:', error.message);
    if (typeof process !== 'undefined') {
      process.exit(1);
    }
    throw error;
  }
}

// Run the generation if this file is run directly
if (process.argv[1] && process.argv[1].endsWith('generate-seo-texts.js')) {
  generateSeoTexts().catch((error) => {
    console.error('Unhandled error:', error);
    if (typeof process !== 'undefined') {
      process.exit(1);
    }
  });
}
