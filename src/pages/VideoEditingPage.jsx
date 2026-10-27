import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import BridgeCta from '../components/BridgeCta.jsx';
import { bridges, videoChannels, videoPage } from '../../constants/index.js';

/**
 * VideoEditingPage — the Second Identity's page (CONTEXT.md "Second Identity",
 * ADR-0005). Its own funnel: the video portfolio comes first (cold-landing
 * visitors from YouTube links land here), with a Bridge back to the Primary
 * Identity — the page's cold-landing protection.
 *
 * Scaffold pass: hero copy and channel presentations are placeholders pending
 * the design pass — routing, shared brand, and Bridges are the deliverable.
 */
const VideoEditingPage = () => {
  // Entry reveal — modest by design: this hero must not rival the main site's
  // Signature Moment (CONTEXT.md). Refine in the design pass.
  useGSAP(() => {
    gsap.from('.video-reveal', {
      yPercent: 40,
      opacity: 0,
      duration: 1.1,
      ease: 'expo.out',
      stagger: 0.08,
    });
  }, []);

  return (
    <main>
      {/* Hero — opaque bg-black + .hero-backing mask so the site-wide Live
          Proof field starts AFTER this page's hero (ADR-0003 pattern). */}
      <section className="hero-backing relative z-10 flex min-h-dvh w-full items-center bg-black px-5">
        <div className="container mx-auto text-center">
          <p className="video-reveal mb-6 text-xs uppercase tracking-[0.3em] text-accent">
            {videoPage.eyebrow}
          </p>
          <h1 className="video-reveal font-modern-negra text-6xl leading-none md:text-8xl">
            {videoPage.title}
          </h1>
          <p className="video-reveal mx-auto mt-8 max-w-2xl text-lg text-white/85">
            {videoPage.tagline}
          </p>
        </div>
      </section>

      {/* Channels — the Second Identity's portfolio (CONTEXT.md "La Playa
          Vision", "Destapando el Arte"). */}
      <section id="channels" className="container mx-auto px-5 py-28">
        <h2 className="mb-16 max-w-lg font-modern-negra text-4xl md:text-5xl">
          {videoPage.channelsTitle}
        </h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {videoChannels.map((channel) => (
            <article
              key={channel.id}
              className="relative h-80 overflow-hidden rounded-3xl md:h-96"
            >
              {channel.image ? (
                <img
                  src={channel.image}
                  alt={channel.name}
                  className="block h-full w-full object-cover"
                />
              ) : (
                <div className="radial-gradient flex h-full w-full items-center justify-center">
                  <span className="font-modern-negra text-7xl text-white/20">
                    {channel.name.charAt(0)}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/35 to-transparent p-6 md:p-8">
                <p className="mb-2 text-xs uppercase tracking-[0.2em] text-accent">
                  {channel.tagline}
                </p>
                <h3 className="mb-2 font-modern-negra text-3xl md:text-4xl">
                  {channel.name}
                </h3>
                <p className="mb-4 text-sm text-white/80 md:text-base">
                  {channel.description}
                </p>
                {channel.url ? (
                  <a
                    href={channel.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold hover:text-accent"
                  >
                    Watch on YouTube ↗
                  </a>
                ) : (
                  <span className="text-sm text-white/50">
                    {videoPage.urlPendingLabel}
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Bridge — the glimpse back to web development (CONTEXT.md "Bridge"). */}
      <BridgeCta {...bridges.toWebDev} />
    </main>
  );
};

export default VideoEditingPage;
