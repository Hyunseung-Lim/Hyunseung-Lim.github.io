import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import '../Components/components.css';
import { useFadeInAnimation } from '../hooks/useFadeInAnimation';
import { useTheme } from '../contexts/ThemeContext';
import { Topbar } from '../Components/Topbar/topbar';
import { PageLoadGuard } from '../Components/PageLoader/PageLoadGuard';

const TAGLINE_PART_ONE = 'A Design';
const TAGLINE_PART_TWO = 'AI Researcher';
const ABOUT_PAGE_ASSETS = [
  'images/photo.png',
  '/icons/x.svg',
  '/icons/x_dark.svg',
  '/icons/togglebtn.svg',
  '/icons/togglebtn_dark.svg'
];

const renderAnimatedText = (text) =>
  text.split('').map((char, index) => (
    <span key={`${text}-${index}`} className="about-tagline__char-wrapper">
      <span className="about-tagline__char">{char === ' ' ? '\u00A0' : char}</span>
    </span>
  ));

export const About = () => {
  const [scrollRoot, setScrollRoot] = useState(null);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [pendingUpdateTag, setPendingUpdateTag] = useState(null);
  const fadeInRef = useFadeInAnimation({ root: scrollRoot });
  const { isDark } = useTheme();
  const crossIconSrc = isDark ? '/icons/x_dark.svg' : '/icons/x.svg';
  const toggleIconSrc = isDark ? '/icons/togglebtn_dark.svg' : '/icons/togglebtn.svg';
  const updateHintTimeoutRef = useRef(null);

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
        linksLabel: 'Selected Projects',
        links: [
          { label: 'Feed-O-Meter', href: '/projects/feed-o-meter' },
          { label: 'CrafTeam', href: '/projects/crafteam' }
        ]
      },
      {
        title: 'Design for AI',
        body:
          'Grounded in human-centered design, I examine how AI can be developed and used in ways that align with people. I apply design methods to build datasets for improving and evaluating AI systems,',
        bodyExtra: ' and to investigate the human-centered considerations required for LLMs.',
        linksLabel: 'Selected Projects',
        links: [
          { label: 'PANORAMA', href: '/projects/panorama' },
          { label: 'StereoHunter', href: '/projects/stereohunter' }
        ]
      }
    ],
    []
  );

  const offRecordTags = useMemo(
    () => [
      { label: 'MOVIE', href: '/off-records/movie' },
      { label: 'WRITING', href: '/off-records/writing' },
      { label: 'FASHION', href: '/off-records/fashion' },
      { label: 'COOK', href: '/off-records/cook' },
      { label: 'HIP-HOP', href: '/off-records/hip-hop' },
      { label: 'PENGUIN', href: '/off-records/penguin' }
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

  useEffect(() => () => {
    if (updateHintTimeoutRef.current) {
      clearTimeout(updateHintTimeoutRef.current);
    }
  }, []);

  const scrollToSectionIndex = useCallback(
    (index) => {
      if (!scrollRoot) {
        return;
      }
      const sections = scrollRoot.querySelectorAll('.about-section');
      if (sections.length <= index) {
        return;
      }
      const target = sections[index];
      scrollRoot.scrollTo({
        top: target.offsetTop,
        behavior: 'smooth'
      });
    },
    [scrollRoot]
  );

  const firstTagline = renderAnimatedText(TAGLINE_PART_ONE);
  const secondTagline = renderAnimatedText(TAGLINE_PART_TWO);

  const handleOffRecordTagClick = useCallback((label) => {
    if (updateHintTimeoutRef.current) {
      clearTimeout(updateHintTimeoutRef.current);
    }
    setPendingUpdateTag(label);
    updateHintTimeoutRef.current = setTimeout(() => {
      setPendingUpdateTag(null);
      updateHintTimeoutRef.current = null;
    }, 1000);
  }, []);

  useEffect(() => {
    const node = scrollRoot;
    if (!node) {
      return undefined;
    }

    const getSections = () => Array.from(node.querySelectorAll('.about-section'));

    const updateCurrentIndex = () => {
      const sections = getSections();
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
      setCurrentSectionIndex(closestIndex);
    };

    let frame = null;
    const handleScroll = () => {
      if (frame) {
        cancelAnimationFrame(frame);
      }
      frame = requestAnimationFrame(() => {
        updateCurrentIndex();
        setShowScrollHint(node.scrollTop < 10);
      });
    };

    updateCurrentIndex();
    setShowScrollHint(node.scrollTop < 10);
    node.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (frame) {
        cancelAnimationFrame(frame);
      }
      node.removeEventListener('scroll', handleScroll);
    };
  }, [scrollRoot]);

  return (
    <PageLoadGuard assets={ABOUT_PAGE_ASSETS}>
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
            {currentSectionIndex === 0 && showScrollHint && (
              <button
                className="about-scroll-hint"
                type="button"
                onClick={() => scrollToSectionIndex(1)}
                aria-label="Scroll to next section"
              >
                <img src={toggleIconSrc} alt="" aria-hidden="true" />
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
                    const linkBaseDelay = baseDelay + 0.4;
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
                      {column.links?.length ? (
                        <>
                          <p
                            className="about-research-subheading"
                            style={{ '--about-fade-delay': `${linkBaseDelay}s` }}
                          >
                            {column.linksLabel ?? 'Selected Links'}
                          </p>
                          <div
                            className="about-contact-buttons about-contact-buttons--inline"
                            style={{ '--about-fade-delay': `${linkBaseDelay + 0.2}s` }}
                          >
                            {column.links.map((link, linkIndex) => {
                              const delayStyle = { '--about-fade-delay': `${linkBaseDelay + 0.25 + linkIndex * 0.09}s` };
                              if (link.href?.startsWith('/')) {
                                return (
                                  <Link
                                    key={link.label}
                                    to={link.href}
                                    className="about-contact-button"
                                    style={delayStyle}
                                  >
                                    {link.label}
                                  </Link>
                                );
                              }
                              return (
                                <a
                                  key={link.label}
                                  href={link.href}
                                  className="about-contact-button"
                                  style={delayStyle}
                                >
                                  {link.label}
                                </a>
                              );
                            })}
                          </div>
                        </>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
            {currentSectionIndex === 1 && (
              <button
                className="about-scroll-hint"
                type="button"
                onClick={() => scrollToSectionIndex(2)}
                aria-label="Scroll to next section"
              >
                <img src={toggleIconSrc} alt="" aria-hidden="true" />
              </button>
            )}
          </div>
        </section>

        <section className="about-section about-section--off-record">
          <div className="about-off-record-wrapper">
            <div className="about-off-record">
              <div
                className="about-research-intro-block about-fade-block"
                ref={fadeInRef}
                style={{ '--about-fade-delay': '0.35s' }}
              >
                <p className="about-research-subheading about-research-subheading--intro">Off the Record</p>
                <p className="about-research-intro about-off-record__warning">
                  Warning: This section contains personal content.
                  <br className="about-off-record__mobile-break" />
                  {' '}
                  Please do not click!
                </p>
              </div>
              <div
                className="about-contact-buttons about-contact-buttons--inline about-fade-block"
                ref={fadeInRef}
                style={{ '--about-fade-delay': '0.65s' }}
              >
                {offRecordTags.map((tag, index) => {
                  const isMovieTag = tag.label === 'MOVIE';
                  const delayStyle = { '--about-fade-delay': `${0.75 + index * 0.08}s` };
                  return isMovieTag ? (
                    <Link key={tag.label} to={tag.href} className="about-contact-button" style={delayStyle}>
                      {tag.label}
                    </Link>
                  ) : (
                    <button
                      key={tag.label}
                      type="button"
                      className="about-contact-button"
                      style={delayStyle}
                      onClick={() => handleOffRecordTagClick(tag.label)}
                    >
                      {tag.label}
                    </button>
                  );
                })}
              </div>
              <div
                className={`about-contact-buttons-hint${
                  pendingUpdateTag ? ' about-contact-buttons-hint--visible' : ''
                }`}
                aria-live="polite"
              >
                {pendingUpdateTag ? 'Update Soon' : '\u00A0'}
              </div>
            </div>
          </div>
        </section>
      </main>
    </PageLoadGuard>
  );
};
