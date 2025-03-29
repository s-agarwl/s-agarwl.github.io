import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Component to redirect short URLs to their full content URLs
 * @param {Object} props - Component props
 * @param {Object} props.shorturlMap - Mapping of short URLs to their full paths
 * @param {Object} props.config - Site configuration
 */
const ShortUrlRedirect = ({ shorturlMap, config }) => {
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
        const targetPath = shorturlMap[shorturl];

        // Check if this is pointing to a hidden section
        if (config && config.sections) {
          // Extract section path from targetPath (e.g., /publications/paper-id -> /publications)
          const sectionPath = '/' + targetPath.split('/')[1];

          // Check if the section is hidden
          const isHiddenSection = config.sections.some(
            (section) => section.path === sectionPath && section.hideSection,
          );

          if (isHiddenSection) {
            console.log('Target section is hidden, redirecting to not-found');
            navigate('/not-found', { replace: true });
            return;
          }
        }

        // Redirect to the full URL if not hidden
        console.log('Redirecting to:', targetPath);
        navigate(targetPath, { replace: true });
        return;
      }
    }

    // If we get here, either shorturlMap is invalid or the shorturl doesn't exist
    console.log('No matching shorturl found, navigating to 404');
    navigate('/not-found', { replace: true });
  }, [shorturl, shorturlMap, navigate, config]);

  // This component doesn't render anything as it performs a redirect
  return null;
};

ShortUrlRedirect.propTypes = {
  shorturlMap: PropTypes.object,
  config: PropTypes.object,
};

export default ShortUrlRedirect;
