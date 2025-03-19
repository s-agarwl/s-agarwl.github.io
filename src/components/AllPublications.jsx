import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import PublicationCard from './PublicationCard';
import PublicationListItem from './PublicationListItem';
import { motion, AnimatePresence } from 'framer-motion';
import Fuse from 'fuse.js';
import { XCircleIcon } from '@heroicons/react/24/solid';
import { Switch } from '@headlessui/react';
import { FaThLarge, FaList } from 'react-icons/fa';

const AllPublications = ({ entries, config }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  // const [typeFilter, setTypeFilter] = useState(''); // For future use when type filtering is enabled
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const fuse = useMemo(() => {
    const options = {
      keys: [
        { name: 'entryTags.title', weight: 2 },
        { name: 'entryTags.abstract', weight: 1 },
        { name: 'entryTags.author', weight: 1 },
        { name: 'entryTags.booktitle', weight: 1 },
        { name: 'entryTags.journal', weight: 1 },
        { name: 'entryTags.awards', weight: 1 },
      ],
      threshold: 1,
      includeScore: true,
      ignoreLocation: true,
      minMatchCharLength: 3,
      shouldSort: true,
      findAllMatches: true,
      useExtendedSearch: true,
    };
    return new Fuse(entries, options);
  }, [entries]);

  const filteredEntries = useMemo(() => {
    let result = entries;

    if (searchTerm) {
      result = fuse.search(searchTerm).map((r) => r.item);
    }

    if (yearFilter) {
      result = result.filter((entry) => entry.entryTags.year === yearFilter);
    }

    // if (typeFilter) {
    //   result = result.filter((entry) => entry.entryType === typeFilter);
    // }

    return result;
  }, [entries, searchTerm, yearFilter, fuse]);

  const years = useMemo(() => {
    return [...new Set(entries.map((entry) => entry.entryTags.year))].sort().reverse();
  }, [entries]);

  // const types = useMemo(() => {
  //   return [...new Set(entries.map((entry) => entry.entryType))];
  // }, [entries]); // For future use when type filtering is enabled

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">My Publications</h2>
      <p className="mb-6">{config.sections.Publications.content}</p>
      <p className="mb-6">
        <b>Total Publications:</b> {entries.length}
      </p>

      <div className="mb-8 flex flex-wrap items-center justify-between space-y-4 sm:space-y-0">
        <div className="w-full sm:w-auto flex-grow flex flex-wrap items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative w-full sm:w-auto flex-grow">
            <input
              type="text"
              placeholder="Search publications..."
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
          {/* <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select> */}
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
              className={`${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              } relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-l-md border border-gray-300 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <div className="relative group">
                <FaThLarge className="h-5 w-5" />
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Grid View
                </div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              } relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-r-md border border-gray-300 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <div className="relative group">
                <FaList className="h-5 w-5" />
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Compact View
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredEntries.map((entry) => (
              <motion.div
                key={entry.citationKey}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <PublicationCard entry={entry} config={config} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div layout className="bg-white rounded-lg shadow-sm border border-gray-200">
          <AnimatePresence>
            {filteredEntries.map((entry) => (
              <motion.div
                key={entry.citationKey}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <PublicationListItem entry={entry} config={config} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

AllPublications.propTypes = {
  entries: PropTypes.arrayOf(
    PropTypes.shape({
      citationKey: PropTypes.string.isRequired,
      entryType: PropTypes.string.isRequired,
      entryTags: PropTypes.shape({
        title: PropTypes.string.isRequired,
        author: PropTypes.string.isRequired,
        year: PropTypes.string.isRequired,
        abstract: PropTypes.string,
        journal: PropTypes.string,
        booktitle: PropTypes.string,
      }).isRequired,
    }),
  ).isRequired,
  config: PropTypes.shape({
    sections: PropTypes.shape({
      Publications: PropTypes.shape({
        content: PropTypes.string,
      }),
    }),
    researcherName: PropTypes.string,
  }).isRequired,
};

export default AllPublications;
