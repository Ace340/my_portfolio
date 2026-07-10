import gsap from 'gsap';
import { ScrollTrigger, SplitText } from 'gsap/all';

import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Contact from './components/Contact.jsx';
import Techstack from './components/Techstack.jsx';
import Passions from './components/Passions.jsx';
import { useSmoothScroll } from './motion/useSmoothScroll.js';

gsap.registerPlugin(ScrollTrigger, SplitText);

const App = () => {
  // Motion spine (plan.md §5): Lenis smooth-scroll synced to ScrollTrigger.
  // Reduced-motion users fall back to native scroll inside the hook.
  useSmoothScroll();

  return (
    <main>
      <Navbar />
      <Hero />
      <Techstack />
      <About />
      <Passions />
      <Contact />
    </main>
  );
};

export default App;
