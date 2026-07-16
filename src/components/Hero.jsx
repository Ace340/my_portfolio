import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { createHeroScene } from './hero/createHeroScene.js';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Hero — the Signature Moment (ADR-0001, CONTEXT.md).
 *
 * Reactive Three.js 3D type "JUAN": the scene renders + eases input (createHeroScene);
 * this shell wires cursor → setPointer and scroll → setScroll. Reduced-motion users
 * get a static frame with no input wiring. The HTML overlay states the Primary
 * Identity + a single CTA so the Funnel's "who is this, instantly" (Success #1)
 * holds even before WebGL loads.
 */
const Hero = () => {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const apiRef = useRef(null);

  // 1. mount the 3D scene
  useEffect(() => {
    if (!canvasRef.current) return undefined;
    const hero = createHeroScene(canvasRef.current, {
      reducedMotion: prefersReducedMotion(),
    });
    apiRef.current = hero;
    return () => {
      hero.dispose();
      apiRef.current = null;
    };
  }, []);

  // 2. cursor → uMouse (the scene eases the uniform toward this target in its RAF)
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
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

  // 3. scroll → uScroll (scrubbed progress 0..1 across the hero)
  useGSAP(
    () => {
      if (prefersReducedMotion() || !rootRef.current) return;
      const st = ScrollTrigger.create({
        trigger: rootRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => apiRef.current?.setScroll(self.progress),
      });
      return () => st.kill(); // belt-and-suspenders; useGSAP also reverts
    },
    { scope: rootRef, dependencies: [] },
  );

  return (
    <section id="hero" ref={rootRef} className="overflow-hidden">
      {/* Masked backing (.hero-backing in index.css): bg-black + the 3D canvas
          fade out over the bottom 20% so the Live Proof field shows through with
          no hard seam. The CTA below is a sibling, NOT a child of this wrapper,
          so it isn't masked and can sit low while staying crisp. */}
      <div className="hero-backing absolute inset-0 bg-black">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      </div>

      {/* Heading for assistive tech — the 3D text is invisible to screen readers. */}
      <h1 className="sr-only">JUAN — Front-end Creative Developer</h1>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-5 px-5 pb-16 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-white/70 md:text-base">
          Front-end Creative Developer
        </p>
        <a
          href="#projects"
          className="pointer-events-auto rounded-full border border-white/30 px-6 py-2 text-sm text-white/90 transition-colors hover:border-yellow hover:text-yellow"
        >
          View Work
        </a>
      </div>
    </section>
  );
};

export default Hero;
