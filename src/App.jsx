import gsap from 'gsap';
import { ScrollTrigger, SplitText } from 'gsap/all';

import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import SelectedWork from './components/SelectedWork.jsx';
import Contact from './components/Contact.jsx';
import Techstack from './components/Techstack.jsx';
import Passions from './components/Passions.jsx';
import LiveProof from './components/LiveProof.jsx';
import { useSmoothScroll } from './motion/useSmoothScroll.js';

gsap.registerPlugin(ScrollTrigger, SplitText);

const App = () => {
  // Motion spine (plan.md §5): Lenis smooth-scroll synced to ScrollTrigger.
  // Reduced-motion users fall back to native scroll inside the hook.
  useSmoothScroll();

  return (
    <>
      {/* Live Proof — site-wide ambient shader background (starts after the hero;
          the hero occludes it with an opaque backing). plan.md §5C, ADR-0003. */}
      <LiveProof />
      <main>
        <Navbar />
        <Hero />
        <About />
        <Techstack />
        <SelectedWork />
        <Passions />
        <Contact />
      </main>
    </>
  );
};

export default App;
