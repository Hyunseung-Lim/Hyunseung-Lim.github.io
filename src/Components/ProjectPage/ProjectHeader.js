import { ProjectLinks } from '../ProjectLinks/ProjectLinks';
import { ProjectBadge } from './ProjectBadge';
import { ProjectDivider } from './ProjectDivider';
import { assetUrl } from './assetUrl';

const MetaItem = ({ label, value, className, fadeRef }) => (
  <div className={`${className} project-fade-block`} ref={fadeRef}>
    <div className="meta-label">{label}</div>
    <div className="meta-value">{value}</div>
  </div>
);

/**
 * Standard project header: title (or logo), subtitle, Period / Project Type / badge row,
 * resource links, optional extra children, and the header divider.
 *
 * Everything is read from the project meta (src/Data/projectsMeta.js):
 *   title, subtitle | subtitleLines, titleLogo, period, projectType, badge, links
 * `links` / `badge` props override the meta values when given.
 */
export const ProjectHeader = ({
  project,
  fadeRef = null,
  links = project?.links,
  badge = project?.badge,
  withDivider = true,
  children
}) => {
  if (!project) return null;

  const { title, subtitle, subtitleLines, titleLogo, period, projectType } = project;
  const hasSubtitleLines = Array.isArray(subtitleLines) && subtitleLines.length > 0;
  const hasSubtitle = hasSubtitleLines || Boolean(subtitle);
  const hasLinks = Array.isArray(links) && links.length > 0;
  const hasBadge = Array.isArray(badge) ? badge.length > 0 : Boolean(badge);
  const hasMeta = Boolean(period || projectType || hasBadge);

  return (
    <>
      <header className="project-header">
        <div className="project-header__fade-block project-fade-block" ref={fadeRef}>
          {titleLogo ? (
            <div className="project-title-row">
              <h1 className="project-title project-title--sr-only">{title}</h1>
              <img src={assetUrl(titleLogo)} alt={`${title} logo`} className="project-title-logo" />
            </div>
          ) : (
            <h1 className="project-title">{title}</h1>
          )}
          {hasSubtitle && (
            <p className="project-subtitle" aria-label={hasSubtitleLines ? subtitleLines.join(' ') : undefined}>
              {hasSubtitleLines
                ? subtitleLines.map((line, index) => (
                    <span key={index} className="project-subtitle__line">
                      {line}
                    </span>
                  ))
                : subtitle}
            </p>
          )}
        </div>

        {hasMeta && (
          <div className="project-meta-info">
            {period && (
              <MetaItem label="Period" value={period} className="project-period-section" fadeRef={fadeRef} />
            )}
            {projectType && (
              <MetaItem
                label="Project Type"
                value={projectType}
                className="project-type-section"
                fadeRef={fadeRef}
              />
            )}
            {hasBadge && <ProjectBadge badge={badge} fadeRef={fadeRef} />}
          </div>
        )}

        {hasLinks && <ProjectLinks links={links} className="project-fade-block" fadeRef={fadeRef} />}
        {children}
      </header>

      {withDivider && <ProjectDivider variant="header" fadeRef={fadeRef} />}
    </>
  );
};
