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
        <p className="mb-2">
          &copy; {new Date().getFullYear()} {config.researcherName}
        </p>
        {/* Add the GitHub repository link */}
        <p className="text-sm">
          Built with <a href="https://github.com/s-agarwl/easyPortfolioBuilder" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-300">GitHub repository</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
