// ORIGINAL GLSL — fragment/2D-field shader primitives for the About "Live Proof"
// (CONTEXT.md "Live Proof", plan.md §5C).
//
// Per ADR-0002 (rewrite-sourced-shaders-from-scratch): everything in this file is
// hand-written and understood line-by-line. It is NOT pasted from Shadertoy, a
// blog, or any other external shader. The reference shader for this section is
// treated as inspiration only; the field algorithm below — 2D value noise →
// fractal Brownian motion → domain warp — is implemented from first principles.
//
// The scalar lattice hash is the one generic, unavoidable building block of value
// noise (hash an integer cell to one pseudo-random float); I rebuilt it here with
// my own constants and structure rather than copying any specific implementation.
//
// Usage: prepend FBM_GLSL to a fragmentShader; it defines
//   float fbm(vec2 p)   — 0..1-ish fractal value noise (4 octaves)
//   vec2  warp(vec2 p, float t) — domain-warped coordinate (1 pass)

export const FBM_GLSL = /* glsl */ `
// ---- scalar lattice hash: one pseudo-random float in [0,1) per integer cell ----
// My own constants (not the textbook 127.1/311.7 pair). sin() fold + fract keeps
// it GLSL-ES-1.00 portable and matches the hero shader's style.
float lp_hash21(vec2 i) {
  float n = i.x * 162.495 + i.y * 497.113;
  return fract(sin(n) * 39342.8717);
}

// ---- 2D value noise ----
// Hash the four corners of the integer cell, then bilinearly interpolate with a
// quintic fade (6t^5 - 15t^4 + 10t^3) so the field is C1/C2-smooth — no visible
// lattice grid. Returns ~0..1.
float lp_valueNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0); // quintic fade
  float a = lp_hash21(i + vec2(0.0, 0.0));
  float b = lp_hash21(i + vec2(1.0, 0.0));
  float c = lp_hash21(i + vec2(0.0, 1.0));
  float d = lp_hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// ---- fractal Brownian motion (4 octaves) ----
// Sum value-noise octaves with 2x frequency and 0.5x amplitude gain. Cheap and
// stable; kept at 4 octaves so the field stays GPU-light (subordinate to hero).
float fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.5;
  float freq = 1.0;
  for (int i = 0; i < 4; i++) {
    v += amp * lp_valueNoise(p * freq);
    freq *= 2.0;
    amp *= 0.5;
  }
  return v; // ~0..1
}

// ---- domain warp (single pass) ----
// Sample fbm at offset positions to build a displacement vector, then nudge p by
// it. One pass is enough for the organic, swirly structure this background needs;
// more passes would add cost without helping a deliberately-recessive field.
vec2 warp(vec2 p, float t) {
  vec2 q = vec2(
    fbm(p + vec2(0.0, t)),
    fbm(p + vec2(5.2, 1.3) - t * 0.7)
  );
  return p + q * 0.6; // 0.6 = warp strength
}
`;
