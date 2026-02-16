

const projects = [
  {
    title: 'Asset Insights',
    description: 'An advanced asset tracking dashboard featuring automatic asset classification, real-time stock price updates, and dynamic rendering of historical asset value bar charts. Integrated with AI-driven financial advisory for personalized investment insights.',
    image: '/portfolio/asset-insights.png',
    url: 'https://winnie-lin.space/asset-insights/',
    tags: ['Finance', 'Data Visualization', 'AI', 'Real-time API'],
  },
  {
    title: 'Focus Flow',
    description: 'A productivity PWA featuring strict session management and distraction penalties. Designed with a premium glassmorphism UI, smooth SVG animations, and comprehensive stats tracking to enhance focus consistency.',
    image: '/portfolio/focus-flow.png',
    url: 'https://winnie-lin.space/focus-flow/',
    tags: ['Productivity', 'PWA', 'Focus'],
  },
  {
    title: 'Lofi Music',
    description: 'An immersive Lofi music player paired with calming, atmospheric visuals. Distinctively designed to create a relaxing environment for coding, studying, or unwinding.',
    image: '/portfolio/lofi-music.png',
    url: 'https://winnie-lin.space/LofiMusic/',
    tags: ['Music', 'Relaxation', 'Audio'],
  },
  {
    title: 'Pomodoro',
    description: 'A minimalist Pomodoro timer designed to optimize workflow and manage time effectively. Adheres to the classic technique for sustained productivity without distractions.',
    image: '/portfolio/pomodoro.png',
    url: 'https://winnie-lin.space/Pomodoro/',
    tags: ['Productivity', 'Time Management'],
  },
  {
    title: 'Dawnguard',
    description: 'An AI-powered counseling chatbot themed around Tanjiro Kamado. Provides empathetic, supportive interactions to promote mental well-being in a comforting, familiar character voice.',
    image: '/portfolio/dawnguard.png',
    url: 'https://winnie-lin.space/dawnguard/',
    tags: ['Mental Health', 'Chatbot', 'Anime'],
  },
  {
    title: 'DreamScape',
    description: 'A visually striking interactive 3D demo resembling a high-quality game title sequence. Showcases advanced animation techniques and immersive web graphics capabilities.',
    image: '/portfolio/dreamscape.png',
    url: 'https://winnie-lin.space/DreamScape/',
    tags: ['Animation', 'Demo', 'Game'],
  },
  {
    title: 'BPTracker',
    description: 'A health monitoring app utilizing OCR for automated blood pressure and weight logging. Features AI-powered analysis to provide actionable health insights and daily trend tracking.',
    image: '/portfolio/bptracker.png',
    url: 'https://winnie-lin.space/BPTracker/',
    tags: ['Health', 'OCR', 'AI', 'Analytics'],
  },
];

export const PortfolioPage = () => {
  return (
    <div className="min-h-screen p-8 pt-32">
      <div className="container mx-auto">
        <h1 className="text-5xl font-bold mb-12 text-center text-white animate-fade-in-down">My Portfolio</h1>
        
        <style>{`
          @keyframes fadeInDown {
            from {
              opacity: 0;
              transform: translate3d(0, -20px, 0);
            }
            to {
              opacity: 1;
              transform: translate3d(0, 0, 0);
            }
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translate3d(0, 40px, 0);
            }
            to {
              opacity: 1;
              transform: translate3d(0, 0, 0);
            }
          }
          .animate-fade-in-down {
            animation: fadeInDown 0.8s ease-out forwards;
          }
          .animate-fade-in-up {
            animation: fadeInUp 0.8s ease-out forwards;
            opacity: 0; 
          }
        `}</style>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => {
            const isFeatured = index === 0;
            return (
              <a 
                href={project.url} 
                key={index} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`block group relative ${isFeatured ? 'md:col-span-2 lg:col-span-3' : ''} animate-fade-in-up`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div 
                  className={`
                    glass-morphism h-full transition-all duration-500 ease-out 
                    group-hover:border-white/40 group-hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] 
                    transform group-hover:-translate-y-2 flex flex-col overflow-hidden
                    ${isFeatured ? 'lg:flex-row' : ''}
                  `}
                >
                  <div className={`overflow-hidden ${isFeatured ? 'lg:w-3/5 h-64 lg:h-auto' : 'h-48'}`}>
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                    />
                  </div>
                  <div className={`p-8 flex flex-col flex-grow ${isFeatured ? 'lg:w-2/5 lg:justify-center' : ''}`}>
                    <h2 className={`
                      font-semibold mb-3 text-gray-100 group-hover:text-violet-300 transition-colors duration-300
                      ${isFeatured ? 'text-4xl' : 'text-2xl'}
                    `}>
                      {project.title}
                    </h2>
                    <div className={`text-gray-300 mb-4 whitespace-pre-line flex-grow ${isFeatured ? 'text-lg' : ''}`}>
                      {project.description}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-auto pt-4">
                      {project.tags.map(tag => (
                        <span key={tag} className="text-xs bg-white/10 text-violet-300 px-3 py-1 rounded-full border border-white/5">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Sheen effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-150%] group-hover:animate-sheen pointer-events-none" />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};
