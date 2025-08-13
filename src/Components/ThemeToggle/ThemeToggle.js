import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import './ThemeToggle.css';

const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="4" fill="currentColor"/>
    <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" 
          stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" 
          fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ThemeToggle = ({ isMobile = false }) => {
  const { isDark, toggleTheme } = useTheme();

  if (isMobile) {
    return (
      <button className="theme-toggle mobile" onClick={toggleTheme}>
        Dark Mode
      </button>
    );
  }

  return (
    <button className="theme-toggle desktop" onClick={toggleTheme} title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
};