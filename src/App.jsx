import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useEffect, Fragment } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Intro from './components/pageSections/Intro';
import PublicationCarousel from './components/pageSections/PublicationCarousel';
import Contact from './components/pageSections/Contact';
import Education from './components/pageSections/Education';
import WorkExperience from './components/pageSections/WorkExperience';
import Section from './components/Section';
import Awards from './components/pageSections/Awards';
import NotFound from './components/NotFound';
import PropTypes from 'prop-types';
import DynamicSection from './components/pageSections/DynamicSection';
import Documentation from './components/pageSections/Documentation';
import MyStoryComponent from './components/pageSections/MyStoryComponent';
import { ContentPage, ContentDetails } from './GenericContentPage';

// Update this mapping function
const sectionIdToComponent = (sectionId) => {
  switch (sectionId) {
    case 'About':
      return Intro;
    case 'FeaturedPublications':
      return PublicationCarousel;
    case 'Education':
      return Education;
    case 'WorkExperience':
      return WorkExperience;
    case 'Awards':
      return Awards;
    case 'Contact':
      return Contact;
    default:
      return DynamicSection;
  }
};

const renderAlternatingSections = (components, entries, config, sectionConfigs) => {
  return components.map((Component, index) => {
    const sectionConfig = sectionConfigs[index];
    return (
      <Section key={index} id={sectionConfig.id} className={'bg-primary'}>
        <Component entries={entries} config={config} sectionConfig={sectionConfig} />
      </Section>
    );
  });
};

function App({ config }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Get profile section IDs from navigation
  const profileDropdown = config.navigation?.mainItems?.find((item) => item.id === 'Profile');
  const profileSectionIds = profileDropdown?.items?.map((item) => item.id) || [];

  // Get section components in the order defined in the navigation
  const sectionComponents = profileSectionIds
    .map((sectionId) => {
      const section = config.sections[sectionId];
      if (!section) return null;
      return {
        id: sectionId,
        component: sectionIdToComponent(sectionId),
        config: section,
      };
    })
    .filter((section) => section && section.component !== null);

  return (
    <Router>
      <div className="App flex flex-col min-h-screen">
        <Header config={config} />
        <main className="flex-grow pt-16">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  {renderAlternatingSections(
                    sectionComponents.map((section) => section.component),
                    [],
                    config,
                    sectionComponents.map((section) => section.config),
                  )}
                </>
              }
            />

            {/* Other existing routes */}
            <Route path="/my-story" element={<MyStoryComponent config={config} />} />
            <Route path="/docs" element={<Documentation />} />

            {/* Dynamically create routes for all content types */}
            {config.contentTypes.map((type) => (
              <Fragment key={type.id}>
                <Route
                  path={`/${type.id}`}
                  element={<ContentPage config={config} contentType={type.id} />}
                />
                <Route
                  path={`/${type.id}/:id`}
                  element={<ContentDetails config={config} contentType={type.id} />}
                />
              </Fragment>
            ))}
            <Route path="*" element={<NotFound config={config} />} />
          </Routes>
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
