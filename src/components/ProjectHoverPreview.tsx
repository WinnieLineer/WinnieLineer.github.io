import React, { useState, useEffect, useRef } from 'react';

interface ProjectHoverPreviewProps {
  activeImage: string | null;
  activeTitle: string | null;
}

export const ProjectHoverPreview: React.FC<ProjectHoverPreviewProps> = ({ activeImage, activeTitle }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Easing calculation could go here, but simple coordinate follow for now
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={previewRef}
      className={`floating-preview ${activeImage ? 'active' : ''}`}
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        transform: `translate(-50%, -50%) rotate(${activeImage ? (position.x % 10 - 5) : 0}deg)`
      }}
    >
      {activeImage && (
        <div className="relative w-full h-full">
          <div className="scan-line" />
          <img 
            src={activeImage} 
            alt={activeTitle || 'Preview'} 
            className="w-full h-full object-cover"
          />
          {/* Glitch Overlay */}
          <div className="absolute inset-0 bg-violet-500/10 mix-blend-overlay opacity-50" />
          
          {/* Decorative Elements */}
          <div className="absolute top-2 left-2 text-[8px] font-mono text-white/50 tracking-widest uppercase">
            Project_Stream_04
          </div>
          <div className="absolute bottom-2 right-2 text-[8px] font-mono text-white/50 tracking-widest">
            {Math.floor(position.x)}, {Math.floor(position.y)}
          </div>
        </div>
      )}
    </div>
  );
};
