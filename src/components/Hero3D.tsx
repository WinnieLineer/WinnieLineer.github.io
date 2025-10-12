import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Icosahedron, Torus } from '@react-three/drei';
import * as THREE from 'three';

// --- Floating Geometries Component ---
const FloatingShapes = () => {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
        <Torus args={[1.5, 0.2, 16, 100]}>
          <meshStandardMaterial color="#d1d1d1" metalness={0.9} roughness={0.1} />
        </Torus>
      </Float>
      {[...Array(6)].map((_, i) => (
        <Float key={i} speed={2} rotationIntensity={1} floatIntensity={2}>
          <Icosahedron 
            args={[0.3, 0]} 
            position={[
              Math.cos((i / 6) * Math.PI * 2) * 3,
              Math.sin((i / 6) * Math.PI * 2) * 1.5,
              Math.sin((i / 6) * Math.PI * 2) * 3
            ]}
          >
            <meshStandardMaterial color="#8A2BE2" metalness={0.8} roughness={0.2} />
          </Icosahedron>
        </Float>
      ))}
    </group>
  );
};

// --- Main 3D Scene Component ---
export const Hero3D = () => {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[15, 15, 15]} angle={0.2} penumbra={1} intensity={2} castShadow />
        <pointLight position={[-15, -15, -10]} intensity={1.5} color="#8A2BE2" />
        <Suspense fallback={null}>
          <FloatingShapes />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>

      {/* Overlay Text with Glitch Effect */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        color: 'white',
        pointerEvents: 'none',
      }}>
        <h1 style={{ fontSize: '4rem', fontWeight: 'bold', letterSpacing: '0.1em' }}>
          <span className="glitch" data-text="Shi Ting Lin">Shi Ting Lin</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#d1d1d1' }}>Senior Software Engineer</p>
      </div>
    </div>
  );
};
