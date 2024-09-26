import React from 'react';
import { parseHtml } from '../../utils/utils';
import Section from '../Section';

const Intro = ({ config }) => {
  return (
    <Section id={config.sections.about.id}>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        {config.profilePhotoPath && (
          <div className="w-full md:w-1/3 flex justify-center md:justify-start">
            <img
              src={config.profilePhotoPath}
              alt={config.researcherName}
              className="w-64 h-64 object-cover rounded-full border-4 border-white shadow-lg"
            />
          </div>
        )}
        <div className="w-full md:w-2/3 text-center md:text-left">
          <h2 className="text-4xl sm:text-3xl font-bold text-theme mb-4">
            {config.researcherName}
          </h2>
          <h3 className="text-xl sm:text-1xl font-medium text-theme-light mb-8">
            {config.sections.about.subHeading}
          </h3>
          <p
            className="text-lg text-theme mb-12"
            dangerouslySetInnerHTML={parseHtml(config.sections.about.content)}
          />
        </div>
      </div>
    </Section>
  );
};

Intro.displayName = 'Home';
export default Intro;
