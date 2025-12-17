import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export const useProjectPageFrame = (bannerImage, themeMode = 'auto') => {
  const [isScrolledPastBanner, setIsScrolledPastBanner] = useState(false);
  const { isDark, setThemeMode } = useTheme();
  const initialThemeRef = useRef(isDark ? 'dark' : 'light');
  const appliedThemeRef = useRef(null);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'auto'
    });
  }, []);

  useEffect(() => {
    if (!bannerImage) {
      return undefined;
    }

    const handleScroll = () => {
      const bannerHeight = window.innerHeight * 0.6;
      const scrollY = window.scrollY;
      setIsScrolledPastBanner(scrollY > bannerHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [bannerImage]);

  useLayoutEffect(() => {
    if (themeMode === 'auto') {
      return undefined;
    }

    const desiredMode = themeMode === 'dark' ? 'dark' : 'light';
    const initialMode = initialThemeRef.current;

    if (appliedThemeRef.current !== desiredMode) {
      setThemeMode(desiredMode);
      appliedThemeRef.current = desiredMode;
    }

    return () => {
      appliedThemeRef.current = null;
      if (initialMode !== desiredMode) {
        setThemeMode(initialMode);
      }
    };
  }, [themeMode, setThemeMode]);

  const shouldHideThemeToggle = themeMode === 'light' || themeMode === 'dark';
  const pageClassName = `project-page ${bannerImage ? 'has-banner' : ''} ${bannerImage && isScrolledPastBanner ? 'scrolled-past-banner' : ''} theme-${themeMode}`;

  return {
    pageClassName,
    shouldHideThemeToggle
  };
};
