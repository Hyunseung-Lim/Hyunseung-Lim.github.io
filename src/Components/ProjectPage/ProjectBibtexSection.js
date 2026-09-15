import { BibtexCard } from '../BibtexCard/BibtexCard';
import { ProjectDivider } from './ProjectDivider';

/**
 * Closing BibTeX block: divider + "BibTeX" title + copyable card.
 */
export const ProjectBibtexSection = ({ text, fadeRef = null, title = 'BibTeX', withDivider = true }) => {
  if (!text) return null;

  return (
    <>
      {withDivider && <ProjectDivider fadeRef={fadeRef} />}
      <section className="project-section project-section--bibtex">
        <h2 className="section-title project-fade-block" ref={fadeRef}>
          {title}
        </h2>
        <BibtexCard ref={fadeRef} className="project-fade-block" text={text} />
      </section>
    </>
  );
};
