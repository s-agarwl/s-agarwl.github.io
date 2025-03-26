import { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import GenericCard from './components/GenericCard';
import GenericListItem from './components/GenericListItem';
import GenericItemDetails from './components/GenericItemDetails';
import ContentControls from './components/ContentControls';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import Fuse from 'fuse.js';
import convertBibtexToJson from './utils/bibtexToJson';
import './styles/markdown.css';

const ContentPage = ({ config, contentType }) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('contentViewMode') || 'grid';
  });

  // Update localStorage when viewMode changes
  useEffect(() => {
    localStorage.setItem('contentViewMode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Find the content type configuration
        const typeConfig = config.contentTypes.find((type) => type.id === contentType);
        if (!typeConfig) {
          throw new Error(`Content type ${contentType} not found in configuration`);
        }

        // Fetch the data
        const response = await fetch(typeConfig.dataSource);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${contentType} data`);
        }

        let data;
        if (typeConfig.dataType === 'bibtex') {
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
  }, [config, contentType]);

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

  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;
    return fuse.search(searchTerm).map((r) => r.item);
  }, [items, searchTerm, fuse]);

  const clearSearch = () => {
    setSearchTerm('');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const typeConfig = config.contentTypes.find((type) => type.id === contentType);
  const Component = viewMode === 'grid' ? GenericCard : GenericListItem;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{typeConfig.title}</h1>
      <p className="text-gray-600 mb-8">{typeConfig.description}</p>

      <p>
        <span className="font-bold">Total: </span>
        {items.length}
      </p>

      <ContentControls
        contentType={contentType}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onClearSearch={clearSearch}
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
                <Component item={item} contentType={contentType} config={config} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div layout className="bg-white rounded-lg shadow-sm border border-gray-200">
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
                <Component item={item} contentType={contentType} config={config} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

const ContentDetails = ({ config, contentType }) => {
  const [item, setItem] = useState(null);
  const [markdownContent, setMarkdownContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Find the content type configuration
        const typeConfig = config.contentTypes.find((type) => type.id === contentType);
        if (!typeConfig) {
          throw new Error(`Content type ${contentType} not found in configuration`);
        }

        // Get the item ID from the URL
        const itemId = window.location.pathname.split('/').pop();

        // Fetch the data
        const response = await fetch(typeConfig.dataSource);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${contentType} data`);
        }

        let data;
        if (typeConfig.dataType === 'bibtex') {
          // Handle BibTeX data
          const bibtexData = await response.text();
          data = convertBibtexToJson(bibtexData);
        } else {
          // Handle JSON data
          data = await response.json();
        }

        const foundItem = data.find((i) => i.id === itemId);

        if (!foundItem) {
          throw new Error(`Item with ID ${itemId} not found`);
        }
        setItem(foundItem);

        // Fetch markdown content if available
        if (typeConfig.markdownTemplate) {
          const markdownPath = typeConfig.markdownTemplate.replace('{id}', itemId);
          try {
            const markdownResponse = await fetch(markdownPath);
            if (markdownResponse.ok) {
              const markdownText = await markdownResponse.text();
              setMarkdownContent(markdownText);
            }
          } catch (markdownError) {
            console.warn('Failed to fetch markdown content:', markdownError);
            // Don't throw error here, just log warning
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [config, contentType]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <GenericItemDetails item={item} contentType={contentType} config={config} />

      {markdownContent && (
        <div className="mt-8">
          <div className="markdown-content">
            <ReactMarkdown>{markdownContent}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

ContentPage.propTypes = {
  config: PropTypes.shape({
    contentTypes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        dataSource: PropTypes.string.isRequired,
        dataType: PropTypes.oneOf(['json', 'bibtex']),
        markdownTemplate: PropTypes.string,
        view: PropTypes.oneOf(['grid', 'list']).isRequired,
      }),
    ).isRequired,
  }).isRequired,
  contentType: PropTypes.string.isRequired,
};

ContentDetails.propTypes = {
  config: PropTypes.shape({
    contentTypes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        dataSource: PropTypes.string.isRequired,
        dataType: PropTypes.oneOf(['json', 'bibtex']),
        markdownTemplate: PropTypes.string,
        view: PropTypes.oneOf(['grid', 'list']).isRequired,
      }),
    ).isRequired,
  }).isRequired,
  contentType: PropTypes.string.isRequired,
};

export { ContentPage, ContentDetails };
