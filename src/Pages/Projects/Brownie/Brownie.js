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
          </div>
        </header>

        <main className="project-content">
          <section className="project-section project-section__fade" ref={fadeInRef}>
            <h2 className="section-title">Overview</h2>
            <p className="section-text">
              Brownie explores how AI can help small bakery teams co-design inclusive dessert offerings by blending customer flavor preferences with nutrition constraints and playfulness.
            </p>
          </section>

          <section className="project-section project-section__fade" ref={fadeInRef}>
            <h2 className="section-title">Role</h2>
            <p className="section-text">
              Leading interaction design and prototyping of the AI assistant, as well as co-creation workshops with local bakers.
            </p>
          </section>

          <section className="project-section project-section__fade" ref={fadeInRef}>
            <h2 className="section-title">Highlights</h2>
            <ul className="section-list">
              <li>Developing a conversational recipe ideation workflow that balances creativity with dietary needs.</li>
              <li>Running pilot tasting sessions to iterate on sensory feedback loops.</li>
              <li>Preparing user study protocols for a late-2024 evaluation.</li>
            </ul>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
};
