import { useEffect, useRef } from 'react';

export const CursorGlow = () => {
  const glowRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (glowRef.current) {
        const x = e.clientX;
        const y = e.clientY;
        // Use transform for the most performant animation
        glowRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div 
      ref={glowRef}
      style={{
        position: 'fixed',
        top: '-200px', // Center the gradient on the cursor
        left: '-200px',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(138, 43, 226, 0.15), transparent 80%)',
        borderRadius: '50%',
        pointerEvents: 'none', // Make sure it doesn't block clicks
        zIndex: -1, // Stay behind all content
        willChange: 'transform', // Performance optimization
      }}
    />
  );
};
