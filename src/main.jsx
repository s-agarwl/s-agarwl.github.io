import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { useConfig } from './utils/configUtils';

// Import a CSS file where we'll define our theme styles
import './styles/themes.css';

function Root() {
  const { config, loading, error } = useConfig();

  useEffect(() => {
    if (config) {
      document.title = config.researcherName;

      // Apply the theme from config
      if (config.theme) {
        document.body.className = config.theme;
      }
    }
  }, [config]);

  if (loading) return <div>Loading configuration...</div>;
  if (error) return <div>Error loading configuration: {error}</div>;

  return (
    <StrictMode>
      <App config={config} />
    </StrictMode>
  );
}

createRoot(document.getElementById('root')).render(<Root />);
