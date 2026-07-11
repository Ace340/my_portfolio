import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger, SplitText, Flip } from 'gsap/all';
import { useGSAP } from '@gsap/react';
import { caseStudies } from '../../constants/index.js';
import { EASE } from '../motion/easings.js';

gsap.registerPlugin(ScrollTrigger, SplitText, Flip);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Selected Work — front-end case-study reveals (plan.md §5 "Project treatment").
 *
 * Motion (subordinate to the hero Signature Moment):
 *  - Reveal: each card's image wipes in via a clip-path inset, coordinated with a
 *    text fade-up — one-shot on enter, `EASE.reveal`.
 *  - Hover tilt: 3D-tilt follows the cursor via `gsap.quickTo` (desktop / fine-pointer
 *    only), `EASE.ui`; resets on leave.
 *  - Hover-expand: hovering a card grows it to the large span while its row partner
 *    shrinks, animated via GSAP `Flip` so the grid reflow stays smooth (`EASE.ui`,
 *    desktop only).
 *
 * Reduced-motion users get a static, fully-visible grid (no clip, no tilt, no
 * expand). Mobile (coarse pointer) skips the tilt + expand but keeps the clip
 * reveal. Lenis is already wired to ScrollTrigger in `motion/useSmoothScroll.js`,
 * so triggers read from smoothed scroll.
 */
const SelectedWork = () => {
  const rootRef = useRef(null);
  const videoRefs = useRef({});

  // Autoplay the showcase video for everyone EXCEPT reduced-motion users, who get
  // a static poster frame (the `image`). Muted + playsInline so browsers allow it.
  // (Browsers block autoplay with sound; the card is silent by design.)
  useEffect(() => {
    if (prefersReducedMotion()) return;
    Object.values(videoRefs.current).forEach((video) => {
      if (!video) return;
      video.play().catch(() => {
        /* autoplay can be rejected until interaction; the poster still shows */
      });
    });
  }, []);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const mm = gsap.matchMedia();

      // 1. Reveal + title — runs for everyone without reduced-motion (incl. touch).
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Heading word-reveal (matches About/Hero pattern).
        const titleSplit = SplitText.create('#projects h2', { type: 'words' });
        const headerTl = gsap.timeline({
          scrollTrigger: { trigger: '#projects .header', start: 'top 80%' },
        });
        headerTl
          .from(titleSplit.words, {
            opacity: 0,
            yPercent: 100,
            duration: 1,
            ease: EASE.title,
            stagger: 0.02,
          })
          .from(
            '#projects .intro',
            { opacity: 0, y: 20, duration: 0.8, ease: EASE.reveal },
            '-=0.5',
          );

        // Per-card clip-path reveal + text fade. One-shot on enter, stays revealed.
        const cards = gsap.utils.toArray('.case-card');
        cards.forEach((card) => {
          const img = card.querySelector('.case-media');
          const meta = card.querySelector('.case-overlay');

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: card,
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
          });

          // clip-path inset: hidden (wiped right) -> visible. Same numeric shape
          // on both ends so GSAP can interpolate each component.
          tl.fromTo(
            img,
            { clipPath: 'inset(0% 100% 0% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: EASE.reveal },
          ).from(
            meta,
            { autoAlpha: 0, y: 30, duration: 0.8, ease: EASE.reveal },
            '-=0.7',
          );
        });
      });

      // 2. 3D-tilt hover — fine-pointer (desktop) only. quickTo setters are built
      //    once per card and reused across mousemove events.
      mm.add(
        { isDesktop: '(prefers-reduced-motion: no-preference) and (pointer: fine)' },
        (ctx) => {
          const cards = gsap.utils.toArray('.case-card');

          cards.forEach((card) => {
            const img = card.querySelector('.case-media-wrap');
            if (!img) return;

            gsap.set(img, {
              transformPerspective: 900,
              transformOrigin: 'center',
            });

            // Reusable setters — one quickTo per axis (no per-event tween churn).
            const rxTo = gsap.quickTo(img, 'rotationX', {
              duration: 0.5,
              ease: EASE.ui,
            });
            const ryTo = gsap.quickTo(img, 'rotationY', {
              duration: 0.5,
              ease: EASE.ui,
            });
            const maxTilt = 8; // degrees — subtle; the hero owns the drama

            const onMove = (e) => {
              const rect = card.getBoundingClientRect();
              const px = (e.clientX - rect.left) / rect.width - 0.5;
              const py = (e.clientY - rect.top) / rect.height - 0.5;
              rxTo(-py * maxTilt);
              ryTo(px * maxTilt);
            };
            const onLeave = () => {
              gsap.to(img, {
                rotationX: 0,
                rotationY: 0,
                duration: 0.6,
                ease: EASE.ui,
              });
            };

            card.addEventListener('mousemove', onMove);
            card.addEventListener('mouseleave', onLeave);

            // matchMedia cleanup when the query un-matches. ctx.add() invokes
            // the passed function immediately and registers its RETURN value
            // as the cleanup — so we must return the cleanup, not run it now.
            ctx.add(() => () => {
              card.removeEventListener('mousemove', onMove);
              card.removeEventListener('mouseleave', onLeave);
            });
          });

          // 3. Hover-expand swap — desktop only. Hovering a card makes it take the
          //    large span (lg:col-span-8) while its row partner shrinks to the small
          //    span (lg:col-span-4), animated via GSAP Flip so the grid reflow is
          //    smooth. Row pairs by source order: (0,1) and (2,3) -> partner = i ^ 1.
          //    Each row always keeps one large card, so row height stays constant
          //    (no page-height shift / no ScrollTrigger drift). Leaving the grid
          //    restores every card to its default span.
          const grid = rootRef.current.querySelector('.case-grid');
          const LARGE = 'lg:col-span-8';
          const SMALL = 'lg:col-span-4';
          const SPAN_RE = /lg:col-span-\d+/;
          const readSpan = (el) => (el.className.match(SPAN_RE) || [])[0] || '';
          const writeSpan = (el, span) => {
            el.classList.remove('lg:col-span-4', 'lg:col-span-8');
            if (span) el.classList.add(span);
          };
          const defaultSpans = new Map(cards.map((c) => [c, readSpan(c)]));

          // Composable FLIP runner: capture state, mutate the DOM, then animate the
          // reflow. No `absolute` (all cards going absolute would collapse the grid).
          const flipTo = (apply) => {
            const state = Flip.getState(cards);
            apply();
            Flip.from(state, { duration: 0.6, ease: EASE.ui });
          };

          const enterHandlers = cards.map((card) => {
            const i = cards.indexOf(card);
            const partner = cards[i ^ 1];
            return () =>
              flipTo(() => {
                cards.forEach((c) => writeSpan(c, defaultSpans.get(c)));
                writeSpan(card, LARGE);
                if (partner) writeSpan(partner, SMALL);
              });
          });
          const reset = () =>
            flipTo(() =>
              cards.forEach((c) => writeSpan(c, defaultSpans.get(c))),
            );

          cards.forEach((card, i) =>
            card.addEventListener('mouseenter', enterHandlers[i]),
          );
          grid.addEventListener('mouseleave', reset);

          ctx.add(() => () => {
            cards.forEach((card, i) =>
              card.removeEventListener('mouseenter', enterHandlers[i]),
            );
            grid.removeEventListener('mouseleave', reset);
            // Don't leave the grid in a swapped state if the query un-matches.
            cards.forEach((c) => writeSpan(c, defaultSpans.get(c)));
          });
        },
      );

      // Images may shift layout on load → recalc trigger positions once ready.
      // Safe refresh so it doesn't fire mid-Lenis inertia.
      const imgs = gsap.utils.toArray('#projects img');
      Promise.all(
        imgs.map((img) =>
          img.complete
            ? Promise.resolve()
            : new Promise((res) => {
                img.onload = img.onerror = res;
              }),
        ),
      ).then(() => ScrollTrigger.refresh());

      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [] },
  );

  return (
    <section id="projects" ref={rootRef}>
      <div className="header container mx-auto 2xl:px-0 px-5">
        <div className="content">
          <div className="md:col-span-8">
            <p className="badge">Selected Work</p>
            <h2>
              Front-end work where <span className="text-white">motion</span> and{' '}
              <span className="text-yellow">3D</span> are part of the craft
            </h2>
          </div>
          <div className="sub-content">
            <p className="intro">
              Selected interactive front-end work — interfaces built with React,
              Next.js, Three.js and GSAP.
            </p>
          </div>
        </div>
      </div>

      <div className="case-grid container mx-auto 2xl:px-0 px-5">
        {caseStudies.map((project) => (
          <a
            key={project.id}
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`case-card ${project.span}`}
            aria-label={`${project.name} — ${project.role}. Open in a new tab.`}
          >
            <div className="case-media-wrap">
              {project.video ? (
                <video
                  ref={(el) => {
                    videoRefs.current[project.id] = el;
                  }}
                  className="case-media"
                  poster={project.image}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                >
                  <source src={project.video} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={project.image}
                  alt={`${project.name} — ${project.role}`}
                  className="case-media"
                  loading="lazy"
                />
              )}
              {project.featured && <span className="case-flag">Featured</span>}
              <div className="case-overlay">
                <div className="case-meta">
                  <p className="case-role">{project.role}</p>
                  <h3 className="case-name">{project.name}</h3>
                  <p className="case-blurb">{project.blurb}</p>
                  <ul className="case-tags">
                    {project.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default SelectedWork;
