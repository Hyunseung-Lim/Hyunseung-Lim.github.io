import { useCallback, useEffect, useRef } from 'react';

const DEFAULT_ROOT_MARGIN = '0px 0px -5%';
const SCROLLABLE_OVERFLOW_VALUES = new Set(['auto', 'scroll', 'overlay']);

const hasScrollableOverflow = (styleValue) => styleValue && SCROLLABLE_OVERFLOW_VALUES.has(styleValue);

const isScrollableElement = (node) => {
  if (
    typeof window === 'undefined' ||
    typeof document === 'undefined' ||
    !node ||
    node.nodeType !== Node.ELEMENT_NODE
  ) {
    return false;
  }

  const styles = window.getComputedStyle(node);
  const overflow = styles.overflow;
  const overflowX = styles.overflowX;
  const overflowY = styles.overflowY;
  const hasScrollableAxis =
    hasScrollableOverflow(overflow) ||
    hasScrollableOverflow(overflowX) ||
    hasScrollableOverflow(overflowY);

  if (!hasScrollableAxis) {
    return false;
  }

  const canScrollVertically = node.scrollHeight > node.clientHeight + 1;
  const canScrollHorizontally = node.scrollWidth > node.clientWidth + 1;

  return canScrollVertically || canScrollHorizontally;
};

const normalizeRootForObserver = (root) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return null;
  }

  if (!root || root === window || root === document.body || root === document.documentElement) {
    return null;
  }

  if (!isScrollableElement(root)) {
    return null;
  }

  return root;
};

const isElementVisibleWithinRoot = (node, root) => {
  if (
    typeof window === 'undefined' ||
    typeof document === 'undefined' ||
    !node ||
    typeof node.getBoundingClientRect !== 'function'
  ) {
    return false;
  }

  const rect = node.getBoundingClientRect();
  if (!root) {
    const viewportHeight =
      window.innerHeight ||
      (document.documentElement ? document.documentElement.clientHeight : 0) ||
      0;
    return rect.top <= viewportHeight && rect.bottom >= 0;
  }

  const rootRect = root.getBoundingClientRect();
  return rect.bottom >= rootRect.top && rect.top <= rootRect.bottom;
};

export const useFadeInAnimation = (config = {}) => {
  const normalizedConfig = typeof config === 'number' ? { threshold: config } : config;
  const {
    threshold = 0.1,
    root = null,
    rootMargin = DEFAULT_ROOT_MARGIN
  } = normalizedConfig;

  const resolvedRoot = typeof root === 'function' ? root() : root;
  const pendingElementsRef = useRef(new Set());
  const observerRef = useRef(null);

  const activateNode = useCallback((node) => {
    if (!node) {
      return;
    }
    node.classList.add('fade-in-active');
    pendingElementsRef.current.delete(node);
    if (observerRef.current) {
      try {
        observerRef.current.unobserve(node);
      } catch {
        // Swallow errors caused by stale observers during teardown.
      }
    }
  }, []);

  const scheduleActivation = useCallback(
    (node) => {
      if (!node || !node.isConnected) {
        return;
      }

      const schedule =
        typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function'
          ? window.requestAnimationFrame
          : (callback) => window.setTimeout(callback, 16);

      schedule(() => {
        schedule(() => activateNode(node));
      });
    },
    [activateNode]
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const observerRoot = normalizeRootForObserver(resolvedRoot);
    const supportsObserver = typeof window.IntersectionObserver === 'function';

    if (supportsObserver) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              activateNode(entry.target);
            }
          });
        },
        {
          root: observerRoot,
          rootMargin,
          threshold
        }
      );

      observerRef.current = observer;
      pendingElementsRef.current.forEach((node) => observer.observe(node));

      return () => {
        observer.disconnect();
        if (observerRef.current === observer) {
          observerRef.current = null;
        }
      };
    }

    const scrollTarget = observerRoot ?? window;

    if (!scrollTarget || typeof scrollTarget.addEventListener !== 'function') {
      return undefined;
    }

    const handleViewportChange = () => {
      if (pendingElementsRef.current.size === 0) {
        return;
      }

      pendingElementsRef.current.forEach((node) => {
        if (!node || !node.isConnected) {
          pendingElementsRef.current.delete(node);
          return;
        }

        if (isElementVisibleWithinRoot(node, observerRoot)) {
          scheduleActivation(node);
        }
      });
    };

    scrollTarget.addEventListener('scroll', handleViewportChange, { passive: true });
    window.addEventListener('resize', handleViewportChange);
    handleViewportChange();

    return () => {
      scrollTarget.removeEventListener('scroll', handleViewportChange);
      window.removeEventListener('resize', handleViewportChange);
    };
  }, [activateNode, resolvedRoot, rootMargin, scheduleActivation, threshold]);

  useEffect(() => () => {
    pendingElementsRef.current.clear();
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
  }, []);

  const elementRef = useCallback(
    (node) => {
      if (!node || node.nodeType !== Node.ELEMENT_NODE) {
        return;
      }

      node.classList.add('fade-in-element');

      if (node.classList.contains('fade-in-active')) {
        pendingElementsRef.current.delete(node);
        return;
      }

      pendingElementsRef.current.add(node);
      const normalizedRoot = normalizeRootForObserver(resolvedRoot);

      if (observerRef.current) {
        observerRef.current.observe(node);
        if (isElementVisibleWithinRoot(node, normalizedRoot)) {
          scheduleActivation(node);
        }
        return;
      }

      if (isElementVisibleWithinRoot(node, normalizedRoot)) {
        scheduleActivation(node);
      }
    },
    [resolvedRoot, scheduleActivation]
  );

  return elementRef;
};
