import { Suspense, useRef, useState, useMemo, useEffect } from 'react';
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

// Folders pushed to the four corners, leaving the center clear for the name
const FOLDERS: FolderConfig[] = [
  { text: 'Profile',    icon: '🧑‍💻', color: '#a78bfa', position: [-3.6,  2.2, 0],  rotation: [0, 0,  0.06], floatSpeed: 0.5,  floatIntensity: 0.22, section: 'profile'    },
  { text: 'Experience', icon: '💼',   color: '#34d399', position: [ 3.6,  2.2, 0],  rotation: [0, 0, -0.06], floatSpeed: 0.65, floatIntensity: 0.26, section: 'experience' },
  { text: 'Skills',     icon: '⚙️',   color: '#60a5fa', position: [-3.6, -2.2, 0],  rotation: [0, 0,  0.06], floatSpeed: 0.45, floatIntensity: 0.20, section: 'skills'     },
  { text: 'Contact',    icon: '✉️',   color: '#f59e0b', position: [ 3.6, -2.2, 0],  rotation: [0, 0, -0.06], floatSpeed: 0.55, floatIntensity: 0.22, section: 'contact'    },
];

// ─── Background particle field ────────────────────────────────────────────────

const ParticleField = () => {
  const pointsRef = useRef<THREE.Points>(null!);
  const count = 120;

  const { positions, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz  = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 4;
      sz[i] = Math.random() * 0.05 + 0.015;
    }
    return { positions: pos, sizes: sz };
  }, []);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.012;
      pointsRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.007) * 0.06;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#c4b5fd"
        transparent
        opacity={0.55}
        sizeAttenuation
      />
    </points>
  );
};

// ─── Orbital ring (decorative) ────────────────────────────────────────────────

const OrbitalRing = ({ radius, speed, tilt, color }: {
  radius: number; speed: number; tilt: number; color: string;
}) => {
  const ref = useRef<THREE.LineLoop>(null!);
  const geo = useMemo(() => {
    const segs = 96;
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= segs; i++) {
      const a = (i / segs) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius * 0.35, Math.sin(a) * radius * 0.05));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [radius]);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.z = clock.getElapsedTime() * speed;
      ref.current.rotation.x = tilt;
    }
  });

  return (
    <lineLoop ref={ref} geometry={geo}>
      <lineBasicMaterial color={color} transparent opacity={0.18} />
    </lineLoop>
  );
};

// ─── Central glow sphere ──────────────────────────────────────────────────────

const CentralGlow = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime();
      meshRef.current.scale.setScalar(1 + Math.sin(t * 0.8) * 0.06);
      (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.8 + Math.sin(t * 1.2) * 0.3;
    }
  });
  return (
    <mesh ref={meshRef} position={[0, 0, -1]}>
      <sphereGeometry args={[0.6, 32, 32]} />
      <meshStandardMaterial
        color="#a78bfa"
        emissive="#7c3aed"
        emissiveIntensity={0.8}
        transparent
        opacity={0.12}
        roughness={0.1}
        metalness={0.9}
      />
    </mesh>
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
        child.material.emissiveIntensity = hovered ? 0.45 : 0.0;
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
          opacity={0.60}
          side={THREE.DoubleSide}
        />
      </RoundedBox>

      {/* ── Accent colour stripe (bottom edge) ── */}
      <mesh position={[0, -0.45, 0.038]}>
        <planeGeometry args={[2.5, 0.015]} />
        <meshStandardMaterial color={cfg.color} emissive={cfg.color} emissiveIntensity={1.5} transparent opacity={0.8} />
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
        intensity={hovered ? 2.2 : 0.5}
        distance={3.0}
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
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.08) * 0.18;
      groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.05) * 0.04;
    }
  });

  return (
    <Suspense fallback={null}>
      <ParticleField />
      <CentralGlow />
      <OrbitalRing radius={5.5} speed={0.04}  tilt={0.3}  color="#a78bfa" />
      <OrbitalRing radius={4.2} speed={-0.03} tilt={-0.5} color="#60a5fa" />
      <OrbitalRing radius={6.5} speed={0.025} tilt={1.1}  color="#34d399" />
      <group ref={groupRef}>
        {FOLDERS.map((cfg) => (
          <Float
            key={cfg.section}
            speed={cfg.floatSpeed}
            rotationIntensity={0.06}
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

// ─── Typewriter hook ──────────────────────────────────────────────────────────

const useTypewriter = (words: string[], delay = 2800) => {
  const [wordIdx, setWordIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [phase, setPhase] = useState<'typing' | 'waiting' | 'deleting'>('typing');

  useEffect(() => {
    const word = words[wordIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === 'typing') {
      if (displayed.length < word.length) {
        timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80);
      } else {
        timeout = setTimeout(() => setPhase('waiting'), delay);
      }
    } else if (phase === 'waiting') {
      timeout = setTimeout(() => setPhase('deleting'), 400);
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45);
      } else {
        setWordIdx((i) => (i + 1) % words.length);
        setPhase('typing');
      }
    }

    return () => clearTimeout(timeout);
  }, [displayed, phase, wordIdx, words, delay]);

  return displayed;
};

// ─── Main export ──────────────────────────────────────────────────────────────

export const Hero3D = ({ onPanelClick }: { onPanelClick: (section: string) => void }) => {
  const [isInteracting, setInteracting] = useState(false);
  const subtitle = useTypewriter(['Senior Backend Engineer', 'Fintech Specialist', 'Kotlin · Java · Microservices', 'Open to Singapore Roles ✈️'], 2200);

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
      <Canvas camera={{ position: [0, 0, 8.5], fov: 58 }}>
        <ambientLight intensity={0.3} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2.5} />
        <pointLight position={[-10, -10, -10]} intensity={2.2} color="#a78bfa" />
        <pointLight position={[0, 8, -4]} intensity={1.2} color="#60a5fa" />
        <pointLight position={[0, -6, 3]} intensity={0.8} color="#34d399" />
        <SceneContent onPanelClick={onPanelClick} isInteracting={isInteracting} />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>

      {/* ── Centre overlay: name + typewriter subtitle ── */}
      <div
        style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: 'white',
          pointerEvents: 'none',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.6rem',
        }}
      >
        {/* Aurora glow blob behind text */}
        <div style={{
          position: 'absolute',
          inset: '-2rem -4rem',
          background: 'radial-gradient(ellipse at 50% 50%, rgba(139,92,246,0.22) 0%, rgba(96,165,250,0.08) 50%, transparent 75%)',
          filter: 'blur(24px)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }} />

        {/* ── Name ── */}
        <h1
          style={{
            fontSize: 'clamp(2.4rem, 5.5vw, 4.4rem)',
            fontWeight: 900,
            letterSpacing: '0.05em',
            lineHeight: 1.05,
            margin: 0,
            textShadow: '0 0 40px rgba(139,92,246,0.5), 0 0 80px rgba(139,92,246,0.2)',
          }}
        >
          <span className="glitch" data-text="Shi Ting Lin">Shi Ting Lin</span>
        </h1>

        {/* ── Thin divider ── */}
        <div style={{
          width: '5rem',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #a78bfa, transparent)',
          opacity: 0.8,
        }} />

        {/* ── Typewriter subtitle ── */}
        <p style={{
          fontSize: 'clamp(0.75rem, 1.4vw, 1.05rem)',
          color: '#c4b5fd',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          fontWeight: 600,
          minWidth: '22ch',
          minHeight: '1.5em',
          margin: 0,
        }}>
          {subtitle}
          <span style={{
            display: 'inline-block',
            width: '2px',
            height: '1em',
            background: '#a78bfa',
            marginLeft: '2px',
            verticalAlign: 'text-bottom',
            animation: 'cursor-blink 0.9s step-start infinite',
          }} />
        </p>

        {/* ── Hint label ── */}
        <p style={{
          marginTop: '0.5rem',
          fontSize: '0.65rem',
          color: 'rgba(255,255,255,0.25)',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
        }}>
          drag · click a folder
        </p>
      </div>
    </div>
  );
};
