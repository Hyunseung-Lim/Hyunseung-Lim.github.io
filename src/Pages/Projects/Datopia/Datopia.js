import { ProjectTemplate } from '../ProjectTemplate';
import './Datopia.css';

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

  return (
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
  );
};