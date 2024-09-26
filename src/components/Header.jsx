import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

const Header = ({ config }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = config.orderOfSectionsInHeader
    .map((sectionId) => {
      const section =
        Object.values(config.sections).find((s) => s.id === sectionId) ||
        Object.values(config.specialSections).find((s) => s.id === sectionId);
      if (!section) {
        console.warn(`Section with id "${sectionId}" not found in config.`);
        return null;
      }
      return {
        id: section.id,
        headerText: section.headerText,
        path: section.path,
      };
    })
    .filter(Boolean);

  const NavLink = ({ item, onClick, className }) => {
    return (
      <HashLink to={item.path || `/#${item.id}`} smooth className={className} onClick={onClick}>
        {item.headerText}
      </HashLink>
    );
  };

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-header text-header p-4 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">{config.siteTitle}</div>
        <button className=" text-2xl md:hidden" onClick={handleMenuClick} aria-label="Toggle menu">
          {isMenuOpen ? '×' : '☰'}
        </button>
        <nav
          className={`fixed md:relative top-0 right-0 h-full md:h-auto w-64 md:w-auto bg-header md:bg-transparent transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out md:flex md:items-center`}
        >
          <button
            className="absolute top-4 right-4 text-2xl md:hidden"
            onClick={handleMenuClick}
            aria-label="Close menu"
          >
            ×
          </button>
          <ul className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 p-4 md:p-0 cursor-pointer">
            {navigationItems.map((item) => (
              <li key={item.id}>
                <NavLink
                  item={item}
                  onClick={handleLinkClick}
                  className="text-lg hover:text-gray-300 transition-colors duration-200"
                />
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
