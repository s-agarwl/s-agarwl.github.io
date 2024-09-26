import React from 'react';
import { iconMap } from '../../utils/utils'; // Update the import path as needed

const Contact = ({ config }) => {
  return (
    <section id={config.sections.contact.id} className="py-16 ">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">
          {config.sections.contact.sectionHeading}
        </h2>
        <p className="text-center mb-8">{config.sections.contact.content.intro}</p>
        <div className="flex justify-center space-x-4 mb-8">
          {config.sections.contact.content.linksToDisplay.map((key) => {
            const Icon = iconMap[key];
            const url = key === 'email' ? `mailto:${config.email}` : config.links[key];

            return (
              url && (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-theme hover:text-blue-500 transition-colors"
                >
                  <Icon size={24} />
                </a>
              )
            );
          })}
        </div>
        <p className="text-center">{config.sections.contact.content.outro}</p>
      </div>
    </section>
  );
};

export default Contact;
