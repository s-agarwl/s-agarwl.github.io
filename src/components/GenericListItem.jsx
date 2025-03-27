import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import FieldRenderer from './fields/FieldRenderer';
import { findSectionById } from '../utils/sectionUtils';

const GenericListItem = ({ item, contentType, config }) => {
  const navigate = useNavigate();

  // Find the section by contentType
  const section = findSectionById(config.sections, contentType);

  // Get list display configuration from config
  const listConfig = section?.display?.list;

  const handleItemClick = (e) => {
    // Prevent navigation if the click was on a link
    if (e.target.closest('a')) return;
    navigate(`/${contentType}/${item.id}`);
  };

  const renderContent = () => {
    if (!listConfig || !listConfig.fields) {
      // Fallback for missing configuration
      return (
        <>
          <h3 className="text-base font-semibold text-gray-700 truncate mb-0.5 mt-1">
            {item.title}
          </h3>
          <p className="text-gray-600 truncate m-0">{item.description}</p>
        </>
      );
    }

    return (
      <>
        {listConfig.fields.map((fieldConfig, index) => (
          <FieldRenderer
            key={index}
            field={fieldConfig.field}
            value={item[fieldConfig.field]}
            config={fieldConfig}
            item={item}
            globalConfig={config}
            viewType="list"
          />
        ))}
      </>
    );
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
          {/* {item.image && listConfig?.showImage && (
            <div className="hidden sm:block flex-shrink-0">
              <img
                src={item.image}
                alt={item.title}
                className="h-12 w-12 object-cover rounded-md shadow-sm"
              />
            </div>
          )} */}

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
