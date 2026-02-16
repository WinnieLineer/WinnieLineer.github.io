

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
        <h1 className="text-5xl font-bold mb-12 text-center text-white">My Portfolio</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <a 
              href={project.url} 
              key={index} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`block group ${index === 0 ? 'md:col-span-2 lg:col-span-2' : ''}`}
            >
              <div 
                className="glass-morphism h-full transition-all duration-300 ease-in-out group-hover:border-white/20 group-hover:shadow-violet-400/20 transform group-hover:-translate-y-2 flex flex-col overflow-hidden"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h2 className="text-2xl font-semibold mb-3 text-gray-100 group-hover:text-violet-300 transition-colors duration-300">{project.title}</h2>
                  <div className="text-gray-300 mb-4 whitespace-pre-line flex-grow">
                    {project.description}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-auto pt-4">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-xs bg-white/10 text-violet-300 px-3 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
