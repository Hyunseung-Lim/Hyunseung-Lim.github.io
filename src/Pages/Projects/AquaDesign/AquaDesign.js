import { ProjectTemplate } from '../ProjectTemplate';
import { PROJECTS } from '../../../Data/projectsMeta';

export const AquaDesignProject = () => {
  const projectData = PROJECTS['aqua-design'];

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
          Aqua Design extends the AQUA initiative by prototyping tangible displays that react to water quality and flow in real time. The project investigates how urban residents can sense micro changes in their hydrological environment through playful material interactions.
        </p>
      </section>

      <section className="project-section">
        <h2 className="section-title">Role</h2>
        <p className="section-text">
          Leading experience design and physical prototyping efforts, including fabrication of modular water-responsive tiles and coordinating participatory design workshops.
        </p>
      </section>

      <section className="project-section">
        <h2 className="section-title">Highlights</h2>
        <ul className="section-list">
          <li>Developed a responsive lighting and vibration system aligned with water quality data streams.</li>
          <li>Hosted co-creation sessions with local communities to refine interaction narratives.</li>
          <li>Preparing an evaluation study focusing on embodied understanding of urban water infrastructures.</li>
        </ul>
      </section>
    </ProjectTemplate>
  );
};
