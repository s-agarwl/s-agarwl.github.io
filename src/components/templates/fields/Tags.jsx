import PropTypes from 'prop-types';
import componentStyles from '/src/styles/componentStyles';

const Tags = ({
  value,
  label,
  className = '',
  styleVariant,
  viewType = 'detail',
  config = {},
  tagSet,
}) => {
  if (!value) return null;

  const tags = Array.isArray(value)
    ? value
    : typeof value === 'string'
      ? value.split(', ')
      : [value];

  // Get the tag set configuration if provided
  const getTagConfig = (tagValue) => {
    // If no tagSet specified or config doesn't have tagSets, return null
    if (!tagSet || !config || !config.tagSets || !config.tagSets[tagSet]) {
      return null;
    }

    if (!tagValue) return null;

    // First try exact match
    const tagSetConfig = config.tagSets[tagSet];
    let tagConfig = tagSetConfig[tagValue];

    // If not found, try case-insensitive match
    if (!tagConfig) {
      const tagSetEntries = Object.entries(tagSetConfig);
      const caseInsensitiveMatch = tagSetEntries.find(
        ([key]) => key.toLowerCase() === tagValue.toLowerCase(),
      );

      if (caseInsensitiveMatch) {
        tagConfig = caseInsensitiveMatch[1];
      }
    }

    return tagConfig || null;
  };

  // Define color map for predefined colors
  const colorMap = {
    gray: { bg: 'bg-gray-100', text: 'text-gray-700' },
    red: { bg: 'bg-red-100', text: 'text-red-700' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-700' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-700' },
    yellow: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
    lime: { bg: 'bg-lime-100', text: 'text-lime-700' },
    green: { bg: 'bg-green-100', text: 'text-green-700' },
    emerald: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
    teal: { bg: 'bg-teal-100', text: 'text-teal-700' },
    cyan: { bg: 'bg-cyan-100', text: 'text-cyan-700' },
    sky: { bg: 'bg-sky-100', text: 'text-sky-700' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-700' },
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-700' },
    violet: { bg: 'bg-violet-100', text: 'text-violet-700' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-700' },
    fuchsia: { bg: 'bg-fuchsia-100', text: 'text-fuchsia-700' },
    pink: { bg: 'bg-pink-100', text: 'text-pink-700' },
    rose: { bg: 'bg-rose-100', text: 'text-rose-700' },
  };

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
    const tagConfig = getTagConfig(tag);
    if (tagConfig && tagConfig.color && colorMap[tagConfig.color]) {
      const colorStyles = colorMap[tagConfig.color];
      // Replace default color classes with custom ones
      result = result
        .replace(/bg-[a-z]+-\d+/, colorStyles.bg)
        .replace(/text-[a-z]+-\d+/, colorStyles.text);
    }

    return result;
  };

  const renderTagContent = () => (
    <div className={containerClass}>
      {tags.map((tag, index) => {
        const tagConfig = getTagConfig(tag);
        const displayText = tagConfig && tagConfig.label ? tagConfig.label : tag;

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
    <div className={viewType === 'detail' ? 'mb-4' : 'mb-0'}>
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
};

export default Tags;
