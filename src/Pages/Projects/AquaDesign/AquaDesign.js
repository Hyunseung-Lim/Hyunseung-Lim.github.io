import { ProjectTemplate } from '../ProjectTemplate';
import { PROJECTS } from '../../../Data/projectsMeta';
import { useTheme } from '../../../contexts/ThemeContext';
import './AquaDesign.css';

export const AquaDesignProject = () => {
  const projectData = PROJECTS['aqua-design'];
  const { isDark } = useTheme();
  const lightBanner = `${process.env.PUBLIC_URL}/projects/aqua-design/thumbnail.png`;
  const darkBanner = `${process.env.PUBLIC_URL}/projects/aqua-design/thumbnail_dark.png`;
  const bannerImage = isDark ? darkBanner : lightBanner;
  const overviewImage = `${process.env.PUBLIC_URL}/projects/aqua-design/img1.png`;

  return (
    <ProjectTemplate
      title={projectData.title}
      subtitle={projectData.subtitle}
      period={projectData.period}
      participants={projectData.participants}
      projectType={projectData.projectType}
      highlightParticipants={projectData.highlightParticipants}
      bannerImage={bannerImage}
      themeMode={projectData.themeMode ?? 'auto'}
    >
      <section className="project-section aqua-design-overview">
        <div className="aqua-design-overview__media">
          <img src={overviewImage} alt="Visualization of AQUA asset management interface" loading="lazy" />
        </div>
        <div className="aqua-design-overview__text">
          <p className="aqua-design-overview__subtitle">People Tend to Associate Money with Purpose</p>
          <p className="aqua-design-overview__content">
            According to behavioural economics, people place different values on money on subjective criteria.
            This called <strong>Mental Accounting</strong>. However, this difference of values is not clearly expressed in traditional
            asset management systems. <strong>AQUA</strong> is asset management system that expresses the different purposes money is associated with.
          </p>
        </div>
      </section>

      <div className="aqua-design-video" role="region" aria-label="AQUA concept walkthrough video">
        <div className="aqua-design-video__frame">
          <iframe
            src="https://www.youtube.com/embed/hctUpCzpNfU?si=0as3GUUX7a9Agss-"
            title="AQUA Design walkthrough"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>

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
