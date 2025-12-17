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
  const bannerImage = projectData.bannerImage ?? null;
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
              Elevate explores how generative AI can scaffold equitable evaluation practices in graduate
              admissions, tracing how reviewers interpret portfolios, statements, and AI-augmented artifacts.
            </p>
          </section>

          <section className="project-section">
            <h2 className="section-title">Role</h2>
            <p className="section-text" ref={fadeInRef}>
              Leading mixed-methods studies with admissions committees, prototyping decision-support
              tooling, and shaping responsible AI guidelines for creative programs.
            </p>
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
