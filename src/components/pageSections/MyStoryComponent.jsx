import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import TypedAnimation from '../TypedAnimation';

const MyStoryComponent = ({ config }) => {
  const [storyContent, setStoryContent] = useState('');
  const [jsonContent, setJsonContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Default content paths that will be overridden by JSON config when loaded
  const contentJsonPath = '/my-story/content.json';

  useEffect(() => {
    // Function to fetch all content
    const fetchAllContent = async () => {
      try {
        // First fetch the content JSON which contains paths to other resources
        const jsonResponse = await fetch(contentJsonPath);
        if (!jsonResponse.ok) {
          throw new Error(`Failed to fetch content config: ${jsonResponse.status}`);
        }
        const jsonData = await jsonResponse.json();

        // Now fetch the markdown content using the path from the JSON
        const markdownPath = jsonData.files.markdownContent;
        const mdResponse = await fetch(markdownPath);
        if (!mdResponse.ok) {
          throw new Error(`Failed to fetch story content: ${mdResponse.status}`);
        }
        const mdContent = await mdResponse.text();

        // Set state with fetched content
        setStoryContent(mdContent);
        setJsonContent(jsonData);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching content:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchAllContent();
  }, [contentJsonPath]);

  // Only show loading UI if we're still loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-pulse flex space-x-4">
          <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
          <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
          <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    );
  }

  // Show error UI if we encountered an error
  if (error) {
    return (
      <div className="text-red-500 py-4 text-center">
        Error loading content: {error}. Please refresh the page or try again later.
      </div>
    );
  }

  const pageTitle = config.sections.MyStory.sectionHeading || 'My Story';

  return (
    <div>
      {/* Hero Banner with Background Image */}
      <div
        className="relative w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden"
        style={{
          backgroundImage: `url('${jsonContent.files.backgroundImage}')`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Hidden heading for reference
        <div className="absolute inset-0 flex flex-col justify-center items-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            {config.sections.MyStory.sectionHeading}
          </h1>
          <p className="text-xl text-white text-center max-w-2xl">{jsonContent.banner.subtitle}</p>
        </div> */}
      </div>
      <div className="flex flex-col md:flex-row content-center">
        <h1 className="text-3xl md:text-4xl font-bold text-center">{pageTitle}</h1>
      </div>
      {/* Only show animation if enabled in settings */}
      {jsonContent.settings.showAnimation && <TypedAnimation content={jsonContent.animation} />}

      <div className="prose lg:prose-xl max-w-none">
        <ReactMarkdown className="markdown-content">{storyContent}</ReactMarkdown>
      </div>
    </div>
  );
};

MyStoryComponent.propTypes = {
  config: PropTypes.shape({
    sections: PropTypes.object.isRequired,
  }).isRequired,
};

export default MyStoryComponent;
