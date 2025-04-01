import PropTypes from 'prop-types';
import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import ImageViewerModal from '../../ImageViewerModal';

const Image = ({ value, alt, className = '', styleVariant, viewType = 'detail' }) => {
  const [showModal, setShowModal] = useState(false);

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

  // Only add click-to-zoom functionality in detail view
  const isZoomable = viewType === 'detail';

  const handleImageClick = () => {
    if (isZoomable) {
      setShowModal(true);
    }
  };

  return (
    <>
      <div className={containerClass}>
        <div
          className={`relative ${isZoomable ? 'group cursor-pointer' : ''}`}
          onClick={isZoomable ? handleImageClick : undefined}
        >
          <img src={value} alt={alt || 'Image'} className={imageClass} />
          {isZoomable && (
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <MagnifyingGlassIcon className="h-8 w-8 text-white drop-shadow-lg" />
            </div>
          )}
        </div>
      </div>

      {/* Full-screen image modal */}
      <ImageViewerModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        imageUrl={value}
        alt={alt}
      />
    </>
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
