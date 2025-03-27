import PropTypes from 'prop-types';
import { useState } from 'react';

const ExpandableMarkdown = ({
  value,
  label,
  wordLimit = 30,
  isExpanded,
  setIsExpanded,
  heading,
  className = '',
  styleVariant,
  viewType = 'detail',
}) => {
  // Use internal state if no external state control is provided
  const [internalExpanded, setInternalExpanded] = useState(false);

  // Determine which state to use
  const expanded = isExpanded !== undefined ? isExpanded : internalExpanded;
  const toggleExpanded = setIsExpanded || setInternalExpanded;

  if (!value) return null;

  const truncateText = (text, limit) => {
    const words = text.split(' ');
    if (words.length <= limit) return text;
    return words.slice(0, limit).join(' ') + '...';
  };

  const isLong = value.split(' ').length > wordLimit;
  const displayText = expanded ? value : truncateText(value, wordLimit);

  // Determine styles from variants or use defaults
  const getStyles = () => {
    // Default styles based on viewType
    let containerClass;
    let buttonClass = 'text-blue-500 hover:text-blue-700 ml-3 inline-flex';

    // Apply different defaults based on viewType
    if (viewType === 'list') {
      containerClass = 'prose prose-sm max-w-none mb-0.5';
      // Use smaller word limit for list view
      wordLimit = Math.min(wordLimit, 15);
    } else if (viewType === 'card') {
      containerClass = 'prose prose-sm max-w-none mb-1';
    } else {
      containerClass = 'prose prose-sm max-w-none'; // Default for detail
    }

    // If explicit className is provided, use it for container
    if (className) {
      containerClass = className;
    }
    // If style variant is provided
    else if (styleVariant) {
      if (typeof styleVariant === 'object') {
        containerClass = styleVariant.container || containerClass;
        buttonClass = styleVariant.button || buttonClass;
      } else if (typeof styleVariant === 'string') {
        containerClass = styleVariant;
      }
    }

    return { containerClass, buttonClass };
  };

  const { containerClass, buttonClass } = getStyles();

  return (
    <div className={containerClass}>
      {heading && <h3 className="text-lg font-medium mb-1">{heading}</h3>}
      {label && <span className="font-semibold">{label}: </span>}
      <div className="flex flex-wrap items-end">
        {/* <div className="prose" style={{ marginBottom: 0 }}>
          <ReactMarkdown>{displayText}</ReactMarkdown>
        </div> */}
        {displayText}
        {isLong && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleExpanded(!expanded);
            }}
            className={buttonClass}
          >
            {expanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
    </div>
  );
};

ExpandableMarkdown.propTypes = {
  value: PropTypes.string,
  label: PropTypes.string,
  wordLimit: PropTypes.number,
  isExpanded: PropTypes.bool,
  setIsExpanded: PropTypes.func,
  heading: PropTypes.string,
  className: PropTypes.string,
  viewType: PropTypes.oneOf(['list', 'card', 'detail']),
  styleVariant: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      container: PropTypes.string,
      button: PropTypes.string,
    }),
  ]),
};

export default ExpandableMarkdown;
