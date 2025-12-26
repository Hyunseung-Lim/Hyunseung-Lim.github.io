import { Fragment, useEffect, useMemo, useState } from 'react';
import './Panorama.css';

const PROCESS_STEPS = [
  { key: 'fill-application', role: 'Applicant', label: ['Fill the', 'Application'], document: 'Patent Application' },
  { key: 'first-examination', role: 'Examiner', label: ['1st Examination'], document: 'Non-Final Rejection' },
  { key: 'amend-application', role: 'Applicant', label: ['Amend the', 'Application'], document: '(Amended) Patent Application' },
  { key: 'second-examination', role: 'Examiner', label: ['2nd Examination'], document: 'Notice of Allowance' }
];

const ROLE_ICON_MAP = {
  Applicant: {
    light: `${process.env.PUBLIC_URL}/projects/panorama/applicant.png`,
    dark: `${process.env.PUBLIC_URL}/projects/panorama/applicant_dark.png`
  },
  Examiner: {
    light: `${process.env.PUBLIC_URL}/projects/panorama/examiner.png`,
    dark: `${process.env.PUBLIC_URL}/projects/panorama/examiner_dark.png`
  }
};

const DOC_ICON = `${process.env.PUBLIC_URL}/projects/panorama/docs.svg`;
const DOC_ICON_DARK = `${process.env.PUBLIC_URL}/projects/panorama/docs_dark.svg`;

const DATASET_SECTIONS = [
  {
    id: 'title',
    title: 'Title'
  },
  {
    id: 'abstract',
    title: 'Abstract'
  },
  {
    id: 'metadata',
    title: 'Metadata',
    span: 'full'
  },
  {
    id: 'initial-claims',
    title: 'Initial Claims',
    claimRows: ['Claim 1: ...', 'Claim 2: ...', '...']
  },
  {
    id: 'final-claims',
    title: 'Final Claims',
    claimRows: ['Claim 1: ...', 'Claim 2: ...', '...']
  },
  {
    id: 'specification',
    title: 'Specification',
    icon: 'specification'
  },
  {
    id: 'drawing',
    title: 'Drawing',
    icon: 'drawing'
  },
  {
    id: 'non-final-rejection',
    title: 'Non-Final Rejection',
    span: 'full',
    horizontalBlocks: [
      { title: 'Claim 1: ...', subtitle: 'isReject: True' },
      { title: 'Claim 2: ...', subtitle: 'isReject: True' },
      { title: '...', subtitle: '' }
    ],
    metaList: [
      'sectionCode: §102',
      'citedPatents: [...]',
      'reason: ...'
    ]
  },
  {
    id: 'cited-patent',
    title: 'Cited Patent',
    span: 'full',
    horizontalBlocks: [
      { title: 'Patent #: ...', subtitle: ['Title: ...', 'Abstract: ...', 'Claims: [...]'] },
      { title: 'Patent #: ...', subtitle: ['Title: ...', 'Abstract: ...', 'Claims: [...]'] },
      { title: '...', subtitle: '' }
    ]
  },
  {
    id: 'notice-of-allowance',
    title: 'Notice of Allowance',
    span: 'full',
    items: []
  }
];

const PROCESS_DATASET_MAP = {
  'fill-application': ['title', 'metadata', 'abstract', 'initial-claims', 'specification', 'drawing'],
  'first-examination': ['non-final-rejection', 'cited-patent'],
  'amend-application': ['final-claims'],
  'second-examination': ['notice-of-allowance']
};

const BENCHMARK_DATASET_MAP = {
  'PAR4PC Benchmark Tasks': ['title', 'abstract', 'initial-claims', 'non-final-rejection', 'cited-patent'],
  'PI4PC Benchmark Tasks': ['title', 'abstract', 'initial-claims', 'non-final-rejection', 'cited-patent'],
  'NOC4PC Benchmark Tasks': ['title', 'abstract', 'initial-claims', 'non-final-rejection', 'cited-patent']
};

const BENCHMARK_TASKS = [
  {
    title: 'PAR4PC Benchmark Tasks',
    prompt: 'Q. Based only on the provided context and options, which patent(s) (A-H) were cited against claim X?',
    options: ['Patent A', 'Patent B', 'Patent C', 'Patent D', 'Patent E', 'Patent F', 'Patent G', 'Patent H']
  },
  {
    title: 'PI4PC Benchmark Tasks',
    prompt: 'Q. Based on the provided context (claim X and the cited prior art specification), which paragraph is the most relevant?',
    options: ['Para #2', 'Para #8', 'Para #14', 'Para #28', 'Para #32']
  },
  {
    title: 'NOC4PC Benchmark Tasks',
    prompt: 'Q. Based on the patent application and the cited prior art, what is the rejection code (e.g., 102, 103) and the reason for rejecting claim X?',
    options: ['§102', '§103', 'Allow']
  }
];

const DATASET_ICON_MAP = {
  specification: {
    light: `${process.env.PUBLIC_URL}/projects/panorama/spec_light.svg`,
    dark: `${process.env.PUBLIC_URL}/projects/panorama/spec_dark.svg`
  },
  drawing: {
    light: `${process.env.PUBLIC_URL}/projects/panorama/drawing.svg`,
    dark: `${process.env.PUBLIC_URL}/projects/panorama/drawing_dark.svg`
  }
};

export const PanoramaDiagram = ({ fadeRef, isDark }) => {
  const [hoveredProcess, setHoveredProcess] = useState(null);
  const [hoveredBenchmark, setHoveredBenchmark] = useState(null);
  const [isHoverEnabled, setIsHoverEnabled] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return true;
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const handleChange = event => setIsHoverEnabled(event.matches);
    setIsHoverEnabled(mediaQuery.matches);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  useEffect(() => {
    if (!isHoverEnabled) {
      setHoveredProcess(null);
      setHoveredBenchmark(null);
    }
  }, [isHoverEnabled]);
  const hoveredDatasetSet = useMemo(() => {
    const ids = new Set();
    const processSet = hoveredProcess ? PROCESS_DATASET_MAP[hoveredProcess] : null;
    const benchmarkSet = hoveredBenchmark ? BENCHMARK_DATASET_MAP[hoveredBenchmark] : null;
    (processSet ?? []).forEach(id => ids.add(id));
    (benchmarkSet ?? []).forEach(id => ids.add(id));
    return ids;
  }, [hoveredProcess, hoveredBenchmark]);
  return (
    <section className="panorama-diagram project-fade-block" ref={fadeRef}>
      <div className="diagram-column diagram-process diagram-panel">
        <h3>Simplified Patent Examination Process</h3>
        <div className="process-flow">
          {PROCESS_STEPS.map((step, index) => {
            const isHovered = hoveredProcess === step.key;
            return (
              <Fragment key={step.key}>
                <div
                  className={`process-step ${index === PROCESS_STEPS.length - 1 ? 'is-last' : ''} ${
                    isHovered ? 'is-hovered' : ''
                  } ${isHovered ? 'is-active' : ''}`}
                  onMouseEnter={isHoverEnabled ? () => setHoveredProcess(step.key) : undefined}
                  onMouseLeave={isHoverEnabled ? () => setHoveredProcess(null) : undefined}
                >
                  <div className="process-step__row">
                    <div className="process-role-block">
                      <img
                        src={isDark ? ROLE_ICON_MAP[step.role].dark : ROLE_ICON_MAP[step.role].light}
                        alt={step.role}
                        className="process-step__icon"
                        loading="lazy"
                      />
                      <span className="process-role-label">{step.role}</span>
                    </div>
                    <div className="process-label-column">
                      <div className="process-label-block">
                        {Array.isArray(step.label) ? step.label.join('\n') : step.label}
                      </div>
                    </div>
                    <div className="process-doc">
                      <img
                        src={isDark ? DOC_ICON_DARK : DOC_ICON}
                        alt=""
                        className="process-doc__icon"
                        loading="lazy"
                      />
                      <span className="process-doc__label">{step.document}</span>
                    </div>
                  </div>
                </div>
                {index !== PROCESS_STEPS.length - 1 && (
                  <img
                    src={
                      isDark
                        ? `${process.env.PUBLIC_URL}/projects/panorama/arrow_dark.svg`
                        : `${process.env.PUBLIC_URL}/projects/panorama/arrow.svg`
                    }
                    alt=""
                    className="process-flow__arrow"
                    aria-hidden="true"
                  />
                )}
              </Fragment>
            );
          })}
        </div>
      </div>

      <div className="diagram-column diagram-dataset diagram-panel">
        <h3 className="dataset-panel__title">PANORAMA Dataset</h3>
        <div className="dataset-panel__content">
          <span className="dataset-panel__layer dataset-panel__layer--back" aria-hidden="true" />
          <span className="dataset-panel__layer dataset-panel__layer--mid" aria-hidden="true" />
          <div className="dataset-panel__body">
            <div className="dataset-grid">
              {DATASET_SECTIONS.map(section => {
                const hasItems = Array.isArray(section.items) && section.items.length > 0;
                const hasClaimRows = Array.isArray(section.claimRows) && section.claimRows.length > 0;
                const hasCards = Array.isArray(section.horizontalBlocks) && section.horizontalBlocks.length > 0;
                const hasMetaList = Array.isArray(section.metaList) && section.metaList.length > 0;
                const isCompact = !hasItems && !hasClaimRows && !hasCards && !hasMetaList;
                const iconSrc = section.icon
                  ? (isDark ? DATASET_ICON_MAP[section.icon].dark : DATASET_ICON_MAP[section.icon].light)
                  : null;
                const isDrawingIcon = section.icon === 'drawing';
                const isHovered = hoveredDatasetSet?.has(section.id);

                return (
                  <div
                    key={section.id}
                    className={`dataset-block ${section.span === 'full' ? 'dataset-block--full' : ''} ${
                      isCompact ? 'dataset-block--compact' : ''
                    } ${iconSrc ? 'dataset-block--with-icon' : ''} ${isDrawingIcon ? 'dataset-block--drawing' : ''} ${
                      isHovered ? 'dataset-block--active' : ''
                    }`}
                  >
                    <span className="dataset-title">{section.title}</span>
                    {iconSrc && (
                      <div className="dataset-block__icon">
                        <img src={iconSrc} alt={`${section.title} icon`} loading="lazy" />
                      </div>
                    )}
                    {hasItems && (
                      <ul>
                        {section.items.map(item => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    )}
                    {hasClaimRows && (
                      <div className="dataset-claims">
                        {section.claimRows.map(row => {
                          const normalized = row.toLowerCase();
                          const isClaimRow = normalized.includes('claim');
                          const isEllipsis = row.trim() === '...';
                          return (
                            <div
                              key={row}
                              className={`dataset-claims__row ${isClaimRow ? 'dataset-claims__row--highlight' : ''} ${
                                isEllipsis ? 'dataset-claims__row--muted' : ''
                              }`}
                            >
                              {row}
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {hasCards && (
                      <div className="dataset-card-row">
                        {section.horizontalBlocks.map((block, blockIndex) => {
                          const baseSubtitle = Array.isArray(block.subtitle) ? block.subtitle : [block.subtitle];
                          const combinedSubtitle = baseSubtitle
                            .filter(Boolean)
                            .map(text => ({ text, emphasize: false }));
                          const hasSubtitle = combinedSubtitle.length > 0;
                          if (hasSubtitle && hasMetaList) {
                            section.metaList.forEach(text => combinedSubtitle.push({ text, emphasize: false }));
                          }
                          const emphasizeSectionCode =
                            hoveredBenchmark === 'NOC4PC Benchmark Tasks' && section.id === 'non-final-rejection';
                          if (emphasizeSectionCode) {
                            const target = combinedSubtitle.find(entry =>
                              entry.text.toLowerCase().startsWith('sectioncode')
                            );
                            if (target) {
                              target.emphasize = true;
                            }
                          }
                          const shouldShowParagraphs =
                            (hoveredBenchmark === 'PI4PC Benchmark Tasks' || hoveredBenchmark === 'NOC4PC Benchmark Tasks') &&
                            section.id === 'cited-patent' &&
                            block.title.startsWith('Patent #:');
                          if (shouldShowParagraphs) {
                            combinedSubtitle.push({ text: 'Paragraphs: [...]', emphasize: false });
                          }
                          return (
                            <div
                              key={`${section.title}-${block.title}-${blockIndex}`}
                              className={`dataset-card ${hasSubtitle ? '' : 'dataset-card--muted'}`}
                            >
                              <span className="dataset-card__title">{block.title}</span>
                              {hasSubtitle && (
                                <div className="dataset-card__subtitle">
                                  {combinedSubtitle.map((line, lineIndex) => (
                                    <span
                                      key={`${block.title}-${line.text}-${lineIndex}`}
                                      className={line.emphasize ? 'dataset-card__subtitle--emphasis' : ''}
                                    >
                                      {line.text}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="diagram-column diagram-benchmarks diagram-panel">
        {BENCHMARK_TASKS.map((task, index) => (
          <div
            key={task.title}
            className={`benchmark-card ${index === 0 ? 'benchmark-card--wide-options' : ''}`}
            onMouseEnter={isHoverEnabled ? () => setHoveredBenchmark(task.title) : undefined}
            onMouseLeave={isHoverEnabled ? () => setHoveredBenchmark(null) : undefined}
          >
            <h4 className="benchmark-card__title">{task.title}</h4>
            <div className="benchmark-card__content">
              <span className="benchmark-card__layer benchmark-card__layer--back" aria-hidden="true" />
              <span className="benchmark-card__layer benchmark-card__layer--mid" aria-hidden="true" />
              <div className="benchmark-card__body">
                <p>{task.prompt}</p>
                <div className="benchmark-options">
                  {task.options.map(option => (
                    <span key={option}>{option}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
