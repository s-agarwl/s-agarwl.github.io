# Website Configuration Guide

This document provides a comprehensive guide to configuring your academic portfolio website using the `config.json` file. The configuration file controls all aspects of your website, from basic information to the structure and content of each section.

## Table of Contents

1. [Basic Configuration](#basic-configuration)
2. [Navigation](#navigation)
3. [Social Links](#social-links)
4. [Tag Sets](#tag-sets)
5. [Section Types](#section-types)
   - [Profile Section](#profile-section)
   - [Publications Section](#publications-section)
   - [Projects Section](#projects-section)
   - [Other Sections](#other-sections)
6. [Templates](#templates)
   - [listOfItems](#listofitems)
   - [article](#article)
   - [text-with-image](#text-with-image)
   - [timeline](#timeline)
   - [grid](#grid)
   - [carousel](#carousel)
   - [contact](#contact)
7. [Display Configuration](#display-configuration)
8. [SEO and Analytics](#seo-and-analytics)
9. [Common Configuration Tasks](#common-configuration-tasks)

## Basic Configuration

The top-level properties in the configuration file control basic information about the website:

```json
{
  "researcherName": "Your Name",
  "email": "your.email@example.com",
  "theme": "light",
  "baseUrl": "https://your-website.com",
  "profilePhotoPath": "/profile-photo.png",
  "abstractPreviewLength": 10,
  "descriptionPreviewLength": 10
}
```

| Property                   | Type   | Description                            | Effect                                     |
| -------------------------- | ------ | -------------------------------------- | ------------------------------------------ |
| `researcherName`           | String | Your full name                         | Displayed in various places on the website |
| `email`                    | String | Your contact email                     | Used for contact information               |
| `theme`                    | String | Color theme (`light` or `dark`)        | Controls the default color scheme          |
| `baseUrl`                  | String | Website URL                            | Used for generating links and SEO          |
| `profilePhotoPath`         | String | Path to profile photo                  | Used in profile and header                 |
| `abstractPreviewLength`    | Number | Lines to show in publication abstracts | Controls truncation in previews            |
| `descriptionPreviewLength` | Number | Lines to show in project descriptions  | Controls truncation in previews            |

## Navigation

The navigation section configures the main menu of your website:

```json
"navigation": {
  "mainItems": [
    {
      "id": "Profile",
      "dropdown": true,
      "items": ["About", "Education", "WorkExperience", "Awards", "FeaturedWorks", "Contact"]
    },
    "Publications",
    "Projects",
    "Talks",
    "Teaching",
    "Blog"
  ]
}
```

Each item in `mainItems` can be either:

- A string, which references a section ID (like "Publications")
- An object with `id`, `dropdown`, and `items` properties for dropdown menus

**Effect:** The navigation items appear in the website header, with dropdowns expanding on hover/click.

### Hiding Sections

To have a section accessible via URL but not shown in the navigation, add `"hideSection": true` to the section configuration:

```json
{
  "id": "Blog",
  "hideSection": true,
  "path": "/blog"
  // ... other properties
}
```

## Social Links

Configure your professional and social media links:

```json
"links": {
  "googleScholar": "https://scholar.google.com/citations?user=YOUR_ID",
  "linkedin": "https://www.linkedin.com/in/your-profile/",
  "github": "https://github.com/your-username",
  // ... other links
}
```

**Available platforms:** googleScholar, linkedin, github, orcid, researchGate, academiaEdu, webOfScience, scopus, dblp, universityProfile, twitter, publons, arxiv, semanticScholar, microsoftAcademic, youTube, slideshare, figshare, mendeley, zotero, impactStory

**Effect:** Links appear in the contact section and footer. Empty strings are ignored.

## Tag Sets

Tag sets provide a way to define consistent styling for categorical data fields like project status, degree types, or any other tag-based metadata. Each tag set defines the visual appearance of specific tag values:

```json
"tagSets": {
  "status": {
    "Completed": { "label": "Completed", "color": "green" },
    "Ongoing": { "label": "Ongoing", "color": "blue" },
    "Planned": { "label": "Planned", "color": "amber" }
  },
  "degreeLevel": {
    "bachelor": { "label": "Bachelor", "color": "purple" },
    "master": { "label": "Master", "color": "indigo" },
    "phd": { "label": "PhD", "color": "red" }
  }
}
```

Each tag set is a collection of key-value pairs where:

- The key is the data value (e.g., "Completed", "Ongoing")
- The value object contains display properties:
  - `label`: The display text for the tag (can differ from the data value)
  - `color`: Color name or hex code for the tag background
  - `textColor`: (Optional) Text color, defaults to white or black based on background brightness
  - `icon`: (Optional) Icon name to display with the tag

To use a tag set, reference it in a field configuration:

```json
{
  "field": "status",
  "typeOfField": "Tags",
  "tagSet": "status"
}
```

This tells the website to look up the visual styling for the "status" field values from the "status" tag set.

### Available Colors

You can use any of these color names, or specify a custom hex code:

- `gray`, `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose`

## Section Types

Sections define the main content areas of your website. Each section is defined by an object in the `sections` array:

```json
"sections": [
  {
    "id": "SectionId",
    "path": "/section-url-path",
    "title": "Section Title",
    "sectionHeading": "Section Heading",
    "template": "templateName",
    "description": "Section description",
    // ... template-specific properties
  }
]
```

### Profile Section

The Profile section typically uses subsections for organizing personal information:

```json
{
  "id": "Profile",
  "path": "/",
  "title": "Profile",
  "sectionHeading": "Profile",
  "subsections": [
    {
      "id": "About",
      "template": "text-with-image",
      "order": 1,
      "title": "About Me",
      "content": {
        "title": "Your Name",
        "subtitle": "Your Title",
        "text": "<p>Your bio...</p>",
        "image": "/profile-photo.png",
        "imageShape": "circle"
      }
    }
    // ... other subsections
  ]
}
```

**Effect:** The Profile section displays as a page with vertically arranged subsections in the specified order.

### Publications Section

The Publications section displays academic publications loaded from a BibTeX file:

```json
{
  "id": "Publications",
  "path": "/publications",
  "title": "Publications",
  "sectionHeading": "Publications",
  "template": "listOfItems",
  "description": "Publications description",
  "dataSource": "/data/pubs.bib",
  "dataType": "bibtex",
  "display": {
    // ... display configuration
  }
}
```

**Required properties:**

- `dataSource`: Path to the BibTeX file
- `dataType`: Set to "bibtex"
- `display`: Configuration for list, card, and detail views

**Effect:** Publications are displayed as a searchable list with cards and detailed views.

### Projects Section

The Projects section displays projects loaded from a JSON file:

```json
{
  "id": "Projects",
  "path": "/projects",
  "title": "Projects",
  "sectionHeading": "Projects",
  "template": "listOfItems",
  "description": "Projects description",
  "dataSource": "/data/projects.json",
  "display": {
    // ... display configuration
  }
}
```

**Required properties:**

- `dataSource`: Path to the projects JSON file
- `display`: Configuration for list, card, and detail views

**Effect:** Projects are displayed as a searchable list with cards and detailed views.

### Other Sections

Other common sections include Talks, Teaching, and Blog, all configured similarly with appropriate data sources.

## Templates

Templates define how content is displayed within sections or subsections.

### listOfItems

Used for displaying collections of items (publications, projects, etc.):

```json
"template": "listOfItems",
"dataSource": "/path/to/data.json",
"display": {
  "list": { /* ... */ },
  "card": { /* ... */ },
  "detail": { /* ... */ }
}
```

**Effect:** Creates a searchable, filterable list with card previews and detailed views.

### article

Used for long-form content like blog posts or stories:

```json
"template": "article",
"content": {
  "title": "Article Title",
  "resourceDir": "/path/to/resources/",
  "markdownFile": "content.md",
  "banner": {
    "image": "banner.png",
    "title": "Banner Title",
    "subtitle": "Banner Subtitle",
    "showTitle": true
  },
  "animation": {
    "enabled": true,
    "prefix": "I am ",
    "phrases": ["phrase 1", "phrase 2", "phrase 3"]
  }
}
```

**Effect:** Displays a beautifully formatted article with optional banner and text animation.

### text-with-image

Used for simple text content with an accompanying image:

```json
"template": "text-with-image",
"content": {
  "title": "Section Title",
  "subtitle": "Section Subtitle",
  "text": "<p>HTML content...</p>",
  "image": "/path/to/image.png",
  "imageShape": "circle" // or "square", "rounded"
}
```

**Effect:** Displays text content alongside an image, useful for bio sections.

### timeline

Used for chronological information like education or work experience:

```json
"template": "timeline",
"content": {
  "title": "Timeline Title",
  "iconType": "education", // or "work", "project", "award"
  "items": [
    {
      "title": "Item Title",
      "subtitle": "Item Subtitle",
      "location": "Location",
      "period": "Time Period",
      "description": "Description",
      "details": ["Detail 1", "Detail 2"]
    },
    // ... more items
  ]
}
```

**Effect:** Displays a vertical timeline with icons and formatted entries.

### grid

Used for displaying items in a grid layout:

```json
"template": "grid",
"content": {
  "title": "Grid Title",
  "columns": 3,
  "items": [
    {
      "title": "Item Title",
      "description": "Item description",
      "icon": "trophy", // or any other icon name
      "link": "/link/to/more",
      "linkText": "Link Text"
    },
    // ... more items
  ]
}
```

**Effect:** Displays items in a responsive grid with consistent spacing.

### carousel

Used for featuring selected items from other sections:

```json
"template": "carousel",
"content": {
  "title": "Featured",
  "ids": [
    { "type": "Publications", "id": "publication1" },
    { "type": "Projects", "id": "project1" }
  ]
}
```

**Effect:** Displays a slideshow of selected items from across the website.

### contact

Used for contact information and social links:

```json
"template": "contact",
"content": {
  "title": "Get in Touch",
  "text": "Contact text...",
  "links": ["linkedin", "email"],
  "outro": "Outro text...",
  "useIcons": true,
  "useLabels": true,
  "layout": "horizontal" // or "vertical"
}
```

**Effect:** Displays contact information with optional icons and formatted links.

## Display Configuration

The `display` configuration controls how items are shown in list, card, and detail views. All three view types use a consistent structure with a `fields` array:

```json
"display": {
  "list": {
    "fields": [
      {
        "field": "title",
        "typeOfField": "Heading"
      },
      {
        "field": "authors",
        "typeOfField": "AuthorList",
        "label": "Authors"
      }
      // ... more fields
    ],
    "showImage": true
  },
  "card": {
    "fields": [
      {
        "field": "title",
        "typeOfField": "Heading",
        "options": { "level": 3 }
      },
      {
        "field": "year",
        "typeOfField": "Text",
        "label": "Year"
      },
      {
        "field": "status",
        "typeOfField": "Tags",
        "tagSet": "status"
      },
      {
        "field": "description",
        "typeOfField": "ExpandableMarkdown",
        "options": { "limit": "descriptionPreviewLength" }
      },
      {
        "field": "technologies",
        "typeOfField": "Tags"
      }
    ],
    "showImage": true
  },
  "detail": {
    "fields": [
      // ... field configurations similar to list and card
    ],
    "actions": [
      { "type": "BibTeX", "condition": "entryType" },
      { "type": "Video", "condition": "links.video" }
    ]
  }
}
```

### Field Configuration

Each field in the `fields` array is configured with these properties:

| Property      | Description                                         | Example Value                   |
| ------------- | --------------------------------------------------- | ------------------------------- |
| `field`       | The data field name to display                      | `"title"`, `"description"`      |
| `typeOfField` | The component type to use for rendering             | `"Heading"`, `"Text"`, `"Tags"` |
| `label`       | Optional label to display with the field            | `"Authors"`, `"Year"`           |
| `tagSet`      | For Tags: reference to tag set configuration        | `"status"`, `"keywords"`        |
| `options`     | Component-specific configuration options            | `{ "level": 3, "limit": 30 }`   |
| `condition`   | When to display this field (based on data presence) | `"abstract"`, `"links.video"`   |
| `heading`     | Optional heading text to display above the field    | `"Abstract"`, `"Technologies"`  |

### Field Types

Different field types (`typeOfField`) can be used to display data:

| Field Type           | Description                | Common Options                         |
| -------------------- | -------------------------- | -------------------------------------- |
| `Heading`            | Section or item title      | `level`: heading level (1-6)           |
| `Text`               | Plain text                 | `format`: formatting template          |
| `AuthorList`         | List of authors            |                                        |
| `Tags`               | Tags or keywords           | `tagSet`: name of tag set for styling  |
| `Award`              | Award badges               |                                        |
| `Image`              | Images                     |                                        |
| `ExpandableMarkdown` | Expandable text            | `limit`: reference to truncate setting |
| `Section`            | Named section              |                                        |
| `LinkButtons`        | Action buttons             |                                        |
| `PublicationLinks`   | Publication-specific links | `showText`: display link text          |
| `Markdown`           | Markdown content           |                                        |

### Conditional Display

The `condition` property determines when a field should be displayed:

```json
{
  "field": "abstract",
  "typeOfField": "ExpandableMarkdown",
  "heading": "Abstract",
  "condition": "abstract"
}
```

This field will only show if the `abstract` property exists in the data item.

**Types of conditions:**

1. **Simple field check**: `"condition": "fieldName"` - Shows if the field exists
2. **Nested property check**: `"condition": "links.video"` - Shows if item.links.video exists
3. **OR condition**: `"condition": "journal|booktitle"` - Shows if either field exists

## SEO and Analytics

Configure SEO and analytics settings in the `site` object:

```json
"site": {
  "title": "Site Title - SEO Optimized",
  "description": "Site description for search engines",
  "baseUrl": "https://your-website.com",
  "googleAnalyticsId": "G-XXXXXXXXXX",
  "keywords": "keyword1, keyword2, keyword3",
  "author": "Your Name",
  "googleSiteVerification": "verification-code"
}
```

**Effect:** These settings populate meta tags for SEO and configure Google Analytics.

## Common Configuration Tasks

### Adding a New Section

1. Add the section ID to the `navigation.mainItems` array
2. Create a new section object in the `sections` array with the same ID
3. Configure the section template and content

### Creating a Custom Page

1. Add a new section with the `article` template
2. Create a markdown file with your content
3. Configure the `content` object to point to your markdown file

### Featuring Items on Homepage

1. Add a `carousel` template subsection to your Profile section
2. List the IDs of items you want to feature in the `ids` array

### Hiding a Section from Navigation

Add `"hideSection": true` to the section configuration.

### Changing the Order of Subsections

Adjust the `order` property in each subsection to control display order.

## Full Example

See `config.json` for a complete example configuration.

## Additional Resources

- [JSON Schema documentation](public/config-schema.json) - Formal schema definition
- [Template documentation](#templates) - Detailed guidance on each template
