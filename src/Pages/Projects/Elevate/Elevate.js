import { useState } from 'react';
import { Topbar } from '../../../Components/Topbar/topbar';
import { Footer } from '../../../Components/Footer/footer';
import { PROJECTS } from '../../../Data/projectsMeta';
import { useFadeInAnimation } from '../../../hooks/useFadeInAnimation';
import { useProjectPageFrame } from '../../../hooks/useProjectPageFrame';
import { BibtexCard } from '../../../Components/BibtexCard/BibtexCard';
import { ProjectLinks } from '../../../Components/ProjectLinks/ProjectLinks';
import './Elevate.css';

export const ElevateProject = () => {
  const projectData = PROJECTS.elevate;
  const [scrollRoot, setScrollRoot] = useState(null);
  const fadeInRef = useFadeInAnimation({ root: scrollRoot });
  const themeMode = projectData.themeMode ?? 'auto';
  const desktopBanner =
    projectData.bannerImage ?? `${process.env.PUBLIC_URL}/projects/elevate/thumbnail.png`;
  const mobileBanner = `${process.env.PUBLIC_URL}/projects/elevate/thumbnail_mobile.png`;
  const installationVideoUrl = 'https://www.youtube.com/embed/QvuVQ68uf-w?rel=0';
  const { pageClassName, shouldHideThemeToggle } = useProjectPageFrame(desktopBanner, themeMode);
  const resourceLinks = [
    {
      type: 'paper',
      href: 'https://doi.org/10.1145/3411764.3445454',
      icon: `${process.env.PUBLIC_URL}/icons/dl.png`,
      iconDark: `${process.env.PUBLIC_URL}/icons/dl.png`,
      iconAlt: 'ACM DL'
    }
  ];

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
            <div className="project-awards-section project-fade-block" aria-label="Project awards" ref={fadeInRef}>
              <img
                src={`${process.env.PUBLIC_URL}/projects/elevate/chi_logo.png`}
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
                <strong>Elevate</strong> enables users to experience not only large variations in shapes but also the details of the
                underlying terrain. This provides possible way to utilize through applications.
                <br />
                Current head-mounted displays enable users to explore virtual worlds by simply walking through them.
                This led researchers to create haptic displays that can also simulate different types of elevation
                shapes. However, existing shape-changing floors are limited by their tabletop scale or the coarse
                resolution of the terrains they can display due to the limited number of actuators and low vertical
                resolution.
              </p>
            </div>
          </section>

          <section className="project-section">
            <div className="elevate-video-frame" ref={fadeInRef}>
              <iframe
                src={installationVideoUrl}
                title="Elevate installation walkthrough"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <div className="elevate-divider" role="presentation" aria-hidden="true" />
          </section>

          <section className="project-section">
            <h2 className="section-title project-fade-block" ref={fadeInRef}>BibTeX</h2>
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
