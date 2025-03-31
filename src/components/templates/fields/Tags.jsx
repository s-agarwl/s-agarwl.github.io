import PropTypes from 'prop-types';
import componentStyles from '/src/styles/componentStyles';
import '/src/styles/generalStyles.css';
import { getTagConfig, applyTagColors, getTagDisplayText } from '/src/utils/tagUtils';

const Tags = ({
  value,
  label,
  className = '',
  styleVariant,
  viewType = 'detail',
  config = {},
  tagSet,
  selectedKeywords = [],
}) => {
  if (!value) return null;

  const tags = Array.isArray(value)
    ? value
    : typeof value === 'string'
      ? value.split(', ')
      : [value];

  // Get styles from variants or defaults
  const getStyles = () => {
    // Container style
    let containerClass = 'flex flex-wrap gap-2 mb-2'; // Default
    let tagClass = 'px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-xs'; // Default
    let labelClass = componentStyles.Tags.label.default; // Default label style

    // Apply view-specific default styles if no explicit styles provided
    if (viewType === 'list') {
      containerClass = 'flex flex-wrap gap-1 mb-0.5';
      tagClass = 'px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs';
      labelClass = componentStyles.Tags.label.list;
    } else if (viewType === 'card') {
      containerClass = 'flex flex-wrap gap-1.5 mb-1';
      tagClass = 'px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs';
      labelClass = componentStyles.Tags.label.card;
    } else if (viewType === 'detail') {
      labelClass = componentStyles.Tags.label.detail;
    }

    // If explicit className is passed, it overrides container style
    if (className) {
      containerClass = className;
    }
    // If variant is passed
    else if (styleVariant) {
      if (typeof styleVariant === 'object') {
        containerClass = styleVariant.container || containerClass;
        tagClass = styleVariant.tag || tagClass;
      } else if (typeof styleVariant === 'string') {
        containerClass = styleVariant;
      }
    }

    return { containerClass, tagClass, labelClass };
  };

  const { containerClass, tagClass, labelClass } = getStyles();

  // Helper to get the styled tag class based on tag configuration
  const getTagClass = (tag) => {
    // Start with the default tag class
    let result = tagClass;

    // If we have a tag set configuration for this tag, apply it
    const tagConfig = getTagConfig(tag, tagSet, config);
    if (tagConfig) {
      result = applyTagColors(result, tagConfig);
    }

    // Debug log to see what's being compared
    console.log('Tag:', tag);
    console.log('Selected Keywords:', selectedKeywords);

    // Check if the tag is in the selected keywords (case-insensitive)
    const isSelected = selectedKeywords.some(
      (keyword) => keyword.toLowerCase() === tag.toLowerCase(),
    );

    console.log('Is Selected?', isSelected);

    // Add highlighted border class if tag is in selectedKeywords
    if (isSelected) {
      result += ' selectedKeywords';
    }

    return result;
  };

  const renderTagContent = () => (
    <div className={containerClass}>
      {tags.map((tag, index) => {
        const tagConfig = getTagConfig(tag, tagSet, config);
        const displayText = getTagDisplayText(tag, tagConfig);

        return (
          <span
            key={index}
            className={getTagClass(tag)}
            title={
              tagSet && !tagConfig ? `Tag '${tag}' not found in tagSet '${tagSet}'` : undefined
            }
          >
            {displayText}
          </span>
        );
      })}
    </div>
  );

  return (
    <div
      className={`mr-1 ${viewType === 'detail' ? 'mb-4' : 'mb-0'} ${tagSet ? 'inline mr-1' : ''}`}
    >
      {label ? (
        <div>
          <span className={labelClass}>{label}:</span> {renderTagContent()}
        </div>
      ) : (
        renderTagContent()
      )}
    </div>
  );
};

Tags.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
  label: PropTypes.string,
  className: PropTypes.string,
  viewType: PropTypes.oneOf(['list', 'card', 'detail']),
  styleVariant: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      container: PropTypes.string,
      tag: PropTypes.string,
    }),
  ]),
  config: PropTypes.object,
  tagSet: PropTypes.string,
  selectedKeywords: PropTypes.arrayOf(PropTypes.string),
};

export default Tags;
