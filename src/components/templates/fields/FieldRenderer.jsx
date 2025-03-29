import PropTypes from 'prop-types';
import Heading from './Heading';
import Text from './Text';
import AuthorList from './AuthorList';
import Tags from './Tags';
import Award from './Award';
import Image from './Image';
import ExpandableMarkdown from './ExpandableMarkdown';
import Section from './Section';
import LinkButtons from './LinkButtons';
import PublicationLinks from '/src/components/PublicationLinks';
import Markdown from './Markdown';
import componentStyles from '/src/styles/componentStyles';

// eslint-disable-next-line no-unused-vars
const FieldRenderer = ({
  // eslint-disable-next-line no-unused-vars
  field,
  value,
  config = {},
  item = {},
  globalConfig = {},
  viewType = 'detail',
  typeOfField,
  component,
  ...otherProps
}) => {
  // If component is directly specified, we're in component mode rather than field/config mode
  const isComponentMode = !!component;

  if (!value && !config.renderEmpty && config.condition) {
    return null;
  }

  // Handle conditional rendering (only in field/config mode)
  if (!isComponentMode && config.condition) {
    const conditions = config.condition.split('|');
    const meetsCriteria = conditions.some((condition) => {
      const path = condition.split('.');
      let conditionValue = item;
      for (const key of path) {
        if (!conditionValue || !conditionValue[key]) return false;
        conditionValue = conditionValue[key];
      }
      return true;
    });

    if (!meetsCriteria) return null;
  }

  // Handle formatting (only in field/config mode)
  if (!isComponentMode && config.format && typeof config.format === 'string') {
    const formatted = config.format.replace(/\{([^}]+)\}/g, (match, path) => {
      if (path.includes('|')) {
        // Handle alternative fields
        const alternatives = path.split('|');
        for (const alt of alternatives) {
          if (item[alt]) return item[alt];
        }
        return '';
      } else {
        // Regular field
        const path = match.slice(1, -1).split('.');
        let fieldValue = item;
        for (const key of path) {
          if (!fieldValue || !fieldValue[key]) return '';
          fieldValue = fieldValue[key];
        }
        return fieldValue || '';
      }
    });
    value = formatted;
  }

  // Get component style based on component type, view and variant
  const getComponentStyle = (componentName, level) => {
    const styles = componentStyles[componentName];
    if (!styles) return null;

    // If a specific variant is specified in the config, use that directly
    if (!isComponentMode && config.variant && styles.variants && styles.variants[config.variant]) {
      console.log(`Using specific variant ${config.variant} for ${componentName}`);
      return styles.variants[config.variant];
    }

    // Special handling for Award component - return the full style object
    if (componentName === 'Award') {
      return styles;
    }

    // For Heading component specifically in list view, extract the style directly
    if (
      componentName === 'Heading' &&
      viewType === 'list' &&
      level &&
      styles.variants?.list?.[level]
    ) {
      console.log(`Direct style extract for Heading level ${level} in list view`);
      return styles.variants.list[level];
    }

    // Special handling for Heading component - need to return appropriate structure
    if (componentName === 'Heading') {
      return styles;
    }

    // For container/item style components (Tags, Image, LinkButtons)
    if (['Tags', 'Image', 'LinkButtons'].includes(componentName)) {
      const containerStyle = styles.container?.[viewType] || styles.container?.default;
      const itemStyle =
        componentName === 'Tags'
          ? styles.tag?.[viewType] || styles.tag?.default
          : componentName === 'Image'
            ? styles.image?.[viewType] || styles.image?.default
            : styles.button?.default;

      return {
        container: containerStyle,
        [componentName === 'Tags' ? 'tag' : componentName === 'Image' ? 'image' : 'button']:
          itemStyle,
      };
    }

    // For ExpandableMarkdown (has container/button)
    if (componentName === 'ExpandableMarkdown') {
      const containerStyle = styles.container?.[viewType] || styles.container?.default;
      const buttonStyle = styles.button?.default;
      return { container: containerStyle, button: buttonStyle };
    }

    // For regular components with view-based variants
    if (styles.variants && styles.variants[viewType]) {
      return styles.variants[viewType];
    }

    // Default style
    return styles.default;
  };

  // Determine which component to render
  const componentToRender =
    typeOfField || component || (isComponentMode ? null : config?.typeOfField || config?.component);

  // Get component level if it's a heading
  const level =
    componentToRender === 'Heading'
      ? isComponentMode
        ? otherProps.level
        : config.options?.level
      : undefined;

  // Prepare props for the component
  const componentProps = isComponentMode
    ? {
        value,
        viewType,
        ...otherProps,
      }
    : {
        value,
        item,
        config: globalConfig,
        viewType,
        ...config.options,
      };

  // Ensure label is passed if specified
  if (!isComponentMode && config.label) {
    componentProps.label = config.label;
  }

  // Ensure heading is passed if specified
  if (!isComponentMode && config.heading) {
    componentProps.heading = config.heading;
  }

  // Pass tagSet to Tags component
  if (componentToRender === 'Tags') {
    // When in component mode (direct usage), use the tagSet from props
    if (isComponentMode) {
      componentProps.tagSet = otherProps.tagSet;
    }
    // When in field config mode, get tagSet from field config
    else if (!isComponentMode && config.tagSet) {
      componentProps.tagSet = config.tagSet;
    }

    // Always ensure the global config is passed to access tagSets
    componentProps.config = globalConfig;
  }

  // Apply proper styling based on component type and viewType
  const styleForComponent = getComponentStyle(componentToRender, level);
  if (styleForComponent) {
    componentProps.styleVariant = styleForComponent;
  }

  // Keep className if explicitly specified (from either mode)
  if (!isComponentMode && config.className) {
    componentProps.className = config.className;
  }

  // For debugging
  if (componentToRender === 'Heading' && viewType === 'list') {
    console.log('Rendering list Heading with props:', {
      level,
      styleVariant: componentProps.styleVariant,
      viewType,
    });
  }

  // Render the appropriate component based on the component type
  switch (componentToRender) {
    case 'Heading':
      return <Heading {...componentProps} level={level} />;
    case 'Text':
      return <Text {...componentProps} />;
    case 'AuthorList':
      return <AuthorList {...componentProps} />;
    case 'Tags':
      return <Tags {...componentProps} />;
    case 'Award':
      return <Award {...componentProps} />;
    case 'Image':
      return <Image {...componentProps} />;
    case 'ExpandableMarkdown':
      return <ExpandableMarkdown {...componentProps} />;
    case 'Section':
      return <Section {...componentProps} />;
    case 'LinkButtons':
      return <LinkButtons {...componentProps} />;
    case 'PublicationLinks':
      return <PublicationLinks entryTags={item} showText={config.options?.showText} />;
    case 'Markdown':
      return <Markdown {...componentProps} />;
    default:
      return <Text {...componentProps} />;
  }
};

FieldRenderer.propTypes = {
  field: PropTypes.string,
  value: PropTypes.any,
  config: PropTypes.object,
  item: PropTypes.object,
  globalConfig: PropTypes.object,
  viewType: PropTypes.oneOf(['list', 'card', 'detail']),
  typeOfField: PropTypes.string,
  component: PropTypes.string,
};

export default FieldRenderer;
