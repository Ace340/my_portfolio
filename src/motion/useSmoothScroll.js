import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Lenis options for the portfolio motion spine (plan.md §5). `autoRaf: false` is
// required because GSAP's ticker drives the RAF below (avoids a duplicate loop).
// `anchors: true` lets Lenis intercept the existing a[href^="#"] nav links and
// smooth-scroll them instead of native jumping.
const LENIS_OPTIONS = {
  autoRaf: false,
  duration: 1.2,
  smoothWheel: true,
  anchors: true,
};

/**
 * Wire Lenis smooth-scroll into GSAP ScrollTrigger — the site's motion spine.
 *
 * Lenis owns the scroll position; each Lenis scroll event is pushed into
 * ScrollTrigger, and GSAP's single ticker drives Lenis's RAF so the two never
 * drift out of phase. `scrollerProxy` is intentionally NOT used — it's only for a
 * custom nested scroller, not the default window/`<html>` scroller (verified
 * against current Lenis docs, v1.3.x).
 *
 * Reduced-motion users get native instant scroll: no Lenis instance and no RAF are
 * created, and ScrollTrigger reads window scroll directly — the desired behavior.
 *
 * @returns {void} Call once near the root of the app (e.g. in `App`).
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const lenis = new Lenis(LENIS_OPTIONS);
    lenis.on('scroll', ScrollTrigger.update);

    // GSAP's ticker time is in seconds; Lenis.raf expects milliseconds.
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Recalculate trigger positions once the smooth scroller is settled.
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);
}
