# Easily create and host your academic website on GitHub Pages

I have created this repository to help anyone create and host their website on GitHub Pages. I wanted creating, hosting, and updating the website (e.g., new publications) to be as easy as possible. You dont need to be a web developer to make changes. You just need to make changes to a `json` file to enter your information (e.g., name) and add publication in a `bib` file. YOU DONT NEED TO COMPILE THE CODE. I PROMISE!

See an example of a website created using this repository at [https://s-agarwl.github.io/](https://s-agarwl.github.io/).

## Table of Contents

1. [Creating and Deploying your GitHub repository](#creating-and-deploying-your-github-repository)
2. [Workflow](#workflow)
3. [Customizing Your Website](#customizing-your-website)
4. [Adding New Publications](#adding-new-publications)
5. [Adding Markdown Content to Publications](#adding-markdown-content-to-publications)
6. [Deployment with GitHub Pages](#easy-deployment-with-github-pages)

## Creating and Deploying your GitHub repository

1. Fork the repository at [https://github.com/s-agarwl/easyAcademicPortfolio](https://github.com/s-agarwl/easyAcademicPortfolio)
2. Name your repository "yourGitHubUsername.github.io". Ensure it's public.
3. Navigate to "Actions" on top/left sidebar. Click "I understand my workflows, go ahead and enable them".
4. Go to "Settings". From the left sidebar, navigate to "Pages". Under "Build and deployment", select source as "gh-pages" from the dropdown menu. Click
   "Save".
5. Wait a few minutes. Your website should be visible at yourGitHubUsername.github.io

## Workflow:

I see following three workflows:

1. If you are not a coder, then you can edit and add the files in the `public` folder through the GitHub website, as intructed below.
2. If you know how to work with GitHub repositories but not adept at compiling code using `npm`, then you can clone the respository on your local machine.Just focus on the contents inside `public` and edit the files as instructed below. you would then need to push the changes to your repository and GitHub actions will do the rest.
3. If you are a coder, then you can clone the respository on your local machine, make the changes in the source code, implement your own functionalities, and push the changes to the GitHub repository.

## Customizing Your Website

The `config.json` file is where you personalize your website. Here's a detailed guide:

### Basic Information

- `researcherName`: Your full name (string)
- `institution`: Where you work or study (string)
- `email`: Your contact email (string)
- `theme`: Website color scheme (string: "light" or "dark")
- `bibtexPath`: Path to your BibTeX file (string, e.g., "/pubs.bib")
- `profilePhotoPath`: Path to your profile picture (string, e.g., "/profile-photo.png")

### Social and Professional Links

The `links` object contains various platform links. Each key is a platform name, and the value is the URL or an empty string if not used. Available platforms include:

```
googleScholar, linkedin, github, orcid, researchGate, academiaEdu, webOfScience,
scopus, dblp, universityProfile, twitter, publons, arxiv, semanticScholar,
microsoftAcademic, youTube, slideshare, figshare, mendeley, zotero, impactStory
```

### Website Sections

The `sections` object defines the main content areas of your website:

#### About Section

```json
"about": {
"id": "About",
"headerText": "About Me",
"subHeading": "Your title or role",
"content": "Your bio in HTML format"
}
```

#### Education Section

```json
"education": {
"id": "Education",
"headerText": "Education",
"sectionHeading": "Educational Background",
"content": [
{
"degree": "Degree name",
"honors": "Honors (optional)",
"institution": "Institution name",
"location": "Location",
"period": "Start date – End date"
},
// ... more education entries
]
}
```

#### Work Experience Section

```json
"workExperience": {
"id": "WorkExperience",
"headerText": "Work Experience",
"sectionHeading": "Professional Journey",
"content": [
{
"title": "Job title",
"company": "Company name",
"location": "Location",
"period": "Start date – End date",
"description": "Job description"
},
// ... more work experience entries
]
}
```

#### Awards Section

```json
"awards": {
"id": "Awards",
"headerText": "Awards",
"sectionHeading": "Honors and Achievements",
"content": [
{
"title": "Award name",
"description": "Award description",
"icon": "Icon name (e.g., FaTrophy, FaMedal)",
"details": "Link to more details (optional)"
},
// ... more award entries
]
}
```

#### Featured Publications Section

```json
"featuredPublications": {
"id": "FeaturedPublications",
"headerText": "Featured",
"sectionHeading": "Featured Research",
"content": ["CitationKey1", "CitationKey2", "CitationKey3"]
}
```

#### Contact Section

```json
"contact": {
"id": "Contact",
"headerText": "Contact",
"sectionHeading": "Get in Touch",
"content": {
"intro": "Introduction text",
"linksToDisplay": ["linkedin", "email"],
"outro": "Closing text"
}
}
```

#### Custom Section

You can add custom sections to your landing page using the following structure:

```json
"customSection1": {
"id": "CustomSection1",
"headerText": "Custom Section 1",
"sectionHeading": "My Custom Section 1",
"type": "dynamic",
"content": "<p className='mb-4'>This is a custom section. You can add any HTML content here.</p>"
}
```

Add this to the `sections` object in `config.json` and include the section's `id` in the `orderOfSectionsInHeader` array to display it on your landing page.

### Special Sections

The `specialSections` object defines additional pages:

- `allPublications`: Displays all your publications
- `phdThesis`: Links to your PhD thesis
- `documentation`: This help page

### Section Order

The `orderOfSectionsInHeader` array determines the order of sections in the navigation menu.

## Adding New Publications

1. Open your BibTeX file (specified in `bibtexPath`).
2. Add a new entry using this format:

   ```bibtex
   @article{PublicationId,
   author = {Author, A. and Author, B.},
   title = {Title of the Article},
   journal = {Journal Name},
   year = {2023},
   volume = {1},
   number = {1},
   pages = {1--10},
   doi = {10.1000/xyz123},
   abstract = {Brief summary of the paper.},
   url = {https://doi.org/10.1000/xyz123},
   image = {image.jpg},
   paperurl = {paper.pdf},
   code = {https://github.com/yourusername/project},
   video = {https://youtube.com/watch?v=videoID},
   slides = {slides.pdf},
   github = {https://github.com/yourusername/project},
   demo = {https://demo-url.com},
   awards = {Best Paper Award},
   shorturl = {short-url-for-paper},
   markdown = {markdown-file.md}
   }
   ```

   3. If you want to add **pdf** (`paperurl`), or other artefacts (e.g., `image`, `video`, `slides`, `code`, `demo`, `awards`) about your publication, then first create a folder in `public/publications/PublicationId/`. Then add the files in that folder. The name of the folder should be `PublicationId` and the path to these files in the bibtex file should be relative to this folder.

   Note:

   - All fields after `abstract` are optional. Include them only if relevant to your publication.
   - `image`, `paperurl`, and `slides` paths should mention just the file name in folder of the respective publication `public/publications/PublicationId/`.
   - The `markdown` field, if provided, the content of this Markdown file will be included in the publication details page.

3. Save the BibTeX file.
4. To feature this publication, add its citation key to `featuredPublications` in `config.json`.
5. Place any associated files (PDF, images) in `public/publications/PublicationId/`.
6. Upload all modified files to your web server.

After uploading, refresh your website to see the changes. No rebuild is needed for new publications.

## Adding Markdown Content to Publications

To add detailed Markdown content to a publication:

1. Create a Markdown file for your publication (e.g., `publicationDetails.md`).
2. Place this file in the same directory as other publication files (`public/publications/PublicationId/`).
3. Add a `markdown` field to your BibTeX entry, pointing to this file:
4. The content of this Markdown file will now appear on the publication's detail page.

## 5. Troubleshooting

If changes don't appear:

1. Clear your browser cache and reload.
2. Verify all files are uploaded to the correct locations.
3. Check file paths in BibTeX entries.
4. If you changed React components or source code, rebuild and redeploy the website.

For the richest publication pages, include as much information as possible in your BibTeX entries and utilize the Markdown feature for detailed content.

## Easy Deployment with GitHub Pages

Your website should already be up an drunning on the url yourGitHubUsername.github.io. Whenever you make changes (through either of the three workflows mentioned in point 1 above), you would need to push the changes to the GitHub repository.
The deployment will be handled by GitHub build pipeline and the website will be updated in 1-2 minutes. You may want to refresh or clear your browser cache if the changes are not visible.
(Tip: Opening the website in incognito might be a quick way to see the changes or opening the developer console in browser might help to refresh cache.)

Remember:

1. Make your to make the desired changes in `config.json` or add new publications to your BibTeX file.
2. Commit and push these changes to the `main` branch of your GitHub repository.
3. GitHub Actions will automatically build and deploy your website.
4. Wait a few minutes, then visit your GitHub Pages URL to see the changes live.

This process allows you to update your website directly through GitHub's web interface:

1. Navigate to your `config.json` file in your GitHub repository.
2. Click the edit (pencil) icon.
3. Make your changes.
4. At the bottom of the page, add a commit message describing your changes.
5. Click "Commit changes".

Your website will automatically update with the new changes.

If you encounter any issues or your changes don't appear after a few minutes, check the "Actions" tab in your GitHub repository for any error messages.
