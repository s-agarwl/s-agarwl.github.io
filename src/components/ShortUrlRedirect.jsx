import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Component to redirect short URLs to their full content URLs
 * @param {Object} props - Component props
 * @param {Object} props.shorturlMap - Mapping of short URLs to their full paths
 */
const ShortUrlRedirect = ({ shorturlMap }) => {
  const { shorturl } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Add debugging to see what shorturlMap contains
    console.log('ShortUrlRedirect - shorturl:', shorturl);
    console.log('ShortUrlRedirect - shorturlMap type:', typeof shorturlMap);
    console.log('ShortUrlRedirect - shorturlMap:', shorturlMap);

    // Check if shorturlMap is a valid object and not empty or a function
    if (shorturlMap && typeof shorturlMap === 'object' && Object.keys(shorturlMap).length > 0) {
      // Check if the shorturl exists in our mapping
      if (shorturlMap[shorturl]) {
        // Redirect to the full URL
        console.log('Redirecting to:', shorturlMap[shorturl]);
        navigate(shorturlMap[shorturl], { replace: true });
        return;
      }
    }

    // If we get here, either shorturlMap is invalid or the shorturl doesn't exist
    console.log('No matching shorturl found, navigating to 404');
    navigate('/not-found', { replace: true });
  }, [shorturl, shorturlMap, navigate]);

  // This component doesn't render anything as it performs a redirect
  return null;
};

ShortUrlRedirect.propTypes = {
  shorturlMap: PropTypes.object,
};

export default ShortUrlRedirect;
