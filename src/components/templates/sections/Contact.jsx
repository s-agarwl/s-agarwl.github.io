import PropTypes from 'prop-types';
import Section from '/src/components/Section';
import {
  FaLinkedin,
  FaGithub,
  FaTwitter,
  FaEnvelope,
  FaGlobe,
  FaGoogle,
  FaOrcid,
  FaYoutube,
} from 'react-icons/fa';

/**
 * Contact template for displaying contact information and social links
 *
 * Expected content structure:
 * {
 *   title: string,              // Section title
 *   text: string,               // Introductory text (HTML supported)
 *   links: [string],            // Array of link keys to display (e.g., 'email', 'linkedin', etc.)
 *   outro: string,              // Concluding text (HTML supported)
 *   useIcons: boolean,          // Whether to use icons for links (default: true)
 *   useLabels: boolean,         // Whether to display link labels (default: false)
 *   layout: string,             // Layout style: 'centered', 'grid', or 'horizontal'
 * }
 */
const Contact = ({ content, sectionId, parentId, config }) => {
  // Generate a unique id that includes the parent section if applicable
  const uniqueId = parentId ? `${parentId}-${sectionId}` : sectionId;

  // Map of icons for different link types
  const iconMap = {
    email: FaEnvelope,
    linkedin: FaLinkedin,
    github: FaGithub,
    twitter: FaTwitter,
    googleScholar: FaGoogle,
    website: FaGlobe,
    orcid: FaOrcid,
    youTube: FaYoutube,
  };

  // Map of display names for different link types
  const labelMap = {
    email: 'Email',
    linkedin: 'LinkedIn',
    github: 'GitHub',
    twitter: 'Twitter',
    googleScholar: 'Google Scholar',
    website: 'Website',
    orcid: 'ORCID',
    youTube: 'YouTube',
  };

  // Helper function to get the URL for a link key
  const getLinkUrl = (key) => {
    if (key === 'email' && config?.email) {
      return `mailto:${config.email}`;
    }
    // Try to get URL from config.links
    return config?.links?.[key] || '#';
  };

  // Whether to show icons (default to true)
  const showIcons = content.useIcons !== false;

  // Whether to show labels (default to false)
  const showLabels = content.useLabels === true;

  // Get layout classes based on layout type
  const getLayoutClasses = () => {
    switch (content.layout) {
      case 'grid':
        return 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4';
      case 'horizontal':
        return 'flex flex-wrap justify-center gap-6';
      case 'centered':
      default:
        return 'flex justify-center space-x-4';
    }
  };

  return (
    <Section id={uniqueId}>
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-8 text-center">{content.title}</h2>

        {content.text && (
          <p className="text-center mb-8" dangerouslySetInnerHTML={{ __html: content.text }} />
        )}

        <div className={getLayoutClasses()}>
          {content.links?.map((key) => {
            const Icon = iconMap[key];
            const label = labelMap[key] || key;
            const url = getLinkUrl(key);

            return Icon && url && url !== '#' ? (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center p-2 text-theme hover:text-blue-500 transition-colors"
              >
                {showIcons && <Icon size={24} className="mr-2" />}
                {showLabels && <span>{label}</span>}
              </a>
            ) : null;
          })}
        </div>

        {content.outro && (
          <p className="text-center mt-8" dangerouslySetInnerHTML={{ __html: content.outro }} />
        )}
      </div>
    </Section>
  );
};

Contact.propTypes = {
  content: PropTypes.shape({
    title: PropTypes.string.isRequired,
    text: PropTypes.string,
    links: PropTypes.arrayOf(PropTypes.string),
    outro: PropTypes.string,
    useIcons: PropTypes.bool,
    useLabels: PropTypes.bool,
    layout: PropTypes.oneOf(['centered', 'grid', 'horizontal']),
  }).isRequired,
  sectionId: PropTypes.string,
  parentId: PropTypes.string,
  config: PropTypes.object,
};

export default Contact;
