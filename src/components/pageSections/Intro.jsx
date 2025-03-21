import { parseHtml } from '../../utils/utils';
import Section from '../Section';
import TypedAnimation from '../TypedAnimation';
import PropTypes from 'prop-types';

const Intro = ({ config }) => {
  // Define the content for TypedAnimation
  const animationContent = {
    prefix: config.sections.About.animationPrefix || 'I am ',
    phrases: config.sections.About.animationPhrases || [config.sections.About.subHeading],
  };

  return (
    <Section id={config.sections.About.id}>
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

          {/* TypedAnimation component replaces the static subHeading */}
          <div className="mb-8">
            {/* <TypedAnimation
              content={animationContent}
              containerClassName="h-16 flex items-center justify-center md:justify-start text-xl sm:text-1xl text-theme-light"
              prefixClassName="font-medium"
              textClassName="font-medium"
              cursorClassName="animate-blink text-theme-light"
            /> */}
            <h3 className="font-mono h-16 flex items-center justify-center md:justify-start text-xl sm:text-1xl text-theme-light">
              {config.sections.About.subHeading}
            </h3>
          </div>

          <p
            className="text-lg text-theme mb-12"
            dangerouslySetInnerHTML={parseHtml(config.sections.About.content)}
          />
        </div>
      </div>
    </Section>
  );
};

Intro.propTypes = {
  config: PropTypes.shape({
    researcherName: PropTypes.string,
    profilePhotoPath: PropTypes.string,
    sections: PropTypes.shape({
      About: PropTypes.shape({
        id: PropTypes.string,
        subHeading: PropTypes.string,
        content: PropTypes.string,
        animationPrefix: PropTypes.string,
        animationPhrases: PropTypes.arrayOf(PropTypes.string),
      }),
    }),
  }).isRequired,
};

Intro.displayName = 'Home';
export default Intro;
