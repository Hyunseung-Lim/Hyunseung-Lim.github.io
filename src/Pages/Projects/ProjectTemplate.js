import { useState } from 'react';
import { Topbar } from '../../Components/Topbar/topbar';
import { Footer } from '../../Components/Footer/footer';
import { useFadeInAnimation } from '../../hooks/useFadeInAnimation';
import { useProjectPageFrame } from '../../hooks/useProjectPageFrame';

/**
 * Reference component used as a starting template when creating new project pages.
 * Duplicate this file into a new folder and adjust the metadata/content to match the project.
 */
export const ProjectTemplate = () => {
  const projectData = {
    title: 'Project Title',
    subtitle: 'One sentence subtitle describing the project',
    period: '2025',
    projectType: 'Research',
    bannerImage: null,
    themeMode: 'auto'
  };

  const [scrollRoot, setScrollRoot] = useState(null);
  const fadeInRef = useFadeInAnimation({ root: scrollRoot });
  const { pageClassName, shouldHideThemeToggle } = useProjectPageFrame(
    projectData.bannerImage,
    projectData.themeMode
  );

  return (
    <div className={pageClassName}>
      <Topbar hideThemeToggle={shouldHideThemeToggle} />

      {projectData.bannerImage && (
        <div className="banner-section">
          <img src={projectData.bannerImage} alt={`${projectData.title} banner`} className="banner-image" />
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
          </div>
        </header>

        <main className="project-content">
          <section className="project-section">
            <h2 className="section-title">Overview</h2>
            <p className="section-text" ref={fadeInRef}>
              Describe the project goals, context, and outcomes. This block should provide a succinct narrative
              that introduces visitors to the project.
            </p>
          </section>

          <section className="project-section">
            <h2 className="section-title">Highlights</h2>
            <ul className="section-list" ref={fadeInRef}>
              <li>Key highlight or contribution.</li>
              <li>Another milestone, study, or insight.</li>
              <li>Optional third bullet.</li>
            </ul>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
};
