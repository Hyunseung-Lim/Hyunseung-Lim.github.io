import { useCallback, useEffect, useRef } from 'react';

export const useFadeInAnimation = (threshold = 0.1, useNewSystem = false) => {
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
      disconnectAll();
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

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (useNewSystem) {
          entry.target.classList.toggle('fade-in-active', entry.isIntersecting);
        } else {
          entry.target.classList.toggle('animation', entry.isIntersecting);
        }
      });
    }, options);

    if (useNewSystem) {
      node.classList.add('fade-in-element');
    }

    observer.observe(node);
    observersRef.current.set(node, observer);
  }, [disconnectAll, threshold, useNewSystem]);

  useEffect(() => () => disconnectAll(), [disconnectAll]);

  return elementRef;
};
