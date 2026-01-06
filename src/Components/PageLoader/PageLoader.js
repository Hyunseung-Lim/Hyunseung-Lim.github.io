import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import './PageLoader.css';

export const PageLoader = ({ message = 'Loading...', variant }) => {
  const { isDark } = useTheme();
  const resolvedVariant = variant ?? (isDark ? 'dark' : 'light');

  return (
    <div className={`page-loader page-loader--${resolvedVariant}`}>
      <div className="page-loader__content" role="status" aria-live="polite">
        <div className="page-loader__spinner" aria-hidden="true">
          <svg
            className="page-loader__spinner-graphic"
            viewBox="0 0 50 50"
            role="presentation"
          >
            <circle
              className="page-loader__spinner-circle"
              cx="25"
              cy="25"
              r="20"
            />
          </svg>
        </div>
        <p className="page-loader__message">{message}</p>
      </div>
    </div>
  );
};
