const Documentation = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-center">Website Documentation</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
        <p className="mb-4">
          This website is designed to be fully configurable through configuration files, without
          requiring any coding. You can customize the content, layout, and appearance by modifying
          the <code className="bg-gray-100 px-1 py-0.5 rounded">config.json</code> file.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Template System</h2>
        <p className="mb-4">
          The website uses a template system to display different types of content sections. Each
          section in the config file can specify a template to use, along with the content for that
          template.
        </p>

        <h3 className="text-xl font-bold mt-6 mb-3">Section Configuration</h3>
        <p className="mb-4">
          In your <code className="bg-gray-100 px-1 py-0.5 rounded">config.json</code> file, each
          section should follow this structure:
        </p>

        <div className="bg-gray-100 p-4 rounded-lg overflow-auto mb-6">
          <pre className="text-sm">
            {`"SectionId": {
  "id": "SectionId",
  "template": "template-name",  // The template to use
  "order": 1,                   // Order on the home page (optional)
  "path": "/section-path",      // URL path if it's a standalone page (optional)
  "excludeFromHome": false,     // Whether to exclude from home page (optional)
  "content": {
    // Template-specific content (see template documentation)
  }
}`}
          </pre>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Available Templates</h2>
        <p className="mb-4">The following templates are available for use in your sections:</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-bold mb-3">text</h3>
            <p className="mb-3 text-gray-600">Simple text section with title and content.</p>
            <h4 className="font-semibold mb-2">Content Structure:</h4>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
              {`{
  "title": "Section Title",
  "text": "<p>HTML content here</p>",
  "className": "additional-classes" // optional
}`}
            </pre>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-bold mb-3">text-with-image</h3>
            <p className="mb-3 text-gray-600">Text section with an accompanying image.</p>
            <h4 className="font-semibold mb-2">Content Structure:</h4>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
              {`{
  "title": "Section Title",
  "subtitle": "Subtitle text",
  "text": "<p>HTML content here</p>",
  "image": "/path/to/image.jpg",
  "imageAlt": "Image description",
  "imagePosition": "left", // or "right"
  "imageShape": "circle" // or "rounded", "square"
}`}
            </pre>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-bold mb-3">timeline</h3>
            <p className="mb-3 text-gray-600">Vertical timeline for chronological content.</p>
            <h4 className="font-semibold mb-2">Content Structure:</h4>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
              {`{
  "title": "Timeline Title",
  "iconType": "education", // or "work", "custom"
  "items": [
    {
      "title": "Item Title",
      "subtitle": "Subtitle",
      "period": "Time period",
      "location": "Location",
      "description": "Description text",
      "details": ["Detail 1", "Detail 2"]
    }
    // More items...
  ]
}`}
            </pre>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-bold mb-3">grid</h3>
            <p className="mb-3 text-gray-600">Grid layout for displaying cards or items.</p>
            <h4 className="font-semibold mb-2">Content Structure:</h4>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
              {`{
  "title": "Grid Title",
  "columns": 3, // 1-4 columns
  "items": [
    {
      "title": "Item Title",
      "description": "Item description",
      "icon": "trophy", // or "medal", "award", "star"
      "link": "/item-link",
      "linkText": "Learn More",
      "image": "/path/to/image.jpg" // optional
    }
    // More items...
  ]
}`}
            </pre>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-bold mb-3">carousel</h3>
            <p className="mb-3 text-gray-600">Carousel for featured items or works.</p>
            <h4 className="font-semibold mb-2">Content Structure:</h4>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
              {`{
  "title": "Carousel Title",
  "itemsType": "publication", // or other content type
  "citationKeys": ["key1", "key2"], // for publications
  "itemIds": ["id1", "id2"], // for other content types
  "showDots": true,
  "showArrows": true,
  "itemsPerPage": 3
}`}
            </pre>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-bold mb-3">contact</h3>
            <p className="mb-3 text-gray-600">
              Contact section with social links and contact info.
            </p>
            <h4 className="font-semibold mb-2">Content Structure:</h4>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
              {`{
  "title": "Contact Title",
  "text": "Introductory text here",
  "links": ["email", "linkedin", "github"],
  "outro": "Concluding text here",
  "useIcons": true,
  "useLabels": false,
  "layout": "centered" // or "grid", "horizontal"
}`}
            </pre>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Example Configuration</h2>
        <p className="mb-4">Here&apos;s an example of a complete section configuration:</p>

        <div className="bg-gray-100 p-4 rounded-lg overflow-auto">
          <pre className="text-sm">
            {`"About": {
  "id": "About",
  "template": "text-with-image",
  "order": 1,
  "content": {
    "title": "John Doe",
    "subtitle": "Software Engineer",
    "text": "<p>Hi, I'm John! I'm a software engineer with 5 years of experience.</p>",
    "image": "/profile-photo.jpg",
    "imageShape": "circle"
  }
}`}
          </pre>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Advanced Customization</h2>
        <p className="mb-4">For advanced customization, you can:</p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">Create new template variants</li>
          <li className="mb-2">Customize the theme colors in your config</li>
          <li className="mb-2">Add custom stylesheets</li>
          <li className="mb-2">Create custom content types</li>
        </ul>
        <p>
          Refer to the developer documentation for more information on advanced customization
          options.
        </p>
      </section>
    </div>
  );
};

export default Documentation;
