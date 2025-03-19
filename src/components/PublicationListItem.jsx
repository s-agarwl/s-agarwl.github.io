import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import PublicationLinks from './PublicationLinks';
import { TrophyIcon } from '@heroicons/react/24/solid';

const PublicationListItem = ({ entry, config }) => {
  const yourName = config?.researcherName || '';
  const navigate = useNavigate();

  const handleItemClick = (e) => {
    // Prevent navigation if the click was on a link
    if (e.target.closest('a')) return;
    navigate(`/publication/${entry.citationKey}`);
  };

  const renderAuthors = (authors) => {
    return authors.split(', ').map((author, index) => (
      <span key={index} className={author === yourName ? 'font-semibold' : ''}>
        {author}
        {index < authors.split(', ').length - 1 && ', '}
      </span>
    ));
  };

  // Create venue information
  const getVenueInfo = () => {
    if (entry.entryTags.journal) {
      return `${entry.entryTags.journal}`;
    } else if (entry.entryTags.booktitle) {
      return `${entry.entryTags.booktitle}`;
    }
    return '';
  };

  const venueInfo = getVenueInfo();

  return (
    <div
      onClick={handleItemClick}
      className="border-b border-gray-200 py-2 px-3 hover:bg-gray-50 cursor-pointer"
    >
      <div className="flex items-center gap-1.5">
        {/* Image with responsive size */}
        {entry.entryTags.image && (
          <div className="hidden sm:block flex-shrink-0">
            <img
              src={entry.entryTags.image}
              alt={entry.entryTags.title}
              className="h-12 w-12 object-cover rounded-md shadow-sm"
            />
          </div>
        )}

        <div className="flex-grow min-w-0 ml-1">
          <h3 className="text-base font-semibold text-gray-700 truncate mb-0.5 mt-1">
            {entry.entryTags.title}
          </h3>
          <div className="flex flex-col text-sm">
            <p className="text-gray-600 truncate m-0">{renderAuthors(entry.entryTags.author)}</p>
            {venueInfo && (
              <p className="text-gray-500 italic m-0">
                {venueInfo}, {entry.entryTags.year}
              </p>
            )}
          </div>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end self-start sm:self-center ml-auto flex-shrink-0">
          <PublicationLinks entryTags={entry.entryTags} />
          {entry.entryTags.awards && (
            <div className="flex items-center text-xs text-white bg-blue-600 rounded-md px-1.5 py-0.5 opacity-90 mt-1 sm:mt-1.5 ml-2 sm:ml-0">
              <TrophyIcon className="h-3 w-3 mr-0.5" />
              <span className="hidden sm:inline">{entry.entryTags.awards}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

PublicationListItem.propTypes = {
  entry: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
};

export default PublicationListItem;
