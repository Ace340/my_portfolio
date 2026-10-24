/**
 * Ambient Hue signal (ADR-0004, CONTEXT.md "Ambient Hue").
 *
 * A deliberately tiny pub/sub — NOT React state, NOT context: slider drags
 * mutate shader palette uniforms directly (the Three.js-supported update
 * channel — uniform `.value` writes re-upload every frame), so a drag causes
 * zero React re-renders. React only owns whether the popover is open.
 *
 * The current value lives in module scope for the session only. It is NEVER
 * persisted (no localStorage, no cookies) — every visit opens on brand navy
 * (ADR-0004 #5: "first impressions belong to the brand").
 */
import { normalizeAmbientHue } from './ambientHue.js';

const subscribers = new Set();
let current = 0; // 0 = brand navy default

/** Session-current Ambient Hue (0..1). */
export const getAmbientHue = () => current;

/** Update the hue and notify subscribers. Same-value writes are no-ops. */
export const setAmbientHue = (t) => {
  const next = normalizeAmbientHue(t);
  if (next === current) return;
  current = next;
  subscribers.forEach((notify) => notify(current));
};

/**
 * Subscribe to hue changes. The subscriber is called once immediately with
 * the current value (late subscribers stay consistent — e.g. a remounted
 * scene re-applies the session hue), then on every change.
 *
 * @param {(t: number) => void} notify
 * @returns {() => void} unsubscribe
 */
export const subscribeAmbientHue = (notify) => {
  subscribers.add(notify);
  notify(current);
  return () => subscribers.delete(notify);
};
