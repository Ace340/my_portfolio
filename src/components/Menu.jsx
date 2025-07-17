'use client';

import { allPassions } from '../../constants/index.js'
import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap';

const Menu = () => {
 const contentRef = useRef();
 const [currentIndex, setCurrentIndex] = useState(0);
 
 useGSAP(() => {
	gsap.fromTo('#title', { opacity: 0 }, { opacity: 1, duration: 1 });
	gsap.fromTo('.cocktail img', { opacity: 0, xPercent: -100 }, {
	 xPercent: 0, opacity: 1, duration: 1, ease: 'power1.inOut'
	})
	gsap.fromTo('.details h2', { yPercent: 100, opacity: 0 }, {
	 yPercent: 0, opacity: 100, ease: 'power1.inOut'
	})
	gsap.fromTo('.details p', { yPercent: 100, opacity: 0 }, {
	 yPercent: 0, opacity: 100, ease: 'power1.inOut'
	})
 }, [currentIndex]);
 
 const totalPassions = allPassions.length;
 
 const goToSlide = (index) => {
	const newIndex = (index + totalPassions) % totalPassions;
	
	setCurrentIndex(newIndex);
 }
 
 const getPassionAt = (indexOffset) => {
	return allPassions[(currentIndex + indexOffset + totalPassions) % totalPassions]
 }
 
 const currentPassion = getPassionAt(0);
 const prevPassion = getPassionAt(-1);
 const nextPassion = getPassionAt(1);
 
 return (
	<section id="menu" aria-labelledby="menu-heading">
	 
	 <h2 id="menu-heading" className="sr-only">
		My Passions
	 </h2>
	 
	 <nav className="cocktail-tabs" aria-label="Cocktail Navigation">
		{allPassions.map((cocktail, index) => {
		 const isActive = index === currentIndex;
		 
		 return (
			<button key={cocktail.id} className={`
				${isActive
				 ? 'text-white border-white'
				 : 'text-white/50 border-white/50'}
			 `}	onClick={() => goToSlide(index)}
			>
			 {cocktail.name}
			</button>
		 )
		})}
	 </nav>
	 
	 <div className="content">
		<div className="arrows">
		 <button className="text-left" onClick={() => goToSlide(currentIndex - 1)}>
			<span>{prevPassion.name}</span>
			<img src="/images/right-arrow.png" alt="right-arrow" aria-hidden="true" />
		 </button>
		 
		 <button className="text-left" onClick={() => goToSlide(currentIndex + 1)}>
			<span>{nextPassion.name}</span>
			<img src="/images/left-arrow.png" alt="left-arrow" aria-hidden="true" />
		 </button>
		</div>
		
		<div className="cocktail">
			<a href={currentPassion.media} target='_blank'><img src={currentPassion.image} className="object-contain"/></a>		 
		</div>
		
		<div className="recipe">
		 <div ref={contentRef} className="info">
			<p id="title">{currentPassion.name}</p>
		 </div>
		 
		 <div className="details">
			<h2>{currentPassion.title}</h2>
			<p>{currentPassion.description}</p>
		 </div>
		</div>
	 </div>
	</section>
 )
}
export default Menu
