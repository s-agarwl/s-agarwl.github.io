import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/generalStyles.css';
import { getTagConfig, applyTagColors, getTagDisplayText } from '../utils/tagUtils';

const KeywordCloud = ({
  items,
  sourceFields,
  selectedKeywords,
  onKeywordClick,
  section,
  globalConfig,
}) => {
  // State to track which fields are expanded to show all keywords
  const [expandedFields, setExpandedFields] = useState({});

  // Extract and count keywords from all items, grouped by field
  const keywordDataByField = useMemo(() => {
    const result = {};

    // Initialize result object with empty arrays for each field
    sourceFields.forEach((fieldConfig) => {
      result[fieldConfig.field] = [];
    });

    // Process each field separately
    sourceFields.forEach((fieldConfig) => {
      const field = fieldConfig.field;
      const keywordCounts = {};

      items.forEach((item) => {
        if (item[field]) {
          const keywords = Array.isArray(item[field])
            ? item[field]
            : typeof item[field] === 'string'
              ? item[field].split(',').map((k) => k.trim())
              : [item[field]];

          keywords.forEach((keyword) => {
            if (keyword && typeof keyword === 'string') {
              const key = keyword.trim();
              if (key) {
                keywordCounts[key] = (keywordCounts[key] || 0) + 1;
              }
            }
          });
        }
      });

      // Convert to array and sort by frequency, then alphabetically for same frequency
      result[field] = Object.entries(keywordCounts)
        .map(([keyword, count]) => ({ keyword, count, field }))
        .sort((a, b) => {
          // First sort by count (descending)
          if (b.count !== a.count) {
            return b.count - a.count;
          }
          // Then sort alphabetically (ascending) if counts are equal
          return a.keyword.localeCompare(b.keyword);
        });
    });

    return result;
  }, [items, sourceFields]);

  // Calculate global min and max counts across all fields
  const { globalMinCount, globalMaxCount } = useMemo(() => {
    // Flatten all keyword data across all fields
    const allCounts = [];
    Object.values(keywordDataByField).forEach((fieldData) => {
      fieldData.forEach((item) => {
        allCounts.push(item.count);
      });
    });

    if (allCounts.length === 0) {
      return { globalMinCount: 0, globalMaxCount: 0 };
    }

    return {
      globalMinCount: Math.min(...allCounts),
      globalMaxCount: Math.max(...allCounts),
    };
  }, [keywordDataByField]);

  // Calculate font size based on frequency using global scale
  const getFontSize = (count) => {
    if (globalMinCount === globalMaxCount) return 16; // Default size if all counts are the same

    // Get custom min/max sizes from config or use defaults
    const minSize = section?.overviewVisualization?.fontSizes?.min || 11;
    const maxSize = section?.overviewVisualization?.fontSizes?.max || 22;

    return (
      minSize + ((count - globalMinCount) / (globalMaxCount - globalMinCount)) * (maxSize - minSize)
    );
  };

  // Check if any field has keywords
  const hasKeywords = useMemo(() => {
    return Object.values(keywordDataByField).some((fieldData) => fieldData.length > 0);
  }, [keywordDataByField]);

  // Toggle expanded state for a field
  const toggleFieldExpanded = (field) => {
    setExpandedFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Get tag styles for a specific field and tagSet
  const getTagStyle = (fieldConfig, keyword, count) => {
    // Include default color classes that can be replaced by applyTagColors
    let baseClasses =
      'cursor-pointer px-2 inline-block keyword-cloud-item bg-gray-100 text-gray-700';

    // Add selected class if keyword is selected
    if (selectedKeywords.includes(keyword)) {
      baseClasses += ' selectedKeywords';
    }

    // Get tag configuration and apply color from tagSet if available
    if (fieldConfig.tagSet) {
      const tagConfig = getTagConfig(keyword, fieldConfig.tagSet, globalConfig);
      if (tagConfig) {
        baseClasses = applyTagColors(baseClasses, tagConfig);
      }
    }

    return {
      className: baseClasses,
      style: { fontSize: `${getFontSize(count)}px` },
    };
  };

  if (!hasKeywords) {
    return null;
  }

  return (
    <div className="keyword-cloud-container">
      <h4 className="text-lg font-bold text-gray-800 mb-0 text-center">
        Overview via interactive word-cloud
      </h4>
      <div className="flex justify-end items-center mb-1">
        <button
          className={`text-xs font-medium ${
            selectedKeywords.length > 0 ? 'text-blue-600 hover:text-blue-800' : 'text-gray-400'
          }`}
          onClick={() => onKeywordClick('__clear_all__')}
          disabled={selectedKeywords.length === 0}
        >
          Clear all
        </button>
      </div>

      <div className="gap-1">
        {sourceFields.map((fieldConfig) => {
          const field = fieldConfig.field;
          const fieldData = keywordDataByField[field];
          if (fieldData.length === 0) return null;

          const fieldLabel = fieldConfig.label || field;

          // Get the max visible keywords from config, default to showing all if not specified
          const maxVisible = section?.overviewVisualization?.maxVisibleKeywords || fieldData.length;
          const isExpanded = expandedFields[field] || false;

          // Slice the keywords array based on expanded state
          const visibleKeywords = isExpanded ? fieldData : fieldData.slice(0, maxVisible);
          const hasMore = fieldData.length > maxVisible;

          return (
            <div key={field} className="mb-2 mt-2">
              <div className="items-start">
                <span className="text-sm font-bold text-gray-700 mr-1">{fieldLabel}:</span>
                <div className="inline gap-1 items-center">
                  {visibleKeywords.map(({ keyword, count }) => {
                    const { className, style } = getTagStyle(fieldConfig, keyword, count);

                    let displayText = keyword;
                    if (fieldConfig.tagSet) {
                      const tagConfig = getTagConfig(keyword, fieldConfig.tagSet, globalConfig);
                      displayText = getTagDisplayText(keyword, tagConfig);
                    }

                    return (
                      <span
                        key={`${field}-${keyword}`}
                        className={className}
                        style={style}
                        onClick={() => onKeywordClick(keyword)}
                        title={`${displayText} (${count} items)`}
                      >
                        {displayText}
                        <sub>{count}</sub>
                      </span>
                    );
                  })}
                  {hasMore && (
                    <button
                      className="text-xs text-blue-600 hover:text-blue-800 ml-1"
                      onClick={() => toggleFieldExpanded(field)}
                    >
                      {isExpanded ? 'Show less' : 'Show all'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

KeywordCloud.propTypes = {
  items: PropTypes.array.isRequired,
  sourceFields: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      label: PropTypes.string,
      tagSet: PropTypes.string,
    }),
  ).isRequired,
  selectedKeywords: PropTypes.arrayOf(PropTypes.string).isRequired,
  onKeywordClick: PropTypes.func.isRequired,
  section: PropTypes.object.isRequired,
  globalConfig: PropTypes.object.isRequired,
};

export default KeywordCloud;
