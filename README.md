# Academic Portfolio Website

A customizable academic portfolio website that generates static HTML pages for publications to ensure they are discoverable by Google Scholar.

## Features

- Responsive design with customizable themes
- Publication management using BibTeX
- Static HTML generation for Google Scholar indexing
- SEO-friendly with proper meta tags
- Support for short URLs for publications

## How It Works

This website uses a hybrid approach:

1. React for the interactive user interface
2. Static HTML generation for search engine discoverability

When you build the site, it:

1. Builds the React application
2. Generates static HTML pages for each publication with proper meta tags for Google Scholar
3. Creates a sitemap.xml file for better indexing
4. Sets up redirects for short URLs

## Getting Started

1. Fork this repository
2. Update your data in the `public` folder:
   - Edit `config.json` with your information
   - Replace `pubs.bib` with your publications
   - Add your publication PDFs and images to `public/publications/[citationKey]/`
3. Install dependencies:
   ```
   npm install
   ```
4. Run the development server:
   ```
   npm run dev
   ```
5. Build for production:
   ```
   npm run build
   ```
6. Deploy to GitHub Pages:
   ```
   npm run deploy
   ```

## Google Scholar Indexing

The static HTML generation process adds the following meta tags to each publication page:

```html
<meta name="citation_title" content="Your Paper Title" />
<meta name="citation_author" content="Author Name" />
<meta name="citation_publication_date" content="2023" />
<meta name="citation_journal_title" content="Journal Name" />
<meta name="citation_doi" content="10.1234/5678" />
<meta name="citation_pdf_url" content="https://yourdomain.com/publications/paperID/paper.pdf" />
```

These tags help Google Scholar properly index your publications.

## Customization

- Edit `public/config.json` to customize your profile information
- Update `public/pubs.bib` to manage your publications
- Add your publication PDFs and images to `public/publications/[citationKey]/`

## License

MIT
