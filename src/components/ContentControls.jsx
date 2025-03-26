import PropTypes from 'prop-types';
import { XCircleIcon } from '@heroicons/react/24/solid';
import { FaThLarge, FaList } from 'react-icons/fa';

const ContentControls = ({
  contentType,
  searchTerm,
  onSearchChange,
  onClearSearch,
  viewMode,
  onViewModeChange,
}) => {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between space-y-4 sm:space-y-0">
      <div className="w-full sm:w-auto flex-grow">
        <div className="relative">
          <input
            type="text"
            placeholder={`Search ${contentType}...`}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchTerm && (
            <button
              onClick={onClearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <XCircleIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end w-full sm:w-auto ml-4">
        <div
          className="inline-flex items-center rounded-md shadow-sm"
          role="group"
          aria-label="View mode"
        >
          <button
            type="button"
            onClick={() => onViewModeChange('grid')}
            aria-label="Grid View"
            className={`${
              viewMode === 'grid'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:text-gray-900 hover:bg-gray-50'
            } tooltip-container relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-l-md border border-gray-300 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <FaThLarge className="h-5 w-5" />
            <span className="tooltip">Grid View</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('list')}
            aria-label="Compact View"
            className={`${
              viewMode === 'list'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:text-gray-900 hover:bg-gray-50'
            } tooltip-container relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-r-md border border-gray-300 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <FaList className="h-5 w-5" />
            <span className="tooltip">Compact View</span>
          </button>
        </div>
      </div>
    </div>
  );
};

ContentControls.propTypes = {
  contentType: PropTypes.string.isRequired,
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onClearSearch: PropTypes.func.isRequired,
  viewMode: PropTypes.oneOf(['grid', 'list']).isRequired,
  onViewModeChange: PropTypes.func.isRequired,
};

export default ContentControls;
