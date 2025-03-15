/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import ReactPlayer from 'react-player';
import PublicationLinks from './PublicationLinks';
import { updateMetaTags } from '../utils/utils';
import { generateBibTexEntry, copyBibTexToClipboard } from '../utils/bibTexUtils';

const renderAuthors = (authors, yourName) => {
  return authors.split(', ').map((author, index) => (
    <span key={index} className={author === yourName ? 'underline' : ''}>
      {author}
      {index < authors.split(', ').length - 1 && ', '}
    </span>
  ));
};

const PublicationDetailsById = ({ entries, id, config }) => {
  const yourName = config.researcherName;
  const abstractPreviewLength = config.abstractPreviewLength || 30; // Default if not specified
  const [blogContent, setBlogContent] = useState('');
  const [themeColor, setThemeColor] = useState('');
  const [showFullAbstract, setShowFullAbstract] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showBibTeX, setShowBibTeX] = useState(false);

  const entry = entries.find((e) => e.citationKey === id);

  useEffect(() => {
    if (entry) {
      // Update meta tags for SEO when the publication entry is loaded
      updateMetaTags(entry, window.location.origin);
    }
  }, [entry]);

  useEffect(() => {
    if (entry && entry.entryTags.blogpost) {
      fetch(entry.entryTags.blogpost)
        .then((response) => response.text())
        .then((text) => setBlogContent(text))
        .catch((error) => console.error('Error loading blog post:', error));
    }
  }, [entry]);

  useEffect(() => {
    // Get the computed style of an element with the text-theme class
    const tempElement = document.createElement('div');
    tempElement.className = 'text-theme';
    document.body.appendChild(tempElement);
    const computedStyle = window.getComputedStyle(tempElement);
    setThemeColor(computedStyle.color);
    document.body.removeChild(tempElement);
  }, []);

  const StrongComponent = ({ children }) => (
    <strong style={{ color: themeColor }}>{children}</strong>
  );

  // Check if entries is an array and id is defined
  if (!Array.isArray(entries) || !id) {
    return <div>Invalid entries or id</div>;
  }

  if (!entry) return <div>Publication not found</div>;

  // Function to truncate the abstract
  const truncateAbstract = (abstract) => {
    const words = abstract.split(' ');
    if (words.length <= abstractPreviewLength) return abstract;
    return words.slice(0, abstractPreviewLength).join(' ') + '...';
  };

  // Generate BibTeX once when component mounts or entry changes
  const bibTexEntry = entry ? generateBibTexEntry(entry) : '';

  // Function to copy BibTeX to clipboard
  const copyBibTeX = () => {
    copyBibTexToClipboard(bibTexEntry, setCopySuccess);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{entry.entryTags.title}</h1>

      {entry.entryTags.image && (
        <img src={entry.entryTags.image} alt={entry.entryTags.title} className="w-full mb-4" />
      )}

      <p className="text-theme-light mb-4">
        <b>Authors:</b> {renderAuthors(entry.entryTags.author, yourName)} | Year:{' '}
        {entry.entryTags.year}
      </p>

      <PublicationLinks entryTags={entry.entryTags} showText={true} />

      <div className="bg-abstract  rounded-lg m-2 mt-4 pt-2">
        <h2 className="text-2xl font-semibold m-2 ">Abstract</h2>
        <div className="markdown-content text-theme  p-4 rounded-lg">
          <ReactMarkdown>
            {showFullAbstract
              ? entry.entryTags.abstract
              : truncateAbstract(entry.entryTags.abstract)}
          </ReactMarkdown>
          {entry.entryTags.abstract.split(' ').length > abstractPreviewLength && (
            <button
              onClick={() => setShowFullAbstract(!showFullAbstract)}
              className="text-theme-light hover:underline mt-2"
            >
              {showFullAbstract ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      </div>

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
            <pre className="text-sm overflow-x-auto whitespace-pre-wrap pb-10">{bibTexEntry}</pre>
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

      {entry.entryTags.video && (
        <div className="mb-4">
          <h2 className="text-2xl font-semibold mb-2">Video</h2>
          <div className="flex justify-center items-center">
            <ReactPlayer url={entry.entryTags.video} controls />
          </div>
        </div>
      )}

      {blogContent && (
        <div className="mt-8">
          <div className="prose max-w-none prose-a:text-theme-light text-theme">
            <ReactMarkdown
              components={{
                strong: StrongComponent,
              }}
            >
              {blogContent}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicationDetailsById;
