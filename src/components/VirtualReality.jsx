import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useMediaQuery } from 'react-responsive';
import { useGSAP } from '@gsap/react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { featureLists, goodLists } from '../../constants/index.js';

const VirtualReality = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const modelRef = useRef(null);

  // Set up Three.js scene
  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });
    renderer.setSize(500, 500); // Adjust size as needed
    renderer.setPixelRatio(window.devicePixelRatio);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);

    // Load 3D model
    const loader = new GLTFLoader();
    loader.load(
      '/models/vrheadset.glb', // Path to your GLTF model
      (gltf) => {
        modelRef.current = gltf.scene;
        scene.add(modelRef.current);
        // Center and scale the model
        const box = new THREE.Box3().setFromObject(modelRef.current);
        const center = box.getCenter(new THREE.Vector3());
        modelRef.current.position.sub(center);
        // Adjust scale based on device
        const scale = isMobile ? 2 : 4; // Smaller scale for mobile
        modelRef.current.scale.set(scale, scale, scale);
      },
      undefined,
      (error) => console.error('Error loading GLTF model:', error)
    );

    // Animation loop with rotation
    const animate = () => {
      requestAnimationFrame(animate);
      if (modelRef.current) {
        modelRef.current.rotation.y += 0.01; // Continuous rotation around Y-axis
      }
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      const { clientWidth, clientHeight } = canvasRef.current.parentElement;
      renderer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  useGSAP(() => {
    const start = isMobile ? 'top 20%' : 'top top';

    const maskTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '#virtual-reality',
        start,
        end: 'bottom center',
        scrub: 1.5,
        pin: true,
      },
    });

    maskTimeline
      .to('.will-fade', { opacity: 0, stagger: 0.2, ease: 'power1.inOut' })
      .to('#masked-content', { opacity: 1, duration: 1, ease: 'power1.inOut' });
  }, []);

  return (
    <div id="virtual-reality">
      <div className="container mx-auto h-full pt-20">
        <h2 className="will-fade">The Future</h2>

        <div className="content">
          <ul className="space-y-4 will-fade">
            {goodLists.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <img src="/images/check.png" alt="check" />
                <p>{feature}</p>
              </li>
            ))}
          </ul>

          <div className="cocktail-img">
            <canvas
              ref={canvasRef}
              className="abs-center size-full object-contain"
            />
          </div>

          <ul className="space-y-4 will-fade">
            {featureLists.map((feature, index) => (
              <li key={index} className="flex items-center justify-start gap-2">
                <img src="/images/check.png" alt="check" />
                <p className="md:w-fit w-60">{feature}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="masked-container">
          <h2 className="will-fade">Bring ideas to life</h2>
          <div id="masked-content">
            <h3>Reality is no longer the limit</h3>
            <p>A VR Experience can communicate more than thousand words.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualReality;