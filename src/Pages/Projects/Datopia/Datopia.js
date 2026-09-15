import { useState } from 'react';
import { Topbar } from '../../../Components/Topbar/topbar';
import { Footer } from '../../../Components/Footer/footer';
import { PROJECTS } from '../../../Data/projectsMeta';
import { useFadeInAnimation } from '../../../hooks/useFadeInAnimation';
import { useProjectPageFrame } from '../../../hooks/useProjectPageFrame';
import { MobileScreenRail } from '../../../Components/MobileScreenRail/MobileScreenRail';
import { PageLoadGuard } from '../../../Components/PageLoader/PageLoadGuard';
import {
  ProjectHeader,
  ProjectBanner,
  ProjectDivider,
  ProjectVideoFrame,
  collectProjectAssets
} from '../../../Components/ProjectPage';
import './Datopia.css';

const RUN_SEQUENCE = [1, 2, 3];
const GLIDE_DURATION = 9; // seconds
const GLIDE_DELAY_STEP = 1.4; // seconds
const DATOPIA_ASSETS = collectProjectAssets(PROJECTS.datopia, [
  '/projects/datopia/interface.webp',
  '/projects/datopia/exhibition.webp',
  '/projects/datopia/animation.gif',
  ...Array.from({ length: 10 }, (_, index) => `/projects/datopia/screen/${index + 1}.png`)
]);

export const DatopiaProject = () => {
  const projectData = PROJECTS['datopia'];
  const [scrollRoot, setScrollRoot] = useState(null);
  const fadeInRef = useFadeInAnimation({ root: scrollRoot });
  const themeMode = projectData.themeMode ?? 'auto';
  const { pageClassName, shouldHideThemeToggle } = useProjectPageFrame(projectData.banner, themeMode);

  const [runIndex, setRunIndex] = useState(0);
  const [cycleId, setCycleId] = useState(0);
  const batchSize = RUN_SEQUENCE[runIndex];

  const handleAnimationCycleEnd = () => {
    setRunIndex(prev => (prev + 1) % RUN_SEQUENCE.length);
    setCycleId(prev => prev + 1);
  };

  const loaderMessage = `Loading ${projectData.title}...`;

  return (
    <PageLoadGuard assets={DATOPIA_ASSETS} message={loaderMessage}>
      <div className={`${pageClassName} project-page--datopia`}>
        <Topbar hideThemeToggle={shouldHideThemeToggle} />
        <ProjectBanner project={projectData} />

        <div className="project-container" ref={setScrollRoot}>
        <ProjectHeader project={projectData} fadeRef={fadeInRef} />

        <main className="project-content">
          <section className="project-section project-section--intro">
            <p className="section-text project-fade-block" ref={fadeInRef}>
                Datopia is a data-based dating service. By analyzing data, it captures everything
                from the preferences you didn't know you had to your minor daily habits. Through this,
                it goes beyond simple encounters to find you a destined partner with whom you can
                maintain a continuous relationship.{' '}
                <span className="datopia-highlight">
                  But can love really be determined solely by data?
                </span>
            </p>
          </section>

          <section className="project-section">
            <ProjectVideoFrame
              src="https://www.youtube.com/embed/2mOZOPmv0KI?rel=0"
              title="Datopia Exhibition Walkthrough"
              fadeRef={fadeInRef}
            />
          </section>

          <ProjectDivider fadeRef={fadeInRef} />

          <section className="project-section datopia-welcome">
              <h2 className="section-title datopia-welcome__title project-fade-block" ref={fadeInRef}>
                Welcome to Datopia!
              </h2>
              <p className="section-text datopia-welcome__body project-fade-block" ref={fadeInRef}>
                In Datopia, you don't need to create a profile yourself, and you don't have to keep swiping every day to find someone who matches you. All you need to do is consent to data collection. Once you agree, Datopia immediately starts collecting your data and recommends a partner who suits you. There's no doubt that the person Datopia recommends is the right match for you. So you can focus solely on connecting with the person you're recommended!
              </p>
              <p className="section-text datopia-welcome__body project-fade-block" ref={fadeInRef}>
                And though it probably won't happen, if you don't like your recommended match, try our premium service.
              </p>
          </section>

          <MobileScreenRail
              className="project-fade-block datopia-mobile-rail"
              sectionRef={fadeInRef}
              screens={Array.from({ length: 10 }).map((_, index) => ({
                image: `${process.env.PUBLIC_URL}/projects/datopia/screen/${index + 1}.png`,
                alt: `Datopia mobile scenario ${index + 1}`
              }))}
              cardWidth="clamp(260px, 24vw, 360px)"
              gap={32}
              showMetadata={false}
              clampToContainer
            />
          <section className="project-section datopia-reflection">
              <h2 className="section-title datopia-reflection__title project-fade-block" ref={fadeInRef}>Rethinking Future Love</h2>
              <p className="section-text datopia-reflection__body project-fade-block" ref={fadeInRef}>
                Datopia is a critical design project that asks how data-driven services, which are now part of everyday life, might change the way we form relationships. Today, a wide range of recommendation algorithms make decision-making easier. At times, they even infer our preferences, behaviors, and memories, including things we may not be fully aware of, and make decisions on our behalf.
              </p>
              <p className="section-text datopia-reflection__body project-fade-block" ref={fadeInRef}>
                But can love really be judged by data alone? How can we be sure that the person an algorithm recommends is truly our destined partner? Is it okay to hand over agency in love to an algorithm? Through Datopia, this exhibition imagines a form of love that may exist in the future, and lets visitors experience it and think about these questions.
              </p>
          </section>

          <ProjectDivider fadeRef={fadeInRef} />

          <section className="project-section datopia-media">
              <h2 className="section-title datopia-media-title project-fade-block" ref={fadeInRef}>Exhibition</h2>
              <div className="datopia-figures project-fade-block" ref={fadeInRef}>
                {[
                  {
                    src: `${process.env.PUBLIC_URL}/projects/datopia/interface.webp`,
                    alt: 'Datopia interface detail'
                  },
                  {
                    src: `${process.env.PUBLIC_URL}/projects/datopia/exhibition.webp`,
                    alt: 'Datopia exhibition interaction'
                  }
                ].map((figure, index) => (
                  <img
                    key={index}
                    src={figure.src}
                    alt={figure.alt}
                    className="datopia-figure"
                    loading="lazy"
                  />
                ))}
              </div>
          </section>
        </main>
        </div>

        <div className="datopia-animation" key={cycleId}>
          {Array.from({ length: batchSize }).map((_, index) => (
            <img
              key={`${cycleId}-${index}`}
              src={`${process.env.PUBLIC_URL}/projects/datopia/animation.gif`}
              alt="Datopia animation"
              className="datopia-animation__sprite"
              style={{
                animationDelay: `${index * GLIDE_DELAY_STEP}s`,
                animationDuration: `${GLIDE_DURATION}s`
              }}
              onAnimationEnd={
                index === batchSize - 1 ? handleAnimationCycleEnd : undefined
              }
            />
          ))}
        </div>

        <Footer />
      </div>
    </PageLoadGuard>
  );
};
