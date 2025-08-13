import { useCallback } from 'react';

export const useFadeInAnimation = (threshold = 0.1) => {
  const elementRef = useCallback((node) => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: threshold,
    };
    
    if (node && node.nodeType === Node.ELEMENT_NODE) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animation');
          } else {
            entry.target.classList.remove('animation');
          }
        });
      }, options);
  
      observer.observe(node);
    }
  }, [threshold]);

  return elementRef;
};