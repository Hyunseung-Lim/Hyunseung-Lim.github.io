import React, { useEffect, useMemo, useState } from 'react';
import '../Components/components.css';
import { useFadeInAnimation } from '../hooks/useFadeInAnimation';
import { useTheme } from '../contexts/ThemeContext';
import { Topbar } from '../Components/Topbar/topbar';

const TAGLINE_PART_ONE = 'A Design';
const TAGLINE_PART_TWO = 'AI Researcher';

const renderAnimatedText = (text) =>
  text.split('').map((char, index) => (
    <span key={`${text}-${index}`} className="about-tagline__char-wrapper">
      <span className="about-tagline__char">{char === ' ' ? '\u00A0' : char}</span>
    </span>
  ));

export const About = () => {
  const [scrollRoot, setScrollRoot] = useState(null);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const fadeInRef = useFadeInAnimation({ root: scrollRoot });
  const { isDark } = useTheme();
  const crossIconSrc = isDark ? '/icons/x_dark.svg' : '/icons/x.svg';

  const contactButtons = useMemo(
    () => [
      { label: 'Mail', href: 'mailto:charlie9807@kaist.ac.kr' },
      { label: 'Scholar', href: 'https://scholar.google.com/citations?user=3h9XkqYAAAAJ&hl=ko' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/hyunseung-lim-135742282/' },
      {
        label: 'CV',
        href: 'https://docs.google.com/document/d/1dle6va3bvxmO2E8v3EIhcINzGWvdq5i1l27-Rz4rwsI/edit?usp=sharing'
      }
    ],
    []
  );

  const researchColumns = useMemo(
    () => [
      {
        title: 'AI for Design',
        body:
          'I explore how AI can support designers and the design process. Moving beyond generating artifacts, I study how generative AI can support designers’ thinking and decision-making across the design process,',
        bodyExtra: ' including problem framing, ideation, exploration, and evaluation.',
        links: [
          { label: 'Feed-O-Meter', href: '#/projects/feed-o-meter' },
          { label: 'CrafTeam', href: '#/projects/crafteam' }
        ]
      },
      {
        title: 'Design for AI',
        body:
          'Grounded in human-centered design, I examine how AI can be developed and used in ways that align with people. I apply design methods to build datasets for improving and evaluating AI systems,',
        bodyExtra: ' and to investigate the human-centered considerations required for LLMs.',
        links: [
          { label: 'PANORAMA', href: '#/projects/panorama' },
          { label: 'StereoHunter', href: '#/projects/stereohunter' }
        ]
      }
    ],
    []
  );

  const [crossRotation, setCrossRotation] = useState(0);

  useEffect(() => {
    setCrossRotation(45);
    const interval = setInterval(() => {
      setCrossRotation((prev) => prev + 45);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const setAppHeight = () => {
      const height = window.innerHeight;
      document.documentElement.style.setProperty('--app-height', `${height}px`);
    };

    setAppHeight();
    window.addEventListener('resize', setAppHeight);
    return () => window.removeEventListener('resize', setAppHeight);
  }, []);

  useEffect(() => {
    document.body.classList.add('about-scroll-snapping');
    return () => {
      document.body.classList.remove('about-scroll-snapping');
    };
  }, []);

  const firstTagline = renderAnimatedText(TAGLINE_PART_ONE);
  const secondTagline = renderAnimatedText(TAGLINE_PART_TWO);

  useEffect(() => {
    const node = scrollRoot;
    if (!node) {
      return undefined;
    }

    const sections = Array.from(node.querySelectorAll('.about-section'));
    if (sections.length === 0) {
      return undefined;
    }

    const normalizeDelta = (event) => {
      if (event.deltaMode === 1) {
        return event.deltaY * 16;
      }
      if (event.deltaMode === 2) {
        return event.deltaY * window.innerHeight;
      }
      return event.deltaY;
    };

    const ANIMATION_DURATION_MS = 2800;
    const easingCurve = (t) => {
      const quickStart = Math.pow(t, 0.42); // stronger boost right away
      return 1 - Math.pow(1 - quickStart, 2.2); // slightly softer cap to keep mid-speed low
    };
    let animationFrame = null;
    let animationStart = null;
    let animationFrom = node.scrollTop;
    let animationTo = node.scrollTop;
    let currentIndex = 0;

    const cancelAnimation = () => {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
      animationStart = null;
    };

    const updateCurrentIndex = () => {
      const currentScroll = node.scrollTop;
      let closestIndex = 0;
      let smallestDistance = Number.POSITIVE_INFINITY;
      sections.forEach((section, index) => {
        const offset = section.offsetTop;
        const distance = Math.abs(offset - currentScroll);
        if (distance < smallestDistance) {
          smallestDistance = distance;
          closestIndex = index;
        }
      });
      currentIndex = closestIndex;
    };

    const animateScroll = (timestamp) => {
      if (animationStart === null) {
        animationStart = timestamp;
      }
      const elapsed = timestamp - animationStart;
      const progress = Math.min(elapsed / ANIMATION_DURATION_MS, 1);
      const easedProgress = easingCurve(progress);
      const nextScrollTop = animationFrom + (animationTo - animationFrom) * easedProgress;
      node.scrollTop = nextScrollTop;

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animateScroll);
      } else {
        cancelAnimation();
        animationFrom = node.scrollTop;
        updateCurrentIndex();
      }
    };

    const scrollToSection = (index) => {
      const targetIndex = Math.max(0, Math.min(index, sections.length - 1));
      const section = sections[targetIndex];
      if (!section) {
        return;
      }
      const nextTarget = section.offsetTop;
      if (Math.abs(nextTarget - node.scrollTop) < 1) {
        return;
      }
      cancelAnimation();
      animationFrom = node.scrollTop;
      animationTo = nextTarget;
      animationFrame = requestAnimationFrame(animateScroll);
    };

    const handleWheel = (event) => {
      if (event.ctrlKey) {
        return;
      }
      const normalizedDelta = normalizeDelta(event);
      if (normalizedDelta === 0) {
        return;
      }
      event.preventDefault();
      cancelAnimation();
      updateCurrentIndex();
      const direction = normalizedDelta > 0 ? 1 : -1;
      const nextIndex = currentIndex + direction;
      if (nextIndex < 0 || nextIndex >= sections.length) {
        return;
      }
      currentIndex = nextIndex;
      scrollToSection(currentIndex);
    };

    const handleScroll = () => {
      updateCurrentIndex();
      setShowScrollHint(node.scrollTop < 10);
    };

    updateCurrentIndex();
    setShowScrollHint(node.scrollTop < 10);
    node.addEventListener('wheel', handleWheel, { passive: false });
    node.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      cancelAnimation();
      node.removeEventListener('wheel', handleWheel);
      node.removeEventListener('scroll', handleScroll);
    };
  }, [scrollRoot]);

  return (
    <>
      <Topbar />
      <main className="about-page" ref={setScrollRoot}>
        <section className="about-section about-section--hero">
          <div className="about about-hero">
            <div className="about-mask about-mask--tagline" ref={fadeInRef}>
              <p className="about-tagline">
                <span className="about-tagline__line">{firstTagline}</span>
                <span className="about-tagline__char-wrapper about-tagline__char-wrapper--icon">
                  <span className="about-tagline__char about-tagline__char--icon">
                    <span
                      className="about-tagline__icon"
                      aria-hidden="true"
                      style={{ transform: `rotate(${crossRotation}deg)` }}
                    >
                      <img src={crossIconSrc} alt="" />
                    </span>
                  </span>
                </span>
                <span className="about-tagline__line about-tagline__line--secondary">{secondTagline}</span>
              </p>
            </div>

            <div className="about-photo about-fade-block" ref={fadeInRef} style={{ '--about-fade-delay': '0.5s' }}>
              <img src={'images/photo.png'} alt="Hyunseung Lim" />
            </div>

            <p className="about-name about-fade-block" ref={fadeInRef} style={{ '--about-fade-delay': '0.75s' }}>
              Hyunseung Lim
            </p>

            <p
              className="about-description about-fade-block"
              ref={fadeInRef}
              style={{ '--about-fade-delay': '1.05s' }}
            >
              Hello! I am a fourth-year PhD candidate in the Department of Industrial Design at KAIST.
              <br />
              I am working with{' '}
              <a
                className="about-link"
                href="https://galaxytourist.notion.site/galaxytourist/Hwajung-Hong-cc10b0291bbe4ca38dbf4882cd687423"
              >
                Prof. Hwajung Hong
              </a>{' '}
              at{' '}
              <a className="about-link" href="https://dxd-lab.github.io/">
                DxD Lab
              </a>
              .
            </p>

            <div className="about-contact-buttons about-fade-block" ref={fadeInRef} style={{ '--about-fade-delay': '1.35s' }}>
              {contactButtons.map(({ label, href }) =>
                href ? (
                  <a
                    key={label}
                    href={href}
                    className="about-contact-button"
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noreferrer' : undefined}
                  >
                    {label}
                  </a>
                ) : (
                  <button key={label} type="button" className="about-contact-button">
                    {label}
                  </button>
                )
              )}
            </div>
            {showScrollHint && (
              <button
                className="about-scroll-hint"
                type="button"
                onClick={() => {
                  if (!scrollRoot) {
                    return;
                  }
                  const sections = scrollRoot.querySelectorAll('.about-section');
                  if (sections.length < 2) {
                    return;
                  }
                  scrollRoot.scrollTo({
                    top: sections[1].offsetTop,
                    behavior: 'smooth'
                  });
                }}
                aria-label="Scroll to next section"
              >
                <img src="icons/togglebtn.svg" alt="" aria-hidden="true" />
              </button>
            )}
          </div>
        </section>

        <section className="about-section about-section--research">
            <div className="about-research-wrapper">
              <div className="about-research">
                <div
                  className="about-research-intro-block about-fade-block"
                  ref={fadeInRef}
                style={{ '--about-fade-delay': '0.45s' }}
                >
                <p className="about-research-subheading about-research-subheading--intro">
                  Research Interest
                </p>
                <p className="about-research-intro">
                  I am a{' '}
                  <span className="about-hci-text about-hci-text--full">
                    Human–Computer Interaction (HCI)
                  </span>
                  <span className="about-hci-text about-hci-text--compact">HCI</span>{' '}
                  researcher with an interdisciplinary background in Industrial Design and Computer Science. My research explores how design and AI can mutually shape and strengthen one another.
                </p>
              </div>
                <div
                  className="about-research-columns about-fade-block"
                  ref={fadeInRef}
                style={{ '--about-fade-delay': '0.75s' }}
                >
                  {researchColumns.map((column, index) => {
                    const baseDelay = 0.8 + index * 0.3;
                    return (
                      <div
                        key={column.title}
                        className="about-research-column about-fade-block"
                        ref={fadeInRef}
                        style={{ '--about-fade-delay': `${baseDelay}s` }}
                      >
                      <p
                        className="about-research-title"
                        style={{ '--about-fade-delay': `${baseDelay}s` }}
                      >
                        {column.title}
                      </p>
                      <p
                        className="about-research-text"
                        style={{ '--about-fade-delay': `${baseDelay + 0.2}s` }}
                      >
                        {column.body}
                        {column.bodyExtra && (
                          <span className="about-research-text__extra about-research-text__extra--hide-mobile">
                            {column.bodyExtra}
                          </span>
                        )}
                      </p>
                      <p
                        className="about-research-subheading"
                        style={{ '--about-fade-delay': `${baseDelay + 0.4}s` }}
                      >
                        Selected Projects
                      </p>
                      <div
                        className="about-contact-buttons about-contact-buttons--inline"
                        style={{ '--about-fade-delay': `${baseDelay + 0.6}s` }}
                      >
                        {column.links.map((link, linkIndex) => (
                          <a
                            key={link.label}
                            href={link.href}
                            className="about-contact-button"
                          style={{ '--about-fade-delay': `${baseDelay + 0.65 + linkIndex * 0.09}s` }}
                          >
                            {link.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};
