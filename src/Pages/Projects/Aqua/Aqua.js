import { ProjectTemplate } from '../ProjectTemplate';
import { PROJECTS } from '../../../Data/projectsMeta';

export const AquaProject = () => {
  const projectData = PROJECTS.aqua;

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
          AQUA investigates symbiotic relationships between urban residents and water systems through playful, data-driven installations that surface hidden infrastructures.
        </p>
      </section>

      <section className="project-section">
        <h2 className="section-title">Role</h2>
        <p className="section-text">
          Directed concept development, data storytelling, and interactive fabrication with a cross-disciplinary team of designers and engineers.
        </p>
      </section>

      <section className="project-section">
        <h2 className="section-title">Highlights</h2>
        <ul className="section-list">
          <li>Installed a responsive fountain that adapts to community usage.</li>
          <li>Co-designed participatory workshops with local residents.</li>
          <li>Produced an open-source toolkit for water-sensing prototypes.</li>
        </ul>
      </section>
    </ProjectTemplate>
  );
};
