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
 * Perceptual equalization (T4 finding, 2026-10-25): HSL lightness is NOT
 * perceptual luminance — teal/green anchors at the same HSL `l` render far
 * brighter (WCAG) than the endpoints, so field crests under white body copy
 * dropped below AA at the mid hues. The field palette therefore SOLVES each
 * position's lightness so its WCAG luminance follows the endpoints' straight
 * journey (blendAnchorPerceptual). The UI accent keeps the plain HSL blend:
 * it clears AA against the dark base at every position (5.2–14.8:1), and its
 * accepted T2 look is left untouched.
 *
 * Pure by design (code-quality.md): no THREE, no DOM, no state — same input,
 * same output. This module is the single source of truth for the hue journey;
 * the scene factory reads it now, the accent derivation (T2) reads it too,
 * and the hero tint (T3) will read the same anchors.
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

/**
 * Linear HSL blend — the UI-accent path (ambientHueAccentCss). The field
 * palette uses blendAnchorPerceptual instead (T4): see the module header.
 */
const blendAnchor = (start, end, t) =>
  hslToRgb(lerp(start.h, end.h, t), lerp(start.s, end.s, t), lerp(start.l, end.l, t));

/** WCAG 2.x relative luminance of an sRGB {r,g,b} in 0..1 (perceptual). */
const linearizeChannel = (c) =>
  c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

const wcagLuminance = ({ r, g, b }) =>
  0.2126 * linearizeChannel(r) +
  0.7152 * linearizeChannel(g) +
  0.0722 * linearizeChannel(b);

/**
 * Solve the HSL lightness that renders `targetLum` WCAG luminance at the
 * given hue/saturation. Luminance is monotonic non-decreasing in lightness
 * (raising `l` raises every RGB channel), so a binary search converges.
 * Pure: same inputs, same output.
 */
const solveLightnessForLuminance = (h, s, targetLum) => {
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 30; i += 1) {
    const mid = (lo + hi) / 2;
    if (wcagLuminance(hslToRgb(h, s, mid)) < targetLum) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
};

/**
 * Field-palette blend (T4): travels the anchors' hue/saturation path, but
 * solves lightness per position so WCAG luminance follows the endpoints'
 * straight journey — cancelling the HSL-lightness trap that let teal/green
 * crests outrun the goldenrod ceiling in perceptual brightness. Endpoints
 * short-circuit to the exact anchor colors, so t=0 (brand navy) and t=1
 * (deep goldenrod) stay byte-identical to the accepted constants.
 */
const blendAnchorPerceptual = (start, end, t) => {
  if (t <= 0) return hslToRgb(start.h, start.s, start.l);
  if (t >= 1) return hslToRgb(end.h, end.s, end.l);
  const h = lerp(start.h, end.h, t);
  const s = lerp(start.s, end.s, t);
  const targetLum = lerp(
    wcagLuminance(hslToRgb(start.h, start.s, start.l)),
    wcagLuminance(hslToRgb(end.h, end.s, end.l)),
    t
  );
  return hslToRgb(h, s, solveLightnessForLuminance(h, s, targetLum));
};

/**
 * The Ambient Hue palette at slider position `t`.
 *
 * `accent` tints the field's brightest crests; `ridge` is the lifted mid
 * tone; `base` is the constant near-black valley (legibility floor).
 * ridge/accent ride the perceptually-equalized path (T4) so crest
 * brightness tracks the endpoints' WCAG-luminance journey, not HSL `l`.
 *
 * @param {number} t slider position 0..1 (clamped; non-finite → 0 = navy)
 * @returns {{ base: {r: number, g: number, b: number}, ridge: {r: number, g: number, b: number}, accent: {r: number, g: number, b: number} }}
 *   components in 0..1, matching the shader's authored-value convention
 */
export const ambientHuePalette = (t) => {
  const u = normalizeAmbientHue(t);
  return {
    base: AMBIENT_BASE,
    ridge: blendAnchorPerceptual(RIDGE_START, RIDGE_END, u),
    accent: blendAnchorPerceptual(ACCENT_START, ACCENT_END, u),
  };
};

/*
 * UI accent anchors — the contrast-derived accent for text/flags/hovers
 * (ticket T2, ADR-0004 #3: "lighter on dark hues, darker on light hues").
 *
 * START is the exact HSL of the pre-Ambient-Hue token #7aa2f7, so t = 0
 * renders today's accent unchanged. END is a dark amber on the field's
 * goldenrod hue (42.7°) whose WCAG luminance sits BELOW the field crest's
 * (#B8860B, Y ≈ 0.273) — the visible polarity flip — while still clearing
 * 4.5:1 on the near-black base. The mid path rides the same teal → green
 * hue journey as the field at a lifted luminance, so the stress cases stay
 * readable at every position.
 */
const UI_ACCENT_START = { h: 220.8, s: 0.8865, l: 0.7235 }; // #7aa2f7 — today's accent
const UI_ACCENT_END = { h: 42.7, s: 0.78, l: 0.36 }; // #a37a14 — dark amber, darker than the goldenrod crest

const toHexChannel = (v) => {
  const hex = Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
};

/**
 * The contrast-derived UI accent at slider position `t`, as a CSS hex.
 *
 * Feeds `--color-accent` (accentHueBinding.js), which every accent utility
 * (`text-accent`, `bg-accent`, `border-accent`, `accent-accent`) reads.
 * Same HSL-blend machinery as the field palette — saturation never
 * collapses on the drag.
 *
 * @param {number} t slider position 0..1 (clamped; non-finite → 0 = navy)
 * @returns {string} CSS hex color, e.g. "#7aa2f7" at t = 0
 */
export const ambientHueAccentCss = (t) => {
  const { r, g, b } = blendAnchor(
    UI_ACCENT_START,
    UI_ACCENT_END,
    normalizeAmbientHue(t)
  );
  return `#${toHexChannel(r)}${toHexChannel(g)}${toHexChannel(b)}`;
};
