import React from 'react';
import { FaGraduationCap } from 'react-icons/fa';
import Section from '../Section';

const Education = ({ config }) => {
  return (
    <Section id={config.sections.education.id}>
      <h2 className="text-3xl font-bold mb-8 text-center text-theme">
        {config.sections.education.sectionHeading}
      </h2>
      <div className="education-list space-y-6">
        {config.sections.education.content.map((edu, index) => (
          <div key={index} className="education-item bg-white shadow-md rounded-lg p-6">
            <div className="flex items-center mb-4">
              <FaGraduationCap className="text-2xl text-blue-500 mr-4" />
              <h3 className="text-xl font-semibold text-gray-800">
                {edu.degree}
                {edu.honors && (
                  <span className="honors text-gray-600 font-normal ml-2">({edu.honors})</span>
                )}
              </h3>
            </div>
            <p className="text-gray-700 mb-1">
              {edu.institution}, {edu.location}
            </p>
            <p className="period text-gray-600 text-sm">{edu.period}</p>
          </div>
        ))}
      </div>
    </Section>
  );
};

Education.displayName = 'Education';
export default Education;
