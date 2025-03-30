import PropTypes from 'prop-types';
import componentStyles from '/src/styles/componentStyles';

const LinkButtons = ({ value, label, className = '', styleVariant, viewType = 'detail' }) => {
  if (!value || Object.keys(value).length === 0) return null;

  // Get appropriate classes based on viewType and styleVariant
  const getStyles = () => {
    // Container class
    let containerClass = 'mb-4';
    // Button class
    let buttonClass = '';
    // Label class
    let labelClass = componentStyles.LinkButtons.label.default;

    // Apply different defaults based on viewType
    if (viewType === 'list') {
      containerClass = 'mb-0.5';
      buttonClass =
        'text-blue-600 hover:text-blue-800 inline-flex items-center bg-blue-50 hover:bg-blue-100 rounded px-2 py-0.5 text-xs';
      labelClass = componentStyles.LinkButtons.label.list;
    } else if (viewType === 'card') {
      containerClass = 'mb-1';
      buttonClass =
        'text-blue-600 hover:text-blue-800 inline-flex items-center bg-blue-50 hover:bg-blue-100 rounded px-2 py-0.5 text-sm';
      labelClass = componentStyles.LinkButtons.label.card;
    } else if (viewType === 'detail') {
      containerClass = 'mb-4';
      buttonClass = '';
      labelClass = componentStyles.LinkButtons.label.detail;
    }

    // If styleVariant is provided
    if (styleVariant) {
      if (typeof styleVariant === 'object') {
        // containerClass = styleVariant.container || containerClass;
        buttonClass = styleVariant.button || buttonClass;
      } else if (typeof styleVariant === 'string') {
        // containerClass = styleVariant;
      }
    }

    return { containerClass, buttonClass, labelClass };
  };

  const { containerClass, buttonClass, labelClass } = getStyles();

  return (
    <div className={containerClass}>
      {label && <h2 className={labelClass}>{label}</h2>}
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
  label: PropTypes.string,
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
