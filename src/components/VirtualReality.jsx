import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useMediaQuery } from 'react-responsive';
import { useGSAP } from '@gsap/react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { featureLists, goodLists } from '../../constants/index.js';

// Three.js scene configuration
const SCENE_CONFIG = {
  fov: 75,
  aspect: 1,
  near: 0.1,
  far: 1000,
  cameraZ: 5,
  initialSize: 500,
  ambientIntensity: 0.5,
  directionalIntensity: 0.5,
  rotationSpeed: 0.01,
};

const getModelScale = (isMobile) => (isMobile ? 2 : 4);

const VirtualReality = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const canvasRef = useRef(null);
  const modelRef = useRef(null);

  // Set up Three.js scene
  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      SCENE_CONFIG.fov,
      SCENE_CONFIG.aspect,
      SCENE_CONFIG.near,
      SCENE_CONFIG.far,
    );
    camera.position.z = SCENE_CONFIG.cameraZ;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });
    renderer.setSize(SCENE_CONFIG.initialSize, SCENE_CONFIG.initialSize);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, SCENE_CONFIG.ambientIntensity);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, SCENE_CONFIG.directionalIntensity);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);

    // Load 3D model
    const loader = new GLTFLoader();
    loader.load(
      '/models/vrheadset.glb',
      (gltf) => {
        modelRef.current = gltf.scene;
        scene.add(modelRef.current);
        // Center and scale the model
        const box = new THREE.Box3().setFromObject(modelRef.current);
        const center = box.getCenter(new THREE.Vector3());
        modelRef.current.position.sub(center);
        modelRef.current.scale.setScalar(getModelScale(isMobile));
      },
      undefined,
      (error) => console.error('Error loading GLTF model:', error),
    );

    // Animation loop with rotation
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (modelRef.current) {
        modelRef.current.rotation.y += SCENE_CONFIG.rotationSpeed;
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
      cancelAnimationFrame(animationFrameId);
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
