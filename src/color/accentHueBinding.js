/**
 * Ambient Hue → CSS accent binding (ADR-0004 #3, ticket T2).
 *
 * The one DOM side effect of the contrast-derived accent: writes the
 * hue-derived color onto the `:root` custom property that every Tailwind
 * accent utility (`text-accent`, `bg-accent`, `border-accent`,
 * `accent-accent`, `hover:*`) reads. Slider drags therefore recolor all
 * accent sites live with ZERO React re-renders — the same
 * uniform-mutation channel the scene uses (the ambientHueStore.js global
 * is that channel; ADR-0004 documents the deviation from code-quality's
 * "no global state" rule).
 *
 * The `@theme` value in index.css (#7aa2f7) remains only as the no-JS
 * fallback: from first bind onward this module owns the token, and
 * t = 0 reproduces the fallback byte-for-byte, so the default never moves.
 */
import { ambientHueAccentCss } from './ambientHue.js';
import { subscribeAmbientHue } from './ambientHueStore.js';

/**
 * Apply the current Ambient Hue accent and keep it live.
 *
 * `subscribeAmbientHue` fires once immediately with the session value, so
 * binding applies the right color even before any drag (and on remount).
 *
 * @returns {() => void} unsubscribe
 */
export const bindAccentToAmbientHue = () =>
  subscribeAmbientHue((t) => {
    document.documentElement.style.setProperty('--color-accent', ambientHueAccentCss(t));
  });
