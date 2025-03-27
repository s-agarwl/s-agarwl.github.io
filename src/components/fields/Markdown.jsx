import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

const Markdown = ({ value, className = '', styleVariant, viewType = 'detail' }) => {
  if (!value) return null;

  // Get appropriate class based on viewType and styleVariant
  const getClassName = () => {
    if (className) return className;
    if (styleVariant) return styleVariant;

    // Different margins based on viewType
    if (viewType === 'list') return 'markdown-content prose prose-sm mb-0.5';
    if (viewType === 'card') return 'markdown-content prose prose-sm mb-1';
    return 'markdown-content prose prose-base mb-4'; // Default for detail
  };

  const markdownClass = getClassName();

  return (
    <div className={markdownClass}>
      <ReactMarkdown>{value}</ReactMarkdown>
    </div>
  );
};

Markdown.propTypes = {
  value: PropTypes.string,
  className: PropTypes.string,
  styleVariant: PropTypes.string,
  viewType: PropTypes.oneOf(['list', 'card', 'detail']),
};

export default Markdown;
