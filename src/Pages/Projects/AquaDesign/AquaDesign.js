import { useState } from 'react';
import { Topbar } from '../../../Components/Topbar/topbar';
import { Footer } from '../../../Components/Footer/footer';
import { PROJECTS } from '../../../Data/projectsMeta';
import { useTheme } from '../../../contexts/ThemeContext';
import { useFadeInAnimation } from '../../../hooks/useFadeInAnimation';
import { useProjectPageFrame } from '../../../hooks/useProjectPageFrame';
import './AquaDesign.css';

export const AquaDesignProject = () => {
  const projectData = PROJECTS['aqua-design'];
  const { isDark } = useTheme();
  const [scrollRoot, setScrollRoot] = useState(null);
  const fadeInRef = useFadeInAnimation({ root: scrollRoot });
  const themeMode = projectData.themeMode ?? 'auto';
  const lightBanner = `${process.env.PUBLIC_URL}/projects/aqua-design/thumbnail.png`;
  const darkBanner = `${process.env.PUBLIC_URL}/projects/aqua-design/thumbnail_dark.png`;
  const bannerImage = isDark ? darkBanner : lightBanner;
  const overviewImage = `${process.env.PUBLIC_URL}/projects/aqua-design/img1.png`;
  const { pageClassName, shouldHideThemeToggle } = useProjectPageFrame(bannerImage, themeMode);

  return (
    <div className={pageClassName}>
      <Topbar hideThemeToggle={shouldHideThemeToggle} />

      {bannerImage && (
        <div className="banner-section">
          <img src={bannerImage} alt={`${projectData.title} banner`} className="banner-image" />
        </div>
      )}

      <div className="project-container" ref={setScrollRoot}>
        <header className="project-header">
          <h1 className="project-title aqua-design-fade-block project-fade-block" ref={fadeInRef}>{projectData.title}</h1>
          {projectData.subtitle && (
            <p className="project-subtitle aqua-design-fade-block project-fade-block" ref={fadeInRef}>
              {projectData.subtitle}
            </p>
          )}
          <div className="project-meta-info">
            {projectData.period && (
              <div className="project-period-section aqua-design-fade-block project-fade-block" ref={fadeInRef}>
                <div className="meta-label">Period</div>
                <div className="meta-value">{projectData.period}</div>
              </div>
            )}
            {projectData.projectType && (
              <div className="project-type-section aqua-design-fade-block project-fade-block" ref={fadeInRef}>
                <div className="meta-label">Project Type</div>
                <div className="meta-value">{projectData.projectType}</div>
              </div>
            )}
            <div className="project-awards-section aqua-design-fade-block project-fade-block" aria-label="Project awards" ref={fadeInRef}>
              <a
                href="https://ifdesign.com/en/winner-ranking/project/aqua/312577"
                target="_blank"
                rel="noopener noreferrer"
                className="project-award-link"
                aria-label="iF Design Award 2021"
              >
                <img
                  src={`${process.env.PUBLIC_URL}/projects/aqua-design/design_award.svg`}
                  alt="iF Design Award 2021"
                  className="project-award-badge"
                  loading="lazy"
                />
              </a>
            </div>
          </div>
        </header>

        <main className="project-content">
          <section className="project-section aqua-design-overview">
            <div className="aqua-design-overview__media aqua-design-fade-block" ref={fadeInRef}>
              <img
                src={overviewImage}
                alt="Visualization of AQUA asset management interface"
                loading="lazy"
              />
            </div>
            <div className="aqua-design-overview__text aqua-design-fade-block" ref={fadeInRef}>
              <p className="aqua-design-overview__subtitle">People Tend to Associate Money with Purpose</p>
              <p className="aqua-design-overview__content">
                According to behavioural economics, people place different values on money on subjective criteria.
                This called <strong>Mental Accounting</strong>. However, this difference of values is not clearly expressed in traditional
                asset management systems. <strong>AQUA</strong> is asset management system that expresses the different purposes money is associated with.
              </p>
            </div>
          </section>

          <section className="project-section aqua-design-video aqua-design-fade-block" ref={fadeInRef}>
            <div className="aqua-design-video__frame">
              <iframe
                src="https://www.youtube.com/embed/hctUpCzpNfU?si=0as3GUUX7a9Agss-"
                title="AQUA Design walkthrough"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
};
