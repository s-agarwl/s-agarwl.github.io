/**
 * Sitemap Generator Script
 *
 * This script generates a sitemap.xml file for the website to improve search engine visibility.
 * It creates a sitemap with:
 * - The homepage
 * - The publications page
 * - Individual publication pages (from BibTeX data)
 * - Additional project pages
 *
 * Each URL includes priority and change frequency information to help search engines
 * understand the importance and update frequency of different pages.
 *
 * This script is separate from generate-static-pages.js to allow for independent
 * sitemap updates without regenerating all static pages.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bibtexParse from 'bibtex-parse-js';
import { format } from 'date-fns';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const config = {
  baseUrl: 'https://s-agarwl.github.io',
  bibtexPath: path.join(__dirname, '../public/publications.bib'),
  outputPath: path.join(__dirname, '../sitemap.xml'),
  priorities: {
    home: 1.0,
    publications: 0.8,
    publication: 0.7,
    project: 0.6,
  },
  changeFrequencies: {
    home: 'weekly',
    publications: 'weekly',
    publication: 'monthly',
    project: 'monthly',
  },
  additionalUrls: [
    { url: '/sets_interactions', priority: 0.6, changefreq: 'monthly' },
    { url: '/dissertation', priority: 0.6, changefreq: 'monthly' },
    { url: '/fv', priority: 0.6, changefreq: 'monthly' },
    { url: '/citevis', priority: 0.6, changefreq: 'monthly' },
    { url: '/evolvingai', priority: 0.6, changefreq: 'monthly' },
    { url: '/bombalytics', priority: 0.6, changefreq: 'monthly' },
    { url: '/setstreams', priority: 0.6, changefreq: 'monthly' },
    { url: '/mrsessions', priority: 0.6, changefreq: 'monthly' },
    { url: '/dynamicsets', priority: 0.6, changefreq: 'monthly' },
  ],
};

// Add this helper function before generateSitemap()
function getFileLastModifiedDate(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return format(stats.mtime, 'yyyy-MM-dd');
  } catch (error) {
    // If file doesn't exist or other error, return today's date as fallback
    return format(new Date(), 'yyyy-MM-dd');
  }
}

// Generate sitemap XML
function generateSitemap() {
  console.log('Generating sitemap.xml...');

  // Get last modified dates for main pages
  const indexLastMod = getFileLastModifiedDate(path.join(__dirname, '../dist/index.html'));
  const publicationsLastMod = getFileLastModifiedDate(
    path.join(__dirname, '../dist/publications/index.html'),
  );

  let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${config.baseUrl}/</loc>
    <lastmod>${indexLastMod}</lastmod>
    <priority>${config.priorities.home}</priority>
    <changefreq>${config.changeFrequencies.home}</changefreq>
  </url>
  <url>
    <loc>${config.baseUrl}/publications</loc>
    <lastmod>${publicationsLastMod}</lastmod>
    <priority>${config.priorities.publications}</priority>
    <changefreq>${config.changeFrequencies.publications}</changefreq>
  </url>`;

  try {
    // Read the publication directory
    const publicationsDir = path.join(__dirname, '../dist/publication');
    const publications = fs.readdirSync(publicationsDir);

    // Add each publication found in the dist directory
    publications.forEach((pubDir) => {
      const indexPath = path.join(publicationsDir, pubDir, 'index.html');
      console.log(indexPath);
      if (fs.existsSync(indexPath)) {
        const lastMod = getFileLastModifiedDate(indexPath);
        xmlContent += `
  <url>
    <loc>${config.baseUrl}/publication/${pubDir}</loc>
    <lastmod>${lastMod}</lastmod>
    <priority>${config.priorities.publication}</priority>
    <changefreq>${config.changeFrequencies.publication}</changefreq>
  </url>`;
      }
    });

    // Add additional URLs with their file-specific last modified dates
    config.additionalUrls.forEach((item) => {
      const pagePath = path.join(__dirname, `../dist${item.url}/index.html`);
      const lastMod = getFileLastModifiedDate(pagePath);
      xmlContent += `
  <url>
    <loc>${config.baseUrl}${item.url}</loc>
    <lastmod>${lastMod}</lastmod>
    <priority>${item.priority}</priority>
    <changefreq>${item.changefreq}</changefreq>
  </url>`;
    });

    // Close XML
    xmlContent += `
</urlset>`;

    // Write to file
    fs.writeFileSync(config.outputPath, xmlContent);
    console.log(`Sitemap generated at: ${config.outputPath}`);
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
}

// Run the generator
generateSitemap();
