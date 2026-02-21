import { useEffect, useRef, useState } from 'react';

interface TrailDot {
  x: number;
  y: number;
  id: number;
  opacity: number;
  size: number;
  color: string;
}

const TRAIL_LENGTH = 16;
const TRAIL_COLORS = ['#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd', '#0ea5e9', '#38bdf8'];

export const FancyCursor = () => {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const outerPos = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);
  const trailRef = useRef<TrailDot[]>([]);
  const counterRef = useRef(0);
  const [trail, setTrail] = useState<TrailDot[]>([]);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    // Hide the native cursor globally
    document.documentElement.style.cursor = 'none';

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };

      // Update inner dot immediately
      if (innerRef.current) {
        innerRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }

      // Trail particles
      const colorIndex = Math.floor(Math.random() * TRAIL_COLORS.length);
      const newDot: TrailDot = {
        x: e.clientX,
        y: e.clientY,
        id: counterRef.current++,
        opacity: 1,
        size: Math.random() * 6 + 3,
        color: TRAIL_COLORS[colorIndex],
      };
      trailRef.current = [newDot, ...trailRef.current].slice(0, TRAIL_LENGTH);
      setTrail([...trailRef.current]);

      // Hover detection
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const isLink = !!el?.closest('a, button, [role="button"], input, textarea');
      setIsHovering(isLink);
    };

    const onDown = () => setIsClicking(true);
    const onUp = () => setIsClicking(false);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    // Lerp loop for outer ring
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const loop = () => {
      outerPos.current.x = lerp(outerPos.current.x, pos.current.x, 0.12);
      outerPos.current.y = lerp(outerPos.current.y, pos.current.y, 0.12);

      if (outerRef.current) {
        outerRef.current.style.transform = `translate(${outerPos.current.x}px, ${outerPos.current.y}px)`;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      document.documentElement.style.cursor = '';
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      {/* Trail particles */}
      {trail.map((dot, i) => (
        <div
          key={dot.id}
          className="fixed pointer-events-none"
          style={{
            left: 0,
            top: 0,
            width: `${dot.size * (1 - i / TRAIL_LENGTH)}px`,
            height: `${dot.size * (1 - i / TRAIL_LENGTH)}px`,
            borderRadius: '50%',
            background: dot.color,
            opacity: (1 - i / TRAIL_LENGTH) * 0.7,
            transform: `translate(${dot.x}px, ${dot.y}px) translate(-50%, -50%)`,
            zIndex: 9998,
            transition: 'opacity 0.3s ease',
            boxShadow: `0 0 ${dot.size * 2}px ${dot.color}`,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Outer magnetic ring */}
      <div
        ref={outerRef}
        className="fixed pointer-events-none"
        style={{
          left: 0,
          top: 0,
          width: isHovering ? '50px' : isClicking ? '22px' : '36px',
          height: isHovering ? '50px' : isClicking ? '22px' : '36px',
          borderRadius: '50%',
          border: `1.5px solid ${isHovering ? '#a78bfa' : 'rgba(167, 139, 250, 0.6)'}`,
          transform: 'translate(-100px, -100px)',
          marginLeft: isHovering ? '-25px' : isClicking ? '-11px' : '-18px',
          marginTop: isHovering ? '-25px' : isClicking ? '-11px' : '-18px',
          zIndex: 9999,
          transition: 'width 0.25s ease, height 0.25s ease, margin 0.25s ease, border-color 0.2s ease, box-shadow 0.2s ease',
          boxShadow: isHovering
            ? '0 0 18px rgba(167,139,250,0.8), inset 0 0 10px rgba(167,139,250,0.15)'
            : isClicking
            ? '0 0 30px rgba(14,165,233,0.9)'
            : '0 0 8px rgba(124,58,237,0.5)',
          backdropFilter: isHovering ? 'invert(1)' : 'none',
          mixBlendMode: isHovering ? 'difference' : 'normal',
          background: isClicking ? 'rgba(14,165,233,0.15)' : 'transparent',
        }}
      >
        {/* Inner ring decoration */}
        {isHovering && (
          <div
            style={{
              position: 'absolute',
              inset: '4px',
              borderRadius: '50%',
              border: '1px solid rgba(167,139,250,0.4)',
              animation: 'spin-slow 3s linear infinite',
            }}
          />
        )}
      </div>

      {/* Inner dot */}
      <div
        ref={innerRef}
        className="fixed pointer-events-none"
        style={{
          left: 0,
          top: 0,
          width: isClicking ? '10px' : '6px',
          height: isClicking ? '10px' : '6px',
          borderRadius: '50%',
          background: isHovering ? '#a78bfa' : '#ffffff',
          marginLeft: isClicking ? '-5px' : '-3px',
          marginTop: isClicking ? '-5px' : '-3px',
          zIndex: 10000,
          transition: 'width 0.1s, height 0.1s, margin 0.1s, background 0.2s',
          boxShadow: isHovering
            ? '0 0 8px #a78bfa, 0 0 16px #7c3aed'
            : '0 0 6px rgba(255,255,255,0.8)',
        }}
      />

      {/* Click ripple */}
      {isClicking && (
        <div
          className="fixed pointer-events-none"
          style={{
            left: pos.current.x,
            top: pos.current.y,
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            border: '2px solid rgba(14,165,233,0.6)',
            marginLeft: '-30px',
            marginTop: '-30px',
            zIndex: 9997,
            animation: 'click-ripple 0.4s ease-out forwards',
          }}
        />
      )}

      {/* Global keyframes injected inline */}
      <style>{`
        @keyframes click-ripple {
          0% { transform: scale(0.3); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        * { cursor: none !important; }
      `}</style>
    </>
  );
};
