import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import FieldRenderer from './templates/fields/FieldRenderer';
import { findSectionById } from '../utils/sectionUtils';
import { fieldHasValue, getFieldValue, itemContainsSelectedKeywords } from '../utils/fieldUtils';

const GenericListItem = ({ item, contentType, config, selectedKeywords = [] }) => {
  const navigate = useNavigate();

  // Find the section by contentType
  const section = findSectionById(config.sections, contentType);

  // Get list display configuration from config
  const listConfig = section?.display?.list;

  // Get sourceFields from section configuration
  const sourceFields = section?.overviewVisualization?.sourceFields || [];

  const handleItemClick = (e) => {
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

  // Convert component to typeOfField for backward compatibility
  const getUpdatedFields = () => {
    if (!listConfig || !listConfig.fields) {
      return [];
    }

    return listConfig.fields.map((field) => ({
      ...field,
      typeOfField: field.typeOfField || field.component, // Use typeOfField if exists, fallback to component
    }));
  };

  const listFields = getUpdatedFields();
  const hasImage = item.image && listConfig?.showImage !== false;

  const renderContent = () => {
    if (!listFields.length) {
      // Fallback for missing configuration
      return (
        <>
          <h3 className="text-base font-semibold text-gray-700 truncate mb-0.5 mt-1">
            {item.title}
          </h3>
          <p className="text-gray-600 truncate m-0">{item.description}</p>
        </>
      );
    }

    return (
      <>
        {listFields.map((fieldConfig, index) => {
          // Get the field value using utility function
          const fieldValue = getFieldValue(item, fieldConfig.field);

          // Skip fields that don't have meaningful values
          if (!fieldHasValue(fieldValue)) return null;

          // Pass selectedKeywords to tag fields
          const additionalProps = fieldConfig.typeOfField === 'Tags' ? { selectedKeywords } : {};

          // Note: FieldRenderer will extract and utilize properties like 'heading', 'label',
          // 'typeOfField', 'tagSet', etc. from the fieldConfig object
          return (
            <FieldRenderer
              key={index}
              component={fieldConfig.typeOfField} // For backward compatibility
              field={fieldConfig.field}
              value={fieldValue}
              config={fieldConfig}
              item={item}
              globalConfig={config}
              viewType="list"
              {...additionalProps}
            />
          );
        })}
      </>
    );
  };

  return (
    <div
      onClick={handleItemClick}
      className={`border-b border-gray-200 py-2 px-3 hover:bg-gray-50 cursor-pointer ${
        itemContainsSelectedKeywords(item, listFields, selectedKeywords, sourceFields)
          ? 'highlighted-list-item'
          : ''
      }`}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          {hasImage && (
            <div className="hidden sm:block flex-shrink-0">
              <img
                src={item.image}
                alt={item.title}
                className="h-12 w-12 object-cover rounded-md shadow-sm"
              />
            </div>
          )}

          <div className="flex-grow min-w-0 ml-1">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

GenericListItem.propTypes = {
  item: PropTypes.object.isRequired,
  contentType: PropTypes.string.isRequired,
  config: PropTypes.object.isRequired,
  selectedKeywords: PropTypes.arrayOf(PropTypes.string),
};

export default GenericListItem;
