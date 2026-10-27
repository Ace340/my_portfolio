import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { scrollToOnRouteChange } from '../motion/useSmoothScroll.js';

/**
 * ScrollToTop — declarative-mode react-router ships no scroll restoration
 * (verified against the current docs): route changes keep the window where it
 * was. On route change: a `#hash` URL scrolls to that section once it exists;
 * anything else resets to the top — through Lenis, which owns the scroll
 * position (see `scrollToOnRouteChange`). The deferred `ScrollTrigger.refresh()`
 * recalculates trigger positions for the incoming page's content.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const target = hash ? document.querySelector(hash) : null;
    scrollToOnRouteChange(target ?? 0);
  }, [pathname, hash]);

  useEffect(() => {
    // Next frame: the incoming page has mounted and its content can be measured.
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
