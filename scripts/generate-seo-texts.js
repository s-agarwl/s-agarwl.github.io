import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import process from 'process';
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

// Main function to process all content
export async function generateSeoTexts() {
  try {
    console.log('Starting SEO text generation...');

    // Load configurations with error handling
    const configPath = path.join(seoDir, 'config.json');
    const seoConfig = readJsonFile(configPath);

    if (!seoConfig || !seoConfig.fallback) {
      throw new Error('Invalid config.json: missing required fields');
    }

    // Load main website config to get sections
    const websiteConfig = readJsonFile(path.join(publicDir, 'config.json'));

    const shortenedTexts = {
      items: {},
      metadata: {
        generatedAt: new Date().toISOString(),
        version: '1.0',
      },
    };

    // Process BibTeX entries with error handling
    function processBibtexEntries(filePath) {
      try {
        if (!fs.existsSync(filePath)) {
          console.warn(`BibTeX file not found: ${filePath}`);
          return [];
        }

        const bibtexData = fs.readFileSync(filePath, 'utf8');
        const entries = convertBibtexToJson(
          bibtexData,
          websiteConfig.sections.find((s) => s.dataType === 'bibtex')?.bibtexFieldConfig,
        );

        if (!Array.isArray(entries)) {
          throw new Error('Invalid BibTeX data format');
        }

        return entries.map((entry) => processContentItem(entry, 'publication', seoConfig));
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

        return data.map((item) => processContentItem(item, type, seoConfig));
      } catch (error) {
        console.error(`Error processing JSON file ${filePath}:`, error.message);
        return [];
      }
    }

    // Dynamically process all sections that have dataSource defined
    const contentSections = websiteConfig.sections.filter(
      (section) => section.dataSource && !section.hideSection,
    );

    for (const section of contentSections) {
      const pathKey = section.path.replace(/^\//, ''); // Remove leading slash
      const contentType = pathKey.toLowerCase(); // Match existing type naming
      const dataPath = path.join(publicDir, section.dataSource.replace(/^\//, ''));

      console.log(`Processing ${section.title || section.id}...`);

      // Process based on dataType
      let items = [];
      if (section.dataType === 'bibtex') {
        items = processBibtexEntries(dataPath);
      } else {
        // Default to JSON processing
        items = processJsonContent(dataPath, contentType);
      }

      // Store the processed items
      items.forEach((item) => {
        if (item && item.id) {
          shortenedTexts.items[`${pathKey}/${item.id}`] = item;
        }
      });

      console.log(`Processed ${items.length} ${section.title || section.id} items`);
    }

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
