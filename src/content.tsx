// content.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';


console.log('🚀 Gemini Clippy Assistant content script initializing...');

const rootId = 'gemini-clippy-assistant-root';

// Check if content script is already injected
if (document.getElementById(rootId)) {
  console.log('⚠️ Content script already injected, skipping...');
} else {
  // Initialize the content script
  function initialize() {
    try {
      let root = document.getElementById(rootId);
      if (!root) {
        root = document.createElement('div');
        root.id = rootId;
        document.body.appendChild(root);
      }

      const reactRoot = ReactDOM.createRoot(root);
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
