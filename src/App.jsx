import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import NotFound from './components/NotFound';
import PropTypes from 'prop-types';
import Documentation from './components/Documentation';
import { GenericContentPage, ContentDetails } from './components/GenericContentPage';
import PageWithSubSections from './components/PageWithSubSections';
import DynamicSectionRenderer from './components/DynamicSectionRenderer';
import ShortUrlRedirect from './components/ShortUrlRedirect';
import convertBibtexToJson from './utils/bibtexToJson';

function App({ config }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contentData, setContentData] = useState({});
  const [shorturlsLoaded, setShorturlsLoaded] = useState(false);

  // Extract sections that have paths defined (for routing)
  const routes = useMemo(() => {
    const routeData = [];

    // Go through all section configs and find those with paths
    for (const sectionConfig of config.sections) {
      if (sectionConfig.path && sectionConfig.path !== '/') {
        // Normalize the section config to ensure it has all required properties
        routeData.push({
          // Ensure section has a path
          path: sectionConfig.path,
          // Add the detail path for sections with dataSource
          detailPath: sectionConfig.dataSource ? `${sectionConfig.path}/:id` : null,
          // Include all other section properties
          ...sectionConfig,
        });
      }
    }

    return routeData;
  }, [config.sections]);

  // Load data for sections with dataSources to build short URL mapping
  useEffect(() => {
    const fetchContentData = async () => {
      try {
        const newContentData = {};

        // Find sections with dataSources
        const sectionsWithData = config.sections.filter((section) => section.dataSource);

        // Early exit if no data sources
        if (sectionsWithData.length === 0) {
          console.log('No sections with dataSource found');
          setShorturlsLoaded(true);
          setIsLoading(false);
          return;
        }

        // Track promises for all data fetches
        const fetchPromises = [];

        for (const section of sectionsWithData) {
          const fetchPromise = fetch(section.dataSource)
            .then((response) => {
              if (!response.ok) {
                throw new Error(`Failed to fetch data for ${section.id}: ${response.statusText}`);
              }

              if (section.dataType === 'bibtex') {
                return response.text().then((bibtexText) => {
                  console.log(
                    `Loaded bibtex data for ${section.id}, size: ${bibtexText.length} chars`,
                  );
                  // Use the existing bibtexToJson utility
                  const parsedEntries = convertBibtexToJson(bibtexText);

                  // Create a map of entries by ID for easier lookup
                  const entriesById = {};
                  parsedEntries.forEach((entry) => {
                    entriesById[entry.id] = entry;
                  });

                  // Store the parsed data
                  newContentData[section.id] = entriesById;

                  console.log(`Parsed ${parsedEntries.length} bibtex entries`);
                });
              } else {
                return response.json().then((jsonData) => {
                  console.log(
                    `Loaded JSON data for ${section.id}, entries: ${Array.isArray(jsonData) ? jsonData.length : 'object'}`,
                  );
                  newContentData[section.id] = jsonData;
                });
              }
            })
            .catch((err) => {
              console.error(`Error loading data for ${section.id}:`, err);
            });

          fetchPromises.push(fetchPromise);
        }

        // Wait for all data to be fetched
        await Promise.all(fetchPromises);

        // Set the loaded data
        setContentData(newContentData);
        setShorturlsLoaded(true);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading content data:', err);
        setError(`Failed to load data: ${err.message}`);
        setIsLoading(false);
      }
    };

    fetchContentData();
  }, [config.sections]);

  // Create a mapping of short URLs to their full content paths
  const shorturlMap = useMemo(() => {
    const mapping = {};

    // For each section with content data
    Object.entries(contentData).forEach(([sectionId, sectionData]) => {
      const section = config.sections.find((s) => s.id === sectionId);
      if (!section || !section.path) return;

      const basePath = section.path.startsWith('/') ? section.path : `/${section.path}`;

      // Handle different data types
      if (Array.isArray(sectionData)) {
        // For JSON array data
        sectionData.forEach((item) => {
          if (item.shorturl) {
            mapping[item.shorturl] = `${basePath}/${item.id}`;
          }
        });
      } else if (typeof sectionData === 'object') {
        // For JSON object data or parsed bibtex data
        Object.values(sectionData).forEach((item) => {
          if (item.shorturl) {
            mapping[item.shorturl] = `${basePath}/${item.id}`;
          }
        });
      }
    });

    console.log('Short URL mapping created:', mapping);
    return mapping;
  }, [contentData, config.sections]);

  // Print shorturlMap type and content for debugging
  console.log('App - shorturlMap type:', typeof shorturlMap);
  console.log('App - shorturlMap has entries:', shorturlMap && Object.keys(shorturlMap).length > 0);

  // Check for prerendered data
  useEffect(() => {
    // Check if we have prerendered publication data
    const publicationDataElement = document.getElementById('publication-data');
    if (publicationDataElement) {
      try {
        const prerenderedData = JSON.parse(publicationDataElement.textContent);
        if (prerenderedData.entry && prerenderedData.config) {
          // We're on a publication page with prerendered data
          console.log('Found prerendered data:', prerenderedData);

          // Get the section ID from the entry or config
          const sectionId =
            prerenderedData.entry.contentType || prerenderedData.entry.sectionId || 'publications';

          // Create a new contentData object that includes this entry
          setContentData((prevData) => {
            const newData = { ...prevData };

            // Initialize the section if it doesn't exist
            if (!newData[sectionId]) {
              newData[sectionId] = {};
            }

            // Format depends on whether we're dealing with an object or array
            if (Array.isArray(newData[sectionId])) {
              // If it's an array, ensure we don't add duplicates
              const exists = newData[sectionId].some(
                (item) => item.id === prerenderedData.entry.id,
              );
              if (!exists) {
                newData[sectionId] = [...newData[sectionId], prerenderedData.entry];
              }
            } else {
              // If it's an object map, add/update the entry by ID
              newData[sectionId][prerenderedData.entry.id] = prerenderedData.entry;
            }

            console.log('Updated contentData with prerendered entry:', newData);
            return newData;
          });

          setIsLoading(false);
          setShorturlsLoaded(true);
          return;
        }
      } catch (e) {
        console.error('Error parsing prerendered data:', e);
        setError(`Failed to parse prerendered data: ${e.message}`);
      }
    }
  }, []);

  // Show loading state for the entire app
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-xl mb-4">Loading...</div>
          <div className="text-sm text-gray-600">Initializing application...</div>
        </div>
      </div>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-xl mb-4 text-red-600">Error</div>
          <div className="text-sm text-gray-800">{error}</div>
        </div>
      </div>
    );
  }

  // Helper function to render the appropriate component for a section
  const renderSectionComponent = (section) => {
    // Special handling for known custom components
    if (section.id === 'Documentation') {
      return <Documentation />;
    }

    // For sections with template "listOfItems", use GenericContentPage
    if (section.template === 'listOfItems') {
      return <GenericContentPage section={section} config={config} />;
    }

    // For sections with subsections or other templates, use DynamicSectionRenderer
    if ((section.subsections && Object.keys(section.subsections).length > 0) || section.template) {
      return <DynamicSectionRenderer section={section} config={config} />;
    }

    // Fall back to a simple rendering for sections without templates or subsections
    return (
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-6">
          {section.title || section.sectionHeading || section.id}
        </h1>
        {typeof section.content === 'string' ? (
          <p>{section.content}</p>
        ) : (
          <p>Section content not available</p>
        )}
      </div>
    );
  };

  return (
    <Router>
      <div className="App flex flex-col min-h-screen">
        <Header config={config} />
        <main className="flex-grow pt-16">
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <Routes>
              {/* Home page route */}
              <Route path="/" element={<PageWithSubSections config={config} />} />

              {/* Dynamically create routes for sections that have defined paths */}
              {routes.map((section) => (
                <Route
                  key={section.id}
                  path={section.path}
                  element={renderSectionComponent(section)}
                />
              ))}

              {/* Add duplicate routes with trailing slashes for main section paths */}
              {routes.map((section) => (
                <Route
                  key={`${section.id}-slash`}
                  path={`${section.path}/`}
                  element={renderSectionComponent(section)}
                />
              ))}

              {/* Dynamically create routes for all content detail pages */}
              {routes
                .filter((section) => section.detailPath)
                .map((section) => (
                  <Route
                    key={`${section.id}-detail`}
                    path={section.detailPath}
                    element={<ContentDetails section={section} config={config} />}
                  />
                ))}

              {/* Add duplicate routes with trailing slashes */}
              {routes
                .filter((section) => section.detailPath)
                .map((section) => (
                  <Route
                    key={`${section.id}-detail-slash`}
                    path={`${section.detailPath}/`}
                    element={<ContentDetails section={section} config={config} />}
                  />
                ))}

              {/* Short URL redirect route - only add when shorturls are loaded */}
              {shorturlsLoaded && (
                <Route path="/:shorturl" element={<ShortUrlRedirect shorturlMap={shorturlMap} />} />
              )}

              {/* Short URL redirect route with trailing slash */}
              {shorturlsLoaded && (
                <Route
                  path="/:shorturl/"
                  element={<ShortUrlRedirect shorturlMap={shorturlMap} />}
                />
              )}

              {/* 404 route */}
              <Route path="*" element={<NotFound config={config} />} />
            </Routes>
          </div>
        </main>
        <Footer config={config} />
      </div>
    </Router>
  );
}

App.propTypes = {
  config: PropTypes.shape({
    researcherName: PropTypes.string.isRequired,
    sections: PropTypes.array.isRequired,
    navigation: PropTypes.shape({
      mainItems: PropTypes.array,
    }),
  }).isRequired,
};

export default App;
