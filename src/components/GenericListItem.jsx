import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { TrophyIcon } from '@heroicons/react/24/solid';
import { renderAuthors, removeLatexBraces } from '../utils/authorUtils.jsx';

const GenericListItem = ({ item, contentType, config }) => {
  const navigate = useNavigate();
  const yourName = config?.researcherName || '';

  const handleItemClick = (e) => {
    // Prevent navigation if the click was on a link
    if (e.target.closest('a')) return;
    navigate(`/${contentType}/${item.id}`);
  };

  const renderContent = () => {
    switch (contentType) {
      case 'publications':
        return (
          <>
            <h3 className="text-base font-semibold text-gray-700 truncate mb-0.5 mt-1">
              {removeLatexBraces(item.title)}
            </h3>
            <div className="flex flex-col text-sm">
              <p className="text-gray-600 truncate m-0">
                Authors: {renderAuthors(item.authors, yourName)}
              </p>
              <p className="text-gray-500 italic m-0">
                {item.journal || item.booktitle}, {item.year}
              </p>
            </div>
            {item.awards && (
              <div className="inline-flex items-center text-xs text-white bg-blue-600 rounded-md px-1.5 py-0.5 opacity-90">
                <TrophyIcon className="h-3 w-3 mr-0.5" />
                <span>{item.awards}</span>
              </div>
            )}
          </>
        );
      case 'projects':
        return (
          <>
            <h3 className="text-base font-semibold text-gray-700 truncate mb-0.5 mt-1">
              {item.title}
            </h3>
            <p className="text-gray-600 truncate m-0">{item.description}</p>
            {item.technologies && (
              <div className="flex flex-wrap gap-1 mt-1">
                {(Array.isArray(item.technologies) ? item.technologies : [item.technologies]).map(
                  (tech, index) => (
                    <span
                      key={index}
                      className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded-md text-xs"
                    >
                      {tech}
                    </span>
                  ),
                )}
              </div>
            )}
          </>
        );
      case 'talks':
        return (
          <>
            <h3 className="text-base font-semibold text-gray-700 truncate mb-0.5 mt-1">
              {item.title}
            </h3>
            <p className="text-gray-600 truncate m-0">{item.description}</p>
            <p className="text-gray-500 italic m-0">
              {item.venue}, {item.date}
            </p>
          </>
        );
      case 'teaching':
        return (
          <>
            <h3 className="text-base font-semibold text-gray-700 truncate mb-0.5 mt-1">
              {item.title}
            </h3>
            <p className="text-gray-600 truncate m-0">{item.description}</p>
            <p className="text-gray-500 italic m-0">
              {item.institution}, {item.period}
            </p>
          </>
        );
      case 'blog':
        return (
          <>
            <h3 className="text-base font-semibold text-gray-700 truncate mb-0.5 mt-1">
              {item.title}
            </h3>
            <p className="text-gray-600 truncate m-0">{item.description}</p>
            <p className="text-gray-500 italic m-0">{item.date}</p>
            {item.tags && (
              <div className="flex flex-wrap gap-1 mt-1">
                {item.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded-md text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </>
        );
      default:
        return (
          <>
            <h3 className="text-base font-semibold text-gray-700 truncate mb-0.5 mt-1">
              {item.title}
            </h3>
            <p className="text-gray-600 truncate m-0">{item.description}</p>
          </>
        );
    }
  };

  return (
    <div
      onClick={handleItemClick}
      className="border-b border-gray-200 py-2 px-3 hover:bg-gray-50 cursor-pointer"
    >
      <div className="flex flex-col gap-2">
        {/* Main content */}
        <div className="flex items-center gap-1.5">
          {/* Image with responsive size */}
          {item.image && (
            <div className="hidden sm:block flex-shrink-0">
              <img
                src={item.image}
                alt={removeLatexBraces(item.title)}
                className="h-12 w-12 object-cover rounded-md shadow-sm"
              />
            </div>
          )}

          <div className="flex-grow min-w-0 ml-1">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

GenericListItem.propTypes = {
  item: PropTypes.object.isRequired,
  contentType: PropTypes.string.isRequired,
  config: PropTypes.object.isRequired,
};

export default GenericListItem;
