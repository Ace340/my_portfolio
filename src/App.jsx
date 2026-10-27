import gsap from 'gsap';
import { ScrollTrigger, SplitText } from 'gsap/all';
import { Route, Routes } from 'react-router';

import Navbar from './components/Navbar.jsx';
import LiveProof from './components/LiveProof.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import MainPage from './pages/MainPage.jsx';
import VideoEditingPage from './pages/VideoEditingPage.jsx';
import { useSmoothScroll } from './motion/useSmoothScroll.js';

gsap.registerPlugin(ScrollTrigger, SplitText);

const App = () => {
  // Motion spine (plan.md §5): Lenis smooth-scroll synced to ScrollTrigger.
  // Created ONCE here — it outlives route changes; ScrollToTop resets its
  // position when the route changes. Reduced-motion users fall back to
  // native scroll inside the hook.
  useSmoothScroll();

  // Route shell (ADR-0005): shared brand chrome (Live Proof + Navbar) renders
  // on every identity page; each page owns its own <main> composition.
  return (
    <>
      {/* Live Proof — site-wide ambient shader background (starts after each
          page's hero; each hero occludes it with an opaque backing).
          plan.md §5C, ADR-0003. */}
      <LiveProof />
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/video-editing" element={<VideoEditingPage />} />
      </Routes>
    </>
  );
};

export default App;
