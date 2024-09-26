import React from 'react';

const Section = ({ children, className, id }) => {
  return (
    <section id={id} className={`py-12 ${className} bg-theme text-theme`}>
      <div className="container max-w-6xl mx-auto px-4">{children}</div>
    </section>
  );
};

export default Section;
