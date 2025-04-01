import { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import GenericCard from './GenericCard';
import GenericListItem from './GenericListItem';
import GenericItemDetails from './GenericItemDetails';
import ContentControls from './ContentControls';
import KeywordCloud from './KeywordCloud';
import { motion, AnimatePresence } from 'framer-motion';
import Fuse from 'fuse.js';
import convertBibtexToJson from '../utils/bibtexToJson';
import '../styles/markdown.css';

const GenericContentPage = ({ config, section }) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('contentViewMode') || 'grid';
  });
  const [selectedKeywords, setSelectedKeywords] = useState([]);

  // Update localStorage when viewMode changes
  useEffect(() => {
    localStorage.setItem('contentViewMode', viewMode);
  }, [viewMode]);

  // Reset selected keywords when navigating between sections
  useEffect(() => {
    setSelectedKeywords([]);
  }, [section.id]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        if (!section.dataSource) {
          throw new Error(`Section ${section.id} does not have a dataSource defined`);
        }

        // Fetch the data
        const response = await fetch(section.dataSource);
        if (!response.ok) {
          throw new Error(`Failed to fetch data for ${section.id}`);
        }

        let data;
        if (section.dataType === 'bibtex') {
          // Handle BibTeX data
          const bibtexData = await response.text();
          data = convertBibtexToJson(bibtexData);
        } else {
          // Handle JSON data
          data = await response.json();
        }

        // Sort items by date/year if available
        data.sort((a, b) => {
          const dateA = a.date || a.year || '';
          const dateB = b.date || b.year || '';
          return dateB.localeCompare(dateA);
        });

        setItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [section]);

  const fuse = useMemo(() => {
    const options = {
      keys: [
        { name: 'title', weight: 2 },
        { name: 'description', weight: 1 },
        { name: 'authors', weight: 1 },
        { name: 'tags', weight: 1 },
        { name: 'abstract', weight: 1 },
        { name: 'journal', weight: 1 },
        { name: 'booktitle', weight: 1 },
      ],
      threshold: 1,
      includeScore: true,
      ignoreLocation: true,
      minMatchCharLength: 3,
      shouldSort: true,
      findAllMatches: true,
      useExtendedSearch: true,
    };
    return new Fuse(items, options);
  }, [items]);

  // Get filtered items based on search term
  const searchFilteredItems = useMemo(() => {
    if (!searchTerm) return items;
    return fuse.search(searchTerm).map((r) => r.item);
  }, [items, searchTerm, fuse]);

  // Calculate how many selected keywords match the item
  const getKeywordMatchScore = (item, keywords) => {
    if (!item || !keywords || keywords.length === 0) return 0;

    let score = 0;
    const fieldConfigs = Array.isArray(section.overviewVisualization?.sourceFields)
      ? section.overviewVisualization?.sourceFields
      : [];

    // Extract field names from sourceFields based on structure
    const fields =
      fieldConfigs.length > 0 && typeof fieldConfigs[0] === 'object'
        ? fieldConfigs.map((fc) => fc.field)
        : fieldConfigs.length > 0
          ? fieldConfigs // Handle case where it's still an array of strings
          : ['keywords']; // Default fallback

    fields.forEach((field) => {
      if (item[field]) {
        const itemKeywords = Array.isArray(item[field])
          ? item[field]
          : typeof item[field] === 'string'
            ? item[field].split(',').map((k) => k.trim())
            : [item[field]];

        keywords.forEach((keyword) => {
          if (itemKeywords.some((k) => k.toLowerCase() === keyword.toLowerCase())) {
            score += 1;
          }
        });
      }
    });

    return score;
  };

  // Calculate keyword matches and sort items based on selected keywords
  const filteredItems = useMemo(() => {
    if (selectedKeywords.length === 0) return searchFilteredItems;

    return [...searchFilteredItems].sort((a, b) => {
      const scoreA = getKeywordMatchScore(a, selectedKeywords);
      const scoreB = getKeywordMatchScore(b, selectedKeywords);
      return scoreB - scoreA; // Sort by highest score first
    });
  }, [searchFilteredItems, selectedKeywords, section]);

  const handleKeywordClick = (keyword) => {
    if (keyword === '__clear_all__') {
      setSelectedKeywords([]);
      return;
    }

    setSelectedKeywords((prev) => {
      const newKeywords = prev.includes(keyword)
        ? prev.filter((k) => k !== keyword)
        : [...prev, keyword];

      // Debug logs
      console.log('Selected Keywords Updated:', newKeywords);
      return newKeywords;
    });
  };

  // Check if keyword cloud should be displayed
  const showKeywordCloud =
    section.overviewVisualization?.type === 'KeywordCloud' &&
    section.overviewVisualization?.enabled === true;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const Component = viewMode === 'grid' ? GenericCard : GenericListItem;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">
        {section.title || section.sectionHeading || section.id}
      </h1>
      <div
        className="text-gray-900 mb-8"
        dangerouslySetInnerHTML={{ __html: section.description || '' }}
      ></div>

      <p>
        <span className="font-bold">Total: </span>
        {items.length}
      </p>

      {/* Keyword Cloud Visualization */}
      {showKeywordCloud && (
        <div className="mb-6">
          <KeywordCloud
            items={items}
            sourceFields={
              // Convert old sourceFields format to new object format
              Array.isArray(section.overviewVisualization.sourceFields) &&
              typeof section.overviewVisualization.sourceFields[0] === 'string'
                ? section.overviewVisualization.sourceFields.map((field) => ({
                    field,
                    label: section.overviewVisualization.sourceFieldLabels?.[field] || field,
                    tagSet: section.overviewVisualization.sourceFieldTagSets?.[field] || null,
                  }))
                : section.overviewVisualization.sourceFields
            }
            selectedKeywords={selectedKeywords}
            onKeywordClick={handleKeywordClick}
            section={section}
            globalConfig={config}
          />
        </div>
      )}

      <ContentControls
        contentType={section.id}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onClearSearch={() => setSearchTerm('')}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {viewMode === 'grid' ? (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Component
                  item={item}
                  contentType={section.id}
                  config={config}
                  selectedKeywords={selectedKeywords}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          layout
          className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col gap-2"
        >
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Component
                  item={item}
                  contentType={section.id}
                  config={config}
                  selectedKeywords={selectedKeywords}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

const ContentDetails = ({ config, section }) => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        if (!section.dataSource) {
          throw new Error(`Section ${section.id} does not have a dataSource defined`);
        }

        // Fetch the data
        const response = await fetch(section.dataSource);
        if (!response.ok) {
          throw new Error(`Failed to fetch data for ${section.id}`);
        }

        let data;
        if (section.dataType === 'bibtex') {
          // Handle BibTeX data
          const bibtexData = await response.text();
          data = convertBibtexToJson(bibtexData);
        } else {
          // Handle JSON data
          data = await response.json();
        }

        const foundItem = data.find((i) => i.id === id);

        if (!foundItem) {
          throw new Error(`Item with ID ${id} not found`);
        }
        setItem(foundItem);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [section, id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <GenericItemDetails item={item} contentType={section.id} config={config} />
    </div>
  );
};

GenericContentPage.propTypes = {
  config: PropTypes.object.isRequired,
  section: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    sectionHeading: PropTypes.string,
    description: PropTypes.string,
    dataSource: PropTypes.string.isRequired,
    dataType: PropTypes.oneOf(['json', 'bibtex']),
    overviewVisualization: PropTypes.shape({
      type: PropTypes.string,
      enabled: PropTypes.bool,
      sourceFields: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.arrayOf(
          PropTypes.shape({
            field: PropTypes.string.isRequired,
            label: PropTypes.string,
            tagSet: PropTypes.string,
          }),
        ),
      ]),
      sourceFieldLabels: PropTypes.object,
      sourceFieldTagSets: PropTypes.object,
      fontSizes: PropTypes.shape({
        min: PropTypes.number,
        max: PropTypes.number,
      }),
      maxVisibleKeywords: PropTypes.number,
    }),
  }).isRequired,
};

ContentDetails.propTypes = {
  config: PropTypes.object.isRequired,
  section: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    sectionHeading: PropTypes.string,
    description: PropTypes.string,
    dataSource: PropTypes.string.isRequired,
    dataType: PropTypes.oneOf(['json', 'bibtex']),
  }).isRequired,
};

export { GenericContentPage, ContentDetails };
