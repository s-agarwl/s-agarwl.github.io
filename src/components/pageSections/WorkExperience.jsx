import React from 'react';
import { FaBriefcase, FaAward } from 'react-icons/fa';
import Section from '../Section';

const WorkExperience = ({ config }) => {
  return (
    <Section id={config.sections.workExperience.id}>
      <h2 className="text-3xl font-bold mb-12 text-center text-theme">
        {config.sections.workExperience.sectionHeading}
      </h2>
      <div className="relative">
        {config.sections.workExperience.content.map((exp, index) => (
          <div key={index} className="mb-12 flex">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
              <FaBriefcase className="text-white" />
            </div>
            <div className="ml-8 bg-white shadow-md rounded-lg p-6 flex-grow">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{exp.title}</h3>
              <p className="text-gray-600 mb-2">
                {exp.company}, {exp.location}
              </p>
              <p className="text-gray-600 text-sm mb-4">{exp.period}</p>
              <p className="text-gray-700 mb-4">{exp.description}</p>
              {exp.featuredProject && (
                <div className="bg-gray-100 rounded-lg p-4 mt-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                    <FaAward className="mr-2 text-yellow-500" />
                    Featured Project: {exp.featuredProject.title}
                  </h4>
                  <p className="text-gray-700">{exp.featuredProject.description}</p>
                </div>
              )}
            </div>
          </div>
        ))}
        <div
          className="absolute top-0 bottom-0 left-6 w-0.5 bg-gray-300"
          style={{ transform: 'translateX(-50%)' }}
        ></div>
      </div>
    </Section>
  );
};

WorkExperience.displayName = 'Work Experience';
export default WorkExperience;
