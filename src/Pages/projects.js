import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import '../Components/components.css';
import './pages.css';
import { useFadeInAnimation } from '../hooks/useFadeInAnimation';
import { useTheme } from '../contexts/ThemeContext';
import { PROJECTS, PROJECT_ORDER } from '../Data/projectsMeta';
import { SegmentedControl } from '../Components/SegmentedButton/segmentedbutton';

const MOBILE_BREAKPOINT = 768;
const getIsMobileViewport = () =>
  typeof window !== 'undefined' ? window.innerWidth <= MOBILE_BREAKPOINT : false;
const DIAGRAM_PLACEMENT = {
  datopia: { column: 2, row: 1 },
  brownie: { column: 3, row: 1 },
  elevate: { column: 2, row: 2 },
  'aqua-design': { column: 3, row: 2 },
  crafteam: { column: 5, row: 1 },
  'feed-o-meter': { column: 5, row: 2 },
  panorama: { column: 7, row: 1 },
  stereohunter: { column: 8, row: 1 },
  aqua: { column: 7, row: 2, colSpan: 2 }
};
const DIAGRAM_VIEWBOX = { width: 2400, height: 1200 };
const DIAGRAM_ELLIPSES = {
  left: { cx: 800, cy: 600, rx: 680, ry: 480 },
  right: { cx: 1600, cy: 600, rx: 680, ry: 480 }
};
const DIAGRAM_LABEL_OFFSET_REM = 1.6;
const formatPercent = (ratio) => `${(ratio * 100).toFixed(2)}%`;
const getLabelStyle = (ellipse) => ({
  left: `${((ellipse.cx / DIAGRAM_VIEWBOX.width) * 100).toFixed(2)}%`,
  top: `calc(${formatPercent((ellipse.cy - ellipse.ry) / DIAGRAM_VIEWBOX.height)} - ${
    DIAGRAM_LABEL_OFFSET_REM
  }rem)`
});

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
  const [scrollContainer, setScrollContainer] = useState(null);
  const [isMobileViewport, setIsMobileViewport] = useState(getIsMobileViewport);
  const [layoutMode, setLayoutMode] = useState(() => (getIsMobileViewport() ? 'grid' : 'diagram'));
  const tileRefs = useRef(new Map());
  const tilePositionsRef = useRef(new Map());
  const fadeInRef = useFadeInAnimation({
    threshold: 0.1,
    root: scrollContainer
  });
  const handleScrollContainerRef = useCallback((node) => {
    setScrollContainer(node);
  }, []);
  const { isDark } = useTheme();
  const layoutSegments = useMemo(
    () => [
      { label: 'Diagram', value: 'diagram' },
      { label: 'Grid', value: 'grid' }
    ],
    []
  );

  const handleLayoutModeChange = (mode) => {
    setLayoutMode(mode);
  };

  const assignTileRef = useCallback((projectId, node) => {
    if (node) {
      tileRefs.current.set(projectId, node);
    } else {
      tileRefs.current.delete(projectId);
    }
  }, []);

  const resolveProjectMedia = (project) => {
    const iconPath = isDark && project.iconDark ? project.iconDark : project.icon;
    const hoverPath = isDark && project.hoverIconDark ? project.hoverIconDark : project.hoverIcon;
    const iconSrc = `${process.env.PUBLIC_URL}${iconPath}`;
    const hoverSrc = hoverPath ? `${process.env.PUBLIC_URL}${hoverPath}` : null;
    return { iconSrc, hoverSrc };
  };

  const renderProjectTile = (project, { isDiagramLayout }) => {
    const { iconSrc, hoverSrc } = resolveProjectMedia(project);
    const linkTarget = project.href;
    const isExternal = Boolean(project.external);
    const LinkComponent = isExternal ? 'a' : Link;
    const linkProps = isExternal
      ? {
          href: linkTarget,
          target: '_blank',
          rel: 'noopener noreferrer'
        }
      : { to: linkTarget };
    const placement = DIAGRAM_PLACEMENT[project.id];
    const diagramStyle =
      isDiagramLayout && placement
        ? {
            gridColumn: placement.colSpan
              ? `${placement.column} / span ${placement.colSpan}`
              : `${placement.column}`,
            gridRow: placement.rowSpan
              ? `${placement.row} / span ${placement.rowSpan}`
              : `${placement.row}`
          }
        : undefined;

    return (
      <div
        className={`project-tile${isDiagramLayout ? ' project-tile--diagram' : ''}`}
        key={project.id}
        style={diagramStyle}
        ref={(node) => assignTileRef(project.id, node)}
      >
        <div className="project-tile__fade-wrapper" ref={fadeInRef}>
          <LinkComponent
            {...linkProps}
            className="project-tile__link"
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
          </LinkComponent>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }
    const handleResize = () => {
      setIsMobileViewport(getIsMobileViewport());
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useLayoutEffect(() => {
    if (isMobileViewport && layoutMode !== 'grid') {
      setLayoutMode('grid');
    }
  }, [isMobileViewport, layoutMode]);

  useEffect(() => () => {
    tileRefs.current.clear();
    tilePositionsRef.current.clear();
  }, []);

  const shouldUseDiagramLayout = !isMobileViewport && layoutMode === 'diagram';
  useLayoutEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const newPositions = new Map();
    tileRefs.current.forEach((node, projectId) => {
      if (!node) {
        return;
      }

      const rect = node.getBoundingClientRect();
      newPositions.set(projectId, rect);
      const previousRect = tilePositionsRef.current.get(projectId);
      if (!previousRect) {
        return;
      }

      const deltaX = previousRect.left - rect.left;
      const deltaY = previousRect.top - rect.top;
      if (deltaX === 0 && deltaY === 0) {
        return;
      }

      node.style.transition = 'none';
      node.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

      requestAnimationFrame(() => {
        node.style.transition = '';
        node.style.transform = '';
      });
    });

    tilePositionsRef.current = newPositions;

    return undefined;
  }, [layoutMode, shouldUseDiagramLayout, isMobileViewport]);

  const tilesClassName = [
    'project-tiles',
    shouldUseDiagramLayout ? 'project-tiles--diagram' : 'project-tiles--grid'
  ]
    .filter(Boolean)
    .join(' ');

  const pageClassName = `page page--projects${
    shouldUseDiagramLayout ? ' page--projects--diagram' : ''
  }`;

  return (
    <div className={pageClassName}>
      <div className={`projects${shouldUseDiagramLayout ? ' projects--diagram' : ''}`}>
        {!isMobileViewport && (
          <div className="projects__layout-toggle" ref={fadeInRef}>
            <SegmentedControl
              name="projects-layout"
              segments={layoutSegments}
              value={layoutMode}
              callback={handleLayoutModeChange}
            />
          </div>
        )}
        <div className={tilesClassName} ref={handleScrollContainerRef} data-layout-mode={layoutMode}>
          {shouldUseDiagramLayout && scrollContainer && (
            <div className="projects-diagram-overlay" aria-hidden="true">
              <svg
                className="projects-diagram-overlay__svg"
                viewBox={`0 0 ${DIAGRAM_VIEWBOX.width} ${DIAGRAM_VIEWBOX.height}`}
                preserveAspectRatio="xMidYMid meet"
                overflow="visible"
                ref={fadeInRef}
              >
                {Object.entries(DIAGRAM_ELLIPSES).map(([key, ellipse]) => (
                  <ellipse
                    key={key}
                    className={`projects-diagram-ellipse projects-diagram-ellipse--${key}`}
                    cx={ellipse.cx}
                    cy={ellipse.cy}
                    rx={ellipse.rx}
                    ry={ellipse.ry}
                  />
                ))}
              </svg>
              <span
                className="projects-diagram-overlay__label projects-diagram-overlay__label--left"
                style={getLabelStyle(DIAGRAM_ELLIPSES.left)}
              >
                <span className="projects-diagram-overlay__label-content" ref={fadeInRef}>
                  Design (+HCI)
                </span>
              </span>
              <span
                className="projects-diagram-overlay__label projects-diagram-overlay__label--right"
                style={getLabelStyle(DIAGRAM_ELLIPSES.right)}
              >
                <span className="projects-diagram-overlay__label-content" ref={fadeInRef}>
                  AI
                </span>
              </span>
            </div>
          )}
          {PROJECT_ORDER.map((projectId) => {
            const project = PROJECTS[projectId];
            if (!project) {
              return null;
            }
            return renderProjectTile(project, { isDiagramLayout: shouldUseDiagramLayout });
          })}
        </div>
      </div>
    </div>
  );
};
