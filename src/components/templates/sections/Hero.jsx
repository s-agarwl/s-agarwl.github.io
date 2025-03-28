import PropTypes from 'prop-types';
import Section from '../../components/Section';
import { Link } from 'react-router-dom';

/**
 * Hero template for displaying a prominent hero section
 *
 * Expected content structure:
 * {
 *   title: string,                // Main title (can include HTML)
 *   subtitle: string,             // Subtitle (can include HTML)
 *   introduction: string,         // Introduction text (can include HTML)
 *   backgroundImage: string,      // URL to background image
 *   profile: string,              // URL to profile image
 *   ctaButtons: [                 // Array of call-to-action buttons
 *     {
 *       text: string,             // Button text
 *       url: string,              // URL to navigate to
 *       type: string,             // Button type: "primary", "secondary", "outline", "link"
 *       isExternal: boolean       // Whether the link is external
 *     }
 *   ],
 *   layout: string,               // Layout style: "centered", "split", "fullscreen"
 *   align: string,                // Text alignment: "left", "center", "right"
 *   overlay: boolean,             // Whether to add a dark overlay on the background
 *   overlayOpacity: number,       // Opacity of the overlay (0-1)
 *   textColor: string,            // Text color
 *   minHeight: string,            // Minimum height of the hero
 * }
 */
const Hero = ({ content, sectionId, parentId }) => {
  // Generate a unique id that includes the parent section if applicable
  const uniqueId = parentId ? `${parentId}-${sectionId}` : sectionId;

  // Default values
  const layout = content.layout || 'centered';
  const align = content.align || 'center';
  const textColor = content.textColor || 'text-white';
  const minHeight = content.minHeight || 'min-h-[70vh]';
  const overlayOpacity = content.overlayOpacity !== undefined ? content.overlayOpacity : 0.5;

  // Background styles
  const backgroundStyle = content.backgroundImage
    ? {
        backgroundImage: `url(${content.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {};

  // Helper function to determine button classes
  const getButtonClasses = (type) => {
    switch (type) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'secondary':
        return 'bg-gray-600 hover:bg-gray-700 text-white';
      case 'outline':
        return 'bg-transparent hover:bg-white/10 border border-current text-inherit';
      case 'link':
        return 'bg-transparent hover:underline text-inherit';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white';
    }
  };

  // Layout classes
  const getLayoutClasses = () => {
    switch (layout) {
      case 'split':
        return 'md:grid md:grid-cols-2 items-center';
      case 'fullscreen':
        return 'min-h-screen flex items-center';
      case 'centered':
      default:
        return 'flex flex-col items-center justify-center text-center';
    }
  };

  // Text alignment classes
  const getAlignClasses = () => {
    switch (align) {
      case 'left':
        return 'text-left';
      case 'right':
        return 'text-right';
      case 'center':
      default:
        return 'text-center';
    }
  };

  // Button container classes
  const getButtonContainerClasses = () => {
    switch (align) {
      case 'left':
        return 'justify-start';
      case 'right':
        return 'justify-end';
      case 'center':
      default:
        return 'justify-center';
    }
  };

  return (
    <Section id={uniqueId} className="relative p-0 overflow-hidden">
      <div className={`relative ${minHeight} w-full`} style={backgroundStyle}>
        {/* Overlay */}
        {(content.overlay || content.backgroundImage) && (
          <div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity }}></div>
        )}

        {/* Content */}
        <div
          className={`relative z-10 container mx-auto px-4 py-12 ${minHeight} ${getLayoutClasses()}`}
        >
          {/* Profile image (for certain layouts) */}
          {content.profile && layout === 'split' && (
            <div className="flex justify-center items-center p-4">
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img src={content.profile} alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          <div className={`${getAlignClasses()} ${textColor} max-w-3xl mx-auto`}>
            {/* Profile image (for centered layout) */}
            {content.profile && layout !== 'split' && (
              <div className="flex justify-center mb-6">
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-white shadow-lg">
                  <img src={content.profile} alt="Profile" className="w-full h-full object-cover" />
                </div>
              </div>
            )}

            {/* Title */}
            {content.title && (
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
                dangerouslySetInnerHTML={{ __html: content.title }}
              ></h1>
            )}

            {/* Subtitle */}
            {content.subtitle && (
              <h2
                className="text-xl md:text-2xl lg:text-3xl font-semibold mb-6"
                dangerouslySetInnerHTML={{ __html: content.subtitle }}
              ></h2>
            )}

            {/* Introduction */}
            {content.introduction && (
              <div
                className="text-base md:text-lg mb-8"
                dangerouslySetInnerHTML={{ __html: content.introduction }}
              ></div>
            )}

            {/* CTA Buttons */}
            {content.ctaButtons && content.ctaButtons.length > 0 && (
              <div className={`flex flex-wrap gap-4 mt-6 ${getButtonContainerClasses()}`}>
                {content.ctaButtons.map((button, index) => {
                  const buttonClass = `px-6 py-3 rounded-md font-medium transition-colors duration-300 ${getButtonClasses(button.type)}`;

                  return button.isExternal ? (
                    <a
                      key={index}
                      href={button.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonClass}
                    >
                      {button.text}
                    </a>
                  ) : (
                    <Link key={index} to={button.url} className={buttonClass}>
                      {button.text}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
};

Hero.propTypes = {
  content: PropTypes.shape({
    title: PropTypes.string,
    subtitle: PropTypes.string,
    introduction: PropTypes.string,
    backgroundImage: PropTypes.string,
    profile: PropTypes.string,
    ctaButtons: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['primary', 'secondary', 'outline', 'link']),
        isExternal: PropTypes.bool,
      }),
    ),
    layout: PropTypes.oneOf(['centered', 'split', 'fullscreen']),
    align: PropTypes.oneOf(['left', 'center', 'right']),
    overlay: PropTypes.bool,
    overlayOpacity: PropTypes.number,
    textColor: PropTypes.string,
    minHeight: PropTypes.string,
  }).isRequired,
  sectionId: PropTypes.string,
  parentId: PropTypes.string,
};

export default Hero;
