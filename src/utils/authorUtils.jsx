/**
 * Formats an author name from "Lastname, Firstname" to "Firstname Lastname"
 * @param {string} author - Author name in "Lastname, Firstname" format
 * @returns {string} Formatted author name
 */
const formatAuthorName = (author) => {
  if (!author) return '';
  const [lastname, firstname] = author.split(', ');
  return firstname ? `${firstname} ${lastname}` : author;
};

/**
 * Removes LaTeX-style curly braces from text while preserving the content
 * @param {string} text - Text that may contain LaTeX-style curly braces
 * @returns {string} Text with curly braces removed
 */
export const removeLatexBraces = (text) => {
  if (!text) return '';
  return text.replace(/\{([^}]+)\}/g, '$1');
};

/**
 * Renders a list of authors with proper formatting and highlighting
 * @param {string|string[]} authors - Author(s) in "Lastname, Firstname" format
 * @param {string} yourName - Your name to highlight
 * @returns {JSX.Element} Rendered authors list
 */
export const renderAuthors = (authors, yourName) => {
  if (!authors) return null;

  // Convert single author to array
  const authorsArray = Array.isArray(authors) ? authors : [authors];

  return authorsArray.map((author, index) => {
    const formattedName = formatAuthorName(author);
    const isYourName = formattedName === yourName;

    return (
      <span key={index}>
        <span className={isYourName ? 'underline' : ''}>{formattedName}</span>
        {index < authorsArray.length - 1 && ', '}
      </span>
    );
  });
};
