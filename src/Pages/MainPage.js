import React, { useEffect } from 'react';
import { Topbar } from '../Components/Topbar/topbar';
import { Footer } from '../Components/Footer/footer';
import { useInfiniteCarousel } from '../hooks/useInfiniteCarousel';
import { useFadeInAnimation } from '../hooks/useFadeInAnimation';
import { BANNER_EVENTS, BANNER_IMAGES, CAROUSEL_CONFIG } from '../constants';
import { PageLoadGuard } from '../Components/PageLoader/PageLoadGuard';
import './pages.css';

const MAIN_PAGE_GATE_ASSETS = BANNER_IMAGES.slice(0, 2);

export const MainPage = () => {
  useEffect(() => {
    const setAppHeight = () => {
      const height = window.innerHeight;
      document.documentElement.style.setProperty('--app-height', `${height}px`);
    };

    setAppHeight();

    window.addEventListener('resize', setAppHeight);
    return () => window.removeEventListener('resize', setAppHeight);
  }, []);

  const fadeInRef = useFadeInAnimation();
  const { extendedImages, sliderStyle, currentIndex } = useInfiniteCarousel(
    BANNER_IMAGES,
    CAROUSEL_CONFIG.AUTO_SLIDE_INTERVAL,
    CAROUSEL_CONFIG.TRANSITION_DURATION
  );
  const slidesWithMeta = extendedImages.map((src) => {
    const event = BANNER_EVENTS.find((bannerEvent) => bannerEvent.slides.includes(src));
    return {
      src,
      event
    };
  });
  const currentEvent = slidesWithMeta[currentIndex]?.event || BANNER_EVENTS[0];

  return (
    <PageLoadGuard assets={MAIN_PAGE_GATE_ASSETS}>
      <div className="mainPage">
        <Topbar />

        <div className="banner">
          <div className="slider-container">
            <div className="slider" style={sliderStyle}>
              {slidesWithMeta.map(({ src, event }, index) => (
                <div
                  className="slide"
                  key={index}
                  style={{ width: `${100 / extendedImages.length}%` }}
                >
                  <img src={src} alt={`${event?.title || 'Slide'} ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
          <div className="banner-text">
            <div ref={fadeInRef}>{currentEvent?.title}</div>
            <div ref={fadeInRef}>{currentEvent?.location}</div>
          </div>
        </div>

        <Footer />
      </div>
    </PageLoadGuard>
  );
};
