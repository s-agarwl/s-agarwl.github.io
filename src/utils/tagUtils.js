// Define color map for predefined colors
export const colorMap = {
  gray: { bg: 'bg-gray-100', text: 'text-gray-700' },
  red: { bg: 'bg-red-100', text: 'text-red-700' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-700' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-700' },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  lime: { bg: 'bg-lime-100', text: 'text-lime-700' },
  green: { bg: 'bg-green-100', text: 'text-green-700' },
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  teal: { bg: 'bg-teal-100', text: 'text-teal-700' },
  cyan: { bg: 'bg-cyan-100', text: 'text-cyan-700' },
  sky: { bg: 'bg-sky-100', text: 'text-sky-700' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-700' },
  indigo: { bg: 'bg-indigo-100', text: 'text-indigo-700' },
  violet: { bg: 'bg-violet-100', text: 'text-violet-700' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-700' },
  fuchsia: { bg: 'bg-fuchsia-100', text: 'text-fuchsia-700' },
  pink: { bg: 'bg-pink-100', text: 'text-pink-700' },
  rose: { bg: 'bg-rose-100', text: 'text-rose-700' },
};

// Get the tag set configuration for a specific tag
export const getTagConfig = (tag, tagSet, config) => {
  // If no tagSet specified or config doesn't have tagSets, return null
  if (!tagSet || !config || !config.tagSets || !config.tagSets[tagSet]) {
    return null;
  }

  if (!tag) return null;

  // First try exact match
  const tagSetConfig = config.tagSets[tagSet];
  let tagConfig = tagSetConfig[tag];

  // If not found, try case-insensitive match
  if (!tagConfig) {
    const tagSetEntries = Object.entries(tagSetConfig);
    const caseInsensitiveMatch = tagSetEntries.find(
      ([key]) => key.toLowerCase() === tag.toLowerCase(),
    );

    if (caseInsensitiveMatch) {
      tagConfig = caseInsensitiveMatch[1];
    }
  }

  return tagConfig || null;
};

// Apply color styles from a tag configuration to a class string
export const applyTagColors = (baseClass, tagConfig) => {
  if (!tagConfig || !tagConfig.color || !colorMap[tagConfig.color]) {
    return baseClass;
  }

  const colorStyles = colorMap[tagConfig.color];

  // Replace default color classes with custom ones
  return baseClass
    .replace(/bg-[a-z]+-\d+/, colorStyles.bg)
    .replace(/text-[a-z]+-\d+/, colorStyles.text);
};

// Get the display text for a tag (using label from config if available)
export const getTagDisplayText = (tag, tagConfig) => {
  return tagConfig && tagConfig.label ? tagConfig.label : tag;
};
