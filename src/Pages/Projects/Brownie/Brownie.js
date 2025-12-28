import { useState } from 'react';
import { useFadeInAnimation } from '../../../hooks/useFadeInAnimation';
import { useProjectPageFrame } from '../../../hooks/useProjectPageFrame';
import './Brownie.css';
import { Topbar } from '../../../Components/Topbar/topbar';
import { Footer } from '../../../Components/Footer/footer';
import { PROJECTS } from '../../../Data/projectsMeta';

export const BrownieProject = () => {
  const projectData = PROJECTS.brownie;
  const [scrollRoot, setScrollRoot] = useState(null);
  const fadeInRef = useFadeInAnimation({ root: scrollRoot });
  const themeMode = projectData.themeMode ?? 'auto';
  const desktopBanner = `${process.env.PUBLIC_URL}/projects/brownie/thumbnail.png`;
  const mobileBanner = `${process.env.PUBLIC_URL}/projects/brownie/thumbnail_mobile.png`;
  const conceptVideoUrl = 'https://www.youtube.com/embed/3SPt_vbqIFs?rel=0';
  const { pageClassName, shouldHideThemeToggle } = useProjectPageFrame(desktopBanner, themeMode);

  return (
    <div className={`${pageClassName} project-page--brownie`}>
      <Topbar hideThemeToggle={shouldHideThemeToggle} />

      {desktopBanner && (
        <div className="banner-section brownie-banner">
          <picture>
            <source media="(max-width: 640px)" srcSet={mobileBanner} />
            <img
              src={desktopBanner}
              alt={`${projectData.title} banner`}
              className="banner-image brownie-banner-image"
            />
          </picture>
        </div>
      )}

      <div className="project-container" ref={setScrollRoot}>
        <header className="project-header">
          <div className="project-header__fade-block project-fade-block" ref={fadeInRef}>
            <h1 className="project-title">{projectData.title}</h1>
            {projectData.subtitle && (
              <p className="project-subtitle">A Social Community for Sharing Cooking Fails</p>
            )}
          </div>
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
          </div>
        </header>

        <div
          className="project-divider project-divider--header project-fade-block"
          role="presentation"
          aria-hidden="true"
          ref={fadeInRef}
        />

        <main className="project-content">
          <section className="project-section project-section__fade" ref={fadeInRef}>
            <div className="brownie-video-frame">
              <iframe
                src={conceptVideoUrl}
                title="Brownie concept walkthrough"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <div
              className="project-divider project-fade-block"
              role="presentation"
              aria-hidden="true"
              ref={fadeInRef}
            />
          </section>

        </main>
      </div>
      <Footer />
    </div>
  );
};
