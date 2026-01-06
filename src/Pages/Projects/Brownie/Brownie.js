import { useState } from 'react';
import { useFadeInAnimation } from '../../../hooks/useFadeInAnimation';
import { useProjectPageFrame } from '../../../hooks/useProjectPageFrame';
import './Brownie.css';
import { Topbar } from '../../../Components/Topbar/topbar';
import { Footer } from '../../../Components/Footer/footer';
import { PROJECTS } from '../../../Data/projectsMeta';
import { PageLoadGuard } from '../../../Components/PageLoader/PageLoadGuard';

const BROWNIE_DESKTOP_BANNER = `${process.env.PUBLIC_URL}/projects/brownie/thumbnail.png`;
const BROWNIE_MOBILE_BANNER = `${process.env.PUBLIC_URL}/projects/brownie/thumbnail_mobile.png`;
const BROWNIE_ASSETS = Array.from(
  new Set([BROWNIE_DESKTOP_BANNER, BROWNIE_MOBILE_BANNER].filter(Boolean))
);
const BROWNIE_CONCEPT_VIDEO_URL = 'https://www.youtube.com/embed/3SPt_vbqIFs?rel=0';

export const BrownieProject = () => {
  const projectData = PROJECTS.brownie;
  const [scrollRoot, setScrollRoot] = useState(null);
  const fadeInRef = useFadeInAnimation({ root: scrollRoot });
  const themeMode = projectData.themeMode ?? 'auto';
  const desktopBanner = BROWNIE_DESKTOP_BANNER;
  const mobileBanner = BROWNIE_MOBILE_BANNER;
  const { pageClassName, shouldHideThemeToggle } = useProjectPageFrame(desktopBanner, themeMode);

  const loaderMessage = `Loading ${projectData.title}...`;

  return (
    <PageLoadGuard assets={BROWNIE_ASSETS} message={loaderMessage}>
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
          <section className="project-section brownie-intro">
            <div className="project-fade-block" ref={fadeInRef}>
              <p className="section-text">
                Most cooking recipes we encounter are polished, completed versions. Although they
                are shaped by many trials and errors, it&apos;s hard to know what those errors were
                or how they were overcome. As a result, when you follow a finished recipe from the
                start, you may not know how to handle an unintended outcome. One answer lies in
                learning from failed cooking, but it&apos;s difficult to keep failing alone until you
                succeed.
              </p>
            </div>
            <div className="project-fade-block" ref={fadeInRef}>
              <p className="section-text">
                Brownie, a community for sharing failed dishes, helps users share their failures,
                identify the causes, and overcome them together. By seeing others&apos; failed
                recipes, users can find fun and a sense of kinship, reduce their fear of failure, and
                become more willing to try new dishes.
              </p>
            </div>
          </section>

          <section className="project-section project-section__fade" ref={fadeInRef}>
            <div className="brownie-video-frame">
              <iframe
                src={BROWNIE_CONCEPT_VIDEO_URL}
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
    </PageLoadGuard>
  );
};
