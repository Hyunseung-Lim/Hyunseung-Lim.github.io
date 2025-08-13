import { useState, useEffect, useCallback } from 'react';

export const useInfiniteCarousel = (images, autoSlideInterval = 5000, transitionDuration = 1000) => {
  const extendedImages = [images[images.length - 1], ...images, images[0]];
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = useCallback(() => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex(prevIndex => prevIndex + 1);
    }
  }, [isTransitioning]);

  useEffect(() => {
    const interval = setInterval(nextSlide, autoSlideInterval);
    return () => clearInterval(interval);
  }, [nextSlide, autoSlideInterval]);

  useEffect(() => {
    if (!isTransitioning) return;

    const handleTransitionEnd = () => {
      setIsTransitioning(false);
      
      if (currentIndex === extendedImages.length - 1) {
        setTimeout(() => setCurrentIndex(1), 0);
      }
      
      if (currentIndex === 0) {
        setTimeout(() => setCurrentIndex(images.length), 0);
      }
    };

    const timeout = setTimeout(handleTransitionEnd, transitionDuration);
    return () => clearTimeout(timeout);
  }, [currentIndex, extendedImages.length, images.length, isTransitioning, transitionDuration]);

  const sliderStyle = {
    width: `${extendedImages.length * 100}%`,
    transform: `translateX(-${(currentIndex * 100) / extendedImages.length}%)`,
    transition: isTransitioning ? `transform ${transitionDuration}ms ease-in-out` : 'none'
  };

  return {
    extendedImages,
    currentIndex,
    isTransitioning,
    sliderStyle
  };
};