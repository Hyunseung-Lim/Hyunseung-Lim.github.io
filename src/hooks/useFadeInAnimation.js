import { useCallback, useEffect, useRef } from 'react';

export const useFadeInAnimation = (threshold = 0.1) => {
  const observersRef = useRef(new Map());

  const disconnectAll = useCallback(() => {
    observersRef.current.forEach((observer, target) => {
      observer.unobserve(target);
      observer.disconnect();
    });
    observersRef.current.clear();
  }, []);

  const elementRef = useCallback((node) => {
    if (!node) {
      return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE || observersRef.current.has(node)) {
      return;
    }

    const options = {
      root: null,
      rootMargin: '0px',
      threshold,
    };

    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add('fade-in-active');
        currentObserver.unobserve(entry.target);
        currentObserver.disconnect();
        observersRef.current.delete(entry.target);
      });
    }, options);

    node.classList.add('fade-in-element');
    observer.observe(node);
    observersRef.current.set(node, observer);

    if (typeof window !== 'undefined') {
      const rect = node.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const isInView = rect.top <= viewportHeight && rect.bottom >= 0;

      if (isInView) {
        const activate = () => {
          node.classList.remove('fade-in-active');
          void node.offsetHeight;
          node.classList.add('fade-in-active');
          observer.unobserve(node);
          observer.disconnect();
          observersRef.current.delete(node);
        };

        if (typeof window.requestAnimationFrame === 'function') {
          window.requestAnimationFrame(() => window.requestAnimationFrame(activate));
        } else {
          setTimeout(activate, 16);
        }
      }
    }
  }, [threshold]);

  useEffect(() => () => disconnectAll(), [disconnectAll]);

  return elementRef;
};
