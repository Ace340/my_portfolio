import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import { reelHero, videoPage } from '../../../constants/index.js';

/**
 * ReelHero — the video page's hero: the Reel as proof-of-work (CONTEXT.md
 * "Reel", ADR-0006). Deliberately NOT a second Signature Moment: a
 * chrome-less, muted, looping self-hosted excerpt in a contained stage card
 * (not a full-bleed backdrop — the ambient shader stays recessive), while
 * the full Reel (sound on) is one handoff away on its canonical channel
 * (watchUrl, pinned in ADR-0006).
 *
 * Unlike the main site's hero, this hero does NOT occlude the site-wide
 * Live Proof field (owner request, 2026-11-23): the contained card keeps the
 * Reel opaque and dominant while the ambient shader shows through around it —
 * recessive per CONTEXT.md "Live Proof" ("a shared recessive background …
 * never rivals the hero"). Readability holds: the field is calm and dark by
 * default (brand navy).
 *
 * Until the excerpt MP4 is rendered (TODO in constants), the video fails
 * silently and the stage shows its poster — graceful degradation.
 */
const ReelHero = () => {
    // Entry reveal — modest by design: this hero must not rival the main
    // site's Signature Moment (CONTEXT.md).
    useGSAP(
        () => {
            gsap.from('.video-reveal', {
                yPercent: 40,
                opacity: 0,
                duration: 1.1,
                ease: 'expo.out',
                stagger: 0.08,
            });
        },
        { scope: '#reel-hero' },
    );

    // Transparent section: the Live Proof field shows through from the very
    // top (shared chrome continuity with the main site). Contrast for the
    // copy comes from the field's dark ambient base.
    return (
        <section id="reel-hero">
            <div className="container mx-auto px-5 text-center">
                <p className="video-reveal mb-6 text-xs uppercase tracking-[0.3em] text-accent">
                    {videoPage.eyebrow}
                </p>
                <h1 className="video-reveal font-modern-negra text-6xl leading-none md:text-8xl">
                    {videoPage.title}
                </h1>
                <p className="video-reveal mx-auto mt-8 max-w-2xl text-lg text-white/85">
                    {videoPage.tagline}
                </p>

                {/* The stage — contained card (repo-reel pattern, cf. #gamedev
                    .reel): muted looping excerpt, chrome-less; caption carries
                    the Reel's name and the watch-with-sound handoff to the
                    canonical channel. */}
                <div className="video-reveal reel-stage">
                    <video
                        className="reel-media"
                        src={reelHero.loopVideo}
                        poster={reelHero.poster}
                        muted
                        playsInline
                        autoPlay
                        loop
                        preload="metadata"
                        aria-hidden="true"
                    />

                    <div className="reel-caption">
                        <p className="reel-title">{reelHero.reelTitle}</p>
                        <a
                            className="reel-cta"
                            href={reelHero.watchUrl}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {reelHero.watchLabel}
                            <span aria-hidden="true">↗</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ReelHero;
