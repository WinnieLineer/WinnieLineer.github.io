import { Suspense, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// ─── Folder config ────────────────────────────────────────────────────────────

interface FolderConfig {
  text: string;
  icon: string;
  color: string;
  position: [number, number, number];
  rotation: [number, number, number];
  floatSpeed: number;
  floatIntensity: number;
  section: string;
}

const FOLDERS: FolderConfig[] = [
  { text: 'Profile',    icon: '🧑‍💻', color: '#a78bfa', position: [-2.6, 1.9, 0],  rotation: [0, 0,  0.05], floatSpeed: 0.5,  floatIntensity: 0.25, section: 'profile'    },
  { text: 'Experience', icon: '💼',   color: '#34d399', position: [ 2.6, 1.0, 0],  rotation: [0, 0, -0.05], floatSpeed: 0.65, floatIntensity: 0.30, section: 'experience' },
  { text: 'Skills',     icon: '⚙️',   color: '#60a5fa', position: [-2.6,-1.1, 0],  rotation: [0, 0,  0.05], floatSpeed: 0.45, floatIntensity: 0.20, section: 'skills'     },
  { text: 'Contact',    icon: '✉️',   color: '#f59e0b', position: [ 2.6,-2.0, 0],  rotation: [0, 0, -0.05], floatSpeed: 0.55, floatIntensity: 0.22, section: 'contact'    },
];

// ─── Background particle field ────────────────────────────────────────────────

const ParticleField = () => {
  const pointsRef = useRef<THREE.Points>(null!);
  const count = 60;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6 - 3;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.015;
      pointsRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.008) * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#a78bfa"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
};

// ─── Single Folder ────────────────────────────────────────────────────────────

const Folder = ({ cfg, onClick }: { cfg: FolderConfig; onClick: () => void }) => {
  const [hovered, setHover]   = useState(false);
  const [clicked, setClicked] = useState(false);
  const groupRef = useRef<THREE.Group>(null!);
  const ringRef  = useRef<THREE.LineLoop>(null!);

  const baseColor  = useMemo(() => new THREE.Color(cfg.color),     [cfg.color]);
  const blackColor = useMemo(() => new THREE.Color('#000000'),      []);
  const whiteColor = useMemo(() => new THREE.Color('#ffffff'),      []);
  const dimColor   = useMemo(() => new THREE.Color('#888888'),      []);

  // Pre-build ring geometry (inset rectangle)
  const ringGeo = useMemo(() => {
    const w = 2.6, h = 0.9;
    const pts = [
      new THREE.Vector3(-w / 2 + 0.08,  h / 2 - 0.08, 0.035),
      new THREE.Vector3( w / 2 - 0.08,  h / 2 - 0.08, 0.035),
      new THREE.Vector3( w / 2 - 0.08, -h / 2 + 0.08, 0.035),
      new THREE.Vector3(-w / 2 + 0.08, -h / 2 + 0.08, 0.035),
    ];
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  const handleClick = () => {
    setClicked(true);
    onClick();
    setTimeout(() => setClicked(false), 350);
  };

  useFrame(() => {
    if (!groupRef.current) return;

    // Scale: pulse on click, grow on hover
    const targetScale = clicked ? 1.14 : hovered ? 1.08 : 1.0;
    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      clicked ? 0.25 : 0.1
    );

    // Emissive glow on body meshes
    const targetEmissive = hovered ? baseColor : blackColor;
    groupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        child.material.emissive.lerp(targetEmissive, 0.12);
        child.material.emissiveIntensity = hovered ? 0.35 : 0.0;
      }
    });

    // Ring colour
    if (ringRef.current) {
      const mat = ringRef.current.material as THREE.LineBasicMaterial;
      const target = hovered ? whiteColor : dimColor;
      mat.color.lerp(target, 0.1);
      mat.opacity = hovered ? 1 : 0.4;
    }
  });

  return (
    <group
      ref={groupRef}
      position={cfg.position}
      rotation={cfg.rotation}
      onPointerOver={(e) => { e.stopPropagation(); setHover(true); }}
      onPointerOut={() => setHover(false)}
      onClick={(e) => { e.stopPropagation(); handleClick(); }}
    >
      {/* ── Folder body ── */}
      <RoundedBox args={[2.8, 1.0, 0.07]} radius={0.06} smoothness={4}>
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.85}
          roughness={0.15}
          transparent
          opacity={0.18}
          side={THREE.DoubleSide}
        />
      </RoundedBox>

      {/* ── Tab (top-left) ── */}
      <RoundedBox args={[0.85, 0.22, 0.06]} radius={0.04} smoothness={3} position={[-1.0, 0.54, 0]}>
        <meshStandardMaterial
          color={cfg.color}
          metalness={0.7}
          roughness={0.2}
          transparent
          opacity={0.55}
          side={THREE.DoubleSide}
        />
      </RoundedBox>

      {/* ── Accent colour stripe (bottom edge) ── */}
      <mesh position={[0, -0.45, 0.038]}>
        <planeGeometry args={[2.5, 0.015]} />
        <meshStandardMaterial color={cfg.color} emissive={cfg.color} emissiveIntensity={1.2} transparent opacity={0.7} />
      </mesh>

      {/* ── Glowing inner ring ── */}
      <lineLoop ref={ringRef} geometry={ringGeo}>
        <lineBasicMaterial color="#888888" transparent opacity={0.4} linewidth={1} />
      </lineLoop>

      {/* ── Icon (large, centred) ── */}
      <Text
        fontSize={0.38}
        position={[-0.62, 0.0, 0.05]}
        anchorX="center"
        anchorY="middle"
        color={hovered ? '#ffffff' : cfg.color}
      >
        {cfg.icon}
      </Text>

      {/* ── Label ── */}
      <Text
        fontSize={0.21}
        fontWeight={700}
        position={[0.28, 0.0, 0.05]}
        anchorX="center"
        anchorY="middle"
        color={hovered ? '#ffffff' : '#cccccc'}
        letterSpacing={0.04}
      >
        {cfg.text}
      </Text>

      {/* ── Tab label ── */}
      <Text
        fontSize={0.11}
        position={[-1.0, 0.54, 0.06]}
        anchorX="center"
        anchorY="middle"
        color="#ffffff"
        letterSpacing={0.06}
      >
        {cfg.text.toUpperCase()}
      </Text>

      {/* ── Soft coloured glow behind the card ── */}
      <pointLight
        position={[0, 0, 0.5]}
        color={cfg.color}
        intensity={hovered ? 1.8 : 0.4}
        distance={2.5}
      />
    </group>
  );
};

// ─── Scene ────────────────────────────────────────────────────────────────────

const SceneContent = ({
  onPanelClick,
  isInteracting,
}: {
  onPanelClick: (section: string) => void;
  isInteracting: boolean;
}) => {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (groupRef.current && !isInteracting) {
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.08) * 0.25;
      groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.05) * 0.04;
    }
  });

  return (
    <Suspense fallback={null}>
      <ParticleField />
      <group ref={groupRef}>
        {FOLDERS.map((cfg) => (
          <Float
            key={cfg.section}
            speed={cfg.floatSpeed}
            rotationIntensity={0.08}
            floatIntensity={cfg.floatIntensity}
          >
            <Folder cfg={cfg} onClick={() => onPanelClick(cfg.section)} />
          </Float>
        ))}
      </group>
      <Environment preset="city" />
    </Suspense>
  );
};

// ─── Main export ──────────────────────────────────────────────────────────────

export const Hero3D = ({ onPanelClick }: { onPanelClick: (section: string) => void }) => {
  const [isInteracting, setInteracting] = useState(false);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0, left: 0,
        width: '100%', height: '100vh',
        cursor: isInteracting ? 'grabbing' : 'grab',
        zIndex: 1,
      }}
      onPointerDown={() => setInteracting(true)}
      onPointerUp={() => setInteracting(false)}
    >
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <ambientLight intensity={0.4} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2.5} />
        <pointLight position={[-10, -10, -10]} intensity={2} color="#a78bfa" />
        <pointLight position={[0, 8, -4]} intensity={1} color="#60a5fa" />
        <SceneContent onPanelClick={onPanelClick} isInteracting={isInteracting} />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>

      {/* Centre text overlay */}
      <div
        style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: 'white',
          pointerEvents: 'none',
          zIndex: 2,
          padding: '1.2rem 2.4rem',
          background: 'rgba(0,0,0,0.35)',
          backdropFilter: 'blur(12px)',
          borderRadius: '1rem',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(2.2rem, 5vw, 4rem)',
            fontWeight: 900,
            letterSpacing: '0.08em',
            lineHeight: 1.1,
            marginBottom: '0.5rem',
          }}
        >
          <span className="glitch" data-text="Shi Ting Lin">Shi Ting Lin</span>
        </h1>
        <p style={{ fontSize: '1.05rem', color: '#c4b5fd', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600 }}>
          Senior Software Engineer
        </p>
      </div>
    </div>
  );
};
