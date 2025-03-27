import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Section from '../../components/Section';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

// Import CSS files for react-slick
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

/**
 * Carousel template for displaying featured items in a carousel/slider
 *
 * Expected content structure:
 * {
 *   title: string,               // Section title
 *   itemsType: string,           // Type of items (publication, project, etc.)
 *   citationKeys: [string],      // Array of citation keys (for publications)
 *   itemIds: [string],           // Array of item IDs (for other content types)
 *   showDots: boolean,           // Whether to show dots navigation
 *   showArrows: boolean,         // Whether to show arrow navigation
 *   itemsPerPage: number         // Number of items to show per page
 * }
 */
const Carousel = ({ content, sectionId, parentId }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Generate a unique id that includes the parent section if applicable
  const uniqueId = parentId ? `${parentId}-${sectionId}` : sectionId;

  // Fetch items based on content type and IDs
  useEffect(() => {
    const fetchItems = async () => {
      try {
        // This is a placeholder for actual data fetching logic
        // In a real implementation, this would fetch data based on the itemsType and IDs

        // For now, just create placeholder items
        const placeholderItems = (content.citationKeys || content.itemIds || []).map(
          (id, index) => ({
            id,
            title: `Item ${index + 1}`,
            description: 'Item description goes here',
            image: 'https://via.placeholder.com/300x200',
            link: `/${content.itemsType}/${id}`,
          }),
        );

        setItems(placeholderItems);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching carousel items:', err);
        setError('Failed to load items');
        setLoading(false);
      }
    };

    fetchItems();
  }, [content.citationKeys, content.itemIds, content.itemsType]);

  // Custom arrow components
  const NextArrow = ({ onClick }) => (
    <button onClick={onClick} className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
      <ChevronRightIcon className="h-8 w-8 sm:h-10 sm:w-10 text-gray-500 hover:text-gray-700" />
    </button>
  );

  NextArrow.propTypes = {
    onClick: PropTypes.func,
  };

  const PrevArrow = ({ onClick }) => (
    <button onClick={onClick} className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
      <ChevronLeftIcon className="h-8 w-8 sm:h-10 sm:w-10 text-gray-500 hover:text-gray-700" />
    </button>
  );

  PrevArrow.propTypes = {
    onClick: PropTypes.func,
  };

  // Slider settings
  const settings = {
    dots: content.showDots !== false,
    infinite: true,
    speed: 500,
    slidesToShow: content.itemsPerPage || 3,
    slidesToScroll: 1,
    nextArrow: content.showArrows !== false ? <NextArrow /> : null,
    prevArrow: content.showArrows !== false ? <PrevArrow /> : null,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, content.itemsPerPage || 3),
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  // Render loading state
  if (loading) {
    return (
      <Section id={uniqueId}>
        <h2 className="text-3xl font-bold mb-8 text-center">{content.title}</h2>
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse flex space-x-4">
            <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
            <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
            <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </Section>
    );
  }

  // Render error state
  if (error) {
    return (
      <Section id={uniqueId}>
        <h2 className="text-3xl font-bold mb-8 text-center">{content.title}</h2>
        <div className="text-red-500 p-4 text-center">{error}</div>
      </Section>
    );
  }

  // If no items, show a message
  if (!items.length) {
    return (
      <Section id={uniqueId}>
        <h2 className="text-3xl font-bold mb-8 text-center">{content.title}</h2>
        <div className="text-center p-4">No items to display</div>
      </Section>
    );
  }

  // Render carousel
  return (
    <Section id={uniqueId}>
      <h2 className="text-3xl font-bold mb-8 text-center">{content.title}</h2>
      <div className="w-full px-8">
        <Slider {...settings}>
          {items.map((item) => (
            <div key={item.id} className="px-2">
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                {item.image && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                  {item.link && (
                    <Link to={item.link} className="text-blue-500 hover:text-blue-700 font-medium">
                      Learn more
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </Section>
  );
};

Carousel.propTypes = {
  content: PropTypes.shape({
    title: PropTypes.string.isRequired,
    itemsType: PropTypes.string,
    citationKeys: PropTypes.arrayOf(PropTypes.string),
    itemIds: PropTypes.arrayOf(PropTypes.string),
    showDots: PropTypes.bool,
    showArrows: PropTypes.bool,
    itemsPerPage: PropTypes.number,
  }).isRequired,
  sectionId: PropTypes.string,
  parentId: PropTypes.string,
};

export default Carousel;
