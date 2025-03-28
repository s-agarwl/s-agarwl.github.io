import PropTypes from 'prop-types';
import { removeLatexBraces } from '/src/utils/authorUtils';

const Text = ({ value, label, className = '', styleVariant, viewType = 'detail' }) => {
  if (!value) return null;

  const cleanValue = typeof value === 'string' ? removeLatexBraces(value) : value;

  // Get the appropriate class name
  const getClassName = () => {
    if (className) return className;
    if (styleVariant) return styleVariant;

    // Use different default styles based on viewType if no styleVariant
    if (viewType === 'list') return 'text-gray-600 text-sm mb-0.5';
    if (viewType === 'card') return 'text-gray-600 text-sm mb-1';
    return 'text-theme-light mb-4'; // Default for detail view
  };

  const textClass = getClassName();

  if (label) {
    return (
      <p className={textClass}>
        <b>{label}:</b> {cleanValue}
      </p>
    );
  }

  return <p className={textClass}>{cleanValue}</p>;
};

Text.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  label: PropTypes.string,
  className: PropTypes.string,
  styleVariant: PropTypes.string,
  viewType: PropTypes.oneOf(['list', 'card', 'detail']),
};

export default Text;
