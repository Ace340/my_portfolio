import { useRef } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import { useMediaQuery } from 'react-responsive';
import { aboutCopy } from '../../constants/index.js';
import { EASE } from '../motion/easings.js';

// Plugins are registered ONCE in src/App.jsx (technical-domain.md). SplitText
// is included free in gsap@3.13 and already registered there — do NOT
// re-register here.

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG — every spacing / duration / offset knob lives here. No magic numbers
// below this block. Tune the feel of the section by editing these only.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Geometry for the "line writes the paragraphs" Scroll-story (Option B).
 *
 * VISUAL MODEL:
 *   A continuous SVG line draws itself segment by segment as the visitor
 *   scrolls. Where the line is drawing, that paragraph's characters emerge
 *   in sequence — as if the line is handwriting them. By the time the line
 *   reaches a paragraph's anchor, the paragraph is fully written. After the
 *   last paragraph, the complete zigzag thread is visible — the line "is"
 *   the story.
 *
 *   No separate "pen" / arrow icon. The line's leading edge IS the pen.
 *
 * CHAPTER SHAPE (proportions sum to 1.0 — see WRITE/HOLD):
 *
 *   ┌─ chapter i ──────────────────────────────────────────────────────┐
 *   │  WRITE   line draws segment i (anchor[i] → anchor[i+1]) WHILE    │
 *   │         paragraph[i]'s chars reveal one-by-one, staggered across │
 *   │         the whole WRITE duration                                 │
 *   │  HOLD   paragraph[i] rests; line at anchor[i+1]; visitor scrolls │
 *   │         onward                                                   │
 *   └──────────────────────────────────────────────────────────────────┘
 *
 * Both tweens (line draw + char stagger) run in parallel during WRITE, so
 * the line reaches the anchor at the same moment the last char settles.
 */
const ABOUT_CONFIG = {
  // Scroll length per chapter. Total section scroll = N × CHAPTER_VH.
  CHAPTER_VH: 110,

  // Vertical layout of the paragraph band inside the 100vh stage.
  STAGE_PAD_TOP_VH: 20,
  STAGE_PAD_BOTTOM_VH: 14,

  // Horizontal inset for left/right paragraphs, from stage center.
  SIDE_OFFSET_VW: 30,

  // Where the line begins (top of the storytelling zone, before any paragraph).
  LINE_START_Y_VH: 14,

  // Line styling.
  LINE_WIDTH_PX: 2,
  LINE_OPACITY: 0.65, // recessive so paragraph text owns the eye

  // Chapter internal pacing — fractions of CHAPTER_VH. Must sum to 1.0.
  WRITE_FRACTION: 0.70, // line draws + paragraph chars reveal
  HOLD_FRACTION: 0.30, // paragraph rests before the next chapter

  // Per-character reveal animation.
  CHAR_OFFSET_Y_PX: 10, // each char's initial y offset (settles up to 0)
  // Each char's individual reveal duration. Clamped to 30% of WRITE so that
  // even short paragraphs don't make the stagger feel bunched up.
  CHAR_PER_CHAR_DURATION: 0.4,
};

/** Mobile overrides — merged on top of ABOUT_CONFIG under 768px. */
const MOBILE_OVERRIDES = {
  CHAPTER_VH: 80,
  STAGE_PAD_TOP_VH: 16,
  STAGE_PAD_BOTTOM_VH: 14,
  SIDE_OFFSET_VW: 22,
  LINE_START_Y_VH: 12,
};

// Brand yellow used elsewhere for accent strokes (technical-domain.md token).
const ACCENT_COLOR = '#e7d393';

// ─────────────────────────────────────────────────────────────────────────────
// Pure helpers — no side effects (code-quality.md).
// ─────────────────────────────────────────────────────────────────────────────

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** vh / vw → px. Used for the timeline's end distance and ScrollTrigger
 *  geometry. The SVG line itself uses a 0–100 viewBox so its path is
 *  inherently responsive (no px conversion needed for the path). */
const vh = (n) => (window.innerHeight * n) / 100;

/** Side tokens used throughout: -1 = left, 0 = center, +1 = right. */
const sideToOffsetVw = (side, config) => side * config.SIDE_OFFSET_VW;

/**
 * Compute paragraph `i`'s rest position inside the pinned 100vh stage.
 *
 * - Vertical: evenly distributed down the stage between STAGE_PAD_TOP_VH and
 *   (100 − STAGE_PAD_BOTTOM_VH). Paragraphs progress downward in reading order.
 * - Horizontal: index 0 sits at center (no horizontal travel for chapter 0);
 *   subsequent indices alternate left / right so the line zigzags and the
 *   arrow of motion always crosses the viewport.
 *
 * @param {number} i      Paragraph index (0-based).
 * @param {number} total  Total number of paragraphs.
 * @param {object} config Merged ABOUT_CONFIG.
 * @returns {{ y: number, side: -1|0|1 }}
 */
const paragraphPosition = (i, total, config) => {
  const span = 100 - config.STAGE_PAD_TOP_VH - config.STAGE_PAD_BOTTOM_VH;
  const y = config.STAGE_PAD_TOP_VH + (i / Math.max(1, total - 1)) * span;
  const side = i === 0 ? 0 : i % 2 === 1 ? -1 : 1;
  return { y, side };
};

/**
 * Build the line's anchor points in viewBox coords (0–100 range, where
 * 1 unit ≈ 1vw horizontally and 1vh vertically). The line starts at
 * LINE_START_Y_VH (center) and visits every paragraph in order.
 *
 * @returns {Array<{x: number, y: number}>}
 */
const buildLinePoints = (positions, config) => [
  { x: 50, y: config.LINE_START_Y_VH },
  ...positions.map((p) => ({
    x: 50 + sideToOffsetVw(p.side, config),
    y: p.y,
  })),
];

/** Build the SVG path's `d` attribute from anchor points. */
const buildPathD = (points) =>
  points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(' ');

/**
 * Cumulative path distance to each anchor point, in viewBox units.
 * distances[0] = 0; distances[i] = sum of segment lengths from point 0 → i.
 *
 * @returns {number[]}
 */
const computeDistances = (points) => {
  const distances = [0];
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    distances.push(distances[i - 1] + Math.sqrt(dx * dx + dy * dy));
  }
  return distances;
};

// ─────────────────────────────────────────────────────────────────────────────
// Timeline builder.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Append chapter `i` to the master scrubbed timeline.
 *
 * Two parallel tweens run during WRITE:
 *   1. proxy.d animates distances[i] → distances[i+1]; onUpdate sets the
 *      line's strokeDashoffset, revealing the path up to d.
 *   2. paragraph[i]'s chars reveal from { opacity: 0, y: CHAR_OFFSET_Y_PX }
 *      to { opacity: 1, y: 0 } with a stagger computed so the last char
 *      settles exactly at the end of WRITE.
 *
 * @param {object} args — see param list below.
 */
const appendChapter = ({
  tl,
  i,
  proxy,
  linePath,
  paragraphChars,
  distances,
  totalLength,
  config,
}) => {
  const ch = config.CHAPTER_VH;
  const write = ch * config.WRITE_FRACTION;
  const hold = ch * config.HOLD_FRACTION;
  const t0 = i * ch; // absolute chapter start on the master timeline

  // 1. Line draws segment i.
  tl.fromTo(
    proxy,
    { d: distances[i] },
    {
      d: distances[i + 1],
      ease: EASE.ui,
      duration: write,
      onUpdate: () => {
        // dashoffset = remaining hidden portion. As d grows, offset shrinks
        // and more of the path is revealed.
        linePath.style.strokeDashoffset = totalLength - proxy.d;
      },
    },
    t0,
  );

  // 2. Paragraph[i]'s chars reveal in sequence.
  // Stagger math: distribute N chars' start times evenly so the LAST char
  // finishes exactly at end-of-WRITE. With perChar duration P and N chars,
  // stagger = (WRITE − P) / (N − 1). Edge case N=1 → stagger = 0.
  const chars = paragraphChars[i];
  const perChar = Math.min(config.CHAR_PER_CHAR_DURATION, write * 0.3);
  const stagger = chars.length > 1 ? (write - perChar) / (chars.length - 1) : 0;

  tl.fromTo(
    chars,
    { opacity: 0, y: config.CHAR_OFFSET_Y_PX },
    {
      opacity: 1,
      y: 0,
      ease: EASE.reveal,
      duration: perChar,
      stagger,
    },
    t0,
  );

  // HOLD — paragraph[i] fully visible; line at anchor[i+1]; nothing animates.
  tl.to({}, { duration: hold }, t0 + write);
};

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * About — a Scroll-story (CONTEXT.md): a continuous SVG line that "writes"
 * each paragraph as the visitor scrolls. The line is the pen; the paragraphs
 * appear character-by-character in sync with the line's drawing.
 *
 * ARCHITECTURE (single master timeline, pinned + scrubbed):
 *
 *   ┌ section #about (data-calm-zone) ────────────────────────────────────┐
 *   │  stage (100vh) — pinned by ScrollTrigger for the whole story         │
 *   │   ├── SVG <path> — continuous line through N+1 anchors (start +     │
 *   │   │   one per paragraph). Drawn progressively via strokeDashoffset. │
 *   │   └── N paragraph wrappers, each positioned via CSS top + side      │
 *   │       offset; inner <p> is SplitText'd into chars at runtime so     │
 *   │       each char can be revealed individually.                       │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 * One proxy object `{ d: 0 }` drives the line's draw progress. Each
 * chapter's WRITE phase animates `d` (line draws) AND, in parallel,
 * staggers paragraph[i]'s chars from hidden → visible.
 *
 * Subordinate to the Signature Moment (hero) per CONTEXT.md; transparent
 * over the Live Proof field with `data-calm-zone` so the field dims while
 * About is pinned (ADR-0003 revision). Names no tools (Funnel seam).
 *
 * Accessibility: SplitText 3 preserves the original text for screen readers
 * (chars are real text spans, not decorative). Paragraphs animate `opacity`
 * (not `visibility`) so they're always readable in the DOM. Reduced-motion
 * users see all paragraphs at rest with the line fully drawn — no SplitText,
 * no pin.
 */
const About = () => {
  const stageRef = useRef(null);
  const linePathRef = useRef(null);
  const sentenceRefs = useRef([]);
  const isMobile = useMediaQuery({ maxWidth: 767 });

  // Merge desktop config with mobile overrides once per render. `config` is
  // a fresh object per render (immutability, code-quality.md); useGSAP
  // re-runs when `isMobile` changes, picking up the new geometry.
  const config = { ...ABOUT_CONFIG, ...(isMobile ? MOBILE_OVERRIDES : {}) };
  const beats = aboutCopy.beats;
  const positions = beats.map((_, i) =>
    paragraphPosition(i, beats.length, config),
  );

  // Line geometry — derived once per render from positions. All in viewBox
  // units (0–100), so it's inherently responsive (no recompute on resize).
  const linePoints = buildLinePoints(positions, config);
  const distances = computeDistances(linePoints);
  const totalLength = distances[distances.length - 1];
  const pathD = buildPathD(linePoints);

  useGSAP(
    () => {
      const stage = stageRef.current;
      const linePath = linePathRef.current;
      const sentences = sentenceRefs.current.filter(Boolean);
      if (!stage || !linePath || sentences.length === 0) return;

      // Reduced motion: no SplitText, no choreography. Paragraphs visible
      // at rest; line fully drawn. Copy stays screen-reader readable.
      if (prefersReducedMotion()) {
        gsap.set(sentences, { opacity: 1 });
        linePath.style.strokeDashoffset = 0;
        return;
      }

      // SplitText each paragraph into individual chars. Reverted on cleanup
      // so the DOM is restored to plain text on unmount / breakpoint change
      // (no leaked spans; responsive re-split on the next pass).
      const splits = sentences.map(
        (el) => new SplitText(el, { type: 'chars' }),
      );
      const paragraphChars = splits.map((s) => s.chars);

      // Initial setup.
      // - Container <p>s visible (opacity: 1) so layout space is reserved
      //   and there's no flash of plain text on load.
      // - Each char hidden individually (opacity: 0 + y offset); the WRITE
      //   phase staggers them back to visible.
      // - Line fully hidden (dashoffset = totalLength).
      gsap.set(sentences, { opacity: 1 });
      gsap.set(paragraphChars.flat(), {
        opacity: 0,
        y: config.CHAR_OFFSET_Y_PX,
      });
      linePath.style.strokeDasharray = totalLength;
      linePath.style.strokeDashoffset = totalLength;

      // Master timeline — pinned + scrubbed. Scroll position drives the
      // playhead 1:1; no tween runs on a clock. `invalidateOnRefresh` makes
      // the end distance recompute on resize so the layout stays responsive.
      const proxy = { d: 0 };
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: () => `+=${vh(beats.length * config.CHAPTER_VH)}`,
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Build every chapter.
      beats.forEach((_, i) => {
        appendChapter({
          tl,
          i,
          proxy,
          linePath,
          paragraphChars,
          distances,
          totalLength,
          config,
        });
      });

      // Cleanup: revert SplitText (restores each paragraph to plain text),
      // runs on unmount or before re-running on `isMobile` change.
      return () => splits.forEach((s) => s.revert());
    },
    { scope: stageRef, dependencies: [isMobile] },
  );

  return (
    <section id="about" data-calm-zone className="relative w-full">
      {/*
        Pinned stage — 100vh. ScrollTrigger pins this element for the whole
        timeline; no manual spacer is needed. `overflow-hidden` keeps the
        drawing contained.
      */}
      <div
        ref={stageRef}
        className="about-stage relative h-screen w-full overflow-hidden"
      >
        {/*
          The line — one continuous SVG <path> through N+1 anchors (start +
          one per paragraph). viewBox 0 0 100 100 + preserveAspectRatio="none"
          so the geometry maps to vw/vh and is inherently responsive.
          `vectorEffect="non-scaling-stroke"` keeps the stroke a constant
          2px regardless of viewport aspect. `aria-hidden` — the line is
          decorative; meaning lives in the paragraph copy.
        */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          <path
            ref={linePathRef}
            d={pathD}
            stroke={ACCENT_COLOR}
            strokeOpacity={config.LINE_OPACITY}
            strokeWidth={config.LINE_WIDTH_PX}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            style={{
              strokeDasharray: totalLength,
              strokeDashoffset: totalLength,
            }}
          />
        </svg>

        {/*
          Paragraphs — each positioned via CSS `top` (vh) + horizontal offset
          (vw) on the OUTER wrapper. The INNER <p> is SplitText'd into chars
          at runtime; GSAP animates only opacity + y on each char so the
          CSS position transform on the outer wrapper is never touched.

          The line passes through each paragraph's anchor — a thread through
          beads. Paragraphs render after the SVG so text overlaps the line
          where they meet.
        */}
        {beats.map((beat, i) => {
          const { y, side } = positions[i];
          return (
            <div
              key={i}
              className="absolute left-1/2 top-0 w-[85vw] max-w-2xl"
              style={{
                transform: `translate(-50%, -50%) translateX(${
                  side * config.SIDE_OFFSET_VW
                }vw) translateY(${y}vh)`,
              }}
            >
              {/*
                Initial opacity: 0 to prevent a flash of plain text before
                SplitText runs + chars are hidden. useGSAP immediately sets
                opacity: 1 on the <p> and opacity: 0 on each char.
              */}
              <p
                ref={(el) => {
                  sentenceRefs.current[i] = el;
                }}
                className="text-2xl leading-relaxed text-white/90 md:text-3xl"
                style={{ opacity: 0 }}
              >
                {beat}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default About;
