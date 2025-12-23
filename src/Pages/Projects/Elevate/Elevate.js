import { useState } from 'react';
import { Topbar } from '../../../Components/Topbar/topbar';
import { Footer } from '../../../Components/Footer/footer';
import { PROJECTS } from '../../../Data/projectsMeta';
import { useFadeInAnimation } from '../../../hooks/useFadeInAnimation';
import { useProjectPageFrame } from '../../../hooks/useProjectPageFrame';
import './Elevate.css';

export const ElevateProject = () => {
  const projectData = PROJECTS.elevate;
  const [scrollRoot, setScrollRoot] = useState(null);
  const fadeInRef = useFadeInAnimation({ root: scrollRoot });
  const themeMode = projectData.themeMode ?? 'auto';
  const desktopBanner =
    projectData.bannerImage ?? `${process.env.PUBLIC_URL}/projects/elevate/thumbnail.png`;
  const mobileBanner = `${process.env.PUBLIC_URL}/projects/elevate/thumbnail_mobile.png`;
  const installationVideoUrl = 'https://www.youtube.com/embed/QvuVQ68uf-w?rel=0';
  const { pageClassName, shouldHideThemeToggle } = useProjectPageFrame(desktopBanner, themeMode);

  return (
    <div className={`${pageClassName} project-page--elevate`}>
      <Topbar hideThemeToggle={shouldHideThemeToggle} />
      {desktopBanner && (
        <div className="banner-section elevate-banner">
          <picture>
            <source media="(max-width: 640px)" srcSet={mobileBanner} />
            <img
              src={desktopBanner}
              alt={`${projectData.title} banner`}
              className="banner-image elevate-banner-image"
            />
          </picture>
        </div>
      )}

      <div className="project-container" ref={setScrollRoot}>
        <header className="project-header">
          <h1 className="project-title project-fade-block" ref={fadeInRef}>{projectData.title}</h1>
          {projectData.subtitle && <p className="project-subtitle project-fade-block" ref={fadeInRef}>{projectData.subtitle}</p>}
          <div className="project-meta-info">
            {projectData.period && (
              <div className="project-period-section project-fade-block" ref={fadeInRef}>
                <div className="meta-label">Period</div>
                <div className="meta-value">{projectData.period}</div>
              </div>
            )}
            {projectData.projectType && (
              <div className="project-type-section project-fade-block" ref={fadeInRef}>
                <div className="meta-label">Project Type</div>
                <div className="meta-value">{projectData.projectType}</div>
              </div>
            )}
            <div className="project-awards-section project-fade-block" aria-label="Project awards" ref={fadeInRef}>
              <a
                href="https://dl.acm.org/doi/abs/10.1145/3411764.3445454"
                target="_blank"
                rel="noopener noreferrer"
                className="project-award-link"
                aria-label="View CHI 2021 publication"
              >
                <img
                  src={`${process.env.PUBLIC_URL}/projects/elevate/chi_logo.png`}
                  alt="CHI 2021"
                  className="project-award-badge elevate-award"
                  loading="lazy"
                />
              </a>
            </div>
          </div>
        </header>

        <main className="project-content">
          <section className="project-section elevate-overview">
            <div className="elevate-overview__copy project-fade-block" ref={fadeInRef}>
              <p className="section-text">
                Elevate enables users to experience not only large variations in shapes but also the details of the
                underlying terrain. This provides possible way to utilize through applications.
                <br />
                <br />
                Current head-mounted displays enable users to explore virtual worlds by simply walking through them.
                This led researchers to create haptic displays that can also simulate different types of elevation
                shapes. However, existing shape-changing floors are limited by their tabletop scale or the coarse
                resolution of the terrains they can display due to the limited number of actuators and low vertical
                resolution.
              </p>
            </div>
          </section>

          <section className="project-section">
            <div className="elevate-video-frame" ref={fadeInRef}>
              <iframe
                src={installationVideoUrl}
                title="Elevate installation walkthrough"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <div className="elevate-divider" role="presentation" aria-hidden="true" />
          </section>

          <section className="project-section">
            <h2 className="section-title">Highlights</h2>
            <ul className="section-list" ref={fadeInRef}>
              <li>Mapped pain points in collaborative evaluation workflows across two design schools.</li>
              <li>Co-designed speculative AI interventions to surface hidden applicant signals.</li>
              <li>Preparing a longitudinal field deployment targeting the 2025 admissions cycle.</li>
            </ul>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
};
