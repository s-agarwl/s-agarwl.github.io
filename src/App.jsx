import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Intro from './components/pageSections/Intro';
import PublicationCarousel from './components/pageSections/PublicationCarousel';
import Contact from './components/pageSections/Contact';
import AllPublications from './components/AllPublications';
import PublicationDetails from './components/PublicationDetails';
import Education from './components/pageSections/Education';
import WorkExperience from './components/pageSections/WorkExperience';
import Section from './components/Section';
import Awards from './components/pageSections/Awards';
import NotFound from './components/NotFound';
import PublicationDetailsById from './components/PublicationDetailsById';
import PropTypes from 'prop-types';
import bibtexParse from 'bibtex-parse-js';
import * as utils from './utils/utils';
import DynamicSection from './components/pageSections/DynamicSection';
import Documentation from './components/pageSections/Documentation';
import MyStoryComponent from './components/pageSections/MyStoryComponent';

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
      <Section
        key={index}
        id={sectionConfig.id}
        // className={index % 2 === 0 ? 'bg-primary' : 'bg-gray-50'}
        className={'bg-primary'}
      >
        <Component entries={entries} config={config} sectionConfig={sectionConfig} />
      </Section>
    );
  });
};

function App({ config }) {
  const [entries, setEntries] = useState([]);
  const [shortUrlMap, setShortUrlMap] = useState({});
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
          setEntries([prerenderedData.entry]);
          setIsLoading(false);
          return;
        }
      } catch (e) {
        console.error('Error parsing prerendered data:', e);
      }
    }

    if (!config || !config.bibtexPath) {
      setError('Invalid configuration: bibtexPath is missing');
      setIsLoading(false);
      return;
    }

    fetch(config.bibtexPath)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch BibTeX file: ${response.statusText}`);
        }
        return response.text();
      })
      .then((data) => {
        const parsedEntries = bibtexParse.toJSON(data);
        const cleanedEntries = parsedEntries.map((entry) => ({
          ...entry,
          entryTags: utils.cleanEntryTags(entry.entryTags, entry.citationKey),
        }));

        const formattedEntries = utils.formatAuthorNames(cleanedEntries);

        const sortedEntries = formattedEntries.sort((a, b) => {
          const yearA = parseInt(a.entryTags.year, 10);
          const yearB = parseInt(b.entryTags.year, 10);
          return yearB - yearA;
        });

        const urlMap = {};
        sortedEntries.forEach((entry) => {
          if (entry.entryTags.shorturl) {
            urlMap[entry.entryTags.shorturl] = entry.citationKey;
          }
        });

        setEntries(sortedEntries);
        setShortUrlMap(urlMap);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error loading or parsing BibTeX:', error);
        setError(`Error loading or parsing BibTeX: ${error.message}`);
        setIsLoading(false);
      });
  }, [config]);

  if (isLoading) {
    return <div>Loading publications...</div>;
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
                    entries,
                    config,
                    sectionComponents.map((section) => section.config),
                  )}
                </>
              }
            />

            <Route
              path="/publications"
              element={<AllPublications entries={entries} config={config} />}
            />
            <Route path="/my-story" element={<MyStoryComponent config={config} />} />
            <Route
              path="/publication/:id"
              element={<PublicationDetails entries={entries} config={config} />}
            />
            {/* Dynamically create routes for each short URL */}
            {Object.keys(shortUrlMap).map((shortUrl) => (
              <Route
                key={shortUrl}
                path={`/${shortUrl}`}
                element={
                  <PublicationDetailsById
                    entries={entries}
                    yourName={config.researcherName}
                    id={shortUrlMap[shortUrl]}
                    config={config}
                  />
                }
              />
            ))}
            <Route path="/docs" element={<Documentation />} />
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
    bibtexPath: PropTypes.string.isRequired,
    sections: PropTypes.object,
    navigation: PropTypes.shape({
      mainItems: PropTypes.array,
    }),
  }).isRequired,
};

export default App;
