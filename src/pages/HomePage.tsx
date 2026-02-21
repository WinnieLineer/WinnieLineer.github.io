import { useRef, useEffect, useState } from 'react';
import { Hero3D } from '../components/Hero3D';

// ─── Resume Data ────────────────────────────────────────────────────────────

const skills = {
  languages: ['Kotlin', 'Java', 'Python', 'JavaScript', 'TypeScript', 'SQL', 'Shell'],
  frameworks: ['Spring Boot', 'Ktor', 'Ktorm', 'Vue.js', 'AngularJS', 'Vite', 'React'],
  tools: ['PostgreSQL', 'Oracle SQL', 'MySQL', 'Redis', 'Kafka', 'Docker', 'Git', 'CI/CD', 'AWS'],
  domain: [
    'Core Banking Systems',
    'Global Fiat Gateways',
    'Payment Processing',
    'Microservices Architecture',
    'High-Concurrency Systems',
    'FX / Cross-Border Transactions',
    'Crypto Payments & Travel Rule',
    'Webhook Security',
  ],
};

const experiences = [
  {
    role: 'Senior Software Engineer',
    company: 'BTSE',
    url: 'https://www.btse.com',
    period: 'Apr 2025 – Present',
    location: 'Taipei',
    color: '#a78bfa',
    tasks: [
      'Global Fiat Integration: Integrated Equals API and Bank Frick to enable multi-currency (GBP, EUR, USD) deposits and automated withdrawals across FPS, SEPA, and SWIFT networks—reducing manual processing time to near zero.',
      'High-Performance Architecture: Engineered a Redis-based (Sorted Sets) reward hold system with sub-10 second end-to-end processing and millisecond-level queries, ensuring seamless high-frequency frontend polling.',
      'Security & Compliance: Implemented automated bank account ownership validation via Volt API and established secure webhook architectures with payload signature and token verification.',
      'Platform Scalability: Designed a cache-optimised crypto address generation module and enhanced the TradeView backend to support Contract for Difference (CFD) functionalities.',
    ],
    tags: ['Kotlin', 'Ktor', 'PostgreSQL', 'Redis', 'Kafka'],
  },
  {
    role: 'Software Engineer',
    company: 'LINE Bank',
    url: 'https://www.linebank.com.tw',
    period: 'Sep 2022 – Apr 2025',
    location: 'Taipei',
    color: '#34d399',
    tasks: [
      'Core Banking & FX Integration: Engineered enhancements to the core banking system to seamlessly interface with the FX module, enabling secure zero-touch automated processing for cross-border transactions—supporting a 3.3× YoY surge in USD outward remittances in early 2026.',
      'Transaction Management: Maintained and optimised core transfer functionalities, achieving 99.9%+ high availability (maintenance only biannually) and secure transaction processing for large-scale user operations.',
      'Bank Statement System: Contributed to the full SDLC from SIT to production, collaborating with vendors and internal teams to meet product and compliance requirements.',
    ],
    tags: ['Java', 'Spring Boot', 'Oracle SQL', 'MySQL', 'AngularJS'],
  },
  {
    role: 'Sabbatical & Professional Development',
    company: 'Self-directed',
    url: null,
    period: 'Nov 2021 – Sep 2022',
    location: 'Singapore / Taiwan',
    color: '#f59e0b',
    tasks: [
      'Singapore Immersion: Lived in Singapore for two months, establishing a strong cultural foundation and high adaptability for future relocation.',
      'Advanced Coursework: Enrolled in advanced Computer Science coursework (Algorithms, Data Structures, Computer Networks) at National Chiao Tung University to deepen system design capabilities.',
    ],
    tags: ['Algorithms', 'System Design', 'Computer Networks'],
  },
  {
    role: 'Software Engineer',
    company: 'E.SUN Financial Holding',
    url: 'https://www.esunbank.com.tw',
    period: 'Apr 2020 – Nov 2021',
    location: 'Taipei',
    color: '#60a5fa',
    tasks: [
      'Microservices Development: Designed and implemented microservices for core banking operations using Java (Spring Boot), Oracle SQL, and Vue.js—supporting 150,000+ daily active users.',
      'System Optimisation: Improved operational efficiency by 20% through workflow optimisation and cross-team collaboration, reducing manual interventions and system latency.',
      'Cross-functional Delivery: Consistently delivered high-quality microservices at 2× the average team velocity, meeting critical banking project deadlines.',
    ],
    tags: ['Java', 'Spring Boot', 'Oracle SQL', 'Vue.js', 'Linux'],
  },
  {
    role: 'Engineer',
    company: 'Compal',
    url: 'https://www.compal.com',
    period: 'Jul 2018 – Feb 2020',
    location: 'Taipei',
    color: '#f472b6',
    tasks: [
      'Supply Chain Solutions: Developed and maintained supply chain management and procurement software using Agile methodologies.',
      'Automated Testing: Reduced testing time by 15% through implementation of automated testing procedures, enhancing software quality and delivery speed.',
    ],
    tags: ['Java', 'Agile', 'Supply Chain'],
  },
];

// ─── Animated Section Hook ───────────────────────────────────────────────────

const useInView = (threshold = 0.15) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
};

// ─── Sub-components ──────────────────────────────────────────────────────────

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-12 text-center">
    <h2 className="inline-block relative text-3xl md:text-4xl font-black tracking-widest uppercase text-white">
      {children}
      <span className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-400 to-transparent" />
    </h2>
  </div>
);

const SkillBadge = ({ label, delay = 0 }: { label: string; delay?: number }) => (
  <span
    className="skill-badge inline-block px-3 py-1.5 text-xs font-semibold rounded-full border border-violet-500/40 text-violet-300 bg-violet-900/20 hover:bg-violet-500/20 hover:border-violet-400 hover:text-white transition-all duration-300 cursor-default"
    style={{ animationDelay: `${delay}ms` }}
  >
    {label}
  </span>
);

const ExperienceCard = ({
  job,
  index,
  visible,
}: {
  job: (typeof experiences)[0];
  index: number;
  visible: boolean;
}) => {
  const [expanded, setExpanded] = useState(false);
  const isEven = index % 2 === 0;

  return (
    <div
      className="experience-card relative"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transitionDelay: `${index * 120}ms`,
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}
    >
      {/* Timeline dot */}
      <div
        className="absolute left-1/2 top-6 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-[#111] z-10"
        style={{ background: job.color, boxShadow: `0 0 12px ${job.color}80` }}
      />

      {/* Card (alternating sides on md+) */}
      <div
        className={`
          md:w-[46%] p-6 rounded-2xl border border-white/10 bg-black/30 backdrop-blur-sm
          hover:border-white/25 hover:bg-black/50 transition-all duration-300 group cursor-pointer
          ${isEven ? 'md:mr-auto md:pr-12' : 'md:ml-auto md:pl-12'}
        `}
        onClick={() => setExpanded(!expanded)}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-violet-200 transition-colors">
              {job.role}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              {job.url ? (
                <a
                  href={job.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold hover:underline"
                  style={{ color: job.color }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {job.company}
                </a>
              ) : (
                <span className="text-sm font-semibold" style={{ color: job.color }}>
                  {job.company}
                </span>
              )}
              <span className="text-xs text-gray-500">· {job.location}</span>
            </div>
          </div>
          <span className="shrink-0 text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-full">
            {job.period}
          </span>
        </div>

        {/* Tags always visible */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {job.tags.map((t) => (
            <span
              key={t}
              className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/10 text-gray-300"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Expandable tasks */}
        <div
          style={{
            maxHeight: expanded ? '600px' : '0',
            overflow: 'hidden',
            transition: 'max-height 0.5s ease',
          }}
        >
          <ul className="mt-3 space-y-2 text-sm text-gray-300 leading-relaxed">
            {job.tasks.map((task, i) => (
              <li key={i} className="flex gap-2">
                <span style={{ color: job.color }} className="mt-1 shrink-0">▸</span>
                <span>{task}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Expand hint */}
        <div className="mt-3 text-center text-xs text-gray-600 group-hover:text-gray-400 transition-colors select-none">
          {expanded ? '▲ collapse' : '▼ expand details'}
        </div>
      </div>
    </div>
  );
};

// ─── Main Page Component ─────────────────────────────────────────────────────

export const HomePage = () => {
  const profileRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const { ref: summaryInView, visible: summaryVisible } = useInView();
  const { ref: techInView, visible: techVisible } = useInView();
  const { ref: expInView, visible: expVisible } = useInView(0.05);
  const { ref: eduInView, visible: eduVisible } = useInView();
  const { ref: contactInView, visible: contactVisible } = useInView();

  const handlePanelClick = (section: string) => {
    const map: Record<string, React.RefObject<HTMLDivElement | null>> = {
      profile: profileRef,
      experience: experienceRef,
      skills: skillsRef,
      contact: contactRef,
    };
    map[section]?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Subtle "hint scroll" on first visit
  useEffect(() => {
    if (!sessionStorage.getItem('hasScrolled')) {
      setTimeout(() => {
        window.scrollTo({ top: 100, behavior: 'smooth' });
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 900);
        sessionStorage.setItem('hasScrolled', 'true');
      }, 2500);
    }
  }, []);

  return (
    <div className="relative">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section style={{ height: '100vh', position: 'relative' }}>
        <Hero3D onPanelClick={handlePanelClick} />
        <div className="scroll-down-indicator" style={{ zIndex: 10 }} />
        {/* Gradient fade into body */}
        <div
          className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, #111111)' }}
        />
      </section>

      {/* ── Content ───────────────────────────────────────────────── */}
      <div className="relative max-w-5xl mx-auto px-6 pb-32 space-y-28">

        {/* ── Summary ───────────────────────────────────────────── */}
        <section ref={profileRef}>
          <div
            ref={summaryInView}
            className="relative rounded-3xl overflow-hidden border border-white/10"
            style={{
              opacity: summaryVisible ? 1 : 0,
              transition: 'opacity 0.8s ease',
              background: 'radial-gradient(ellipse at 70% 50%, rgba(109,40,217,0.18) 0%, rgba(0,0,0,0) 70%), #0d0d0d',
            }}
          >
            {/* Glow stripe */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-60" />
            <div className="p-10 md:p-14">
              {/* Name + title */}
              <div className="mb-8 text-center">
                <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white mb-2 leading-none">
                  Shi Ting{' '}
                  <span
                    className="glitch"
                    data-text="(Winnie)"
                    style={{ color: '#a78bfa' }}
                  >
                    (Winnie)
                  </span>{' '}
                  Lin
                </h1>
                <p className="text-lg md:text-xl font-medium tracking-widest uppercase text-violet-300/80">
                  Senior Backend Engineer
                </p>
              </div>

              {/* Divider */}
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-violet-400 to-transparent mx-auto mb-8" />

              {/* Summary body */}
              <p className="text-base md:text-lg text-gray-300 leading-relaxed text-center max-w-2xl mx-auto">
                7+ years of experience specialising in{' '}
                <span className="text-violet-300 font-semibold">core banking systems</span>,{' '}
                <span className="text-violet-300 font-semibold">global fiat gateways</span>, and{' '}
                <span className="text-violet-300 font-semibold">high-performance microservices</span>.
                Proven track record optimising payment workflows and scaling high-concurrency systems
                with Java and Kotlin.
              </p>

              {/* Pills row */}
              <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                  Relocating to Singapore · mid-June 2026
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_6px_#a78bfa]" />
                  Eligible for Dependant's Pass (DP)
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_6px_#60a5fa]" />
                  Open to local & remote roles
                </div>
              </div>

              {/* CTA links */}
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <a
                  href="mailto:hi@winnie-lin.space"
                  className="group flex items-center gap-2 px-6 py-3 rounded-xl border border-violet-500/50 bg-violet-900/20 text-violet-300 font-semibold hover:bg-violet-500/30 hover:border-violet-400 hover:text-white transition-all duration-300"
                >
                  <span>✉</span> hi@winnie-lin.space
                </a>
                <a
                  href="https://www.linkedin.com/in/winnie-lin-space"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-white/5 text-gray-300 font-semibold hover:bg-white/10 hover:border-white/20 hover:text-white transition-all duration-300"
                >
                  <span>in</span> LinkedIn
                </a>
                <a
                  href="https://winnie-lin.space/resume/"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-white/5 text-gray-300 font-semibold hover:bg-white/10 hover:border-white/20 hover:text-white transition-all duration-300"
                >
                  <span>↗</span> Full Résumé
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── Technical Core ─────────────────────────────────────── */}
        <section ref={skillsRef}>
          <div
            ref={techInView}
            style={{
              opacity: techVisible ? 1 : 0,
              transform: techVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.7s ease, transform 0.7s ease',
            }}
          >
            <SectionTitle>Technical Core</SectionTitle>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Languages */}
              <div className="rounded-2xl border border-white/10 bg-black/20 p-7 card-hover-glow">
                <h3 className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-4">
                  ▸ Languages
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills.languages.map((s, i) => (
                    <SkillBadge key={s} label={s} delay={i * 40} />
                  ))}
                </div>
              </div>

              {/* Frameworks & Tools */}
              <div className="rounded-2xl border border-white/10 bg-black/20 p-7 card-hover-glow">
                <h3 className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-4">
                  ▸ Frameworks & Tools
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills.frameworks.map((s, i) => (
                    <SkillBadge key={s} label={s} delay={i * 40} />
                  ))}
                  {skills.tools.map((s, i) => (
                    <SkillBadge key={s} label={s} delay={(skills.frameworks.length + i) * 40} />
                  ))}
                </div>
              </div>

              {/* Domain Expertise – full width */}
              <div className="md:col-span-2 rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-900/10 to-black/20 p-7 card-hover-glow">
                <h3 className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-4">
                  ▸ Domain Expertise
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills.domain.map((s, i) => (
                    <span
                      key={s}
                      className="inline-block px-4 py-2 text-sm font-medium rounded-full border border-violet-400/30 text-violet-200 bg-violet-800/20 hover:bg-violet-600/30 hover:text-white transition-all duration-300 cursor-default"
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Experience ─────────────────────────────────────────── */}
        <section ref={experienceRef}>
          <div
            ref={expInView}
            style={{
              opacity: expVisible ? 1 : 0,
              transition: 'opacity 0.5s ease',
            }}
          >
            <SectionTitle>Experience</SectionTitle>

            {/* Timeline track */}
            <div className="relative">
              {/* Center vertical line */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500/40 via-violet-500/20 to-transparent -translate-x-1/2" />

              {/* Mobile left line */}
              <div className="md:hidden absolute left-2 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500/40 via-violet-500/20 to-transparent" />

              <div className="space-y-12 md:space-y-16 pt-4">
                {experiences.map((job, i) => (
                  <ExperienceCard key={i} job={job} index={i} visible={expVisible} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Education ──────────────────────────────────────────── */}
        <section>
          <div
            ref={eduInView}
            style={{
              opacity: eduVisible ? 1 : 0,
              transform: eduVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.7s ease, transform 0.7s ease',
            }}
          >
            <SectionTitle>Education</SectionTitle>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-8 card-hover-glow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white">National Central University</h3>
                  <p className="text-violet-300 font-medium mt-1">BBA — Information Management</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Java', 'Databases', 'System Analysis', 'Project Management'].map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 rounded-full bg-white/8 text-gray-400 border border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Supplemental coursework */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">
                  Supplemental Coursework
                </p>
                <p className="text-sm text-gray-400">
                  Advanced Computer Science at{' '}
                  <span className="text-gray-300">National Chiao Tung University</span>{' '}
                  — Algorithms, Data Structures, Computer Networks
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Contact ────────────────────────────────────────────── */}
        <section ref={contactRef}>
          <div
            ref={contactInView}
            style={{
              opacity: contactVisible ? 1 : 0,
              transform: contactVisible ? 'scale(1)' : 'scale(0.96)',
              transition: 'opacity 0.8s ease, transform 0.8s ease',
            }}
          >
            <div
              className="relative rounded-3xl overflow-hidden border border-violet-500/30 p-12 md:p-16 text-center"
              style={{
                background:
                  'radial-gradient(ellipse at 50% 0%, rgba(109,40,217,0.3) 0%, rgba(0,0,0,0) 60%), #0d0d0d',
              }}
            >
              {/* Top glow */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
              {/* Scan line */}
              <div className="scan-line" />

              <p className="text-xs uppercase tracking-[0.3em] text-violet-400 mb-4">
                Open to Opportunities
              </p>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                Let's build something{' '}
                <span
                  className="glitch"
                  data-text="great"
                  style={{ color: '#a78bfa' }}
                >
                  great
                </span>
                .
              </h2>
              <p className="text-gray-400 max-w-md mx-auto mb-10 leading-relaxed">
                Currently open to senior backend engineering roles in Singapore and remote positions globally.
                Specialising in fintech, payment systems, and scalable distributed architectures.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="mailto:hi@winnie-lin.space"
                  className="px-8 py-4 rounded-xl font-bold text-white bg-violet-600 hover:bg-violet-500 transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] hover:-translate-y-0.5"
                >
                  ✉ hi@winnie-lin.space
                </a>
                <a
                  href="https://www.linkedin.com/in/winnie-lin-space"
                  target="_blank"
                  rel="noreferrer"
                  className="px-8 py-4 rounded-xl font-bold text-gray-200 border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30 hover:text-white transition-all duration-300 hover:-translate-y-0.5"
                >
                  in LinkedIn
                </a>
              </div>

              {/* Bottom decoration */}
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
