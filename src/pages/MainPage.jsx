import About from '../components/About.jsx';
import BridgeCta from '../components/BridgeCta.jsx';
import Contact from '../components/Contact.jsx';
import GameDev from '../components/GameDev.jsx';
import Hero from '../components/Hero.jsx';
import SelectedWork from '../components/SelectedWork.jsx';
import { bridges } from '../../constants/index.js';

// The Primary Identity's landing page — the main-site Funnel (CONTEXT.md):
// the hero and the dominant real estate belong to the Front-end Creative
// Developer. Composition moved verbatim from App.jsx when routing landed
// (ADR-0005) — no behavior change.
const MainPage = () => (
  <main>
    <Hero />
    <About />
    {/* <Techstack /> — commented out; rebuild front-end-focused (plan.md §4.4) */}
    <SelectedWork />
    <GameDev />
    {/* <Passions /> — commented out; legacy carousel. The Film & Photography
        showcase's canonical home is now /video-editing (ADR-0005); this page
        keeps only the Bridge below. */}
    {/* Bridge — hands visitors to the Second Identity's page (CONTEXT.md). */}
    <BridgeCta {...bridges.toVideo} />
    <Contact />
  </main>
);

export default MainPage;
