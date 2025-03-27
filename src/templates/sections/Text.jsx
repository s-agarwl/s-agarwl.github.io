import PropTypes from 'prop-types';
import Section from '../../components/Section';

/**
 * Basic text template for displaying text content
 *
 * Expected content structure:
 * {
 *   title: string,     // Section title
 *   text: string,      // HTML/text content
 *   className: string  // Optional additional classes
 * }
 */
const Text = ({ content, sectionId, parentId }) => {
  // Generate a unique id that includes the parent section if applicable
  const uniqueId = parentId ? `${parentId}-${sectionId}` : sectionId;

  return (
    <Section id={uniqueId} className={content.className || ''}>
      {content.title && <h2 className="text-3xl font-bold mb-6 text-center">{content.title}</h2>}
      <div className="text-lg mb-6" dangerouslySetInnerHTML={{ __html: content.text }} />
    </Section>
  );
};

Text.propTypes = {
  content: PropTypes.shape({
    title: PropTypes.string,
    text: PropTypes.string.isRequired,
    className: PropTypes.string,
  }).isRequired,
  sectionId: PropTypes.string,
  parentId: PropTypes.string,
};

export default Text;
