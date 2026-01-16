import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

if (typeof window !== 'undefined') {
  try {
    const redirectPath = window.sessionStorage.getItem('spa-redirect-path');
    if (redirectPath) {
      window.sessionStorage.removeItem('spa-redirect-path');
      const normalizedPath = redirectPath.startsWith('/') ? redirectPath : `/${redirectPath}`;
      if (window.location.pathname === '/' && normalizedPath !== window.location.pathname) {
        window.history.replaceState(null, '', normalizedPath);
      }
    }
  } catch (error) {
    // sessionStorage might be disabled; ignore and proceed normally
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
