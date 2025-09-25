import { useCallback } from 'react';

export const useFadeInAnimation = (threshold = 0.1, useNewSystem = false) => {
  const elementRef = useCallback((node) => {
    if (!node || node.nodeType !== Node.ELEMENT_NODE) return;

    const options = {
      root: null,
      rootMargin: "0px",
      threshold: threshold,
    };

    if (useNewSystem) {
      // 새로운 중앙 제어 시스템 (향후 마이그레이션용)
      node.classList.add('fade-in-element');

      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          entry.target.classList.toggle('fade-in-active', entry.isIntersecting);
        });
      }, options);

      observer.observe(node);
      return () => observer.unobserve(node);
    } else {
      // 현재 사용 중인 레거시 시스템 - 최적화
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          entry.target.classList.toggle('animation', entry.isIntersecting);
        });
      }, options);

      observer.observe(node);
      return () => observer.unobserve(node);
    }
  }, [threshold, useNewSystem]);

  return elementRef;
};