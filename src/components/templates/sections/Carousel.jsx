import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Section from '/src/components/Section';
import Slider from 'react-slick';
import GenericCard from '/src/components/GenericCard';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import convertBibtexToJson from '/src/utils/bibtexToJson';

// Import CSS files for react-slick
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

/**
 * Carousel template for displaying featured items in a carousel/slider
 *
 * Expected content structure:
 * {
 *   title: string,               // Section title
 *   items: [                     // Array of items to display
 *     {
 *       type: string,            // Content type (publication, project, etc.)
 *       id: string,              // ID of the item
 *     }
 *   ],
 *   // Legacy support
 *   itemsType: string,           // Type of items (for backward compatibility)
 *   citationKeys: [string],      // Array of citation keys (for backward compatibility)
 *   itemIds: [string],           // Array of item IDs (for backward compatibility)
 *   showDots: boolean,           // Whether to show dots navigation
 *   showArrows: boolean,         // Whether to show arrow navigation
 *   itemsPerPage: number         // Number of items to show per page
 * }
 */
const Carousel = ({ content, sectionId, parentId, config }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Generate a unique id that includes the parent section if applicable
  const uniqueId = parentId ? `${parentId}-${sectionId}` : sectionId;

  // Fetch items based on content configuration
  useEffect(() => {
    const fetchItems = async () => {
      try {
        let itemsToFetch = [];

        // Check if using the new items format
        if (Array.isArray(content.items) && content.items.length > 0) {
          // New format with mixed content types
          itemsToFetch = content.items;
        } else if (Array.isArray(content.ids) && content.ids.length > 0) {
          // Support for ids array that might be used instead of items
          itemsToFetch = content.ids;
        } else if (content.itemsType) {
          // Legacy format with single content type
          const ids = content.citationKeys || content.itemIds || [];
          itemsToFetch = ids.map((id) => ({ type: content.itemsType, id }));
        } else {
          throw new Error('No items specified in carousel configuration');
        }

        if (itemsToFetch.length === 0) {
          setItems([]);
          setLoading(false);
          return;
        }

        // Group items by type for efficient fetching
        const itemsByType = itemsToFetch.reduce((acc, item) => {
          // Don't lowercase the type - use it exactly as provided
          const type = item.type;
          if (!acc[type]) acc[type] = [];
          acc[type].push(item.id);
          return acc;
        }, {});

        const loadedItems = [];

        // Fetch data for each content type
        for (const [type, ids] of Object.entries(itemsByType)) {
          // Find the section that contains the data source for this type
          const sections = config.sections || [];

          // First try exact match (this should be the common case if config is correct)
          let matchingSection = sections.find(
            (section) =>
              section.id === type && section.template === 'listOfItems' && section.dataSource,
          );

          // If no exact match, try case-insensitive and singular/plural variants as fallbacks
          if (!matchingSection) {
            const typeLower = type.toLowerCase();
            matchingSection = sections.find(
              (section) =>
                (section.id.toLowerCase() === typeLower ||
                  section.id.toLowerCase() === typeLower.replace(/s$/, '')) && // Try without trailing 's'
                section.template === 'listOfItems' &&
                section.dataSource,
            );
          }

          if (!matchingSection) {
            console.warn(
              `No section found with id ${type} and template listOfItems. Skipping these items.`,
            );
            continue;
          }

          // Fetch the data
          const response = await fetch(matchingSection.dataSource);
          if (!response.ok) {
            console.warn(
              `Failed to fetch data for ${type}: ${response.statusText}. Skipping these items.`,
            );
            continue;
          }

          // Parse the data based on data type
          let typeItems = [];
          if (matchingSection.dataType === 'bibtex') {
            const bibtexData = await response.text();
            typeItems = convertBibtexToJson(bibtexData);
          } else {
            typeItems = await response.json();
          }

          // Filter items by ID and add content type
          const filteredItems = typeItems
            .filter((item) => ids.includes(item.id))
            .map((item) => ({ ...item, contentType: type }));

          loadedItems.push(...filteredItems);
        }

        // Sort items to match the original order in the config
        const itemsMap = new Map(loadedItems.map((item) => [item.id, item]));
        const orderedItems = itemsToFetch.map(({ id }) => itemsMap.get(id)).filter(Boolean); // Remove any undefined items

        setItems(orderedItems);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching carousel items:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchItems();
  }, [
    content.items,
    content.ids,
    content.citationKeys,
    content.itemIds,
    content.itemsType,
    config.sections,
  ]);

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
            <div key={`${item.contentType}-${item.id}`} className="px-2">
              <GenericCard item={item} contentType={item.contentType} config={config} />
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
    items: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
      }),
    ),
    ids: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
      }),
    ),
    itemsType: PropTypes.string, // Legacy support
    citationKeys: PropTypes.arrayOf(PropTypes.string), // Legacy support
    itemIds: PropTypes.arrayOf(PropTypes.string), // Legacy support
    showDots: PropTypes.bool,
    showArrows: PropTypes.bool,
    itemsPerPage: PropTypes.number,
  }).isRequired,
  sectionId: PropTypes.string,
  parentId: PropTypes.string,
  config: PropTypes.object,
};

export default Carousel;
