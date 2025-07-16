import gsap from 'gsap';
import { ScrollTrigger, SplitText } from "gsap/all";

import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Art from './components/Art.jsx'
import Menu from './components/Menu.jsx'
import Contact from './components/Contact.jsx'
import Techstack from './components/Techstack.jsx'
import VirtualReality from './components/VirtualReality.jsx';

gsap.registerPlugin(ScrollTrigger, SplitText);

const App = () => {
 return (
	<main>
	 <Navbar />
	 <Hero />
	 <Techstack />
	 <About />
	 <VirtualReality />
	 {/* <Art /> */}
	 <Menu />
	 <Contact />
	</main>
 )
}

export default App
