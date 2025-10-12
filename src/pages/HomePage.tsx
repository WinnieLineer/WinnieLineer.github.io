import { useRef, useEffect } from 'react';
import { Hero3D } from '../components/Hero3D';

// --- Data for the resume content ---
const experiences = [
    {
      role: "Senior Software Engineer",
      company: "BTSE",
      period: "Apr 2025 - Present",
      location: "Taipei",
      tasks: [
        "Implemented fiat and crypto payment solutions, including travel rule support, multi-level approvals, and third-party provider integrations with Kotlin, Ktor, PostgreSQL (via Ktorm), kafka and Redis.",
        "Designed and delivered address management APIs with configurable wallet limits and admin controls, and implemented reward lock-period enforcement to protect incentives and improve fund retention.",
        "Optimized backend systems for performance and scalability, leveraging Redis and PostgreSQL.",
      ],
    },
    {
      role: "Java Developer",
      company: "LINE BANK",
      period: "Sep 2022 - Apr 2025",
      location: "Taipei",
      tasks: [
        "Enhanced core banking system with foreign exchange modules, enabling TWD deposits & withdrawals and real-time transaction notifications—boosting transaction reliability and user experience with Java, Spring Boot, Oracle SQL, AngularJS",
        "Managed and maintained transfer services ensuring secure and seamless money transfer operations across multiple platforms.",
        "Contributed to the full SDLC of a new bank statement system, from SIT to production, collaborating with vendors and internal teams to meet evolving product requirements and compliance standards with Java, Spring Boot, MySQL",
      ],
    },
    {
      role: "Software Engineer",
      company: "E. SUN",
      period: "Apr 2020 - Nov 2021",
      location: "Taipei",
      tasks: [
        "Designed and implemented scalable microservices and web services for core banking operations using Java (Spring Boot), Oracle SQL, SQL Server, Linux scripting, and Vue.js, supporting 150,000+ daily active users with high availability and reliability.",
        "Improved operational efficiency by 20% through workflow optimization and cross-team collaboration, reducing manual interventions and system latency.",
        "Facilitated communication between business and technical teams, translating complex requirements into actionable development plans.",
      ],
    },
    {
      role: "Software Engineer",
      company: "Compal",
      period: "Jul 2018 - Feb 2020",
      location: "Taipei",
      tasks: [
        "Collaborated with cross-functional teams to deliver Agile-based backend software solutions for factory productivity and supply chain management.",
        "Streamlined procurement workflows and reduced testing time by 15% through implementation of automated testing procedures, enhancing software quality and delivery speed.",
      ],
    },
];

const skills = ['Kotlin', 'Java', 'Spring Boot', 'Ktor', 'PostgreSQL', 'Oracle SQL', 'MySQL', 'Redis', 'Kafka', 'Vue.js', 'AngularJS', 'Microservices', 'CI/CD'];

// --- Main Page Component ---
export const HomePage = () => {
  const profileRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const handlePanelClick = (section: string) => {
    let ref;
    switch (section) {
      case 'profile': ref = profileRef; break;
      case 'experience': ref = experienceRef; break;
      case 'skills': ref = skillsRef; break;
      case 'contact': ref = contactRef; break;
      default: ref = null;
    }
    ref?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  useEffect(() => {
    const hasScrolled = sessionStorage.getItem('hasScrolled');
    if (!hasScrolled) {
      setTimeout(() => {
        window.scrollTo({ top: 100, behavior: 'smooth' });
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 900);
        sessionStorage.setItem('hasScrolled', 'true');
      }, 2500);
    }
  }, []);

  return (
    <div>
      <section style={{ height: '100vh', position: 'relative' }}>
        <Hero3D onPanelClick={handlePanelClick} />
        {/* Set a higher z-index to ensure it's visible on top of the 3D scene */}
        <div className="scroll-down-indicator" style={{ zIndex: 10 }}></div>
      </section>

      <section className="relative py-24 px-8">
        <div className="max-w-3xl mx-auto space-y-16">

          <div ref={profileRef} className="p-8 bg-black/20 border border-white/10 rounded-2xl card-hover-glow">
            <h3 className="text-3xl font-bold text-center mb-6 text-violet-300">Profile</h3>
            <p className="text-lg text-gray-300 leading-relaxed text-center">
              Experienced backend engineer with expertise in Kotlin, Java, and cloud-based microservices. Actively seeking opportunities in Singapore and open to relocation. Require employer sponsored work visa.
            </p>
          </div>

          <div ref={experienceRef} className="p-8 bg-black/20 border border-white/10 rounded-2xl card-hover-glow">
            <h3 className="text-3xl font-bold text-center mb-12 text-violet-300">Experience</h3>
            <div className="relative pl-8">
              <div className="absolute left-8 top-2 bottom-2 w-0.5 bg-white/10"></div>
              {experiences.map((job, index) => (
                <div key={index} className="mb-10 relative">
                  <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-violet-400 rounded-full border-2 border-gray-900"></div>
                  <div className="ml-6">
                    <h4 className="text-xl font-semibold text-white">{job.role}</h4>
                    <p className="text-md text-gray-400">{job.company} | {job.location}</p>
                    <p className="text-sm text-gray-500 mb-3">{job.period}</p>
                    <ul className="list-disc list-inside text-gray-300 space-y-2 marker:text-violet-400">
                      {job.tasks.map((task, i) => <li key={i} className="pl-2">{task}</li>)}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div ref={skillsRef} className="p-8 bg-black/20 border border-white/10 rounded-2xl card-hover-glow">
            <h3 className="text-3xl font-bold mb-4 text-center text-violet-300">Skills</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {skills.map(skill => (
                <span key={skill} className="bg-white/10 text-violet-300 text-sm font-medium px-4 py-2 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div ref={contactRef} className="p-8 bg-black/20 border border-white/10 rounded-2xl card-hover-glow text-center">
            <h3 className="text-3xl font-bold mb-6 text-violet-300">Contact</h3>
            <p className="text-lg text-gray-300">I'm currently open to new opportunities.</p>
            <a href="mailto:hi@winnie-lin.space" className="mt-4 inline-block text-xl text-violet-300 hover:text-white transition-colors">
              hi@winnie-lin.space
            </a>
          </div>

        </div>
      </section>
    </div>
  );
};
