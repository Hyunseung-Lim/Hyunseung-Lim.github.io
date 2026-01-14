import { useState } from 'react';
import { useFadeInAnimation } from '../../../hooks/useFadeInAnimation';
import { useProjectPageFrame } from '../../../hooks/useProjectPageFrame';
import './Brownie.css';
import { Topbar } from '../../../Components/Topbar/topbar';
import { Footer } from '../../../Components/Footer/footer';
import { PROJECTS } from '../../../Data/projectsMeta';
import { PageLoadGuard } from '../../../Components/PageLoader/PageLoadGuard';
import { MobileScreenRail } from '../../../Components/MobileScreenRail/MobileScreenRail';

const BROWNIE_DESKTOP_BANNER = `${process.env.PUBLIC_URL}/projects/brownie/thumbnail.png`;
const BROWNIE_MOBILE_BANNER = `${process.env.PUBLIC_URL}/projects/brownie/thumbnail_mobile.png`;
const BROWNIE_SCREEN_IMAGES = Array.from(
  { length: 7 },
  (_, index) => `${process.env.PUBLIC_URL}/projects/brownie/screen/${index + 1}.png`
);
const BROWNIE_ASSETS = Array.from(
  new Set([...BROWNIE_SCREEN_IMAGES, BROWNIE_DESKTOP_BANNER, BROWNIE_MOBILE_BANNER].filter(Boolean))
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

          <section className="project-section brownie-design-overview project-fade-block" ref={fadeInRef}>
            <h2 className="section-title">Why Brownie?</h2>
            <p className="section-text">
              Brownies are said to have been created by accident. In the United States, a woman reportedly forgot to add
              baking powder while trying to make a chocolate cake. As a result, the cake didn’t rise. Thinking it would be
              wasteful to throw it away, she shared it with her neighbors, and many people enjoyed its chewy texture. This
              shows how a &quot;failed&quot; attempt can sometimes lead to a new recipe. Brownie, a community for sharing cooking
              failures, enables people to share unsuccessful dishes with others and overcome them together.
            </p>
          </section>

          <section className="project-section brownie-design-overview project-fade-block" ref={fadeInRef}>
            <h2 className="section-title">Design of Brownie</h2>
            <p className="section-text">
              Brownie is designed to feel more like social media, making it easy to browse other people’s cooking recipes
              through your feed while linking multiple attempts of the same dish so you can quickly see how everyone has
              progressed over time. It also helps users archive and manage their own recipes—by recording each cooking
              session, they can improve their skills and visually track their growth through the app’s various graphs.
            </p>
          </section>

          <div
            className="project-divider project-fade-block"
            role="presentation"
            aria-hidden="true"
            ref={fadeInRef}
          />

          <MobileScreenRail
            className="project-fade-block brownie-mobile-rail"
            sectionRef={fadeInRef}
            heading="Mobile Screens"
            screens={BROWNIE_SCREEN_IMAGES.map((image, index) => ({
              image,
              alt: `Brownie mobile screen ${index + 1}`
            }))}
            cardWidth="clamp(240px, 28vw, 340px)"
            gap={28}
            showMetadata={false}
            clampToContainer
          />

          <div
            className="project-divider project-fade-block"
            role="presentation"
            aria-hidden="true"
            ref={fadeInRef}
          />

          <section className="project-section brownie-user-study project-fade-block" ref={fadeInRef}>
            <h2 className="section-title">User Study</h2>
            <p className="section-text">
              A user test was conducted to evaluate usability and to verify whether Brownie helps improve users&apos;
              cooking skills. Six participants took part (mean age: 23), and they reported cooking an average of twice per
              week. Each participant completed 2–3 sessions in total. During the test, participants made Spanish omelets
              and posted their recipes in the app. They also spent time reviewing other users recipes and communicating via
              the feed before and after cooking.
            </p>
            <div className="brownie-video-frame">
              <iframe
                src="https://www.youtube.com/embed/VTdQv7znX3w?si=cWltKdm89KN8mvDN"
                title="Brownie user study highlights"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </section>

        </main>
        </div>
        <Footer />
      </div>
    </PageLoadGuard>
  );
};
