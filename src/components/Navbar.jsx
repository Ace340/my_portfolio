import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Link, NavLink, useLocation } from 'react-router';

import { navLinks } from '../../constants/index.js';
import { EASE } from '../motion/easings.js';

const Navbar = () => {
  const { pathname } = useLocation();

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
        {/* The logo always returns to the Primary Identity's page (ADR-0005). */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/images/logoace2.png" alt="logo" className="w-[50px] h-[50px]" />
          <p>Juan Acevedo</p>
        </Link>

        <ul>
          {navLinks.map((link) => (
            <li key={link.id}>
              {link.to ? (
                /* Route link — the Second Identity's page (ADR-0005). NavLink
                   sets aria-current="page" when active; styled in index.css. */
                <NavLink to={link.to}>{link.title}</NavLink>
              ) : pathname === '/' ? (
                /* Section anchor on the main page — Lenis smooth-scrolls
                   these (`anchors: true` in useSmoothScroll). */
                <a href={`#${link.id}`}>{link.title}</a>
              ) : (
                /* Cross-page section link — lands on the main page's section. */
                <Link to={`/#${link.id}`}>{link.title}</Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
