import '../Components/components.css';
import './pages.css';
import { useFadeInAnimation } from '../hooks/useFadeInAnimation';
import { useTheme } from '../contexts/ThemeContext';
import { PROJECTS, PROJECT_ORDER } from '../Data/projectsMeta';

const handleMouseEnter = (event) => {
  const hoverSrc = event.currentTarget.getAttribute('data-hover');
  if (hoverSrc) {
    event.currentTarget.src = hoverSrc;
  }
};

const handleMouseLeave = (event) => {
  const originalSrc = event.currentTarget.getAttribute('data-original');
  if (originalSrc) {
    event.currentTarget.src = originalSrc;
  }
};

export const Projects = () => {
  const fadeInRef = useFadeInAnimation(0.1);
  const { isDark } = useTheme();

  return (
    <div className="page">
      <div className="projects">
        <div className="project-tiles">
          {PROJECT_ORDER.map((projectId) => {
            const project = PROJECTS[projectId];
            if (!project) {
              return null;
            }
            const iconPath = isDark && project.iconDark ? project.iconDark : project.icon;
            const hoverPath = isDark && project.hoverIconDark ? project.hoverIconDark : project.hoverIcon;

            const iconSrc = `${process.env.PUBLIC_URL}${iconPath}`;
            const hoverSrc = hoverPath ? `${process.env.PUBLIC_URL}${hoverPath}` : null;
            const linkTarget = project.href;
            const isExternal = Boolean(project.external);

            return (
              <div className="project-tile" key={project.id} ref={fadeInRef}>
                <a
                  href={linkTarget}
                  className="project-tile__link"
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                >
                  <div className="project-tile__image-container">
                    <img
                      src={iconSrc}
                      data-original={iconSrc}
                      data-hover={hoverSrc || undefined}
                      alt={`${project.title} icon`}
                      className="project-tile__image"
                      loading="lazy"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    />
                  </div>
                  <p className="project-tile__title">
                    {project.title}
                  </p>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
