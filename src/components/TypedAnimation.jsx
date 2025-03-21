import { useEffect, useState, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';

const TypedAnimation = ({
  content,
  containerClassName = 'h-40 flex items-center justify-left text-2xl text-gray-800',
  prefixClassName = 'font-mono',
  textClassName = 'font-mono text-gray-600',
  cursorClassName = 'animate-blink text-gray-600 font-mono',
}) => {
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
    <div className={containerClassName}>
      <p className="text-left font-mono">
        {text && <span className={prefixClassName}>{text.substring(0, PREFIX.length)}</span>}
        {text.length > PREFIX.length && animationStage !== 'thinking' && (
          <span className={textClassName}>{text.substring(PREFIX.length)}</span>
        )}
        <span className={cursorClassName}>|</span>
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
  containerClassName: PropTypes.string,
  prefixClassName: PropTypes.string,
  textClassName: PropTypes.string,
  cursorClassName: PropTypes.string,
};

export default TypedAnimation;
