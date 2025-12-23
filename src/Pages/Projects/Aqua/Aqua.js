import { useState } from 'react';
import { Topbar } from '../../../Components/Topbar/topbar';
import { Footer } from '../../../Components/Footer/footer';
import { PROJECTS } from '../../../Data/projectsMeta';
import { useFadeInAnimation } from '../../../hooks/useFadeInAnimation';
import { useProjectPageFrame } from '../../../hooks/useProjectPageFrame';
import './Aqua.css';
import { useTheme } from '../../../contexts/ThemeContext';

export const AquaProject = () => {
  const projectData = PROJECTS.aqua;
  const [scrollRoot, setScrollRoot] = useState(null);
  const fadeInRef = useFadeInAnimation({ root: scrollRoot });
  const themeMode = projectData.themeMode ?? 'auto';
  const bannerImage = projectData.bannerImage ?? null;
  const { pageClassName, shouldHideThemeToggle } = useProjectPageFrame(bannerImage, themeMode);
  const { isDark } = useTheme();
  const awardBadgeSrc = isDark
    ? `${process.env.PUBLIC_URL}/projects/aqua/dis2024_dark.png`
    : `${process.env.PUBLIC_URL}/projects/aqua/dis2024.png`;

  return (
    <div className={`${pageClassName} project-page--aqua`}>
      <Topbar hideThemeToggle={shouldHideThemeToggle} />

      {bannerImage && (
        <div className="banner-section">
          <img src={bannerImage} alt={`${projectData.title} banner`} className="banner-image" />
        </div>
      )}

      <div className="project-container" ref={setScrollRoot}>
        <header className="project-header">
          <div className="project-header__fade-block project-fade-block" ref={fadeInRef}>
            <h1 className="project-title">{projectData.title}</h1>
            {projectData.subtitle && <p className="project-subtitle">{projectData.subtitle}</p>}
          </div>
          <div className="project-meta-info">
            {projectData.period && (
              <div className="project-period-section project-header__fade-block project-fade-block" ref={fadeInRef}>
                <div className="meta-label">Period</div>
                <div className="meta-value">{projectData.period}</div>
              </div>
            )}
            {projectData.projectType && (
              <div className="project-type-section project-header__fade-block project-fade-block" ref={fadeInRef}>
                <div className="meta-label">Project Type</div>
                <div className="meta-value">{projectData.projectType}</div>
              </div>
            )}
            <div className="project-awards-section project-header__fade-block project-fade-block" ref={fadeInRef}>
              <a
                href="https://dl.acm.org/doi/abs/10.1145/3643834.3660705"
                target="_blank"
                rel="noopener noreferrer"
                className="project-award-link"
                aria-label="Read DIS 2024 publication"
              >
                <img
                  src={awardBadgeSrc}
                  alt="DIS 2024 Exhibition Badge"
                  className="project-award-badge"
                  loading="lazy"
                />
              </a>
            </div>
          </div>
        </header>

        <main className="project-content">
          <section className="project-section project-section__fade" ref={fadeInRef}>
            <h2 className="section-title">Overview</h2>
            <p className="section-text">
              AQUA investigates symbiotic relationships between urban residents and water systems through playful, data-driven installations that surface hidden infrastructures.
            </p>
          </section>

          <section className="project-section project-section__fade" ref={fadeInRef}>
            <h2 className="section-title">Role</h2>
            <p className="section-text">
              Directed concept development, data storytelling, and interactive fabrication with a cross-disciplinary team of designers and engineers.
            </p>
          </section>

          <section className="project-section project-section__fade" ref={fadeInRef}>
            <h2 className="section-title">Highlights</h2>
            <ul className="section-list">
              <li>Installed a responsive fountain that adapts to community usage.</li>
              <li>Co-designed participatory workshops with local residents.</li>
              <li>Produced an open-source toolkit for water-sensing prototypes.</li>
            </ul>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
};
