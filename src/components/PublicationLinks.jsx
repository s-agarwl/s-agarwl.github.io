import React from 'react';
import PropTypes from 'prop-types';
import {
  FaExternalLinkAlt,
  FaFile,
  FaVideo,
  FaCode,
  FaDesktop,
  FaGithub,
  FaSlideshare,
} from 'react-icons/fa';

const LinkItem = ({ href, title, icon: Icon, text, showText }) => (
  <a
    href={href}
    title={title}
    className="text-theme hover:text-blue-700 flex flex-col items-center space-y-1"
  >
    <Icon />
    {showText && <span>{text}</span>}
  </a>
);

const PublicationLinks = ({ entryTags, showText = false }) => {
  const handleLinkClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="flex justify-center space-x-4" onClick={handleLinkClick}>
      {entryTags.doi && (
        <LinkItem
          href={`https://doi.org/${entryTags.doi}`}
          title="DOI"
          icon={FaExternalLinkAlt}
          text="DOI"
          showText={showText}
        />
      )}
      {entryTags.paperurl && (
        <LinkItem
          href={entryTags.paperurl}
          title="Paper"
          icon={FaFile}
          text="PDF"
          showText={showText}
        />
      )}
      {entryTags.video && (
        <LinkItem
          href={entryTags.video}
          title="Video"
          icon={FaVideo}
          text="Video"
          showText={showText}
        />
      )}
      {entryTags.code && (
        <LinkItem
          href={entryTags.code}
          title="Code"
          icon={FaCode}
          text="Code"
          showText={showText}
        />
      )}
      {entryTags.demo && (
        <LinkItem
          href={entryTags.demo}
          title="Demo"
          icon={FaDesktop}
          text="Demo"
          showText={showText}
        />
      )}
      {entryTags.github && (
        <LinkItem
          href={entryTags.github}
          title="GitHub"
          icon={FaGithub}
          text="GitHub"
          showText={showText}
        />
      )}
      {entryTags.slides && (
        <LinkItem
          href={entryTags.slides}
          title="Slides"
          icon={FaSlideshare}
          text="Slides"
          showText={showText}
        />
      )}
    </div>
  );
};

LinkItem.propTypes = {
  href: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  text: PropTypes.string.isRequired,
  showText: PropTypes.bool.isRequired,
};

PublicationLinks.propTypes = {
  entryTags: PropTypes.object.isRequired,
  showText: PropTypes.bool,
};

export default PublicationLinks;
