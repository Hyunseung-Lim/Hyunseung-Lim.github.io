import React, { useEffect, useState } from 'react';
import '../Components/components.css';
import { useFadeInAnimation } from '../hooks/useFadeInAnimation';
import { useTheme } from '../contexts/ThemeContext';
import { Topbar } from '../Components/Topbar/topbar';
import { Footer } from '../Components/Footer/footer';

const TAGLINE_PART_ONE = 'A Design';
const TAGLINE_PART_TWO = 'AI Researcher';

const renderAnimatedText = (text) =>
  text.split('').map((char, index) => (
    <span
      key={`${text}-${index}`}
      className="about-tagline__char-wrapper"
    >
      <span className="about-tagline__char">
        {char === ' ' ? '\u00A0' : char}
      </span>
    </span>
  ));

export const About = () => {
  const fadeInRef = useFadeInAnimation();
  const taglineFadeRef = useFadeInAnimation();
  const { isDark } = useTheme();
  const crossIconSrc = isDark ? '/icons/x_dark.svg' : '/icons/x.svg';
  const [crossRotation, setCrossRotation] = useState(0);

  useEffect(() => {
    setCrossRotation(45);
    const interval = setInterval(() => {
      setCrossRotation(prev => prev + 45);
    }, 2000);
    return () => clearInterval(interval);
  }, []);


  const firstTagline = renderAnimatedText(TAGLINE_PART_ONE);
  const secondTagline = renderAnimatedText(TAGLINE_PART_TWO);

  return (
    <>
      <Topbar />
      <main className="about-page">
        <section className="about">
          <div className="about-mask about-mask--tagline" ref={taglineFadeRef}>
            <p className="about-tagline">
              <span className="about-tagline__line">{firstTagline}</span>
              <span className="about-tagline__char-wrapper">
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
              <span className="about-tagline__line">{secondTagline}</span>
            </p>
          </div>
          <div
            className="about-photo project-fade-block about-fade"
            ref={fadeInRef}
            style={{ transitionDelay: '0.8s' }}
          >
            <img src={'images/photo.jpg'} alt="Hyunseung Lim" />
          </div>
          <p
            className="about-name project-fade-block about-fade"
            ref={fadeInRef}
            style={{ transitionDelay: '1.05s' }}
          >
            Hyunseung Lim
          </p>
          <p
            className="about-description project-fade-block about-fade"
            ref={fadeInRef}
            style={{ transitionDelay: '1.3s' }}
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
        </section>
      </main>
      <Footer />
    </>
  );
};
