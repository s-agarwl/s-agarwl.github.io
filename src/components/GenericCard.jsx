import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import PublicationLinks from './PublicationLinks.jsx';
import FieldRenderer from './templates/fields/FieldRenderer';
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

  // Check if a field should be displayed based on condition
  const shouldRenderField = (fieldConfig) => {
    if (!fieldConfig.condition) return true;

    // Handle OR conditions
    if (fieldConfig.condition.includes('|')) {
      const conditions = fieldConfig.condition.split('|');
      return conditions.some((condition) => !!item[condition.trim()]);
    }

    // Handle nested path
    if (fieldConfig.condition.includes('.')) {
      const path = fieldConfig.condition.split('.');
      let value = item;
      for (const segment of path) {
        if (!value || !value[segment]) return false;
        value = value[segment];
      }
      return !!value;
    }

    // Simple field check
    return !!item[fieldConfig.condition];
  };

  // Handle the new fields array structure for card, with backward compatibility
  const getCardFields = () => {
    // If the card config already uses the fields array structure, use it directly
    if (cardConfig?.fields) {
      return cardConfig.fields;
    }

    // Otherwise, convert legacy card config to fields array
    const fields = [];

    // Add title as the first field (always present)
    fields.push({
      field: 'title',
      typeOfField: 'Heading',
      options: { level: 3 },
    });

    // Add metadata fields
    if (cardConfig?.metadata) {
      cardConfig.metadata.forEach((meta) => {
        fields.push({
          field: meta.key,
          typeOfField: meta.key === 'authors' ? 'AuthorList' : meta.tagSet ? 'Tags' : 'Text',
          label: meta.label,
          tagSet: meta.tagSet,
        });
      });
    }

    // Add description field
    if (cardConfig?.description) {
      fields.push({
        field: cardConfig.description.key,
        typeOfField: 'ExpandableMarkdown',
        options: { limit: cardConfig.description.limit },
      });
    }

    // Add tags field
    if (cardConfig?.tags) {
      fields.push({
        field: cardConfig.tags,
        typeOfField: 'Tags',
        tagSet: cardConfig.tagSet,
      });
    }

    // Add award field
    if (cardConfig?.award) {
      fields.push({
        field: cardConfig.award,
        typeOfField: 'Award',
      });
    }

    return fields;
  };

  const cardFields = getCardFields();
  const hasImage = item.image && cardConfig?.showImage !== false;

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
    >
      {hasImage && (
        <FieldRenderer component="Image" value={item.image} alt={item.title} viewType="card" />
      )}

      <div className="pl-4 pr-4 pb-1 pt-1 flex flex-col">
        <div className="flex-grow">
          {cardFields.map((fieldConfig, index) => {
            // Skip fields that don't meet their condition
            if (!shouldRenderField(fieldConfig)) return null;

            // Skip tags and awards which go at the bottom
            if (fieldConfig.field === cardConfig?.tags || fieldConfig.field === cardConfig?.award) {
              return null;
            }

            // Special handling for publications links
            if (fieldConfig.typeOfField === 'PublicationLinks') {
              return contentType.toLowerCase() === 'publications' ? (
                <PublicationLinks key={index} entryTags={item} showText={false} />
              ) : null;
            }

            // Handle standard field rendering
            return (
              <FieldRenderer
                key={index}
                // For backward compatibility
                component={fieldConfig.typeOfField}
                field={fieldConfig.field}
                label={fieldConfig.label}
                value={item[fieldConfig.field]}
                tagSet={fieldConfig.tagSet}
                options={fieldConfig.options}
                wordLimit={
                  fieldConfig.options?.limit ? config[fieldConfig.options.limit] : undefined
                }
                isExpanded={isExpanded}
                setIsExpanded={setIsExpanded}
                globalConfig={config}
                viewType="card"
                researcherName={
                  fieldConfig.typeOfField === 'AuthorList' ? config.researcherName : undefined
                }
                config={config}
              />
            );
          })}
        </div>

        {/* Bottom section: tags and award */}
        <div className="mt-2">
          {cardFields
            .filter(
              (fieldConfig) =>
                (fieldConfig.field === cardConfig?.tags ||
                  fieldConfig.field === cardConfig?.award) &&
                shouldRenderField(fieldConfig) &&
                item[fieldConfig.field],
            )
            .map((fieldConfig, index) => (
              <FieldRenderer
                key={`bottom-${index}`}
                component={fieldConfig.typeOfField}
                value={item[fieldConfig.field]}
                viewType="card"
                globalConfig={config}
                tagSet={fieldConfig.tagSet}
              />
            ))}
        </div>
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
