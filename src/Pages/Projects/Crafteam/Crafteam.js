import { ProjectTemplate } from '../ProjectTemplate';
import { PROJECTS } from '../../../Data/projectsMeta';

export const CrafteamProject = () => {
  const projectData = PROJECTS.crafteam;

  return (
    <ProjectTemplate
      title={projectData.title}
      subtitle={projectData.subtitle}
      period={projectData.period}
      participants={projectData.participants}
      projectType={projectData.projectType}
      highlightParticipants={projectData.highlightParticipants}
      themeMode={projectData.themeMode ?? 'auto'}
    >
      <section className="project-section">
        <h2 className="section-title">Overview</h2>
        <p className="section-text">
          Crafteam explores collaborative maker experiences where AI helps small teams ideate, iterate, and fabricate interactive prototypes rapidly.
        </p>
      </section>

      <section className="project-section">
        <h2 className="section-title">Role</h2>
        <p className="section-text">
          Led interaction design, built software tooling, and coordinated workshop facilitation with interdisciplinary participants.
        </p>
      </section>

      <section className="project-section">
        <h2 className="section-title">Highlights</h2>
        <ul className="section-list">
          <li>Prototyped AI-augmented guidance for novice makers.</li>
          <li>Delivered hands-on sessions across three universities.</li>
          <li>Documented learnings for future HCI education research.</li>
        </ul>
      </section>
    </ProjectTemplate>
  );
};
