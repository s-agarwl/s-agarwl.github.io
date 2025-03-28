import PropTypes from 'prop-types';
import { removeLatexBraces } from '/src/utils/authorUtils';

const Heading = ({
  value,
  options = {},
  className = '',
  styleVariant,
  level: propLevel,
  viewType = 'detail',
}) => {
  // Allow level to be set directly as a prop or via options
  const level = propLevel || options.level || 1;
  const cleanValue = typeof value === 'string' ? removeLatexBraces(value) : value;

  const getHeadingClass = () => {
    // If className is explicitly passed, use that over variants
    if (className) return className;

    // If we have a specific style variant string, use it directly
    if (typeof styleVariant === 'string') {
      console.log('Direct string variant:', styleVariant);
      return styleVariant;
    }

    // Parse our complicated styleVariant structure
    if (styleVariant && typeof styleVariant === 'object') {
      // Direct level property (for backward compatibility)
      if (styleVariant[level]) {
        console.log('Direct level property:', styleVariant[level]);
        return styleVariant[level];
      }

      // Check for viewType-specific variant with level
      if (
        styleVariant.variants &&
        styleVariant.variants[viewType] &&
        styleVariant.variants[viewType][level]
      ) {
        console.log(
          `Found variant for viewType=${viewType}, level=${level}:`,
          styleVariant.variants[viewType][level],
        );
        return styleVariant.variants[viewType][level];
      }

      // Check for level in defaults
      if (styleVariant.defaults && styleVariant.defaults[level]) {
        console.log('Found default for level:', styleVariant.defaults[level]);
        return styleVariant.defaults[level];
      }
    }

    // Default fallback styles based on level
    console.log('Using fallback style for level:', level);
    const defaultStyles = {
      1: 'text-3xl font-bold mb-4',
      2: 'text-2xl font-semibold mb-3',
      3: 'text-xl font-semibold mb-2',
      4: 'text-lg font-medium mb-2',
      5: 'text-base font-medium mb-1',
      6: 'text-sm font-medium mb-1',
    };

    return defaultStyles[level] || defaultStyles[1];
  };

  const headingClass = getHeadingClass();

  switch (level) {
    case 1:
      return <h1 className={headingClass}>{cleanValue}</h1>;
    case 2:
      return <h2 className={headingClass}>{cleanValue}</h2>;
    case 3:
      return <h3 className={headingClass}>{cleanValue}</h3>;
    case 4:
      return <h4 className={headingClass}>{cleanValue}</h4>;
    case 5:
      return <h5 className={headingClass}>{cleanValue}</h5>;
    case 6:
      return <h6 className={headingClass}>{cleanValue}</h6>;
    default:
      return <h1 className={headingClass}>{cleanValue}</h1>;
  }
};

Heading.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  options: PropTypes.shape({
    level: PropTypes.number,
  }),
  level: PropTypes.number,
  viewType: PropTypes.string,
  className: PropTypes.string,
  styleVariant: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default Heading;
