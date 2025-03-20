import { useEffect, useState, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

const TypedAnimation = ({ content }) => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [animationStage, setAnimationStage] = useState('initial'); // 'initial', 'prefix', 'thinking', 'phrases'

  // Get prefix and phrases from content
  const PREFIX = content?.prefix || 'I am ';

  // Define phrases to type using useMemo
  const phrases = useMemo(() => content?.phrases || ['loading...'], [content?.phrases]);

  // Timing variables
  const typingSpeed = 100;
  const deleteSpeed = 50;
  const pauseBeforeDelete = 1000;
  const pauseBeforeNextPhrase = 500;
  const thinkingDuration = 2000;

  // Ref to store the timeout ID
  const timeoutRef = useRef(null);

  // Helper functions to reduce redundancy
  const scheduleNextStep = (callback, delay) => {
    timeoutRef.current = setTimeout(callback, delay);
  };

  useEffect(() => {
    // Clear timeout when component unmounts
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Initial empty cursor stage
  useEffect(() => {
    if (animationStage === 'initial') {
      // Start with an empty cursor, then after a pause, begin typing the prefix
      scheduleNextStep(() => {
        setAnimationStage('prefix');
      }, 1000);
    }
  }, [animationStage]);

  // Type the prefix "I am "
  useEffect(() => {
    if (animationStage === 'prefix') {
      if (text.length < PREFIX.length) {
        scheduleNextStep(() => {
          setText(PREFIX.substring(0, text.length + 1));
        }, typingSpeed);
      } else {
        // Prefix typing complete, move to thinking stage
        scheduleNextStep(() => {
          setAnimationStage('thinking');
          setText(PREFIX);
        }, pauseBeforeNextPhrase);
      }
    }
  }, [text, animationStage, PREFIX]);

  // Show thinking dots "..."
  useEffect(() => {
    if (animationStage === 'thinking') {
      // For thinking animation, just show the prefix
      setText(PREFIX);

      // After thinking duration, move to phrases stage
      scheduleNextStep(() => {
        setAnimationStage('phrases');
      }, thinkingDuration);
    }
  }, [animationStage, PREFIX, thinkingDuration]);

  // Custom animation for the thinking dots
  const renderThinkingDots = () => {
    if (animationStage !== 'thinking') return null;

    return (
      <span className="inline-flex items-center ml-2">
        <span className="h-2.5 w-2.5 bg-gray-500 rounded-full mx-0.5 mb-0 animate-dot1"></span>
        <span className="h-2.5 w-2.5 bg-gray-500 rounded-full mx-0.5 mb-0 animate-dot2"></span>
        <span className="h-2.5 w-2.5 bg-gray-500 rounded-full mx-0.5 mb-0 animate-dot3"></span>
      </span>
    );
  };

  // Handle phrases
  useEffect(() => {
    if (animationStage !== 'phrases') return;

    const currentFullText = PREFIX + phrases[currentPhrase];

    // States based on the current sequence
    const isTypingComplete = text === currentFullText;
    const isLastPhrase = currentPhrase === phrases.length - 1;
    const isPrefixOnly = text === PREFIX;

    // Handle state transitions
    if (!isDeleting) {
      if (!isTypingComplete) {
        // Typing in progress
        scheduleNextStep(() => {
          setText(currentFullText.substring(0, text.length + 1));
        }, typingSpeed);
      } else if (!isLastPhrase) {
        // Typing complete, start deleting after pause
        scheduleNextStep(() => {
          setIsDeleting(true);
        }, pauseBeforeDelete);
      }
    } else if (isDeleting) {
      if (!isPrefixOnly) {
        // Deleting in progress
        scheduleNextStep(() => {
          setText(text.substring(0, text.length - 1));
        }, deleteSpeed);
      } else {
        // Deleting complete, move to next phrase
        scheduleNextStep(() => {
          setIsDeleting(false);
          setCurrentPhrase((prev) => prev + 1);
        }, pauseBeforeNextPhrase);
      }
    }
  }, [text, isDeleting, currentPhrase, phrases, PREFIX, animationStage]);

  return (
    <div className="h-40 flex items-center justify-left text-2xl text-gray-800">
      <p className="text-left">
        {text && <span className="font-mono">{text.substring(0, PREFIX.length)}</span>}
        {text.length > PREFIX.length && animationStage !== 'thinking' && (
          <span className="font-mono text-gray-600">{text.substring(PREFIX.length)}</span>
        )}
        <span className="animate-blink text-gray-600 font-mono">|</span>
        {animationStage === 'thinking' && renderThinkingDots()}
      </p>
    </div>
  );
};

TypedAnimation.propTypes = {
  content: PropTypes.shape({
    prefix: PropTypes.string,
    phrases: PropTypes.arrayOf(PropTypes.string),
  }),
};

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
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-center items-center h-96">
          <div className="animate-pulse flex space-x-4">
            <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
            <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
            <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show error UI if we encountered an error
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-red-500 py-4 text-center">
          Error loading content: {error}. Please refresh the page or try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Hero Banner with Background Image */}
      <div
        className="relative w-full h-64 md:h-80 lg:h-96 mb-12 rounded-lg overflow-hidden shadow-lg"
        style={{
          backgroundImage: `url('${jsonContent.files.backgroundImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/60 to-blue-900/60 flex flex-col justify-center items-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            {config.sections.MyStory.sectionHeading}
          </h1>
          <p className="text-xl text-white text-center max-w-2xl">{jsonContent.banner.subtitle}</p>
        </div>
      </div>

      {/* Only show animation if enabled in settings */}
      {jsonContent.settings.showAnimation && <TypedAnimation content={jsonContent.animation} />}

      <div className="prose lg:prose-xl max-w-none mt-8">
        <ReactMarkdown
          components={{
            h1: ({ ...props }) => <h2 className="!text-2xl font-semibold mb-4" {...props} />,
            h2: ({ ...props }) => <h2 className="!text-2xl font-semibold mt-8 mb-4" {...props} />,
            a: ({ ...props }) => <a className="font-mono" {...props} />,
          }}
        >
          {storyContent}
        </ReactMarkdown>
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
