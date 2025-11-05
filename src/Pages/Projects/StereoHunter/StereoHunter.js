import { ProjectTemplate } from '../ProjectTemplate';
import { PROJECTS } from '../../../Data/projectsMeta';

export const StereoHunterProject = () => {
  const projectData = PROJECTS.stereohunter;

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
          StereoHunter investigates how design practitioners surface, interrogate, and mitigate
          stereotypical responses when collaborating with large language models during early-stage
          concept work.
        </p>
      </section>

      <section className="project-section">
        <h2 className="section-title">Role</h2>
        <p className="section-text">
          Leading study design, facilitating co-analysis workshops, and prototyping interactive
          bias-spotting aids that integrate with existing creative tools.
        </p>
      </section>

      <section className="project-section">
        <h2 className="section-title">Highlights</h2>
        <ul className="section-list">
          <li>Ran collaborative critique sessions across design studios to catalogue stereotype signals.</li>
          <li>Built lightweight LLM probes that visualize how prompt phrasing shifts perceived bias.</li>
          <li>Drafting guidelines to help hybrid teams negotiate bias remediation strategies.</li>
        </ul>
      </section>
    </ProjectTemplate>
  );
};
