/**
 * Ambient Hue — pure palette math (ADR-0004, CONTEXT.md "Ambient Hue").
 *
 * Maps a slider position t ∈ [0, 1] (blue ↔ goldenrod) to the Live Proof
 * field's palette. The blend travels a HUE PATH — blue → teal → green → deep
 * goldenrod — never a straight RGB lerp, which would pass through muddy gray
 * (ADR-0004 #2). Every stop is an HSL anchor, so saturation never collapses
 * anywhere on the drag.
 *
 * Brightness ceiling (ADR-0004 #4): the goldenrod end is a DEEP goldenrod
 * (L ≈ 0.38, not bright yellow) so white body copy stays legible at every
 * position. Valleys stay near-black at all times — `base` never varies.
 *
 * Pure by design (code-quality.md): no THREE, no DOM, no state — same input,
 * same output. This module is the single source of truth for the hue journey;
 * the scene factory reads it now, and the accent derivation (T2) and hero
 * tint (T3) will read the same anchors.
 */

/** Near-black valley (~#050508) — constant legibility floor, never remixed. */
export const AMBIENT_BASE = { r: 0.02, g: 0.02, b: 0.026 };

/*
 * HSL anchors. START anchors are the HSL of the pre-Ambient-Hue brand
 * constants, so t = 0 renders today's navy field unchanged. END anchors are
 * the deep-goldenrod ceiling — the brightness cap that keeps white copy
 * legible (ADR-0004 #4).
 */
const ACCENT_START = { h: 224.4, s: 0.643, l: 0.329 }; // #1E3A8A — brand navy
const ACCENT_END = { h: 42.7, s: 0.888, l: 0.382 }; // deep goldenrod (#B8860B)
const RIDGE_START = { h: 226.7, s: 0.474, l: 0.19 }; // cool-navy ridge (today's mid)
const RIDGE_END = { h: 42.7, s: 0.62, l: 0.24 }; // dark-goldenrod ridge

const lerp = (a, b, t) => a + (b - a) * t;

/** Clamp to the slider domain; non-finite input falls back to brand navy. */
export const normalizeAmbientHue = (t) =>
  Number.isFinite(t) ? Math.min(1, Math.max(0, t)) : 0;

/** Standard HSL → RGB (h in degrees, s/l in 0..1, outputs 0..1). */
const hslToRgb = (h, s, l) => {
  const hue = ((((h % 360) + 360) % 360) / 360);
  if (s === 0) return { r: l, g: l, b: l };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const channel = (offset) => {
    let t = hue + offset;
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return { r: channel(1 / 3), g: channel(0), b: channel(-1 / 3) };
};

const blendAnchor = (start, end, t) =>
  hslToRgb(lerp(start.h, end.h, t), lerp(start.s, end.s, t), lerp(start.l, end.l, t));

/**
 * The Ambient Hue palette at slider position `t`.
 *
 * `accent` tints the field's brightest crests; `ridge` is the lifted mid
 * tone; `base` is the constant near-black valley (legibility floor).
 *
 * @param {number} t slider position 0..1 (clamped; non-finite → 0 = navy)
 * @returns {{ base: {r: number, g: number, b: number}, ridge: {r: number, g: number, b: number}, accent: {r: number, g: number, b: number} }}
 *   components in 0..1, matching the shader's authored-value convention
 */
export const ambientHuePalette = (t) => {
  const u = normalizeAmbientHue(t);
  return {
    base: AMBIENT_BASE,
    ridge: blendAnchor(RIDGE_START, RIDGE_END, u),
    accent: blendAnchor(ACCENT_START, ACCENT_END, u),
  };
};
