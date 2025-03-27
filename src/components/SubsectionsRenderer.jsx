import PropTypes from 'prop-types';
import DynamicSectionRenderer from './DynamicSectionRenderer';

/**
 * Component that renders a collection of subsections in the order specified
 * by their "order" property.
 */
const SubsectionsRenderer = ({ section, parentId, config }) => {
  // Get subsections from the section config
  const subsections = section.subsections || {};

  // Convert subsections object to array and sort by order
  const subsectionsArray = Object.entries(subsections)
    .map(([id, subsection]) => ({
      ...subsection,
      id: subsection.id || id, // Use subsection's id or fallback to key
      parentId: parentId, // Set parent section ID for correct ID generation
    }))
    .sort((a, b) => (a.order || 99) - (b.order || 99)); // Sort by order, default to 99 if missing

  // If no subsections, show a message
  if (subsectionsArray.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        No subsections found for section &ldquo;{section.id}&rdquo;
      </div>
    );
  }

  // Render each subsection using the DynamicSectionRenderer
  return (
    <div className="subsections-container">
      {subsectionsArray.map((subsection) => (
        <DynamicSectionRenderer key={subsection.id} section={subsection} config={config} />
      ))}
    </div>
  );
};

SubsectionsRenderer.propTypes = {
  section: PropTypes.shape({
    id: PropTypes.string.isRequired,
    subsections: PropTypes.object,
  }).isRequired,
  parentId: PropTypes.string,
  config: PropTypes.object,
};

export default SubsectionsRenderer;
