import { useState } from 'react';
import { ProjectHoverPreview } from '../components/ProjectHoverPreview';

const projects = [
  {
    title: 'Asset Insights',
    description: 'An advanced asset tracking dashboard featuring automatic asset classification, real-time stock price updates, and dynamic rendering of historical asset value bar charts.',
    image: '/portfolio/asset-insights.png',
    url: 'https://winnie-lin.space/asset-insights/',
    tags: ['Finance', 'AI', 'Real-time'],
    year: '2024'
  },
  {
    title: 'Dawnguard',
    description: 'An AI-powered counseling chatbot themed around Tanjiro Kamado. Provides empathetic, supportive interactions.',
    image: '/portfolio/dawnguard.png',
    url: 'https://winnie-lin.space/dawnguard/',
    tags: ['Mental Health', 'Chatbot', 'Anime'],
    year: '2024'
  },
  {
    title: 'Focus Flow',
    description: 'A productivity PWA featuring strict session management and distraction penalties. Designed with a premium glassmorphism UI.',
    image: '/portfolio/focus-flow.png',
    url: 'https://winnie-lin.space/focus-flow/',
    tags: ['Productivity', 'PWA', 'Focus'],
    year: '2023'
  },
  {
    title: 'Lofi Music',
    description: 'An immersive Lofi music player paired with calming, atmospheric visuals.',
    image: '/portfolio/lofi-music.png',
    url: 'https://winnie-lin.space/LofiMusic/',
    tags: ['Music', 'Relaxation', 'Audio'],
    year: '2023'
  },
  {
    title: 'Pomodoro',
    description: 'A minimalist Pomodoro timer designed to optimize workflow and manage time effectively.',
    image: '/portfolio/pomodoro.png',
    url: 'https://winnie-lin.space/Pomodoro/',
    tags: ['Productivity', 'Time Management'],
    year: '2023'
  },
  {
    title: 'DreamScape',
    description: 'A visually striking interactive 3D demo resembling a high-quality game title sequence.',
    image: '/portfolio/dreamscape.png',
    url: 'https://winnie-lin.space/DreamScape/',
    tags: ['Animation', 'Demo', 'Game'],
    year: '2022'
  },
  {
    title: 'BPTracker',
    description: 'A health monitoring app utilizing OCR for automated blood pressure and weight logging.',
    image: '/portfolio/bptracker.png',
    url: 'https://winnie-lin.space/BPTracker/',
    tags: ['Health', 'OCR', 'AI'],
    year: '2022'
  },
];

export const PortfolioPage = () => {
  const [activeProject, setActiveProject] = useState<{ image: string; title: string } | null>(null);

  return (
    <div className="min-h-screen p-8 pt-32 bg-[#111111]">
      <div className="container mx-auto">
        <div className="flex justify-between items-baseline mb-24">
          <h1 className="text-7xl font-light text-white uppercase tracking-widest">Projects</h1>
          <div className="text-gray-500 font-mono text-sm">(Selected Works 2022–2024)</div>
        </div>

        <div className="relative">
          {projects.map((project, index) => (
            <a 
              href={project.url} 
              key={index} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="project-list-item block group"
              onMouseEnter={() => setActiveProject({ image: project.image, title: project.title })}
              onMouseLeave={() => setActiveProject(null)}
            >
              <div className="flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-8">
                  <span className="text-sm font-mono text-gray-600 hidden md:inline">0{index + 1}</span>
                  <h2 className="project-title">{project.title}</h2>
                </div>
                
                <div className="project-meta hidden lg:block">
                  <div className="flex gap-4 items-center">
                    <div className="flex flex-wrap gap-2 justify-end">
                      {project.tags.map(tag => (
                        <span key={tag} className="text-[10px] bg-white/5 text-violet-300 px-2 py-0.5 rounded border border-white/5">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-2xl font-light text-gray-500 w-16">{project.year}</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-2 max-w-xs">{project.description}</p>
                </div>
              </div>
            </a>
          ))}
        </div>

        <ProjectHoverPreview 
          activeImage={activeProject?.image || null} 
          activeTitle={activeProject?.title || null} 
        />
        
        <div className="mt-32 border-t border-white/5 pt-12 flex justify-between text-gray-600 font-mono text-xs uppercase tracking-[0.3em]">
          <span>© 2024 Shiting Lin</span>
          <span>Built for the future_</span>
        </div>
      </div>
    </div>
  );
};
