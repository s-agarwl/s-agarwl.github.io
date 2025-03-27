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
    const homeSection = Object.values(config.sections).find((section) => section.path === '/');

    // If we have a dedicated home section with subsections, use those
    if (homeSection && homeSection.subsections) {
      for (const [id, sectionConfig] of Object.entries(homeSection.subsections)) {
        // Skip if it's not supposed to be on the home page
        if (sectionConfig.excludeFromHome) {
          continue;
        }

        // Skip if no template is specified
        if (!sectionConfig.template) {
          console.warn(`Subsection "${id}" has no template specified, skipping`);
          continue;
        }

        // Add section to the list of sections to render
        sections.push({
          ...sectionConfig,
          id,
        });
      }
    } else {
      // Fallback to old behavior - look for sections without paths
      for (const [id, sectionConfig] of Object.entries(config.sections)) {
        // Skip if it has a path (it's a separate page) or if it's not supposed to be on the home page
        if (sectionConfig.path || sectionConfig.excludeFromHome) {
          continue;
        }

        // Skip if no template is specified
        if (!sectionConfig.template) {
          console.warn(`Section "${id}" has no template specified, skipping`);
          continue;
        }

        // Add section to the list of sections to render
        sections.push({
          ...sectionConfig,
          id,
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
        <DynamicSectionRenderer key={section.id} section={section} />
      ))}
    </div>
  );
};

HomeSections.propTypes = {
  config: PropTypes.object.isRequired,
};

export default HomeSections;
