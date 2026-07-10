const navLinks = [
 {
	id: "techstack",
	title: "Tech Stack",
 },
 {
	id: "projects",
	title: "Projects",
 },
 {
	id: "menu",
	title: "About",
 },
 {
	id: "contact",
	title: "Contact",
 },
];

const techStacks = [
 {
	name: "React",
	language: "JavaScript, TypeScript",
	frameworks: "NextJs, Vite, ThreeJs",
 },
 {
 	name: "Unity Engine",
 	language: "C#",
 	frameworks: "Game Development, Level Design",
 },
 {
 	name: "SiteFinity",
	language: "C#",
	frameworks: ".NET Core",
 },
];

const workExperience = [
 {
	name: "Web Developer",
	country: "CA",
	company: "Grand Erie District School Board",
	status: "Current",
 },
 {
	name: "Partnership Manager",
	country: "CH",
	company: "Pagsmile",
	status: "Sep 22 - Feb 24",
 },
 {
	name: "System Analyst Developer",
	country: "PE",
	company: "JAMSOFT",
	status: "Jul 20 - Dec 21",
 },
];

const socials = [
 {
	name: "Instagram",
	icon: "/images/insta.png",
	url: "https://www.instagram.com/ace340/",
 },
 {
	name: "Linkedin",
	icon: "/images/linkedin-logo2.png",
	url: "https://www.linkedin.com/in/juan-aceved0/",
 },
];

const allPassions = [
 {
	id: 1,
	name: "Taco Monkey Studio",
	image: "/images/whitelogo.png",
	title: "Videogame Studio",
	description:
	 "Developing the Videogames of the future. News about latest VR techonologies and new Games in the industry.",
	media: "https://www.youtube.com/@TacoMonkeyStudio",
 },
 {
	id: 2,
	name: "La Playa Vision",
	image: "/images/playavision.png",
	title: "The world from a different perspective",
	description:
	 "Exploring the world with my camera. Discovering secret spots on every trip I make.",
	media: "https://www.youtube.com/@LaPlayaVision",
 },
 {
	id: 3,
	name: "Mints on The house",
	image: "/images/mints.png",
	title: "Who the F*ck eats Mints?",
	description:
	 "Music, friends and art. Giving happiness to the world through House Music.",
	media: "https://www.youtube.com/@MINTSOnTheHouse",
 },
];

// Selected Work — front-end case studies (plan.md §4.3 "Selected Work").
// Ordered: lead project first. Chromattic is the strongest front-end craft showcase.
// NOTE: `image` is a placeholder for most entries — swap for fresh screenshots /
// short screen-recordings when ready (docs/next-steps.md assets checklist).
const caseStudies = [
	{
		id: "chromattic",
		name: "Chromattic",
		role: "Color palette generator",
		blurb:
			"AI-powered five-color palette tool — harmony generation, on-device image extraction, live WCAG contrast checks, and one-click export to CSS / Tailwind / JSON.",
		tags: ["Next.js", "AI", "Color Theory"],
		link: "https://chromattic.app",
		image: "/images/port3.PNG", // poster frame — swap for a real Chromattic still later
		video: "/videos/chromattic-showcase.mp4",
		featured: true,
		span: "lg:col-span-8",
	},
	{
		id: "mints",
		name: "Mints on the House",
		role: "Band site",
		blurb:
			"Band site with a WebGL hero and animated setlist. Built the front-end in React + Three.js.",
		tags: ["React", "Three.js", "GSAP"],
		link: "https://mintsonthehouse.com/",
		image: "/images/port1.png",
		featured: false,
		span: "lg:col-span-4",
	},
	{
		id: "pangea",
		name: "Pangea",
		role: "Front-end site",
		blurb:
			"Marketing site built to communicate the brand and convert visitors into clients.",
		tags: ["Front-end", "Responsive"],
		link: "https://pangea.com.ve/",
		image: "/images/port2.png",
		featured: false,
		span: "lg:col-span-4",
	},
	{
		id: "soluciones-fino",
		name: "Soluciones Fino",
		role: "Front-end site",
		blurb:
			"Business site with a clean, fast, mobile-first front-end and a clear service funnel.",
		tags: ["Front-end", "Mobile-first"],
		link: "https://solucionesfino.com/",
		image: "/images/port4.png",
		featured: false,
		span: "lg:col-span-8",
	},
];

export {
 navLinks,
 techStacks,
 workExperience,
 socials,
 allPassions,
 caseStudies,
};
