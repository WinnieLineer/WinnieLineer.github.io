import { useEffect, useRef, useState, useCallback } from 'react';

// ─── Constants ────────────────────────────────────────────────────────────────
// Higher resolution sample grid = sharper silhouette
const SAMPLE_COLS = 120;
const SAMPLE_ROWS = 80;
// More particles = denser image
const PARTICLE_COUNT = 12000;

// ─── Particle ─────────────────────────────────────────────────────────────────
interface Particle {
  x: number; y: number;
  tx: number; ty: number;
  vx: number; vy: number;
  size: number;
  alpha: number;
  baseHue: number;
}

// ─── Text → targets (idle) ───────────────────────────────────────────────────
// Step=1 so we collect enough unique pixel positions for 12k particles to spread
function buildTextTargets(text: string, W: number, H: number) {
  const off = document.createElement('canvas');
  // Larger font so letters produce more pixel coverage
  const fs = Math.min(W * 0.25, H * 0.5, 160);
  off.width = W; off.height = H;
  const ctx = off.getContext('2d')!;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#fff';
  ctx.font = `900 ${fs}px monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, W / 2, H / 2);
  const { data } = ctx.getImageData(0, 0, W, H);
  const targets: { tx: number; ty: number }[] = [];
  // Step=1 to capture every filled pixel → enough targets for 12k particles
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      if (data[i + 3] > 100) targets.push({ tx: x, ty: y });
    }
  }
  return targets;
}

// ─── Video → targets (camera) ────────────────────────────────────────────────
// Draw video DIRECTLY to a sample canvas here, return bright pixel positions
function sampleVideoFrame(
  video: HTMLVideoElement,
  W: number,
  H: number,
): { tx: number; ty: number; bright: number }[] {
  const off = document.createElement('canvas');
  off.width = SAMPLE_COLS;
  off.height = SAMPLE_ROWS;
  const ctx = off.getContext('2d', { willReadFrequently: true })!;
  // Mirror + draw
  ctx.translate(SAMPLE_COLS, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, 0, 0, SAMPLE_COLS, SAMPLE_ROWS);

  const { data } = ctx.getImageData(0, 0, SAMPLE_COLS, SAMPLE_ROWS);
  const targets: { tx: number; ty: number; bright: number }[] = [];

  for (let row = 0; row < SAMPLE_ROWS; row++) {
    for (let col = 0; col < SAMPLE_COLS; col++) {
      const idx = (row * SAMPLE_COLS + col) * 4;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2];
      const bright = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
      // Lowered threshold to capture more of the person
      if (bright > 0.08) {
        // Map to canvas coords — no extra jitter
        targets.push({
          tx: (col / SAMPLE_COLS) * W,
          ty: (row / SAMPLE_ROWS) * H,
          bright,
        });
      }
    }
  }
  return targets;
}

// ─── Cycling idle phrases ─────────────────────────────────────────────────────
const IDLE_PHRASES = ['hi', '</>', '{ }', '*', 'hello'];

// ─── Unick-style camera button ────────────────────────────────────────────────
// Circular button with a ring, inner camera body rendered precisely
const CameraButton = ({
  loading,
  onClick,
}: {
  loading: boolean;
  onClick: () => void;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      disabled={loading}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        width: 80,
        height: 80,
        borderRadius: '50%',
        border: `1px solid ${hovered ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.18)'}`,
        background: hovered
          ? 'rgba(255,255,255,0.08)'
          : 'rgba(255,255,255,0.03)',
        cursor: loading ? 'wait' : 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(12px)',
        boxShadow: hovered
          ? '0 0 0 1px rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.4)'
          : '0 0 0 1px rgba(255,255,255,0.03)',
        opacity: loading ? 0.5 : 1,
      }}
    >
      {/* Animated ring on hover */}
      <div
        style={{
          position: 'absolute',
          inset: -4,
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.15)',
          transform: hovered ? 'scale(1)' : 'scale(0.9)',
          opacity: hovered ? 1 : 0,
          transition: 'all 0.35s ease',
        }}
      />
      {/* Camera icon — clean minimal lines */}
      <svg
        width="26"
        height="21"
        viewBox="0 0 26 21"
        fill="none"
        style={{ color: hovered ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.45)', transition: 'color 0.3s' }}
      >
        {/* Body */}
        <rect x="1" y="5.5" width="24" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.3"/>
        {/* Lens */}
        <circle cx="13" cy="12.5" r="4" stroke="currentColor" strokeWidth="1.3"/>
        {/* Inner lens ring */}
        <circle cx="13" cy="12.5" r="1.6" stroke="currentColor" strokeWidth="1"/>
        {/* Viewfinder bump */}
        <path d="M9 5.5V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v1.5" stroke="currentColor" strokeWidth="1.3"/>
        {/* Flash corner dot */}
        <circle cx="21" cy="9" r="1" fill="currentColor" opacity="0.6"/>
      </svg>
      {/* Label */}
      <span
        style={{
          fontSize: '8px',
          fontFamily: 'monospace',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: hovered ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.25)',
          transition: 'color 0.3s',
          lineHeight: 1,
        }}
      >
        {loading ? '...' : 'camera'}
      </span>
    </button>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const PlaygroundPage = () => {
  const displayCanvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const pipVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);
  const frameCountRef = useRef(0);
  const idlePhraseIndexRef = useRef(0);
  const idleTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ── Init particles scattered randomly ──────────────────────────────────────
  const initParticles = useCallback((W: number, H: number) => {
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      tx: Math.random() * W,
      ty: Math.random() * H,
      vx: 0, vy: 0,
      size: Math.random() * 1.4 + 0.6,
      alpha: Math.random() * 0.4 + 0.5,
      baseHue: 200 + Math.random() * 140, // blue-violet-magenta
    }));
  }, []);

  // ── Assign text targets ────────────────────────────────────────────────────
  const assignTextTargets = useCallback((phrase: string, W: number, H: number) => {
    const tgts = buildTextTargets(phrase, W, H);
    if (!tgts.length) return;
    particlesRef.current.forEach((p, i) => {
      const t = tgts[i % tgts.length];
      p.tx = t.tx + (Math.random() - 0.5) * 4;
      p.ty = t.ty + (Math.random() - 0.5) * 4;
    });
  }, []);

  // ── Idle loop ──────────────────────────────────────────────────────────────
  const idleLoop = useCallback(() => {
    const canvas = displayCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width, H = canvas.height;

    // Faster fade = crispier shape
    ctx.fillStyle = 'rgba(8,7,14,0.25)';
    ctx.fillRect(0, 0, W, H);

    particlesRef.current.forEach(p => {
      const dx = p.tx - p.x, dy = p.ty - p.y;
      p.vx = (p.vx + dx * 0.06) * 0.84;
      p.vy = (p.vy + dy * 0.06) * 0.84;
      p.x += p.vx; p.y += p.vy;
      const speed = Math.hypot(p.vx, p.vy);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.baseHue + speed * 4},80%,72%,${p.alpha})`;
      ctx.fill();
    });
    animRef.current = requestAnimationFrame(idleLoop);
  }, []);

  const startIdleMode = useCallback(() => {
    const canvas = displayCanvasRef.current;
    if (!canvas) return;
    const { width: W, height: H } = canvas;
    initParticles(W, H);
    assignTextTargets(IDLE_PHRASES[0], W, H);
    idlePhraseIndexRef.current = 0;
    idleLoop();

    idleTimerRef.current = setInterval(() => {
      idlePhraseIndexRef.current = (idlePhraseIndexRef.current + 1) % IDLE_PHRASES.length;
      const c = displayCanvasRef.current;
      if (c) assignTextTargets(IDLE_PHRASES[idlePhraseIndexRef.current], c.width, c.height);
    }, 3200);
  }, [initParticles, assignTextTargets, idleLoop]);

  // ── Camera loop ────────────────────────────────────────────────────────────
  const cameraLoop = useCallback(() => {
    const canvas = displayCanvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video || video.readyState < 2) {
      animRef.current = requestAnimationFrame(cameraLoop);
      return;
    }
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width, H = canvas.height;

    // Sample every frame for maximum responsiveness
    if (frameCountRef.current % 2 === 0) {
      const targets = sampleVideoFrame(video, W, H);
      if (targets.length > 0) {
        particlesRef.current.forEach((p, i) => {
          const t = targets[i % targets.length];
          // All particles always chase a target → no stale positions
          p.tx = t.tx;
          p.ty = t.ty;
        });
      }
    }
    frameCountRef.current++;

    // Quick trail fade so old positions don't linger
    ctx.fillStyle = 'rgba(8,7,14,0.28)';
    ctx.fillRect(0, 0, W, H);

    particlesRef.current.forEach(p => {
      const dx = p.tx - p.x, dy = p.ty - p.y;
      // Stronger spring for tighter clustering
      p.vx = (p.vx + dx * 0.055) * 0.87;
      p.vy = (p.vy + dy * 0.055) * 0.87;
      p.x += p.vx; p.y += p.vy;
      const speed = Math.hypot(p.vx, p.vy);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      // White-hot core at high speed, cool violet at rest
      const lightness = Math.min(60 + speed * 4, 92);
      const saturation = Math.max(90 - speed * 3, 55);
      ctx.fillStyle = `hsla(${p.baseHue + speed * 6},${saturation}%,${lightness}%,${p.alpha})`;
      ctx.fill();
    });

    animRef.current = requestAnimationFrame(cameraLoop);
  }, []);

  const startCamera = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
      });
      streamRef.current = stream;

      const video = videoRef.current!;
      video.srcObject = stream;
      await video.play();

      const pip = pipVideoRef.current!;
      pip.srcObject = stream;
      await pip.play();

      cancelAnimationFrame(animRef.current);
      if (idleTimerRef.current) clearInterval(idleTimerRef.current);

      const canvas = displayCanvasRef.current!;
      canvas.width = canvas.parentElement!.clientWidth;
      canvas.height = canvas.parentElement!.clientHeight;

      initParticles(canvas.width, canvas.height);
      setCameraOn(true);
      frameCountRef.current = 0;
      cameraLoop();
    } catch (e: any) {
      setError(e?.message ?? 'Camera access denied.');
    } finally {
      setLoading(false);
    }
  }, [initParticles, cameraLoop]);

  const stopCamera = useCallback(() => {
    cancelAnimationFrame(animRef.current);
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setCameraOn(false);
    const canvas = displayCanvasRef.current;
    if (canvas) canvas.getContext('2d')!.clearRect(0, 0, canvas.width, canvas.height);
    setTimeout(startIdleMode, 50);
  }, [startIdleMode]);

  useEffect(() => {
    const canvas = displayCanvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.parentElement!.clientWidth;
    canvas.height = canvas.parentElement!.clientHeight;
    startIdleMode();
    return () => {
      cancelAnimationFrame(animRef.current);
      if (idleTimerRef.current) clearInterval(idleTimerRef.current);
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, [startIdleMode]);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#08070e',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: '80px',
      paddingBottom: '60px',
      color: 'white',
      overflow: 'hidden',
    }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '28px', zIndex: 2 }}>
        <p style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.45em', color: 'rgba(124,58,237,0.6)', textTransform: 'uppercase', marginBottom: '10px' }}>
          ◈ Playground
        </p>
        <h1 style={{
          fontSize: 'clamp(1.8rem, 4.5vw, 3.4rem)',
          fontWeight: 900, letterSpacing: '-0.04em',
          background: 'linear-gradient(135deg, #fff 0%, #a78bfa 55%, #38bdf8 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: '8px',
        }}>
          Particle Mirror
        </h1>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', maxWidth: '340px', lineHeight: 1.65 }}>
          {cameraOn
            ? 'Your silhouette — rendered as particles in real time.'
            : 'Grant camera access to see yourself in particles.'}
        </p>
      </div>

      {/* Canvas container */}
      <div style={{
        position: 'relative',
        width: '90vw', maxWidth: '860px',
        aspectRatio: '16/10',
        borderRadius: '12px',
        overflow: 'hidden',
        border: cameraOn ? '1px solid rgba(124,58,237,0.4)' : '1px solid rgba(255,255,255,0.05)',
        background: '#0b0a17',
        boxShadow: cameraOn
          ? '0 0 80px rgba(124,58,237,0.15), 0 0 160px rgba(56,189,248,0.06)'
          : '0 0 30px rgba(124,58,237,0.06)',
        transition: 'box-shadow 0.8s ease, border-color 0.8s ease',
        zIndex: 1,
      }}>
        {/* Hidden video for sampling */}
        <video ref={videoRef} muted playsInline style={{ display: 'none' }} />

        {/* Particle canvas */}
        <canvas ref={displayCanvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />

        {/* PiP — live camera preview bottom-right */}
        <div style={{
          position: 'absolute', bottom: 14, right: 14,
          width: 'clamp(90px, 13vw, 160px)',
          aspectRatio: '4/3',
          borderRadius: '8px', overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.7)',
          opacity: cameraOn ? 1 : 0,
          transform: cameraOn ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(6px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
          background: '#000', zIndex: 3,
        }}>
          <video ref={pipVideoRef} muted playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(124,58,237,0.12), transparent)',
            pointerEvents: 'none',
          }} />
          {/* live label */}
          <div style={{
            position: 'absolute', top: 6, left: 8,
            fontSize: '8px', fontFamily: 'monospace',
            color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase',
          }}>
            live
          </div>
          {/* rec dot */}
          <div style={{
            position: 'absolute', top: 8, right: 8,
            width: 5, height: 5, borderRadius: '50%',
            background: '#ef4444', boxShadow: '0 0 5px #ef4444',
            animation: 'blink 1.2s ease-in-out infinite alternate',
          }} />
        </div>

        {/* Corner brackets */}
        {(['tl','tr','bl','br'] as const).map(p => (
          <div key={p} style={{
            position: 'absolute', width: 16, height: 16,
            ...(p[0] === 't' ? { top: 10 } : { bottom: 10 }),
            ...(p[1] === 'l' ? { left: 10 } : { right: 10 }),
            borderTop: p[0] === 't' ? '1px solid rgba(124,58,237,0.35)' : 'none',
            borderBottom: p[0] === 'b' ? '1px solid rgba(124,58,237,0.35)' : 'none',
            borderLeft: p[1] === 'l' ? '1px solid rgba(124,58,237,0.35)' : 'none',
            borderRight: p[1] === 'r' ? '1px solid rgba(124,58,237,0.35)' : 'none',
          }} />
        ))}
      </div>

      {/* Controls */}
      <div style={{ marginTop: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', zIndex: 2 }}>
        {!cameraOn ? (
          <CameraButton loading={loading} onClick={startCamera} />
        ) : (
          <button
            onClick={stopCamera}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 22px', borderRadius: '100px',
              border: '1px solid rgba(239,68,68,0.35)',
              background: 'rgba(239,68,68,0.06)',
              color: 'rgba(255,120,120,0.8)',
              fontSize: '10px', fontFamily: 'monospace',
              letterSpacing: '0.15em', textTransform: 'uppercase',
              cursor: 'pointer', transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.14)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.06)')}
          >
            <span style={{
              width: 7, height: 7, borderRadius: '50%', background: '#ef4444',
              boxShadow: '0 0 5px #ef4444', display: 'inline-block',
              animation: 'blink 1s ease-in-out infinite alternate',
            }} />
            stop
          </button>
        )}

        {cameraOn && (
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '4px' }}>
            {['↑ move closer', '◑ contrast matters', '✦ stay still to sharpen'].map(t => (
              <span key={t} style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace', letterSpacing: '0.04em' }}>
                {t}
              </span>
            ))}
          </div>
        )}

        {error && (
          <div style={{
            padding: '10px 18px', borderRadius: '8px',
            border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.06)',
            color: 'rgba(255,120,120,0.8)', fontSize: '11px', fontFamily: 'monospace',
          }}>
            {error}
          </div>
        )}
      </div>

      <style>{`
        @keyframes blink {
          from { opacity: 0.4; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  );
};
