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
   - [Field Configuration](#field-configuration)
   - [Field Types](#field-types)
   - [Conditional Display](#conditional-display)
   - [Detail View Actions](#detail-view-actions)
8. [SEO and Analytics](#seo-and-analytics)
9. [Common Configuration Tasks](#common-configuration-tasks)

## Basic Configuration

The top-level properties in the configuration file control basic information about the website:

```json
{
  "researcherName": "Shivam Agarwal",
  "email": "shivamworking@gmail.com",
  "theme": "light",
  "baseUrl": "https://s-agarwl.github.io",
  "profilePhotoPath": "/profile-photo.png"
  // Optional:
  // "abstractPreviewLength": 10,
  // "descriptionPreviewLength": 10
}
```

| Property                   | Type   | Description                                                    | Effect                                                         |
| -------------------------- | ------ | -------------------------------------------------------------- | -------------------------------------------------------------- |
| `researcherName`           | String | Your full name                                                 | Displayed in various places on the website                     |
| `email`                    | String | Your contact email                                             | Used for contact information                                   |
| `theme`                    | String | Color theme (`light` or `dark`)                                | Controls the default color scheme                              |
| `baseUrl`                  | String | Website URL                                                    | Used for generating links and SEO                              |
| `profilePhotoPath`         | String | Path to profile photo                                          | Used in profile and header                                     |
| `abstractPreviewLength`    | Number | (Optional) Lines to show in publication abstracts (Default 10) | Controls truncation in previews, can be used in display config |
| `descriptionPreviewLength` | Number | (Optional) Lines to show in project descriptions (Default 10)  | Controls truncation in previews, can be used in display config |

## Navigation

The navigation section configures the main menu of your website:

```json
"navigation": {
  "mainItems": ["profile", "publications", "projects", "mentorships", "my-story"]
}
```

Each item in `mainItems` can be either:

- A string, which references a section ID (like `"publications"`)
- An object with `id`, `dropdown`, and `items` properties for dropdown menus (see example in `config-schema.json`)

**Effect:** The navigation items appear in the website header, with dropdowns expanding on hover/click.

### Hiding Sections

To have a section accessible via URL but not shown in the navigation, add `"hideSection": true` to the section configuration:

```json
{
  "id": "hidden-section",
  "hideSection": true,
  "path": "/hidden-path"
  // ... other properties
}
```

## Social Links

Configure your professional and social media links:

```json
"links": {
  "googleScholar": "https://scholar.google.com/citations?user=9-ma8xIAAAAJ",
  "linkedin": "https://www.linkedin.com/in/shivamlearning/",
  "github": "", // Empty strings are ignored
  // ... other links
}
```

**Available platforms:** `googleScholar`, `linkedin`, `github`, `orcid`, `researchGate`, `academiaEdu`, `webOfScience`, `scopus`, `dblp`, `universityProfile`, `twitter`, `publons`, `arxiv`, `semanticScholar`, `microsoftAcademic`, `youTube`, `slideshare`, `figshare`, `mendeley`, `zotero`, `impactStory`

**Effect:** Links appear in the contact section and footer. Empty strings are ignored.

## Tag Sets

Tag sets provide a way to define consistent styling for categorical data fields like project status, degree types, or any other tag-based metadata. Each tag set defines the visual appearance of specific tag values:

```json
"tagSets": {
  "status": {
    "Completed": { "label": "Completed", "color": "green" },
    "Ongoing": { "label": "Ongoing", "color": "blue" },
    "Planned": { "label": "Planned", "color": "amber" },
    "Incomplete": { "label": "Incomplete", "color": "red" }
  },
  "program": {
    "Bachelor": { "label": "Bachelor's degree program", "color": "purple" },
    "Master": { "label": "Master's degree program", "color": "teal" },
    "PhD": { "label": "PhD", "color": "red" }
  }
}
```

Each tag set is a collection of key-value pairs where:

- The key is the data value (e.g., `"Completed"`, `"Ongoing"`)
- The value object contains display properties:
  - `label`: The display text for the tag (can differ from the data value)
  - `color`: Color name or hex code for the tag background
  - `textColor`: (Optional) Text color, defaults to white or black based on background brightness
  - `icon`: (Optional) Icon name to display with the tag

To use a tag set, reference it in a field configuration using the `tagSet` property:

```json
{
  "field": "status",
  "typeOfField": "Tags",
  "tagSet": "status" // Refers to the "status" tag set defined above
}
```

This tells the website to look up the visual styling for the `"status"` field values from the `"status"` tag set. If `tagSet` is omitted, default styling is applied.

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
    "title": "Section Title", // Used in browser tab
    "sectionHeading": "Section Heading", // Displayed on the page
    "template": "templateName",
    "description": "Section description (optional)",
    // ... template-specific properties
  }
]
```

### Profile Section

The Profile section typically uses subsections for organizing personal information:

```json
{
  "id": "profile",
  "path": "/",
  "title": "Profile",
  "sectionHeading": "Profile",
  "subsections": [
    {
      "id": "about",
      "template": "text-with-image",
      "order": 1,
      "title": "About Me",
      "content": {
        "title": "Shivam Agarwal",
        "subtitle": "Computer Science Researcher (Dr.)",
        "text": "<p>Your bio...</p>",
        "image": "/profile-photo.png",
        "imageShape": "circle"
      }
    }
    // ... other subsections using templates like timeline, grid, carousel, contact
  ]
}
```

**Effect:** The Profile section displays as a page with vertically arranged subsections in the specified `order`.

### Publications Section

The Publications section displays academic publications loaded from a BibTeX file, typically using the `listOfItems` template.

```json
{
  "id": "publications",
  "path": "/publications",
  "title": "Publications",
  "sectionHeading": "Publications",
  "template": "listOfItems",
  "description": "Explore the collection of my publications...",
  "dataSource": "/data/pubs.bib",
  "dataType": "bibtex",
  "bibtexFieldConfig": {
    "arrayFields": [
      "keywords",
      "data_type",
      "application_domain",
      "analysis_focus",
      "visualization_type"
    ],
    "arraySeparator": ",",
    "dateFields": ["year", "date"],
    "linkFields": [
      "url",
      "paperurl",
      "slides",
      "video",
      "supplementary",
      "demo",
      "github",
      "poster"
    ],
    "additionalCitationFields": []
  },
  "overviewVisualization": {
    "type": "KeywordCloud",
    "enabled": true,
    "sourceFields": [
      { "field": "application_domain", "label": "Application Domain" },
      { "field": "visualization_type", "label": "Visualization Type" },
      { "field": "data_type", "label": "Data Type" }
    ],
    "fontSizes": { "min": 11, "max": 22 },
    "maxVisibleKeywords": 15
  },
  "display": {
    // ... display configuration for list, card, and detail views
  }
}
```

**Required properties:**

- `dataSource`: Path to the BibTeX file (`.bib`)
- `dataType`: Set to `"bibtex"`
- `display`: Configuration for list, card, and detail views (see [Display Configuration](#display-configuration))

#### BibTeX Field Configuration (`bibtexFieldConfig`)

This object tells the parser how to handle specific fields in your `.bib` file:

- `arrayFields`: List of BibTeX field names (lowercase) that should be treated as arrays. Their values will be split by the `arraySeparator`.
- `arraySeparator`: The character used to separate items within array fields (default: `,`).
- `dateFields`: List of fields to be parsed as dates.
- `linkFields`: List of fields that contain URLs.
- `additionalCitationFields`: (Optional) List of fields to include in the generated citation string.

#### Overview Visualization (`overviewVisualization`)

This section configures an interactive visualization displayed above the list of items (currently supports `KeywordCloud`):

- `type`: The type of visualization (e.g., `"KeywordCloud"`).
- `enabled`: Set to `true` to show the visualization.
- `sourceFields`: An array defining which data fields provide the keywords/tags:
  - `field`: The name of the data field (e.g., `"keywords"`, `"application_domain"`).
  - `label`: The text displayed to identify this group of keywords in the UI.
  - `tagSet`: (Optional) Name of a tag set to use for applying colors to these keywords.
- `fontSizes`: (KeywordCloud specific) Min and max font sizes for keywords.
- `maxVisibleKeywords`: (KeywordCloud specific) Maximum number of keywords to display initially.

**Effect:** Publications are displayed as a searchable list with cards and detailed views, potentially preceded by a keyword cloud visualization.

### Projects Section

The Projects section displays projects loaded from a JSON file, also typically using `listOfItems`.

```json
{
  "id": "projects",
  "path": "/projects",
  "title": "Projects",
  "sectionHeading": "Projects",
  "template": "listOfItems",
  "description": "Explore my projects...",
  "dataSource": "/data/projects.json",
  "overviewVisualization": {
    "type": "KeywordCloud",
    "enabled": true,
    "sourceFields": [{ "field": "technologies", "label": "Technologies" }]
    // Optional fontSizes, maxVisibleKeywords
  },
  "display": {
    // ... display configuration for list, card, and detail views
  }
}
```

**Required properties:**

- `dataSource`: Path to the projects JSON file (`.json`)
- `dataType`: Should be omitted or set to `"json"` (default)
- `display`: Configuration for list, card, and detail views

**Effect:** Projects are displayed as a searchable list with cards and detailed views, potentially with an overview visualization.

### Other Sections

Other common sections include Mentorships, Talks, Teaching, and Blog, all configured similarly with appropriate templates (`listOfItems`, `article`) and data sources (`.json`, `.md`).

## Templates

Templates define how content is displayed within sections or subsections.

### listOfItems

Used for displaying collections of items (publications, projects, mentorships, etc.) from a `dataSource`.

```json
"template": "listOfItems",
"dataSource": "/path/to/data.json", // or .bib
"dataType": "json", // or "bibtex"
"overviewVisualization": { /* ... */ }, // Optional
"display": {
  "list": { /* ... */ },
  "card": { /* ... */ },
  "detail": { /* ... */ }
}
```

**Effect:** Creates a searchable, filterable list with card previews and detailed views for each item. Supports optional overview visualization. See [Publications Section](#publications-section) and [Display Configuration](#display-configuration) for more details.

### article

Used for long-form content like blog posts or stories, typically loaded from a Markdown file.

```json
"template": "article",
"content": {
  "title": "Article Title", // Optional, overrides sectionHeading
  "resourceDir": "/my-story/", // Directory containing markdown and images
  "markdownFile": "content.md", // Relative to resourceDir
  "banner": { // Optional banner image
    "image": "banner.png", // Relative to resourceDir
    "title": "Banner Title",
    "subtitle": "Banner Subtitle",
    "showTitle": false
  },
  "animation": { // Optional text animation
    "enabled": true,
    "prefix": "I am ",
    "phrases": ["phrase 1", "phrase 2", "phrase 3"]
  }
}
```

**Effect:** Displays a beautifully formatted article with optional banner and text animation. Markdown content is rendered as HTML.

### text-with-image

Used for simple text content with an accompanying image. Often used within Profile subsections.

```json
"template": "text-with-image",
"content": {
  "title": "Section Title",
  "subtitle": "Section Subtitle",
  "text": "<p>HTML content or <strong>Markdown</strong>...</p>", // Supports basic HTML and Markdown
  "image": "/path/to/image.png",
  "imageShape": "circle" // or "square", "rounded"
}
```

**Effect:** Displays text content alongside an image, useful for bio sections.

### timeline

Used for chronological information like education or work experience. Often used within Profile subsections.

```json
"template": "timeline",
"content": {
  "title": "Timeline Title",
  "iconType": "education", // or "work", "project", "award" - determines icon
  "items": [
    {
      "title": "Degree / Job Title",
      "subtitle": "Institution / Company",
      "location": "Location",
      "period": "Time Period (e.g., Jan 2020 – Dec 2023)",
      "description": "Optional description (Markdown/HTML)",
      "details": ["Optional bullet point 1", "Optional bullet point 2"] // Array of strings
    },
    // ... more items
  ]
}
```

**Effect:** Displays a vertical timeline with icons and formatted entries.

### grid

Used for displaying items in a grid layout, like awards. Often used within Profile subsections.

```json
"template": "grid",
"content": {
  "title": "Grid Title",
  "columns": 3, // Number of columns
  "items": [
    {
      "title": "Item Title",
      "description": "Item description (Markdown/HTML)",
      "icon": "trophy", // Optional icon name (e.g., from FontAwesome)
      "link": "/link/to/more", // Optional link URL
      "linkText": "Details" // Optional link text
    },
    // ... more items
  ]
}
```

**Effect:** Displays items in a responsive grid with consistent spacing.

### carousel

Used for featuring selected items from other sections. Often used within Profile subsections.

```json
"template": "carousel",
"content": {
  "title": "Featured Works",
  "items": [
    { "sectionId": "publications", "itemId": "Agarwal2023Dissertation" }, // BibTeX key
    { "sectionId": "projects", "itemId": "ProjectID1" }, // ID from projects.json
    { "sectionId": "mentorships", "itemId": "MentorshipID1" } // ID from mentorships.json
  ]
}
```

**Effect:** Displays a slideshow of selected items from across the website. `sectionId` refers to the ID of the section containing the item, and `itemId` refers to the unique ID of the item within its data source (e.g., BibTeX key for publications, `id` field for projects).

### contact

Used for contact information and social links. Often used within Profile subsections.

```json
"template": "contact",
"content": {
  "title": "Get in Touch",
  "text": "Contact intro text... (Markdown/HTML)",
  "links": ["linkedin", "email"], // Keys from the top-level "links" object
  "outro": "Outro text... (Markdown/HTML)",
  "useIcons": true, // Display icons for links?
  "useLabels": true, // Display text labels for links?
  "layout": "horizontal" // or "vertical"
}
```

**Effect:** Displays contact information with optional icons and formatted links based on the top-level `links` configuration.

## Display Configuration

The `display` configuration, used within `listOfItems` sections, controls how items are shown in list, card, and detail views. All three view types (`list`, `card`, `detail`) use a consistent structure with a `fields` array.

```json
"display": {
  "list": { // Configuration for the main list view
    "fields": [ /* ... field configurations ... */ ],
    "showImage": true // Show item image thumbnail?
  },
  "card": { // Configuration for the popup card view (when clicking an item)
    "fields": [ /* ... field configurations ... */ ],
    "showImage": true // Show item image in card?
  },
  "detail": { // Configuration for the dedicated detail page (if enabled/needed)
    "fields": [ /* ... field configurations ... */ ],
    "actions": [ /* ... action button configurations ... */ ] // Optional action buttons
  }
}
```

### Field Configuration

Each object in the `fields` array defines how a piece of data from the source file (`.json` or `.bib`) should be displayed.

**Example Field Configuration (Project Card):**

```json
{
  "field": "title", // Data field from projects.json
  "typeOfField": "Heading",
  "options": { "level": 3 } // Display as <h3>
},
{
  "field": "year", // Data field from projects.json
  "typeOfField": "Text",
  "label": "Year" // Display "Year: " before the value
},
{
  "field": "status", // Data field from projects.json
  "typeOfField": "Tags",
  "tagSet": "status" // Use the 'status' tag set for styling
},
{
  "field": "description", // Data field from projects.json
  "typeOfField": "ExpandableMarkdown",
  "options": { "limit": "descriptionPreviewLength" } // Truncate using global setting
},
{
  "field": "technologies", // Data field from projects.json
  "typeOfField": "Tags" // Use default tag styling
},
{
  "field": "journal", // Data field from pubs.bib (e.g., in publications list)
  "typeOfField": "Text",
  "variant": "italics_list", // Apply specific italics styling
  "condition": "journal" // Only display if 'journal' field exists
}
```

**Properties:**

| Property      | Description                                                                             | Example Value                                   |
| ------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------- | ----------- |
| `field`       | The data field name from the source file                                                | `"title"`, `"description"`, `"authors"`         |
| `typeOfField` | The component type to use for rendering (see [Field Types](#field-types))               | `"Heading"`, `"Text"`, `"Tags"`, `"AuthorList"` |
| `label`       | (Optional) Label text to display with or above the field                                | `"Authors"`, `"Abstract"`, `"Year"`             |
| `tagSet`      | (Optional, for `Tags`) Reference to a [Tag Set](#tag-sets)                              | `"status"`, `"program"`                         |
| `options`     | (Optional) Component-specific settings (see [Field Types](#field-types))                | `{ "level": 3 }`, `{ "limit": 10 }`             |
| `variant`     | (Optional) Specifies a visual variation for the component                               | `"italics_list"`, `"italics_detail"`            |
| `condition`   | (Optional) When to display this field (see [Conditional Display](#conditional-display)) | `"abstract"`, `"links.video"`, `"journal        | booktitle"` |

### Field Types

Different `typeOfField` values render data using specific components:

| Field Type           | Description                                                              | Common Options                                  | Example Use Cases                                       |
| -------------------- | ------------------------------------------------------------------------ | ----------------------------------------------- | ------------------------------------------------------- |
| `Heading`            | Item title                                                               | `level`: heading level (1-6)                    | Publication title, Project name                         |
| `Text`               | Plain text, potentially with a label or specific variant                 | `variant`: `"italics_list"`, `"italics_detail"` | Year, Journal/Booktitle, Location, Collaborators        |
| `AuthorList`         | Formatted list of authors (highlights `researcherName`)                  |                                                 | Publication authors                                     |
| `Tags`               | Renders array fields as styled tags                                      | `tagSet`: name of tag set                       | Keywords, Technologies, Status, Program Type            |
| `Award`              | Displays award information, often as badges                              |                                                 | Publication/Project awards field                        |
| `Image`              | Displays the item's image (if available in data)                         |                                                 | Publication/Project image                               |
| `ExpandableMarkdown` | Renders Markdown/HTML content, truncated with an "expand" option         | `limit`: line count or global setting ref       | Abstract, Description                                   |
| `Section`            | Used internally, typically not configured directly                       |                                                 |                                                         |
| `LinkButtons`        | Renders an array/object of links as styled buttons                       |                                                 | Project links (GitHub, Demo, Website)                   |
| `PublicationLinks`   | Renders publication-specific links (PDF, Slides, Video, etc.) as buttons | `showText`: display link text?                  | Publication links (often uses `linkFields` from BibTeX) |
| `Markdown`           | Renders Markdown/HTML content without truncation                         |                                                 | Any field containing rich text                          |

- **`ExpandableMarkdown` Limit:** The `limit` option can be a number (e.g., `10`) or a string referencing a top-level config property (e.g., `"descriptionPreviewLength"` or `"abstractPreviewLength"`).
- **`Text` Variant:** Used to apply specific styles, like italics for venue names (`"italics_list"`, `"italics_detail"`).

### Conditional Display

The `condition` property determines when a field or action should be displayed based on the presence of data fields in the current item.

```json
// Example 1: Show abstract field only if item.abstract exists
{
  "field": "abstract",
  "typeOfField": "ExpandableMarkdown",
  "label": "Abstract",
  "condition": "abstract"
}

// Example 2: Show video link button only if item.links.video exists
{
  "field": "links",
  "typeOfField": "PublicationLinks",
  "condition": "links.video" // Checks nested property
}

// Example 3: Show venue field if EITHER item.journal OR item.booktitle exists
{
  "field": "journal", // Can also be "booktitle", data is merged internally
  "typeOfField": "Text",
  "label": "Venue",
  "variant": "italics_detail",
  "condition": "journal|booktitle" // Use '|' for OR condition
}
```

**Types of conditions:**

1. **Simple field check**: `"condition": "fieldName"` - Shows if `item.fieldName` exists and is not empty/null.
2. **Nested property check**: `"condition": "objectName.propertyName"` - Shows if `item.objectName.propertyName` exists.
3. **OR condition**: `"condition": "fieldOne|fieldTwo"` - Shows if _either_ `item.fieldOne` OR `item.fieldTwo` exists.

### Detail View Actions

In the `detail` view configuration, you can add action buttons using the `actions` array.

```json
"detail": {
  "fields": [ /* ... detail view field configurations ... */ ],
  "actions": [
    { "type": "BibTeX", "condition": "entryType" }, // Show BibTeX button if it's a publication
    { "type": "Video", "condition": "links.video" } // Show Video button if a video link exists
  ]
}
```

- `type`: The type of action button (e.g., `"BibTeX"`, `"Video"`). The system provides predefined icons and functionality for common types.
- `condition`: (Optional) Condition for displaying the action button (uses the same logic as field conditions).

## SEO and Analytics

Configure SEO and analytics settings in the `site` object:

```json
"site": {
  "title": "Shivam Agarwal's Website - Data and AI Expert",
  "description": "This is the website of Shivam Agarwal...",
  "baseUrl": "https://s-agarwl.github.io", // Should match top-level baseUrl
  "googleAnalyticsId": "G-XXXXXXXXXX", // Optional GA4 ID
  "keywords": "academic, research, publications, papers...", // Optional
  "author": "Shivam Agarwal", // Optional, should match researcherName
  "googleSiteVerification": "verification-code" // Optional
}
```

**Effect:** These settings populate meta tags (`<title>`, `<meta name="description">`, etc.) for SEO and configure Google Analytics (if `googleAnalyticsId` is provided).

## Common Configuration Tasks

### Adding a New Section (e.g., Talks)

1. Add the section ID (e.g., `"talks"`) to the `navigation.mainItems` array (unless hiding it).
2. Create a new section object in the `sections` array:
   ```json
   {
     "id": "talks",
     "path": "/talks",
     "title": "Talks",
     "sectionHeading": "Presentations and Talks",
     "template": "listOfItems", // Or "article" if it's a single page
     "description": "List of my presentations...",
     "dataSource": "/data/talks.json", // Create this file
     "display": {
       /* ... configure list, card, detail views ... */
     }
   }
   ```
3. Create the data source file (`public/data/talks.json`) with your talk information.
4. Configure the `display` object with appropriate fields.

### Creating a Custom Page (e.g., CV)

1. Add a new section using the `article` template:
   ```json
   {
     "id": "cv",
     "path": "/cv",
     "title": "Curriculum Vitae",
     "sectionHeading": "Curriculum Vitae",
     "template": "article",
     "content": {
       "resourceDir": "/cv/", // Create this directory
       "markdownFile": "content.md" // Create this file
     }
   }
   ```
2. Create the `public/cv/content.md` file with your CV content in Markdown.
3. (Optional) Add `"cv"` to the `navigation.mainItems`.

### Featuring Items on Homepage (Profile Page)

1. Ensure your Profile section (`id: "profile"`) exists.
2. Add a `carousel` template subsection to its `subsections` array:
   ```json
   {
     "id": "featuredWorks",
     "template": "carousel",
     "order": 5, // Adjust order as needed
     "title": "Featured Works", // Heading above the carousel
     "content": {
       "title": "Featured", // Internal title, not usually displayed
       "items": [
         { "sectionId": "publications", "itemId": "Agarwal2023Dissertation" }, // BibTeX key
         { "sectionId": "projects", "itemId": "ProjectID1" }, // ID from projects.json
         { "sectionId": "mentorships", "itemId": "MentorshipID1" } // ID from mentorships.json
       ]
     }
   }
   ```
3. Adjust the `order` property to position it correctly among other subsections.

### Hiding a Section from Navigation

Add `"hideSection": true` to the section's configuration object in the `sections` array. The page will still be accessible via its `path`.

### Changing the Order of Profile Subsections

Adjust the `order` property (integer) in each subsection object within the Profile section's `subsections` array. Lower numbers appear first.

## Full Example

See `config.json` for a complete example configuration reflecting many of these features.

## Additional Resources

- [JSON Schema documentation](config-schema.json) - Formal schema definition (link relative to this guide)
- [Template documentation](#templates) - Detailed guidance on each template
- [Display Configuration documentation](#display-configuration) - Details on configuring list, card, and detail views
