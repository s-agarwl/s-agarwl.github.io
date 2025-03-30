import PropTypes from 'prop-types';
import componentStyles from '/src/styles/componentStyles';

const Section = ({ value, label, className = '', viewType = 'detail', styleVariant }) => {
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

  // Get the appropriate label class
  const getLabelClass = () => {
    if (viewType === 'list') return componentStyles.Section.label.list;
    if (viewType === 'card') return componentStyles.Section.label.card;
    return componentStyles.Section.label.detail; // Default for detail view
  };

  const containerClass = getContainerClass();
  const labelClass = getLabelClass();

  return (
    <div className={containerClass}>
      <h3 className={labelClass}>{label}</h3>
      <p>{value}</p>
    </div>
  );
};

Section.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
  styleVariant: PropTypes.string,
  viewType: PropTypes.oneOf(['list', 'card', 'detail']),
};

export default Section;
