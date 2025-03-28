import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ArrowLeftIcon, ShareIcon } from '@heroicons/react/24/solid';
import ReactMarkdown from 'react-markdown';
import '../styles/markdown.css';
import ReactPlayer from 'react-player';
import { generateBibTexEntry, copyBibTexToClipboard } from '../utils/bibTexUtils';
import { removeLatexBraces } from '../utils/authorUtils.jsx';
import FieldRenderer from './templates/fields/FieldRenderer';
import { findSectionById } from '../utils/sectionUtils';

const GenericItemDetails = ({ item, contentType, config }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [markdownContent, setMarkdownContent] = useState('');
  const [showBibTeX, setShowBibTeX] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

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

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate BibTeX only for publications
  const bibTexEntry =
    contentType.toLowerCase() === 'publications' && item
      ? generateBibTexEntry({
          entryType: item.entryType,
          citationKey: item.citationKey,
          entryTags: item.bibtex,
        })
      : '';

  const copyBibTeX = () => {
    if (contentType.toLowerCase() === 'publications') {
      copyBibTexToClipboard(bibTexEntry, setCopySuccess);
    }
  };

  const renderContent = () => {
    if (!displayConfig || !displayConfig.fields) {
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
        {displayConfig.fields.map((fieldConfig, index) => (
          <FieldRenderer
            key={index}
            field={fieldConfig.field}
            value={item[fieldConfig.field]}
            config={fieldConfig}
            item={item}
            globalConfig={config}
          />
        ))}

        {/* Handle special actions */}
        {displayConfig.actions?.map((action, index) => {
          // Check if the action should be displayed
          if (action.condition) {
            const path = action.condition.split('.');
            let conditionValue = item;
            for (const key of path) {
              if (!conditionValue || !conditionValue[key]) return null;
              conditionValue = conditionValue[key];
            }
          }

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
                    <div className="flex justify-center items-center">
                      <ReactPlayer url={item.links.video} controls />
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
          onClick={handleCopyLink}
          className="flex items-center text-gray-600 hover:text-gray-900 relative"
        >
          <ShareIcon className="h-5 w-5 mr-1" />
          <span>Share</span>
          {copied && (
            <span className="absolute top-full right-0 mt-1 bg-gray-800 text-white text-xs py-1 px-2 rounded">
              Link copied!
            </span>
          )}
        </button>
      </div>

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
