import { useState } from 'react';
import { Topbar } from '../../../Components/Topbar/topbar';
import { Footer } from '../../../Components/Footer/footer';
import { PROJECTS } from '../../../Data/projectsMeta';
import { useFadeInAnimation } from '../../../hooks/useFadeInAnimation';
import { useProjectPageFrame } from '../../../hooks/useProjectPageFrame';
import { BibtexCard } from '../../../Components/BibtexCard/BibtexCard';
import { ProjectLinks } from '../../../Components/ProjectLinks/ProjectLinks';
import { PageLoadGuard } from '../../../Components/PageLoader/PageLoadGuard';
import { CrafteamUI } from './CrafteamUI';
import { CrafteamTeamStructure } from './CrafteamTeamStructure';
import { useTheme } from '../../../contexts/ThemeContext';
import './Crafteam.css';

const CRAFTEAM_ASSETS = Array.from(
  new Set([
    PROJECTS.crafteam?.bannerImage ?? null,
    `${process.env.PUBLIC_URL}/projects/crafteam/chi_logo.png`,
    `${process.env.PUBLIC_URL}/projects/crafteam/overview.png`,
    `${process.env.PUBLIC_URL}/projects/crafteam/overview_dark.png`
  ].filter(Boolean))
);

export const CrafteamProject = () => {
  const projectData = PROJECTS.crafteam;
  const [scrollRoot, setScrollRoot] = useState(null);
  const fadeInRef = useFadeInAnimation({ root: scrollRoot });
  const themeMode = projectData.themeMode ?? 'auto';
  const bannerImage = projectData.bannerImage ?? null;
  const { pageClassName, shouldHideThemeToggle } = useProjectPageFrame(bannerImage, themeMode);
  const { isDark } = useTheme();
  const overviewImageSrc = isDark
    ? `${process.env.PUBLIC_URL}/projects/crafteam/overview_dark.png`
    : `${process.env.PUBLIC_URL}/projects/crafteam/overview.png`;
  const resourceLinks = [
    {
      type: 'paper',
      href: projectData.paperLink ?? 'https://dl.acm.org/doi/full/10.1145/3772318.3791166',
      icon: `${process.env.PUBLIC_URL}/icons/dl.png`,
      iconDark: `${process.env.PUBLIC_URL}/icons/dl.png`,
      iconAlt: 'ACM DL'
    }
  ];

  const loaderMessage = `Loading ${projectData.title}...`;

  return (
    <PageLoadGuard assets={CRAFTEAM_ASSETS} message={loaderMessage}>
      <div className={`${pageClassName} project-page--crafteam`}>
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
            <div className="project-awards-section project-header__fade-block project-fade-block" ref={fadeInRef}>
              <img
                src={`${process.env.PUBLIC_URL}/projects/crafteam/chi_logo.png`}
                alt="CHI 2026 Logo"
                className="project-award-badge"
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
          <section className="project-section project-section__fade crafteam-overview">
            <p className="section-text crafteam-body project-fade-block" ref={fadeInRef}>
              Team-based collaboration is a cornerstone of modern creative work. Recent advances in generative AI open possibilities for humans to collaborate with multiple AI agents in distinct roles to address complex creative workflows. Yet, how to form Human–Multi-Agent Teams (HMATs) is underexplored, especially given that inter-agent interactions increase complexity and the risk of unexpected behaviors. In this exploratory study, we aim to understand how to form HMATs for creative work using CrafTeam, a technology probe that allows users to form and collaborate with their teams.
            </p>
          </section>

          <section className="project-section project-section__fade crafteam-overview-media">
            <h2 className="section-title project-fade-block" ref={fadeInRef}>
              CrafTeam Overview
            </h2>
            <div className="crafteam-overview-image-wrapper project-fade-block" ref={fadeInRef}>
              <img
                src={overviewImageSrc}
                alt="Overview of the CrafTeam system"
                className="crafteam-overview-image"
                loading="lazy"
              />
            </div>
            <p className="section-text section-text--small crafteam-overview-caption project-fade-block" ref={fadeInRef}>
              CrafTeam is a web application that enables users to form their own HMATs and engage in
              team-based ideation sessions. To make this process accessible even to non-developers,
              CrafTeam lets users configure only the core dimensions of team formation, while the system
              automatically constructs complete HMATs based on the users&rsquo; settings. In particular, users
              can directly configure five dimensions of team formation&mdash;team size, structure, role
              allocation, member composition, and shared mental models. We implemented three key steps as
              iterative cycles: (i) forming their own HMATs, (ii) ideating with their teams, (iii) reflecting
              on the ideation session, and then reforming their team based on insights gained from the
              reflection.
            </p>
          </section>

          <section className="project-section project-section__fade crafteam-team-ui-section">
            <h2 className="section-title project-fade-block" ref={fadeInRef}>
              Team Formation UI
            </h2>
            <CrafteamUI fadeRef={fadeInRef} />
          </section>

          <div
            className="project-divider project-fade-block"
            role="presentation"
            aria-hidden="true"
            ref={fadeInRef}
          />

          <section className="project-section project-section__fade crafteam-findings">
            <h2 className="section-title project-fade-block" ref={fadeInRef}>
              Team Formation in the User Study
            </h2>
            <CrafteamTeamStructure fadeRef={fadeInRef} />
          </section>

          <div
            className="project-divider project-fade-block"
            role="presentation"
            aria-hidden="true"
            ref={fadeInRef}
          />

          <section className="project-section project-section__fade">
            <h2 className="section-title project-fade-block" ref={fadeInRef}>BibTeX</h2>
            <BibtexCard
              ref={fadeInRef}
              className="project-fade-block"
              text={`@inproceedings{10.1145/3772318.3791166,
author = {Lim, Hyunseung and Choi, Dasom and Nam, Sooyohn and Kim, Bogoan and Hong, Hwajung},
title = {Understanding Human–Multi-Agent Team Formation for Creative Work},
year = {2026},
isbn = {9798400722783},
publisher = {Association for Computing Machinery},
address = {New York, NY, USA},
url = {https://doi.org/10.1145/3772318.3791166},
doi = {10.1145/3772318.3791166},
abstract = {Team-based collaboration is a cornerstone of modern creative work. Recent advances in generative AI open possibilities for humans to collaborate with multiple AI agents in distinct roles to address complex creative workflows. Yet, how to form Human–Multi-Agent Teams (HMATs) is underexplored, especially given that inter-agent interactions increase complexity and the risk of unexpected behaviors. In this exploratory study, we aim to understand how to form HMATs for creative work using CrafTeam, a technology probe that allows users to form and collaborate with their teams. We conducted a study with 12 design practitioners, in which participants iterated through a three-step cycle: forming HMATs, ideating with their teams, and reflecting on their teams’ ideation. Our findings reveal that while participants initially attempted autonomous team operations, they ultimately adopted team formations in which they directly orchestrated agents. We discuss design considerations for HMAT formation that humans can effectively orchestrate multiple agents.},
booktitle = {Proceedings of the 2026 CHI Conference on Human Factors in Computing Systems},
articleno = {70},
numpages = {21},
keywords = {Human–Multi-Agent Team, Human-AI Team, Multi-Agent, Team Formation},
location = {
},
series = {CHI '26}
}`}
            />
          </section>
        </main>
        </div>

        <Footer />
      </div>
    </PageLoadGuard>
  );
};
