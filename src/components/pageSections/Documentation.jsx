import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const Documentation = () => {
  const [instructions, setInstructions] = useState('');

  useEffect(() => {
    fetch('/docs.md')
      .then((response) => response.text())
      .then((text) => setInstructions(text))
      .catch((error) => console.error('Error fetching README.md:', error));
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="prose max-w-none">
        <ReactMarkdown>{instructions}</ReactMarkdown>
      </div>
    </div>
  );
};

export default Documentation;
