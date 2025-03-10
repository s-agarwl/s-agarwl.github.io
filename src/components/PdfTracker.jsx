import PropTypes from 'prop-types';

const PdfTracker = ({ pdfUrl, title }) => {
  const trackDownload = () => {
    // Track PDF download in Google Analytics
    if (window.gtag) {
      window.gtag('event', 'download', {
        event_category: 'PDF',
        event_label: title,
        value: 1,
      });
    }
  };

  return (
    <a
      href={pdfUrl}
      onClick={trackDownload}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      <svg
        className="w-4 h-4 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      Download PDF
    </a>
  );
};

PdfTracker.propTypes = {
  pdfUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default PdfTracker;
