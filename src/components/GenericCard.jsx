import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { removeLatexBraces } from '../utils/authorUtils.jsx';
import PublicationLinks from './PublicationLinks.jsx';
import FieldRenderer from './fields/FieldRenderer';
import { findSectionById } from '../utils/sectionUtils';

const GenericCard = ({ item, contentType, config }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  // Find the section by contentType
  const section = findSectionById(config.sections, contentType);

  // Get card display configuration from config
  const cardConfig = section?.display?.card;

  const handleCardClick = (e) => {
    // Prevent navigation if the user was dragging
    if (e.target.closest('.cursor-grabbing')) return;
    navigate(`/${contentType}/${item.id}`);
  };

  // Use the configuration from config.json if available, otherwise use fallback
  const getCardConfig = () => {
    if (!cardConfig) {
      return {
        metadata: [],
        description: { key: 'description', limit: 'descriptionPreviewLength' },
        tags: null,
        award: null,
      };
    }

    return {
      metadata: cardConfig.metadata || [],
      description: cardConfig.description || {
        key: 'description',
        limit: 'descriptionPreviewLength',
      },
      tags: cardConfig.tags || null,
      award: cardConfig.award || null,
      links: cardConfig.links || false,
    };
  };

  const contentTypeConfig = getCardConfig();

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
    >
      {item.image && (
        <FieldRenderer component="Image" value={item.image} alt={item.title} viewType="card" />
      )}
      <div className="p-4 flex flex-col">
        <div className="flex-grow">
          <FieldRenderer
            component="Heading"
            value={removeLatexBraces(item.title)}
            level={3}
            viewType="card"
          />

          {contentTypeConfig.metadata?.map((field, index) => (
            <FieldRenderer
              key={index}
              component="Text"
              label={field.label}
              value={item[field.key]}
              viewType="card"
            />
          ))}

          {contentTypeConfig.links && contentType.toLowerCase() === 'publications' && (
            <PublicationLinks entryTags={item} showText={false} />
          )}

          {item[contentTypeConfig.description?.key] && (
            <FieldRenderer
              component="ExpandableMarkdown"
              value={item[contentTypeConfig.description.key]}
              label={contentTypeConfig.description.label}
              wordLimit={config[contentTypeConfig.description?.limit] || 30}
              isExpanded={isExpanded}
              setIsExpanded={setIsExpanded}
              viewType="card"
            />
          )}
        </div>

        {contentTypeConfig.tags && item[contentTypeConfig.tags] && (
          <FieldRenderer component="Tags" value={item[contentTypeConfig.tags]} viewType="card" />
        )}

        {contentTypeConfig.award && item[contentTypeConfig.award] && (
          <FieldRenderer component="Award" value={item[contentTypeConfig.award]} viewType="card" />
        )}
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
