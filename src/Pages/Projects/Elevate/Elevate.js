import { useEffect, useRef, useState } from 'react';
import { Topbar } from '../../../Components/Topbar/topbar';
import { Footer } from '../../../Components/Footer/footer';
import { PROJECTS } from '../../../Data/projectsMeta';
import { useTheme } from '../../../contexts/ThemeContext';
import { useFadeInAnimation } from '../../../hooks/useFadeInAnimation';
import { useProjectPageFrame } from '../../../hooks/useProjectPageFrame';
import { BibtexCard } from '../../../Components/BibtexCard/BibtexCard';
import { ProjectLinks } from '../../../Components/ProjectLinks/ProjectLinks';
import './Elevate.css';

export const ElevateProject = () => {
  const projectData = PROJECTS.elevate;
  const [scrollRoot, setScrollRoot] = useState(null);
  const [activeApplication, setActiveApplication] = useState(null);
  const [gridStyle, setGridStyle] = useState(null);
  const fadeInRef = useFadeInAnimation({ root: scrollRoot });
  const themeMode = projectData.themeMode ?? 'auto';
  const desktopBanner =
    projectData.bannerImage ?? `${process.env.PUBLIC_URL}/projects/elevate/thumbnail.png`;
  const mobileBanner = `${process.env.PUBLIC_URL}/projects/elevate/thumbnail_mobile.png`;
  const installationVideoUrl = 'https://www.youtube.com/embed/QvuVQ68uf-w?rel=0';
  const { pageClassName, shouldHideThemeToggle } = useProjectPageFrame(desktopBanner, themeMode);
  const { isDark } = useTheme();
  const awardBadgeSrc = isDark
    ? `${process.env.PUBLIC_URL}/projects/elevate/chi_logo_dark.png`
    : `${process.env.PUBLIC_URL}/projects/elevate/chi_logo.png`;
  const applicationImages = [
    { name: 'app1', label: 'Landscape' },
    { name: 'app2', objectPosition: '100% center', label: 'Stairs' },
    { name: 'app3', objectPosition: '70% center', label: 'Stepping stones' },
    { name: 'app4', objectPosition: '30% center', label: 'Golf' }
  ].map((entry, index) => ({
    ...entry,
    src: `${process.env.PUBLIC_URL}/projects/elevate/${entry.name}.png`,
    alt: `Elevate application ${index + 1}`
  }));
  const applicationDescriptions = {
    app1: (
      <>
        <strong>Landscape</strong> application renders a terrain that is mapped to the background of the VR space,
        allowing users to immerse themselves in a variety of landscapes.
      </>
    ),
    app2: (
      <>
        <strong>Stairs</strong> application allows users to build a variety of staircases in a VR environment by adjusting
        parameters and choosing from different stair configurations.
      </>
    ),
    app3: (
      <>
        <strong>Stepping Stone</strong> application creates an interactive experience with a dynamic terrain that
        reconfigures over time. Users interact by grabbing and throwing stones off a cliff.
      </>
    ),
    app4: (
      <>
        Beyond VR, <strong>Golf</strong> application demonstrates a real-world mini-golf experience, where the floor
        creates a dynamic terrain for a physical golf ball to roll on.
      </>
    )
  };
  const applicationRows = applicationImages.reduce((rows, item, index) => {
    if (index % 2 === 0) {
      rows.push([item]);
    } else {
      rows[rows.length - 1].push(item);
    }
    return rows;
  }, []);
  const activeDescription = activeApplication ? applicationDescriptions[activeApplication] : null;
  const resourceLinks = [
    {
      type: 'paper',
      href: 'https://doi.org/10.1145/3411764.3445454',
      icon: `${process.env.PUBLIC_URL}/icons/dl.png`,
      iconDark: `${process.env.PUBLIC_URL}/icons/dl.png`,
      iconAlt: 'ACM DL'
    }
  ];

  const applicationsGridRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const calculateTileSize = () => {
      const gridElement = applicationsGridRef.current;
      if (!gridElement) {
        return;
      }
      const prefersDesktop = window.matchMedia('(min-width: 769px)').matches;
      if (!prefersDesktop) {
        setGridStyle(null);
        return;
      }
      const styles = window.getComputedStyle(gridElement);
      const gapValue = parseFloat(styles.columnGap || styles.gap || '0') || 0;
      const availableWidth = gridElement.clientWidth - gapValue * 3;
      if (availableWidth <= 0) {
        setGridStyle(null);
        return;
      }
      setGridStyle({ '--tile-base-size': `${availableWidth / 4}px` });
    };

    calculateTileSize();

    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => calculateTileSize())
        : null;
    if (resizeObserver) {
      const gridElement = applicationsGridRef.current;
      if (gridElement) {
        resizeObserver.observe(gridElement);
      }
    }
    window.addEventListener('resize', calculateTileSize);

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener('resize', calculateTileSize);
    };
  }, []);

  return (
    <div className={`${pageClassName} project-page--elevate`}>
      <Topbar hideThemeToggle={shouldHideThemeToggle} />
      {desktopBanner && (
        <div className="banner-section elevate-banner">
          <picture>
            <source media="(max-width: 640px)" srcSet={mobileBanner} />
            <img
              src={desktopBanner}
              alt={`${projectData.title} banner`}
              className="banner-image elevate-banner-image"
            />
          </picture>
        </div>
      )}

      <div className="project-container" ref={setScrollRoot}>
        <header className="project-header">
          <h1 className="project-title project-fade-block" ref={fadeInRef}>
            {projectData.title}
          </h1>
          {projectData.subtitle && (
            <p className="project-subtitle project-fade-block" ref={fadeInRef}>
              {projectData.subtitle}
            </p>
          )}
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
            <div className="project-awards-section project-fade-block" aria-label="Project awards" ref={fadeInRef}>
              <img
                src={awardBadgeSrc}
                alt="CHI 2021"
                className="project-award-badge elevate-award"
                loading="lazy"
              />
            </div>
          </div>
          <ProjectLinks links={resourceLinks} className="project-fade-block" fadeRef={fadeInRef} />
        </header>

        <main className="project-content">
          <section className="project-section elevate-overview">
            <div className="elevate-overview__copy project-fade-block" ref={fadeInRef}>
              <p className="section-text elevate-body">
                <strong>Elevate</strong> enables users to experience large variations in shapes as well as the finer
                details of terrains. Current head-mounted displays let people freely explore virtual worlds, which drove
                researchers to build haptic floors that render elevation changes. However, many previous systems were
                limited either by tabletop scale or by low resolution. Elevate tackles this by tightly packing 1,200
                actuated pins into a walkable platform, each pin capable of ten height levels.
              </p>
            </div>
          </section>

          <section className="project-section">
            <div className="elevate-video-frame project-fade-block" ref={fadeInRef}>
              <iframe
                src={installationVideoUrl}
                title="Elevate installation walkthrough"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <div className="elevate-divider" role="presentation" aria-hidden="true" />
          </section>

          <section className="project-section elevate-applications">
            <h2 className="section-title project-fade-block" ref={fadeInRef}>
              Applications
            </h2>
            <div
              className={`elevate-applications-grid${activeApplication ? ' has-active' : ''}`}
              ref={applicationsGridRef}
              style={gridStyle ?? undefined}
            >
              {applicationRows.map((row, rowIndex) => {
                const rowHasActive = row.some((image) => image.name === activeApplication);
                return (
                  <div key={`row-${rowIndex}`} className="elevate-applications-row-group">
                    <div
                      className={`elevate-applications-row${rowHasActive ? ' has-active' : ''}`}
                    >
                      {row.map((image) => {
                        const isActive = activeApplication === image.name;
                        return (
                          <button
                            type="button"
                            className={`elevate-applications-grid__item${
                              isActive ? ' is-active' : ''
                            }`}
                            key={image.src}
                            onClick={() =>
                              setActiveApplication((current) => (current === image.name ? null : image.name))
                            }
                            data-item={image.name}
                          >
                            <img
                              src={image.src}
                              alt={image.alt}
                              loading="lazy"
                              style={image.objectPosition ? { objectPosition: image.objectPosition } : undefined}
                            />
                            {image.label && (
                              <span className="elevate-applications-grid__label">{image.label}</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {rowHasActive && (
                      <p
                        className="elevate-applications-row-description project-fade-block"
                        aria-live="polite"
                        ref={fadeInRef}
                      >
                        {activeDescription}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
            {activeDescription && (
              <p
                className="elevate-application-description project-fade-block"
                aria-live="polite"
                ref={fadeInRef}
              >
                {activeDescription}
              </p>
            )}
          </section>

          <section className="project-section">
            <h2 className="section-title project-fade-block" ref={fadeInRef}>
              BibTeX
            </h2>
            <BibtexCard
              ref={fadeInRef}
              text={`@inproceedings{10.1145/3411764.3445454,
author = {Je, Seungwoo and Lim, Hyunseung and Moon, Kongpyung and Teng, Shan-Yuan and Brooks, Jas and Lopes, Pedro and Bianchi, Andrea},
title = {Elevate: A Walkable Pin-Array for Large Shape-Changing Terrains},
year = {2021},
isbn = {9781450380966},
publisher = {Association for Computing Machinery},
address = {New York, NY, USA},
url = {https://doi.org/10.1145/3411764.3445454},
doi = {10.1145/3411764.3445454},
abstract = {Current head-mounted displays enable users to explore virtual worlds by simply walking through them (i.e., real-walking VR). This led researchers to create haptic displays that can also simulate different types of elevation shapes. However, existing shape-changing floors are limited by their tabletop scale or the coarse resolution of the terrains they can display due to the limited number of actuators and low vertical resolution. To tackle this challenge, we introduce Elevate, a dynamic and walkable pin-array floor on which users can experience not only large variations in shapes but also the details of the underlying terrain. Our system achieves this by packing 1200 pins arranged on a 1.80 \\texttimes{} 0.60m platform, in which each pin can be actuated to one of ten height levels (resolution: 15mm/level). To demonstrate its applicability, we present our haptic floor combined with four walkable applications and a user study that reported increased realism and enjoyment.},
booktitle = {Proceedings of the 2021 CHI Conference on Human Factors in Computing Systems},
articleno = {127},
numpages = {11},
keywords = {Haptic Floor, Shape Changing Display, VR},
location = {Yokohama, Japan},
series = {CHI '21}
}`}
              className="project-fade-block"
            />
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
};
