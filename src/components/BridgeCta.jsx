import { Link } from 'react-router';

/**
 * BridgeCta — a Bridge (CONTEXT.md "Bridge", ADR-0005): a small, deliberately-
 * subordinate affordance handing a visitor from one identity's page to the
 * other. A Bridge never rivals the Funnel CTA of the page it lives on, so this
 * stays visually quiet: one line, one link, generous whitespace.
 */
const BridgeCta = ({ to, line, cta }) => (
  <section className="border-t border-white/10 px-5 py-24">
    <div className="container mx-auto space-y-3 text-center">
      <p className="font-serif text-lg italic text-white/85 md:text-2xl">{line}</p>
      <Link
        to={to}
        className="inline-block text-sm uppercase tracking-[0.2em] text-white/60 underline-offset-8 transition-colors duration-300 hover:text-accent hover:underline"
      >
        {cta} →
      </Link>
    </div>
  </section>
);

export default BridgeCta;
