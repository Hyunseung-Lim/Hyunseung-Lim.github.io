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

  const renderLabelWithCounts = (label) => {
    if (typeof label !== 'string') {
      return label;
    }
    const match = label.match(/^(.*?)(\s*\(.*\))$/);
    if (!match) {
      return label;
    }
    const [, mainText, countText] = match;
    return (
      <>
        {mainText.trim()}
        <br />
        <span className="feedometer-categorization__count">{countText.trim()}</span>
      </>
    );
  };

  const { isDark } = useTheme();
  const baselinePipelineImage = `${process.env.PUBLIC_URL}/projects/feed-o-meter/${isDark ? 'baseline_pipeline_dark.png' : 'baseline_pipeline.png'}`;
  const interventionPipelineImage = `${process.env.PUBLIC_URL}/projects/feed-o-meter/${isDark ? 'intervention_pipeline_dark.png' : 'intervention_pipeline.png'}`;
  const dr1PersonaImage = `${process.env.PUBLIC_URL}/projects/feed-o-meter/students/student33.png`;
  const studyProcedureImage = `${process.env.PUBLIC_URL}/projects/feed-o-meter/${isDark ? 'study_procedure_dark.png' : 'study_procedure.png'}`;
  const studyProcedureMobileImage = `${process.env.PUBLIC_URL}/projects/feed-o-meter/${isDark ? 'study_procedure_dark_mobile.png' : 'study_procedure_mobile.png'}`;
  const sentenceLevelFindings = [
    { metric: 'Timeliness', feedScore: 4.7, baselineScore: 4.8, significance: 'p = 0.3108 (n.s.)' },
    { metric: 'Goal Relevance', feedScore: 4.7, baselineScore: 4.9, significance: 'p = 0.1453 (n.s.)' },
    { metric: 'Level', feedScore: 4.0, baselineScore: 4.2, significance: 'p = 0.0622 (n.s.)' },
    { metric: 'Specificity', feedScore: 4.6, baselineScore: 4.3, significance: 'p = 0.0005 (***)' },
    { metric: 'Justification', feedScore: 4.7, baselineScore: 4.4, significance: 'p = 0.0001 (***)' },
    { metric: 'Action', feedScore: 4.2, baselineScore: 3.9, significance: 'p = 0.0025 (**)' }
  ];
  const sessionLevelFindings = [
    { metric: 'Ratio of divergent and convergent', feedScore: 4.2, baselineScore: 3.6, significance: 'p = 0.1191 (n.s.)' },
    { metric: 'Ratio of question and statement', feedScore: 4.1, baselineScore: 4.2, significance: 'p = 0.7661 (n.s.)' },
    { metric: 'Overall helpfulness', feedScore: 4.5, baselineScore: 4.4, significance: 'p = 0.7930 (n.s.)' }
  ];
  const feedbackCategorizationData = [
    {
      category: 'Low-Level (F: 81, B: 114)',
      subcategories: [
        {
          name: 'Verification (F: 9, B: 18)',
          description: "Feedback to make sure the user understands the mentee's idea.",
          example: ['P22: So this idea is a filtering service for kids?', "Alex: Yes, that's right."]
        },
        {
          name: 'Completion (F: 43, B: 76)',
          description: 'Feedback to clarify something that is not clearly explained.',
          example: ['P13: How exactly does virtual adoption work?', 'Alex: It uses VR to simulate pet ownership experience.']
        },
        {
          name: 'Understanding Mentee (F: 23, B: 15)',
          description: "Feedback to get to know mentee's background, understanding, interests, and more.",
          example: ['P21: Alex, do you have any pets?', "Alex: Yes, my family has a dog, and that's what inspired me to come up with this idea."]
        }
      ]
    },
    {
      category: 'Deep Reasoning (F: 46, B: 72)',
      subcategories: [
        {
          name: 'Logical / Causal Reasoning (F: 37, B: 60)',
          description:
            'Feedback that prompts the mentee to reason about the feasibility, realization, effectiveness, or other implications of the idea.',
          example: ['P24: Is it scientifically possible?', "Alex: To be honest, I haven't thought deeply about that."]
        },
        {
          name: 'Instrumental / Procedural Reasoning (F: 8, B: 11)',
          description: "Feedback asking about the procedure and reasons behind the mentee's decision.",
          example: ['P15: Why did you limit the target to children under 7 years old?', "Alex: Oh, I didn't limit it to children under 7."]
        }
      ]
    },
    {
      category: 'Generative Design (F: 35, B: 57)',
      subcategories: [
        {
          name: 'Brainstorming / Ideation (F: 19, B: 26)',
          description: 'Feedback that provides or elicits ideas without a deliberate end goal.',
          example: ['P15: How about letting them know in the dog\'s voice saying "I want to go for a walk"?']
        },
        {
          name: 'Negotiation (F: 7, B: 16)',
          description: 'Feedback that suggests or negotiates a new idea instead of the current one.',
          example: ['P19: Is there any way we could detect child abuse earlier, before it gets too serious?']
        },
        {
          name: 'Scenario Creation (F: 9, B: 12)',
          description: 'Feedback that presents specific scenarios that could happen.',
          example: ['P20: In abusive households, parents might prevent children from making emergency calls. How can we address this issue?']
        }
      ]
    },
    {
      category: 'Share Information (F: 75, B: 46)',
      subcategories: [
        {
          name: 'Sharing Examples / Personal Experience (F: 34, B: 26)',
          description: 'Feedback that provides an example or personal experience.',
          example: ['P10: Have you heard of "Elsagate"? [...], it seems difficult to filter out malicious content similar to those interests.']
        },
        {
          name: 'Providing Design Knowledge (F: 24, B: 15)',
          description: 'Feedback that provides design knowledge or principles.',
          example: [
            'P6: Another important factor to consider is what stakeholders can help when child abuse issues occur.',
            "It's important to consider these various stakeholders."
          ]
        }
      ]
    },
    {
      category: 'Evaluation (F: 137, B: 162)',
      subcategories: [
        {
          name: 'Positive Assessment (F: 63, B: 67)',
          description: 'Feedback that explicitly delivers positive assessment of the design quality.',
          example: [
            'Alex: Users could express satisfaction with emoticons after watching content.',
            'P16: Oh, using emoticons for feedback is a great idea!'
          ]
        },
        {
          name: 'Negative Assessment (F: 58, B: 85)',
          description: 'Feedback that explicitly delivers negative assessment of the design quality.',
          example: [
            "P10: I got the impression that the target problem and the ideas aren't really well aligned."
          ]
        }
      ]
    },
    {
      category: 'Recommendation (F: 193, B: 144)',
      subcategories: [
        {
          name: 'Direct Recommendation (F: 103, B: 86)',
          description: 'Feedback that gives specific advice on what or how to do.',
          example: [
            "P23: Let's design a platform that's not just for adopters, but one that various stakeholders from each facility can use together."
          ]
        },
        {
          name: 'Hinting (F: 73, B: 50)',
          description: 'Feedback that indirectly suggests a way to proceed without making a direct suggestion.',
          example: ["P9: You should look that up. As a hint, think about what's currently used in automatic doors."]
        },
        {
          name: 'Project Management (F: 15, B: 8)',
          description: 'Feedback on project management, including scheduling, deliverables, stakeholder management, and empathetic coordination.',
          example: [
            'P18: It would be good to organize the types and situations of child abuse by third parties indoors more specifically.'
          ]
        }
      ]
    },
    {
      category: 'No Feedback (F: 39, B: 39)',
      subcategories: [
        {
          name: 'No Feedback (F: 39, B: 39)',
          description: 'Exchanges that contain greetings or social expressions without delivering actionable feedback.',
          example: [
            "P4: Hello, I've carefully read your ideas.",
            "P5: I didn't give you much advice, but you're really good at developing ideas! Haha."
          ]
        }
      ]
    }
  ];
  const evaluationCriteria = [
    {
      type: 'Single-turn',
      groups: [
        {
          category: 'Question',
          items: [
            {
              criteria: 'Timeliness',
              description:
                "The feedback is timely, offering questions that match the recipient's current stage in the design process."
            },
            {
              criteria: 'Goal Relevance',
              description:
                "The feedback is aligned with the design goal and does not address points irrelevant to the recipient's hand-in."
            },
            {
              criteria: 'Level',
              description:
                'The feedback is appropriately challenging, requiring a degree of complex, critical, or creative thinking appropriate for the recipient.'
            },
            {
              criteria: 'Sentiment',
              description: 'The feedback is positive (or negative) in tone.'
            }
          ]
        },
        {
          category: 'Statement',
          items: [
            {
              criteria: 'Specificity',
              description: 'The feedback is specific, pointing to exact design elements or artifacts.'
            },
            {
              criteria: 'Justification',
              description: 'The feedback is well-justified, backed by clear reasoning or evidence.'
            },
            {
              criteria: 'Action',
              description: 'The feedback is actionable and can be implemented immediately.'
            },
            {
              criteria: 'Sentiment',
              description: 'The feedback is positive (or negative) in tone.'
            }
          ]
        }
      ]
    },
    {
      type: 'Multiple-turn',
      groups: [
        {
          category: '-',
          items: [
            {
              criteria: 'Ratio of Divergent and Convergent',
              description:
                'The feedback session adapts to each state of the work, offering divergent feedback when exploration is needed and convergent feedback when focus is required.'
            },
            {
              criteria: 'Ratio of Question and Statement',
              description:
                'The feedback session adapts to each state of the work, providing questions when open inquiry is appropriate and statements when definitive direction or consolidation is needed.'
            }
          ]
        }
      ]
    }
  ];
  const evaluationRows = [];
  evaluationCriteria.forEach(({ type, groups }) => {
    const typeRowSpan = groups.reduce((sum, group) => sum + group.items.length, 0);
    let typeRendered = false;

    groups.forEach(({ category, items }) => {
      const categoryRowSpan = items.length;
      let categoryRendered = false;

      items.forEach(({ criteria, description }, index) => {
        const shouldMergeCategory = category === '-';
        const renderCategoryCell = !shouldMergeCategory && !categoryRendered;
        const criteriaColSpan = shouldMergeCategory ? 2 : 1;

        evaluationRows.push(
          <tr key={`${type}-${category}-${criteria}-${index}`}>
            {!typeRendered && (
              <td rowSpan={typeRowSpan} className="feedometer-table__type">
                {type}
              </td>
            )}
            {renderCategoryCell && (
              <td rowSpan={categoryRowSpan} className="feedometer-table__category">
                {category === '-' ? '' : category}
              </td>
            )}
            <td className="feedometer-table__criteria" colSpan={criteriaColSpan}>
              {criteria}
            </td>
            <td className="feedometer-table__description">{description}</td>
          </tr>
        );

        if (!typeRendered) {
          typeRendered = true;
        }

        if (renderCategoryCell) {
          categoryRendered = true;
        }
      });
    });
  });
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
        dr1PersonaImage,
        `${process.env.PUBLIC_URL}/projects/feed-o-meter/study_procedure.png`,
        `${process.env.PUBLIC_URL}/projects/feed-o-meter/study_procedure_dark.png`,
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
            <h3 className="section-title project-fade-block" ref={fadeInRef}>
              DR1: simulate a novice design student
            </h3>
            <p className="section-text section-text--small feedometer-dr1-description project-fade-block" ref={fadeInRef}>
              Our goal was to let users practice providing feedback in scenarios that closely mirror real-life
              situations while fostering active engagement, rather than the hesitation often seen in traditional
              environments. To achieve this, we assigned users the role of a mentor and designed scenarios in which they
              provided feedback on an AI mentee's design idea.
            </p>
            <div className="feedometer-dr1-persona project-fade-block" ref={fadeInRef}>
              <div className="feedometer-dr1-persona__media">
                <img
                  src={dr1PersonaImage}
                  alt="Persona illustration of Alex, a first-year design student"
                  loading="lazy"
                />
              </div>
              <div className="feedometer-dr1-persona__details">
                <p><strong>Name:</strong> Alex</p>
                <p><strong>Nationality:</strong> Korean</p>
                <p><strong>Education Level:</strong> First-year Design Major Student</p>
              </div>
            </div>
            <div className="feedometer-dr1-figure project-fade-block" ref={fadeInRef}>
              <img
                src={baselinePipelineImage}
                alt="Baseline pipeline illustrating how Feed-O-Meter simulates a novice design student"
                loading="lazy"
              />
              <p className="feedometer-dr1-caption">
                Structure of the Mentee backend pipeline. (1) Feedback is provided by the user and processed by the response generator through the following steps. (2) The categorizer categorizes the feedback into six predefined categories, such as information and recommendations. (3) Knowledge and action plan are extracted by the knowledge extractor according to their categories and integrated into the knowledge state. When the user clicks the "Update Idea" button, a design idea is revised based on action plans and the chat history.
              </p>
            </div>
          </section>
          <section className="project-section project-section__fade feedometer-dr2-section">
            <h3 className="section-title project-fade-block" ref={fadeInRef}>
              DR2: promote critical reflections on feedback and its effects
            </h3>
            <p
              className="section-text section-text--small feedometer-dr2-description project-fade-block"
              ref={fadeInRef}
            >
              Our system aims not only to provide an environment for practicing feedback but also to help users improve
              their feedback skills. Instead of prescribing a fixed rubric, we emphasized user autonomy by allowing users
              observe how their feedback shapes mentee's ideation process. We designed three components to provide
              indirect guidance and encourage users to reflect on the impact of their feedback and refine their
              strategies.
            </p>
            <div className="feedometer-dr2-figure project-fade-block" ref={fadeInRef}>
              <img
                src={interventionPipelineImage}
                alt="Intervention pipeline illustrating how Feed-O-Meter promotes critical reflections on feedback and its effects"
                loading="lazy"
              />
              <p className="feedometer-dr2-caption">
                Pipeline of the Feedback Reflection Interface. The pipeline starts by categorizing user feedback into one of six categories - three from the question family and three from the statement family. Each feedback sentence is then evaluated according to criteria specific to its category. The evaluation results are displayed in the feedback reflection interface, influencing the mentee's facial expressions, which change dynamically based on the feedback. Counter-questions are generated when certain conditions are met.
              </p>
            </div>
          </section>
          <section className="project-section project-section__fade" ref={fadeInRef}>
            <h2 className="section-title project-fade-block" ref={fadeInRef}>
              Feed-O-Meter Demo
            </h2>
            <div className="feedometer-video-frame project-fade-block" ref={fadeInRef}>
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

          <section className="project-section project-section__fade feedometer-findings-section">
            <h2 className="section-title project-fade-block" ref={fadeInRef}>
              User Study
            </h2>
            <div className="feedometer-study-subsection">
              <h3 className="section-subtitle feedometer-study-subtitle project-fade-block" ref={fadeInRef}>Study Procedure</h3>
              <div className="feedometer-study-figure project-fade-block" ref={fadeInRef}>
                <picture>
                  <source srcSet={studyProcedureMobileImage} media="(max-width: 600px)" />
                  <img
                    src={studyProcedureImage}
                    alt="Study procedure steps for Feed-O-Meter user study"
                    loading="lazy"
                  />
                </picture>
              </div>
              <p className="section-text section-text--small feedometer-study-description project-fade-block" ref={fadeInRef}>
                We conducted a within-subject study with two conditions: (1) a baseline condition and (2) the Feed-O-Meter condition. In the baseline condition, participants used a version of Feed-O-Meter without the Feedback Reflection Interface (FRI), meaning that the feedback evaluation was not displayed, and Alex did not ask counter-questions. In the Feed-O-Meter condition, all features of Feed-O-Meter were activated.
              </p>
            </div>
            <div className="feedometer-study-subsection">
              <h3 className="section-subtitle project-fade-block" ref={fadeInRef}>Evaluation Criteria</h3>
              <div className="feedometer-evaluation-table-wrapper project-fade-block" ref={fadeInRef}>
                <table className="feedometer-evaluation-table">
                  <thead>
                    <tr>
                      <th>Feedback Type</th>
                      <th colSpan={2} className="feedometer-table__criteria-heading">Criteria</th>
                      <th className="feedometer-table__description-heading">Description</th>
                    </tr>
                  </thead>
                  <tbody>{evaluationRows}</tbody>
                </table>
              </div>
            </div>
          </section>
          <div
            className="project-divider project-fade-block"
            role="presentation"
            aria-hidden="true"
            ref={fadeInRef}
          />
          <section className="project-section project-section__fade feedometer-results-section" ref={fadeInRef}>
            <h2 className="section-title project-fade-block" ref={fadeInRef}>
              Findings
            </h2>
            <div className="feedometer-study-subsection">
              <h3 className="section-subtitle project-fade-block" ref={fadeInRef}>
                Feedback Evaluation Results
              </h3>
              <div className="feedometer-findings-chart">
                <div className="feedometer-findings-legend project-fade-block" ref={fadeInRef}>
                  <span><span className="legend-swatch legend-swatch--feed" />Feed-O-Meter</span>
                  <span><span className="legend-swatch legend-swatch--baseline" />Baseline</span>
                </div>
                <div className="feedometer-findings-block">
                  <h4 className="project-fade-block" ref={fadeInRef}>Sentence level</h4>
                  {sentenceLevelFindings.map(({ metric, feedScore, baselineScore, significance }) => (
                    <div
                      className="feedometer-findings-group project-fade-block"
                      key={metric}
                      ref={fadeInRef}
                    >
                      <div className="feedometer-findings-label-row">
                        <span className="feedometer-findings-metric">{metric}</span>
                        <span className="feedometer-findings-significance">{significance}</span>
                      </div>
                      <div className="feedometer-findings-bars">
                        <div className="feedometer-findings-bar-track">
                          <div
                            className="feedometer-findings-bar feedometer-findings-bar--feed"
                            style={{ width: `${(feedScore / 7) * 100}%` }}
                          >
                            <span>{feedScore.toFixed(1)}</span>
                          </div>
                        </div>
                        <div className="feedometer-findings-bar-track">
                          <div
                            className="feedometer-findings-bar feedometer-findings-bar--baseline"
                            style={{ width: `${(baselineScore / 7) * 100}%` }}
                          >
                            <span>{baselineScore.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="feedometer-findings-divider" />
                <div className="feedometer-findings-block">
                  <h4 className="project-fade-block" ref={fadeInRef}>Session level</h4>
                  {sessionLevelFindings.map(({ metric, feedScore, baselineScore, significance }) => (
                    <div
                      className="feedometer-findings-group project-fade-block"
                      key={metric}
                      ref={fadeInRef}
                    >
                      <div className="feedometer-findings-label-row">
                        <span className="feedometer-findings-metric">{metric}</span>
                        <span className="feedometer-findings-significance">{significance}</span>
                      </div>
                      <div className="feedometer-findings-bars">
                        <div className="feedometer-findings-bar-track">
                          <div
                            className="feedometer-findings-bar feedometer-findings-bar--feed"
                            style={{ width: `${(feedScore / 7) * 100}%` }}
                          >
                            <span>{feedScore.toFixed(1)}</span>
                          </div>
                        </div>
                        <div className="feedometer-findings-bar-track">
                          <div
                            className="feedometer-findings-bar feedometer-findings-bar--baseline"
                            style={{ width: `${(baselineScore / 7) * 100}%` }}
                          >
                            <span>{baselineScore.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="feedometer-study-subsection">
              <h3 className="section-subtitle project-fade-block" ref={fadeInRef}>
                Categorization of User Feedback
              </h3>
              <div className="feedometer-categorization-table-wrapper project-fade-block" ref={fadeInRef}>
                <table className="feedometer-categorization-table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Sub-Category</th>
                      <th className="feedometer-categorization__description-heading">Description</th>
                      <th className="feedometer-categorization__example-heading">Example</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feedbackCategorizationData.map(({ category, subcategories }) =>
                      subcategories.map(({ name, description, example }, index) => (
                        <tr key={`${category}-${name}`}>
                          {index === 0 && (
                            <td rowSpan={subcategories.length} className="feedometer-categorization__category">
                              {renderLabelWithCounts(category)}
                            </td>
                          )}
                          <td className="feedometer-categorization__subcategory">
                            {renderLabelWithCounts(name)}
                          </td>
                          <td className="feedometer-categorization__description">{description}</td>
                          <td className="feedometer-categorization__example">
                            {Array.isArray(example)
                              ? example.map((line, lineIndex) => (
                                  <span key={`${name}-${lineIndex}`}>
                                    {line}
                                    {lineIndex !== example.length - 1 && <br />}
                                  </span>
                                ))
                              : example}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                <p className="feedometer-categorization-caption">
                  Categorization of user feedback at the sentence level. Six predefined categories have 15 subcategories, each with associated descriptions and examples. The number of feedback instances belonging to the Feed-O-Meter condition is indicated by F, and those in the Baseline condition are indicated by B.
                </p>
              </div>
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
