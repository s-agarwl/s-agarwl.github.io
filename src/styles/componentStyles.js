/**
 * Component style configuration for the theme-based styling system
 * This serves as a centralized source of styling for all field components
 */
const componentStyles = {
  // Heading styles
  Heading: {
    // Default styles for headings at different levels
    defaults: {
      1: 'text-3xl font-bold text-gray-900 mb-4',
      2: 'text-2xl font-semibold text-gray-800 mb-3',
      3: 'text-xl font-semibold text-gray-800 mb-2',
      4: 'text-lg font-medium text-gray-800 mb-2',
      5: 'text-base font-medium text-gray-800 mb-1',
      6: 'text-sm font-medium text-gray-700 mb-1',
    },
    // View-specific variants
    variants: {
      // Card view styles
      card: {
        3: 'text-lg font-semibold text-gray-800 mb-2 mt-0 text-center',
      },
      // List view styles - more compact with different color
      list: {
        1: 'text-base font-semibold text-gray-800 mb-0.5 mt-0',
      },
      // Detail view styles
      detail: {
        1: 'text-3xl font-bold text-gray-900 mb-2 mt-0 text-center',
        2: 'text-2xl font-semibold text-gray-800 mb-4',
        3: 'text-xl font-semibold text-gray-800 mb-3',
      },
    },
  },

  // Text styles for paragraphs and metadata
  Text: {
    // Default text styles
    default: 'text-base text-gray-700 mb-2',
    // View-specific variants
    variants: {
      card: 'text-sm text-gray-600 mb-1',
      list: 'text-sm text-gray-600 mb-0',
      detail: 'text-base text-gray-700 mb-2',
      // Special variants
      metadata: 'text-sm text-gray-500 mb-1',
      caption: 'text-xs text-gray-500 mb-1',
      // Venue text styling with italics
      italics_list: 'text-sm text-gray-600 italic',
      italics_card: 'text-sm text-gray-600 italic',
      italics_detail: 'text-base text-gray-700 italic',
    },
    // Label styles matching content styling with font-bold
    label: {
      default: 'text-base font-bold text-gray-700',
      card: 'text-sm font-bold text-gray-600',
      list: 'text-sm font-bold text-gray-600',
      detail: 'text-base font-bold text-gray-700',
    },
  },

  // Tags component styles
  Tags: {
    // Container styles
    container: {
      default: 'flex flex-wrap gap-2 mb-4',
      card: 'gap-2 mt-2 mb-2 inline',
      list: 'gap-2 mt-2 mb-0 inline',
      detail: 'gap-2 mb-4 inline',
    },
    // Individual tag styles
    tag: {
      default: 'px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-xs',
      card: 'px-2 py-1 mr-1 bg-gray-100 text-gray-900 rounded-md text-xs',
      list: 'px-2 py-0.5 mr-1 bg-gray-100 text-gray-700 rounded-md text-xs',
      detail: 'px-3 py-1 mr-1 bg-gray-100 text-gray-700 rounded-md text-xs',
    },
    // Label styles matching the appropriate text styling for each view
    label: {
      default: 'text-base font-bold text-gray-700 mr-2',
      card: 'text-xs font-bold text-gray-600 mr-2',
      list: 'text-xs font-bold text-gray-600 mr-2',
      detail: 'text-base font-bold text-gray-700 mr-2',
    },
  },

  // Award component styles
  Award: {
    // Default award badge style
    default:
      'mt-1 inline-flex items-center text-white bg-blue-600 rounded-md px-4 py-0.5 mb-2 text-xs',
    // View-specific variants
    variants: {
      card: 'inline-flex items-center text-white bg-blue-600 rounded-md px-2 py-1 opacity-90 mt-2 w-fit text-xs',
      list: 'inline-flex items-center text-white bg-blue-600 rounded-md px-2 py-0.5 opacity-90 my-0.5 mt-1 text-xs',
      detail:
        'inline-flex items-center text-white bg-blue-600 rounded-md px-4 py-1 opacity-90 mb-4 text-sm',
    },
    // Label styles
    label: {
      default: 'text-base font-bold text-gray-700 mr-2',
      card: 'text-sm font-bold text-gray-600 mr-2',
      list: 'text-sm font-bold text-gray-600 mr-2',
      detail: 'text-base font-bold text-gray-700 mr-2',
    },
  },

  // Image component styles
  Image: {
    // Container styles
    container: {
      default: 'mb-1',
      card: 'relative h-48 overflow-hidden',
      list: 'relative h-20 w-20 overflow-hidden rounded-md',
      detail: 'mb-4 mt-4',
    },
    // Image styles
    image: {
      default: 'w-3/4 mb-4 mx-auto',
      card: 'w-full h-full object-cover',
      list: 'w-full h-full object-cover',
      detail: 'w-full max-w-2xl mx-auto rounded-lg shadow-md',
    },
    // Label styles
    label: {
      default: 'text-base font-bold text-gray-700 block mb-2',
      card: 'text-sm font-bold text-gray-600 block mb-1',
      list: 'text-sm font-bold text-gray-600 block mb-1',
      detail: 'text-base font-bold text-gray-700 block mb-2',
    },
  },

  // AuthorList component styles
  AuthorList: {
    // Container styles
    default: 'mb-2',
    // View-specific variants
    variants: {
      card: 'text-sm text-gray-600 mb-1',
      list: 'text-sm text-gray-600 mb-0.5',
      detail: 'text-base text-gray-700 mb-3',
    },
    // Label styles
    label: {
      default: 'text-base font-bold text-gray-700 mr-2',
      card: 'text-sm font-bold text-gray-600 mr-2',
      list: 'text-sm font-bold text-gray-600 mr-2',
      detail: 'text-base font-bold text-gray-700 mr-2',
    },
  },

  // ExpandableMarkdown component styles
  ExpandableMarkdown: {
    // Container styles
    container: {
      default: 'prose prose-sm max-w-none',
      card: 'text-sm text-gray-600 mt-2',
      list: 'text-sm text-gray-700 mt-1',
      detail: 'prose prose-sm max-w-none my-4',
    },
    // Button styles
    button: {
      default: 'text-blue-500 hover:text-blue-700 ml-2',
    },
    // Label styles
    label: {
      default: 'text-base font-bold text-gray-700 mr-2',
      card: 'text-sm font-bold text-gray-600 mr-2',
      list: 'text-sm font-bold text-gray-700 mr-2',
      detail: 'text-base font-bold text-gray-700 mr-2',
    },
  },

  // Markdown component styles
  Markdown: {
    default: 'prose prose-sm max-w-none my-4',
    variants: {
      card: 'prose-xs mt-2',
      list: 'prose-xs mt-1',
      detail: 'prose prose-sm max-w-none my-4',
    },
    // Label styles
    label: {
      default: 'text-base font-bold text-gray-700 block mb-2',
      card: 'text-sm font-bold text-gray-600 block mb-1',
      list: 'text-sm font-bold text-gray-600 block mb-1',
      detail: 'text-base font-bold text-gray-700 block mb-2',
    },
  },

  // Section component styles
  Section: {
    default: 'mb-8',
    variants: {
      card: 'mb-4',
      list: 'mb-4',
      detail: 'mb-8',
    },
    // Label styles (used as section headers)
    label: {
      default: 'text-xl font-semibold text-gray-800 mb-2',
      card: 'text-lg font-semibold text-gray-800 mb-2',
      list: 'text-base font-semibold text-gray-800 mb-1',
      detail: 'text-xl font-semibold text-gray-800 mb-3',
    },
  },

  // LinkButtons component styles
  LinkButtons: {
    // Container styles
    container: {
      default: 'flex flex-wrap gap-2 mb-4',
      card: 'flex flex-wrap gap-2 mt-2',
      list: 'flex flex-wrap gap-2',
      detail: 'flex flex-wrap gap-2 mb-6',
    },
    // Button styles
    button: {
      default:
        'text-blue-600 hover:text-blue-800 inline-flex items-center bg-blue-50 hover:bg-blue-100 rounded px-3 py-1',
    },
    // Label styles
    label: {
      default: 'text-base font-bold text-gray-700 block mb-2',
      card: 'text-lg font-semibold text-gray-800 mb-1',
      list: 'text-base font-semibold text-gray-800 mb-1',
      detail: 'text-xl font-semibold text-gray-800 mb-2',
    },
  },
};

export default componentStyles;
