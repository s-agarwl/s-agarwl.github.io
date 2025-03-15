/**
 * Static Pages Generator Script
 *
 * This script generates pre-rendered HTML pages for publications to improve SEO.
 * It creates static HTML files with:
 * - Proper metadata for search engines
 * - Open Graph tags for social media sharing
 * - JSON-LD structured data for rich search results
 * - Pre-rendered content that search engines can index without JavaScript
 *
 * The script also handles:
 * - Creating directory structures for each publication
 * - Setting up redirects for short URLs
 * - Adding Dublin Core and citation metadata for academic search engines
 *
 * This comprehensive approach ensures that publication content is fully
 * discoverable by search engines even without JavaScript execution.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';
import bibtexParse from 'bibtex-parse-js';
import { generateEnhancedBibTexEntry } from '../src/utils/bibTexUtils.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');
const publicDir = path.resolve(__dirname, '../public');
const rootDir = path.resolve(__dirname, '../');

// Function to clean BibTeX entry tags (simplified version of your utils function)
function cleanEntryTags(entryTags, citationKey) {
  const cleanedTags = {};
  for (const [key, value] of Object.entries(entryTags)) {
    // Remove LaTeX-style curly braces
    cleanedTags[key] = value ? value.replace(/\{([^{}]*)\}/g, '$1') : '';
  }

  // Add image and paper paths
  if (cleanedTags.image) {
    cleanedTags.image = `/publications/${citationKey}/${cleanedTags.image}`;
  }
  if (cleanedTags.paperurl) {
    cleanedTags.paperurl = `/publications/${citationKey}/${cleanedTags.paperurl}`;
  }
  if (cleanedTags.blogpost) {
    cleanedTags.blogpost = `/publications/${citationKey}/${cleanedTags.blogpost}`;
  }
  if (cleanedTags.slides) {
    cleanedTags.slides = `/publications/${citationKey}/${cleanedTags.slides}`;
  }
  return cleanedTags;
}

// Function to format author names (simplified version of your utils function)
function formatAuthorNames(entries) {
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

async function generateStaticPages() {
  try {
    // Read the config file
    const configPath = path.join(publicDir, 'config.json');
    const configData = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(configData);

    // Read the BibTeX file
    const bibtexPath = path.join(publicDir, 'pubs.bib');
    const bibtexData = fs.readFileSync(bibtexPath, 'utf8');

    // Parse BibTeX entries
    const parsedEntries = bibtexParse.toJSON(bibtexData);
    const cleanedEntries = parsedEntries.map((entry) => ({
      ...entry,
      entryTags: cleanEntryTags(entry.entryTags, entry.citationKey),
    }));

    const formattedEntries = formatAuthorNames(cleanedEntries);

    // Sort entries by year (newest first)
    const sortedEntries = formattedEntries.sort((a, b) => {
      const yearA = parseInt(a.entryTags.year, 10);
      const yearB = parseInt(b.entryTags.year, 10);
      return yearB - yearA;
    });

    // Create a map of short URLs to citation keys
    const shortUrlMap = {};
    sortedEntries.forEach((entry) => {
      if (entry.entryTags.shorturl) {
        shortUrlMap[entry.entryTags.shorturl] = entry.citationKey;
      }
    });

    // Read the index.html template
    const indexPath = path.join(distDir, 'index.html');
    const indexHtml = fs.readFileSync(indexPath, 'utf8');

    // Create publication directories
    if (!fs.existsSync(path.join(distDir, 'publication'))) {
      fs.mkdirSync(path.join(distDir, 'publication'));
    }

    // Generate static HTML for each publication
    for (const entry of sortedEntries) {
      const citationKey = entry.citationKey;

      // Create directory for the publication
      const pubDir = path.join(distDir, 'publication', citationKey);
      if (!fs.existsSync(pubDir)) {
        fs.mkdirSync(pubDir, { recursive: true });
      }

      // Create index.html for the publication
      const dom = new JSDOM(indexHtml);
      const document = dom.window.document;

      // Set the title
      const titleElement = document.querySelector('title');
      if (titleElement) {
        titleElement.textContent = entry.entryTags.title;
      }

      // Add meta tags for SEO
      const head = document.querySelector('head');

      // Add meta description
      const metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      metaDescription.setAttribute(
        'content',
        entry.entryTags.abstract
          ? entry.entryTags.abstract.substring(0, 160) + '...'
          : entry.entryTags.title,
      );
      head.appendChild(metaDescription);

      // Add meta tags for Google Scholar and other academic search engines
      if (entry.entryTags.title) {
        const metaTitle = document.createElement('meta');
        metaTitle.setAttribute('name', 'citation_title');
        metaTitle.setAttribute('content', entry.entryTags.title);
        head.appendChild(metaTitle);

        // Add Dublin Core metadata
        const dcTitle = document.createElement('meta');
        dcTitle.setAttribute('name', 'DC.title');
        dcTitle.setAttribute('content', entry.entryTags.title);
        head.appendChild(dcTitle);
      }

      if (entry.entryTags.author) {
        const authors = entry.entryTags.author.split(', ');
        authors.forEach((author) => {
          const metaAuthor = document.createElement('meta');
          metaAuthor.setAttribute('name', 'citation_author');
          metaAuthor.setAttribute('content', author.replace(' and ', ''));
          head.appendChild(metaAuthor);

          // Add Dublin Core author
          const dcAuthor = document.createElement('meta');
          dcAuthor.setAttribute('name', 'DC.creator');
          dcAuthor.setAttribute('content', author.replace(' and ', ''));
          head.appendChild(dcAuthor);
        });
      }

      if (entry.entryTags.year) {
        const metaYear = document.createElement('meta');
        metaYear.setAttribute('name', 'citation_publication_date');
        metaYear.setAttribute('content', entry.entryTags.year);
        head.appendChild(metaYear);

        // Add Dublin Core date
        const dcDate = document.createElement('meta');
        dcDate.setAttribute('name', 'DC.date');
        dcDate.setAttribute('content', entry.entryTags.year);
        head.appendChild(dcDate);
      }

      if (entry.entryTags.journal) {
        const metaJournal = document.createElement('meta');
        metaJournal.setAttribute('name', 'citation_journal_title');
        metaJournal.setAttribute('content', entry.entryTags.journal);
        head.appendChild(metaJournal);

        // Add publication venue type
        const metaPublicationType = document.createElement('meta');
        metaPublicationType.setAttribute('name', 'citation_publication_type');
        metaPublicationType.setAttribute('content', 'journal');
        head.appendChild(metaPublicationType);
      } else if (entry.entryTags.booktitle) {
        const metaConference = document.createElement('meta');
        metaConference.setAttribute('name', 'citation_conference_title');
        metaConference.setAttribute('content', entry.entryTags.booktitle);
        head.appendChild(metaConference);

        // Add publication venue type
        const metaPublicationType = document.createElement('meta');
        metaPublicationType.setAttribute('name', 'citation_publication_type');
        metaPublicationType.setAttribute('content', 'conference');
        head.appendChild(metaPublicationType);
      }

      if (entry.entryTags.doi) {
        const metaDoi = document.createElement('meta');
        metaDoi.setAttribute('name', 'citation_doi');
        metaDoi.setAttribute('content', entry.entryTags.doi);
        head.appendChild(metaDoi);

        // Add Dublin Core identifier
        const dcIdentifier = document.createElement('meta');
        dcIdentifier.setAttribute('name', 'DC.identifier');
        dcIdentifier.setAttribute('content', `doi:${entry.entryTags.doi}`);
        head.appendChild(dcIdentifier);
      }

      if (entry.entryTags.abstract) {
        // Add Dublin Core description
        const dcDescription = document.createElement('meta');
        dcDescription.setAttribute('name', 'DC.description');
        dcDescription.setAttribute('content', entry.entryTags.abstract);
        head.appendChild(dcDescription);
      }

      if (entry.entryTags.keywords) {
        // Add keywords meta tag
        const metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        metaKeywords.setAttribute('content', entry.entryTags.keywords);
        head.appendChild(metaKeywords);

        // Add Dublin Core subject
        const dcSubject = document.createElement('meta');
        dcSubject.setAttribute('name', 'DC.subject');
        dcSubject.setAttribute('content', entry.entryTags.keywords);
        head.appendChild(dcSubject);
      }

      if (entry.entryTags.paperurl) {
        const metaPdf = document.createElement('meta');
        metaPdf.setAttribute('name', 'citation_pdf_url');
        // Use absolute URL for PDF
        const pdfUrl = new URL(entry.entryTags.paperurl, config.baseUrl || 'https://example.com')
          .href;
        metaPdf.setAttribute('content', pdfUrl);
        head.appendChild(metaPdf);

        // Add Dublin Core format
        const dcFormat = document.createElement('meta');
        dcFormat.setAttribute('name', 'DC.format');
        dcFormat.setAttribute('content', 'application/pdf');
        head.appendChild(dcFormat);
      }

      // Add language meta tag
      const metaLang = document.createElement('meta');
      metaLang.setAttribute('name', 'DC.language');
      metaLang.setAttribute('content', 'en');
      head.appendChild(metaLang);

      // Add JSON-LD structured data for better SEO
      const scriptLD = document.createElement('script');
      scriptLD.setAttribute('type', 'application/ld+json');

      const jsonLD = {
        '@context': 'https://schema.org',
        '@type': 'ScholarlyArticle',
        headline: entry.entryTags.title,
        author: entry.entryTags.author
          ? entry.entryTags.author.split(', ').map((name) => ({
              '@type': 'Person',
              name: name.replace(' and ', ''),
            }))
          : [],
        datePublished: entry.entryTags.year,
        description: entry.entryTags.abstract,
        publisher: entry.entryTags.journal || entry.entryTags.booktitle,
      };

      if (entry.entryTags.doi) {
        jsonLD.identifier = {
          '@type': 'PropertyValue',
          propertyID: 'DOI',
          value: entry.entryTags.doi,
        };
      }

      // Add additional resources as schema.org properties
      const resources = [];

      if (entry.entryTags.paperurl) {
        resources.push({
          '@type': 'CreativeWork',
          name: 'Full Paper',
          url: new URL(entry.entryTags.paperurl, config.baseUrl || 'https://example.com').href,
          encodingFormat: 'application/pdf',
        });
      }

      if (entry.entryTags.github) {
        resources.push({
          '@type': 'SoftwareSourceCode',
          name: 'Source Code',
          codeRepository: entry.entryTags.github,
        });
      }

      if (entry.entryTags.demo) {
        resources.push({
          '@type': 'WebApplication',
          name: 'Demo',
          url: entry.entryTags.demo,
        });
      }

      if (entry.entryTags.poster) {
        resources.push({
          '@type': 'CreativeWork',
          name: 'Research Poster',
          url: new URL(entry.entryTags.poster, config.baseUrl || 'https://example.com').href,
        });
      }

      if (entry.entryTags.slides) {
        resources.push({
          '@type': 'PresentationDigitalDocument',
          name: 'Presentation Slides',
          url: new URL(entry.entryTags.slides, config.baseUrl || 'https://example.com').href,
        });
      }

      if (resources.length > 0) {
        jsonLD.associatedMedia = resources;
      }

      scriptLD.textContent = JSON.stringify(jsonLD);
      head.appendChild(scriptLD);

      // Add a div with the publication data for the client-side app to use
      const dataScript = document.createElement('script');
      dataScript.setAttribute('id', 'publication-data');
      dataScript.setAttribute('type', 'application/json');
      dataScript.textContent = JSON.stringify({
        entry,
        config,
      });
      head.appendChild(dataScript);

      // Add a prerendered version of the publication content for SEO
      const contentDiv = document.createElement('div');
      contentDiv.setAttribute('id', 'prerendered-content');

      // Generate resource links HTML
      let resourceLinksHtml = '';
      if (
        entry.entryTags.paperurl ||
        entry.entryTags.github ||
        entry.entryTags.demo ||
        entry.entryTags.poster ||
        entry.entryTags.slides
      ) {
        resourceLinksHtml = '<h2>Resources</h2><ul>';

        if (entry.entryTags.paperurl) {
          resourceLinksHtml += `<li><a href="${entry.entryTags.paperurl}">Paper PDF</a></li>`;
        }

        if (entry.entryTags.github) {
          resourceLinksHtml += `<li><a href="${entry.entryTags.github}">Source Code</a></li>`;
        }

        if (entry.entryTags.demo) {
          resourceLinksHtml += `<li><a href="${entry.entryTags.demo}">Demo</a></li>`;
        }

        if (entry.entryTags.poster) {
          resourceLinksHtml += `<li><a href="${entry.entryTags.poster}">Poster</a></li>`;
        }

        if (entry.entryTags.slides) {
          resourceLinksHtml += `<li><a href="${entry.entryTags.slides}">Slides</a></li>`;
        }

        resourceLinksHtml += '</ul>';
      }

      contentDiv.innerHTML = `
        <h1>${entry.entryTags.title}</h1>
        <p><strong>Authors:</strong> ${entry.entryTags.author}</p>
        <p><strong>Year:</strong> ${entry.entryTags.year}</p>
        ${entry.entryTags.abstract ? `<h2>Abstract</h2><p>${entry.entryTags.abstract}</p>` : ''}
        ${resourceLinksHtml}
        <h2>Citation</h2>
        <pre><code class="language-bibtex">${generateEnhancedBibTexEntry(entry)}</code></pre>
      `;

      // Add the content div to the body before the root div
      const rootDiv = document.getElementById('root');
      document.body.insertBefore(contentDiv, rootDiv);

      // Write the modified HTML to the publication directory
      fs.writeFileSync(path.join(pubDir, 'index.html'), dom.serialize());

      console.log(`Generated static page for ${citationKey}`);
    }

    // Generate static HTML for short URLs
    for (const [shortUrl, citationKey] of Object.entries(shortUrlMap)) {
      const shortUrlDir = path.join(distDir, shortUrl);
      if (!fs.existsSync(shortUrlDir)) {
        fs.mkdirSync(shortUrlDir, { recursive: true });
      }

      // Create a redirect HTML file
      const redirectHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta http-equiv="refresh" content="0;url=/publication/${citationKey}/">
            <title>Redirecting...</title>
          </head>
          <body>
            <p>Redirecting to <a href="/publication/${citationKey}/">/publication/${citationKey}/</a></p>
          </body>
        </html>
      `;

      fs.writeFileSync(path.join(shortUrlDir, 'index.html'), redirectHtml);
      console.log(`Generated redirect for short URL ${shortUrl} -> ${citationKey}`);
    }

    // Update sitemap.xml with publication URLs
    const sitemapPath = path.join(rootDir, 'sitemap.xml');
    let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${config.baseUrl || 'https://example.com'}/</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${config.baseUrl || 'https://example.com'}/publications</loc>
    <priority>0.8</priority>
  </url>`;

    // Add publication URLs to sitemap
    for (const entry of sortedEntries) {
      sitemapContent += `
  <url>
    <loc>${config.baseUrl || 'https://example.com'}/publication/${entry.citationKey}/</loc>
    <priority>0.7</priority>
  </url>`;
    }

    // Add short URL redirects to sitemap
    for (const [shortUrl] of Object.entries(shortUrlMap)) {
      sitemapContent += `
  <url>
    <loc>${config.baseUrl || 'https://example.com'}/${shortUrl}/</loc>
    <priority>0.6</priority>
  </url>`;
    }

    sitemapContent += `
</urlset>`;

    fs.writeFileSync(sitemapPath, sitemapContent);
    // Write sitemap to dist directory as well
    const sitemapPathDist = path.join(distDir, 'sitemap.xml');
    fs.writeFileSync(sitemapPathDist, sitemapContent);
    console.log('Updated sitemap.xml');

    console.log('Static page generation completed successfully!');
  } catch (error) {
    console.error('Error generating static pages:', error);
  }
}

generateStaticPages();
