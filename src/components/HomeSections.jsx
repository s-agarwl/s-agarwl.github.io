import { useMemo } from 'react';
import PropTypes from 'prop-types';
import DynamicSectionRenderer from './DynamicSectionRenderer';

/**
 * Component that renders all home page sections based on configuration
 */
const HomeSections = ({ config }) => {
  // Extract sections from config that should be displayed on home page
  const homeSections = useMemo(() => {
    const sections = [];

    // Find the home page section (section with path '/')
    const homeSection = config.sections.find((section) => section.path === '/');

    // If we have a dedicated home section with subsections, use those
    if (homeSection && homeSection.subsections) {
      for (const subsection of homeSection.subsections) {
        // Skip if it's not supposed to be on the home page
        if (subsection.excludeFromHome) {
          continue;
        }

        // Skip if no template is specified
        if (!subsection.template) {
          console.warn(`Subsection "${subsection.id}" has no template specified, skipping`);
          continue;
        }

        // Add section to the list of sections to render
        sections.push({
          ...subsection,
        });
      }
    } else {
      // Fallback to old behavior - look for sections without paths
      for (const section of config.sections) {
        // Skip if it has a path (it's a separate page) or if it's not supposed to be on the home page
        if (section.path || section.excludeFromHome) {
          continue;
        }

        // Skip if no template is specified
        if (!section.template) {
          console.warn(`Section "${section.id}" has no template specified, skipping`);
          continue;
        }

        // Add section to the list of sections to render
        sections.push({
          ...section,
        });
      }
    }

    // Sort sections based on their order property (if present)
    return sections.sort((a, b) => {
      const orderA = a.order || Number.MAX_SAFE_INTEGER;
      const orderB = b.order || Number.MAX_SAFE_INTEGER;
      return orderA - orderB;
    });
  }, [config.sections]);

  // If no sections to display, show a message
  if (!homeSections.length) {
    return <div className="text-center">No sections configured for the home page.</div>;
  }

  // Render all sections
  return (
    <div>
      {homeSections.map((section) => (
        <DynamicSectionRenderer key={section.id} section={section} config={config} />
      ))}
    </div>
  );
};

HomeSections.propTypes = {
  config: PropTypes.object.isRequired,
};

export default HomeSections;
