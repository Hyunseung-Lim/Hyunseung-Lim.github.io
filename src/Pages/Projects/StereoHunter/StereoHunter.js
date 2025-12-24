import { useState } from 'react';
import { Topbar } from '../../../Components/Topbar/topbar';
import { Footer } from '../../../Components/Footer/footer';
import { PROJECTS } from '../../../Data/projectsMeta';
import { useFadeInAnimation } from '../../../hooks/useFadeInAnimation';
import { useProjectPageFrame } from '../../../hooks/useProjectPageFrame';
import { useTheme } from '../../../contexts/ThemeContext';
import './StereoHunter.css';
import { BibtexCard } from '../../../Components/BibtexCard/BibtexCard';

export const StereoHunterProject = () => {
  const projectData = PROJECTS.stereohunter;
  const [scrollRoot, setScrollRoot] = useState(null);
  const fadeInRef = useFadeInAnimation({ root: scrollRoot });
  const themeMode = projectData.themeMode ?? 'auto';
  const bannerImage = projectData.bannerImage ?? null;
  const { pageClassName, shouldHideThemeToggle } = useProjectPageFrame(bannerImage, themeMode);
  const { isDark } = useTheme();
  const facctLogo = `${process.env.PUBLIC_URL}/projects/stereohunter/${isDark ? 'facct_dark.png' : 'facct.png'}`;
  const bibtexEntry = `@inproceedings{10.1145/3715275.3732207,
author = {Lim, Hyunseung and Choi, Dasom and Hong, Hwajung},
title = {How Do Users Identify and Perceive Stereotypes? Understanding User Perspectives on Stereotypical Biases in Large Language Models},
year = {2025},
isbn = {9798400714825},
publisher = {Association for Computing Machinery},
address = {New York, NY, USA},
url = {https://doi.org/10.1145/3715275.3732207},
doi = {10.1145/3715275.3732207},
abstract = {Warning: This article contains stereotypical and offensive contents.Stereotypical biases in large language models (LLMs) have the potential to result in discriminatory responses, posing harm to users and disrupting interactions. While prior research has predominantly focused on assessing stereotypes in LLMs with fairness metrics, there is a limited understanding of how users identify and perceive stereotypes in LLMs. To address this gap, we introduce StereoHunter, a research probe tool designed to examine how individuals identify and perceive stereotypes by observing interactions in which users elicit stereotypical responses from LLMs. Our findings reveal the nuanced considerations and challenges participants faced when evaluating these stereotypes, which varied based on their backgrounds and preconceptions about LLMs. Based on these insights, we discuss how diverse user perspectives can be reflected in identifying stereotypes and informing fairness metrics for mitigating biases in LLMs.},
booktitle = {Proceedings of the 2025 ACM Conference on Fairness, Accountability, and Transparency},
pages = {3241–3253},
numpages = {13},
keywords = {AI fairness, stereotype, algorithmic harms, large language model, human-AI interaction},
location = {},
series = {FAccT '25}
}`;

  return (
    <div className={`${pageClassName} project-page--stereohunter`}>
      <Topbar hideThemeToggle={shouldHideThemeToggle} />
      {bannerImage && (
        <div className="banner-section">
          <img src={bannerImage} alt={`${projectData.title} banner`} className="banner-image" />
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
            <div
              className="project-awards-section project-fade-block"
              aria-label="Project awards"
              ref={fadeInRef}
            >
              <a
                href="https://dl.acm.org/doi/full/10.1145/3715275.3732207"
                target="_blank"
                rel="noopener noreferrer"
                className="project-award-link"
                aria-label="Read ACM FAccT paper"
              >
                <img
                  src={facctLogo}
                  alt="ACM FAccT"
                  className="project-award-badge stereohunter-award"
                  loading="lazy"
                />
              </a>
            </div>
          </div>
        </header>

        <main className="project-content">
          <section className="project-section">
            <p className="section-text project-fade-block stereohunter-body" ref={fadeInRef}>
              Stereotypical biases in large language models have the potential to result in discriminatory responses,
              posing harm to users and disrupting interactions. While prior research has predominantly focused on assessing
              stereotypes in LLMs with fairness metrics, there is a limited understanding of how users identify and perceive
              stereotypes in LLMs. To address this gap, we introduce <strong>StereoHunter</strong>, a research probe tool designed to examine
              how individuals identify and perceive stereotypes by observing interactions in which users elicit stereotypical
              responses from LLMs.
            </p>
          </section>
          <div className="stereohunter-divider" role="presentation" aria-hidden="true" />
          <section className="project-section stereohunter-bibtex">
            <h2 className="section-title project-fade-block" ref={fadeInRef}>BibTeX</h2>
            <BibtexCard ref={fadeInRef} text={bibtexEntry} className="project-fade-block" />
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
};
