import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Text } from '@react-three/drei';
import * as THREE from 'three';

// --- Interactive Folder Component ---
const Folder = ({ text, onClick, ...props }: any) => {
  const [hovered, setHover] = useState(false);
  const groupRef = useRef<THREE.Group>(null!);
  const frontTextRef = useRef<THREE.Mesh>(null!);
  const backTextRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (groupRef.current) {
      const targetScale = hovered ? 1.1 : 1;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

      const targetColor = hovered ? new THREE.Color('#8A2BE2') : new THREE.Color('#000000');
      groupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          child.material.emissive.lerp(targetColor, 0.1);
        }
      });

      const camera = state.camera;
      const folderNormal = new THREE.Vector3(0, 0, 1);
      folderNormal.applyQuaternion(groupRef.current.quaternion);

      const cameraDirection = new THREE.Vector3();
      camera.getWorldDirection(cameraDirection);

      if (folderNormal.dot(cameraDirection) < 0) {
        if (frontTextRef.current) frontTextRef.current.visible = true;
        if (backTextRef.current) backTextRef.current.visible = false;
      } else {
        if (frontTextRef.current) frontTextRef.current.visible = false;
        if (backTextRef.current) backTextRef.current.visible = true;
      }
    }
  });

  return (
    <group {...props} ref={groupRef} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)} onClick={onClick}>
      <mesh>
        <boxGeometry args={[2.8, 1.0, 0.05]} />
        <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.1} transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-1.1, 0.5, 0.01]}>
        <boxGeometry args={[0.7, 0.2, 0.05]} />
        <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.1} transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      <Text ref={frontTextRef} fontSize={0.22} color={hovered ? 'white' : '#cccccc'} position={[-1.1, 0.5, 0.04]} anchorX="center" anchorY="middle">
        {text}
      </Text>
      <Text ref={backTextRef} fontSize={0.22} color={hovered ? 'white' : '#cccccc'} position={[-1.1, 0.5, -0.04]} rotation={[0, Math.PI, 0]} anchorX="center" anchorY="middle">
        {text}
      </Text>
    </group>
  );
};

// --- Scene Content Component ---
const SceneContent = ({ onPanelClick, isInteracting }: { onPanelClick: (section: string) => void; isInteracting: boolean }) => {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (groupRef.current && !isInteracting) {
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.1) * 0.3;
    }
  });

  return (
    <Suspense fallback={null}>
      <group ref={groupRef}>
        <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.2}>
          <Folder text="Profile" position={[-2.5, 2, 0]} rotation={[0, 0, 0.05]} onClick={() => onPanelClick('profile')} />
        </Float>
        <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.2}>
          <Folder text="Experience" position={[2.5, 1, 0]} rotation={[0, 0, -0.05]} onClick={() => onPanelClick('experience')} />
        </Float>
        <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.2}>
          <Folder text="Skills" position={[-2.5, -1, 0]} rotation={[0, 0, 0.05]} onClick={() => onPanelClick('skills')} />
        </Float>
        <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.2}>
          <Folder text="Contact" position={[2.5, -2, 0]} rotation={[0, 0, -0.05]} onClick={() => onPanelClick('contact')} />
        </Float>
      </group>
      <Environment preset="city" />
    </Suspense>
  );
};

// --- Main 3D Scene Component ---
export const Hero3D = ({ onPanelClick }: { onPanelClick: (section: string) => void }) => {
  const [isInteracting, setInteracting] = useState(false);

  return (
    <div 
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh', cursor: isInteracting ? 'grabbing' : 'grab', zIndex: 1 }}
      onPointerDown={() => setInteracting(true)}
      onPointerUp={() => setInteracting(false)}
    >
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
        <pointLight position={[-10, -10, -10]} intensity={1.5} color="#8A2BE2" />
        <SceneContent onPanelClick={onPanelClick} isInteracting={isInteracting} />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', color: 'white', pointerEvents: 'none', zIndex: 2 }}>
        <h1 style={{ fontSize: '4rem', fontWeight: 'bold', letterSpacing: '0.1em' }}>
          <span className="glitch" data-text="Shi Ting Lin">Shi Ting Lin</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#d1d1d1' }}>Senior Software Engineer</p>
      </div>
    </div>
  );
};
