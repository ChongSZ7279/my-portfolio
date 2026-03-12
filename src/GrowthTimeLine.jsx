import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Tilt from "react-parallax-tilt";
import { timelineData } from "./data/growthJourney";
import SectionHeader from "./components/SectionHeader";

/* ─────────────────────────────────────────────
   HOOKS
───────────────────────────────────────────── */
function useIntersection(ref, options = {}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.1, ...options });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, options]);
  return visible;
}

function useScrollProgress(containerRef) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      // Trigger at 70% of viewport height — node lights up when it's well into view
      const activationLine = windowH * 0.7;
      // How far past the activation line is the top of the container
      const scrolled = activationLine - rect.top;
      const total = Math.max(1, rect.height);
      setProgress(Math.min(1, Math.max(0, scrolled / total)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [containerRef]);
  return progress;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

/* ─────────────────────────────────────────────
   PARTICLE BACKGROUND
───────────────────────────────────────────── */
function Particles() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const pts = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      r: Math.random() * 1.0 + 0.3,
      a: Math.random() * 0.25 + 0.05,
      c: Math.random() > 0.5 ? "6,182,212" : "139,92,246",
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach((p) => {
        p.x = (p.x + p.vx + canvas.width) % canvas.width;
        p.y = (p.y + p.vy + canvas.height) % canvas.height;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c},${p.a})`;
        ctx.fill();
      });
      for (let i = 0; i < pts.length; i++)
        for (let j = i + 1; j < pts.length; j++) {
          const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
          if (d < 80) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(99,102,241,${0.05 * (1 - d / 80)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

/* ─────────────────────────────────────────────
   TECH TAG
───────────────────────────────────────────── */
function Tag({ label, accent }) {
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border transition-all duration-300"
      style={{
        color: accent,
        borderColor: `${accent}40`,
        background: `${accent}10`,
        boxShadow: `0 0 8px ${accent}20`,
      }}
    >
      {label}
    </span>
  );
}

/* ─────────────────────────────────────────────
   AWARD BADGE
───────────────────────────────────────────── */
function Badge({ label, color }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border"
      style={{
        color: color,
        borderColor: `${color}50`,
        background: `${color}15`,
        animation: "badge-pulse 2.5s ease-in-out infinite",
      }}
    >
      {label}
    </span>
  );
}

/* ─────────────────────────────────────────────
   JOURNEY MODAL (FULL-SCREEN)
───────────────────────────────────────────── */
function JourneyModal({ milestone, accent, onClose }) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    if (milestone) {
      setMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      document.body.style.overflow = "hidden";
    } else {
      setVisible(false);
      const t = setTimeout(() => {
        setMounted(false);
        document.body.style.overflow = "";
      }, 340);
      return () => clearTimeout(t);
    }
    return () => { document.body.style.overflow = ""; };
  }, [milestone]);

  useEffect(() => {
    const esc = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  useEffect(() => { setImgIdx(0); }, [milestone?.title]);

  if (!mounted || !milestone) return null;

  const images = Array.isArray(milestone.images)
    ? milestone.images.filter(Boolean)
    : milestone.image ? [milestone.image] : [];

  return createPortal(
    <>
      <div
        style={{
          position: "fixed", inset: 0, zIndex: 99998,
          background: visible ? "rgba(4,9,20,0.92)" : "rgba(4,9,20,0)",
          backdropFilter: visible ? "blur(20px)" : "blur(0px)",
          WebkitBackdropFilter: visible ? "blur(20px)" : "blur(0px)",
          transition: "background 0.34s ease, backdrop-filter 0.34s ease",
        }}
        onClick={onClose}
      />
      <div
        style={{
          position: "fixed", inset: 0, zIndex: 99999,
          display: "flex", alignItems: "flex-start", justifyContent: "center",
          overflowY: "auto", padding: "1rem", pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: "100%", maxWidth: 720, margin: "auto", pointerEvents: "all",
            opacity: visible ? 1 : 0,
            transform: visible ? "scale(1) translateY(0)" : "scale(0.93) translateY(24px)",
            transition: "opacity 0.34s cubic-bezier(0.22,1,0.36,1), transform 0.34s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(145deg,#060d1c,#0a1220)",
              border: `1px solid ${accent}38`,
              boxShadow: `0 48px 120px -24px ${accent}45, 0 0 0 1px ${accent}14`,
              maxHeight: "90vh", overflowY: "auto",
            }}
          >
            <div style={{ height: 2, width: "100%", background: `linear-gradient(90deg,transparent,${accent},transparent)` }} />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#94a3b8" }}
              aria-label="Close"
            >✕</button>

            {images.length > 0 && (
              <div className="relative w-full h-56 md:h-64 overflow-hidden">
                <img src={images[imgIdx]} alt={milestone.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom,rgba(15,23,42,0.1),rgba(15,23,42,0.95))` }} />
                {images.length > 1 && (
                  <>
                    <div className="absolute top-3 left-3 flex gap-2 z-10">
                      {images.map((src, i) => (
                        <button key={src + i} onClick={(e) => { e.stopPropagation(); setImgIdx(i); }}
                          className="w-9 h-7 rounded-md overflow-hidden border bg-slate-900/60"
                          style={{ borderColor: i === imgIdx ? accent : "rgba(148,163,184,0.35)", opacity: i === imgIdx ? 1 : 0.7 }}>
                          <img src={src} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex items-center gap-3 z-10">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded border"
                        style={{ color: accent, borderColor: `${accent}60`, background: "rgba(15,23,42,0.9)" }}>
                        {imgIdx + 1}/{images.length}
                      </span>
                      <div className="flex gap-1.5">
                        {images.map((_, i) => (
                          <button key={i} onClick={(e) => { e.stopPropagation(); setImgIdx(i); }}
                            aria-label={`Go to image ${i + 1}`}
                            style={{
                              width: i === imgIdx ? 20 : 7, height: 7, borderRadius: 9999, border: "none", padding: 0, cursor: "pointer",
                              background: i === imgIdx ? accent : "rgba(148,163,184,0.4)",
                              boxShadow: i === imgIdx ? `0 0 10px ${accent}80` : "none",
                            }} />
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="p-6 md:p-7 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-widest px-2.5 py-0.5 rounded"
                  style={{ color: accent, background: `${accent}18` }}>{milestone.category}</span>
                <Badge label={milestone.badge} color={milestone.badgeColor} />
              </div>
              <div>
                <h3 className="font-display text-2xl md:text-3xl font-black leading-snug mb-2"
                  style={{ color: "#f9fafb", letterSpacing: "-0.02em" }}>{milestone.title}</h3>
                <p className="text-slate-400 text-sm md:text-base leading-relaxed">{milestone.description}</p>
              </div>
              {milestone.details?.length > 0 && (
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: accent }}>▸ Highlights</div>
                  <ul className="space-y-1.5">
                    {milestone.details.map((d, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                        <span className="mt-0.5" style={{ color: accent }}>›</span>{d}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {milestone.tags?.length > 0 && (
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: accent }}>▸ Focus Areas</div>
                  <div className="flex flex-wrap gap-1.5">
                    {milestone.tags.map((t) => <Tag key={t} label={t} accent={accent} />)}
                  </div>
                </div>
              )}
              {milestone.link && (
                <div className="pt-1 border-t border-white/5">
                  <a href={milestone.link} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono mt-3" style={{ color: accent }}>
                    <span>↗</span>
                    <span className="underline underline-offset-2">
                      {milestone.link.includes("github") ? "View on GitHub" : "Open Link"}
                    </span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}

/* ─────────────────────────────────────────────
   MILESTONE CARD
───────────────────────────────────────────── */
function MilestoneCard({ milestone, accent, delay, isMobile }) {
  const ref = useRef(null);
  const visible = useIntersection(ref);
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);

  const cardContent = (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setOpen(true)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.97)",
        transition: `opacity 0.55s ease ${delay}s, transform 0.55s cubic-bezier(0.34,1.4,0.64,1) ${delay}s`,
        cursor: "pointer",
      }}
    >
      <div
        className="relative rounded-xl border overflow-hidden"
        style={{
          background: hovered ? "rgba(15,23,42,0.98)" : "rgba(15,23,42,0.8)",
          borderColor: hovered ? `${accent}55` : "rgba(148,163,184,0.1)",
          backdropFilter: "blur(16px)",
          boxShadow: hovered
            ? `0 16px 48px -8px ${accent}22, 0 0 0 1px ${accent}18, inset 0 1px 0 rgba(255,255,255,0.05)`
            : "0 2px 16px -2px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.02)",
          transform: hovered && !isMobile ? "translateY(-3px)" : "translateY(0)",
          transition: "all 0.3s cubic-bezier(0.34,1.2,0.64,1)",
        }}
      >
        {/* Top accent line */}
        <div
          className="h-px w-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
            opacity: hovered ? 1 : 0.35,
            transition: "opacity 0.3s",
          }}
        />

        {/* Shimmer */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${accent}06 0%, transparent 55%)`,
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.4s",
          }}
        />

        <div className={isMobile ? "relative p-4" : "relative p-5"}>
          {/* Category + Badge */}
          <div className="flex flex-wrap items-center gap-2 mb-2.5">
            <span
              className="text-xs font-mono uppercase tracking-widest px-2 py-0.5 rounded"
              style={{ color: accent, background: `${accent}15` }}
            >
              {milestone.category}
            </span>
            <Badge label={milestone.badge} color={milestone.badgeColor} />
          </div>

          {/* Title */}
          <h4
            className={`font-bold mb-1.5 leading-snug font-display ${isMobile ? "text-[15px]" : "text-base"}`}
            style={{ color: hovered ? accent : "#f1f5f9", transition: "color 0.3s" }}
          >
            {milestone.title}
          </h4>

          {/* Description */}
          <p className={`text-slate-400 leading-relaxed mb-3 ${isMobile ? "text-[13px]" : "text-sm"}`}>
            {milestone.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {milestone.tags.map((t) => <Tag key={t} label={t} accent={accent} />)}
          </div>

          <div className="mt-2 text-[11px] font-mono text-slate-600">
            Tap to open full story
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {open && <JourneyModal milestone={milestone} accent={accent} onClose={() => setOpen(false)} />}
      {isMobile ? cardContent : (
        <Tilt glareEnable glareMaxOpacity={0.2} glareColor={accent} glarePosition="all"
          tiltMaxAngleX={8} tiltMaxAngleY={8} transitionSpeed={1200} scale={1.015} className="w-full">
          {cardContent}
        </Tilt>
      )}
    </>
  );
}

/* ─────────────────────────────────────────────
   YEAR BLOCK — MOBILE
   Slim left rail: 2px line + 8px dot, full-width cards
───────────────────────────────────────────── */
function YearBlockMobile({ item, index, lineProgress }) {
  const ref = useRef(null);
  const visible = useIntersection(ref);
  const nodePosition = index / Math.max(timelineData.length, 1);
  const nodeActive = lineProgress >= nodePosition;

  return (
    <div ref={ref} className="relative pl-8 mb-8">
      {/* Slim left rail dot */}
      <div
        className="absolute left-0 top-1 flex flex-col items-center"
        style={{ width: 20 }}
      >
        {/* Node dot — NO ping ring on mobile */}
        <div
          className="rounded-full transition-all duration-500"
          style={{
            width: nodeActive ? 12 : 9,
            height: nodeActive ? 12 : 9,
            background: nodeActive ? item.accent : "rgba(148,163,184,0.3)",
            boxShadow: nodeActive ? `0 0 10px ${item.accent}80, 0 0 20px ${item.accent}30` : "none",
            border: `2px solid ${nodeActive ? item.accent : "rgba(148,163,184,0.15)"}`,
            marginLeft: 4,
            flexShrink: 0,
          }}
        />
      </div>

      {/* Year + era header */}
      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateX(0)" : "translateX(-16px)",
          transition: "opacity 0.6s ease 0.05s, transform 0.6s cubic-bezier(0.22,1,0.36,1) 0.05s",
        }}
      >
        {/* Compact year row */}
        <div className="flex items-baseline gap-2.5 mb-1">
          <span
            className="font-black font-display leading-none"
            style={{
              fontSize: "clamp(2rem, 10vw, 2.8rem)",
              background: `linear-gradient(135deg, ${item.accent}, ${item.accent}70)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: nodeActive ? `drop-shadow(0 0 10px ${item.accent}50)` : "none",
              transition: "filter 0.5s ease",
            }}
          >
            {item.year}
          </span>
          <div>
            <div className="text-[15px] font-bold text-white font-display leading-tight">
              <span className="mr-1">{item.icon}</span>{item.era}
            </div>
            <div
              className="text-[10px] font-mono tracking-widest uppercase"
              style={{ color: item.accent, opacity: 0.8 }}
            >
              {item.milestones.length} milestone{item.milestones.length > 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </div>

      {/* Cards — full width, no tilt on mobile */}
      <div className="space-y-2.5 mt-3">
        {item.milestones.map((m, i) => (
          <MilestoneCard
            key={i}
            milestone={m}
            accent={item.accent}
            delay={i * 0.08}
            isMobile={true}
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   YEAR BLOCK — DESKTOP (original alternating layout)
───────────────────────────────────────────── */
function YearBlockDesktop({ item, index, lineProgress }) {
  const ref = useRef(null);
  const visible = useIntersection(ref);
  const isLeft = item.side === "left";
  const nodePosition = index / Math.max(timelineData.length, 1);
  const nodeActive = lineProgress >= nodePosition;

  return (
    <div
      ref={ref}
      className="relative flex items-start gap-6"
      style={{ flexDirection: isLeft ? "row-reverse" : "row", marginBottom: "3.5rem" }}
    >
      {/* Content */}
      <div
        className="flex-1 min-w-0"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateX(0)" : isLeft ? "translateX(40px)" : "translateX(-40px)",
          transition: "opacity 0.7s ease 0.1s, transform 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s",
          paddingLeft: isLeft ? 0 : "1rem",
          paddingRight: isLeft ? "1rem" : 0,
        }}
      >
        <div className="flex items-center gap-3 mb-5"
          style={{ flexDirection: isLeft ? "row-reverse" : "row" }}>
          <div
            className="text-5xl md:text-6xl font-black font-display leading-none select-none"
            style={{
              background: `linear-gradient(135deg, ${item.accent}, ${item.accent}80)`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              filter: nodeActive ? `drop-shadow(0 0 12px ${item.accent}60)` : "none",
              transition: "filter 0.6s ease",
            }}
          >
            {item.year}
          </div>
          <div style={{ textAlign: isLeft ? "right" : "left" }}>
            <div className="text-xl font-bold text-white font-display leading-tight">
              <span className="mr-2">{item.icon}</span>{item.era}
            </div>
            <div className="text-xs font-mono tracking-widest uppercase mt-0.5" style={{ color: item.accent }}>
              {item.milestones.length} milestone{item.milestones.length > 1 ? "s" : ""}
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {item.milestones.map((m, i) => (
            <MilestoneCard key={i} milestone={m} accent={item.accent}
              delay={index * 0.12 + i * 0.1} isMobile={false} />
          ))}
        </div>
      </div>

      {/* Center node */}
      <div className="flex flex-col items-center relative" style={{ width: 48, flexShrink: 0 }}>
        <div
          className="relative z-10 flex items-center justify-center rounded-full transition-all duration-700"
          style={{
            width: nodeActive ? 44 : 36,
            height: nodeActive ? 44 : 36,
            background: nodeActive
              ? `radial-gradient(circle, ${item.accent}50 0%, ${item.accent}20 60%, transparent 100%)`
              : "rgba(15,23,42,0.8)",
            border: `2px solid ${nodeActive ? item.accent : "rgba(148,163,184,0.2)"}`,
            boxShadow: nodeActive
              ? `0 0 20px ${item.accent}60, 0 0 40px ${item.accent}30, inset 0 0 12px ${item.accent}20`
              : "none",
          }}
        >
          <div
            className="rounded-full transition-all duration-500"
            style={{
              width: nodeActive ? 12 : 8, height: nodeActive ? 12 : 8,
              background: nodeActive ? item.accent : "rgba(148,163,184,0.4)",
              boxShadow: nodeActive ? `0 0 8px ${item.accent}` : "none",
            }}
          />
          {nodeActive && (
            <div
              className="absolute inset-0 rounded-full animate-ping"
              style={{ border: `1.5px solid ${item.accent}`, opacity: 0.3, animationDuration: "2s" }}
            />
          )}
        </div>
      </div>

      <div className="flex-1 hidden md:block" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN SECTION
───────────────────────────────────────────── */
export default function GrowthTimeline() {
  const containerRef = useRef(null);
  const lineRef = useRef(null);
  const lineProgress = useScrollProgress(containerRef);
  const isMobile = useIsMobile();

  const lineHeightPct = `${Math.min(lineProgress * 100, 100)}%`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=JetBrains+Mono:wght@400;500&family=Outfit:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Syne', sans-serif; }
        .font-mono    { font-family: 'JetBrains Mono', monospace; }
        * { font-family: 'Outfit', sans-serif; box-sizing: border-box; }

        @keyframes badge-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.7; }
        }
        @keyframes line-glow {
          0%, 100% { filter: blur(2px) brightness(1); }
          50%       { filter: blur(3px) brightness(1.4); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        .timeline-section { position: relative; overflow: hidden; }
        .timeline-section::-webkit-scrollbar { display: none; }
      `}</style>

      <section id="journey" className="timeline-section parallax-bg section-y page-x min-h-screen">
        <Particles />

        {/* Ambient blobs */}
        <div className="absolute top-1/4 left-0 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)", filter: "blur(40px)", animation: "float-slow 8s ease-in-out infinite" }} />
        <div className="absolute bottom-1/3 right-0 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)", filter: "blur(40px)", animation: "float-slow 10s ease-in-out infinite 2s" }} />

        <div className="relative z-10 container-5xl" ref={containerRef}>
          <SectionHeader
            align="center"
            label="career journey"
            title={
              <>
                Growth
                <span className="block" style={{
                  background: "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 60%, #ec4899 100%)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}>
                  Timeline
                </span>
              </>
            }
            subtitle="Six years of building, competing, and shipping — from an Arduino in Sarawak to blockchain on Ethereum mainnet."
          />

          {/* ── Timeline Body ── */}
          <div className="relative">
            {isMobile ? (
              /* ── MOBILE: slim left-rail layout ── */
              <div className="relative">
                {/* Left vertical track */}
                <div
                  className="absolute top-0 bottom-0 pointer-events-none"
                  style={{ left: 9, width: 2, background: "rgba(148,163,184,0.07)" }}
                >
                  <div
                    ref={lineRef}
                    style={{
                      position: "absolute", top: 0, left: 0, right: 0,
                      height: lineHeightPct,
                      background: "linear-gradient(180deg, #6366f1 0%, #06b6d4 40%, #8b5cf6 70%, #ec4899 100%)",
                      borderRadius: 2,
                      transition: "height 0.1s linear",
                      boxShadow: "0 0 6px rgba(6,182,212,0.4), 0 0 12px rgba(99,102,241,0.25)",
                      animation: "line-glow 3s ease-in-out infinite",
                    }}
                  />
                </div>

                <div className="pt-1">
                  {timelineData.map((item, i) => (
                    <YearBlockMobile key={item.year} item={item} index={i} lineProgress={lineProgress} />
                  ))}
                </div>
              </div>
            ) : (
              /* ── DESKTOP: original alternating layout ── */
              <div className="relative">
                <div
                  className="absolute top-0 bottom-0 pointer-events-none"
                  style={{ left: "50%", transform: "translateX(-50%)", width: 2, background: "rgba(148,163,184,0.08)" }}
                >
                  <div
                    ref={lineRef}
                    style={{
                      position: "absolute", top: 0, left: 0, right: 0,
                      height: lineHeightPct,
                      background: "linear-gradient(180deg, #6366f1 0%, #06b6d4 40%, #8b5cf6 70%, #ec4899 100%)",
                      borderRadius: 2,
                      transition: "height 0.1s linear",
                      boxShadow: "0 0 8px rgba(6,182,212,0.5), 0 0 16px rgba(99,102,241,0.3)",
                      animation: "line-glow 3s ease-in-out infinite",
                    }}
                  />
                </div>
                <div>
                  {timelineData.map((item, i) => (
                    <YearBlockDesktop key={item.year} item={item} index={i} lineProgress={lineProgress} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer card */}
          <div
            className="mt-12 md:mt-16 rounded-3xl border p-6 md:p-8 text-center relative overflow-hidden"
            style={{
              background: "rgba(15,23,42,0.8)",
              borderColor: "rgba(6,182,212,0.2)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 0 60px -20px rgba(6,182,212,0.15)",
            }}
          >
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.05) 0%, transparent 60%)" }} />
            <div className="relative">
              <div className="text-3xl mb-3">✦</div>
              <h3 className="font-display text-2xl font-bold text-white mb-3" style={{ letterSpacing: "-0.01em" }}>
                The Journey Continues
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-lg mx-auto mb-5">
                Currently exploring the intersection of AI, blockchain, and scalable systems —
                always learning, always shipping.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {["🚀 Full-Stack", "⛓ Web3", "🤖 AI/ML", "🏆 Hackathons", "📐 System Design"].map((b) => (
                  <span key={b} className="px-3 py-1.5 rounded-full text-xs font-medium border"
                    style={{ color: "#06b6d4", borderColor: "rgba(6,182,212,0.3)", background: "rgba(6,182,212,0.08)" }}>
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}