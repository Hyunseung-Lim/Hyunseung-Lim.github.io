import { useMemo, useState } from 'react';
import { Topbar } from '../../Components/Topbar/topbar';
import { Footer } from '../../Components/Footer/footer';
import { useFadeInAnimation } from '../../hooks/useFadeInAnimation';
import { useProjectPageFrame } from '../../hooks/useProjectPageFrame';
import './offRecordBase.css';

export const OffRecordLayout = ({
  pageId,
  title,
  subtitle,
  intro,
  sectionCount = 4,
  themeMode = 'auto',
  children
}) => {
  const [scrollRoot, setScrollRoot] = useState(null);
  const fadeInRef = useFadeInAnimation({ root: scrollRoot });
  const { pageClassName, shouldHideThemeToggle } = useProjectPageFrame(null, themeMode);
  const placeholderAwards = useMemo(() => {
    const baseAwards = [
      { label: 'Best Motion Picture', year: '2025' },
      { label: 'Best Motion Picture', year: '2024' },
      { label: 'Best Motion Picture', year: '2023' },
      { label: 'Best Motion Picture', year: '2022' }
    ];
    if (sectionCount <= baseAwards.length) {
      return baseAwards.slice(0, sectionCount);
    }
    const additional = Array.from({ length: sectionCount - baseAwards.length }, (_, index) => ({
      year: `${2022 - index - 1}`
    }));
    return [...baseAwards, ...additional];
  }, [sectionCount]);

  const resolvedContent = children
    ? typeof children === 'function'
      ? children(fadeInRef)
      : children
    : placeholderAwards.map((award, index) => (
        <section className="project-section off-record-placeholder-section" key={`placeholder-${award.year ?? index}`}>
          <div className="off-record-placeholder-heading project-fade-block" ref={fadeInRef}>
            {award.label && <p className="off-record-placeholder-title">{award.label}</p>}
            <p className="off-record-placeholder-year">{award.year}</p>
          </div>
          <div className="off-record-placeholder-row">
            {Array.from({ length: 3 }).map((_, cardIndex) => (
              <div className="off-record-placeholder-card project-fade-block" ref={fadeInRef} key={cardIndex}>
                <div className="off-record-placeholder-poster" aria-hidden="true" />
                <div className="off-record-placeholder-caption" aria-hidden="true" />
              </div>
            ))}
          </div>
        </section>
      ));

  return (
    <div className={`${pageClassName} project-page--offrecord project-page--offrecord-${pageId}`}>
      <Topbar hideThemeToggle={shouldHideThemeToggle} />
      <div className="project-container" ref={setScrollRoot}>
        <header className="project-header">
          <div className="project-header__fade-block project-fade-block" ref={fadeInRef}>
            <h1 className="project-title">{title}</h1>
            {subtitle && <p className="project-subtitle">{subtitle}</p>}
          </div>
          {intro && (
            <p className="off-record-intro project-fade-block" ref={fadeInRef}>
              {intro}
            </p>
          )}
        </header>

        <div
          className="project-divider project-divider--header project-fade-block"
          role="presentation"
          aria-hidden="true"
          ref={fadeInRef}
        />

        <main className="project-content">
          {resolvedContent}
        </main>
      </div>
      <Footer />
    </div>
  );
};
