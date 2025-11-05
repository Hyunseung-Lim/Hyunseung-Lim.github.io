import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Topbar } from '../../Components/Topbar/topbar';
import { Footer } from '../../Components/Footer/footer';
import { useFadeInAnimation } from '../../hooks/useFadeInAnimation';
import { useTheme } from '../../contexts/ThemeContext';
import './ProjectTemplate.css';
import personLinks from '../../Data/personLinks.json';

export const ProjectTemplate = ({
  title,
  subtitle,
  period,
  participants = [],
  status,
  projectType,
  bannerImage,
  themeMode = 'auto', // 'auto', 'light', 'dark'
  highlightParticipants = [],
  children
}) => {
  const fadeInRef = useFadeInAnimation();
  const [isScrolledPastBanner, setIsScrolledPastBanner] = useState(false);
  const { isDark, setThemeMode } = useTheme();
  const initialThemeRef = useRef(isDark ? 'dark' : 'light');
  const highlightSet = highlightParticipants.length > 0 ? new Set(highlightParticipants) : null;
  const appliedThemeRef = useRef(null);

  useEffect(() => {
    if (!bannerImage) return;

    const handleScroll = () => {
      const bannerHeight = window.innerHeight * 0.6; // 60vh
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
  }, [setThemeMode, themeMode]);

  const renderParticipants = () => {
    return participants.map((participant, index) => {
      const isHighlighted = highlightSet
        ? highlightSet.has(index)
        : participant === 'Hyunseung Lim';
      const link = personLinks[participant];

      const content = link ? (
        <a href={link} target="_blank" rel="noopener noreferrer">
          {participant}
        </a>
      ) : participant;

      return (
        <span key={index} className={isHighlighted ? 'highlighted-participant' : ''}>
          {content}
          {index < participants.length - 1 && ', '}
        </span>
      );
    });
  };

  const shouldHideThemeToggle = themeMode === 'light' || themeMode === 'dark';

  return (
    <div className={`project-page ${bannerImage ? 'has-banner' : ''} ${bannerImage && isScrolledPastBanner ? 'scrolled-past-banner' : ''} theme-${themeMode}`}>
      <Topbar hideThemeToggle={shouldHideThemeToggle} />

      {bannerImage && (
        <div className="banner-section">
          <img src={bannerImage} alt={`${title} banner`} className="banner-image" />
        </div>
      )}

      <div className="project-container">
        <header className="project-header" ref={fadeInRef}>
          <h1 className="project-title">{title}</h1>
          {subtitle && <p className="project-subtitle">{subtitle}</p>}
          <div className="project-period">{period}</div>
          <div className="participants-list">
            {renderParticipants()}
          </div>
          <div className="project-meta-info">
            {status && (
              <div className="project-status-section">
                <div className="meta-label">Status</div>
                <div className="meta-value">{status}</div>
              </div>
            )}
            {projectType && (
              <div className="project-type-section">
                <div className="meta-label">Project Type</div>
                <div className="meta-value">{projectType}</div>
              </div>
            )}
          </div>
        </header>

        <main className="project-content" ref={fadeInRef}>
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
};
