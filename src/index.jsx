import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Polyfills para navegadores más antiguos
if (typeof window !== 'undefined') {
  // Polyfill para IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    import('intersection-observer');
  }
  
  // Polyfill para ResizeObserver
  if (!('ResizeObserver' in window)) {
    window.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderizar el componente App
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
