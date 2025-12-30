import { useMemo, useState } from 'react';
import { Topbar } from '../../../Components/Topbar/topbar';
import { Footer } from '../../../Components/Footer/footer';
import { PROJECTS } from '../../../Data/projectsMeta';
import { useFadeInAnimation } from '../../../hooks/useFadeInAnimation';
import { useProjectPageFrame } from '../../../hooks/useProjectPageFrame';
import { useTheme } from '../../../contexts/ThemeContext';
import { BibtexCard } from '../../../Components/BibtexCard/BibtexCard';
import { ProjectLinks } from '../../../Components/ProjectLinks/ProjectLinks';
import { StereoHunterUI, VOCABULARY_SET } from './StereoHunterUI';
import labelCounts from '../../../Data/stereohunter_label_counts.json';
import './StereoHunter.css';

const DISTRIBUTION_KEYS = [
  { key: 'stereo', label: 'Stereo', shortLabel: 'Stereo' },
  { key: 'neutral', label: 'Neutral', shortLabel: 'Neutral' },
  { key: 'antiStereo', label: 'Anti-Stereo', shortLabel: 'Anti' },
  { key: 'ambiguous', label: 'Ambiguous', shortLabel: 'Ambig.' },
  { key: 'unrelated', label: 'Irrelevant', shortLabel: 'Irrel.' }
];

const QUANTITATIVE_ROWS = [
  { label: 'Gender', targetTerms: 21, stereo: 189, neutral: 325, antiStereo: 23, ambiguous: 26, unrelated: 60, total: 623 },
  { label: 'Profession', targetTerms: 65, stereo: 218, neutral: 524, antiStereo: 40, ambiguous: 38, unrelated: 129, total: 949 },
  { label: 'Race', targetTerms: 14, stereo: 84, neutral: 223, antiStereo: 20, ambiguous: 19, unrelated: 47, total: 393 },
  { label: 'Total', targetTerms: 100, stereo: 491, neutral: 1072, antiStereo: 83, ambiguous: 83, unrelated: 236, total: 1965 }
];

export const StereoHunterProject = () => {
  const projectData = PROJECTS.stereohunter;
  const [scrollRoot, setScrollRoot] = useState(null);
  const fadeInRef = useFadeInAnimation({ root: scrollRoot });
  const themeMode = projectData.themeMode ?? 'auto';
  const bannerImage = projectData.bannerImage ?? null;
  const { pageClassName, shouldHideThemeToggle } = useProjectPageFrame(bannerImage, themeMode);
  const { isDark } = useTheme();
  const facctLogo = `${process.env.PUBLIC_URL}/projects/stereohunter/${isDark ? 'facct_dark.png' : 'facct.png'}`;
  const flowImage = `${process.env.PUBLIC_URL}/projects/stereohunter/${isDark ? 'flow_dark.png' : 'flow.png'}`;
  const quantitativeRows = QUANTITATIVE_ROWS;
  const distributionKeys = DISTRIBUTION_KEYS;
  const maxQuantitativeTotal = Math.max(...quantitativeRows.map((row) => row.total));
  const [viewMode, setViewMode] = useState('total');
  const [scaleMode, setScaleMode] = useState('scaled');

  const vocabularyMap = useMemo(() => {
    const map = {};
    VOCABULARY_SET.forEach((item) => {
      map[item.value] = item.label;
    });
    return map;
  }, []);

  const perTargetRows = useMemo(() => {
    return labelCounts
      .map((entry) => {
        const counts = {};
        let total = 0;
        distributionKeys.forEach(({ key }) => {
          const value = entry[key] || 0;
          counts[key] = value;
          total += value;
        });
        return {
          target: entry.target,
          english: vocabularyMap[entry.target],
          counts,
          total
        };
      })
      .filter((row) => row.total > 0)
      .sort((a, b) => b.total - a.total);
  }, [vocabularyMap, distributionKeys]);
  const perTargetMaxTotal = useMemo(() => (perTargetRows.length ? perTargetRows[0].total : 0), [perTargetRows]);
  const resourceLinks = [
    {
      type: 'paper',
      href: 'https://doi.org/10.1145/3715275.3732207',
      icon: `${process.env.PUBLIC_URL}/icons/dl.png`,
      iconDark: `${process.env.PUBLIC_URL}/icons/dl.png`,
      iconAlt: 'ACM DL'
    },
    { type: 'github', href: 'https://github.com/Hyunseung-Lim/stereoHunter' }
  ];
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
location = {Athens, Greece},
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
            <div
              className="project-awards-section project-fade-block"
              aria-label="Project awards"
              ref={fadeInRef}
            >
              <img
                src={facctLogo}
                alt="ACM FAccT"
                className="project-award-badge stereohunter-award"
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
          <section className="project-section project-section__fade">
            <p className="section-text project-fade-block stereohunter-body" ref={fadeInRef}>
              Stereotypical biases in large language models have the potential to result in discriminatory responses,
              posing harm to users and disrupting interactions. While prior research has predominantly focused on assessing
              stereotypes in LLMs with fairness metrics, there is a limited understanding of how users identify and perceive
              stereotypes in LLMs. To address this gap, we introduce <strong>StereoHunter</strong>, a research probe tool designed to examine
              how individuals identify and perceive stereotypes by observing interactions in which users elicit stereotypical
              responses from LLMs.
            </p>
          </section>
          <section className="project-section project-section__fade stereohunter-ui-section" ref={fadeInRef}>
            <h2 className="section-title project-fade-block" ref={fadeInRef}>
              StereoHunter UI
            </h2>
            <StereoHunterUI fadeRef={fadeInRef} />
          </section>
          <section className="project-section project-section__fade stereohunter-flow-section" ref={fadeInRef}>
            <h2 className="section-title project-fade-block stereohunter-flow-title" ref={fadeInRef}>
              A Walk-Through Example
            </h2>
            <div className="stereohunter-flow-frame project-fade-block" ref={fadeInRef}>
              <img
                src={flowImage}
                alt="Step-by-step StereoHunter usage flow"
                loading="lazy"
              />
            </div>
            <p className="section-text section-text--small stereohunter-flow-copy project-fade-block" ref={fadeInRef}>
              <span className="stereohunter-flow-step">1</span>The process begins when users select a target group from a
              predefined group list. <span className="stereohunter-flow-step">2</span>Users then enter a specific situation in the input window to generate potential
              stereotypical responses about the chosen target. <span className="stereohunter-flow-step">3</span>After receiving the LLM-generated dialogue, users evaluate and <span className="stereohunter-flow-step">4</span>annotate the response using one of
              five labels: Stereotype, Neutral, Anti-stereotype, Ambiguous, or Irrelevant. <span className="stereohunter-flow-step">5</span>For responses marked as Stereotype or Anti-stereotype, the system guides users through detailed
              questions to understand their reasoning. When users identify a response as Ambiguous, they must explain their reasons for uncertainty in judging the stereotype. After one walk-through, users can enter a new situation for their target group or select a different group.
            </p>
          </section>
          <div
            className="project-divider project-fade-block"
            role="presentation"
            aria-hidden="true"
            ref={fadeInRef}
          />
          <section className="project-section stereohunter-quantitative" ref={fadeInRef}>
            <h2 className="section-title project-fade-block" ref={fadeInRef}>
              Interaction Statistics
            </h2>
            <div className="stereohunter-quantitative__toggles project-fade-block" ref={fadeInRef}>
              <div className="stereohunter-scale-toggle">
                <button
                  type="button"
                  className={`stereohunter-scale-toggle__btn${scaleMode === 'scaled' ? ' is-active' : ''}`}
                  onClick={() => setScaleMode('scaled')}
                  aria-pressed={scaleMode === 'scaled'}
                >
                  Scale by total
                </button>
                <button
                  type="button"
                  className={`stereohunter-scale-toggle__btn${scaleMode === 'uniform' ? ' is-active' : ''}`}
                  onClick={() => setScaleMode('uniform')}
                  aria-pressed={scaleMode === 'uniform'}
                >
                  Same width
                </button>
              </div>
              <div className="stereohunter-view-toggle">
                <button
                  type="button"
                  className={`stereohunter-view-toggle__btn${viewMode === 'total' ? ' is-active' : ''}`}
                  onClick={() => setViewMode('total')}
                  aria-pressed={viewMode === 'total'}
                >
                  Total overview
                </button>
                <button
                  type="button"
                  className={`stereohunter-view-toggle__btn${viewMode === 'perTarget' ? ' is-active' : ''}`}
                  onClick={() => setViewMode('perTarget')}
                  aria-pressed={viewMode === 'perTarget'}
                >
                  Per target
                </button>
              </div>
            </div>
            <div className="stereohunter-quantitative__legend project-fade-block" ref={fadeInRef}>
              {distributionKeys.map((item) => (
                <span key={item.key} className={`stereohunter-quantitative__legend-item is-${item.key}`}>
                  <span className="stereohunter-quantitative__legend-swatch" />
                  <span className="stereohunter-quantitative__legend-text">
                    <span className="stereohunter-legend-label stereohunter-legend-label--full">{item.label}</span>
                    <span className="stereohunter-legend-label stereohunter-legend-label--short">
                      {item.shortLabel ?? item.label}
                    </span>
                  </span>
                </span>
              ))}
            </div>
            {viewMode === 'total' ? (
              <div key="view-total" className="stereohunter-viewpanel">
                <div className="stereohunter-quantitative__rows">
                  {quantitativeRows.map((row) => (
                    <article
                      key={row.label}
                      className="stereohunter-quantitative__row project-fade-block"
                      ref={fadeInRef}
                    >
                      <div className="stereohunter-quantitative__row-layout">
                        <div className="stereohunter-quantitative__row-header">
                          <span className="stereohunter-quantitative__label">{row.label}</span>
                          <span className="stereohunter-quantitative__meta">
                            {row.targetTerms.toLocaleString()} groups
                          </span>
                        </div>
                        <div className="stereohunter-quantitative__bar-wrapper">
                          <div
                            className="stereohunter-quantitative__bar"
                            role="group"
                            aria-label={`${row.label} distribution`}
                            style={{
                              width:
                                scaleMode === 'scaled'
                                  ? `${row.total ? (row.total / maxQuantitativeTotal) * 100 : 0}%`
                                  : '100%'
                            }}
                          >
                            <div className="stereohunter-quantitative__bar-inner">
                              {distributionKeys.map((item) => {
                                const value = row[item.key] ?? 0;
                                if (!value) {
                                  return null;
                                }
                                const percent = row.total ? (value / row.total) * 100 : 0;
                                return (
                                  <div
                                    key={`${row.label}-${item.key}`}
                                    className={`stereohunter-quantitative__bar-segment is-${item.key}`}
                                    style={{ width: `${percent}%` }}
                                    aria-label={`${item.label} ${value}`}
                                    data-value={value.toLocaleString()}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ) : (
              <div key="view-per-target" className="stereohunter-viewpanel">
                <div className="stereohunter-quantitative__per-target">
                  {perTargetRows.map((row) => (
                    <article
                      key={row.target}
                      className="stereohunter-target-row project-fade-block"
                      ref={fadeInRef}
                    >
                      <div className="stereohunter-quantitative__row-layout">
                        <div className="stereohunter-target-row__header">
                          <div className="stereohunter-target-row__names">
                            <span className="stereohunter-target-row__name">
                              {row.english || row.target}
                            </span>
                          </div>
                        </div>
                        <div className="stereohunter-quantitative__bar-wrapper">
                          <div
                            className="stereohunter-quantitative__bar stereohunter-quantitative__bar--target"
                            role="group"
                            aria-label={`${row.target} distribution`}
                            style={{
                              width:
                                scaleMode === 'scaled' && perTargetMaxTotal
                                  ? `${(row.total / perTargetMaxTotal) * 100}%`
                                  : '100%'
                            }}
                          >
                            <div className="stereohunter-quantitative__bar-inner">
                              {distributionKeys.map((item) => {
                                const value = row.counts[item.key] || 0;
                                if (!value) {
                                  return null;
                                }
                                const percent = row.total ? (value / row.total) * 100 : 0;
                                return (
                                  <div
                                    key={`${row.target}-${item.key}`}
                                    className={`stereohunter-quantitative__bar-segment is-${item.key}`}
                                    style={{ width: `${percent}%` }}
                                    aria-label={`${item.label} ${value}`}
                                    data-value={value.toLocaleString()}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </section>
          <div
            className="project-divider project-fade-block"
            role="presentation"
            aria-hidden="true"
            ref={fadeInRef}
          />
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
