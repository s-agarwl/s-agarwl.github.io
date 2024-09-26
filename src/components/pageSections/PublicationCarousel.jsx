import React from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import PublicationCard from '../PublicationCard';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import Section from '../Section';

// Import CSS files for react-slick
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../../styles/slick-custom.css';

const NextArrow = ({ onClick }) => (
  <button onClick={onClick} className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
    <ChevronRightIcon className="h-8 w-8 sm:h-10 sm:w-10 text-gray-500 hover:text-gray-700" />
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button onClick={onClick} className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
    <ChevronLeftIcon className="h-8 w-8 sm:h-10 sm:w-10 text-gray-500 hover:text-gray-700" />
  </button>
);

const PublicationCarousel = ({ entries, config }) => {
  // Filter entries based on the keys specified in config
  const carouselEntries = entries.filter((entry) =>
    config.sections.featuredPublications.content.includes(entry.citationKey),
  );

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <Section id={config.sections.featuredPublications.id} className="w-full">
      <h2 className="text-3xl font-bold mb-8 text-center">
        {config.sections.featuredPublications.sectionHeading}
      </h2>
      <div className="w-full px-4">
        <Slider {...settings}>
          {carouselEntries.map((entry) => (
            <div key={entry.citationKey} className="px-2">
              <PublicationCard entry={entry} config={config} />
            </div>
          ))}
        </Slider>
      </div>
      <div className="mt-8 text-center">
        <Link to="/publications" className="text-primary hover:text-blue-800">
          View all publications
        </Link>
      </div>
    </Section>
  );
};

PublicationCarousel.displayName = 'Featured';
export default PublicationCarousel;
