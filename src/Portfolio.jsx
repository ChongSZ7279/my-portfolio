import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Github, Linkedin, Mail, ChevronDown, Menu, X, ArrowRight, Terminal } from 'lucide-react';
import SiewZhenImg from './data/image/SiewZhen.png';
import { ABOUT_CARDS } from './data/about';
import { PROJECTS } from './data/projects';
import { ACHIEVEMENTS } from './data/achievements';
import { TECH_STACK } from './data/techStack';
import TechStack from './TechStack';
import GrowthTimeline from './GrowthTimeLine';
import AboutMe from './AboutMe';
import ProjectsAndAchievements from './ProjectAndAchivement';
import SectionHeader from './components/SectionHeader';
import useHorizontalSwipeNavigate from './hooks/useHorizontalSwipeNavigate';

// ─── PARTICLE SYSTEM ───────────────────────────────────────────────────────────
const ParticleField = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.size = Math.random() * 1.5 + 0.3;
        this.alpha = Math.random() * 0.5 + 0.1;
        this.color = Math.random() > 0.5 ? '99,102,241' : '6,182,212';
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
        ctx.fill();
      }
    }
    for (let i = 0; i < 120; i++) particles.push(new Particle());
    const connect = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const d = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99,102,241,${0.08 * (1 - d / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    };
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      connect();
      animationId = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(animationId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

// ─── GLITCH TEXT ───────────────────────────────────────────────────────────────
const GlitchText = ({ text, className = '' }) => {
  const [glitching, setGlitching] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 200);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  return (
    <span className={`relative inline-block ${className}`}>
      <span className={glitching ? 'opacity-0' : 'opacity-100'}>{text}</span>
      {glitching && <>
        <span className="absolute inset-0 text-cyan-400 translate-x-0.5 -translate-y-0.5 opacity-70">{text}</span>
        <span className="absolute inset-0 text-violet-500 -translate-x-0.5 translate-y-0.5 opacity-70">{text}</span>
      </>}
    </span>
  );
};

// ─── TYPEWRITER ────────────────────────────────────────────────────────────────
const TypeWriter = ({ strings, speed = 80, deleteSpeed = 40, pause = 2000 }) => {
  const [display, setDisplay] = useState('');
  const [idx, setIdx] = useState(0);
  const [typing, setTyping] = useState(true);
  const [charIdx, setCharIdx] = useState(0);
  useEffect(() => {
    if (typing) {
      if (charIdx < strings[idx].length) {
        const t = setTimeout(() => setCharIdx(c => c + 1), speed);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setTyping(false), pause);
        return () => clearTimeout(t);
      }
    } else {
      if (charIdx > 0) {
        const t = setTimeout(() => setCharIdx(c => c - 1), deleteSpeed);
        return () => clearTimeout(t);
      } else {
        setIdx(i => (i + 1) % strings.length);
        setTyping(true);
      }
    }
  }, [charIdx, typing, idx]);
  useEffect(() => { setDisplay(strings[idx].slice(0, charIdx)); }, [charIdx, idx]);
  return <span>{display}<span className="animate-pulse text-cyan-400">|</span></span>;
};

// ─── COUNTER ───────────────────────────────────────────────────────────────────
const Counter = ({ end, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const step = end / 40;
        const t = setInterval(() => {
          start += step;
          if (start >= end) { setCount(end); clearInterval(t); } else setCount(Math.floor(start));
        }, 30);
        obs.disconnect();
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end]);
  return <span ref={ref}>{count}{suffix}</span>;
};

// (Section headers are shared via ./components/SectionHeader)

// ─── WORLD OF TIME SIDE RAIL BUTTON ──────────────────────────────────────────
const WorldOfTimeButton = ({ onClick }) => {
  const [hovered, setHovered] = useState(false);
  const [tick, setTick] = useState(0);

  // Animate the orbital ring dots
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 50);
    return () => clearInterval(id);
  }, []);

  const orbitAngle = (tick * 3) % 360;
  const orbitRad = (orbitAngle * Math.PI) / 180;
  const r = 14; // orbit radius
  const dotX = Math.cos(orbitRad) * r;
  const dotY = Math.sin(orbitRad) * r;
  const dot2X = Math.cos(orbitRad + Math.PI) * r;
  const dot2Y = Math.sin(orbitRad + Math.PI) * r;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="hidden lg:flex fixed right-0 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-0 group"
      style={{ right: 0 }}
      aria-label="Enter World of Time — Journey"
    >
      {/* The pill */}
      <div
        className="relative flex flex-col items-center gap-3 px-3 py-5 rounded-l-2xl transition-all duration-500"
        style={{
          background: hovered
            ? 'linear-gradient(180deg, rgba(6,182,212,0.18) 0%, rgba(99,102,241,0.18) 100%)'
            : 'linear-gradient(180deg, rgba(6,182,212,0.07) 0%, rgba(99,102,241,0.07) 100%)',
          border: '1px solid',
          borderRight: 'none',
          borderColor: hovered ? 'rgba(6,182,212,0.6)' : 'rgba(6,182,212,0.2)',
          boxShadow: hovered
            ? '-8px 0 32px -4px rgba(6,182,212,0.25), inset 0 0 20px rgba(6,182,212,0.05)'
            : '-4px 0 16px -4px rgba(6,182,212,0.1)',
          transform: hovered ? 'translateX(-4px)' : 'translateX(0)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Animated orbital SVG icon */}
        <div className="relative w-8 h-8 flex-shrink-0">
          <svg width="32" height="32" viewBox="-18 -18 36 36" className="overflow-visible">
            {/* Outer orbit ring */}
            <circle cx="0" cy="0" r="14" fill="none"
              stroke={hovered ? 'rgba(6,182,212,0.5)' : 'rgba(6,182,212,0.2)'}
              strokeWidth="0.8"
              strokeDasharray="3 4"
              style={{ transition: 'stroke 0.4s' }}
            />
            {/* Inner glow core */}
            <circle cx="0" cy="0" r="5" fill="none"
              stroke={hovered ? 'rgba(99,102,241,0.8)' : 'rgba(99,102,241,0.4)'}
              strokeWidth="1"
              style={{ transition: 'stroke 0.4s' }}
            />
            <circle cx="0" cy="0" r="2.5"
              fill={hovered ? '#818cf8' : 'rgba(99,102,241,0.5)'}
              style={{ transition: 'fill 0.4s' }}
            />
            {/* Orbiting dots */}
            <circle cx={dotX} cy={dotY} r="2"
              fill={hovered ? '#06b6d4' : 'rgba(6,182,212,0.6)'}
              style={{ transition: 'fill 0.2s' }}
            />
            <circle cx={dot2X} cy={dot2Y} r="1.2"
              fill={hovered ? '#818cf8' : 'rgba(99,102,241,0.4)'}
              style={{ transition: 'fill 0.2s' }}
            />
          </svg>
        </div>

        {/* Vertical text */}
        <span
          className="text-[10px] font-mono tracking-[0.35em] uppercase transition-colors duration-300"
          style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            color: hovered ? '#06b6d4' : '#64748b',
            letterSpacing: '0.35em',
          }}
        >
          World of Time
        </span>

        {/* Gradient line */}
        <div
          className="w-px transition-all duration-500"
          style={{
            height: hovered ? 28 : 16,
            background: 'linear-gradient(to bottom, #06b6d4, #818cf8)',
            opacity: hovered ? 1 : 0.4,
          }}
        />

        {/* Journey label */}
        <span
          className="text-[9px] font-mono uppercase tracking-widest transition-colors duration-300"
          style={{ color: hovered ? '#818cf8' : '#334155' }}
        >
          Journey
        </span>

        {/* Arrow */}
        <span
          className="text-xs transition-all duration-300"
          style={{
            color: hovered ? '#06b6d4' : '#334155',
            transform: hovered ? 'translateX(-2px)' : 'translateX(0)',
          }}
        >
          ←
        </span>

        {/* Hover glow edge */}
        {hovered && (
          <div
            className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full"
            style={{ background: 'linear-gradient(to bottom, #06b6d4, #818cf8)', boxShadow: '0 0 8px #06b6d4' }}
          />
        )}
      </div>
    </button>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const Portfolio = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [loaded, setLoaded] = useState(false);

  const stats = [
    { n: 3.97, suffix: '', label: 'CGPA' },
    { n: ACHIEVEMENTS.length, suffix: '', label: 'Awards' },
    { n: PROJECTS.length, suffix: '', label: 'Projects' },
    { n: Object.values(TECH_STACK).reduce((acc, arr) => acc + (Array.isArray(arr) ? arr.length : 0), 0), suffix: '', label: 'Technologies' },
  ];

  useHorizontalSwipeNavigate({
    enabled: true,
    onSwipeLeft: () => navigate('/journey'),
  });

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
    const onScroll = () => {
      setIsScrolled(window.scrollY > 60);
      const secs = ['home', 'about', 'stack', 'projects', 'achievements', 'contact'];
      const cur = secs.find(s => {
        const el = document.getElementById(s);
        if (el) { const r = el.getBoundingClientRect(); return r.top <= 120 && r.bottom >= 120; }
        return false;
      });
      if (cur) setActiveSection(cur);
    };
    const onMouse = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('scroll', onScroll);
    window.addEventListener('mousemove', onMouse);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('mousemove', onMouse); };
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(id);
    setIsMenuOpen(false);
  };

  const navItems = ['home', 'about', 'stack', 'projects', 'achievements', 'contact'];

  return (
    <div className="min-h-screen bg-[#050B17] text-white font-sans overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500&family=Outfit:wght@300;400;500;600;700&display=swap');
        :root { font-family: 'Outfit', sans-serif; }
        .font-display { font-family: 'Syne', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #050B17; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: #06b6d4; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes scanline { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
        @keyframes glow-pulse { 0%,100%{opacity:0.4} 50%{opacity:0.8} }
        @keyframes fade-up { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slide-right { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-glow-pulse { animation: glow-pulse 3s ease-in-out infinite; }
        .animate-fade-up { animation: fade-up 0.7s ease forwards; }
        .animate-slide-right { animation: slide-right 0.5s ease forwards; }
        .grid-bg { background-image: linear-gradient(rgba(6,182,212,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.03) 1px, transparent 1px); background-size: 60px 60px; }
        .noise { background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E"); }
        .hex-clip { clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); }
        .text-gradient { background: linear-gradient(135deg, #fff 0%, #94a3b8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .text-gradient-cyan { background: linear-gradient(135deg, #06b6d4 0%, #818cf8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .border-glow { box-shadow: 0 0 20px rgba(6,182,212,0.1), inset 0 0 20px rgba(6,182,212,0.02); }
        .line-glow { box-shadow: 0 0 8px rgba(6,182,212,0.6); }
      `}</style>

      <ParticleField />
      <div className="fixed inset-0 grid-bg pointer-events-none z-0 opacity-60"></div>
      <div className="fixed inset-0 noise pointer-events-none z-0"></div>
      <div className="fixed top-1/4 -left-40 w-96 h-96 bg-violet-600/8 rounded-full blur-3xl pointer-events-none z-0 animate-glow-pulse"></div>
      <div className="fixed bottom-1/3 -right-40 w-80 h-80 bg-cyan-600/8 rounded-full blur-3xl pointer-events-none z-0 animate-glow-pulse" style={{ animationDelay: '1.5s' }}></div>
      <div className="fixed top-2/3 left-1/3 w-64 h-64 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none z-0 animate-glow-pulse" style={{ animationDelay: '3s' }}></div>
      <div
        className="fixed w-64 h-64 rounded-full pointer-events-none z-0 transition-all duration-700 ease-out"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.04) 0%, transparent 70%)', left: mousePos.x - 128, top: mousePos.y - 128 }}
      ></div>

      {/* ── NAVIGATION ── */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-[#050B17]/90 backdrop-blur-xl border-b border-slate-800/80' : ''}`}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => scrollTo('home')} className="group flex items-center gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-cyan-400/40 flex items-center justify-center bg-slate-900/60">
                <img
                  src={SiewZhenImg}
                  alt="Chong Siew Zhen"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-mono text-sm text-slate-300 group-hover:text-cyan-400 transition-colors">
                Chong Siew Zhen
              </span>
            </button>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map(item => (
                <button
                  key={item}
                  onClick={() => scrollTo(item)}
                  className={`group relative px-3.5 py-2 text-[13px] font-mono rounded-xl transition-all duration-200 capitalize tracking-wide
                    ${activeSection === item
                      ? 'text-cyan-300 bg-cyan-500/10'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                >
                  <span className="relative z-10">
                    {activeSection === item && <span className="text-cyan-500 mr-1">/</span>}{item}
                  </span>
                  {activeSection === item && (
                    <span
                      className="absolute inset-0 rounded-xl border"
                      style={{
                        borderColor: "rgba(6,182,212,0.22)",
                        boxShadow: "0 0 0 1px rgba(6,182,212,0.06), 0 10px 28px -18px rgba(6,182,212,0.55)",
                      }}
                      aria-hidden="true"
                    />
                  )}
                  <span
                    className={`absolute left-3.5 right-3.5 -bottom-0.5 h-[2px] rounded-full transition-all duration-300 ${
                      activeSection === item ? "opacity-100" : "opacity-0 group-hover:opacity-60"
                    }`}
                    aria-hidden="true"
                  />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <a href="mailto:chong.zhen@graduate.utm.my" className="hidden md:flex items-center gap-2 px-4 py-2 border border-cyan-500/40 rounded-lg text-sm text-cyan-400 hover:bg-cyan-500/10 transition-all font-mono">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></span>
                Open to work
              </a>
              <button
                className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-slate-300 hover:text-white transition-all"
                style={{
                  background: isMenuOpen ? 'rgba(6,182,212,0.10)' : 'rgba(15,23,42,0.55)',
                  border: isMenuOpen ? '1px solid rgba(6,182,212,0.35)' : '1px solid rgba(148,163,184,0.16)',
                  boxShadow: isMenuOpen ? '0 12px 30px -18px rgba(6,182,212,0.7)' : 'none',
                  backdropFilter: 'blur(14px)',
                }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-[#050B17]/98 backdrop-blur-xl border-t border-slate-800">
            {navItems.map(item => (
              <button
                key={item}
                onClick={() => scrollTo(item)}
                className={`block w-full text-left px-6 py-4 font-mono text-sm capitalize transition-colors ${activeSection === item ? 'text-cyan-400 bg-cyan-500/5' : 'text-slate-400'}`}
              >
                {activeSection === item && '▸ '}{item}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section id="home" className="relative min-h-screen flex flex-col justify-center px-4 sm:px-6 pt-20">
        <div className="max-w-6xl mx-auto w-full">
          <div className={`transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex items-center gap-3 mb-8">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 bg-rose-400 rounded-full"></div>
                <div className="w-2.5 h-2.5 bg-amber-400 rounded-full"></div>
                <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full"></div>
              </div>
              <span className="text-xs font-mono text-slate-500">portfolio_v2026 — process running</span>
            </div>

            <div className="mb-8">
              <div className="text-sm font-mono text-cyan-400 mb-3 tracking-widest">$ init —name="Chong Siew Zhen"</div>
              <h1 className="font-display text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black leading-none mb-2">
                <span className="text-gradient">CHONG</span>
              </h1>
              <h1 className="font-display text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black leading-none text-white/10 mb-4">
                SIEW ZHEN
              </h1>
              <p className="text-lg md:text-2xl font-mono text-slate-300">
                Full-Stack Developer <span className="text-cyan-400">|</span> UI/UX Designer
              </p>
            </div>

            <div className="text-sm md:text-base text-slate-400 font-mono mb-6 h-5">
              <TypeWriter strings={['Hackathon Competitor', 'Robotics Champion', 'System-Focused Engineer', 'Builder of Scalable Real-World Apps']} />
            </div>

            <div className="flex flex-wrap gap-4 mb-16">
              <button onClick={() => scrollTo('projects')} className="group flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/30 text-sm">
                View Projects
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => scrollTo('contact')} className="group flex items-center gap-2 px-6 py-3 border border-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 rounded-xl transition-all duration-200 text-sm">
                Contact Me
                <Mail size={14} />
              </button>
              <a href="https://github.com/ChongSZ7279" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-3 border border-slate-800 hover:border-slate-600 text-slate-500 hover:text-slate-300 rounded-xl transition-all text-sm">
                <Github size={16} /> GitHub
              </a>
            </div>

            <div className="grid grid-cols-4 gap-4 border-t border-slate-800 pt-8 sm:flex sm:flex-wrap sm:gap-8">
              {stats.map(({ n, suffix, label }) => (
                <div key={label} className="min-w-0">
                  <div className="text-2xl font-black text-white font-display tabular-nums">
                    <Counter end={n} suffix={suffix} />
                  </div>
                  <div className="text-[11px] sm:text-xs text-slate-500 font-mono tracking-widest uppercase mt-0.5">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button onClick={() => scrollTo('about')} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600 hover:text-slate-400 transition-colors group">
          <span className="text-xs font-mono tracking-widest">SCROLL</span>
          <ChevronDown size={16} className="animate-bounce" />
        </button>
      </section>

      {/* ── WORLD OF TIME SIDE RAIL ── */}
      <WorldOfTimeButton onClick={() => navigate('/journey')} />

      {/* ── MOBILE JOURNEY CTA ── */}
      <button
        onClick={() => navigate('/journey')}
        className="lg:hidden fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold active:scale-95 transition-all duration-200"
        style={{
          background: "linear-gradient(135deg, rgba(6,182,212,0.95) 0%, rgba(99,102,241,0.92) 60%, rgba(236,72,153,0.85) 100%)",
          color: "#050B17",
          boxShadow: "0 18px 40px -14px rgba(6,182,212,0.55), 0 0 0 1px rgba(6,182,212,0.15)",
        }}
        aria-label="Open Journey (World of Time)"
      >
        <span className="font-mono tracking-wide">Journey</span>
        <ArrowRight size={16} />
      </button>

      {/* ── ABOUT ME ── */}
      <AboutMe onExploreProjects={() => scrollTo('projects')} />

      {/* ── TECH STACK ── */}
      <TechStack />

      {/* ── PROJECTS & ACHIEVEMENTS ── */}
      <ProjectsAndAchievements />

      {/* ── CONTACT ── */}
      <section id="contact" className="relative py-20 sm:py-32 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <SectionHeader
            align="center"
            label="get in touch"
            title={
              <>
                Let's Build
                <br />
                <span className="text-gradient-cyan">Something Real</span>
              </>
            }
            subtitle={
              "I'm open to internships, hackathon collaborations, research opportunities, or just interesting conversations about AI, Web3, and systems design."
            }
            className="mb-12"
          />

          <div className="grid sm:grid-cols-3 gap-4 mb-12">
            {[
              { icon: Mail, label: 'Email', value: 'chong.zhen@graduate.utm.my', href: 'mailto:chong.zhen@graduate.utm.my', color: 'violet' },
              { icon: Linkedin, label: 'LinkedIn', value: 'chongsiewzhen', href: 'https://www.linkedin.com/in/chong-siew-zhen-29b236257/', color: 'cyan' },
              { icon: Github, label: 'GitHub', value: 'ChongSZ7279', href: 'https://github.com/ChongSZ7279', color: 'slate' },
            ].map(({ icon: Icon, label, value, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className="group flex flex-col items-center gap-3 p-6 bg-slate-900/50 border border-slate-800 hover:border-slate-600 rounded-2xl transition-all duration-300 hover:bg-slate-900">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon size={18} className="text-slate-300 group-hover:text-cyan-400 transition-colors" />
                </div>
                <div>
                  <div className="text-xs font-mono text-slate-500 mb-1 uppercase tracking-widest">{label}</div>
                  <div className="text-sm text-slate-300 group-hover:text-white transition-colors break-all sm:truncate">{value}</div>
                </div>
              </a>
            ))}
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-sm font-mono">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
            Available for collaborations · 2026
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-800 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full overflow-hidden border border-cyan-400/40 flex items-center justify-center bg-slate-900/60">
              <img
                src={SiewZhenImg}
                alt="Chong Siew Zhen"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-slate-500 text-sm font-mono">Chong Siew Zhen <span className="text-slate-700">·</span> UTM Software Engineering <span className="text-slate-700">·</span> CGPA 3.97</span>
          </div>
          <p className="text-slate-700 text-xs font-mono">© 2026 · Built with React + Tailwind · Imperfectly Perfect</p>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;