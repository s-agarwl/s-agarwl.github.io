import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ArrowLeftIcon, ShareIcon } from '@heroicons/react/24/solid';
import ReactMarkdown from 'react-markdown';
import '../styles/markdown.css';
import { generateBibTexEntry, copyBibTexToClipboard } from '../utils/bibTexUtils';
import { removeLatexBraces } from '../utils/authorUtils.jsx';
import FieldRenderer from './templates/fields/FieldRenderer';
import { findSectionById } from '../utils/sectionUtils';
import { fieldHasValue, getFieldValue } from '../utils/fieldUtils';
import ShareModal from './ShareModal';
import VideoPlayer from './VideoPlayer';

const GenericItemDetails = ({ item, contentType, config }) => {
  const navigate = useNavigate();
  const [markdownContent, setMarkdownContent] = useState('');
  const [showBibTeX, setShowBibTeX] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Find the section by contentType
  const section = findSectionById(config.sections, contentType);

  // Get display configuration for this content type
  const displayConfig = section?.display?.detail;

  // Get the section title from config
  const getSectionTitle = () => {
    return section?.title || section?.sectionHeading || contentType;
  };

  const sectionTitle = getSectionTitle();

  useEffect(() => {
    if (item) {
      document.title = `${removeLatexBraces(item.title)} | ${config.researcherName}`;
    }
    return () => {
      document.title = config.researcherName;
    };
  }, [item, config.researcherName]);

  useEffect(() => {
    if (item?.markdownContent) {
      fetch(item.markdownContent)
        .then((response) => response.text())
        .then((text) => setMarkdownContent(text))
        .catch((error) => console.error('Error loading blog post:', error));
    }
  }, [item]);

  if (!item) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Item Not Found</h2>
        <p className="mb-4">The item you&apos;re looking for couldn&apos;t be found.</p>
        <Link to={`/${contentType}`} className="text-blue-600 hover:text-blue-800">
          Back to {sectionTitle}
        </Link>
      </div>
    );
  }

  const handleShareClick = () => {
    setIsShareModalOpen(true);
  };

  // Generate BibTeX only for publications
  const bibTexEntry =
    contentType.toLowerCase() === 'publications' && item
      ? generateBibTexEntry(
          {
            entryType: item.entryType,
            citationKey: item.citationKey,
            entryTags: item.bibtex,
          },
          section,
        )
      : '';

  const copyBibTeX = () => {
    if (contentType.toLowerCase() === 'publications') {
      copyBibTexToClipboard(bibTexEntry, setCopySuccess);
    }
  };

  // Convert component to typeOfField for backward compatibility
  const getUpdatedFields = () => {
    if (!displayConfig || !displayConfig.fields) {
      return [];
    }

    return displayConfig.fields.map((field) => ({
      ...field,
      typeOfField: field.typeOfField || field.component, // Use typeOfField if exists, fallback to component
    }));
  };

  const detailFields = getUpdatedFields();

  const renderContent = () => {
    if (!detailFields.length) {
      // Fallback for missing configuration
      return (
        <>
          <h1 className="text-3xl font-bold mb-4">{removeLatexBraces(item.title)}</h1>
          <p className="text-theme-light mb-4">{item.description}</p>
        </>
      );
    }

    return (
      <>
        {detailFields.map((fieldConfig, index) => {
          // Get the field value using utility function
          const fieldValue = getFieldValue(item, fieldConfig.field);

          // Skip fields that don't have meaningful values
          if (!fieldHasValue(fieldValue)) return null;

          // Note: FieldRenderer will extract and utilize properties like 'heading', 'label',
          // 'typeOfField', 'tagSet', etc. from the fieldConfig object
          return (
            <FieldRenderer
              key={index}
              component={fieldConfig.typeOfField} // For backward compatibility
              field={fieldConfig.field}
              value={fieldValue}
              config={fieldConfig}
              item={item}
              globalConfig={config}
              viewType="detail"
              researcherName={
                fieldConfig.typeOfField === 'AuthorList' ? config.researcherName : undefined
              }
            />
          );
        })}

        {/* Handle special actions */}
        {displayConfig.actions?.map((action, index) => {
          // For actions, check if the condition path has a value
          const actionShouldDisplay = action.condition
            ? fieldHasValue(getFieldValue(item, action.condition))
            : true;

          if (!actionShouldDisplay) return null;

          switch (action.type) {
            case 'BibTeX':
              return (
                <div key={index} className="mt-6">
                  <button
                    onClick={() => setShowBibTeX(!showBibTeX)}
                    className="flex items-center text-theme-light hover:underline mb-2"
                  >
                    <span className="mr-2">{showBibTeX ? '▼' : '►'}</span>
                    <span>BibTeX Citation</span>
                  </button>

                  {showBibTeX && (
                    <div className="bg-gray-100 p-4 rounded-lg relative">
                      <pre className="text-sm overflow-x-auto whitespace-pre-wrap pb-10">
                        {bibTexEntry}
                      </pre>
                      <button
                        onClick={copyBibTeX}
                        className="absolute bottom-2 right-2 bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 flex items-center shadow-md border border-blue-700"
                        title="Copy to clipboard"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                          />
                        </svg>
                        {copySuccess ? 'Copied!' : 'Copy BibTeX'}
                      </button>
                    </div>
                  )}
                </div>
              );
            case 'Video':
              return (
                item.links?.video && (
                  <div key={index} className="mb-4 mt-4">
                    <div className="flex justify-center items-center w-full">
                      <div className="w-full max-w-2xl mx-auto">
                        <VideoPlayer url={item.links.video} aspectRatio="16:9" />
                      </div>
                    </div>
                  </div>
                )
              );
            default:
              return null;
          }
        })}
      </>
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={() => navigate(`/${contentType}`)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          <span>Back to {sectionTitle}</span>
        </button>

        <button
          onClick={handleShareClick}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ShareIcon className="h-5 w-5 mr-1" />
          <span>Share</span>
        </button>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        url={window.location.href}
      />

      <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">{renderContent()}</div>

      {markdownContent && (
        <div className="mt-8">
          <div className="markdown-content">
            <ReactMarkdown>{markdownContent}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

GenericItemDetails.propTypes = {
  item: PropTypes.object.isRequired,
  contentType: PropTypes.string.isRequired,
  config: PropTypes.object.isRequired,
};

export default GenericItemDetails;
