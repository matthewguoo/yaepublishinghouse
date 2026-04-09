'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

/* ===== SVG Icons ===== */
function XIcon() {
  return <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>;
}
function GitHubIcon() {
  return <svg viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" /></svg>;
}
function InstagramIcon() {
  return <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>;
}
function LinkedInIcon() {
  return <svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>;
}
function ArrowIcon() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 13L13 1M13 1H4M13 1v9" /></svg>;
}

/* ===== MARQUEE DATA ===== */
const MARQUEE_ITEMS = [
  'Embedded Systems',
  'HDMI & USB Architecture',
  'Rockchip SoC',
  'PCB Design',
  'Robotics',
  'Options Trading',
  'Rust',
  'TypeScript',
  'Embedded Linux',
  'Carnegie Mellon ECE \'30',
  'Hardware Engineering',
  'SpaceX Alumni',
  'Startup Leadership',
  'Cosplay & Making',
];

/* ===== TIMELINE DATA ===== */
const TIMELINE = [
  { year: '2026', title: 'CMU ECE — Class of 2030', desc: 'Admitted to Carnegie Mellon University\'s Electrical & Computer Engineering program.' },
  { year: '2025–26', title: 'Head of Hardware — Corvus Robotics', desc: 'Leading hardware engineering for autonomous drone systems. Rockchip SoC, embedded Linux, HDMI/USB architecture.' },
  { year: '2025', title: 'SpaceX Offer', desc: 'Received an offer from SpaceX before turning 18.' },
  { year: '2024', title: 'AIME Qualifier', desc: 'Qualified for the American Invitational Mathematics Examination. 1560 SAT.' },
  { year: '2024', title: 'YouTube — OSU Mania Robot', desc: 'Built a physical robot that plays osu!mania. 632 subscribers and counting.' },
];

/* ===== PROJECTS DATA ===== */
const PROJECTS = [
  {
    icon: '⚡',
    title: 'Archon',
    tag: 'Trading',
    desc: 'Full-stack options trading platform with real-time payoff visualization, Black-Scholes pricing, and custom DSL for automated strategies.',
    tech: ['Rust', 'TypeScript', 'Perspective', 'WebGL'],
  },
  {
    icon: '🤖',
    title: 'Corvus Flight Systems',
    tag: 'Robotics',
    desc: 'Autonomous drone hardware platform. Custom PCB design, Rockchip SoC integration, HDMI/USB pipeline architecture.',
    tech: ['Embedded C', 'Linux', 'KiCad', 'SoC'],
  },
  {
    icon: '🎹',
    title: 'OSU Mania Robot',
    tag: 'Maker',
    desc: 'Physical robot that plays osu!mania rhythm game in real-time using computer vision and solenoid actuators.',
    tech: ['Python', 'OpenCV', 'Arduino', 'CAD'],
  },
  {
    icon: '📊',
    title: 'Narukami Dashboard',
    tag: 'Finance',
    desc: 'Public-facing market data dashboard with real-time quotes, technical indicators, and options analytics.',
    tech: ['TypeScript', 'Perspective', 'D3', 'WebSocket'],
  },
  {
    icon: '🦊',
    title: 'Yae Publishing House',
    tag: 'Web',
    desc: 'This site. Japanese-influenced editorial design, built with Next.js. Because every builder needs a home.',
    tech: ['Next.js', 'React', 'CSS', 'Vercel'],
  },
  {
    icon: '📖',
    title: 'Kangxi Alt-History',
    tag: 'Writing',
    desc: 'Alternate history novel exploring a different Qing Dynasty timeline. Multiple perspectives, deep world-building.',
    tech: ['Fiction', 'Historical Research'],
  },
];

/* ===== WRITING DATA ===== */
const WRITING = [
  { date: 'Coming Soon', title: 'On Building Things Before You\'re Ready', tag: 'Essay' },
  { date: 'Coming Soon', title: 'The Gap Year Thesis: Why I\'m Not Going Straight to College', tag: 'Personal' },
  { date: 'Coming Soon', title: 'Hardware Engineering at 17: What They Don\'t Tell You', tag: 'Technical' },
];

/* ===== CONNECT LINKS ===== */
const CONNECT = [
  { platform: 'X / Twitter', handle: '@pci_yae', url: 'https://x.com/pci_yae', Icon: XIcon },
  { platform: 'GitHub', handle: 'matthewguoo', url: 'https://github.com/matthewguoo', Icon: GitHubIcon },
  { platform: 'Cosplay', handle: '@yuuko.koro', url: 'https://instagram.com/yuuko.koro', Icon: InstagramIcon },
  { platform: 'LinkedIn', handle: 'Matthew Guo', url: 'https://linkedin.com/in/matthewguo', Icon: LinkedInIcon },
];

/* ===== MAIN COMPONENT ===== */
export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const timelineRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = ['about', 'work', 'projects', 'writing', 'connect'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom > 200) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Timeline intersection observer */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -60px 0px' }
    );

    const items = document.querySelectorAll('.timeline-item');
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <>
      <div className="grain" />

      {/* Navigation */}
      <nav className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
        <div className="nav-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ cursor: 'pointer' }}>
          <span className="nav-kanji">八重堂</span>
          <span className="nav-sep" />
          <span className="nav-name">Matthew Guo</span>
        </div>
        <ul className="nav-links">
          {['about', 'work', 'projects', 'writing', 'connect'].map((s) => (
            <li key={s} className={`nav-link ${activeSection === s ? 'nav-link-active' : ''}`} onClick={() => scrollTo(s)}>
              {s}
            </li>
          ))}
        </ul>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-bg-grain" />
        <div className="hero-bg-gradient" />
        <div className="hero-grid">
          <div className="hero-left">
            <div className="hero-label">
              <span className="hero-label-dot" />
              <span>Building things that matter</span>
            </div>
            <h1 className="hero-name">
              Matthew
              <br />
              Guo
              <span className="hero-name-jp">郭子玉</span>
            </h1>
            <p className="hero-tagline">
              Hardware engineer, builder, and the kind of person who gets a SpaceX offer before their 18th birthday.
            </p>
            <div className="hero-meta">
              <div className="hero-meta-item">
                <span className="hero-meta-label">Currently</span>
                <span className="hero-meta-value">Head of HW @ Corvus Robotics</span>
              </div>
              <div className="hero-meta-item">
                <span className="hero-meta-label">Next</span>
                <span className="hero-meta-value">CMU ECE '30</span>
              </div>
              <div className="hero-meta-item">
                <span className="hero-meta-label">Location</span>
                <span className="hero-meta-value">Mountain View, CA</span>
              </div>
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-visual">
              <div className="hero-visual-frame" />
              <img className="hero-visual-img" src="/miko.jpg" alt="Matthew Guo" />
              <div className="hero-visual-tag">
                <span>Available for interesting conversations</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="marquee-strip">
        <div className="marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="marquee-item">
              <span className="marquee-dot" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* About */}
      <section className="section" id="about">
        <div className="section-header">
          <span className="section-number">01</span>
          <span className="section-line" />
          <h2 className="section-title">About</h2>
        </div>
        <div className="about-grid">
          <div className="about-prose">
            <p>
              I'm a <strong>hardware engineer</strong> who started building before most people start applying.
              At 17, I'm leading hardware at a robotics startup, designing systems around Rockchip SoCs,
              embedded Linux, and custom HDMI/USB architectures.
            </p>
            <p>
              Before that, I had a SpaceX offer, built a <em>robot that plays rhythm games</em> on YouTube,
              and qualified for AIME. I trade options for fun, write alternate history fiction for therapy,
              and make cosplay for the soul.
            </p>
            <p>
              I believe the best engineers are the ones who also care about
              beauty, craft, and the things that make life worth living.
              This fall, I'm headed to <strong>Carnegie Mellon</strong> to study ECE.
            </p>
          </div>
          <div className="about-stats">
            <div className="about-stat">
              <span className="about-stat-value">17</span>
              <span className="about-stat-label">Years Old</span>
            </div>
            <div className="about-stat">
              <span className="about-stat-value">1560</span>
              <span className="about-stat-label">SAT Score</span>
            </div>
            <div className="about-stat">
              <span className="about-stat-value">$200K</span>
              <span className="about-stat-label">Current Comp</span>
            </div>
            <div className="about-stat">
              <span className="about-stat-value">CMU</span>
              <span className="about-stat-label">ECE '30</span>
            </div>
          </div>
        </div>
      </section>

      {/* Work Timeline */}
      <section className="section" id="work">
        <div className="section-header">
          <span className="section-number">02</span>
          <span className="section-line" />
          <h2 className="section-title">Work</h2>
        </div>
        <div className="timeline" ref={timelineRef}>
          {TIMELINE.map((item, i) => (
            <div key={i} className="timeline-item" style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="timeline-year">{item.year}</div>
              <div className="timeline-title">{item.title}</div>
              <div className="timeline-desc">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="section" id="projects">
        <div className="section-header">
          <span className="section-number">03</span>
          <span className="section-line" />
          <h2 className="section-title">Projects</h2>
        </div>
        <div className="projects-grid">
          {PROJECTS.map((project, i) => (
            <div key={i} className="project-card">
              <div className="project-card-header">
                <span className="project-card-icon">{project.icon}</span>
                <span className="project-card-tag">{project.tag}</span>
              </div>
              <h3 className="project-card-title">{project.title}</h3>
              <p className="project-card-desc">{project.desc}</p>
              <div className="project-card-tech">
                {project.tech.map((t, j) => (
                  <span key={j} className="project-tech-tag">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Writing */}
      <section className="section" id="writing">
        <div className="section-header">
          <span className="section-number">04</span>
          <span className="section-line" />
          <h2 className="section-title">Writing</h2>
        </div>
        <div className="writing-list">
          {WRITING.map((post, i) => (
            <div key={i} className="writing-item">
              <span className="writing-date">{post.date}</span>
              <span className="writing-title">{post.title}</span>
              <span className="writing-tag">{post.tag}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Connect */}
      <section className="section" id="connect">
        <div className="section-header">
          <span className="section-number">05</span>
          <span className="section-line" />
          <h2 className="section-title">Connect</h2>
        </div>
        <div className="connect-grid">
          {CONNECT.map((link, i) => (
            <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="connect-card">
              <div className="connect-card-icon">
                <link.Icon />
              </div>
              <div className="connect-card-info">
                <span className="connect-card-platform">{link.platform}</span>
                <span className="connect-card-handle">{link.handle}</span>
              </div>
              <span className="connect-card-arrow"><ArrowIcon /></span>
            </a>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="footer-kanji">八重堂</span>
            <span className="footer-copy">© {new Date().getFullYear()} Matthew Guo</span>
          </div>
          <div className="footer-right">
            <a href="/typography" className="footer-link">Typography</a>
            <a href="https://x.com/pci_yae" target="_blank" rel="noopener noreferrer" className="footer-link">@pci_yae</a>
          </div>
        </div>
      </footer>
    </>
  );
}
