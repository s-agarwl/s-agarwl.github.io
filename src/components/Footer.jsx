import React from 'react';
import { iconMap } from '../utils/utils'; // Update the import path as needed

const Footer = ({ config }) => {
  return (
    <footer className="bg-header text-header me p-4 mt-8">
      <div className="container mx-auto flex flex-col items-center">
        <div className="flex space-x-4 mb-4">
          {Object.entries(config.links).map(([key, url]) => {
            const Icon = iconMap[key];
            return (
              url &&
              Icon && (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-300"
                >
                  <Icon size={20} />
                </a>
              )
            );
          })}
          <a href={`mailto:${config.email}`} className="hover:text-gray-300">
            {iconMap.email && <iconMap.email size={20} />}
          </a>
        </div>
        <p>
          &copy; {new Date().getFullYear()} {config.researcherName}
        </p>
      </div>
    </footer>
  );
};

export default Footer;