import { useEffect, useRef, useState } from 'react';
import { ProjectTemplate } from '../ProjectTemplate';
import { useTheme } from '../../../contexts/ThemeContext';
import './Datopia.css';

const RUN_SEQUENCE = [1, 2, 3];
const GLIDE_DURATION = 9; // seconds
const GLIDE_DELAY_STEP = 1.4; // seconds

export const DatopiaProject = () => {
  const projectData = {
    title: "Datopia",
    period: "2022",
    status: "Completed",
    projectType: "Exhibition",
    participants: [
      "Hyunseung Lim",
      "Dasom Choi",
      "Kwangyoung Lee",
      "Taewan Kim",
      "Eunseo Oh",
      "Inhwa Song",
      "Seokyoung Park",
      "Yubin Choi",
      "Hwajung Hong"
    ]
  };

  const [runIndex, setRunIndex] = useState(0);
  const [cycleId, setCycleId] = useState(0);
  const { isDark, setThemeMode } = useTheme();
  const previousThemeRef = useRef(isDark ? 'dark' : 'light');
  const batchSize = RUN_SEQUENCE[runIndex];

  useEffect(() => {
    if (!isDark) {
      setThemeMode('dark');
    }
  }, [isDark, setThemeMode]);

  useEffect(() => {
    return () => {
      if (previousThemeRef.current !== 'dark') {
        setThemeMode(previousThemeRef.current);
      }
    };
  }, [setThemeMode]);

  const handleAnimationCycleEnd = () => {
    setRunIndex(prev => (prev + 1) % RUN_SEQUENCE.length);
    setCycleId(prev => prev + 1);
  };

  return (
    <>
      <ProjectTemplate
        title={projectData.title}
        period={projectData.period}
        participants={projectData.participants}
        status={projectData.status}
        projectType={projectData.projectType}
        bannerImage={`${process.env.PUBLIC_URL}/images/project_1.png`}
        themeMode="dark"
      >
        <div className="datopia-content">
          <div className="project-description">
            <p className="description-text">
              Datopia is a data-based dating service. By analyzing data, it captures everything
              from the preferences you didn't know you had to your minor daily habits. Through this,
              it goes beyond simple encounters to find you a destined partner with whom you can
              maintain a continuous relationship. But can love really be determined solely by data?
            </p>
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
