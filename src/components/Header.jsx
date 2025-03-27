import { useState, useRef, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import PropTypes from 'prop-types';
import { FaChevronDown } from 'react-icons/fa';
import { getSectionDetails } from '../utils/sectionUtils';

const Header = ({ config }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  // Get the homepage section ID - simpler approach
  const homepageSectionId = useMemo(() => {
    const homepageSection = config.sections.find((section) => section.path === '/');
    return homepageSection ? homepageSection.id : null;
  }, [config.sections]);

  // Close dropdown when clicking outside
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Get navigation items from the config
  const mainNavItems = config.navigation?.mainItems || [];

  // Simplified function to check if a dropdown should be highlighted
  const shouldHighlightDropdown = (dropdownItems) => {
    // On homepage, check if any dropdown item is the homepage section
    if (isHomePage && homepageSectionId) {
      return dropdownItems.includes(homepageSectionId);
    }

    // For other pages, check for direct path match in dropdown items
    for (const itemId of dropdownItems) {
      const details = getSectionDetails(config.sections, itemId);
      if (details.path === location.pathname) {
        return true;
      }
    }

    return false;
  };

  // Simple function to check if a nav item is active
  const isNavItemActive = (itemId) => {
    const details = getSectionDetails(config.sections, itemId);

    // Simple path match
    if (details.path === location.pathname) {
      return true;
    }

    // Homepage special case
    if (isHomePage && itemId === homepageSectionId) {
      return true;
    }

    return false;
  };

  // Simple link component with active state
  const NavLink = ({ to, children, className, onClick, isActive }) => {
    return (
      <HashLink
        to={to}
        smooth
        className={`${className} ${isActive ? 'text-primary border-b-2 border-primary' : ''}`}
        onClick={onClick}
      >
        {children}
      </HashLink>
    );
  };

  NavLink.propTypes = {
    to: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func,
    isActive: PropTypes.bool,
  };

  // Event handlers
  const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen);
  const handleLinkClick = () => {
    setIsMenuOpen(false);
    setOpenDropdown(null);
  };
  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  return (
    <header className="bg-header text-header p-4 fixed top-0 left-0 right-0 z-50">
      {/* Add GitHub Ribbon on the left with GitHub colors */}
      <a
        href="https://github.com/s-agarwl/easyPortfolioBuilder"
        className="github-corner"
        aria-label="View source on GitHub"
      >
        <svg
          width="60"
          height="60"
          viewBox="0 0 250 250"
          style={{
            fill: '#70B7FD',
            color: '#fff',
            position: 'absolute',
            top: 0,
            border: 0,
            left: 0,
            transform: 'scale(-1, 1)',
          }}
          aria-hidden="true"
        >
          <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
          <path
            d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
            fill="currentColor"
            style={{ transformOrigin: '130px 106px' }}
            className="octo-arm"
          ></path>
          <path
            d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
            fill="currentColor"
            className="octo-body"
          ></path>
        </svg>
      </a>
      <style>{`
        .github-corner:hover .octo-arm{animation:octocat-wave 560ms ease-in-out}
        @keyframes octocat-wave{0%,100%{transform:rotate(0)}20%,60%{transform:rotate(-25deg)}40%,80%{transform:rotate(10deg)}}
        @media (max-width:500px){.github-corner:hover .octo-arm{animation:none}.github-corner .octo-arm{animation:octocat-wave 560ms ease-in-out}}
      `}</style>

      <div className="container mx-auto flex justify-between items-center">
        <HashLink
          to="/"
          className="text-xl font-bold ml-8 sm:ml-4 cursor-pointer hover:text-gray-300 transition-colors duration-200"
        >
          {config.researcherName}
        </HashLink>
        <button
          className={`text-2xl md:hidden ${isMenuOpen ? 'fixed top-4 right-4 z-50' : ''}`}
          onClick={handleMenuToggle}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          style={{ touchAction: 'none' }}
        >
          {isMenuOpen ? '×' : '☰'}
        </button>
        <nav
          className={`fixed md:relative top-0 right-0 h-full md:h-auto w-64 md:w-auto bg-header md:bg-transparent transform ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          } md:translate-x-0 transition-transform duration-300 ease-in-out md:flex md:items-center`}
          ref={dropdownRef}
        >
          <ul className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 p-4 md:p-0 cursor-pointer">
            {mainNavItems.map((navItem) => {
              // Process the navigation item
              const item =
                typeof navItem === 'string'
                  ? { id: navItem, ...getSectionDetails(config.sections, navItem) }
                  : {
                      id: navItem.id,
                      ...getSectionDetails(config.sections, navItem.id),
                      dropdown: navItem.dropdown,
                      items: navItem.items,
                    };

              // For dropdown, check if it should be highlighted
              const isDropdownHighlighted =
                item.dropdown && item.items ? shouldHighlightDropdown(item.items) : false;

              return (
                <li key={item.id} className="relative">
                  {item.dropdown ? (
                    <div>
                      <button
                        onClick={() => toggleDropdown(item.id)}
                        className={`flex items-center text-lg hover:text-gray-300 transition-colors duration-200 ${
                          isDropdownHighlighted ? 'text-primary border-b-2 border-primary' : ''
                        }`}
                        aria-expanded={openDropdown === item.id}
                        aria-haspopup="true"
                      >
                        {item.text} <FaChevronDown className="ml-1 h-3 w-3" />
                      </button>
                      {openDropdown === item.id && (
                        <ul className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-header text-header py-1 z-10">
                          {(item.items || []).map((subItemId) => {
                            const subItem = getSectionDetails(config.sections, subItemId);
                            const isActive = isNavItemActive(subItemId);

                            return (
                              <li key={subItemId}>
                                <NavLink
                                  to={subItem.path}
                                  className="block px-4 py-2 text-sm hover:text-gray-300 transition-colors duration-200"
                                  onClick={handleLinkClick}
                                  isActive={isActive}
                                >
                                  {subItem.text}
                                </NavLink>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <NavLink
                      to={item.path}
                      className="text-lg hover:text-gray-300 transition-colors duration-200"
                      onClick={handleLinkClick}
                      isActive={isNavItemActive(item.id)}
                    >
                      {item.text}
                    </NavLink>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
};

Header.propTypes = {
  config: PropTypes.shape({
    sections: PropTypes.array.isRequired,
    researcherName: PropTypes.string.isRequired,
    navigation: PropTypes.shape({
      mainItems: PropTypes.arrayOf(
        PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            dropdown: PropTypes.bool,
            items: PropTypes.arrayOf(PropTypes.string),
          }),
        ]),
      ),
    }),
  }).isRequired,
};

export default Header;
