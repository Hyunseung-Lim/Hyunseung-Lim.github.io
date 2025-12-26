import { useState } from 'react';
import PropTypes from 'prop-types';

const QA_ITEMS = [
  {
    question: 'What is AQUA?',
    answer: (
      <>
        <p>
          AQUA is a research probe that enables researchers to co-create QA-style articles with LLMs to promote their research papers. It provides an editing space for building card-based QA articles using QA Cards, a visual representation of each QA pair. Its LLM-powered support recommends questions and draft answers to help authors write and refine the article.
        </p>
      </>
    ),
    image: {
      src: `${process.env.PUBLIC_URL}/projects/aqua/aqua_UI.png`,
      alt: 'AQUA overview interface'
    }
  },
  {
    question: 'Why is a QA format suitable for promoting research papers?',
    answer: (
      <>
        <p>
          A QA format works well for promoting research papers for pedagogical, narrative, and communication reasons.
        </p>
        <p>
          <strong>Structuring complex information and building a narrative</strong>
        </p>
        <p>
          A QA format turns dense, technical content into a roadmap: each question acts as a milestone guiding readers
          toward the paper’s key contributions. The back-and-forth structure makes explanations feel more like a narrative
          than a block of facts.
        </p>
        <p>
          <strong>Effective for learning</strong>
        </p>
        <p>
          QA mirrors how many people learn—by asking questions and refining understanding—so readers can follow a clear
          flow from the question to evidence to an answer.
        </p>
        <p>
          <strong>Bridging the gap to the reader’s perspective</strong>
        </p>
        <p>
          Because authors know their work so well, they can underestimate what readers find confusing. A QA structure
          forces authors to anticipate reader questions, leading to clearer wording, less jargon, and more concrete examples.
        </p>
      </>
    )
  },
  {
    question: 'How was the question recommendation feature designed?',
    answer: (
      <>
        <p>AQUA’s question recommendations fall into three types:</p>
        <ul className="aqua-qa-list--compact">
          <li>
            <strong>General questions:</strong> explore core aspects of a research paper (motivation, background, methodology,
            results, applications).
          </li>
          <li>
            <strong>Personalized questions:</strong> tailored to the author, using their research background—such as past
            publications or topics—beyond the paper currently being promoted.
          </li>
          <li>
            <strong>Follow-up questions:</strong> suggest additional questions based on QA pairs already created.
          </li>
        </ul>
      </>
    ),
    image: {
      light: `${process.env.PUBLIC_URL}/projects/aqua/qagen.png`,
      dark: `${process.env.PUBLIC_URL}/projects/aqua/qagen_dark.png`,
      alt: 'AQUA question recommendation interface'
    }
  },
  {
    question: 'How was the answer recommendation feature designed?',
    answer: (
      <>
        <p>
          The answer recommendation feature is designed to generate high-quality, paper-grounded responses. It uses a
          Flan-T5-3B model configured with QASA settings for scientific QA, and it produces answers based directly on
          the text of the target research paper being promoted so the generated content stays aligned with the paper’s key
          information.
        </p>
        <p>
          <strong>Key interactions</strong>
        </p>
        <ul>
          <li>
            <strong>Auto-generation:</strong> as soon as a user adds a question in the QA Editing Space, the system generates and shows a draft answer.
          </li>
          <li>
            <strong>Regenerate answer:</strong> users can click “Regenerate Answer” to request a new draft.
          </li>
          <li>
            <strong>Human editing:</strong> researchers can revise or expand the text to reflect their own intent and tone.
          </li>
        </ul>
      </>
    )
  },
  {
    question: 'What were the key findings?',
    answer: (
      <>
        <p>
          The authors reported that AQUA reduced the burden of getting started with writing and helped researchers better
          understand readers’ perspectives. However,{' '}
          <span className="aqua-qa-highlight">the LLM did not fully capture each author’s unique intent</span>. Also, authors
          often did not revise the auto-generated answers enough, which tended to lead to more passive participation.
        </p>
      </>
    )
  },
  {
    question: 'What motivated this research?',
    answer: (
      <>
        <p>
          It started from a simple question:{' '}
          <span style={{ fontWeight: 600 }}>
            "How can we communicate professional research outcomes more effectively and engagingly to the public or to
            researchers in other fields?"
          </span>{' '}
          <br /> Promoting research matters because it helps increase
          academic visibility and can spark interdisciplinary collaboration, but it also demands two different writing skills
          at once—scientific writing that conveys facts accurately and creative writing that turns expert knowledge into an
          accessible, engaging narrative for non-expert readers. Most researchers find it difficult to balance these two.
        </p>
      </>
    )
  },
  {
    question: 'What is the significance of this work?',
    answer: (
      <>
        <p>
          This research began in 2023 and was published at DIS in July 2024. Today, various services that read and explain
          papers (e.g., NotebookLM) are being developed and widely used. Our work was an early attempt at exploring how LLMs
          could support this kind of research communication, and we hope it helped lay some groundwork for later systems.
        </p>
      </>
    )
  }
];

export const QAContainer = ({ fadeRef, isDark }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleIndex = index => {
    setExpandedIndex(prev => (prev === index ? null : index));
  };

  const handleKeyDown = (event, index) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleIndex(index);
    }
  };

  return (
    <div className="aqua-qa-container">
      {QA_ITEMS.map((item, index) => {
        const isExpanded = expandedIndex === index;
        const answerId = `aqua-qa-answer-${index}`;
        return (
          <div key={item.question} className={`aqua-qa-item${isExpanded ? ' is-expanded' : ''}`}>
            <div
              className="aqua-qa-item__inner project-fade-block"
              ref={fadeRef}
              role="button"
              tabIndex={0}
              aria-expanded={isExpanded}
              aria-controls={answerId}
              onClick={() => toggleIndex(index)}
              onKeyDown={event => handleKeyDown(event, index)}
            >
              <div className="aqua-qa-question">
                <span>{item.question}</span>
                <span className="aqua-qa-icon" aria-hidden="true">
                  <img
                    src={`${process.env.PUBLIC_URL}/icons/togglebtn.svg`}
                    alt=""
                    className="aqua-qa-icon__image"
                    loading="lazy"
                  />
                </span>
              </div>
              <div className="aqua-qa-answer" id={answerId} aria-hidden={!isExpanded}>
                <div className="aqua-qa-answer__body">
                  {item.answer}
                  {item.image && (
                    <div className="aqua-qa-image">
                      <img
                        src={item.image.src ?? (isDark ? item.image.dark : item.image.light)}
                        alt={item.image.alt}
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

QAContainer.propTypes = {
  fadeRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.instanceOf(Element) })]),
  isDark: PropTypes.bool
};
