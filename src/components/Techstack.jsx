import { useGSAP } from '@gsap/react'
import gsap from 'gsap';
import { techStacks, workExperience } from '../../constants/index.js'

const Techstack = () => {
 useGSAP(() => {
	const parallaxTimeline = gsap.timeline({
	 scrollTrigger: {
		trigger: '#techstack',
		start: 'top 30%',
		end: 'bottom 80%',
		scrub: true,
	 }
	})
	
	parallaxTimeline
	 .from('#c-left-leaf', {
		x: -100, y: 100
	})
	 .from('#c-right-leaf', {
		x: 100, y: 100
	})
 })
 
 return (
	<section id="techstack" className="noisy">
	 <img src="/images/whitelogo.png" alt="taco-monkey-logo" id="c-left-leaf" />
	 <img src="/images/whitelogo.png" alt="taco-monkey-logo" id="c-right-leaf" />
	 
	 <div className="list">
		<div className="popular">
		 <h2>My Tech Stack:</h2>
		 
		 <ul>
			{techStacks.map(({ name, language, frameworks }) => (
			 <li key={name}>
				<div className="md:me-28">
				 <h3>{name}</h3>
				 <p>{language} | {frameworks}</p>
				</div>
			 </li>
			))}
		 </ul>
		</div>
		
		<div className="experience">
		 <h2>Work Experience:</h2>
		 
		 <ul>
			{workExperience.map(({ name, country, company, status }) => (
			 <li key={name}>
				<div className="me-28">
				 <h3>{name}</h3>
				 <p>{country} | {company}</p>
				</div>
				<span>{status}</span>
			 </li>
			))}
		 </ul>
		</div>
	 </div>
	</section>
 )
}

export default Techstack
