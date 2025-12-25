import { useState } from 'react';
import { Topbar } from '../../../Components/Topbar/topbar';
import { Footer } from '../../../Components/Footer/footer';
import { PROJECTS } from '../../../Data/projectsMeta';
import { useFadeInAnimation } from '../../../hooks/useFadeInAnimation';
import { useProjectPageFrame } from '../../../hooks/useProjectPageFrame';
import { useTheme } from '../../../contexts/ThemeContext';
import { BibtexCard } from '../../../Components/BibtexCard/BibtexCard';
import { ProjectLinks } from '../../../Components/ProjectLinks/ProjectLinks';
import './Aqua.css';

export const AquaProject = () => {
  const projectData = PROJECTS.aqua;
  const [scrollRoot, setScrollRoot] = useState(null);
  const fadeInRef = useFadeInAnimation({ root: scrollRoot });
  const themeMode = projectData.themeMode ?? 'auto';
  const bannerImage = projectData.bannerImage ?? null;
  const { pageClassName, shouldHideThemeToggle } = useProjectPageFrame(bannerImage, themeMode);
  const { isDark } = useTheme();
  const awardBadgeSrc = isDark
    ? `${process.env.PUBLIC_URL}/projects/aqua/dis2024_dark.png`
    : `${process.env.PUBLIC_URL}/projects/aqua/dis2024.png`;
  const resourceLinks = [
    {
      type: 'paper',
      href: 'https://doi.org/10.1145/3643834.3660705',
      icon: `${process.env.PUBLIC_URL}/icons/dl.png`,
      iconDark: `${process.env.PUBLIC_URL}/icons/dl.png`,
      iconAlt: 'ACM DL'
    }
  ];

  return (
    <div className={`${pageClassName} project-page--aqua`}>
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
            <div className="project-awards-section project-header__fade-block project-fade-block" ref={fadeInRef}>
              <img
                src={awardBadgeSrc}
                alt="DIS 2024 Exhibition Badge"
                className="project-award-badge"
                loading="lazy"
              />
            </div>
          </div>
          <ProjectLinks links={resourceLinks} className="project-fade-block" fadeRef={fadeInRef} />
        </header>

        <main className="project-content">
          <section className="project-section project-section__fade" ref={fadeInRef}>
            <p className="section-text aqua-body project-fade-block" ref={fadeInRef}>
              Research promotion enables researchers to share advanced knowledge with pertinent academic communities. The question-and-answer (QA) style articles are effective for researchers to promote their research by enabling readers to understand research on complex subjects. Recent advances in large language models have opened avenues for supporting researchers in creating QA-style articles for research promotion. However, without the authors’ involvement, these models may only partially capture the researcher’s intention and voice. We developed AQUA, a research probe that enables researchers to co-create QA-style articles with LLMs to promote their research papers.
            </p>
          </section>

          <section className="project-section project-section__fade" ref={fadeInRef}>
            <h2 className="section-title">BibTeX</h2>
            <BibtexCard
              ref={fadeInRef}
              text={`@inproceedings{10.1145/3643834.3660705,
author = {Lim, Hyunseung and Cho, Ji Yong and Kim, Taewan and Park, Jeongeon and Shin, Hyungyu and Choi, Seulgi and Park, Sunghyun and Lee, Kyungjae and Kim, Juho and Lee, Moontae and Hong, Hwajung},
title = {Co-Creating Question-and-Answer Style Articles with Large Language Models for Research Promotion},
year = {2024},
isbn = {9798400705830},
publisher = {Association for Computing Machinery},
address = {New York, NY, USA},
url = {https://doi.org/10.1145/3643834.3660705},
doi = {10.1145/3643834.3660705},
abstract = {Research promotion enables researchers to share advanced knowledge with pertinent academic communities. The question-and-answer (QA) style articles are effective for researchers to promote their research by enabling readers to understand research on complex subjects. Recent advances in large language models (LLMs) have opened avenues for supporting researchers in creating QA-style articles for research promotion. However, without the authors’ involvement, these models may only partially capture the researcher’s intention and voice. We developed AQUA, a research probe that enables researchers to co-create QA-style articles with LLMs to promote their research papers. A user study (n=12) reveals that LLMs reduced authors’ burden and helped them understand the readers’ perspectives. Nevertheless, LLMs failed to capture the unique intent of the authors, and their automated generation discouraged authors from carefully revising their answers. Based on our findings, we discuss human-LLM interaction design to enable authors to create QA-style articles that reflect their intention.},
booktitle = {Proceedings of the 2024 ACM Designing Interactive Systems Conference},
pages = {975–994},
numpages = {20},
keywords = {Human-AI Interaction, Large Language Model, Question-and-Answer, Research Promotion},
location = {Copenhagen, Denmark},
series = {DIS '24}
}`}
            />
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
};
