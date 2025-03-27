import { Suspense } from 'react';
import PropTypes from 'prop-types';
import { getTemplate, templateExists } from '../templates/registry';
import SubsectionsRenderer from './SubsectionsRenderer';

/**
 * Component that dynamically renders a section using the appropriate template
 * based on the section configuration. If a section has subsections, it will render
 * those subsections instead of using a template.
 */
const DynamicSectionRenderer = ({ section, config }) => {
  // Check if this section has subsections to render
  if (section.subsections && Object.keys(section.subsections).length > 0) {
    return <SubsectionsRenderer section={section} parentId={section.id} config={config} />;
  }

  // Return null if no section or no template specified
  if (!section || !section.template) {
    console.warn(`Section missing or has no template specified: ${section?.id}`);
    return null;
  }

  // Check if the template exists
  if (!templateExists(section.template)) {
    console.error(`Template "${section.template}" not found for section "${section.id}"`);
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded">
        Template &ldquo;{section.template}&rdquo; not found for section &ldquo;{section.id}&rdquo;
      </div>
    );
  }

  // Get the template component
  const TemplateComponent = getTemplate(section.template);

  // Normalize content - ensure it's an object
  const content =
    typeof section.content === 'string' ? { text: section.content } : section.content || {};

  // Render the template with a loading fallback
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading section...</div>}>
      <TemplateComponent
        content={content}
        sectionId={section.id}
        parentId={section.parentId}
        config={config}
      />
    </Suspense>
  );
};

DynamicSectionRenderer.propTypes = {
  section: PropTypes.shape({
    id: PropTypes.string.isRequired,
    template: PropTypes.string,
    content: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    subsections: PropTypes.object,
    parentId: PropTypes.string,
  }).isRequired,
  config: PropTypes.object,
};

export default DynamicSectionRenderer;
