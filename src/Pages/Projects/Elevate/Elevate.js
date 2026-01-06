import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Topbar } from '../../../Components/Topbar/topbar';
import { Footer } from '../../../Components/Footer/footer';
import { PROJECTS } from '../../../Data/projectsMeta';
import { useTheme } from '../../../contexts/ThemeContext';
import { useFadeInAnimation } from '../../../hooks/useFadeInAnimation';
import { useProjectPageFrame } from '../../../hooks/useProjectPageFrame';
import { BibtexCard } from '../../../Components/BibtexCard/BibtexCard';
import { ProjectLinks } from '../../../Components/ProjectLinks/ProjectLinks';
import { PageLoadGuard } from '../../../Components/PageLoader/PageLoadGuard';
import './Elevate.css';

const ELEVATE_DESKTOP_BANNER = `${process.env.PUBLIC_URL}/projects/elevate/thumbnail.png`;
const ELEVATE_MOBILE_BANNER = `${process.env.PUBLIC_URL}/projects/elevate/thumbnail_mobile.png`;
const ELEVATE_INSTALLATION_VIDEO_URL = 'https://www.youtube.com/embed/QvuVQ68uf-w?rel=0';
const ELEVATE_APPLICATION_IMAGES = [
  { name: 'app1', label: 'Landscape' },
  { name: 'app2', objectPosition: '100% center', label: 'Stairs' },
  { name: 'app3', objectPosition: '70% center', label: 'Stepping stones' },
  { name: 'app4', objectPosition: '30% center', label: 'Golf' }
].map((entry, index) => ({
  ...entry,
  src: `${process.env.PUBLIC_URL}/projects/elevate/${entry.name}.png`,
  alt: `Elevate application ${index + 1}`
}));
const ELEVATE_APPLICATION_DESCRIPTIONS = {
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
const ELEVATE_HARDWARE_IMAGES = [
  { name: 'hard1', label: 'Overview', objectPosition: '40% center' },
  { name: 'hard2', label: 'Pin-array', isNonBreaking: true },
  { name: 'hard3', label: 'Shape Generator' },
  { name: 'hard4', label: 'Locking System' }
].map((entry, index) => ({
  ...entry,
  src: `${process.env.PUBLIC_URL}/projects/elevate/${entry.name}.png`,
  alt: `Elevate hardware section ${index + 1}`
}));
const ELEVATE_HARDWARE_DETAILS = {
  hard1: {
    description: (
      <>
        <strong>Elevate</strong> is mounted on a box-framed structure made from aluminum profiles (120 cm wide × 248 cm
        deep × 73 cm high). The top of the box (at 73 cm) is the actuated platform, covered with a smooth 15T birch
        plywood sheet that houses the pins and prevents collisions. In the middle, a layered structure of a 6T acrylic
        sheet and a 14T iron plate is glued together. Together, these elements form a sturdy platform that supports the
        weight of an average user.
      </>
    ),
    detailImage: `${process.env.PUBLIC_URL}/projects/elevate/hard1-detail.png`,
    detailAlt: 'Detail view of the Elevate structural enclosure and layered platform.'
  },
  hard2: {
    description: (
      <>
        <strong>Pin-array</strong> contains 1,200 wooden pins paired with 14,400 magnets and 1,200 metal plates. Each
        pin is machined from birch plywood and rated for 150&nbsp;mm of vertical displacement so the surface can morph
        into varied terrains.
      </>
    ),
    detailImage: `${process.env.PUBLIC_URL}/projects/elevate/hard2-detail.png`,
    detailAlt: 'Close-up of Elevate pin-array construction.'
  },
  hard3: {
    description: (
      <>
        <strong>Shape Generator</strong> is the core of the system. It individually pushes or pulls each of the 1,200
        pins to render different terrains and features. To reduce the number of actuators required for independent
        height control, we designed a shape generator that moves row by row along a rail beneath the pin platform and
        simultaneously pushes or pulls all pins in the same row.
      </>
    ),
    detailImage: `${process.env.PUBLIC_URL}/projects/elevate/hard3-detail.png`,
    detailAlt: 'Shape generator module traveling under the Elevate platform.'
  },
  hard4: {
    description: (
      <>
        <strong>Locking System</strong> firmly secures the pins at a specific height to form the desired terrain shape
        and allow users to walk over it. To lock 1,200 pins with a minimal number of motors, we developed a modular
        locking mechanism composed of four aluminum pipes and two servo motors. By replicating 15 modules, it covers 60
        columns and all 1,200 pins.
      </>
    ),
    detailImage: `${process.env.PUBLIC_URL}/projects/elevate/hard4-detail.png`,
    detailAlt: 'Locking system module that stabilizes Elevate pins.'
  }
};
const ELEVATE_RESOURCE_LINKS = [
  {
    type: 'paper',
    href: 'https://doi.org/10.1145/3411764.3445454',
    icon: `${process.env.PUBLIC_URL}/icons/dl.png`,
    iconDark: `${process.env.PUBLIC_URL}/icons/dl.png`,
    iconAlt: 'ACM DL'
  }
];
const ELEVATE_PAGE_ASSETS = Array.from(
  new Set(
    [
      ELEVATE_DESKTOP_BANNER,
      ELEVATE_MOBILE_BANNER,
      `${process.env.PUBLIC_URL}/projects/elevate/chi_logo.png`,
      `${process.env.PUBLIC_URL}/projects/elevate/chi_logo_dark.png`,
      `${process.env.PUBLIC_URL}/icons/dl.png`,
      ...ELEVATE_APPLICATION_IMAGES.map(({ src }) => src),
      ...ELEVATE_HARDWARE_IMAGES.map(({ src }) => src),
      ...Object.values(ELEVATE_HARDWARE_DETAILS)
        .map((detail) => detail.detailImage)
        .filter(Boolean)
    ].filter(Boolean)
  )
);

export const ElevateProject = () => {
  const projectData = PROJECTS.elevate;
  const [scrollRoot, setScrollRoot] = useState(null);
  const [activeApplication, setActiveApplication] = useState(null);
  const [activeHardware, setActiveHardware] = useState(null);
  const [gridStyle, setGridStyle] = useState(null);
  const [hardwareGridStyle, setHardwareGridStyle] = useState(null);
  const fadeInRef = useFadeInAnimation({ root: scrollRoot });
  const themeMode = projectData.themeMode ?? 'auto';
  const desktopBanner = projectData.bannerImage ?? ELEVATE_DESKTOP_BANNER;
  const mobileBanner = ELEVATE_MOBILE_BANNER;
  const installationVideoUrl = ELEVATE_INSTALLATION_VIDEO_URL;
  const { pageClassName, shouldHideThemeToggle } = useProjectPageFrame(desktopBanner, themeMode);
  const { isDark } = useTheme();
  const awardBadgeSrc = isDark
    ? `${process.env.PUBLIC_URL}/projects/elevate/chi_logo_dark.png`
    : `${process.env.PUBLIC_URL}/projects/elevate/chi_logo.png`;
  const applicationImages = ELEVATE_APPLICATION_IMAGES;
  const applicationDescriptions = ELEVATE_APPLICATION_DESCRIPTIONS;
  const applicationRows = useMemo(() => {
    return applicationImages.reduce((rows, item, index) => {
      if (index % 2 === 0) {
        rows.push([item]);
      } else {
        rows[rows.length - 1].push(item);
      }
      return rows;
    }, []);
  }, [applicationImages]);
  const activeDescription = activeApplication ? applicationDescriptions[activeApplication] : null;
  const hardwareImages = ELEVATE_HARDWARE_IMAGES;
  const hardwareDetails = ELEVATE_HARDWARE_DETAILS;
  const hardwareRows = useMemo(() => {
    return hardwareImages.reduce((rows, item, index) => {
      if (index % 2 === 0) {
        rows.push([item]);
      } else {
        rows[rows.length - 1].push(item);
      }
      return rows;
    }, []);
  }, [hardwareImages]);
  const activeHardwareDetail = activeHardware ? hardwareDetails[activeHardware] : null;
  const resourceLinks = ELEVATE_RESOURCE_LINKS;
  const pageAssets = useMemo(() => {
    const assets = new Set(ELEVATE_PAGE_ASSETS);
    if (desktopBanner) {
      assets.add(desktopBanner);
    }
    if (mobileBanner) {
      assets.add(mobileBanner);
    }
    return Array.from(assets);
  }, [desktopBanner, mobileBanner]);

  const applicationsGridRef = useRef(null);
  const hardwareGridRef = useRef(null);
  const handleApplicationsGridRef = useCallback(
    (node) => {
      applicationsGridRef.current = node;
      fadeInRef(node);
    },
    [fadeInRef]
  );
  const handleHardwareGridRef = useCallback(
    (node) => {
      hardwareGridRef.current = node;
      fadeInRef(node);
    },
    [fadeInRef]
  );
  const renderActiveHardwareDetail = () => {
    if (!activeHardwareDetail) return null;
    return (
      <>
        <p className="section-text section-text--small elevate-hardware-detail__copy">
          {activeHardwareDetail.description}
        </p>
        {activeHardwareDetail.detailImage && (
          <img
            src={activeHardwareDetail.detailImage}
            alt={activeHardwareDetail.detailAlt}
            className="elevate-hardware-detail__image"
            loading="lazy"
          />
        )}
      </>
    );
  };

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const calculateTileSize = (gridElement, setter) => {
      if (!gridElement) {
        setter(null);
        return;
      }
      const prefersDesktop = window.matchMedia('(min-width: 769px)').matches;
      if (!prefersDesktop) {
        setter(null);
        return;
      }
      const styles = window.getComputedStyle(gridElement);
      const gapValue = parseFloat(styles.columnGap || styles.gap || '0') || 0;
      const availableWidth = gridElement.clientWidth - gapValue * 3;
      if (availableWidth <= 0) {
        setter(null);
        return;
      }
      setter({ '--tile-base-size': `${availableWidth / 4}px` });
    };

    const recalcAll = () => {
      calculateTileSize(applicationsGridRef.current, setGridStyle);
      calculateTileSize(hardwareGridRef.current, setHardwareGridStyle);
    };

    recalcAll();

    const observers = [];
    if (typeof ResizeObserver !== 'undefined') {
      const setupObserver = (ref, setter) => {
        const node = ref.current;
        if (!node) return;
        const observer = new ResizeObserver(() => calculateTileSize(ref.current, setter));
        observer.observe(node);
        observers.push(observer);
      };
      setupObserver(applicationsGridRef, setGridStyle);
      setupObserver(hardwareGridRef, setHardwareGridStyle);
    }

    window.addEventListener('resize', recalcAll);

    return () => {
      observers.forEach((observer) => observer.disconnect());
      window.removeEventListener('resize', recalcAll);
    };
  }, []);

  const loaderMessage = `Loading ${projectData.title}...`;

  return (
    <PageLoadGuard assets={pageAssets} message={loaderMessage}>
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

        <div
          className="project-divider project-divider--header project-fade-block"
          role="presentation"
          aria-hidden="true"
          ref={fadeInRef}
        />

        <main className="project-content">
          <section className="project-section elevate-overview">
            <div className="elevate-overview__copy project-fade-block" ref={fadeInRef}>
              <p className="section-text elevate-body">
                Head-mounted displays let users explore virtual worlds by simply walking through them, which has led researchers to create haptic displays that simulate different elevation shapes. However, existing shape-changing floors are limited to tabletop scale or can only display coarse terrains due to a limited number of actuators and low vertical resolution. To address this, we introduce Elevate, a dynamic and walkable pin-array floor that supports both large shape variations and fine-grained terrain details.
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
            <div
              className="project-divider project-fade-block"
              role="presentation"
              aria-hidden="true"
              ref={fadeInRef}
            />
          </section>

          <section className="project-section elevate-applications elevate-hardware">
            <h2 className="section-title project-fade-block" ref={fadeInRef}>
              System Implementation
            </h2>
            <p className="section-text project-fade-block" ref={fadeInRef}>
              <strong>Elevate</strong> enables users to experience large variations in shapes as well as the finer details of terrains. It is made of three components: 1200 pins, a shape generator, and a locking system.
            </p>
            <div className="project-fade-block" ref={fadeInRef}>
              <div
                className={`elevate-applications-grid${activeHardware ? ' has-active' : ''}`}
                ref={handleHardwareGridRef}
                style={hardwareGridStyle ?? undefined}
              >
                {hardwareRows.map((row, rowIndex) => {
                  const rowHasActive = row.some((image) => image.name === activeHardware);
                  return (
                    <div key={`hardware-row-${rowIndex}`} className="elevate-applications-row-group">
                      <div className={`elevate-applications-row${rowHasActive ? ' has-active' : ''}`}>
                        {row.map((image) => {
                          const isActive = activeHardware === image.name;
                          return (
                            <button
                              type="button"
                              className={`elevate-applications-grid__item${isActive ? ' is-active' : ''}`}
                              key={image.src}
                              onClick={() =>
                                setActiveHardware((current) => (current === image.name ? null : image.name))
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
                                <span
                                  className="elevate-applications-grid__label"
                                  style={image.isNonBreaking ? { whiteSpace: 'nowrap' } : undefined}
                                >
                                  {image.label}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                      {rowHasActive && activeHardwareDetail && (
                        <div
                          key={`hardware-row-description-${activeHardware ?? 'none'}`}
                          className="elevate-hardware-detail elevate-applications-row-description project-fade-block"
                          aria-live="polite"
                          ref={fadeInRef}
                        >
                          {renderActiveHardwareDetail()}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            {activeHardwareDetail && (
              <div
                key={`hardware-description-${activeHardware ?? 'none'}`}
                className="elevate-hardware-detail elevate-application-description project-fade-block"
                aria-live="polite"
                ref={fadeInRef}
              >
                {renderActiveHardwareDetail()}
              </div>
            )}
          </section>

          <section className="project-section elevate-applications">
            <h2 className="section-title project-fade-block" ref={fadeInRef}>
              Applications
            </h2>
            <p className="section-text project-fade-block" ref={fadeInRef}>
              To showcase a wide range of uses of our device, we implemented four distinct applications: three
              virtual reality applications, and one stand-alone application that makes use of dynamic terrains.
            </p>
            <div className="project-fade-block" ref={fadeInRef}>
              <div
                className={`elevate-applications-grid${activeApplication ? ' has-active' : ''}`}
                ref={handleApplicationsGridRef}
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
                        key={`row-description-${activeApplication ?? 'none'}`}
                        className="section-text elevate-applications-row-description project-fade-block"
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
            </div>
            {activeDescription && (
              <p
                key={`active-description-${activeApplication ?? 'none'}`}
                className="section-text elevate-application-description project-fade-block"
                aria-live="polite"
                ref={fadeInRef}
              >
                {activeDescription}
              </p>
            )}
          </section>

          <div
            className="project-divider project-divider--spacer project-fade-block"
            role="presentation"
            aria-hidden="true"
            ref={fadeInRef}
          />

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
    </PageLoadGuard>
  );
};
