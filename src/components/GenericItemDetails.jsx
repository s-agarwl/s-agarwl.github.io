import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ArrowLeftIcon, ShareIcon, TrophyIcon } from '@heroicons/react/24/solid';
import ReactMarkdown from 'react-markdown';
import '../styles/markdown.css';
import ReactPlayer from 'react-player';
import PublicationLinks from './PublicationLinks';
import { generateBibTexEntry, copyBibTexToClipboard } from '../utils/bibTexUtils';
import { renderAuthors, removeLatexBraces } from '../utils/authorUtils.jsx';

const GenericItemDetails = ({ item, contentType, config }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [markdownContent, setMarkdownContent] = useState('');
  const [showFullAbstract, setShowFullAbstract] = useState(false);
  const [showBibTeX, setShowBibTeX] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const yourName = config?.researcherName || '';

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
          Back to {contentType}
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

  const truncateAbstract = (abstract) => {
    const words = abstract.split(' ');
    const abstractPreviewLength = config.abstractPreviewLength || 30;
    if (words.length <= abstractPreviewLength) return abstract;
    return words.slice(0, abstractPreviewLength).join(' ') + '...';
  };

  const renderLinks = (links) => {
    if (!links || Object.keys(links).length === 0) return null;
    return (
      <div className="flex flex-wrap gap-2">
        {Object.entries(links).map(([key, url]) => (
          <a
            key={key}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 inline-flex items-center bg-blue-50 hover:bg-blue-100 rounded px-3 py-1"
          >
            {key}
          </a>
        ))}
      </div>
    );
  };

  const renderTechnologies = (technologies) => {
    if (!technologies) return null;
    return (
      <div className="flex flex-wrap gap-2">
        {(Array.isArray(technologies) ? technologies : [technologies]).map((tech, index) => (
          <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md">
            {tech}
          </span>
        ))}
      </div>
    );
  };

  const renderDetailsGrid = (details, links) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Details</h2>
          {details}
        </div>
        {links && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Links</h2>
            {renderLinks(links)}
          </div>
        )}
      </div>
    );
  };

  // Generate BibTeX only for publications
  const bibTexEntry =
    contentType === 'publications' && item
      ? generateBibTexEntry({
          entryType: item.entryType,
          citationKey: item.citationKey,
          entryTags: item.bibtex,
        })
      : '';

  const copyBibTeX = () => {
    if (contentType === 'publications') {
      copyBibTexToClipboard(bibTexEntry, setCopySuccess);
    }
  };

  const renderContent = () => {
    switch (contentType) {
      case 'publications':
        return (
          <>
            <h1 className="text-3xl font-bold mb-4 text-center">{removeLatexBraces(item.title)}</h1>
            {item.image && (
              <img
                src={item.image}
                alt={removeLatexBraces(item.title)}
                className="w-3/4  mb-4 mx-auto"
              />
            )}
            {item.awards && (
              <div className="mt-1 inline-flex items-center text-white bg-blue-600 rounded-md px-4 py-0.5 mb-2">
                <TrophyIcon className="h-3 w-3 mr-0.5" />
                <span>{item.awards}</span>
              </div>
            )}
            <p className="text-theme-light mb-4">
              <b>Authors:</b> {renderAuthors(item.authors, yourName)} | Year: {item.year}
            </p>
            {item.journal && (
              <p className="text-theme-light mb-4">
                <b>Journal:</b> {removeLatexBraces(item.journal)}
              </p>
            )}
            {item.booktitle && (
              <p className="text-theme-light mb-4">
                <b>Conference:</b> {removeLatexBraces(item.booktitle)}
              </p>
            )}
            <PublicationLinks entryTags={item} showText={true} />
            {item.abstract && (
              <div className="bg-abstract rounded-lg m-2 mt-4 pt-2">
                <h2 className="text-2xl font-semibold m-2">Abstract</h2>
                <div className="markdown-content text-theme p-4 rounded-lg">
                  <ReactMarkdown>
                    {showFullAbstract ? item.abstract : truncateAbstract(item.abstract)}
                  </ReactMarkdown>
                  {item.abstract.split(' ').length > (config.abstractPreviewLength || 30) && (
                    <button
                      onClick={() => setShowFullAbstract(!showFullAbstract)}
                      className="text-theme-light hover:underline mt-2"
                    >
                      {showFullAbstract ? 'Show less' : 'Show more'}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* BibTeX Citation Section */}
            <div className="mt-6">
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

            {item.links.video && (
              <div className="mb-4 mt-4">
                {/* <h2 className="text-2xl font-semibold mb-2">Video</h2> */}
                <div className="flex justify-center items-center">
                  <ReactPlayer url={item.links.video} controls />
                </div>
              </div>
            )}
          </>
        );

      case 'projects':
        return (
          <>
            <h1 className="text-3xl font-bold mb-4">{item.title}</h1>
            <p className="text-theme-light mb-4">{item.description}</p>
            {item.status && (
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-1">Status</h3>
                <p>{item.status}</p>
              </div>
            )}
            {item.technologies && (
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-1">Technologies</h3>
                {renderTechnologies(item.technologies)}
              </div>
            )}
            {item.collaborators && (
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-1">Collaborators</h3>
                <p>{item.collaborators}</p>
              </div>
            )}
            {item.links && (
              <div className="mt-4">
                <h2 className="text-xl font-semibold mb-2">Links</h2>
                {renderLinks(item.links)}
              </div>
            )}
          </>
        );

      case 'talks':
        return (
          <>
            <h1 className="text-3xl font-bold mb-4">{item.title}</h1>
            <p className="text-theme-light mb-4">{item.description}</p>
            {renderDetailsGrid(
              <>
                <p className="text-theme-light">Date: {item.date}</p>
                {item.venue && <p className="text-theme-light">Venue: {item.venue}</p>}
                {item.talkType && <p className="text-theme-light">Type: {item.talkType}</p>}
                {item.duration && <p className="text-theme-light">Duration: {item.duration}</p>}
              </>,
              item.links,
            )}
          </>
        );

      case 'teaching':
        return (
          <>
            <h1 className="text-3xl font-bold mb-4">{item.title}</h1>
            <p className="text-theme-light mb-4">{item.description}</p>
            {renderDetailsGrid(
              <>
                <p className="text-theme-light">Institution: {item.institution}</p>
                <p className="text-theme-light">Period: {item.period}</p>
                {item.course && <p className="text-theme-light">Course: {item.course}</p>}
                {item.semester && <p className="text-theme-light">Semester: {item.semester}</p>}
                {item.level && <p className="text-theme-light">Level: {item.level}</p>}
              </>,
              item.links,
            )}
          </>
        );

      case 'blog':
        return (
          <>
            <h1 className="text-3xl font-bold mb-4">{item.title}</h1>
            <p className="text-theme-light mb-4">{item.description}</p>
            <div className="flex items-center gap-4 mb-4">
              <p className="text-theme-light">Date: {item.date}</p>
              {item.tags && (
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {item.content && (
              <div className="markdown-content">
                <ReactMarkdown>{item.content}</ReactMarkdown>
              </div>
            )}
          </>
        );

      default:
        return (
          <>
            <h1 className="text-3xl font-bold mb-4">{item.title}</h1>
            <p className="text-theme-light mb-4">{item.description}</p>
          </>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={() => navigate(`/${contentType}`)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          <span>Back to {contentType}</span>
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
