import { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import GenericCard from './GenericCard';
import GenericListItem from './GenericListItem';
import { motion, AnimatePresence } from 'framer-motion';
import Fuse from 'fuse.js';
import { XCircleIcon } from '@heroicons/react/24/solid';
import { FaThLarge, FaList } from 'react-icons/fa';

const GenericContentPage = ({ items, contentType, config, pageTitle, pageDescription }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem(`${contentType}ViewMode`) || 'grid';
  });

  // Update localStorage when viewMode changes
  useEffect(() => {
    localStorage.setItem(`${contentType}ViewMode`, viewMode);
  }, [viewMode, contentType]);

  // Define search keys based on content type
  const getSearchKeys = () => {
    const baseKeys = [
      { name: 'title', weight: 2 },
      { name: 'description', weight: 1 },
      { name: 'awards', weight: 1 },
    ];

    // Add content type specific keys
    if (['publications', 'projects', 'talks'].includes(contentType)) {
      baseKeys.push({ name: 'authors', weight: 1 });
    }

    if (contentType === 'talks') {
      baseKeys.push({ name: 'venue', weight: 1 });
    }

    if (contentType === 'teaching') {
      baseKeys.push({ name: 'institution', weight: 1 });
      baseKeys.push({ name: 'course', weight: 1 });
    }

    return baseKeys;
  };

  const fuse = useMemo(() => {
    const options = {
      keys: getSearchKeys(),
      threshold: 1,
      includeScore: true,
      ignoreLocation: true,
      minMatchCharLength: 3,
      shouldSort: true,
      findAllMatches: true,
      useExtendedSearch: true,
    };
    return new Fuse(items, options);
  }, [items, contentType]);

  const filteredItems = useMemo(() => {
    let result = items;

    if (searchTerm) {
      result = fuse.search(searchTerm).map((r) => r.item);
    }

    if (yearFilter) {
      result = result.filter((item) => {
        // Check both year and date fields
        if (item.year) {
          return item.year === yearFilter;
        }
        if (item.date) {
          // Extract year from date string
          const dateYear = item.date.split('-')[0];
          return dateYear === yearFilter;
        }
        return false;
      });
    }

    return result;
  }, [items, searchTerm, yearFilter, fuse]);

  // Get all years from items
  const years = useMemo(() => {
    const yearsSet = new Set();

    items.forEach((item) => {
      if (item.year) {
        yearsSet.add(item.year);
      }
      if (item.date && item.date.includes('-')) {
        // Extract year from date (assuming format YYYY-MM-DD or similar)
        const year = item.date.split('-')[0];
        if (year.length === 4 && !isNaN(parseInt(year))) {
          yearsSet.add(year);
        }
      }
    });

    return [...yearsSet].sort().reverse();
  }, [items]);

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">{pageTitle}</h2>
      <p className="mb-6">{pageDescription}</p>
      <p className="mb-6">
        <b>Total {pageTitle}:</b> {items.length}
      </p>

      <div className="mb-8 flex flex-wrap items-center justify-between space-y-4 sm:space-y-0">
        <div className="w-full sm:w-auto flex-grow flex flex-wrap items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative w-full sm:w-auto flex-grow">
            <input
              type="text"
              placeholder={`Search ${contentType}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon className="h-5 w-5" />
              </button>
            )}
          </div>

          {years.length > 0 && (
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Years</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex items-center justify-end w-full sm:w-auto ml-4">
          <div
            className="inline-flex items-center rounded-md shadow-sm"
            role="group"
            aria-label="View mode"
          >
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              aria-label="Grid View"
              className={`${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              } tooltip-container relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-l-md border border-gray-300 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <FaThLarge className="h-5 w-5" />
              <span className="tooltip">Grid View</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              aria-label="Compact View"
              className={`${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              } tooltip-container relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-r-md border border-gray-300 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <FaList className="h-5 w-5" />
              <span className="tooltip">Compact View</span>
            </button>
          </div>
        </div>
      </div>

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
                <GenericCard item={item} contentType={contentType} config={config} />
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
                <GenericListItem item={item} contentType={contentType} config={config} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

GenericContentPage.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  contentType: PropTypes.string.isRequired,
  config: PropTypes.object.isRequired,
  pageTitle: PropTypes.string.isRequired,
  pageDescription: PropTypes.string,
};

export default GenericContentPage;
