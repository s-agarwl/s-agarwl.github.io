/**
 * Sitemap Generator Script
 *
 * This script generates a sitemap.xml file for the website to improve search engine visibility.
 * It creates a sitemap with:
 * - The homepage
 * - All section pages
 * - Individual content pages
 * - Short URL redirects
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
import { format } from 'date-fns';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get file last modified date
function getFileLastModifiedDate(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return format(stats.mtime, 'yyyy-MM-dd');
  } catch {
    // If file doesn't exist or other error, return today's date as fallback
    return format(new Date(), 'yyyy-MM-dd');
  }
}

// Generate sitemap XML
function generateSitemap() {
  console.log('Generating sitemap.xml...');

  try {
    // Read config file
    const configPath = path.join(__dirname, '../public/config.json');
    const configData = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(configData);
    const baseUrl = config.baseUrl || 'https://example.com';

    // Start sitemap XML
    let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Add homepage
    const indexLastMod = getFileLastModifiedDate(path.join(__dirname, '../dist/index.html'));
    xmlContent += `
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${indexLastMod}</lastmod>
    <priority>1.0</priority>
    <changefreq>weekly</changefreq>
  </url>`;

    // Process each section from config
    config.sections.forEach((section) => {
      if (!section.path || section.path === '/') return;

      // Add section URL
      const sectionPath = path.join(__dirname, `../dist${section.path}/index.html`);
      const sectionLastMod = getFileLastModifiedDate(sectionPath);
      xmlContent += `
  <url>
    <loc>${baseUrl}${section.path}/</loc>
    <lastmod>${sectionLastMod}</lastmod>
    <priority>0.8</priority>
    <changefreq>weekly</changefreq>
  </url>`;

      // If section has a dataSource, process its content
      if (section.dataSource) {
        const sectionDir = path.join(__dirname, `../dist${section.path}`);
        if (fs.existsSync(sectionDir)) {
          const items = fs.readdirSync(sectionDir);
          items.forEach((item) => {
            const itemPath = path.join(sectionDir, item, 'index.html');
            if (fs.existsSync(itemPath)) {
              const lastMod = getFileLastModifiedDate(itemPath);
              xmlContent += `
  <url>
    <loc>${baseUrl}${section.path}/${item}</loc>
    <lastmod>${lastMod}</lastmod>
    <priority>0.7</priority>
    <changefreq>monthly</changefreq>
  </url>`;
            }
          });
        }
      }
    });

    // Add any additional URLs from config
    if (config.additionalUrls) {
      config.additionalUrls.forEach((item) => {
        const pagePath = path.join(__dirname, `../dist${item.url}/index.html`);
        const lastMod = getFileLastModifiedDate(pagePath);
        xmlContent += `
  <url>
    <loc>${baseUrl}${item.url}</loc>
    <lastmod>${lastMod}</lastmod>
    <priority>${item.priority || 0.6}</priority>
    <changefreq>${item.changefreq || 'monthly'}</changefreq>
  </url>`;
      });
    }

    // Close XML
    xmlContent += `
</urlset>`;

    // Write sitemap to dist directory
    const outputPath = path.join(__dirname, '../dist/sitemap.xml');
    fs.writeFileSync(outputPath, xmlContent);
    console.log(`Sitemap generated at: ${outputPath}`);
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
}

// Run the generator
generateSitemap();
