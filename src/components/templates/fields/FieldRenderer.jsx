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
  // Determine component mode - either direct component usage or via field config
  const isComponentMode =
    typeof component === 'string' && !config?.typeOfField && !config?.component;

  // Utility function to resolve option values that might be references to global config
  const resolveOptionValue = (optionValue) => {
    // If the value is a string and exists in globalConfig, resolve it
    if (
      typeof optionValue === 'string' &&
      globalConfig &&
      globalConfig[optionValue] !== undefined
    ) {
      return globalConfig[optionValue];
    }
    // Otherwise return the original value
    return optionValue;
  };

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

  // Get component style based on component name and view type
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

  // Prepare base props for the component
  const componentProps = {
    value,
    viewType,
    ...(isComponentMode ? otherProps : {}),
  };

  // When in field config mode, add standardized props from the config
  if (!isComponentMode && config) {
    // Add direct properties from config that should be passed to components
    const directProps = ['options', 'label', 'tagSet'];
    directProps.forEach((prop) => {
      if (config[prop] !== undefined) {
        componentProps[prop] = config[prop];
      }
    });

    // Add options as individual props if they exist, resolving any references to global config
    if (config.options) {
      // Make a copy to avoid modifying the original
      const resolvedOptions = { ...config.options };

      // Resolve any string references to global config
      Object.keys(resolvedOptions).forEach((key) => {
        resolvedOptions[key] = resolveOptionValue(resolvedOptions[key]);
      });

      // Add resolved options to component props
      Object.assign(componentProps, resolvedOptions);

      // Special handling for limit/wordLimit to maintain backward compatibility
      if (resolvedOptions.limit !== undefined) {
        componentProps.wordLimit = resolvedOptions.limit;
      }
    }

    // Add item and global config
    componentProps.item = item;
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
      return <PublicationLinks entryTags={item} showText={componentProps.showText} />;
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
