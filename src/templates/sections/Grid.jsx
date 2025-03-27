import PropTypes from 'prop-types';
import Section from '../../components/Section';
import { Link } from 'react-router-dom';
import { FaTrophy, FaMedal, FaAward, FaStar } from 'react-icons/fa';

/**
 * Grid template for displaying items in a grid layout
 *
 * Expected content structure:
 * {
 *   title: string,               // Section title
 *   columns: number,             // Number of columns (1-4)
 *   items: [                     // Array of grid items
 *     {
 *       title: string,           // Item title
 *       description: string,     // Item description
 *       icon: string,            // Icon name from predefined set
 *       link: string,            // Optional link
 *       linkText: string,        // Optional link text
 *       image: string,           // Optional image URL
 *     }
 *   ]
 * }
 */
const Grid = ({ content, sectionId, parentId }) => {
  // Map icon names to actual React components
  const iconMap = {
    trophy: FaTrophy,
    medal: FaMedal,
    award: FaAward,
    star: FaStar,
  };

  // Determine column classes based on columns property
  const getColumnClasses = () => {
    switch (content.columns) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-1 md:grid-cols-2';
      case 3:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  };

  // Generate a unique id that includes the parent section if applicable
  const uniqueId = parentId ? `${parentId}-${sectionId}` : sectionId;

  return (
    <Section id={uniqueId}>
      <h2 className="text-3xl font-bold mb-6 text-center">{content.title}</h2>
      <div className={`grid ${getColumnClasses()} gap-6`}>
        {content.items.map((item, index) => {
          const IconComponent = item.icon && iconMap[item.icon.toLowerCase()];

          return (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-6 flex items-start space-x-4"
            >
              {IconComponent && (
                <div className="text-4xl">
                  <IconComponent className="text-yellow-500" />
                </div>
              )}
              {item.image && (
                <div className="w-16 h-16 flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
              )}
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-700">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
                {item.link && (
                  <Link
                    to={item.link}
                    className="text-blue-500 hover:text-blue-700 mt-2 inline-block"
                  >
                    {item.linkText || 'Learn more'}
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
};

Grid.propTypes = {
  content: PropTypes.shape({
    title: PropTypes.string.isRequired,
    columns: PropTypes.number,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        icon: PropTypes.string,
        link: PropTypes.string,
        linkText: PropTypes.string,
        image: PropTypes.string,
      }),
    ).isRequired,
  }).isRequired,
  sectionId: PropTypes.string,
  parentId: PropTypes.string,
};

export default Grid;
