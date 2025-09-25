import React, { useEffect, useState } from 'react';
import { Topbar } from '../../Components/Topbar/topbar';
import { Footer } from '../../Components/Footer/footer';
import { useFadeInAnimation } from '../../hooks/useFadeInAnimation';
import './ProjectTemplate.css';

export const ProjectTemplate = ({
  title,
  period,
  participants,
  status,
  projectType,
  bannerImage,
  themeMode = 'auto', // 'auto', 'light', 'dark'
  children
}) => {
  const fadeInRef = useFadeInAnimation();
  const [isScrolledPastBanner, setIsScrolledPastBanner] = useState(false);

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

  useEffect(() => {
    const body = document.body;

    if (themeMode === 'dark') {
      body.classList.add('dark-mode');
    } else if (themeMode === 'light') {
      body.classList.remove('dark-mode');
    }
    // 'auto'인 경우 기존 ThemeContext가 관리
  }, [themeMode]);

  const renderParticipants = () => {
    return participants.map((participant, index) => {
      const isHighlighted = participant === 'Hyunseung Lim';
      return (
        <span key={index} className={isHighlighted ? 'highlighted-participant' : ''}>
          {participant}
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