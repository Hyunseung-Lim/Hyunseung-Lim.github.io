import React from 'react';
import { Topbar } from '../Components/Topbar/topbar';
import { Footer } from '../Components/Footer/footer';
import { useInfiniteCarousel } from '../hooks/useInfiniteCarousel';
import { useFadeInAnimation } from '../hooks/useFadeInAnimation';
import { BANNER_IMAGES, CAROUSEL_CONFIG } from '../constants';
import './pages.css';

export const MainPage = () => {
  const fadeInRef = useFadeInAnimation();
  const { extendedImages, sliderStyle } = useInfiniteCarousel(
    BANNER_IMAGES,
    CAROUSEL_CONFIG.AUTO_SLIDE_INTERVAL,
    CAROUSEL_CONFIG.TRANSITION_DURATION
  );

  return (
    <div className="mainPage">
      <Topbar />

      <div className="banner">
        <div className="slider-container">
          <div className="slider" style={sliderStyle}>
            {extendedImages.map((src, index) => (
              <div 
                className="slide" 
                key={index}
                style={{ width: `${100 / extendedImages.length}%` }}
              >
                <img src={src} alt={`Slide ${index}`} />
              </div>
            ))}
          </div>
        </div>
        <div className="banner-text">
          <div ref={fadeInRef}>DIS 2024</div>
          <div ref={fadeInRef}>Denmark Copenhagen</div>
        </div>
      </div>

      <Footer />
    </div>
  );
};