import React from 'react';
import ReactMarkdown from 'react-markdown';
import { parseHtml } from '../../utils/utils';

const DynamicSection = ({ sectionConfig }) => {
  const { headerText, sectionHeading, content } = sectionConfig;

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h2 className="text-3xl font-bold mb-4">{sectionHeading || headerText}</h2>
      <div>
        <p
          className="text-lg text-gray-700 mb-12"
          dangerouslySetInnerHTML={parseHtml(sectionConfig.content)}
        />
      </div>
    </div>
  );
};

export default DynamicSection;
