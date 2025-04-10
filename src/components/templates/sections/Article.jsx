import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import Section from '/src/components/Section';
import TypedAnimation from '/src/components/TypedAnimation';

/**
 * Article template for displaying long-form content with optional banner and animation
 *
 * Expected content structure:
 * {
 *   title: string,              // Article title

 *   markdownFile: string,       // Name of the markdown file (e.g., "content.md")
 *   banner: {
 *     image: string,            // Banner image filename
 *     title: string,            // Optional banner title
 *     subtitle: string,         // Optional banner subtitle
 *     showTitle: boolean        // Whether to display the title on the banner
 *   },
 *   animation: {
 *     enabled: boolean,         // Whether to show the animation
 *     prefix: string,           // Prefix text before animation (e.g., "I am ")
 *     phrases: string[]         // Array of phrases to animate
 *   }
 * }
 */
const Article = ({ content, sectionId, parentId, config }) => {
  const [markdownContent, setMarkdownContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Generate a unique id that includes the parent section if applicable
  const uniqueId = parentId ? `${parentId}-${sectionId}` : sectionId;

  // Determine resource paths
  const markdownFile = content.markdownFile || 'content.md';
  const markdownPath = `${markdownFile}`;
  const bannerImage = content.banner?.image ? `${content.banner.image}` : null;

  useEffect(() => {
    // Function to fetch markdown content
    const fetchContent = async () => {
      try {
        const mdResponse = await fetch(markdownPath);
        if (!mdResponse.ok) {
          throw new Error(`Failed to fetch article content: ${mdResponse.status}`);
        }
        const mdContent = await mdResponse.text();
        setMarkdownContent(mdContent);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching article content:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [markdownPath]);

  // Only show loading UI if we're still loading
  if (isLoading) {
    return (
      <Section id={uniqueId}>
        <div className="flex justify-center items-center h-96">
          <div className="animate-pulse flex space-x-4">
            <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
            <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
            <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </Section>
    );
  }

  // Show error UI if we encountered an error
  if (error) {
    return (
      <Section id={uniqueId}>
        <div className="text-red-500 py-4 text-center">
          Error loading content: {error}. Please refresh the page or try again later.
        </div>
      </Section>
    );
  }

  return (
    <Section id={uniqueId}>
      {/* Banner with Background Image (if provided) */}
      {bannerImage && (
        <div
          className="relative w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden mb-0"
          style={{
            backgroundImage: `url('${bannerImage}')`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Optional banner title and subtitle */}
          {content.banner?.showTitle && content.banner?.title && (
            <div className="absolute inset-0 flex flex-col justify-center items-center px-4 bg-black bg-opacity-40">
              <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
                {content.banner.title}
              </h1>
              {content.banner?.subtitle && (
                <p className="text-xl text-white text-center max-w-2xl">
                  {content.banner.subtitle}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Article Title */}
      <div className="flex flex-col md:flex-row content-center mb-0">
        <h1 className="text-3xl md:text-4xl font-bold text-center">{content.title}</h1>
      </div>

      {/* Typed Animation (if enabled) */}
      {content.animation?.enabled && (
        <TypedAnimation
          content={{
            prefix: content.animation.prefix || 'I am ',
            phrases: content.animation.phrases || [
              'a researcher',
              'a developer',
              'a creative thinker',
            ],
          }}
        />
      )}

      {/* Markdown Content */}
      <div className="prose lg:prose-xl max-w-none">
        <ReactMarkdown className="markdown-content">{markdownContent}</ReactMarkdown>
      </div>
    </Section>
  );
};

Article.propTypes = {
  content: PropTypes.shape({
    title: PropTypes.string.isRequired,
    markdownFile: PropTypes.string,
    banner: PropTypes.shape({
      image: PropTypes.string,
      title: PropTypes.string,
      subtitle: PropTypes.string,
      showTitle: PropTypes.bool,
    }),
    animation: PropTypes.shape({
      enabled: PropTypes.bool,
      prefix: PropTypes.string,
      phrases: PropTypes.arrayOf(PropTypes.string),
    }),
  }).isRequired,
  sectionId: PropTypes.string.isRequired,
  parentId: PropTypes.string,
  config: PropTypes.object,
};

export default Article;
