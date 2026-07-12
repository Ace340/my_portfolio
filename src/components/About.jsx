import { aboutCopy } from '../../constants/index.js';

/**
 * About — positioning copy set against the site-wide "Live Proof" shader
 * (CONTEXT.md "Live Proof", plan.md §4.2 / §5C, ADR-0003).
 *
 * The shader is a single fixed background rendered once at the App root
 * (`<LiveProof>` in `App.jsx`); it shows through this transparent section, so
 * About just contributes the positioning copy. Kept as plain copy over the
 * field — dial the global `<LiveProof intensity={...}>` down if legibility
 * needs it.
 */
const About = () => (
  <section id="about" className="relative min-h-dvh w-full overflow-hidden">
    {/* Positioning copy overlay (ADR-0001: Front-end Creative Developer). */}
    <div className="relative z-10 container mx-auto flex min-h-dvh items-center justify-center px-5 py-28">
      <div className="max-w-3xl text-center">
        <p className="mb-5 text-sm uppercase tracking-[0.3em] text-white/60">{aboutCopy.eyebrow}</p>
        <h2 className="font-modern-negra text-4xl text-yellow md:text-6xl">{aboutCopy.title}</h2>
        <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/85 md:text-xl">
          {aboutCopy.body}
        </p>
      </div>
    </div>
  </section>
);

export default About;
