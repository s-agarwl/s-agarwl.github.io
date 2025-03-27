import PropTypes from 'prop-types';

const Tags = ({ value, heading, className = '', styleVariant, viewType = 'detail' }) => {
  if (!value) return null;

  const tags = Array.isArray(value)
    ? value
    : typeof value === 'string'
      ? value.split(', ')
      : [value];

  // Get styles from variants or defaults
  const getStyles = () => {
    // Container style
    let containerClass = 'flex flex-wrap gap-2 mb-4'; // Default
    let tagClass = 'px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-xs'; // Default

    // Apply view-specific default styles if no explicit styles provided
    if (viewType === 'list') {
      containerClass = 'flex flex-wrap gap-1 mb-0.5';
      tagClass = 'px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs';
    } else if (viewType === 'card') {
      containerClass = 'flex flex-wrap gap-1.5 mb-1';
      tagClass = 'px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs';
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

    return { containerClass, tagClass };
  };

  const { containerClass, tagClass } = getStyles();

  return (
    <div className={viewType === 'detail' ? 'mb-4' : 'mb-0'}>
      {heading && <h3 className="text-lg font-medium mb-1">{heading}</h3>}
      <div className={containerClass}>
        {tags.map((tag, index) => (
          <span key={index} className={tagClass}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

Tags.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
  heading: PropTypes.string,
  className: PropTypes.string,
  viewType: PropTypes.oneOf(['list', 'card', 'detail']),
  styleVariant: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      container: PropTypes.string,
      tag: PropTypes.string,
    }),
  ]),
};

export default Tags;
