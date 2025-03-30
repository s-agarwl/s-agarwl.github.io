import PropTypes from 'prop-types';
import { getVideoSourceName, getVideoThumbnail } from '../utils/videoUtils';

/**
 * A component that displays a fallback UI when a video cannot be embedded
 */
const VideoFallback = ({ url, reason }) => {
  const sourceName = getVideoSourceName(url);
  const thumbnailUrl = getVideoThumbnail(url);

  return (
    <div className="video-fallback bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
      <div className="mb-3">
        {thumbnailUrl ? (
          <div className="relative mx-auto" style={{ maxWidth: '320px' }}>
            <img
              src={thumbnailUrl}
              alt="Video thumbnail"
              className="mx-auto rounded-md shadow-sm max-w-full h-auto"
              style={{ opacity: 0.9 }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="white"
                  className="w-6 h-6"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto mb-4 bg-gray-200 rounded-full w-12 h-12 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 text-gray-500"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        )}
      </div>

      <h3 className="text-lg font-medium text-gray-900 mb-2">Video Cannot Be Embedded</h3>

      <p className="text-gray-600 text-sm mb-4">
        {reason ||
          `This video from ${sourceName} cannot be embedded directly due to source restrictions.`}
      </p>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Watch/Download from {sourceName}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 ml-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </a>
    </div>
  );
};

VideoFallback.propTypes = {
  url: PropTypes.string.isRequired,
  reason: PropTypes.string,
};

export default VideoFallback;
