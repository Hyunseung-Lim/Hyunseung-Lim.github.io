import { useState } from 'react';
import { ProjectTemplate } from '../ProjectTemplate';
import { PROJECTS } from '../../../Data/projectsMeta';
import './Datopia.css';

const RUN_SEQUENCE = [1, 2, 3];
const GLIDE_DURATION = 9; // seconds
const GLIDE_DELAY_STEP = 1.4; // seconds

export const DatopiaProject = () => {
  const projectData = PROJECTS['datopia'];

  const [runIndex, setRunIndex] = useState(0);
  const [cycleId, setCycleId] = useState(0);
  const batchSize = RUN_SEQUENCE[runIndex];

  const handleAnimationCycleEnd = () => {
    setRunIndex(prev => (prev + 1) % RUN_SEQUENCE.length);
    setCycleId(prev => prev + 1);
  };

  return (
    <>
      <ProjectTemplate
        title={projectData.title}
        subtitle={projectData.subtitle}
        period={projectData.period}
        participants={projectData.participants}
        projectType={projectData.projectType}
        bannerImage={`${process.env.PUBLIC_URL}/images/project_1.png`}
        highlightParticipants={projectData.highlightParticipants}
        themeMode={projectData.themeMode ?? 'auto'}
      >
        <div className="datopia-content">
          <div className="project-description">
            <p className="description-text">
              Datopia is a data-based dating service. By analyzing data, it captures everything
              from the preferences you didn't know you had to your minor daily habits. Through this,
              it goes beyond simple encounters to find you a destined partner with whom you can
              maintain a continuous relationship.{' '}
              <span className="datopia-highlight">
                But can love really be determined solely by data?
              </span>
            </p>
          </div>
          <div className="datopia-media">
            <div className="datopia-media__frame" role="region" aria-label="Datopia showcase video">
              <iframe
                src="https://www.youtube.com/embed/2mOZOPmv0KI?rel=0"
                title="Datopia Exhibition Walkthrough"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <div className="datopia-divider" role="presentation" aria-hidden="true" />
            <div className="datopia-figures">
              {[
                {
                  src: `${process.env.PUBLIC_URL}/projects/datopia/datopia_fig1.png`,
                  alt: 'Datopia interface detail'
                },
                {
                  src: `${process.env.PUBLIC_URL}/projects/datopia/datopia_fig2.png`,
                  alt: 'Datopia exhibition interaction'
                }
              ].map((figure, index) => (
                <img
                  key={index}
                  src={figure.src}
                  alt={figure.alt}
                  className="datopia-figure"
                  loading="lazy"
                />
              ))}
            </div>
            <div className="datopia-divider" role="presentation" aria-hidden="true" />
          </div>
        </div>
      </ProjectTemplate>

      <div className="datopia-animation" key={cycleId}>
        {Array.from({ length: batchSize }).map((_, index) => (
          <img
            key={`${cycleId}-${index}`}
            src={`${process.env.PUBLIC_URL}/projects/datopia/dato2.gif`}
            alt="Datopia animation"
            className="datopia-animation__sprite"
            style={{
              animationDelay: `${index * GLIDE_DELAY_STEP}s`,
              animationDuration: `${GLIDE_DURATION}s`
            }}
            onAnimationEnd={
              index === batchSize - 1 ? handleAnimationCycleEnd : undefined
            }
          />
        ))}
      </div>
    </>
  );
};
