/**
 * Utilities for handling video URLs and embedding
 */

/**
 * Detects the type of video URL
 * @param {string} url - The video URL to check
 * @returns {string|null} - The video type ('youtube', 'vimeo', 'file', 'publisher', 'unknown') or null if invalid
 */
export const getVideoType = (url) => {
  if (!url) return null;

  try {
    // Try to parse URL to handle malformed URLs gracefully
    new URL(url);
  } catch (error) {
    console.error('Invalid URL format:', error.message, url);
    return null;
  }

  // Video platform detection
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('vimeo.com')) return 'vimeo';

  // Academic publisher detection
  if (
    url.includes('wiley.com') ||
    url.includes('ieee.org') ||
    url.includes('springer.com') ||
    url.includes('acm.org') ||
    url.includes('sciencedirect.com') ||
    url.includes('researchgate.net') ||
    url.includes('downloadSupplement')
  )
    return 'publisher';

  // Direct video file detection
  if (url.match(/\.(mp4|webm|ogg|ogv|mov)$/i)) return 'file';

  // Handle other video services if needed
  return 'unknown';
};

/**
 * Determines if a video URL is likely to be directly embeddable
 * @param {string} url - The URL to check
 * @returns {boolean} - Whether the URL is likely embeddable
 */
export const isEmbeddable = (url) => {
  const videoType = getVideoType(url);

  // Known embeddable sources
  if (videoType === 'youtube' || videoType === 'vimeo') return true;

  // Known non-embeddable sources
  if (videoType === 'publisher') return false;

  // For file and unknown types, assume embeddable but it might fail at runtime
  return videoType === 'file';
};

/**
 * Validates if a URL is a supported video URL
 * @param {string} url - The URL to validate
 * @returns {boolean} - Whether the URL is valid and supported
 */
export const isValidVideoUrl = (url) => {
  if (!url) return false;
  const videoType = getVideoType(url);
  return videoType !== null;
};

/**
 * Gets a user-friendly name for the video source
 * @param {string} url - The video URL
 * @returns {string} - A readable source name
 */
export const getVideoSourceName = (url) => {
  if (!url) return 'Unknown Source';

  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube';
  if (url.includes('vimeo.com')) return 'Vimeo';
  if (url.includes('wiley.com')) return 'Wiley Online Library';
  if (url.includes('ieee.org')) return 'IEEE Xplore';
  if (url.includes('springer.com')) return 'Springer';
  if (url.includes('acm.org')) return 'ACM Digital Library';
  if (url.includes('sciencedirect.com')) return 'ScienceDirect';
  if (url.includes('researchgate.net')) return 'ResearchGate';

  return 'External Video';
};

/**
 * Normalizes video URLs for consistent handling
 * @param {string} url - The raw video URL
 * @returns {string} - The normalized URL
 */
export const normalizeVideoUrl = (url) => {
  if (!url) return '';

  try {
    // Convert YouTube short URLs
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split(/[?&]/)[0];
      if (videoId) {
        const normalizedUrl = `https://www.youtube.com/watch?v=${videoId}`;
        console.log('Normalized YouTube short URL to:', normalizedUrl);
        return normalizedUrl;
      }
    }

    // Extract and clean YouTube video IDs from various formats
    if (url.includes('youtube.com')) {
      // If it's a watch URL
      if (url.includes('/watch')) {
        const urlObj = new URL(url);
        const videoId = urlObj.searchParams.get('v');
        if (videoId) {
          const normalizedUrl = `https://www.youtube.com/watch?v=${videoId}`;
          return normalizedUrl;
        }
      }

      // If it's an embed URL
      if (url.includes('/embed/')) {
        const matches = url.match(/\/embed\/([^/?&]+)/);
        if (matches && matches[1]) {
          const videoId = matches[1];
          const normalizedUrl = `https://www.youtube.com/watch?v=${videoId}`;
          return normalizedUrl;
        }
      }
    }

    // Clean up Vimeo URLs
    if (url.includes('vimeo.com')) {
      const vimeoId = url.match(/vimeo\.com\/([0-9]+)/);
      if (vimeoId && vimeoId[1]) {
        const normalizedUrl = `https://vimeo.com/${vimeoId[1]}`;
        return normalizedUrl;
      }
    }

    // Return original URL if no normalization was applied
    return url;
  } catch (error) {
    console.error('Error normalizing video URL:', error);
    return url; // Return original URL in case of error
  }
};

/**
 * Gets configuration for different video platforms
 * @param {string} videoType - The type of video ('youtube', 'vimeo', 'file', 'publisher')
 * @returns {Object} - Configuration object for react-player
 */
export const getVideoConfig = (videoType) => {
  const config = {
    youtube: {
      playerVars: {
        origin: window.location.origin,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        enablejsapi: 1,
        iv_load_policy: 3, // Disable annotations
        playsinline: 1,
      },
      // Don't set embedOptions - this was causing issues
    },
    vimeo: {
      playerOptions: {
        responsive: true,
        autopause: true,
        dnt: true,
        color: '#00adef',
      },
    },
    file: {
      forceVideo: true,
      attributes: {
        controls: true,
        crossOrigin: 'anonymous',
        playsInline: true,
      },
    },
    publisher: {
      // Publishers generally don't allow embedding, so this is just a fallback
      file: {
        forceVideo: true,
        attributes: {
          controls: true,
        },
      },
    },
  };

  return videoType ? config[videoType] || {} : config;
};

/**
 * Get a direct thumbnail URL from a video URL
 * @param {string} url - Video URL
 * @returns {string|null} - Thumbnail URL or null if not available
 */
export const getVideoThumbnail = (url) => {
  const type = getVideoType(url);

  if (type === 'youtube') {
    const videoId = url.includes('watch?v=')
      ? url.split('watch?v=')[1]?.split('&')[0]
      : url.split('youtu.be/')[1]?.split('?')[0];

    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
  }

  // Vimeo thumbnails require API access

  return null;
};
