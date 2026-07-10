import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import { navLinks } from '../../constants/index.js';
import { EASE } from '../motion/easings.js';

const Navbar = () => {
  useGSAP(() => {
    const navTween = gsap.timeline({
      scrollTrigger: {
        trigger: 'nav',
        start: 'bottom top',
      },
    });

    navTween.fromTo('nav', { backgroundColor: 'transparent' }, {
      backgroundColor: '#00000050',
      backgroundFilter: 'blur(10px)',
      duration: 1,
      ease: EASE.ui,
    });
  });

  return (
    <nav>
      <div>
        <a href="#home" className="flex items-center gap-2">
          <img src="/images/logoace2.png" alt="logo" className="w-[50px] h-[50px]" />
          <p>Juan Acevedo</p>
        </a>

        <ul>
          {navLinks.map((link) => (
            <li key={link.id}>
              <a href={`#${link.id}`}>{link.title}</a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
