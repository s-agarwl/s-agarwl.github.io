import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

function NotFound({ config }) {
  const location = useLocation();
  const [isHiddenSection, setIsHiddenSection] = useState(false);

  useEffect(() => {
    // Check if this is a hidden section
    if (config && config.sections) {
      const path = location.pathname;
      const matchingSection = config.sections.find(
        (section) => section.path === path && section.hideSection,
      );

      if (matchingSection) {
        setIsHiddenSection(true);
      }
    }
  }, [location, config]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-20">
      <h1 className="text-4xl font-bold mb-4">
        {isHiddenSection ? 'Content Unavailable' : '404 - Page Not Found'}
      </h1>
      <p className="mb-4">
        {isHiddenSection
          ? 'The content you are looking for is currently not available.'
          : "The page you are looking for doesn't exist."}
      </p>
      <Link to="/" className="text-blue-500 hover:underline">
        Go back to homepage
      </Link>
    </div>
  );
}

NotFound.propTypes = {
  config: PropTypes.object,
};

export default NotFound;
