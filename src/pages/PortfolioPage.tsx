import { useState, useEffect, useRef } from 'react';
import { ProjectHoverPreview } from '../components/ProjectHoverPreview';

const projects = [
  {
    title: 'Asset Insights',
    description: 'An advanced asset tracking dashboard featuring automatic asset classification, real-time stock price updates, and dynamic rendering of historical asset value bar charts.',
    image: '/portfolio/asset-insights.png',
    url: 'https://winnie-lin.space/asset-insights/',
    tags: ['Finance', 'AI', 'Real-time'],
    year: '2026',
    color: '#7c3aed',
  },
  {
    title: 'Dawnguard',
    description: 'An AI-powered counseling chatbot themed around Tanjiro Kamado. Provides empathetic, supportive interactions.',
    image: '/portfolio/dawnguard.png',
    url: 'https://winnie-lin.space/dawnguard/',
    tags: ['Mental Health', 'Chatbot', 'Anime'],
    year: '2026',
    color: '#0ea5e9',
  },
  {
    title: 'Focus Flow',
    description: 'A productivity PWA featuring strict session management and distraction penalties. Designed with a premium glassmorphism UI.',
    image: '/portfolio/focus-flow.png',
    url: 'https://winnie-lin.space/focus-flow/',
    tags: ['Productivity', 'PWA', 'Focus'],
    year: '2025',
    color: '#10b981',
  },
  {
    title: 'Lofi Music',
    description: 'An immersive Lofi music player paired with calming, atmospheric visuals.',
    image: '/portfolio/lofi-music.png',
    url: 'https://winnie-lin.space/LofiMusic/',
    tags: ['Music', 'Relaxation', 'Audio'],
    year: '2025',
    color: '#f59e0b',
  },
  {
    title: 'Pomodoro',
    description: 'A minimalist Pomodoro timer designed to optimize workflow and manage time effectively.',
    image: '/portfolio/pomodoro.png',
    url: 'https://winnie-lin.space/Pomodoro/',
    tags: ['Productivity', 'Time Management'],
    year: '2025',
    color: '#ef4444',
  },
  {
    title: 'DreamScape',
    description: 'A visually striking interactive 3D demo resembling a high-quality game title sequence.',
    image: '/portfolio/dreamscape.png',
    url: 'https://winnie-lin.space/DreamScape/',
    tags: ['Animation', 'Demo', 'Game'],
    year: '2024',
    color: '#8b5cf6',
  },
  {
    title: 'BPTracker',
    description: 'A health monitoring app utilizing OCR for automated blood pressure and weight logging.',
    image: '/portfolio/bptracker.png',
    url: 'https://winnie-lin.space/BPTracker/',
    tags: ['Health', 'OCR', 'AI'],
    year: '2024',
    color: '#ec4899',
  },
];

// Floating particle component
const ParticleField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number; color: string }[] = [];
    const colors = ['#7c3aed', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899'];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Draw faint connector lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = particles[i].color;
            ctx.globalAlpha = (1 - dist / 120) * 0.12;
            ctx.lineWidth = 0.5;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      animId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, opacity: 0.7 }}
    />
  );
};



export const PortfolioPage = () => {
  const [activeProject, setActiveProject] = useState<{ image: string; title: string } | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [cursorBlink, setCursorBlink] = useState(true);
  const [titleVisible, setTitleVisible] = useState(false);
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(projects.length).fill(false));

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => setCursorBlink(b => !b), 530);
    return () => clearInterval(interval);
  }, []);

  // Staggered entrance animation
  useEffect(() => {
    const t = setTimeout(() => setTitleVisible(true), 100);
    projects.forEach((_, i) => {
      setTimeout(() => {
        setVisibleItems(prev => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, 300 + i * 100);
    });
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative min-h-screen p-8 pt-32 bg-[#0a0a0a] overflow-hidden">
      {/* Particle background */}
      <ParticleField />

      {/* Ambient glow blobs */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: '20%', left: '10%',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: 0,
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          bottom: '10%', right: '5%',
          width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(14,165,233,0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: 0,
        }}
      />

      <div className="container mx-auto relative" style={{ zIndex: 1 }}>
        {/* Header */}
        <div
          className="flex justify-between items-baseline mb-24"
          style={{
            opacity: titleVisible ? 1 : 0,
            transform: titleVisible ? 'translateY(0)' : 'translateY(-20px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div>
            <div className="text-xs font-mono text-violet-400/60 uppercase tracking-[0.4em] mb-4">
              ◈ Selected Works
            </div>
            <h1 className="portfolio-main-title">Projects</h1>
          </div>
          <div className="text-right">
            <div className="text-gray-500 font-mono text-sm">2024–2026</div>
            <div className="text-[10px] text-gray-700 font-mono mt-1 tracking-widest uppercase">
              {projects.length} works total
            </div>
          </div>
        </div>

        {/* Horizontal rule with glow */}
        <div className="w-full h-px mb-0 relative overflow-visible">
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.4), rgba(14,165,233,0.4), transparent)',
              boxShadow: '0 0 20px rgba(124,58,237,0.3)',
            }}
          />
        </div>

        {/* Project list */}
        <div className="relative">
          {projects.map((project, index) => (
            <a
              href={project.url}
              key={index}
              target="_blank"
              rel="noopener noreferrer"
              className="project-list-item-v2 block group"
              onMouseEnter={() => {
                setActiveProject({ image: project.image, title: project.title });
                setHoveredIndex(index);
              }}
              onMouseLeave={() => {
                setActiveProject(null);
                setHoveredIndex(null);
              }}
              style={{
                '--project-color': project.color,
                opacity: visibleItems[index] ? 1 : 0,
                transform: visibleItems[index] ? 'translateX(0)' : 'translateX(-30px)',
                transition: `opacity 0.6s ease ${index * 0.05}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 0.05}s`,
              } as React.CSSProperties}
            >
              {/* Hover glow sweep */}
              <div
                className="project-glow-sweep"
                style={{ '--project-color': project.color } as React.CSSProperties}
              />

              <div className="flex items-center justify-between relative z-10 py-8 px-2">
                <div className="flex items-center gap-8">
                  {/* Index number */}
                  <div className="relative hidden md:block w-10">
                    <span
                      className="text-sm font-mono transition-all duration-500"
                      style={{
                        color: hoveredIndex === index ? project.color : 'transparent',
                        WebkitTextStroke: hoveredIndex === index ? '0px' : `1px rgba(255,255,255,0.15)`,
                        textShadow: hoveredIndex === index ? `0 0 10px ${project.color}` : 'none',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Title */}
                  <h2
                    className="project-title-v2"
                    style={{
                      '--project-color': project.color,
                    } as React.CSSProperties}
                  >
                    {project.title}
                  </h2>
                </div>

                {/* Right side metadata */}
                <div className="project-meta-v2 hidden lg:flex flex-col items-end gap-3">
                  <div className="flex gap-2 flex-wrap justify-end">
                    {project.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono px-2.5 py-1 rounded-full border transition-all duration-300"
                        style={{
                          borderColor: hoveredIndex === index ? `${project.color}66` : 'rgba(255,255,255,0.08)',
                          color: hoveredIndex === index ? project.color : 'rgba(255,255,255,0.4)',
                          background: hoveredIndex === index ? `${project.color}10` : 'transparent',
                          boxShadow: hoveredIndex === index ? `0 0 8px ${project.color}33` : 'none',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <p
                      className="text-xs text-gray-500 max-w-[260px] text-right leading-relaxed transition-colors duration-300"
                      style={{ color: hoveredIndex === index ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.25)' }}
                    >
                      {project.description}
                    </p>
                    <span
                      className="text-xl font-light transition-all duration-300 whitespace-nowrap"
                      style={{
                        color: hoveredIndex === index ? project.color : 'rgba(255,255,255,0.2)',
                        textShadow: hoveredIndex === index ? `0 0 15px ${project.color}` : 'none',
                      }}
                    >
                      {project.year}
                    </span>
                  </div>
                </div>

                {/* Arrow indicator */}
                <div
                  className="ml-4 text-lg transition-all duration-300 hidden lg:block"
                  style={{
                    color: project.color,
                    opacity: hoveredIndex === index ? 1 : 0,
                    transform: hoveredIndex === index ? 'translateX(0) rotate(-45deg)' : 'translateX(-8px) rotate(-45deg)',
                    textShadow: `0 0 10px ${project.color}`,
                  }}
                >
                  ↗
                </div>
              </div>

              {/* Bottom border with glow */}
              <div
                className="absolute bottom-0 left-0 h-px w-full transition-all duration-500"
                style={{
                  background: hoveredIndex === index
                    ? `linear-gradient(90deg, transparent, ${project.color}80, transparent)`
                    : 'rgba(255,255,255,0.06)',
                  boxShadow: hoveredIndex === index ? `0 0 8px ${project.color}60` : 'none',
                }}
              />
            </a>
          ))}
        </div>

        <ProjectHoverPreview
          activeImage={activeProject?.image || null}
          activeTitle={activeProject?.title || null}
        />

        {/* Footer */}
        <div
          className="mt-32 pt-12 flex justify-between items-center text-gray-700 font-mono text-xs uppercase tracking-[0.3em]"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.04)',
          }}
        >
          <span>© 2026 Shiting Lin</span>
          <span className="flex items-center gap-1">
            Built for the future
            <span
              className="inline-block w-[2px] h-[14px] bg-violet-400 ml-1"
              style={{ opacity: cursorBlink ? 1 : 0, transition: 'opacity 0.1s' }}
            />
          </span>
        </div>
      </div>
    </div>
  );
};
