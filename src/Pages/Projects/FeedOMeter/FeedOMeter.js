import { ProjectTemplate } from '../ProjectTemplate';
import { PROJECTS } from '../../../Data/projectsMeta';

export const FeedOMeterProject = () => {
  const projectData = PROJECTS['feed-o-meter'];

  return (
    <ProjectTemplate
      title={projectData.title}
      subtitle={projectData.subtitle}
      period={projectData.period}
      participants={projectData.participants}
      status={projectData.status}
      projectType={projectData.projectType}
      highlightParticipants={projectData.highlightParticipants}
      themeMode={projectData.themeMode ?? 'auto'}
    >
      <section className="project-section">
        <h2 className="section-title">Overview</h2>
        <p className="section-text">
          Feed-O-Meter is an interactive research project exploring novel ways to understand and measure feedback dynamics between AI systems and human collaborators.
        </p>
      </section>

      <section className="project-section">
        <h2 className="section-title">Role</h2>
        <p className="section-text">
          Lead design and experimentation on hybrid intelligence workflows.
        </p>
      </section>

      <section className="project-section">
        <h2 className="section-title">Highlights</h2>
        <ul className="section-list">
          <li>Developed a real-time visualization of user feedback loops.</li>
          <li>Conducted preliminary user studies with design researchers.</li>
          <li>Preparing submissions to HCI venues in 2024.</li>
        </ul>
      </section>
    </ProjectTemplate>
  );
};
