import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import PublicationLinks from './PublicationLinks.jsx';
import FieldRenderer from './templates/fields/FieldRenderer';
import { findSectionById } from '../utils/sectionUtils';
import { fieldHasValue, getFieldValue, itemContainsSelectedKeywords } from '../utils/fieldUtils';

const GenericCard = ({ item, contentType, config, selectedKeywords = [] }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  // Find the section by contentType
  const section = findSectionById(config.sections, contentType);

  // Get card display configuration from config
  const cardConfig = section?.display?.card;

  // Get sourceFields from section configuration
  const sourceFields = section?.overviewVisualization?.sourceFields || [];

  const handleCardClick = (e) => {
    // Prevent navigation if the user was dragging
    if (e.target.closest('.cursor-grabbing')) return;
    // Use the section path from config instead of contentType directly
    if (section && section.path) {
      // Remove leading slash if present to avoid double slashes
      const basePath = section.path.endsWith('/') ? section.path.substring(0, -1) : section.path;
      navigate(`${basePath}/${item.id}`);
    } else {
      // Fallback to lowercase contentType if section path is not available
      navigate(`/${contentType.toLowerCase()}/${item.id}`);
    }
  };

  // Get card fields directly from config
  const cardFields = cardConfig?.fields || [];
  const hasImage = item.image && cardConfig?.showImage !== false;

  return (
    <div
      onClick={handleCardClick}
      className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer ${
        itemContainsSelectedKeywords(item, cardFields, selectedKeywords, sourceFields)
          ? 'highlighted-card'
          : ''
      }`}
    >
      {hasImage && (
        <FieldRenderer component="Image" value={item.image} alt={item.title} viewType="card" />
      )}

      <div className="p-4">
        {cardFields.map((fieldConfig, index) => {
          // Get the field value using utility function
          const fieldValue = getFieldValue(item, fieldConfig.field);

          // Skip fields that don't have meaningful values
          if (!fieldHasValue(fieldValue)) return null;

          // Special handling for publications links
          if (fieldConfig.typeOfField === 'PublicationLinks') {
            return contentType.toLowerCase() === 'publications' ? (
              <PublicationLinks key={index} entryTags={item} showText={false} />
            ) : null;
          }

          // Pass selectedKeywords to tag fields
          const additionalProps = fieldConfig.typeOfField === 'Tags' ? { selectedKeywords } : {};

          // Render all fields in the order they appear in configuration
          return (
            <FieldRenderer
              key={index}
              component={fieldConfig.typeOfField}
              field={fieldConfig.field}
              value={fieldValue}
              config={fieldConfig}
              isExpanded={isExpanded}
              setIsExpanded={setIsExpanded}
              globalConfig={config}
              viewType="card"
              researcherName={
                fieldConfig.typeOfField === 'AuthorList' ? config.researcherName : undefined
              }
              {...additionalProps}
            />
          );
        })}
      </div>
    </div>
  );
};

GenericCard.propTypes = {
  item: PropTypes.object.isRequired,
  contentType: PropTypes.string.isRequired,
  config: PropTypes.object.isRequired,
  selectedKeywords: PropTypes.arrayOf(PropTypes.string),
};

export default GenericCard;
