import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

/**
 * A direct YouTube embed component that bypasses ReactPlayer
 * This can be used as a fallback when ReactPlayer fails
 */
const YouTubeEmbed = ({ url, width = '100%' }) => {
  const [videoId, setVideoId] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      // Extract video ID from YouTube URL
      let extractedId = null;

      if (url.includes('youtube.com/watch')) {
        // Regular YouTube watch URL
        const urlObj = new URL(url);
        extractedId = urlObj.searchParams.get('v');
      } else if (url.includes('youtu.be/')) {
        // Short YouTube URL
        extractedId = url.split('youtu.be/')[1]?.split(/[?&]/)[0];
      } else if (url.includes('/embed/')) {
        // Embed URL
        const matches = url.match(/\/embed\/([^/?&]+)/);
        if (matches && matches[1]) {
          extractedId = matches[1];
        }
      }

      if (extractedId) {
        setVideoId(extractedId);
        setError(false);
        console.log('YouTube video ID extracted:', extractedId);
      } else {
        console.error('Could not extract YouTube video ID from URL:', url);
        setError(true);
      }
    } catch (err) {
      console.error('Error processing YouTube URL:', err);
      setError(true);
    }
  }, [url]);

  if (error || !videoId) {
    return (
      <div className="text-center p-4 border border-gray-200 rounded-md">
        <p className="text-gray-600">Could not process YouTube video URL</p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline mt-2 inline-block"
        >
          Open video on YouTube
        </a>
      </div>
    );
  }

  return (
    <div className="youtube-embed-container" style={{ width }}>
      <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube video"
        ></iframe>
      </div>
    </div>
  );
};

YouTubeEmbed.propTypes = {
  url: PropTypes.string.isRequired,
  width: PropTypes.string,
};

export default YouTubeEmbed;
