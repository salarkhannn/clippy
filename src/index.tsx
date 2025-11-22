
// index.tsx
// This file is conceptually the entry point for the React app,
// but in the Chrome extension, `content.tsx` is the actual script
// that bootstraps and renders the app into the page.
// We keep this file to adhere to the requested structure.

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to. This should not happen in the extension context.");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
