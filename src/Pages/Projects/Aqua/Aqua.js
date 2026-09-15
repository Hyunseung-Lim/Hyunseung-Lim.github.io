import { useState } from 'react';
import { Topbar } from '../../../Components/Topbar/topbar';
import { Footer } from '../../../Components/Footer/footer';
import { PROJECTS } from '../../../Data/projectsMeta';
import { useFadeInAnimation } from '../../../hooks/useFadeInAnimation';
import { useProjectPageFrame } from '../../../hooks/useProjectPageFrame';
import { useTheme } from '../../../contexts/ThemeContext';
import { PageLoadGuard } from '../../../Components/PageLoader/PageLoadGuard';
import { ProjectHeader, ProjectBibtexSection, collectProjectAssets } from '../../../Components/ProjectPage';
import './Aqua.css';
import { QAContainer } from './QAContainer';

const AQUA_PAGE_ASSETS = collectProjectAssets(PROJECTS.aqua, [
  '/projects/aqua/ui.png',
  '/projects/aqua/qagen.png',
  '/projects/aqua/qagen_dark.png',
  '/icons/togglebtn.svg'
]);

export const AquaProject = () => {
  const projectData = PROJECTS.aqua;
  const [scrollRoot, setScrollRoot] = useState(null);
  const fadeInRef = useFadeInAnimation({ root: scrollRoot });
  const themeMode = projectData.themeMode ?? 'auto';
  const { pageClassName, shouldHideThemeToggle } = useProjectPageFrame(null, themeMode);
  const { isDark } = useTheme();

  const loaderMessage = `Loading ${projectData.title}...`;

  return (
    <PageLoadGuard assets={AQUA_PAGE_ASSETS} message={loaderMessage}>
      <div className={`${pageClassName} project-page--aqua`}>
        <Topbar hideThemeToggle={shouldHideThemeToggle} />

        <div className="project-container" ref={setScrollRoot}>
        <ProjectHeader project={projectData} fadeRef={fadeInRef} />

        <main className="project-content">
          <section className="project-section project-section--intro">
            <p className="section-text project-fade-block" ref={fadeInRef}>
              Research promotion enables researchers to share advanced knowledge with pertinent academic communities. Recent advances in large language models have opened avenues for supporting researchers in creating QA-style articles for research promotion. However, without the authors’ involvement, models may only partially capture the researcher’s intention and voice. We developed AQUA, a research probe that enables researchers to co-create QA-style articles with LLMs to promote their research papers.
            </p>
          </section>

          <section className="project-section aqua-qa-section">
            <QAContainer fadeRef={fadeInRef} isDark={isDark} />
          </section>

          <ProjectBibtexSection
            fadeRef={fadeInRef}
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
        </main>
        </div>

        <Footer />
      </div>
    </PageLoadGuard>
  );
};
