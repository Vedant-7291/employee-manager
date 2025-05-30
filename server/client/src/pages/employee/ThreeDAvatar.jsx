import { Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { gsap } from 'gsap';

function AvatarModel({ modelPath }) {
  const { scene } = useGLTF(modelPath);
  return <primitive object={scene} scale={0.8} position={[0, -0.5, 0]} />;
}

function ThreeDAvatar({ modelPath = '/models/avatar.glb' }) {
  const canvasRef = useRef();
  
  useEffect(() => {
    const animation = gsap.to(canvasRef.current, {
      duration: 3,
      y: 5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    
    return () => {
      animation.kill();
    };
  }, []);

  return (
    <div className="w-full h-full" ref={canvasRef}>
      <Canvas camera={{ position: [0, 0, 2], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Suspense fallback={null}>
          <AvatarModel modelPath={modelPath} />
        </Suspense>
        <OrbitControls 
          enableZoom={false} 
          autoRotate 
          autoRotateSpeed={1.5}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}

// Preload models
useGLTF.preload('/models/avatar.glb');

export default ThreeDAvatar;