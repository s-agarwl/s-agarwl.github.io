import bibtexParse from 'bibtex-parse-js';

const convertBibtexToJson = (bibtexData) => {
  const parsedEntries = bibtexParse.toJSON(bibtexData);

  return parsedEntries.map((entry) => {
    const tags = entry.entryTags;

    // Convert authors string to array
    const authors = tags.author ? tags.author.split(' and ').map((author) => author.trim()) : [];

    // Create a standardized JSON object
    return {
      id: entry.citationKey,
      title: tags.title || '',
      description: tags.abstract || '',
      authors: authors,
      year: tags.year || '',
      date: tags.date || tags.year || '',
      journal: tags.journal || '',
      booktitle: tags.booktitle || '',
      doi: tags.doi || '',
      awards: tags.awards || '',
      links: {
        url: tags.url || '',
        pdf: tags.paperurl || '',
        slides: tags.slides || '',

        video: tags.video || '',
        supplementary: tags.supplementary || '',
        demo: tags.demo || '',
        github: tags.github || '',
        poster: tags.poster || '',
      },
      markdownContent: tags.markdownContent || '',
      // Additional fields specific to publications
      entryType: entry.entryType,
      citationKey: entry.citationKey,
      // Optional fields that might be useful
      volume: tags.volume || '',
      number: tags.number || '',
      pages: tags.pages || '',
      publisher: tags.publisher || '',
      address: tags.address || '',
      keywords: tags.keywords ? tags.keywords.split(',').map((k) => k.trim()) : [],
      abstract: tags.abstract || '',
      bibtex: entry.entryTags,
      shorturl: tags.shorturl || '',
      image: tags.image || '',
    };
  });
};

export default convertBibtexToJson;
