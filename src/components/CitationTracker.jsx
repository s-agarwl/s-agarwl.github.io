import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const CitationTracker = ({ doi, googleScholarId }) => {
  const [metrics, setMetrics] = useState({
    citations: null,
    lastUpdated: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchCitations = async () => {
      try {
        // If you have access to APIs, you can fetch real-time data
        // For now, we'll just link to the citation sources
        setMetrics({
          loading: false,
          lastUpdated: new Date().toISOString(),
        });
      } catch (error) {
        setMetrics((prev) => ({
          ...prev,
          loading: false,
          error: 'Failed to fetch citation data',
        }));
      }
    };

    fetchCitations();
  }, [doi, googleScholarId]);

  if (metrics.loading) {
    return <div>Loading citation metrics...</div>;
  }

  if (metrics.error) {
    return <div>Error loading metrics: {metrics.error}</div>;
  }

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Citation Metrics</h3>
      <div className="flex flex-wrap gap-4">
        {doi && (
          <a
            href={`https://doi.org/${doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          >
            <img src="/icons/crossref.svg" alt="CrossRef" className="w-4 h-4" />
            <span>CrossRef</span>
          </a>
        )}
        {googleScholarId && (
          <a
            href={`https://scholar.google.com/scholar?cites=${googleScholarId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          >
            <img src="/icons/google-scholar.svg" alt="Google Scholar" className="w-4 h-4" />
            <span>Google Scholar</span>
          </a>
        )}
        <a
          href={`https://www.semanticscholar.org/search?q=${encodeURIComponent(doi || '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
        >
          <img src="/icons/semantic-scholar.svg" alt="Semantic Scholar" className="w-4 h-4" />
          <span>Semantic Scholar</span>
        </a>
      </div>
      <div className="text-sm text-gray-500 mt-2">
        Last updated: {new Date(metrics.lastUpdated).toLocaleDateString()}
      </div>
    </div>
  );
};

CitationTracker.propTypes = {
  doi: PropTypes.string,
  googleScholarId: PropTypes.string,
};

export default CitationTracker;
