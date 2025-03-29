import React from 'react';
import PropTypes from 'prop-types';
import {
  FaExternalLinkAlt,
  FaFile,
  FaVideo,
  FaDesktop,
  FaGithub,
  FaSlideshare,
  FaPlusSquare,
} from 'react-icons/fa';

const LinkItem = ({ href, title, icon: Icon, text, showText }) => (
  <a
    href={href}
    title={title}
    target="_blank"
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
    <div className="flex justify-center space-x-4 mb-2" onClick={handleLinkClick}>
      {entryTags.doi && (
        <LinkItem
          href={`https://doi.org/${entryTags.doi}`}
          title="DOI"
          icon={FaExternalLinkAlt}
          text="DOI"
          showText={showText}
        />
      )}
      {entryTags.links.pdf && (
        <LinkItem
          href={entryTags.links.pdf}
          title="Paper"
          icon={FaFile}
          text="PDF"
          showText={showText}
        />
      )}
      {entryTags.links.poster && (
        <LinkItem
          href={entryTags.links.poster}
          title="Paper"
          icon={FaFile}
          text="Poster"
          showText={showText}
        />
      )}
      {entryTags.links.video && (
        <LinkItem
          href={entryTags.links.video}
          title="Video"
          icon={FaVideo}
          text="Video"
          showText={showText}
        />
      )}

      {entryTags.links.github && (
        <LinkItem
          href={entryTags.links.github}
          title="GitHub"
          icon={FaGithub}
          text="GitHub"
          showText={showText}
        />
      )}
      {entryTags.links.slides && (
        <LinkItem
          href={entryTags.links.slides}
          title="Slides"
          icon={FaSlideshare}
          text="Slides"
          showText={showText}
        />
      )}
      {entryTags.links.demo && (
        <LinkItem
          href={entryTags.links.demo}
          title="Demo"
          icon={FaDesktop}
          text="Demo"
          showText={showText}
        />
      )}
      {entryTags.links.supplementary && (
        <LinkItem
          href={entryTags.links.supplementary}
          title="Code"
          icon={FaPlusSquare}
          text="Suppl. Info"
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
