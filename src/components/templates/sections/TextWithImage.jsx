import PropTypes from 'prop-types';
import Section from '/src/components/Section';

/**
 * Template for section with text and image
 *
 * Expected content structure:
 * {
 *   image: string,               // Image path
 *   imageAlt: string,            // Image alt text
 *   title: string,               // Section title
 *   subtitle: string,            // Subtitle
 *   text: string,                // HTML/text content
 *   imagePosition: string,       // 'left' or 'right'
 *   imageShape: string,          // 'rounded', 'circle', 'square'
 *   animation: {                 // Optional animation
 *     enabled: boolean,
 *     phrases: array
 *   }
 * }
 */
const TextWithImage = ({ content, sectionId, parentId }) => {
  const imageClasses = {
    circle: 'rounded-full',
    rounded: 'rounded-lg',
    square: '',
  };

  const imageShape = content.imageShape || 'circle';
  const imagePosition = content.imagePosition || 'left';

  // Generate a unique id that includes the parent section if applicable
  const uniqueId = parentId ? `${parentId}-${sectionId}` : sectionId;

  const imageContent = content.image && (
    <div className={`w-full md:w-1/3 flex justify-center md:justify-start`}>
      <img
        src={content.image}
        alt={content.imageAlt || content.title}
        className={`w-64 h-64 object-cover ${imageClasses[imageShape]} border-4 border-white shadow-lg`}
      />
    </div>
  );

  return (
    <Section id={uniqueId}>
      <div
        className={`flex flex-col ${imagePosition === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'} items-center md:items-start gap-8`}
      >
        {imagePosition === 'left' && imageContent}

        <div className="w-full md:w-2/3 text-center md:text-left">
          {content.title && (
            <h2 className="text-4xl sm:text-3xl font-bold text-theme mb-4">{content.title}</h2>
          )}

          {content.subtitle && (
            <div className="mb-8">
              <h3 className="font-mono flex items-center justify-center md:justify-start text-xl sm:text-1xl text-theme-light">
                {content.subtitle}
              </h3>
            </div>
          )}

          <div
            className="text-lg text-theme mb-12"
            dangerouslySetInnerHTML={{ __html: content.text }}
          />
        </div>

        {imagePosition === 'right' && imageContent}
      </div>
    </Section>
  );
};

TextWithImage.propTypes = {
  content: PropTypes.shape({
    image: PropTypes.string,
    imageAlt: PropTypes.string,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    text: PropTypes.string.isRequired,
    imagePosition: PropTypes.oneOf(['left', 'right']),
    imageShape: PropTypes.oneOf(['circle', 'rounded', 'square']),
    animation: PropTypes.shape({
      enabled: PropTypes.bool,
      phrases: PropTypes.arrayOf(PropTypes.string),
    }),
  }).isRequired,
  sectionId: PropTypes.string,
  parentId: PropTypes.string,
};

export default TextWithImage;
