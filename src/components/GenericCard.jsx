import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { TrophyIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { renderAuthors, removeLatexBraces } from '../utils/authorUtils.jsx';
import PublicationLinks from './PublicationLinks.jsx';

const GenericCard = ({ item, contentType, config }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const yourName = config?.researcherName || '';

  const handleCardClick = (e) => {
    // Prevent navigation if the user was dragging
    if (e.target.closest('.cursor-grabbing')) return;
    navigate(`/${contentType}/${item.id}`);
  };

  const truncateText = (text, wordLimit) => {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return text;
  };

  const renderExpandableText = (text, wordLimit, label = '') => {
    if (!text) return null;
    const isLong = text.split(' ').length > wordLimit;
    return (
      <div className="text-sm text-gray-700 mt-2 ">
        {label && <span className="font-semibold">{label}: </span>}
        {isExpanded ? text : truncateText(text, wordLimit)}
        {isLong && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="text-blue-500 hover:text-blue-700 ml-2"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
    );
  };

  const renderMetadata = (fields) => {
    return fields.map((field, index) => {
      if (!item[field.key]) return null;

      // Special handling for authors field
      if (field.key === 'authors') {
        return (
          <p key={index} className="text-sm text-gray-600 mb-1">
            {field.label}: {renderAuthors(item[field.key], yourName)}
          </p>
        );
      }

      return (
        <p key={index} className="text-sm text-gray-600 mb-1">
          {field.label}:{' '}
          {Array.isArray(item[field.key]) ? item[field.key].join(', ') : item[field.key]}
        </p>
      );
    });
  };

  const renderTags = (tags, className = '') => {
    if (!tags) return null;
    return (
      <div className={`flex flex-wrap gap-2 mt-4 ${className}`}>
        {(Array.isArray(tags) ? tags : tags.split(', ')).map((tag, index) => (
          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-900 rounded-md text-xs">
            {tag}
          </span>
        ))}
      </div>
    );
  };

  const renderAward = (award) => {
    if (!award) return null;
    return (
      <div className="inline-flex text-sm text-white bg-blue-600 rounded-md px-2 py-1 opacity-90 mt-2 w-fit">
        <TrophyIcon className="h-4 w-4 mr-1" />
        <span>{award}</span>
      </div>
    );
  };

  const contentConfig = {
    publications: {
      metadata: [
        { key: 'authors', label: 'Authors' },
        { key: 'year', label: 'Year' },
      ],
      description: { key: 'abstract', label: 'Abstract', limit: 'abstractPreviewLength' },
      tags: 'keywords',
      award: 'awards',
    },
    projects: {
      metadata: [],
      description: { key: 'description', label: '', limit: 'descriptionPreviewLength' },
      tags: 'technologies',
      award: null,
    },
    talks: {
      metadata: [
        { key: 'date', label: 'Date' },
        { key: 'venue', label: 'Venue' },
      ],
      description: { key: 'description', label: '', limit: 'descriptionPreviewLength' },
      tags: null,
      award: null,
    },
    teaching: {
      metadata: [
        { key: 'institution', label: 'Institution' },
        { key: 'period', label: 'Period' },
      ],
      description: { key: 'description', label: '', limit: 'descriptionPreviewLength' },
      tags: null,
      award: null,
    },
    blog: {
      metadata: [{ key: 'date', label: 'Date' }],
      description: { key: 'description', label: '', limit: 'descriptionPreviewLength' },
      tags: 'tags',
      award: null,
    },
  };

  const contentTypeConfig = contentConfig[contentType] || {
    metadata: [],
    description: { key: 'description', label: '', limit: 'descriptionPreviewLength' },
    tags: null,
    award: null,
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
    >
      {item.image && (
        <div className="relative h-48 overflow-hidden">
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-4 flex flex-col">
        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {removeLatexBraces(item.title)}
          </h3>
          {/* {item.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
          )} */}
          {renderMetadata(contentTypeConfig.metadata)}
          {contentType === 'publications' && <PublicationLinks entryTags={item} showText={false} />}
          {renderExpandableText(
            item[contentTypeConfig.description.key],
            config[contentTypeConfig.description.limit] || 10,
            contentTypeConfig.description.label,
          )}
        </div>
        {renderTags(item[contentTypeConfig.tags])}
        {renderAward(item[contentTypeConfig.award])}
      </div>
    </div>
  );
};

GenericCard.propTypes = {
  item: PropTypes.object.isRequired,
  contentType: PropTypes.string.isRequired,
  config: PropTypes.object.isRequired,
};

export default GenericCard;
