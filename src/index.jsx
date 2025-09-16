import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/tailwind.css'; // Asegúrate de que el archivo tailwind esté correctamente importado
import './styles/global.css'; // Importar correctamente global.css desde la carpeta src/styles/
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
