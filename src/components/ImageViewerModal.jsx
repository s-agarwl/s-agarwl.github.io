import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { XMarkIcon } from '@heroicons/react/24/solid';

/**
 * A modal component for displaying images in full screen
 */
const ImageViewerModal = ({ isOpen, onClose, imageUrl, alt }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    // Handle ESC key press to close the modal
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Handle clicking outside the image to close modal
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
      onClick={handleBackdropClick}
    >
      <div className="relative" ref={modalRef}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 focus:outline-none transition-colors duration-200"
          aria-label="Close"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        <img
          src={imageUrl}
          alt={alt || 'Full-screen image'}
          className="max-h-[90vh] max-w-[90vw] object-contain"
        />
      </div>
    </div>
  );
};

ImageViewerModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  imageUrl: PropTypes.string.isRequired,
  alt: PropTypes.string,
};

export default ImageViewerModal;
