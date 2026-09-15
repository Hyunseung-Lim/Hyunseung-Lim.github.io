import { useState } from 'react';
import { Topbar } from '../../Components/Topbar/topbar';
import { Footer } from '../../Components/Footer/footer';
import { PageLoadGuard } from '../../Components/PageLoader/PageLoadGuard';
import { useFadeInAnimation } from '../../hooks/useFadeInAnimation';
import { useProjectPageFrame } from '../../hooks/useProjectPageFrame';
import {
  ProjectHeader,
  ProjectBanner,
  ProjectDivider,
  ProjectVideoFrame,
  ProjectBibtexSection,
  collectProjectAssets
} from '../../Components/ProjectPage';

/**
 * Reference component used as a starting template when creating new project pages.
 *
 * 1. Add the project to src/Data/projectsMeta.js (title, subtitle, period, projectType,
 *    badge, links, banner, themeMode ...). The shared header/banner read everything from there.
 * 2. Duplicate this file into src/Pages/Projects/{Name}/{Name}.js and replace `projectData`
 *    with `PROJECTS['{id}']`.
 * 3. List page-specific images in PAGE_ASSETS (root-relative paths under public/).
 * 4. Keep the frame below as-is; only the contents of <main> are page-specific.
 */
const projectData = {
  id: 'template',
  title: 'Project Title',
  subtitle: 'One sentence subtitle describing the project',
  period: '2025',
  projectType: 'Research',
  themeMode: 'auto',
  // banner: '/projects/template/banner.webp',
  // bannerMobile: '/projects/template/banner_mobile.webp',
  // badge: { src: '/projects/template/badge.png', srcDark: '/projects/template/badge_dark.png', alt: 'Venue 2026' },
  // links: [{ type: 'paper', publisher: 'acm', href: 'https://doi.org/...' }, { type: 'github', href: '...' }]
};

const PAGE_ASSETS = collectProjectAssets(projectData, [
  // '/projects/template/overview.png'
]);

export const ProjectTemplate = () => {
  const [scrollRoot, setScrollRoot] = useState(null);
  const fadeInRef = useFadeInAnimation({ root: scrollRoot });
  const { pageClassName, shouldHideThemeToggle } = useProjectPageFrame(
    projectData.banner ?? null,
    projectData.themeMode ?? 'auto'
  );

  return (
    <PageLoadGuard assets={PAGE_ASSETS} message={`Loading ${projectData.title}...`}>
      <div className={`${pageClassName} project-page--${projectData.id}`}>
        <Topbar hideThemeToggle={shouldHideThemeToggle} />
        <ProjectBanner project={projectData} />

        <div className="project-container" ref={setScrollRoot}>
          <ProjectHeader project={projectData} fadeRef={fadeInRef} />

          <main className="project-content">
            <section className="project-section project-section--intro">
              <p className="section-text project-fade-block" ref={fadeInRef}>
                Describe the project goals, context, and outcomes. This block should provide a succinct narrative
                that introduces visitors to the project.
              </p>
            </section>

            <section className="project-section">
              <h2 className="section-title project-fade-block" ref={fadeInRef}>
                Highlights
              </h2>
              <ul className="section-list project-fade-block" ref={fadeInRef}>
                <li>Key highlight or contribution.</li>
                <li>Another milestone, study, or insight.</li>
                <li>Optional third bullet.</li>
              </ul>
            </section>

            <section className="project-section">
              <ProjectVideoFrame
                src="https://www.youtube.com/embed/VIDEO_ID"
                title={`${projectData.title} walkthrough`}
                fadeRef={fadeInRef}
              />
            </section>

            <ProjectDivider fadeRef={fadeInRef} />

            <ProjectBibtexSection fadeRef={fadeInRef} text={`@inproceedings{key,\n  title = {...}\n}`} />
          </main>
        </div>

        <Footer />
      </div>
    </PageLoadGuard>
  );
};
