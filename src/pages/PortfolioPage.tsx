import { useEffect, useRef, useState } from 'react';

type Project = {
  title: string;
  description: string;
  image?: string;
  noImage?: boolean;
  url: string;
  tags: string[];
  year: string;
  accent: string;
};

const projects = [
  {
    title: 'Asset Insights',
    description: 'An advanced asset tracking dashboard featuring automatic asset classification, real-time stock price updates, and dynamic rendering of historical asset value bar charts.',
    image: '/portfolio/asset-insights.png',
    url: 'https://winnie-lin.space/asset-insights/',
    tags: ['Finance', 'AI', 'Real-time'],
    year: '2026',
    accent: '#a78bfa',
  },
  {
    title: 'Dawnguard',
    description: 'An AI-powered counseling chatbot themed around Tanjiro Kamado. Provides empathetic, supportive interactions.',
    image: '/portfolio/dawnguard.png',
    url: 'https://winnie-lin.space/dawnguard/',
    tags: ['Mental Health', 'Chatbot', 'Anime'],
    year: '2026',
    accent: '#34d399',
  },
  {
    title: 'Focus Flow',
    description: 'A productivity PWA featuring strict session management and distraction penalties. Designed with a premium glassmorphism UI.',
    image: '/portfolio/focus-flow.png',
    url: 'https://winnie-lin.space/focus-flow/',
    tags: ['Productivity', 'PWA', 'Focus'],
    year: '2025',
    accent: '#60a5fa',
  },
  {
    title: 'Lofi Music',
    description: 'An immersive Lofi music player paired with calming, atmospheric visuals.',
    image: '/portfolio/lofi-music.png',
    url: 'https://winnie-lin.space/LofiMusic/',
    tags: ['Music', 'Relaxation', 'Audio'],
    year: '2025',
    accent: '#f472b6',
  },
  {
    title: 'Pomodoro',
    description: 'A minimalist Pomodoro timer designed to optimize workflow and manage time effectively, with focus sounds.',
    image: '/portfolio/pomodoro.png',
    url: 'https://winnie-lin.space/Pomodoro/',
    tags: ['Productivity', 'Time Management'],
    year: '2025',
    accent: '#fb923c',
  },
  {
    title: 'DreamScape',
    description: 'A visually striking interactive 3D demo resembling a high-quality game title sequence.',
    noImage: true,
    url: 'https://winnie-lin.space/DreamScape/',
    tags: ['Animation', 'Demo', 'Game'],
    year: '2024',
    accent: '#38bdf8',
  },
  {
    title: 'BPTracker',
    description: 'A health monitoring app utilizing OCR for automated blood pressure and weight logging.',
    noImage: true,
    url: 'https://winnie-lin.space/BPTracker/',
    tags: ['Health', 'OCR', 'AI'],
    year: '2024',
    accent: '#f87171',
  },
];

// ─── Animated in-view hook ────────────────────────────────────────────────────
const useInView = (threshold = 0.1) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
};

// ─── Project Card ─────────────────────────────────────────────────────────────
const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const { ref, visible } = useInView();
  const [imgError, setImgError] = useState(project.noImage ?? false);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
        transitionDelay: `${(index % 2) * 80}ms`,
      }}
    >
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block h-full"
      >
        <div
          className="relative h-full rounded-2xl overflow-hidden border border-white/10 bg-black/30 backdrop-blur-sm transition-all duration-400"
          style={{
            ['--accent' as any]: project.accent,
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.borderColor = `${project.accent}55`;
            (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 40px ${project.accent}22`;
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = '';
            (e.currentTarget as HTMLElement).style.boxShadow = '';
            (e.currentTarget as HTMLElement).style.transform = '';
          }}
        >
          {/* Image / No-image zone */}
          <div className="relative w-full aspect-video overflow-hidden bg-black/40">
            {!imgError ? (
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={() => setImgError(true)}
              />
            ) : (
              /* Intentional no-image design — stylised gradient placard */
              <div
                className="w-full h-full relative flex flex-col items-center justify-center select-none overflow-hidden"
                style={{ background: '#0a0a0a' }}
              >
                {/* Radial glow */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: `radial-gradient(ellipse 70% 60% at 50% 55%, ${project.accent}22 0%, transparent 70%)`,
                }} />
                {/* Grid lines */}
                <div style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: `linear-gradient(${project.accent}10 1px, transparent 1px), linear-gradient(90deg, ${project.accent}10 1px, transparent 1px)`,
                  backgroundSize: '28px 28px',
                }} />
                {/* Initial */}
                <span style={{
                  fontSize: '3.5rem',
                  fontWeight: 900,
                  color: project.accent,
                  opacity: 0.18,
                  lineHeight: 1,
                  letterSpacing: '-0.04em',
                  textShadow: `0 0 40px ${project.accent}`,
                  position: 'relative',
                }}>{project.title[0]}</span>
                {/* Label */}
                <span style={{
                  position: 'relative',
                  fontSize: '0.6rem',
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: project.accent,
                  opacity: 0.4,
                  marginTop: '0.4rem',
                }}>preview unavailable</span>
              </div>
            )}
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            {/* Year badge */}
            <span className="absolute top-3 right-3 text-xs font-mono font-bold px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-gray-400 border border-white/10">
              {project.year}
            </span>
            {/* Arrow on hover */}
            <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/50 border border-white/20 backdrop-blur-sm flex items-center justify-center text-gray-400 text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:border-white/40 group-hover:text-white">
              ↗
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            {/* Index + title */}
            <div className="flex items-start gap-3 mb-3">
              <span
                className="shrink-0 text-xs font-mono font-bold mt-0.5"
                style={{ color: project.accent }}
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <h2 className="text-base font-bold text-white group-hover:text-violet-200 transition-colors duration-300 leading-tight">
                {project.title}
              </h2>
            </div>

            <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
              {project.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map(tag => (
                <span
                  key={tag}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full border"
                  style={{
                    color: project.accent,
                    borderColor: `${project.accent}40`,
                    background: `${project.accent}12`,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom accent line on hover */}
          <div
            className="absolute inset-x-0 bottom-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: `linear-gradient(to right, transparent, ${project.accent}80, transparent)` }}
          />
        </div>
      </a>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export const PortfolioPage = () => {
  return (
    <div className="min-h-screen relative">
      {/* Top radial glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(109,40,217,0.15) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-28 pb-28">

        {/* ── Header ───────────────────────────────────────── */}
        <div className="mb-12 sm:mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-violet-400 mb-3">Selected Works</p>
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-none">
              Pro
              <span
                className="glitch"
                data-text="jects"
                style={{ color: '#a78bfa' }}
              >
                jects
              </span>
            </h1>
            <span className="text-gray-600 font-mono text-sm">2024 – 2026</span>
          </div>
          <div className="mt-6 w-24 h-px bg-gradient-to-r from-transparent via-violet-400 to-transparent" />
        </div>

        {/* ── Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>

        {/* ── Footer ───────────────────────────────────────── */}
        <div className="mt-20 border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between gap-2 text-gray-700 font-mono text-xs uppercase tracking-[0.3em]">
          <span>© 2026 Shi Ting Lin</span>
          <span>Built for the future_</span>
        </div>
      </div>
    </div>
  );
};
