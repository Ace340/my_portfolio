import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { createLiveProofScene } from './about/createLiveProofScene.js';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Dimmed calm zones (ADR-0003 revision): while a `[data-calm-zone]` section is
// in view, the field eases down to this fraction of its full intensity so the
// foreground content owns the eye. About is the first such zone (CONTEXT.md).
const CALM_ZONE_INTENSITY_FACTOR = 0.4;

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
 *      it is visible (i.e. below the hero);
 *   5. dimmed calm zones → setIntensity (any `[data-calm-zone]` section eases
 *      the field down while in view, back to full on leave — ADR-0003 revision).
 *
 * Two kinds of calm zone now exist (CONTEXT.md "Calm zone"): *occluded* (opaque
 * backing hides the field — the hero, `#contact`) and *dimmed* (transparent
 * backing; intensity eased down via step 5 — e.g. About).
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

  // 4. dimmed calm zones (ADR-0003 revision): any section marked `data-calm-zone`
  // eases the field's intensity down while it overlaps the viewport and back to
  // full on leave. Sections DECLARE intent via the attribute; the dimming lives
  // here, where the field lives. No per-section shader/content triggers — only
  // an intensity scalar on the one global field.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const zones = document.querySelectorAll('[data-calm-zone]');
      if (!zones.length) return;
      const full = intensity;
      const dimmed = intensity * CALM_ZONE_INTENSITY_FACTOR;
      const triggers = Array.from(zones).map((zone) =>
        ScrollTrigger.create({
          trigger: zone,
          start: 'top 80%',
          end: 'bottom 20%',
          onToggle: (self) => apiRef.current?.setIntensity(self.isActive ? dimmed : full),
        }),
      );
      // refresh once layout has settled (Lenis + late paint)
      const rafId = requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => {
        cancelAnimationFrame(rafId);
        triggers.forEach((t) => t.kill());
      };
    },
    { dependencies: [intensity] },
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
