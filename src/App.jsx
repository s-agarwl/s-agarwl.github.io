import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import NotFound from './components/NotFound';
import PropTypes from 'prop-types';
import Documentation from './components/pageSections/Documentation';
import { GenericContentPage, ContentDetails } from './components/GenericContentPage';
import HomeSections from './components/HomeSections';
import DynamicSectionRenderer from './components/DynamicSectionRenderer';

function App({ config }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
              <Route path="/" element={<HomeSections config={config} />} />

              {/* Dynamically create routes for sections that have defined paths */}
              {routes.map((section) => (
                <Route
                  key={section.id}
                  path={section.path}
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
