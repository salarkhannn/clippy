// content.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import styles from './index.css?inline';

console.log('🚀 Gemini Clippy Assistant content script initializing...');

const rootId = 'gemini-clippy-assistant-root';

// Check if content script is already injected
if (document.getElementById(rootId)) {
  console.log('⚠️ Content script already injected, skipping...');
} else {
  // Initialize the content script
  function initialize() {
    try {
      let host = document.getElementById(rootId);
      if (!host) {
        host = document.createElement('div');
        host.id = rootId;
        document.body.appendChild(host);
      }

      // Create shadow root
      const shadowRoot = host.attachShadow({ mode: 'open' });

      // Inject styles
      const styleSheet = document.createElement('style');
      styleSheet.textContent = styles;
      shadowRoot.appendChild(styleSheet);

      // Create mount point for React
      const mountPoint = document.createElement('div');
      mountPoint.id = 'root';
      shadowRoot.appendChild(mountPoint);

      const reactRoot = ReactDOM.createRoot(mountPoint);
      reactRoot.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
      
      console.log('✅ Gemini Clippy Assistant content script loaded successfully');
    } catch (error) {
      console.error('❌ Failed to initialize content script:', error);
    }
  }

  // Ensure DOM is ready before initializing
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
}
