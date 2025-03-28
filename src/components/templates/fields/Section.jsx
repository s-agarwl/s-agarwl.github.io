import PropTypes from 'prop-types';

const Section = ({ value, heading, className = '', viewType = 'detail', styleVariant }) => {
  if (!value) return null;

  // Get appropriate class name based on viewType
  const getContainerClass = () => {
    if (className) return className;
    if (styleVariant) return styleVariant;

    // Different margins based on viewType
    if (viewType === 'list') return 'mb-0.5';
    if (viewType === 'card') return 'mb-1';
    return 'mb-4'; // default for detail view
  };

  const containerClass = getContainerClass();

  return (
    <div className={containerClass}>
      <h3 className="text-lg font-medium mb-1">{heading}</h3>
      <p>{value}</p>
    </div>
  );
};

Section.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  heading: PropTypes.string.isRequired,
  className: PropTypes.string,
  styleVariant: PropTypes.string,
  viewType: PropTypes.oneOf(['list', 'card', 'detail']),
};

export default Section;
