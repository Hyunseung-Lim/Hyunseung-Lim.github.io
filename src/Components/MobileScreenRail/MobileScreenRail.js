import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './MobileScreenRail.css';

/**
 * Displays mobile-sized screens inside a horizontally scrollable rail.
 * Each screen can include a text block followed by an image snapshot.
 */
const formatSize = value => (typeof value === 'number' ? `${value}px` : value);
const DRAG_MULTIPLIER = 1.18;
const MOMENTUM_MULTIPLIER = 260;
const MOMENTUM_DAMPING = 0.9;
const MOMENTUM_THRESHOLD = 0.0065;

export const MobileScreenRail = ({
  heading,
  description,
  screens = [],
  cardWidth = 'clamp(240px, 28vw, 360px)',
  desktopCardWidth = 'clamp(220px, 22vw, 320px)',
  cardHeight = 'auto',
  gap = 24,
  showMetadata = true,
  clampToContainer = false
}) => {
  const [isDesktop, setIsDesktop] = useState(() => (typeof window !== 'undefined' ? window.innerWidth >= 992 : false));
  useEffect(() => {
    const handleResize = () => {
      if (typeof window === 'undefined') return;
      setIsDesktop(window.innerWidth >= 992);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeCardWidth = isDesktop ? desktopCardWidth : cardWidth;
  const computedWidth = formatSize(activeCardWidth);
  const computedHeight = formatSize(cardHeight);
  const gapValue = typeof gap === 'number' ? gap : 0;
  const gapCssValue = typeof gap === 'number' ? `${gap}px` : gap;
  const scrollerRef = useRef(null);
  const introRef = useRef(null);
  const [spacers, setSpacers] = useState({ left: 0, right: 0 });

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node) return undefined;

    let isDragging = false;
    let startX = 0;
    let startScrollLeft = 0;
    let pointerId = null;
    let lastX = 0;
    let lastTime = 0;
    let velocity = 0;
    let momentumId = null;

    const cancelMomentum = () => {
      if (momentumId) {
        cancelAnimationFrame(momentumId);
        momentumId = null;
      }
    };

    const startMomentum = currentVelocity => {
      cancelMomentum();
      const boost = 1 + Math.min(Math.abs(currentVelocity), 1) * 0.5;
      let momentum = -currentVelocity * MOMENTUM_MULTIPLIER * boost;
      const step = () => {
        if (Math.abs(momentum) < 0.2) {
          momentumId = null;
          return;
        }
        node.scrollLeft += momentum;
        momentum *= MOMENTUM_DAMPING;
        momentumId = requestAnimationFrame(step);
      };
      step();
    };

    const handlePointerDown = event => {
      const isMouse = event.pointerType === 'mouse';
      if (isMouse && event.button !== 0) {
        return;
      }
      event.preventDefault();
       cancelMomentum();
      isDragging = true;
      pointerId = event.pointerId;
      startX = event.clientX;
      startScrollLeft = node.scrollLeft;
      lastX = event.clientX;
      lastTime = performance.now();
      velocity = 0;
      node.classList.add('mobile-screen-rail__scroller--dragging');
      node.setPointerCapture?.(pointerId);
    };

    const handlePointerMove = event => {
      if (!isDragging) return;
      event.preventDefault();
      const deltaX = event.clientX - startX;
      node.scrollLeft = startScrollLeft - deltaX * DRAG_MULTIPLIER;
      const now = performance.now();
      const dt = Math.max(now - lastTime, 16);
      velocity = ((event.clientX - lastX) * DRAG_MULTIPLIER) / dt;
      lastX = event.clientX;
      lastTime = now;
    };

    const endDrag = event => {
      if (!isDragging) return;
      isDragging = false;
      if (pointerId !== null) {
        try {
          node.releasePointerCapture?.(pointerId);
        } catch (err) {
          // ignore pointer errors
        }
        pointerId = null;
      }
      node.classList.remove('mobile-screen-rail__scroller--dragging');
      if (Math.abs(velocity) > MOMENTUM_THRESHOLD) {
        startMomentum(velocity);
      }
    };

    const handleWheel = event => {
      if (event.ctrlKey) return;
      const hasShift = event.shiftKey;
      let delta = 0;
      if (hasShift) {
        delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      } else if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        delta = event.deltaX;
      }
      if (!delta) return;
      event.preventDefault();
      cancelMomentum();
      node.scrollBy({ left: delta });
    };

    node.addEventListener('pointerdown', handlePointerDown);
    node.addEventListener('pointermove', handlePointerMove);
    node.addEventListener('pointerup', endDrag);
    node.addEventListener('pointerleave', endDrag);
    node.addEventListener('pointercancel', endDrag);
    node.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      node.removeEventListener('pointerdown', handlePointerDown);
      node.removeEventListener('pointermove', handlePointerMove);
      node.removeEventListener('pointerup', endDrag);
      node.removeEventListener('pointerleave', endDrag);
      node.removeEventListener('pointercancel', endDrag);
      node.removeEventListener('wheel', handleWheel);
      cancelMomentum();
    };
  }, []);

  const computeSpacers = useCallback(() => {
    const scroller = scrollerRef.current;
    const intro = introRef.current;
    if (!scroller || !intro) return null;
    const anchor =
      intro.closest('.project-container') ||
      intro.closest('.project-content') ||
      intro;
    const anchorRect = anchor.getBoundingClientRect();
    const anchorStyles = window.getComputedStyle(anchor);
    const anchorPadLeft = parseFloat(anchorStyles.paddingLeft) || 0;
    const anchorPadRight = parseFloat(anchorStyles.paddingRight) || 0;

    const scrollerStyles = window.getComputedStyle(scroller);
    const scrollerPadLeft = parseFloat(scrollerStyles.paddingLeft) || 0;
    const scrollerPadRight = parseFloat(scrollerStyles.paddingRight) || 0;

    const cardElement = scroller.querySelector('.mobile-screen-card');
    let cardPadLeft = 0;
    let cardPadRight = 0;
    if (cardElement) {
      const cardStyles = window.getComputedStyle(cardElement);
      cardPadLeft = parseFloat(cardStyles.paddingLeft) || 0;
      cardPadRight = parseFloat(cardStyles.paddingRight) || 0;
    }

    const viewportWidth = window.innerWidth;
    const contentWidth = anchorRect.right - anchorRect.left;
    const gutter = Math.max((viewportWidth - contentWidth) / 2, 0);

    let leftSpacer = Math.max(0, Math.round(gutter + anchorPadLeft - cardPadLeft));
    let rightSpacer = Math.max(0, Math.round(gutter + anchorPadRight - cardPadRight));
    if (gapValue > 0) {
      const trim = gapValue * 2;
      leftSpacer = Math.max(0, leftSpacer - trim);
      rightSpacer = Math.max(0, rightSpacer - trim);
    }
    leftSpacer = Math.max(0, leftSpacer - scrollerPadLeft);
    rightSpacer = Math.max(0, rightSpacer - scrollerPadRight);
    return { left: leftSpacer, right: rightSpacer };
  }, [gapValue]);

  useLayoutEffect(() => {
    const next = computeSpacers();
    if (next) {
      setSpacers(next);
    }
  }, [computeSpacers, screens.length, computedWidth]);
  useEffect(() => {
    const handleResize = () => {
      const scroller = scrollerRef.current;
      if (!scroller) return;
      const next = computeSpacers();
      if (next) {
        setSpacers(next);
      }
      scroller.scrollTo({ left: 0, behavior: 'auto' });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [computeSpacers]);
  const scrollerClassName = clampToContainer
    ? 'mobile-screen-rail__scroller mobile-screen-rail__scroller--clamped'
    : 'mobile-screen-rail__scroller';

  return (
    <section className="mobile-screen-rail">
      {(heading || description) && (
        <div className="mobile-screen-rail__intro" ref={introRef}>
          {heading && <h2 className="mobile-screen-rail__heading">{heading}</h2>}
          {description && <p className="mobile-screen-rail__description">{description}</p>}
        </div>
      )}

      <div className="mobile-screen-rail__track">
        <div
          className={scrollerClassName}
          style={{ '--gap': gapCssValue }}
          ref={scrollerRef}
          role="region"
          aria-label="Mobile screen previews"
        >
          <div
            className="mobile-screen-rail__spacer"
            style={{ flex: `0 0 ${spacers.left}px` }}
            aria-hidden="true"
          />
          {screens.map((screen, index) => {
            const hasCopy = showMetadata && (screen.lead || screen.title || screen.body);
            const applyFixedHeight = cardHeight !== 'auto';
            return (
              <article
                key={`${screen.title ?? 'screen'}-${index}`}
                className={`mobile-screen-card${!hasCopy ? ' mobile-screen-card--media-only' : ''}`}
                style={{
                  flex: `0 0 ${computedWidth}`,
                  ...(applyFixedHeight ? { height: computedHeight } : {})
                }}
              >
                {hasCopy && (
                  <div className="mobile-screen-card__text">
                    {screen.lead && <span className="mobile-screen-card__lead">{screen.lead}</span>}
                    {screen.title && <h3 className="mobile-screen-card__title">{screen.title}</h3>}
                    {screen.body && <p className="mobile-screen-card__body">{screen.body}</p>}
                  </div>
                )}
                <div className="mobile-screen-card__media">
                  <img
                    src={screen.image}
                    alt={screen.alt ?? screen.title ?? 'Mobile screen'}
                    loading="lazy"
                    draggable={false}
                  />
                </div>
              </article>
            );
          })}
          <div
            className="mobile-screen-rail__spacer"
            style={{ flex: `0 0 ${spacers.right}px` }}
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
};

MobileScreenRail.propTypes = {
  heading: PropTypes.string,
  description: PropTypes.string,
  screens: PropTypes.arrayOf(
    PropTypes.shape({
      lead: PropTypes.string,
      title: PropTypes.string,
      body: PropTypes.string,
      image: PropTypes.string.isRequired,
      alt: PropTypes.string
    })
  ),
  cardWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  desktopCardWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  cardHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  gap: PropTypes.number,
  showMetadata: PropTypes.bool,
  clampToContainer: PropTypes.bool
};
