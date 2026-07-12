import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { createLiveProofScene } from './about/createLiveProofScene.js';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * LiveProof — the site-wide ambient shader background (CONTEXT.md "Live Proof",
 * plan.md §5C, ADR-0003).
 *
 * A SINGLE fixed full-viewport fragment field painted behind all content.
 * The canvas sits at z-0; `<main>` establishes its own stacking context at
 * z-10 (see `index.css`) so all section content paints above the field while
 * transparent sections show it. It starts AFTER the hero: the hero section carries an
 * opaque backing so the field is occluded while the hero is in view, protecting
 * the Signature Moment. Below the hero, transparent sections show the field;
 * sections with their own opaque/gradient backgrounds become natural calm zones.
 *
 * This is the site-wide reading of the Live Proof — no longer a per-section
 * artifact but one persistent recessive layer. Wiring:
 *   1. factory mount (factory owns RAF + adaptive/reduced-motion guards);
 *   2. cursor → setPointer (fine-pointer only, reduced-motion gated);
 *   3. global scroll progress → setScroll (the field drifts as you traverse
 *      the page — depth without per-section triggers);
 *   4. reveal held at full (setReveal(1)) — the field is always "awake" where
 *      it is visible (i.e. below the hero).
 *
 * Perf: a fixed background is always on-screen, so there is no offscreen RAF-
 * pause — the factory's mobile intensity derate, DPR cap, adaptive frame-rate
 * guard, and a static poster for reduced-motion carry the GPU cost instead
 * (ADR-0003). `intensity` is the brightness knob.
 *
 * Render ONCE, as a sibling before <main>.
 *
 * @param {{ intensity?: number }} props
 */
const LiveProof = ({ intensity = 0.8 }) => {
  const canvasRef = useRef(null);
  const apiRef = useRef(null);

  // 1. mount the Live Proof shader. Site-wide: always revealed where visible.
  useEffect(() => {
    if (!canvasRef.current) return undefined;
    const live = createLiveProofScene(canvasRef.current, {
      intensity,
      reducedMotion: prefersReducedMotion(),
    });
    apiRef.current = live;
    live.setReveal(1);
    return () => {
      live.dispose();
      apiRef.current = null;
    };
  }, [intensity]);

  // 2. cursor → uMouse (desktop / fine-pointer only; reduced-motion gated)
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;
    const onMove = (e) => {
      const api = apiRef.current;
      if (!api) return;
      const x = (e.clientX / window.innerWidth) * 2 - 1; // -1..1
      const y = -(e.clientY / window.innerHeight) * 2 + 1; // -1..1, flip Y to match NDC
      api.setPointer(x, y);
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  // 3. global scroll progress → uScroll (field drifts across the whole page)
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const st = ScrollTrigger.create({
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => apiRef.current?.setScroll(self.progress),
      });
      return () => st.kill();
    },
    { dependencies: [] },
  );

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      aria-hidden="true"
    />
  );
};

export default LiveProof;
