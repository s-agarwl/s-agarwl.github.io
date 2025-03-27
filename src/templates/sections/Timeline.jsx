import { FaBriefcase, FaGraduationCap } from 'react-icons/fa';
import PropTypes from 'prop-types';
import Section from '../../components/Section';

/**
 * Timeline template for displaying chronological content like education or work experience
 *
 * Expected content structure:
 * {
 *   title: string,              // Section title
 *   iconType: string,           // 'education', 'work', or 'custom'
 *   customIcon: string,         // Component name if iconType is 'custom'
 *   items: [                    // Array of timeline items
 *     {
 *       title: string,          // Item title (e.g., job title or degree)
 *       subtitle: string,       // Item subtitle (e.g., company or university)
 *       period: string,         // Time period
 *       location: string,       // Location
 *       description: string,    // HTML/text description
 *       details: [string]       // Additional details as bullet points
 *     }
 *   ]
 * }
 */
const Timeline = ({ content, sectionId, parentId }) => {
  // Determine which icon to use
  const getIcon = () => {
    if (content.iconType === 'education') return FaGraduationCap;
    if (content.iconType === 'work') return FaBriefcase;
    // Custom icons could be implemented here
    return FaBriefcase; // Default
  };

  const IconComponent = getIcon();

  // Generate a unique id that includes the parent section if applicable
  const uniqueId = parentId ? `${parentId}-${sectionId}` : sectionId;

  return (
    <Section id={uniqueId}>
      <h2 className="text-3xl font-bold mb-12 text-center text-theme">{content.title}</h2>
      <div className="relative">
        {content.items.map((item, index) => (
          <div key={index} className="mb-12 flex">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
              <IconComponent className="text-white" />
            </div>
            <div className="ml-8 bg-white shadow-md rounded-lg p-6 flex-grow">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-gray-600 mb-2">
                {item.subtitle}
                {item.location && `, ${item.location}`}
              </p>
              <p className="text-gray-600 text-sm mb-4">{item.period}</p>

              {item.description && <p className="text-gray-700 mb-4">{item.description}</p>}

              {item.details && item.details.length > 0 && (
                <ul className="list-disc pl-5 text-gray-700">
                  {item.details.map((detail, detailIndex) => (
                    <li key={detailIndex}>{detail}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}

        {/* Vertical line connecting timeline items */}
        <div
          className="absolute top-0 bottom-0 left-6 w-0.5 bg-gray-300"
          style={{ transform: 'translateX(-50%)' }}
        ></div>
      </div>
    </Section>
  );
};

Timeline.propTypes = {
  content: PropTypes.shape({
    title: PropTypes.string.isRequired,
    iconType: PropTypes.oneOf(['education', 'work', 'custom']),
    customIcon: PropTypes.string,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        subtitle: PropTypes.string.isRequired,
        period: PropTypes.string,
        location: PropTypes.string,
        description: PropTypes.string,
        details: PropTypes.arrayOf(PropTypes.string),
      }),
    ).isRequired,
  }).isRequired,
  sectionId: PropTypes.string,
  parentId: PropTypes.string,
};

export default Timeline;
