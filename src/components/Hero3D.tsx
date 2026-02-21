import { Suspense, useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// ─── Folder config ────────────────────────────────────────────────────────────

interface FolderConfig {
  text: string;
  icon: string;
  color: string;
  position: [number, number, number];
  rotation: [number, number, number];
  floatPhase: number;
  section: string;
}

const FOLDERS: FolderConfig[] = [
  { text: 'Profile',    icon: '🧑‍💻', color: '#a78bfa', position: [-3.6,  2.2, 0], rotation: [0, 0,  0.06], floatPhase: 0.0,  section: 'profile'    },
  { text: 'Experience', icon: '💼',   color: '#34d399', position: [ 3.6,  2.2, 0], rotation: [0, 0, -0.06], floatPhase: 1.5,  section: 'experience' },
  { text: 'Skills',     icon: '⚙️',   color: '#60a5fa', position: [-3.6, -2.2, 0], rotation: [0, 0,  0.06], floatPhase: 3.0,  section: 'skills'     },
  { text: 'Contact',    icon: '✉️',   color: '#f59e0b', position: [ 3.6, -2.2, 0], rotation: [0, 0, -0.06], floatPhase: 4.5,  section: 'contact'    },
];

// ─── Static particle field (no useFrame) ──────────────────────────────────────

const ParticleField = () => {
  const count = 60;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 4;
    }
    return pos;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#c4b5fd" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
};

// ─── Single Folder (minimal useFrame — NO traverse, NO Float) ────────────────

const Folder = ({ cfg, onClick }: { cfg: FolderConfig; onClick: () => void }) => {
  const [hovered, setHover] = useState(false);
  const groupRef  = useRef<THREE.Group>(null!);
  const bodyRef   = useRef<THREE.Mesh>(null!);
  const ringRef   = useRef<THREE.LineLoop>(null!);
  const lightRef  = useRef<THREE.PointLight>(null!);

  const baseColor = useMemo(() => new THREE.Color(cfg.color), [cfg.color]);
  const blackColor = useMemo(() => new THREE.Color('#000000'), []);

  const ringGeo = useMemo(() => {
    const w = 2.6, h = 0.9;
    return new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-w / 2 + 0.08,  h / 2 - 0.08, 0.035),
      new THREE.Vector3( w / 2 - 0.08,  h / 2 - 0.08, 0.035),
      new THREE.Vector3( w / 2 - 0.08, -h / 2 + 0.08, 0.035),
      new THREE.Vector3(-w / 2 + 0.08, -h / 2 + 0.08, 0.035),
    ]);
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    // Simple float: just Y offset, no spring physics
    const floatY = Math.sin(t * 0.5 + cfg.floatPhase) * 0.12;
    groupRef.current.position.set(cfg.position[0], cfg.position[1] + floatY, cfg.position[2]);

    // Scale toward target — simple lerp, no traverse
    const targetScale = hovered ? 1.08 : 1.0;
    const s = groupRef.current.scale.x;
    const next = s + (targetScale - s) * 0.1;
    groupRef.current.scale.setScalar(next);

    // Body emissive — direct ref, no traverse
    if (bodyRef.current) {
      const mat = bodyRef.current.material as THREE.MeshStandardMaterial;
      mat.emissive.lerp(hovered ? baseColor : blackColor, 0.12);
      mat.emissiveIntensity = hovered ? 0.4 : 0.0;
    }

    // Ring opacity
    if (ringRef.current) {
      const mat = ringRef.current.material as THREE.LineBasicMaterial;
      mat.opacity += (hovered ? 0.9 : 0.3 - mat.opacity) * 0.1;
    }

    // Light intensity
    if (lightRef.current) {
      lightRef.current.intensity += (hovered ? 2.0 : 0.4 - lightRef.current.intensity) * 0.1;
    }
  });

  return (
    <group
      ref={groupRef}
      rotation={cfg.rotation}
      onPointerOver={(e) => { e.stopPropagation(); setHover(true); }}
      onPointerOut={() => setHover(false)}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
    >
      {/* Body — direct ref for emissive */}
      <RoundedBox args={[2.8, 1.0, 0.07]} radius={0.06} smoothness={3} ref={bodyRef}>
        <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} transparent opacity={0.16} side={THREE.DoubleSide} />
      </RoundedBox>

      {/* Tab */}
      <RoundedBox args={[0.85, 0.22, 0.06]} radius={0.04} smoothness={3} position={[-1.0, 0.54, 0]}>
        <meshStandardMaterial color={cfg.color} metalness={0.6} roughness={0.3} transparent opacity={0.65} side={THREE.DoubleSide} />
      </RoundedBox>

      {/* Bottom stripe */}
      <mesh position={[0, -0.45, 0.038]}>
        <planeGeometry args={[2.5, 0.015]} />
        <meshStandardMaterial color={cfg.color} emissive={cfg.color} emissiveIntensity={1.5} transparent opacity={0.8} />
      </mesh>

      {/* Ring */}
      <lineLoop ref={ringRef} geometry={ringGeo}>
        <lineBasicMaterial color="#888888" transparent opacity={0.3} />
      </lineLoop>

      <Text fontSize={0.38} position={[-0.62, 0, 0.05]} anchorX="center" anchorY="middle" color={hovered ? '#ffffff' : cfg.color}>
        {cfg.icon}
      </Text>
      <Text fontSize={0.21} fontWeight={700} position={[0.28, 0, 0.05]} anchorX="center" anchorY="middle" color={hovered ? '#ffffff' : '#cccccc'} letterSpacing={0.04}>
        {cfg.text}
      </Text>
      <Text fontSize={0.11} position={[-1.0, 0.54, 0.06]} anchorX="center" anchorY="middle" color="#ffffff" letterSpacing={0.06}>
        {cfg.text.toUpperCase()}
      </Text>

      <pointLight ref={lightRef} position={[0, 0, 0.6]} color={cfg.color} intensity={0.4} distance={3.0} />
    </group>
  );
};

// ─── Scene: one shared slow-sway useFrame ─────────────────────────────────────

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
      const t = clock.getElapsedTime();
      groupRef.current.rotation.y = Math.sin(t * 0.08) * 0.18;
      groupRef.current.rotation.x = Math.sin(t * 0.05) * 0.04;
    }
  });

  return (
    <Suspense fallback={null}>
      <ParticleField />
      <group ref={groupRef}>
        {FOLDERS.map((cfg) => (
          <Folder key={cfg.section} cfg={cfg} onClick={() => onPanelClick(cfg.section)} />
        ))}
      </group>
    </Suspense>
  );
};

// ─── Typewriter hook ──────────────────────────────────────────────────────────

const useTypewriter = (words: string[], delay = 2200) => {
  const [wordIdx, setWordIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [phase, setPhase] = useState<'typing' | 'waiting' | 'deleting'>('typing');

  useEffect(() => {
    const word = words[wordIdx];
    let t: ReturnType<typeof setTimeout>;
    if (phase === 'typing') {
      if (displayed.length < word.length) {
        t = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80);
      } else {
        t = setTimeout(() => setPhase('waiting'), delay);
      }
    } else if (phase === 'waiting') {
      t = setTimeout(() => setPhase('deleting'), 400);
    } else {
      if (displayed.length > 0) {
        t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45);
      } else {
        setWordIdx((i) => (i + 1) % words.length);
        setPhase('typing');
      }
    }
    return () => clearTimeout(t);
  }, [displayed, phase, wordIdx, words, delay]);

  return displayed;
};

// ─── Main export ──────────────────────────────────────────────────────────────

export const Hero3D = ({ onPanelClick }: { onPanelClick: (section: string) => void }) => {
  const [isInteracting, setInteracting] = useState(false);
  const subtitle = useTypewriter([
    'Senior Backend Engineer',
    'Fintech · Payments · Crypto',
    'Kotlin · Java · Microservices',
    'Open to Singapore Roles ✈️',
  ]);

  return (
    <div
      style={{
        position: 'absolute', top: 0, left: 0,
        width: '100%', height: '100vh',
        cursor: isInteracting ? 'grabbing' : 'grab',
        zIndex: 1,
      }}
      onPointerDown={() => setInteracting(true)}
      onPointerUp={() => setInteracting(false)}
    >
      {/* Canvas – capped DPR, antialiasing off, no HDR env */}
      <Canvas
        camera={{ position: [0, 0, 8.5], fov: 58 }}
        dpr={[1, 1]}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[8, 8, 8]}   intensity={2.0} color="#ffffff" />
        <pointLight position={[-8, -8, -8]} intensity={1.5} color="#a78bfa" />
        <pointLight position={[0, 6, -4]}   intensity={1.0} color="#60a5fa" />
        <SceneContent onPanelClick={onPanelClick} isInteracting={isInteracting} />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>

      {/* Subtle static background glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(109,40,217,0.08) 0%, transparent 70%)',
      }} />

      {/* Centre name overlay */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center', color: 'white',
        pointerEvents: 'none', zIndex: 2,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.55rem',
      }}>
        {/* Glow behind text */}
        <div style={{
          position: 'absolute', inset: '-3rem -5rem',
          background: 'radial-gradient(ellipse, rgba(139,92,246,0.20) 0%, transparent 70%)',
          filter: 'blur(20px)', borderRadius: '50%',
        }} />

        <h1 style={{
          fontSize: 'clamp(2.5rem, 5.5vw, 4.6rem)',
          fontWeight: 900, letterSpacing: '0.06em', lineHeight: 1.0, margin: 0,
          position: 'relative',
          background: 'linear-gradient(135deg, #e2d9f3 0%, #a78bfa 35%, #818cf8 60%, #c4b5fd 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          filter: 'drop-shadow(0 0 20px rgba(167,139,250,0.45))',
        }}>
          Shi Ting Lin
        </h1>

        <div style={{
          width: '6rem', height: '1px',
          background: 'linear-gradient(90deg, transparent, #a78bfa, #60a5fa, transparent)',
          opacity: 0.9,
        }} />

        <p style={{
          fontSize: 'clamp(0.7rem, 1.35vw, 1.0rem)',
          color: '#c4b5fd', letterSpacing: '0.18em', textTransform: 'uppercase',
          fontWeight: 600, minWidth: '24ch', minHeight: '1.6em', margin: 0, position: 'relative',
        }}>
          {subtitle}
          <span style={{
            display: 'inline-block', width: '2px', height: '1em',
            background: '#a78bfa', marginLeft: '3px', verticalAlign: 'text-bottom',
            animation: 'cursor-blink 0.9s step-start infinite',
          }} />
        </p>

        <p style={{
          marginTop: '0.4rem', fontSize: '0.6rem',
          color: 'rgba(255,255,255,0.2)', letterSpacing: '0.18em', textTransform: 'uppercase',
        }}>
          drag · click a folder
        </p>
      </div>
    </div>
  );
};
