import gsap from 'gsap';
import { SplitText } from 'gsap/all';
import { useGSAP } from '@gsap/react';

const About = () => {
  useGSAP(() => {
    const titleSplit = SplitText.create('#about h2', {
      type: 'words',
    });

    const scrollTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '#about',
        start: 'top center',
      },
    });

    scrollTimeline
      .from(titleSplit.words, {
        opacity: 0, duration: 1, yPercent: 100, ease: 'expo.out', stagger: 0.02,
      })
      .from('.top-grid div, .bottom-grid div', {
        opacity: 0, duration: 1, ease: 'power1.inOut', stagger: 0.04,
      }, '-=0.5');
  });

  return (
    <div id="projects">
      <div className="mb-16 md:px-0 px-5">
        <div className="content">
          <div className="md:col-span-8">
            <p className="badge">Projects</p>
            <h2>
              Where every idea comes to life <span className="text-white">-</span>
              no matter how big you dream it
            </h2>
          </div>

          <div className="sub-content">
            <p>
              Using the power of WebXR and VR, I build immersive experiences that are accessible
              across platforms
            </p>
          </div>
        </div>
      </div>

      <div className="top-grid">
        <div className="md:col-span-3">
          <a
            href="https://tacomonkeystudio.itch.io/ghost-attack"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer"
          >
            <img src="/images/ghost-attack.png" alt="Ghost Attack project" />
          </a>
        </div>

        <div className="md:col-span-6">
          <a
            href="https://mintsonthehouse.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer"
          >
            <img src="/images/port1.png" alt="Mints on the House project" />
          </a>
        </div>

        <div className="md:col-span-3">
          <a
            href="https://tacomonkeystudio.itch.io/tiny-rebels-v11"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer"
          >
            <img src="/images/tinyrebels.png" alt="Tiny Rebels project" />
          </a>
        </div>
      </div>

      <div className="bottom-grid">
        <div className="md:col-span-8">
          <a
            href="https://pangea.com.ve/"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer"
          >
            <img src="/images/port2.png" alt="Pangea project" />
          </a>
        </div>

        <div className="md:col-span-4">
          <a
            href="https://solucionesfino.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer"
          >
            <img src="/images/port4.png" alt="Soluciones Fino project" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
