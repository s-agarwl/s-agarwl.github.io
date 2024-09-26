import React, { useState, useMemo } from 'react';
import PublicationCard from './PublicationCard';
import { motion, AnimatePresence } from 'framer-motion';
import Fuse from 'fuse.js';
import { XCircleIcon } from '@heroicons/react/24/solid';

const AllPublications = ({ entries, config }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const fuse = useMemo(() => {
    const options = {
      keys: [
        'entryTags.title',
        'entryTags.author',
        'entryTags.booktitle',
        'entryTags.journal',
        'entryTags.abstract',
      ],
      threshold: 0.4,
      includeScore: true,
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

    if (typeFilter) {
      result = result.filter((entry) => entry.entryType === typeFilter);
    }

    return result;
  }, [entries, searchTerm, yearFilter, typeFilter, fuse]);

  const years = useMemo(() => {
    return [...new Set(entries.map((entry) => entry.entryTags.year))].sort().reverse();
  }, [entries]);

  const types = useMemo(() => {
    return [...new Set(entries.map((entry) => entry.entryType))];
  }, [entries]);

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">My Publications</h2>
      <p className="mb-6">{config.specialSections.allPublications.content}</p>
      <p className="mb-6">
        <b>Total Publications:</b> {entries.length}
      </p>
      <div className="mb-6 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:space-x-4">
        <div className="relative flex-grow">
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
    </div>
  );
};

export default AllPublications;
