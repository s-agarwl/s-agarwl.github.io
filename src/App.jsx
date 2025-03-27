import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import NotFound from './components/NotFound';
import PropTypes from 'prop-types';
import Documentation from './components/pageSections/Documentation';
import MyStoryComponent from './components/pageSections/MyStoryComponent';
import { GenericContentPage, ContentDetails } from './components/GenericContentPage';
import HomeSections from './components/HomeSections';
import DynamicSectionRenderer from './components/DynamicSectionRenderer';

function App({ config }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract sections that have paths defined (for routing)
  const sectionRoutes = useMemo(() => {
    const routes = [];

    // Go through all section configs and find those with paths
    for (const [id, sectionConfig] of Object.entries(config.sections)) {
      if (sectionConfig.path && sectionConfig.path !== '/') {
        // Normalize the section config to ensure it has all required properties
        routes.push({
          // Ensure section has an id
          id,
          // Ensure section has a title
          title: sectionConfig.title || sectionConfig.sectionHeading || id,
          // Pass along the path
          path: sectionConfig.path,
          // Include the template if specified
          template: sectionConfig.template,
          // Ensure content is an object if it exists
          content: sectionConfig.content || {},
          // Pass along any subsections
          subsections: sectionConfig.subsections || {},
          // Pass any additional properties
          ...sectionConfig,
        });
      }
    }

    return routes;
  }, [config.sections]);

  // Map content type IDs to their routes to avoid duplication
  const contentTypeRoutes = useMemo(() => {
    return (config.contentTypes || []).map((type) => ({
      id: type.id,
      path: `/${type.id}`,
      detailPath: `/${type.id}/:id`,
    }));
  }, [config.contentTypes]);

  // Create a map of section IDs to content type IDs for sections using listOfItems template
  const sectionToContentTypeMap = useMemo(() => {
    const map = {};

    // Map section IDs to corresponding content type IDs
    if (config.contentTypes) {
      config.contentTypes.forEach((type) => {
        // Match section ID with content type ID (case insensitive)
        const matchingSection = Object.keys(config.sections).find(
          (sectionId) => sectionId.toLowerCase() === type.id.toLowerCase(),
        );

        if (matchingSection) {
          map[matchingSection] = type.id;
        }
      });
    }

    return map;
  }, [config.sections, config.contentTypes]);

  useEffect(() => {
    // Check if we have prerendered publication data
    const publicationDataElement = document.getElementById('publication-data');
    if (publicationDataElement) {
      try {
        const prerenderedData = JSON.parse(publicationDataElement.textContent);
        if (prerenderedData.entry && prerenderedData.config) {
          // We're on a publication page with prerendered data
          setIsLoading(false);
          return;
        }
      } catch (e) {
        console.error('Error parsing prerendered data:', e);
        setError(`Failed to parse prerendered data: ${e.message}`);
      }
    }

    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Helper function to render the appropriate component for a section
  const renderSectionComponent = (section) => {
    // Special handling for known custom components
    if (section.id === 'MyStory') {
      return <MyStoryComponent config={config} />;
    } else if (section.id === 'Documentation') {
      return <Documentation />;
    }

    // For sections with template "listOfItems", use GenericContentPage
    if (section.template === 'listOfItems') {
      const contentType = sectionToContentTypeMap[section.id];
      if (contentType) {
        return <GenericContentPage config={config} contentType={contentType} />;
      }
      // If no matching content type, log warning and fall through to default rendering
      console.warn(`No matching content type found for section: ${section.id}`);
    }

    // For sections with subsections or other templates, use DynamicSectionRenderer
    if ((section.subsections && Object.keys(section.subsections).length > 0) || section.template) {
      return <DynamicSectionRenderer section={section} config={config} />;
    }

    // Fall back to a simple rendering for sections without templates or subsections
    return (
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-6">{section.title}</h1>
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
              <Route path="/" element={<HomeSections config={config} />} />

              {/* Dynamically create routes for sections that have defined paths */}
              {sectionRoutes.map((section) => (
                <Route
                  key={section.id}
                  path={section.path}
                  element={renderSectionComponent(section)}
                />
              ))}

              {/* Dynamically create routes for all content types detail pages */}
              {contentTypeRoutes.map((type) => (
                <Route
                  key={`${type.id}-detail`}
                  path={type.detailPath}
                  element={<ContentDetails config={config} contentType={type.id} />}
                />
              ))}

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
    sections: PropTypes.object,
    navigation: PropTypes.shape({
      mainItems: PropTypes.array,
    }),
    contentTypes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        dataSource: PropTypes.string.isRequired,
        view: PropTypes.oneOf(['grid', 'list']).isRequired,
      }),
    ).isRequired,
  }).isRequired,
};

export default App;
