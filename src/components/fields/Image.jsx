import PropTypes from 'prop-types';

const Image = ({ value, alt, className = '', styleVariant, viewType = 'detail' }) => {
  if (!value) return null;

  const getImageClasses = () => {
    // Container class
    let containerClass = 'mb-4';
    // Image class - different defaults based on viewType
    let imageClass;

    if (className) {
      imageClass = className;
    } else {
      // Apply different default styles based on viewType
      if (viewType === 'list') {
        imageClass = 'w-full h-12 object-cover rounded';
      } else if (viewType === 'card') {
        imageClass = 'w-full h-32 object-cover rounded';
      } else {
        imageClass = 'w-3/4 mb-4 mx-auto'; // Default for detail
      }
    }

    // If styleVariant is provided
    if (styleVariant) {
      if (typeof styleVariant === 'object') {
        containerClass = styleVariant.container || containerClass;
        imageClass = styleVariant.image || imageClass;
      } else if (typeof styleVariant === 'string') {
        imageClass = styleVariant;
      }
    }

    return { containerClass, imageClass };
  };

  const { containerClass, imageClass } = getImageClasses();

  return (
    <div className={containerClass}>
      <img src={value} alt={alt || 'Image'} className={imageClass} />
    </div>
  );
};

Image.propTypes = {
  value: PropTypes.string,
  alt: PropTypes.string,
  className: PropTypes.string,
  viewType: PropTypes.oneOf(['list', 'card', 'detail']),
  styleVariant: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      container: PropTypes.string,
      image: PropTypes.string,
    }),
  ]),
};

export default Image;
