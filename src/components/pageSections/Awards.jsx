import React from 'react';
import { FaTrophy, FaMedal } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Section from '../Section';

// Map icon names to actual React components
const iconMap = {
  FaTrophy: FaTrophy,
  FaMedal: FaMedal,
};

const Awards = ({ config }) => {
  return (
    <Section id={config.sections.awards.id}>
      <h2 className="text-3xl font-bold mb-6 text-center ">
        {config.sections.awards.sectionHeading}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {config.sections.awards.content.map((award, index) => {
          const IconComponent = iconMap[award.icon];
          return (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-6 flex items-start space-x-4"
            >
              <div className="text-4xl">
                <IconComponent className="text-yellow-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-700">{award.title}</h3>
                <p className="text-gray-600">{award.description}</p>
                {award.details && (
                  <Link to={`${award.details}`} className="text-blue-500 hover:text-blue-700">
                    Details
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
};

export default Awards;
