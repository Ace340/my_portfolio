/**
 * Motion vocabulary — the site's shared easing language (plan.md §5 "Motion spine").
 *
 * A small, deliberate set so every animated element feels like one hand made it,
 * instead of each component inventing its own ease string. Import from here rather
 * than writing ease strings ad hoc.
 *
 * - `reveal` — scroll-triggered section reveals. Decelerating `power3.out` reads as
 *   premium and calm; things settle into place rather than snap.
 * - `title` — word-split title entrances. `expo.out` is snappier / more dramatic,
 *   so headings land with emphasis.
 * - `ui` — symmetric UI & state transitions (nav background, carousel slides,
 *   parallax drifts). `power1.inOut` is balanced in and out.
 */
export const EASE = {
  reveal: 'power3.out',
  title: 'expo.out',
  ui: 'power1.inOut',
};
