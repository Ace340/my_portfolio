import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger, SplitText } from 'gsap/all';
import { useGSAP } from '@gsap/react';
import { gameReel, gameProjects } from '../../constants/index.js';
import { EASE } from '../motion/easings.js';

gsap.registerPlugin(ScrollTrigger, SplitText);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Game Dev & Level Design — passion track (plan.md §4.5).
 *
 * A clearly-secondary section: a level-design reel (YouTube thumbnail linking out)
 * plus a small gallery of Taco Monkey Studio game-jam games linking to itch.io /
 * SideQuest. Genre-first framing keeps the XR de-brand intact (ADR-0001) while
 * honestly showing the work.
 *
 * The reel is a linked thumbnail, not an inline iframe, because Lenis disables
 * iframe pointer-events during smooth scroll (`src/index.css` `.lenis-smooth
 * iframe`), which would make an embedded player unclickable.
 *
 * Game cards with a `video` render an inline muted-looping showcase (mirrors
 * `SelectedWork`): a native `<video>` is unaffected by the Lenis iframe rule, so
 * it autoplays inline; reduced-motion users get the static poster (`image`). The
 * card itself still links out to the project (`link`).
 *
 * Motion (subordinate to the hero Signature Moment):
 *  - Reveal: heading word-split (`EASE.title`) + reel / game-card clip-path inset
 *    wipes (`EASE.reveal`), one-shot on enter.
 *  - Hover tilt: 3D-tilt on each game card via `gsap.quickTo` (desktop / fine-pointer
 *    only), `EASE.ui`; resets on leave. `maxTilt` stays small so the hero owns the
 *    drama.
 *
 * Reduced-motion users get a static, fully-visible section. Mobile (coarse pointer)
 * skips the tilt but keeps the clip reveal.
 */
const GameDev = () => {
  const rootRef = useRef(null);
  const videoRefs = useRef({});

  // Autoplay inline showcase videos for everyone EXCEPT reduced-motion users,
  // who get a static poster frame (`image`). Muted + playsInline so browsers
  // allow it. Mirrors `SelectedWork`. (Browsers block autoplay with sound.)
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

      // 1. Reveal + title — everyone without reduced-motion (incl. touch).
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const titleSplit = SplitText.create('#gamedev h2', { type: 'words' });
        const headerTl = gsap.timeline({
          scrollTrigger: { trigger: '#gamedev .header', start: 'top 80%' },
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
            '#gamedev .intro',
            { opacity: 0, y: 20, duration: 0.8, ease: EASE.reveal },
            '-=0.5',
          );

        // Reel clip-path reveal — wipe in from the left.
        gsap.fromTo(
          '#gamedev .reel',
          { clipPath: 'inset(0% 100% 0% 0%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.2,
            ease: EASE.reveal,
            scrollTrigger: {
              trigger: '#gamedev .reel',
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
          },
        );

        // Per-card clip-path reveal + overlay fade. One-shot on enter, stays put.
        const cards = gsap.utils.toArray('#gamedev .game-card');
        cards.forEach((card) => {
          const img = card.querySelector('.game-media');
          const meta = card.querySelector('.game-overlay');

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          });

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

      // 2. 3D-tilt hover — fine-pointer (desktop) only. One quickTo per axis,
      //    reused across mousemove events (no per-event tween churn).
      mm.add(
        { isDesktop: '(prefers-reduced-motion: no-preference) and (pointer: fine)' },
        (ctx) => {
          const cards = gsap.utils.toArray('#gamedev .game-card');

          cards.forEach((card) => {
            const img = card.querySelector('.game-media-wrap');
            if (!img) return;

            gsap.set(img, { transformPerspective: 900, transformOrigin: 'center' });

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

            // matchMedia cleanup. ctx.add() runs immediately and registers its
            // RETURN as cleanup — so return the cleanup, don't run it now.
            ctx.add(() => () => {
              card.removeEventListener('mousemove', onMove);
              card.removeEventListener('mouseleave', onLeave);
            });
          });
        },
      );

      // Media may shift layout on load → recalc trigger positions once ready.
      const imgs = gsap.utils.toArray('#gamedev img');
      const vids = gsap.utils.toArray('#gamedev video');
      Promise.all([
        ...imgs.map((img) =>
          img.complete
            ? Promise.resolve()
            : new Promise((res) => {
                img.onload = img.onerror = res;
              }),
        ),
        ...vids.map((video) =>
          video.readyState >= 1
            ? Promise.resolve()
            : new Promise((res) => {
                video.onloadeddata = video.onerror = res;
              }),
        ),
      ]).then(() => ScrollTrigger.refresh());

      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [] },
  );

  return (
    <section id="gamedev" ref={rootRef}>
      <div className="header container mx-auto 2xl:px-0 px-5">
        <div className="content">
          <div className="md:col-span-8">
            <p className="badge">Beyond the Code</p>
            <h2>
              Game Dev & <span className="text-yellow">Level Design</span>
            </h2>
          </div>
          <div className="sub-content">
            <p className="intro">
              Outside of front-end, I build games and design levels under Taco Monkey
              Studio — game-jam experiments and immersive shooters built in Unity.
            </p>
          </div>
        </div>
      </div>

      {/* Level-design reel — linked thumbnail (inline iframe is unplayable under
          Lenis; see the component docstring). */}
      <div className="reel-wrap container mx-auto 2xl:px-0 px-5">
        <a
          className="reel"
          href={gameReel.link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${gameReel.title} — open the level-design reel on YouTube in a new tab.`}
        >
          <img
            src={gameReel.poster}
            alt={`${gameReel.title} — level-design reel thumbnail`}
            className="reel-media"
            loading="lazy"
          />
          <span className="reel-play" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <span className="reel-caption">
            <span className="reel-title">{gameReel.title}</span>
            <span className="reel-blurb">{gameReel.caption}</span>
          </span>
        </a>
      </div>

      <div className="game-grid container mx-auto 2xl:px-0 px-5">
        {gameProjects.map((game) => (
          <a
            key={game.id}
            href={game.link}
            target="_blank"
            rel="noopener noreferrer"
            className="game-card"
            aria-label={`${game.name} — ${game.role}. Open in a new tab.`}
          >
            <div className="game-media-wrap">
              {game.video ? (
                <video
                  ref={(el) => {
                    videoRefs.current[game.id] = el;
                  }}
                  className="game-media"
                  poster={game.image}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                >
                  <source src={game.video} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={game.image}
                  alt={`${game.name} — ${game.role}`}
                  className="game-media"
                  loading="lazy"
                />
              )}
              <div className="game-overlay">
                <div className="game-meta">
                  <p className="game-role">{game.role}</p>
                  <h3 className="game-name">{game.name}</h3>
                  <p className="game-blurb">{game.blurb}</p>
                  <ul className="game-tags">
                    {game.tags.map((tag) => (
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

export default GameDev;
