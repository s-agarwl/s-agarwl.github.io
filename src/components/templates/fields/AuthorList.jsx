import PropTypes from 'prop-types';
import { renderAuthors } from '/src/utils/authorUtils';
import componentStyles from '/src/styles/componentStyles';

const AuthorList = ({
  value,
  label,
  config,
  researcherName,
  className = '',
  styleVariant,
  viewType = 'detail',
}) => {
  if (!value) return null;

  const authors = Array.isArray(value) ? value : value.split(' and ');
  // Use the explicitly passed researcherName first, then fall back to config.researcherName
  const researcherNameToUse = researcherName || config?.researcherName || '';

  // Get the appropriate class name
  const getClassName = () => {
    if (className) return className;
    if (styleVariant) return styleVariant;

    // Use different default styles based on viewType if no styleVariant
    if (viewType === 'list') return 'text-theme-light mb-0.5 text-sm';
    if (viewType === 'card') return 'text-theme-light mb-1 text-sm';
    return 'text-theme-light mb-4 text-sm'; // Default for detail view
  };

  // Get the appropriate label class name
  const getLabelClassName = () => {
    if (viewType === 'list') return componentStyles.AuthorList.label.list;
    if (viewType === 'card') return componentStyles.AuthorList.label.card;
    return componentStyles.AuthorList.label.detail; // Default for detail view
  };

  const listClass = getClassName();
  const labelClass = getLabelClassName();

  return (
    <p className={listClass}>
      {label && <span className={labelClass}>{label}: </span>}
      {renderAuthors(authors, researcherNameToUse)}
    </p>
  );
};

AuthorList.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  label: PropTypes.string,
  config: PropTypes.object,
  researcherName: PropTypes.string,
  className: PropTypes.string,
  styleVariant: PropTypes.string,
  viewType: PropTypes.oneOf(['list', 'card', 'detail']),
};

export default AuthorList;
