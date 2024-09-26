import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicationLinks from './PublicationLinks';
import { TrophyIcon } from '@heroicons/react/24/solid'; // Import the award icon

// Configurable word limit for abstract
const ABSTRACT_WORD_LIMIT = 10;

const PublicationCard = ({ entry, config }) => {
  const yourName = config?.researcherName || '';
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleCardClick = (e) => {
    // Prevent navigation if the user was dragging
    if (e.target.closest('.cursor-grabbing')) return;
    navigate(`/publication/${entry.citationKey}`);
  };

  const handleLinkClick = (e) => {
    e.stopPropagation();
  };

  const truncateAbstract = (text, wordLimit) => {
    const words = text.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return text;
  };

  const toggleAbstract = () => {
    setIsExpanded(!isExpanded);
  };

  const renderAuthors = (authors) => {
    return authors.split(', ').map((author, index) => (
      <span key={index} className={author === yourName ? 'underline' : ''}>
        {author}
        {index < authors.split(', ').length - 1 && ', '}
      </span>
    ));
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg relative cursor-pointer w-full h-full"
    >
      {entry.entryTags.image && (
        <img
          src={entry.entryTags.image}
          alt={entry.entryTags.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4 pt-2 flex flex-col h-full pb-10">
        <h3 className="text-xl font-semibold mb-2 mt-2 text-gray-700">{entry.entryTags.title}</h3>
        <p className="text-sm text-gray-600 mb-1">
          Authors: {renderAuthors(entry.entryTags.author)}
        </p>
        <p className="text-sm text-gray-600 mb-1">Year: {entry.entryTags.year}</p>
        <PublicationLinks entryTags={entry.entryTags} />
        {entry.entryTags.abstract && (
          <div className="text-sm text-gray-700 mt-2 flex-grow">
            <span className="font-semibold">Abstract:</span>{' '}
            {isExpanded
              ? entry.entryTags.abstract
              : truncateAbstract(entry.entryTags.abstract, ABSTRACT_WORD_LIMIT)}
            {entry.entryTags.abstract.split(' ').length > ABSTRACT_WORD_LIMIT && (
              <button onClick={toggleAbstract} className="text-blue-500 hover:text-blue-700 ml-2">
                {isExpanded ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add award information if present */}
      {entry.entryTags.awards && (
        <div className="absolute bottom-2 left-2 flex items-center text-sm text-white bg-blue-600 rounded-md px-2 py-1 opacity-90">
          <TrophyIcon className="h-5 w-5 mr-1" />
          <span>{entry.entryTags.awards}</span>
        </div>
      )}
    </div>
  );
};

PublicationCard.propTypes = {
  entry: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
};

export default PublicationCard;
