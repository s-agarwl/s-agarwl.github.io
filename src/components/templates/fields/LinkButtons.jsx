import PropTypes from 'prop-types';

const LinkButtons = ({ value, heading, className = '', styleVariant, viewType = 'detail' }) => {
  if (!value || Object.keys(value).length === 0) return null;

  // Get appropriate classes based on viewType and styleVariant
  const getStyles = () => {
    // Container class
    let containerClass = 'mb-4';
    // Button class
    let buttonClass =
      'text-blue-600 hover:text-blue-800 inline-flex items-center bg-blue-50 hover:bg-blue-100 rounded px-3 py-1';

    // Apply different defaults based on viewType
    if (viewType === 'list') {
      containerClass = 'mb-0.5';
      buttonClass =
        'text-blue-600 hover:text-blue-800 inline-flex items-center bg-blue-50 hover:bg-blue-100 rounded px-2 py-0.5 text-xs';
    } else if (viewType === 'card') {
      containerClass = 'mb-1';
      buttonClass =
        'text-blue-600 hover:text-blue-800 inline-flex items-center bg-blue-50 hover:bg-blue-100 rounded px-2 py-0.5 text-sm';
    }

    // If styleVariant is provided
    if (styleVariant) {
      if (typeof styleVariant === 'object') {
        containerClass = styleVariant.container || containerClass;
        buttonClass = styleVariant.button || buttonClass;
      } else if (typeof styleVariant === 'string') {
        containerClass = styleVariant;
      }
    }

    return { containerClass, buttonClass };
  };

  const { containerClass, buttonClass } = getStyles();

  return (
    <div className={containerClass}>
      {heading && (
        <h2
          className={
            viewType === 'detail' ? 'text-xl font-semibold mb-2' : 'text-lg font-medium mb-1'
          }
        >
          {heading}
        </h2>
      )}
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {Object.entries(value).map(([key, url]) => (
          <a key={key} href={url} target="_blank" rel="noopener noreferrer" className={buttonClass}>
            {key}
          </a>
        ))}
      </div>
    </div>
  );
};

LinkButtons.propTypes = {
  value: PropTypes.object,
  heading: PropTypes.string,
  className: PropTypes.string,
  styleVariant: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      container: PropTypes.string,
      button: PropTypes.string,
    }),
  ]),
  viewType: PropTypes.oneOf(['list', 'card', 'detail']),
};

export default LinkButtons;
