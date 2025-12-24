import { useState } from 'react';
import { Topbar } from '../../../Components/Topbar/topbar';
import { Footer } from '../../../Components/Footer/footer';
import { PROJECTS } from '../../../Data/projectsMeta';
import { useFadeInAnimation } from '../../../hooks/useFadeInAnimation';
import { useProjectPageFrame } from '../../../hooks/useProjectPageFrame';
import { MobileScreenRail } from '../../../Components/MobileScreenRail/MobileScreenRail';
import './Datopia.css';

const RUN_SEQUENCE = [1, 2, 3];
const GLIDE_DURATION = 9; // seconds
const GLIDE_DELAY_STEP = 1.4; // seconds

export const DatopiaProject = () => {
  const projectData = PROJECTS['datopia'];
  const [scrollRoot, setScrollRoot] = useState(null);
  const fadeInRef = useFadeInAnimation({ root: scrollRoot });
  const bannerImage = `${process.env.PUBLIC_URL}/projects/datopia/thumbnail.png`;
  const themeMode = projectData.themeMode ?? 'auto';
  const { pageClassName, shouldHideThemeToggle } = useProjectPageFrame(bannerImage, themeMode);

  const [runIndex, setRunIndex] = useState(0);
  const [cycleId, setCycleId] = useState(0);
  const batchSize = RUN_SEQUENCE[runIndex];

  const handleAnimationCycleEnd = () => {
    setRunIndex(prev => (prev + 1) % RUN_SEQUENCE.length);
    setCycleId(prev => prev + 1);
  };

  return (
    <div className={`${pageClassName} project-page--datopia`}>
      <Topbar hideThemeToggle={shouldHideThemeToggle} />
      <div className="banner-section">
        <img src={bannerImage} alt={`${projectData.title} banner`} className="banner-image" />
      </div>

      <div className="project-container" ref={setScrollRoot}>
        <header className="project-header">
          <div className="project-header__fade-block project-fade-block" ref={fadeInRef}>
            <h1 className="project-title">{projectData.title}</h1>
            {projectData.subtitle && (
              <p className="project-subtitle">{projectData.subtitle}</p>
            )}
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
            <div
              className="project-awards-section project-header__fade-block project-fade-block"
              aria-label="Project awards"
              ref={fadeInRef}
            >
              <a
                href="https://www.youtube.com/watch?v=Fe4sXzLPVj0"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Watch DDP exhibition highlight"
                className="project-award-link"
              >
                <img
                  src={`${process.env.PUBLIC_URL}/projects/datopia/ddp.png`}
                  alt="Datopia featured at DDP"
                  className="project-award-badge"
                  loading="lazy"
                />
              </a>
            </div>
          </div>
        </header>

        <main className="project-content">
          <section className="project-section datopia-content">
            <div className="project-description" ref={fadeInRef}>
              <p className="description-text">
                Datopia is a data-based dating service. By analyzing data, it captures everything
                from the preferences you didn't know you had to your minor daily habits. Through this,
                it goes beyond simple encounters to find you a destined partner with whom you can
                maintain a continuous relationship.{' '}
                <span className="datopia-highlight">
                  But can love really be determined solely by data?
                </span>
              </p>
            </div>
            <div
              className="datopia-video-frame"
              role="region"
              aria-label="Datopia showcase video"
              ref={fadeInRef}
            >
              <iframe
                src="https://www.youtube.com/embed/2mOZOPmv0KI?rel=0"
                title="Datopia Exhibition Walkthrough"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <div className="datopia-divider" role="presentation" aria-hidden="true" />
            <section className="datopia-welcome project-fade-block" ref={fadeInRef}>
              <h2 className="datopia-welcome__title">
                Welcome to Datopia!
              </h2>
              <p className="datopia-welcome__body">
                In Datopia, you don't need to create a profile yourself, and you don't have to keep swiping every day to find someone who matches you. All you need to do is consent to data collection. Once you agree, Datopia immediately starts collecting your data and recommends a partner who suits you. There's no doubt that the person Datopia recommends is the right match for you. So you can focus solely on connecting with the person you're recommended!
              </p>
              <p className="datopia-welcome__body">
                And though it probably won't happen, if you don't like your recommended match, try our premium service.
              </p>
            </section>
            <MobileScreenRail
              screens={Array.from({ length: 10 }).map((_, index) => ({
                image: `${process.env.PUBLIC_URL}/projects/datopia/screen/${index + 1}.png`,
                alt: `Datopia mobile scenario ${index + 1}`
              }))}
              cardWidth="clamp(260px, 24vw, 360px)"
              gap={32}
              showMetadata={false}
              clampToContainer
            />
            <section className="datopia-reflection project-fade-block" ref={fadeInRef}>
              <h2 className="datopia-reflection__title">Rethinking Future Love</h2>
              <p className="datopia-reflection__body">
                Datopia is a critical design project that invites reflection on how data-driven services, now deeply embedded in everyday life, might transform the ways we form relationships. Today, a wide range of recommendation algorithms make decision-making easier. At times, they even infer our preferences, behaviors, and memories, including things we may not be fully aware of, and make decisions on our behalf.
              </p>
              <p className="datopia-reflection__body">
                But can love really be judged by data alone? How can we be sure that the person an algorithm recommends is truly our destined partner? Is it okay to hand over agency in love to an algorithm? Through Datopia, this exhibition imagines a new form of love that may exist in the future, offering visitors a chance to experience it and to reflect on these questions.
              </p>
            </section>
            <div className="datopia-media" ref={fadeInRef}>
              <div className="datopia-divider" role="presentation" aria-hidden="true" />
              <h2 className="datopia-media-title">Exhibition</h2>
              <div className="datopia-figures">
                {[
                  {
                    src: `${process.env.PUBLIC_URL}/projects/datopia/datopia_fig1.png`,
                    alt: 'Datopia interface detail'
                  },
                  {
                    src: `${process.env.PUBLIC_URL}/projects/datopia/datopia_fig2.png`,
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
              <div className="datopia-divider" role="presentation" aria-hidden="true" />
            </div>
          </section>
        </main>
      </div>

      <div className="datopia-animation" key={cycleId}>
        {Array.from({ length: batchSize }).map((_, index) => (
          <img
            key={`${cycleId}-${index}`}
            src={`${process.env.PUBLIC_URL}/projects/datopia/dato2.gif`}
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
  );
};
