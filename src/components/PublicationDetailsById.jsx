/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import ReactPlayer from 'react-player';
import PublicationLinks from './PublicationLinks';

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

  const entry = entries.find((e) => e.citationKey === id);

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
