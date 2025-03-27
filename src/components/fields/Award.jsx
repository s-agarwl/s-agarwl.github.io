import PropTypes from 'prop-types';
import { TrophyIcon } from '@heroicons/react/24/solid';

const Award = ({ value, className = '', styleVariant, viewType }) => {
  if (!value) return null;

  // Get appropriate class based on variant or use default
  const getAwardClass = () => {
    // Default style
    let awardClass =
      'mt-1 inline-flex items-center text-white bg-blue-600 rounded-md px-4 py-0.5 mb-2 text-xs';

    // If explicit className is provided, use it
    if (className) {
      return className;
    }

    // If styleVariant is provided
    if (styleVariant) {
      // If styleVariant is an object with variants property
      if (typeof styleVariant === 'object' && styleVariant.variants && viewType) {
        return styleVariant.variants[viewType] || styleVariant.default;
      }
      // If styleVariant is a direct string (already processed by FieldRenderer)
      return styleVariant;
    }

    return awardClass;
  };

  return (
    <div className={getAwardClass()}>
      <TrophyIcon className="h-3 w-3 mr-0.5" />
      <span>{value}</span>
    </div>
  );
};

Award.propTypes = {
  value: PropTypes.string,
  className: PropTypes.string,
  styleVariant: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      default: PropTypes.string,
      variants: PropTypes.object,
    }),
  ]),
  viewType: PropTypes.string,
};

export default Award;
