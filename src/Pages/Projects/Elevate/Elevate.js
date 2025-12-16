import { ProjectTemplate } from '../ProjectTemplate';
import { PROJECTS } from '../../../Data/projectsMeta';

export const ElevateProject = () => {
  const projectData = PROJECTS.elevate;

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
          Elevate explores how generative AI can scaffold equitable evaluation practices in graduate
          admissions, tracing how reviewers interpret portfolios, statements, and AI-augmented artifacts.
        </p>
      </section>

      <section className="project-section">
        <h2 className="section-title">Role</h2>
        <p className="section-text">
          Leading mixed-methods studies with admissions committees, prototyping decision-support
          tooling, and shaping responsible AI guidelines for creative programs.
        </p>
      </section>

      <section className="project-section">
        <h2 className="section-title">Highlights</h2>
        <ul className="section-list">
          <li>Mapped pain points in collaborative evaluation workflows across two design schools.</li>
          <li>Co-designed speculative AI interventions to surface hidden applicant signals.</li>
          <li>Preparing a longitudinal field deployment targeting the 2025 admissions cycle.</li>
        </ul>
      </section>
    </ProjectTemplate>
  );
};
