// Helper function to clean text
export function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/\s+/g, ' ')
    .replace(/[^\x20-\x7E]/g, '')
    .trim();
}

// Helper function to truncate text at sentence boundary
export function truncateAtSentence(text, maxLength) {
  if (!text) return '';
  if (text.length <= maxLength) return text;

  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  let result = '';

  for (const sentence of sentences) {
    if ((result + sentence).length > maxLength) break;
    result += sentence;
  }

  return result.trim();
}

// Generate fallback shortened text
export function generateFallbackText(text, type, config) {
  if (!text) return '';

  const fallbackConfig = config.fallback[type];
  let result = cleanText(text);

  if (type === 'title') {
    // Remove common suffixes
    for (const suffix of fallbackConfig.suffixes) {
      if (result.endsWith(suffix)) {
        result = result.slice(0, -suffix.length).trim();
      }
    }

    // Truncate if still too long
    if (result.length > fallbackConfig.maxLength) {
      result = result.slice(0, fallbackConfig.maxLength - 3) + '...';
    }
  } else {
    // For descriptions, try to break at sentence boundary
    if (fallbackConfig.sentenceBreaks) {
      result = truncateAtSentence(result, fallbackConfig.maxLength);
    } else {
      result = result.slice(0, fallbackConfig.maxLength - 3) + '...';
    }
  }

  return result;
}

// Process a single content item
export function processContentItem(item, type, config) {
  const title = item.title || '';
  const description = item.description || item.abstract || '';

  return {
    id: item.id,
    type: type,
    title: {
      original: title,
      fallback: generateFallbackText(title, 'title', config),
    },
    description: {
      original: description,
      fallback: generateFallbackText(description, 'description', config),
    },
  };
}
