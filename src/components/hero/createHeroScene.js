import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { SNOISE_GLSL } from './simplex.glsl.js';

const DEFAULTS = {
  text: 'JUAN',
  fontUrl: '/fonts/helvetiker_bold.typeface.json',
  fov: 35,
  size: 1,
  depth: 0.3,
  amp: 0.18, // desktop displacement strength; auto-derated on small screens
};

// Viewports at/below this width get a lighter render (lower DPR + reduced amp)
// so the hero degrades gracefully on phones (plan.md §5 "Mobile").
const MOBILE_MAX_WIDTH = 768;
const isMobileViewport = () =>
  typeof window !== 'undefined' &&
  window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`).matches;

/**
 * Build the reactive 3D-type hero scene on the given canvas.
 *
 * Renders the owner's name as extruded 3D type with simplex-noise displacement
 * driven by `uTime`, plus eased cursor (`uMouse`) and scroll (`uScroll`) targets
 * exposed via setPointer/setScroll for the React shell to drive (step 3).
 * See `docs/plan.md` (build sequence) and ADR-0001.
 *
 * WebGL path only (not TSL/WebGPU). Extrusion key is `depth` (current API).
 *
 * @param {HTMLCanvasElement} canvas
 * @param {{ text?: string, fontUrl?: string, amp?: number, reducedMotion?: boolean }} [options]
 *   `amp` sets the desktop displacement strength (mobile auto-derates to ~55%).
 *   `reducedMotion` renders a single static frame with no input/RAF wiring.
 * @returns {{ dispose: () => void, uniforms: Record<string, THREE.IUniform>, setPointer: (x: number, y: number) => void, setScroll: (v: number) => void }}
 *   `dispose` tears down RAF + listeners + GPU resources. `setPointer`/`setScroll`
 *   feed the eased interaction targets. `uniforms` is exposed for direct inspection/debug.
 *   On small screens or under sustained <30fps the renderer caps DPR and steps
 *   `uAmp` down (one-way) so the scene degrades gracefully.
 */
export function createHeroScene(canvas, options = {}) {
  const config = { ...DEFAULTS, ...options };

  // Lighter config on small screens: roughly halve the displacement so low-end
  // GPUs do less fragment work while the bulge stays readable.
  const isMobile = isMobileViewport();
  const baseAmp = config.reducedMotion ? 0 : (isMobile ? config.amp * 0.55 : config.amp);

  const uniforms = {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uScroll: { value: 0 },
    uAmp: { value: baseAmp },
    uFreq: { value: 1.4 },
  };

  // Interaction targets (cursor + scroll). The RAF loop eases the uniforms toward
  // these so input feels inertial rather than snapping. Set via setPointer/setScroll.
  const EASE = 0.08;
  const target = { mouse: new THREE.Vector2(0, 0), scroll: 0 };

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(config.fov, 1, 0.1, 100);
  camera.position.set(0, 0, 6);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  // Cap DPR — three.js manual discourages raw devicePixelRatio on HD-DPI displays.
  // Mobile gets a tighter cap (1.5 vs 2) to keep fill-rate cost down.
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: /* glsl */ `
      ${SNOISE_GLSL}
      uniform float uTime;
      uniform vec2 uMouse;
      uniform float uScroll;
      uniform float uAmp;
      uniform float uFreq;
      varying float vDistort;
      varying vec3 vNormalView;
      varying vec3 vViewDir;

      void main() {
        vec3 p = position;
        // displacement grows with scroll, pulled by cursor direction
        float n = snoise(p * uFreq + vec3(uMouse * 1.5, uTime * 0.25));
        float d = n * uAmp * (0.35 + uScroll * 1.3);
        p += normal * d;                 // displace along normal for a clean 3D bulge
        vDistort = d;
        vNormalView = normalize(normalMatrix * normal);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        vViewDir = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      varying float vDistort;
      varying vec3 vNormalView;
      varying vec3 vViewDir;

      void main() {
        // base near-white; bulges tint toward the brand yellow (#e7d393)
        vec3 base = vec3(0.95, 0.95, 0.98);
        vec3 hot  = vec3(0.906, 0.827, 0.576);
        vec3 col = mix(base, hot, smoothstep(-0.05, 0.18, vDistort));
        // fresnel rim for readable 3D depth
        float fres = pow(1.0 - max(dot(normalize(vNormalView), normalize(vViewDir)), 0.0), 2.5);
        col += fres * 0.25;
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });

  let geo = null;
  let mesh = null;
  let disposed = false;
  let raf = 0;
  const clock = new THREE.Clock();

  // Adaptive frame-rate guard — graceful degradation (plan.md §5 "Mobile").
  // If the smoothed frame time stays above the 30fps threshold for ~1s, step
  // uAmp down toward a floor. One-way (never climbs back) to avoid oscillation,
  // and measured with performance.now() so it doesn't fight the three.js Clock.
  const FRAME_TIME_30FPS = 1000 / 30;
  const SUSTAINED_SLOW_MS = 1000;
  const AMP_FLOOR = 0.05;
  const AMP_DEGRADE = 0.85;
  let lastFrameMs = 0;
  let frameTimeEma = 0;
  let slowAccumMs = 0;

  /** Size the drawing buffer to the canvas and re-frame the camera to fit the text. */
  const frame = () => {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false); // updateStyle=false: CSS (w-full h-full) controls display size
    camera.aspect = w / h;

    if (geo) {
      geo.computeBoundingBox();
      const box = geo.boundingBox;
      const fovRad = (camera.fov * Math.PI) / 180;
      const halfH = (box.max.y - box.min.y) / 2;
      const halfW = (box.max.x - box.min.x) / 2;
      const distH = halfH / Math.tan(fovRad / 2);
      const distW = halfW / (camera.aspect * Math.tan(fovRad / 2));
      const fit = Math.max(distH, distW) * 1.15; // 15% padding
      if (Number.isFinite(fit) && fit > 0) camera.position.z = fit;
    }
    camera.updateProjectionMatrix();
  };

  const tick = () => {
    if (disposed) return;
    uniforms.uTime.value = clock.getElapsedTime();

    // Adaptive guard: track smoothed frame time; degrade amp if the device
    // can't hold 30fps for a sustained window.
    const nowMs = performance.now();
    if (lastFrameMs) {
      const dt = nowMs - lastFrameMs;
      frameTimeEma = frameTimeEma ? frameTimeEma * 0.9 + dt * 0.1 : dt;
      if (frameTimeEma > FRAME_TIME_30FPS) {
        slowAccumMs += dt;
        if (slowAccumMs >= SUSTAINED_SLOW_MS && uniforms.uAmp.value > AMP_FLOOR) {
          uniforms.uAmp.value = Math.max(AMP_FLOOR, uniforms.uAmp.value * AMP_DEGRADE);
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
    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  };

  const build = (font) => {
    geo = new TextGeometry(config.text, {
      font,
      size: config.size,
      depth: config.depth, // current API (not height/amount)
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelSegments: 4,
    });
    geo.center();
    mesh = new THREE.Mesh(geo, material);
    scene.add(mesh);
    frame();

    if (config.reducedMotion) {
      uniforms.uTime.value = 0;       // static frame, no RAF (avoid vestibular triggers)
      renderer.render(scene, camera);
    } else {
      clock.start();
      raf = requestAnimationFrame(tick);
    }
  };

  new FontLoader().load(
    config.fontUrl,
    build,
    undefined,
    (err) => console.error('[hero] font load failed:', config.fontUrl, err),
  );

  // Initial size so the canvas isn't stuck at the default 300x150 before the font arrives.
  frame();
  const onResize = () => frame();
  window.addEventListener('resize', onResize);

  /** Pointer position in normalized device coords (-1..1, y flipped). Step 3 input. */
  const setPointer = (x, y) => target.mouse.set(x, y);

  /** Scroll progress 0..1 (driven by GSAP ScrollTrigger in the shell). Step 3 input. */
  const setScroll = (v) => {
    target.scroll = v;
  };

  const dispose = () => {
    disposed = true;
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', onResize);
    if (mesh) scene.remove(mesh);
    if (geo) geo.dispose();
    material.dispose();
    renderer.dispose();
  };

  return { dispose, uniforms, setPointer, setScroll };
}
