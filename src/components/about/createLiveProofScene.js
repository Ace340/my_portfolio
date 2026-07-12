import * as THREE from 'three';
import { FBM_GLSL } from './fbm.glsl.js';

const DEFAULTS = {
  intensity: 1.2, // per-instance brightness/reveal strength; auto-derated on small screens
};

// Viewports at/below this width get a lighter render (lower DPR + reduced
// intensity) so the Live Proof degrades gracefully on phones (plan.md §5).
const MOBILE_MAX_WIDTH = 768;
const isMobileViewport = () =>
  typeof window !== 'undefined' &&
  window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`).matches;

/**
 * Build the About "Live Proof" — a fullscreen, responsive-ambient fragment
 * shader rendered behind the positioning copy (CONTEXT.md "Live Proof",
 * plan.md §5C, ADR-0002).
 *
 * It is the *complement* of the hero, not a rival: the hero proves
 * vertex / 3D-object craft; this proves fragment / 2D-field craft. A domain-
 * warped FBM field drifts slowly, dark and low-contrast at rest so light About
 * copy reads on top, then gains contrast and a whisper of the brand yellow as
 * attention (scroll dwell) rises — and settles again. Deliberately recessive.
 *
 * WebGL path only. A fullscreen clip-space quad carries the shader; the vertex
 * stage writes clip-space directly so the ortho camera merely satisfies render().
 *
 * @param {HTMLCanvasElement} canvas
 * @param {{ intensity?: number, reducedMotion?: boolean }} [options]
 *   `intensity` sets the per-instance brightness/reveal strength (mobile auto-derates to ~55%).
 *   `reducedMotion` renders a single static frame with no input/RAF wiring.
 * @returns {{ dispose: () => void, uniforms: Record<string, THREE.IUniform>, setPointer: (x: number, y: number) => void, setScroll: (v: number) => void, setReveal: (v: number) => void, setActive: (v: boolean) => void }}
 *   `dispose` tears down RAF + listeners + GPU resources. `setPointer`/`setScroll`/
 *   `setReveal` feed the eased interaction targets. `setActive(false)` halts the
 *   RAF (GPU-cost discipline when the section is offscreen — part of the "proof",
 *   plan.md §5C). On small screens or under sustained <30fps the renderer caps DPR
 *   and steps `uIntensity` down (one-way) so the field degrades gracefully.
 */
export function createLiveProofScene(canvas, options = {}) {
  const config = { ...DEFAULTS, ...options };

  // Lighter config on small screens: derate the reveal strength so phones do
  // less fragment work while the field still reads.
  const isMobile = isMobileViewport();
  const baseIntensity = config.reducedMotion
    ? 0
    : isMobile
      ? config.intensity * 0.55
      : config.intensity;

  const uniforms = {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uScroll: { value: 0 },
    uReveal: { value: 0 },
    uIntensity: { value: baseIntensity },
  };

  // Interaction targets (cursor + scroll + reveal). The RAF loop eases the
  // uniforms toward these so input feels inertial rather than snapping.
  const EASE = 0.08;
  const target = {
    mouse: new THREE.Vector2(0, 0),
    scroll: 0,
    reveal: 0,
  };

  const scene = new THREE.Scene();
  // Fullscreen clip-space quad: ortho camera spans [-1,1]; the vertex shader
  // writes gl_Position in clip space directly, so this camera only exists to
  // satisfy renderer.render(scene, camera).
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  // Cap DPR — mobile gets a tighter cap (1.5 vs 2) to keep fill-rate down.
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position.xy, 0.0, 1.0); // fullscreen clip-space quad
      }
    `,
    fragmentShader: /* glsl */ `
      ${FBM_GLSL}
      uniform float uTime;
      uniform vec2 uMouse;
      uniform vec2 uResolution;
      uniform float uScroll;
      uniform float uReveal;
      uniform float uIntensity;
      varying vec2 vUv;

      void main() {
        // Aspect-correct coords so the field isn't stretched wide on landscape.
        vec2 uv = vUv;
        float aspect = uResolution.x / max(uResolution.y, 1.0);
        vec2 p = (uv - 0.5) * vec2(aspect, 1.0) * 2.6;

        // Slow, subordinate time. The hero is fast/3D; this is a calm 2D field,
        // so the clock is scaled into a narrow band (plan.md §5C "subordinate
        // by design"). Never upstage the "JUAN" hero.
        float t = uTime * 0.09;

        // Cursor parallax: a small warp offset so attention to the section
        // shifts the field. Kept subtle (0.18) — it must not rival the hero's
        // cursor-driven bulge.
        p += uMouse * 0.18;
        // Scroll drifts the field so progress through the page nudges it.
        p.y += uScroll * 0.6;

        // Domain warp (organic swirl) + two fbm samples for richer structure.
        vec2 w = warp(p, t);
        float n1 = fbm(w + vec2(0.0, t * 0.6));
        float n2 = fbm(w * 1.6 - vec2(t * 0.4, 0.0));
        float field = n1 * 0.6 + n2 * 0.4; // ~0..1

        // Palette — valleys stay near-black (legibility); ridges lift warm/yellow.
        vec3 base   = vec3(0.020, 0.020, 0.026); // near-black valley ~#050508
        vec3 mid    = vec3(0.22, 0.18, 0.16);    // warm ridge (raised for brightness)
        vec3 yellow = vec3(0.906, 0.827, 0.576); // #E7D393 — SAME hot tint as the hero

        // uIntensity is the per-instance BRIGHTNESS knob (About: text-safe ~0.8;
        // Selected Work: brighter ~1.5 — content lives in cards above it). It scales
        // BOTH the rest field and the reveal so "brighter" reads at all times.
        float bright = uIntensity;

        // Rest field: visible flowing texture even before reveal, scaled by intensity.
        float rest = smoothstep(0.15, 0.95, field);
        vec3 col = mix(base, mid, rest * (0.55 * bright));

        // Reveal adds contrast + brand-yellow on the brightest crests.
        float reveal = uReveal * bright;
        col = mix(col, mid * 1.6, field * reveal * 0.5);
        float ridge = smoothstep(0.5, 0.82, field);
        col += yellow * ridge * reveal * 0.55;

        // LEGIBILITY: valleys stay ~#050508 (white copy clears WCAG AA easily);
        // ridges lift warm/yellow, scaled by per-instance intensity. About uses a
        // lower intensity so its centered copy stays legible — verify in-browser
        // over the real copy and dial intensity down if needed.
        col = max(col, base); // never darker than base (avoid black holes)
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });

  const geo = new THREE.PlaneGeometry(2, 2);
  const mesh = new THREE.Mesh(geo, material);
  scene.add(mesh);

  let disposed = false;
  let raf = 0;
  let active = true; // RAF gate; flipped offscreen by setActive(false)
  const clock = new THREE.Clock();

  // Adaptive frame-rate guard — graceful degradation (mirrors createHeroScene).
  // If the smoothed frame time stays above the 30fps threshold for ~1s, step
  // uIntensity down toward a floor. One-way (never climbs back) to avoid
  // oscillation; measured with performance.now() so it doesn't fight the clock.
  const FRAME_TIME_30FPS = 1000 / 30;
  const SUSTAINED_SLOW_MS = 1000;
  const INTENSITY_FLOOR = 0.12;
  const INTENSITY_DEGRADE = 0.85;
  let lastFrameMs = 0;
  let frameTimeEma = 0;
  let slowAccumMs = 0;

  /** Size the drawing buffer to the canvas (CSS controls display size). */
  const frame = () => {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    uniforms.uResolution.value.set(w, h);
    renderer.setSize(w, h, false);
  };

  const tick = () => {
    if (disposed || !active) return;
    uniforms.uTime.value = clock.getElapsedTime();

    // Adaptive guard: track smoothed frame time; derate intensity if the device
    // can't hold 30fps for a sustained window.
    const nowMs = performance.now();
    if (lastFrameMs) {
      const dt = nowMs - lastFrameMs;
      frameTimeEma = frameTimeEma ? frameTimeEma * 0.9 + dt * 0.1 : dt;
      if (frameTimeEma > FRAME_TIME_30FPS) {
        slowAccumMs += dt;
        if (slowAccumMs >= SUSTAINED_SLOW_MS && uniforms.uIntensity.value > INTENSITY_FLOOR) {
          uniforms.uIntensity.value = Math.max(INTENSITY_FLOOR, uniforms.uIntensity.value * INTENSITY_DEGRADE);
          slowAccumMs = 0; // reset so we don't re-step every frame
        }
      } else {
        slowAccumMs = 0;
      }
    }
    lastFrameMs = nowMs;

    // ease input-driven uniforms toward their targets for an inertial feel
    uniforms.uMouse.value.lerp(target.mouse, EASE);
    uniforms.uScroll.value = THREE.MathUtils.lerp(uniforms.uScroll.value, target.scroll, EASE);
    uniforms.uReveal.value = THREE.MathUtils.lerp(uniforms.uReveal.value, target.reveal, EASE);

    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  };

  frame();
  const onResize = () => frame();
  window.addEventListener('resize', onResize);

  if (config.reducedMotion) {
    // Static frame, no RAF (avoid vestibular triggers). The field is dark at
    // rest so this is a calm poster; uReveal stays 0 (no yellow), uIntensity 0.
    renderer.render(scene, camera);
  } else {
    clock.start();
    raf = requestAnimationFrame(tick);
  }

  /** Pointer position in normalized device coords (-1..1, y flipped). */
  const setPointer = (x, y) => target.mouse.set(x, y);

  /** Scroll progress 0..1 (driven by GSAP ScrollTrigger in the shell). */
  const setScroll = (v) => {
    target.scroll = v;
  };

  /** Reveal/attention 0..1 (peaks when the section is centered in view). */
  const setReveal = (v) => {
    target.reveal = v;
  };

  /**
   * Gate the RAF. setActive(false) halts rendering (GPU-cost discipline while
   * the section is offscreen); setActive(true) resumes. No-op for reduced-motion
   * (static frame, no loop to run).
   */
  const setActive = (v) => {
    active = v;
    if (v) {
      if (!config.reducedMotion && !raf) {
        lastFrameMs = 0; // reset frame-time tracking after a pause
        raf = requestAnimationFrame(tick);
      }
    } else {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };

  const dispose = () => {
    disposed = true;
    active = false;
    cancelAnimationFrame(raf);
    raf = 0;
    window.removeEventListener('resize', onResize);
    scene.remove(mesh);
    geo.dispose();
    material.dispose();
    renderer.dispose();
  };

  return { dispose, uniforms, setPointer, setScroll, setReveal, setActive };
}
