import { ProjectTemplate } from '../ProjectTemplate';
import { PROJECTS } from '../../../Data/projectsMeta';

export const BrownieProject = () => {
  const projectData = PROJECTS.brownie;

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
          Brownie explores how AI can help small bakery teams co-design inclusive dessert offerings by blending customer flavor preferences with nutrition constraints and playfulness.
        </p>
      </section>

      <section className="project-section">
        <h2 className="section-title">Role</h2>
        <p className="section-text">
          Leading interaction design and prototyping of the AI assistant, as well as co-creation workshops with local bakers.
        </p>
      </section>

      <section className="project-section">
        <h2 className="section-title">Highlights</h2>
        <ul className="section-list">
          <li>Developing a conversational recipe ideation workflow that balances creativity with dietary needs.</li>
          <li>Running pilot tasting sessions to iterate on sensory feedback loops.</li>
          <li>Preparing user study protocols for a late-2024 evaluation.</li>
        </ul>
      </section>
    </ProjectTemplate>
  );
};
