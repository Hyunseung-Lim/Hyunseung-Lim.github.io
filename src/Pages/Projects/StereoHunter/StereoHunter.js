import { useState } from 'react';
import { Topbar } from '../../../Components/Topbar/topbar';
import { Footer } from '../../../Components/Footer/footer';
import { PROJECTS } from '../../../Data/projectsMeta';
import { useFadeInAnimation } from '../../../hooks/useFadeInAnimation';
import { useProjectPageFrame } from '../../../hooks/useProjectPageFrame';
import './StereoHunter.css';

export const StereoHunterProject = () => {
  const projectData = PROJECTS.stereohunter;
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
              StereoHunter investigates how design practitioners surface, interrogate, and mitigate
              stereotypical responses when collaborating with large language models during early-stage
              concept work.
            </p>
          </section>

          <section className="project-section">
            <h2 className="section-title">Role</h2>
            <p className="section-text" ref={fadeInRef}>
              Leading study design, facilitating co-analysis workshops, and prototyping interactive
              bias-spotting aids that integrate with existing creative tools.
            </p>
          </section>

          <section className="project-section">
            <h2 className="section-title">Highlights</h2>
            <ul className="section-list" ref={fadeInRef}>
              <li>Ran collaborative critique sessions across design studios to catalogue stereotype signals.</li>
              <li>Built lightweight LLM probes that visualize how prompt phrasing shifts perceived bias.</li>
              <li>Drafting guidelines to help hybrid teams negotiate bias remediation strategies.</li>
            </ul>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
};
