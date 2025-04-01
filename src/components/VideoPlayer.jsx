import { lazy, Suspense, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from './ErrorBoundary';
import VideoFallback from './VideoFallback';
import YouTubeEmbed from './YouTubeEmbed';
import {
  getVideoType,
  isValidVideoUrl,
  normalizeVideoUrl,
  getVideoConfig,
  isEmbeddable,
} from '../utils/videoUtils';

// Import ReactPlayer lazily to avoid SSR issues
const ReactPlayer = lazy(() => import('react-player/lazy'));

const VideoPlayer = ({ url, aspectRatio = '16:9' }) => {
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [useDirectEmbed, setUseDirectEmbed] = useState(false);
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(null);
  const videoType = getVideoType(url);
  const normalizedUrl = normalizeVideoUrl(url);
  const canEmbed = isEmbeddable(url);
  const playerRef = useRef(null);

  // For YouTube videos, we'll try ReactPlayer first, but fall back to direct embed if it fails
  useEffect(() => {
    // Reset state when URL changes
    setIsPlayerReady(false);
    setHasError(false);
    setErrorMessage('');
    setUseDirectEmbed(false);

    console.log(`Video player initialized for ${url} (type: ${videoType})`);

    // If it's a YouTube video and we've had issues with ReactPlayer, try direct embed
    if (videoType === 'youtube') {
      const failedAttemptKey = `yt_failed_${normalizedUrl}`;
      const hasFailedBefore = localStorage.getItem(failedAttemptKey);

      if (hasFailedBefore) {
        console.log('Previous ReactPlayer failure for this URL, using direct embed');
        setUseDirectEmbed(true);
      }
    }

    return () => {
      console.log(`Video player cleanup for ${url}`);
    };
  }, [url, videoType, normalizedUrl]);

  // Calculate container width on mount and on resize
  useEffect(() => {
    // Skip for non-embeddable sources
    if (!canEmbed) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    // Initial calculation
    updateDimensions();

    // Add resize listener
    window.addEventListener('resize', updateDimensions);

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [canEmbed]);

  // Calculate aspect ratio
  const calculatePlayerDimensions = () => {
    if (!containerWidth) return { width: '100%', height: '100%' };

    // Parse aspect ratio
    const [widthRatio, heightRatio] = aspectRatio.split(':').map(Number);
    const aspectRatioValue = heightRatio / widthRatio;

    const height = containerWidth * aspectRatioValue;

    return {
      width: '100%',
      height: `${height}px`,
    };
  };

  const playerDimensions = calculatePlayerDimensions();

  const handleReady = () => {
    setIsPlayerReady(true);
    setHasError(false);
    setErrorMessage('');
  };

  const handleError = (e) => {
    console.error('Video player error:', e);

    // For YouTube videos, try direct embed before showing fallback
    if (videoType === 'youtube' && !useDirectEmbed) {
      console.log('Switching to direct YouTube embed');
      setUseDirectEmbed(true);

      // Remember this failure for this URL
      const failedAttemptKey = `yt_failed_${normalizedUrl}`;
      localStorage.setItem(failedAttemptKey, 'true');

      return;
    }

    setHasError(true);
    setIsPlayerReady(false);

    // Try to extract a meaningful error message
    let errorMsg = 'Could not load the video player.';

    if (e?.target?.error?.message) {
      errorMsg = e.target.error.message;
    } else if (e?.message) {
      errorMsg = e.message;
    } else if (videoType === 'youtube') {
      errorMsg = 'YouTube player could not be initialized. This might be due to privacy settings.';
    } else if (videoType === 'vimeo') {
      errorMsg = 'Vimeo player could not be initialized. This might be due to privacy settings.';
    }

    setErrorMessage(errorMsg);
    console.error(`Video error for ${url}: ${errorMsg}`);
  };

  // Skip embedding attempt for non-embeddable sources
  if (!canEmbed) {
    return <VideoFallback url={url} />;
  }

  // Don't render if URL is invalid
  if (!isValidVideoUrl(url)) {
    return (
      <div className="text-center p-4 border border-gray-200 rounded-md">
        <p className="text-gray-600">Invalid or unsupported video URL</p>
      </div>
    );
  }

  // If it's YouTube and we're using direct embed
  if (videoType === 'youtube' && useDirectEmbed) {
    return <YouTubeEmbed url={normalizedUrl} width="100%" />;
  }

  // If we already know there's an error, show fallback
  if (hasError) {
    return <VideoFallback url={url} reason={errorMessage} />;
  }

  return (
    <ErrorBoundary
      fallback={
        videoType === 'youtube' ? <YouTubeEmbed url={normalizedUrl} /> : <VideoFallback url={url} />
      }
    >
      <div className="video-player-container w-full" ref={containerRef}>
        <Suspense
          fallback={
            <div className="p-4 text-center bg-gray-100 rounded-md">Loading video player...</div>
          }
        >
          {containerWidth ? (
            <div
              className={`react-player-wrapper relative ${isPlayerReady ? 'opacity-100' : 'opacity-0'}`}
              style={{
                width: '100%',
                transition: 'opacity 0.3s',
                position: 'relative',
                paddingTop: videoType === 'youtube' ? '56.25%' : '0', // 16:9 aspect ratio for YouTube
              }}
            >
              <ReactPlayer
                ref={playerRef}
                url={normalizedUrl}
                controls
                width={videoType === 'youtube' ? '100%' : playerDimensions.width}
                height={videoType === 'youtube' ? '100%' : playerDimensions.height}
                style={videoType === 'youtube' ? { position: 'absolute', top: 0, left: 0 } : {}}
                onReady={handleReady}
                onError={handleError}
                config={getVideoConfig(videoType)}
                fallback={<div className="p-4 text-center">Loading video...</div>}
                playing={false}
                playsinline
                light={false}
              />
            </div>
          ) : (
            <div className="p-4 text-center bg-gray-100 rounded-md">Initializing player...</div>
          )}
        </Suspense>
      </div>
    </ErrorBoundary>
  );
};

VideoPlayer.propTypes = {
  url: PropTypes.string.isRequired,
  aspectRatio: PropTypes.string,
};

export default VideoPlayer;
