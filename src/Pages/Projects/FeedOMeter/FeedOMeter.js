import { useState } from 'react';
import { Topbar } from '../../../Components/Topbar/topbar';
import { Footer } from '../../../Components/Footer/footer';
import { PROJECTS } from '../../../Data/projectsMeta';
import { useFadeInAnimation } from '../../../hooks/useFadeInAnimation';
import { useProjectPageFrame } from '../../../hooks/useProjectPageFrame';
import { BibtexCard } from '../../../Components/BibtexCard/BibtexCard';
import { ProjectLinks } from '../../../Components/ProjectLinks/ProjectLinks';
import './FeedOMeter.css';
import { FeedOMeterUI, FEED_O_METER_UI_ASSET_PATHS } from './FeedOMeterUI';
import { useTheme } from '../../../contexts/ThemeContext';
import { PageLoadGuard } from '../../../Components/PageLoader/PageLoadGuard';

export const FeedOMeterProject = () => {
  const projectData = PROJECTS['feed-o-meter'];
  const [scrollRoot, setScrollRoot] = useState(null);
  const fadeInRef = useFadeInAnimation({ root: scrollRoot });
  const themeMode = projectData.themeMode ?? 'auto';
  const bannerImage = projectData.bannerImage ?? null;
  const { pageClassName, shouldHideThemeToggle } = useProjectPageFrame(bannerImage, themeMode);
  const resourceLinks = [
    {
      type: 'paper',
      href: 'https://doi.org/10.1016/j.ijhcs.2025.103687',
      icon: `${process.env.PUBLIC_URL}/icons/elsevier.png`,
      iconDark: `${process.env.PUBLIC_URL}/icons/elsevier_dark.png`,
      iconAlt: 'Elsevier'
    },
    { type: 'github', href: 'https://github.com/Hyunseung-Lim/Feed-O-Meter' }
  ];

  const { isDark } = useTheme();
  const baselinePipelineImage = `${process.env.PUBLIC_URL}/projects/feed-o-meter/${isDark ? 'baseline_pipeline_dark.png' : 'baseline_pipeline.png'}`;
  const interventionPipelineImage = `${process.env.PUBLIC_URL}/projects/feed-o-meter/${isDark ? 'intervention_pipeline_dark.png' : 'intervention_pipeline.png'}`;
  const pageAssets = Array.from(
    new Set(
      [
        bannerImage,
        `${process.env.PUBLIC_URL}/icons/elsevier.png`,
        `${process.env.PUBLIC_URL}/icons/elsevier_dark.png`,
        `${process.env.PUBLIC_URL}/projects/feed-o-meter/baseline_pipeline.png`,
        `${process.env.PUBLIC_URL}/projects/feed-o-meter/baseline_pipeline_dark.png`,
        `${process.env.PUBLIC_URL}/projects/feed-o-meter/intervention_pipeline.png`,
        `${process.env.PUBLIC_URL}/projects/feed-o-meter/intervention_pipeline_dark.png`,
        ...FEED_O_METER_UI_ASSET_PATHS
      ].filter(Boolean)
    )
  );

  const loaderMessage = `Loading ${projectData.title}...`;

  return (
    <PageLoadGuard assets={pageAssets} message={loaderMessage}>
      <div className={`${pageClassName} project-page--feed-o-meter`}>
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
          <section className="project-section project-section__fade" ref={fadeInRef}>
            <p className="section-text feedometer-body project-fade-block" ref={fadeInRef}>
              Effective feedback helps designers develop concepts and refine ideas, supporting informed decision-making throughout the iterative design process. However, in studio-based design courses, students often hesitate to give feedback due to low confidence and fear of judgment, which hinders the development of feedback-giving skills. To address this gap, we proposed Feed-O-Meter, an LLM-powered system that creates a safe space for students to practice design feedback. It lets users role-play as mentors giving feedback to an AI mentee and reflect on how their feedback shapes the mentee's idea development.
            </p>
          </section>
          <section className="project-section project-section__fade feedometer-ui-section" ref={fadeInRef}>
            <h2 className="section-title project-fade-block" ref={fadeInRef}>
              Feed-O-Meter UI
            </h2>
            <FeedOMeterUI fadeRef={fadeInRef} />
          </section>
          <section className="project-section project-section__fade feedometer-dr1-section">
            <h2 className="section-title project-fade-block" ref={fadeInRef}>
              DR1: simulate a novice design student
            </h2>
            <p className="section-text section-text--small feedometer-dr1-description project-fade-block" ref={fadeInRef}>
              Our goal was to let users practice providing feedback in scenarios that closely mirror real-life
              situations while fostering active engagement, rather than the hesitation often seen in traditional
              environments. To achieve this, we assigned users the role of a mentor and designed scenarios in which they
              provided feedback on an AI mentee’s design idea.
            </p>
            <div className="feedometer-dr1-figure project-fade-block" ref={fadeInRef}>
              <img
                src={baselinePipelineImage}
                alt="Baseline pipeline illustrating how Feed-O-Meter simulates a novice design student"
                loading="lazy"
              />
            </div>
          </section>
          <section className="project-section project-section__fade feedometer-dr2-section">
            <h2 className="section-title project-fade-block" ref={fadeInRef}>
              DR2: promote critical reflections on feedback and its effects
            </h2>
            <p
              className="section-text section-text--small feedometer-dr2-description project-fade-block"
              ref={fadeInRef}
            >
              Our system aims not only to provide an environment for practicing feedback but also to help users improve
              their feedback skills. Instead of prescribing a fixed rubric, we emphasized user autonomy by allowing users
              observe how their feedback shapes mentee’s ideation process. We designed three components to provide
              indirect guidance and encourage users to reflect on the impact of their feedback and refine their
              strategies.
            </p>
            <div className="feedometer-dr2-figure project-fade-block" ref={fadeInRef}>
              <img
                src={interventionPipelineImage}
                alt="Intervention pipeline illustrating how Feed-O-Meter promotes critical reflections on feedback and its effects"
                loading="lazy"
              />
            </div>
          </section>
          <section className="project-section project-section__fade" ref={fadeInRef}>
            <h2 className="section-title project-fade-block" ref={fadeInRef}>
              Feed-O-Meter Demo
            </h2>
            <div className="feedometer-dr2-figure project-fade-block" ref={fadeInRef}>
              <iframe
                src="https://www.youtube.com/embed/EsqDqSN2LCI?rel=0"
                title="Feed-O-Meter demo video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </section>
          <div
            className="project-divider project-fade-block"
            role="presentation"
            aria-hidden="true"
            ref={fadeInRef}
          />

          <section className="project-section project-section__fade" ref={fadeInRef}>
            <h2 className="section-title project-fade-block" ref={fadeInRef}>BibTeX</h2>
            <BibtexCard
              ref={fadeInRef}
              text={`@article{LIM2026103687,
title = {Feed-O-Meter: Investigating AI-generated mentee personas as interactive agents for scaffolding design feedback practice},
journal = {International Journal of Human-Computer Studies},
volume = {208},
pages = {103687},
year = {2026},
issn = {1071-5819},
doi = {https://doi.org/10.1016/j.ijhcs.2025.103687},
url = {https://www.sciencedirect.com/science/article/pii/S1071581925002447},
author = {Hyunseung Lim and Dasom Choi and DaEun Choi and Sooyohn Nam and Hwajung Hong},
keywords = {Design education, Design feedback, Human-computer interaction, Large language model, AI-generated agent},
abstract = {Effective feedback, including critique and evaluation, helps designers develop design concepts and refine their ideas, supporting informed decision-making throughout the iterative design process. However, in studio-based design courses, students often struggle to provide feedback due to a lack of confidence and fear of being judged, which limits their ability to develop essential feedback-giving skills. Recent advances in large language models (LLMs) suggest that role-playing with AI agents can allow learners to engage in multi-turn feedback without the anxiety of external judgment or the time constraints of real-world settings. Yet prior studies have raised concerns that LLMs struggle to behave like real people in role-play scenarios, diminishing the educational benefits of these interactions. Therefore, designing AI-based agents that effectively support learners in practicing and developing intellectual reasoning skills requires more than merely assigning the target persona's personality and role to the agent. By addressing these issues, we present Feed-O-Meter, a novel system that employs carefully designed LLM-based agents to create an environment in which students can practice giving design feedback. The system enables users to role-play as mentors, providing feedback to an AI mentee and allowing them to reflect on how that feedback impacts the AI mentee's idea development process. A user study (N=24) indicated that Feed-O-Meter increased participants' engagement and motivation through role-switching and helped them adjust feedback to be more comprehensible for an AI mentee. Based on these findings, we discuss future directions for designing systems to foster feedback skills in design education.}
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
