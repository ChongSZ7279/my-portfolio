import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import SectionHeader from "./components/SectionHeader";
import AchievementsPodium from "./AchievementsPodium";
import { ACHIEVEMENTS as ACHIEVEMENTS_DATA } from "./data/achievements";
import { PROJECTS } from "./data/projects";

// ─── HOOKS ────────────────────────────────────────────────────────────────────
function useScrollVisible(ref, { threshold = 0.08, margin = "-30px" } = {}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold, rootMargin: margin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return visible;
}

function useGridColumns(gridRef) {
  const [cols, setCols] = useState(3);
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      const c = w < 720 ? 1 : w < 1080 ? 2 : 3;
      setCols(c);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return cols;
}

// ─── PRIMITIVES ───────────────────────────────────────────────────────────────
function TechPill({ label, accent }) {
  const [hov, setHov] = useState(false);
  return (
    <span
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex", alignItems: "center",
        padding: "4px 12px", borderRadius: 9999,
        fontSize: 11, fontFamily: "'JetBrains Mono',monospace", fontWeight: 500,
        color: hov ? "#fff" : accent,
        border: `1px solid ${hov ? accent + "90" : accent + "40"}`,
        background: hov ? `${accent}28` : `${accent}10`,
        boxShadow: hov ? `0 0 14px ${accent}45` : "none",
        transition: "all 0.2s ease", cursor: "default",
      }}>{label}</span>
  );
}

function TagPill({ label, color }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "3px 10px", borderRadius: 9999,
      fontSize: 11, fontFamily: "'JetBrains Mono',monospace",
      color: color || "#94a3b8",
      border: `1px solid ${color || "#94a3b8"}30`,
      background: `${color || "#94a3b8"}0d`,
    }}>{label}</span>
  );
}

const TIER_ICONS = { Champion: "🥇", Finalist: "🏅", Bronze: "🥉", International: "🌐" };
function AwardBadge({ tier, color }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "4px 12px", borderRadius: 9999,
      fontSize: 10, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700,
      textTransform: "uppercase", letterSpacing: "0.08em",
      color, border: `1px solid ${color}45`, background: `${color}15`,
    }}><span>{TIER_ICONS[tier] || "🏅"}</span>{tier}</span>
  );
}

function Img({ src, alt, className, style = {} }) {
  const [err, setErr] = useState(false);
  if (err || !src) return (
    <div className={className} style={{ background: "linear-gradient(135deg,#0f172a,#1e293b)", display: "flex", alignItems: "center", justifyContent: "center", ...style }}>
      <div style={{ textAlign: "center", color: "#334155" }}>
        <div style={{ fontSize: 28 }}>🖼️</div>
        <div style={{ fontSize: 9, fontFamily: "monospace", marginTop: 4, opacity: 0.5 }}>{alt}</div>
      </div>
    </div>
  );
  return <img src={src} alt={alt} className={className} style={style} loading="lazy" onError={() => setErr(true)} />;
}

// ─── BROWSER FRAME ────────────────────────────────────────────────────────────
function BrowserFrame({ src, alt, accent, hovered, url = "localhost:5173" }) {
  return (
    <div style={{
      position: "relative", overflow: "hidden", borderRadius: 14, width: "100%",
      border: `1.5px solid ${hovered ? accent + "65" : "rgba(148,163,184,0.14)"}`,
      boxShadow: hovered ? `0 12px 40px -10px ${accent}60` : "0 6px 28px -10px rgba(0,0,0,0.75)",
      background: "#0a1628",
      transition: "border-color 0.3s, box-shadow 0.3s",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 8, padding: "8px 12px",
        background: "linear-gradient(180deg,#131f35,#0f1a2e)",
        borderBottom: `1px solid ${hovered ? accent + "22" : "rgba(148,163,184,0.07)"}`,
        transition: "border-color 0.3s",
      }}>
        <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
          {["#ff5f57", "#febc2e", "#28c840"].map(c => (
            <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
          ))}
        </div>
        <div style={{
          flex: 1, display: "flex", alignItems: "center", gap: 5,
          padding: "3px 10px", borderRadius: 6,
          background: "rgba(0,0,0,0.4)", border: "1px solid rgba(148,163,184,0.07)",
          fontSize: 9, fontFamily: "'JetBrains Mono',monospace", color: "#475569",
          overflow: "hidden",
        }}>
          <svg width="8" height="8" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="7" cy="7" r="5.5" stroke="#475569" strokeWidth="1.5"/>
            <path d="M7 1.5C7 1.5 5 4 5 7s2 5.5 2 5.5M7 1.5C7 1.5 9 4 9 7s-2 5.5-2 5.5M1.5 7h11" stroke="#475569" strokeWidth="1"/>
          </svg>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{url}</span>
        </div>
        <svg width="10" height="10" viewBox="0 0 16 16" fill="#334155" style={{ flexShrink: 0 }}>
          <path d="M13.5 8A5.5 5.5 0 1 1 8 2.5V1L11 4 8 7V5.5A3.5 3.5 0 1 0 11.5 8h2z"/>
        </svg>
      </div>
      <div style={{ aspectRatio: "16/10", overflow: "hidden" }}>
        <Img src={src} alt={alt} className="w-full h-full object-cover"
          style={{ transform: hovered ? "scale(1.04)" : "scale(1)", transition: "transform 0.6s ease" }} />
      </div>
    </div>
  );
}

// ─── MOBILE FRAME ─────────────────────────────────────────────────────────────
function MobileFrame({ src, alt, accent, hovered }) {
  return (
    <div style={{
      position: "relative", overflow: "hidden", borderRadius: 22,
      width: 76, aspectRatio: "9/19", flexShrink: 0,
      border: `1.5px solid ${hovered ? accent + "90" : "rgba(148,163,184,0.22)"}`,
      background: "#070e1c",
      boxShadow: `0 16px 40px -14px ${accent}60, 0 0 0 1px rgba(0,0,0,0.6)`,
      transform: hovered ? "translateY(-6px) rotate(2deg)" : "translateY(0) rotate(0deg)",
      transition: "transform 0.38s ease, border-color 0.3s, box-shadow 0.3s",
    }}>
      <div style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", zIndex: 10,
        width: 40, height: 12, background: "#070e1c",
        borderRadius: "0 0 9px 9px", border: "1px solid rgba(148,163,184,0.1)", borderTop: "none",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ width: 18, height: 4, background: "#1e293b", borderRadius: 3 }} />
      </div>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 8px", height: 18, background: "rgba(7,14,28,0.98)", position: "relative", zIndex: 5,
      }}>
        <span style={{ fontSize: 6, fontFamily: "monospace", color: "#334155" }}>9:41</span>
        <div style={{ display: "flex", gap: 2, alignItems: "flex-end" }}>
          {[1, 2, 3].map(i => <div key={i} style={{ width: 2.5, height: 2.5 + i * 1.5, background: "#334155", borderRadius: 1 }} />)}
        </div>
      </div>
      <div style={{ overflow: "hidden", height: "calc(100% - 18px - 14px)" }}>
        <Img src={src} alt={alt} className="w-full h-full object-cover" />
      </div>
      <div style={{ height: 14, background: "rgba(7,14,28,0.98)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 26, height: 3.5, background: "#1e293b", borderRadius: 3 }} />
      </div>
    </div>
  );
}

// ─── MODAL OVERLAY ────────────────────────────────────────────────────────────
function ModalOverlay({ isOpen, onClose, children }) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      document.body.style.overflow = "hidden";
    } else {
      setVisible(false);
      const t = setTimeout(() => { setMounted(false); document.body.style.overflow = ""; }, 340);
      return () => clearTimeout(t);
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);
  useEffect(() => {
    const esc = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);
  if (!mounted) return null;
  return createPortal(
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      overflowY: "auto", padding: "1.5rem 1rem",
      background: `rgba(3,7,18,${visible ? "0.92" : "0"})`,
      backdropFilter: `blur(${visible ? "24px" : "0px"})`,
      WebkitBackdropFilter: `blur(${visible ? "24px" : "0px"})`,
      transition: "background 0.34s ease, backdrop-filter 0.34s ease",
    }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        position: "relative", width: "100%", maxWidth: 760, margin: "auto",
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1) translateY(0)" : "scale(0.93) translateY(24px)",
        transition: "opacity 0.34s cubic-bezier(0.22,1,0.36,1), transform 0.34s cubic-bezier(0.22,1,0.36,1)",
      }}>{children}</div>
    </div>,
    document.body
  );
}

// ─── CAROUSEL ─────────────────────────────────────────────────────────────────
const SLIDE_DURATION = 4000;

function useImageOrientation(src) {
  const [portrait, setPortrait] = useState(false);
  useEffect(() => {
    if (!src) return;
    const img = new window.Image();
    img.onload = () => setPortrait(img.naturalHeight > img.naturalWidth);
    img.src = src;
  }, [src]);
  return portrait;
}

function CarouselWithTimer({ images, labels, accent, isOpen }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const startRef = useRef(null);
  const rafRef = useRef(null);
  const currentIsPortrait = useImageOrientation(images[imgIdx]);

  const goTo = useCallback((idx) => { setImgIdx(idx); setProgress(0); startRef.current = performance.now(); }, []);
  useEffect(() => { if (isOpen) { setImgIdx(0); setProgress(0); startRef.current = performance.now(); } }, [isOpen]);
  useEffect(() => {
    if (!isOpen) return;
    const tick = now => {
      if (!startRef.current) startRef.current = now;
      const pct = Math.min(((now - startRef.current) / SLIDE_DURATION) * 100, 100);
      setProgress(pct);
      if (pct >= 100) { setImgIdx(p => (p + 1) % images.length); setProgress(0); startRef.current = performance.now(); }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isOpen, images.length]);

  // Fixed height so the modal layout stays stable between slides
  const containerHeight = 360;

  return (
    <div style={{
      position: "relative", overflow: "hidden",
      height: containerHeight,
      transition: "height 0.4s cubic-bezier(0.22,1,0.36,1)",
      background: `radial-gradient(ellipse at 50% 40%, ${accent}0e 0%, transparent 70%)`,
    }}>
      {images.map((src, i) => (
        <div key={i} style={{
          position: "absolute", inset: 0,
          opacity: i === imgIdx ? 1 : 0,
          transition: "opacity 0.5s",
          pointerEvents: i === imgIdx ? "auto" : "none",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: currentIsPortrait ? "16px 60px" : 0,
        }}>
          <img src={src} alt={labels[i]}
            style={{
              maxWidth: "100%", maxHeight: "100%",
              width: currentIsPortrait ? "auto" : "100%",
              height: currentIsPortrait ? "100%" : "100%",
              objectFit: currentIsPortrait ? "contain" : "cover",
              borderRadius: currentIsPortrait ? 16 : 0,
              boxShadow: currentIsPortrait ? `0 8px 40px -12px ${accent}60` : "none",
            }}
            onError={e => { e.target.style.display = "none"; }}
          />
        </div>
      ))}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: currentIsPortrait
          ? `linear-gradient(to bottom, transparent 80%, rgba(5,10,20,0.95) 100%)`
          : `linear-gradient(to bottom, transparent 45%, rgba(5,10,20,0.95) 100%)`,
      }} />
      {/* Progress bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "rgba(255,255,255,0.06)" }}>
        <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg,${accent},${accent}cc)`, boxShadow: `0 0 10px ${accent}`, transition: "none" }} />
      </div>
      {/* Thumbnails */}
      {images.length > 1 && (
        <div style={{ position: "absolute", top: 10, left: 12, display: "flex", gap: 4, zIndex: 10 }}>
          {images.map((img, i) => (
            <button key={i} onClick={() => goTo(i)} style={{
              width: 32, height: 24, borderRadius: 6, overflow: "hidden",
              border: `1.5px solid ${i === imgIdx ? accent : "rgba(148,163,184,0.2)"}`,
              opacity: i === imgIdx ? 1 : 0.5,
              padding: 0, cursor: "pointer", background: "#0a1628",
              transition: "border-color 0.2s, opacity 0.2s",
            }}>
              <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </button>
          ))}
        </div>
      )}
      {/* Label + dots */}
      <div style={{ position: "absolute", bottom: 12, left: 14, right: 14, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", padding: "3px 9px", borderRadius: 6, color: accent, background: "rgba(4,9,20,0.85)", border: `1px solid ${accent}30`, backdropFilter: "blur(8px)", flexShrink: 0 }}>
          {imgIdx + 1}/{images.length} — {labels[imgIdx]}
        </span>
        <div style={{ display: "flex", gap: 5 }}>
          {images.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} style={{ width: i === imgIdx ? 20 : 7, height: 7, borderRadius: 9999, background: i === imgIdx ? accent : "rgba(148,163,184,0.3)", boxShadow: i === imgIdx ? `0 0 8px ${accent}` : "none", border: "none", cursor: "pointer", padding: 0, transition: "all 0.3s" }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Section heading: icon chip + label + fade line
function SectionLabel({ icon, label, accent }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
      <span style={{
        fontSize: 10, fontFamily: "'JetBrains Mono',monospace",
        textTransform: "uppercase", letterSpacing: "0.14em",
        fontWeight: 700, color: accent,
      }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${accent}35, transparent)` }} />
    </div>
  );
}

// Glassmorphism panel — no solid fill, just blur + border
function GlassPanel({ accent, borderAccent, children, style = {} }) {
  const border = borderAccent || accent;
  return (
    <div style={{
      borderRadius: 16,
      background: "rgba(255,255,255,0.025)",
      border: `1px solid rgba(255,255,255,0.065)`,
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      padding: "18px 20px",
      position: "relative", overflow: "hidden",
      ...style,
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, width: 100, height: 50,
        background: `radial-gradient(ellipse at 0% 0%, ${border}10, transparent 70%)`,
        pointerEvents: "none",
      }} />
      {children}
    </div>
  );
}

// Bullet list with glowing accent dot
function BulletList({ items, accent }) {
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 9 }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: "flex", gap: 10, fontSize: 13, color: "#cbd5e1", lineHeight: 1.65 }}>
          <span style={{
            color: accent, flexShrink: 0, marginTop: 4,
            fontSize: 7, width: 14, height: 14, borderRadius: "50%",
            border: `1.5px solid ${accent}75`,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 0 7px ${accent}40`,
          }}>▸</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

// ─── PROJECT MODAL ────────────────────────────────────────────────────────────
function ProjectModal({ project, isOpen, onClose }) {
  const safeImages = project?.images || { hero: null, supporting: [], supportingLabels: [] };
  const supporting = Array.isArray(safeImages.supporting) ? safeImages.supporting : [];
  const supportingLabels = Array.isArray(safeImages.supportingLabels) ? safeImages.supportingLabels : [];
  const carouselImages = [safeImages.hero, ...supporting].filter(Boolean);
  const carouselLabels = ["Hero", ...supportingLabels].slice(0, carouselImages.length);

  const hasImpact     = Array.isArray(project.impact)     && project.impact.length > 0;
  const hasChallenges = Array.isArray(project.challenges) && project.challenges.length > 0;
  const hasLearnings  = Array.isArray(project.learnings)  && project.learnings.length > 0;
  const isYoutube     = project.demo && (project.demo.includes("youtube") || project.demo.includes("youtu.be"));

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose}>
      <div style={{
        position: "relative", borderRadius: 22, overflow: "hidden",
        // transparent glass — no opaque background
        background: "rgba(5,10,20,0.78)",
        backdropFilter: "blur(36px)",
        WebkitBackdropFilter: "blur(36px)",
        border: `1px solid ${project.accent}28`,
        boxShadow: `0 0 0 1px ${project.accent}10, 0 48px 120px -24px ${project.accentGlow}`,
      }}>

        {/* Top glow bar */}
        <div style={{ height: 2, background: `linear-gradient(90deg,transparent 5%,${project.accent} 45%,${project.accent}bb 55%,transparent 95%)` }} />

        {/* Ambient radial behind title */}
        <div style={{
          position: "absolute", top: 0, left: "20%", width: 400, height: 220,
          background: `radial-gradient(ellipse, ${project.accent}0b 0%, transparent 70%)`,
          pointerEvents: "none", zIndex: 0,
        }} />

        {/* Close */}
        <button onClick={onClose} style={{
          position: "absolute", top: 16, right: 16, zIndex: 30,
          width: 34, height: 34, borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)",
          color: "#64748b", cursor: "pointer", fontSize: 13, transition: "color 0.2s, background 0.2s",
        }}
          onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
        >✕</button>

        {/* ── SCREENSHOT CAROUSEL ── */}
        <div style={{ position: "relative", zIndex: 1 }}>
          {carouselImages.length > 0
            ? <CarouselWithTimer images={carouselImages} labels={carouselLabels} accent={project.accent} isOpen={isOpen} />
            : <div style={{ height: 100, background: `radial-gradient(ellipse at 30% 50%, ${project.accent}0c, transparent 65%)` }} />
          }
        </div>

        {/* ── BODY ── */}
        <div style={{ padding: "28px 28px 36px", display: "flex", flexDirection: "column", gap: 30, position: "relative", zIndex: 1 }}>

          {/* ══ 1. HERO HEADER ══ */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 8 }}>
              <span style={{
                fontSize: 10, fontFamily: "'JetBrains Mono',monospace",
                color: project.accent, letterSpacing: "0.1em", opacity: 0.85,
              }}>{project.index} / {project.category}</span>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: "4px 12px", borderRadius: 9999,
                background: `${project.statusColor}12`, border: `1px solid ${project.statusColor}32`,
                color: project.statusColor, fontFamily: "'JetBrains Mono',monospace", flexShrink: 0,
              }}>{project.status}</span>
            </div>

            <h2 style={{
              fontSize: 32, fontFamily: "'Syne',sans-serif", fontWeight: 900,
              color: "#fff", margin: "0 0 10px", lineHeight: 1.1,
              textShadow: `0 0 50px ${project.accent}38`,
            }}>{project.title}</h2>

            <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.72, margin: "0 0 20px", maxWidth: 580 }}>
              {project.tagline}
            </p>

            {/* CTA Buttons */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap"}}>
              {project.demo && (
                <a href={project.demo} target="_blank" rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "10px 22px", borderRadius: 12,
                    fontSize: 12, fontWeight: 700, textDecoration: "none",
                    background: `linear-gradient(135deg, ${project.accent}38, ${project.accent}18)`,
                    border: `1px solid ${project.accent}52`,
                    color: project.accent,
                    boxShadow: `0 4px 22px -6px ${project.accent}50`,
                    transition: "box-shadow 0.2s, transform 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 8px 32px -4px ${project.accent}70`; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 4px 22px -6px ${project.accent}50`; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  {isYoutube
                    ? <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
                    : <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  }
                  {isYoutube ? "Watch Demo" : "Live Demo"}
                </a>
              )}
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "10px 22px", borderRadius: 12,
                    fontSize: 12, fontWeight: 700, textDecoration: "none",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(148,163,184,0.14)",
                    color: "#94a3b8",
                    transition: "background 0.2s, color 0.2s, transform 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.09)"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                  </svg>
                  View Code
                </a>
              )}
            </div>
          </div>

          {/* ══ 2. TECH & ARCHITECTURE ══ */}
          <div>
            <SectionLabel label="Tech & Architecture" accent={project.accent} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {project.tech.map(t => <TechPill key={t} label={t} accent={project.accent} />)}
            </div>
            {project.architecture && (
              <p style={{
                marginTop: 10,
                fontSize: 11,
                fontFamily: "'JetBrains Mono',monospace",
                color: "#64748b",
              }}>
                Architecture: <span style={{ color: project.accent }}>{project.architecture}</span>
              </p>
            )}
          </div>

          {/* ══ 3. PROBLEM / SOLUTION — compact overview ══ */}
          {(project.problem || project.solution) && (
            <div>
              <SectionLabel label="Problem · Solution" accent={project.accent} />
            <GlassPanel accent={project.accent}>
              {project.problem && (
                <div style={{ marginBottom: project.solution ? 14 : 0 }}>
                  <span style={{
                    display: "inline-block",
                    fontSize: 10,
                    fontFamily: "'JetBrains Mono',monospace",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "#ef4444",
                    fontWeight: 700,
                    marginBottom: 6,
                  }}>
                    Problem
                  </span>
                  <p style={{ color: "#cbd5e1", fontSize: 13, lineHeight: 1.7, margin: 0 }}>
                    {project.problem}
                  </p>
                </div>
              )}
              {project.solution && (
                <div>
                  <span style={{
                    display: "inline-block",
                    fontSize: 10,
                    fontFamily: "'JetBrains Mono',monospace",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: project.accent,
                    fontWeight: 700,
                    marginBottom: 6,
                  }}>
                    Solution
                  </span>
                  <p style={{ color: "#cbd5e1", fontSize: 13, lineHeight: 1.7, margin: 0 }}>
                    {project.solution}
                  </p>
                </div>
              )}
            </GlassPanel>
            </div>
          )}

          {/* ══ 4. KEY FEATURES — simple bullet list ══ */}
          {hasImpact && (
            <div>
              <SectionLabel label="Key Features" accent={project.accent} />
            <GlassPanel accent={project.accent}>
              <BulletList items={project.impact} accent={project.accent} />
            </GlassPanel>
            </div>
          )}

          {/* (Optional sections like challenges / learnings can be added later if needed) */}

        </div>

        {/* Bottom accent edge */}
        <div style={{ height: 1, background: `linear-gradient(90deg,transparent 5%,${project.accent}28 50%,transparent 95%)` }} />
      </div>
    </ModalOverlay>
  );
}

// ─── PROJECT CARD ─────────────────────────────────────────────────────────────
function ProjectCard({ project, delay }) {
  const ref = useRef(null);
  const visible = useScrollVisible(ref);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  const webShot = project?.images?.hero;
  const mobileShot = project?.images?.supporting?.[0];
  const projectUrl = project.demo
    ? project.demo.replace(/^https?:\/\//, "").split("/")[0]
    : `${(project.title || "app").toLowerCase().replace(/\s+/g, "")}.dev`;

  return (
    <>
      <ProjectModal project={project} isOpen={open} onClose={() => setOpen(false)} />
      <div ref={ref} style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(28px) scale(0.97)",
        transition: `opacity 0.55s ease, transform 0.55s cubic-bezier(0.22,1,0.36,1)`,
        transitionDelay: `${delay}s`,
        height: 640, minHeight: 640, maxHeight: 640,
      }}>
        <div
          onClick={() => setOpen(true)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            position: "relative", borderRadius: 20, overflow: "hidden",
            cursor: "pointer", display: "flex", flexDirection: "column",
            width: "100%", height: 640,
            // ── transparent glass cards — no heavy background ──
            background: hovered
              ? "rgba(12,22,40,0.62)"
              : "rgba(10,18,34,0.42)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            border: `1px solid ${hovered ? project.accent + "52" : "rgba(148,163,184,0.07)"}`,
            boxShadow: hovered
              ? `0 28px 72px -16px ${project.accentGlow}, 0 0 0 1px ${project.accent}1c`
              : "0 2px 16px -6px rgba(0,0,0,0.45)",
            transform: hovered ? "translateY(-8px)" : "translateY(0)",
            transition: "border-color 0.3s, box-shadow 0.35s, transform 0.35s cubic-bezier(0.22,1,0.36,1), background 0.3s",
          }}>

          {/* Accent top bar */}
          <div style={{ height: 2, flexShrink: 0, background: `linear-gradient(90deg,transparent,${project.accent},transparent)`, opacity: hovered ? 1 : 0.32, transition: "opacity 0.3s" }} />

          {/* TOP: Device Showcase */}
          <div style={{
            position: "relative", overflow: "visible", flexShrink: 0, height: 260,
            background: hovered ? "rgba(7,13,26,0.85)" : "rgba(7,13,26,0.6)",
            padding: "18px 18px 20px 18px",
            transition: "background 0.3s",
          }}>
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: `radial-gradient(ellipse at 50% 75%,${project.accent}12 0%,transparent 65%)`, opacity: hovered ? 1 : 0.4, transition: "opacity 0.4s" }} />
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: `radial-gradient(circle,${project.accent}18 1px,transparent 1px)`, backgroundSize: "24px 24px", opacity: hovered ? 0.5 : 0.12, transition: "opacity 0.4s" }} />
            <div style={{ position: "relative", zIndex: 10, height: "100%", display: "flex", alignItems: "flex-start" }}>
              <div style={{ width: "100%" }}>
                <BrowserFrame src={webShot} alt={`${project.title} web`} accent={project.accent} hovered={hovered} url={projectUrl} />
              </div>
            </div>
            <div className="proj-mobile-preview" style={{ position: "absolute", bottom: -70, right: 14, zIndex: 20 }}>
              <MobileFrame src={mobileShot} alt={`${project.title} mobile`} accent={project.accent} hovered={hovered} />
            </div>
            <div style={{ position: "absolute", bottom: 12, left: 16, zIndex: 20 }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "4px 12px", borderRadius: 9999,
                fontSize: 9, fontFamily: "'JetBrains Mono',monospace",
                background: "rgba(4,9,20,0.72)", border: `1px solid ${project.accent}22`,
                color: project.accent + "99", backdropFilter: "blur(10px)",
              }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: project.accent, boxShadow: `0 0 7px ${project.accent}`, display: "inline-block" }} />
                Web + Mobile
              </span>
            </div>
          </div>

          {/* BOTTOM: Info Panel */}
          <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden", padding: "72px 22px 22px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 12, height: 54, flexShrink: 0 }}>
              <div style={{
                width: 46, height: 46, borderRadius: 13, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
                background: `linear-gradient(135deg,${project.accent}22,${project.accent}08)`,
                border: `1px solid ${project.accent}32`,
                boxShadow: hovered ? `0 0 22px -6px ${project.accent}75` : "none",
                transition: "box-shadow 0.3s",
              }}>
                {project.logo
                  ? <Img src={project.logo} alt="" className="w-full h-full object-contain p-1.5" />
                  : <span style={{ fontSize: 18, fontFamily: "'Syne',sans-serif", fontWeight: 900, color: project.accent }}>
                      {String(project.title || "P").slice(0, 1).toUpperCase()}
                    </span>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 9, fontFamily: "'JetBrains Mono',monospace", textTransform: "uppercase", letterSpacing: "0.1em", color: project.accent, margin: "0 0 3px" }}>
                  {project.index} · {project.category}
                </p>
                <h3 style={{ fontSize: 19, fontFamily: "'Syne',sans-serif", fontWeight: 900, color: hovered ? "#fff" : "#f1f5f9", margin: 0, lineHeight: 1.2, transition: "color 0.2s", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                  title={project.title}>{project.title}</h3>
              </div>
              <span style={{ fontSize: 9, fontWeight: 700, padding: "4px 9px", borderRadius: 9999, flexShrink: 0, whiteSpace: "nowrap", background: `${project.statusColor}12`, border: `1px solid ${project.statusColor}32`, color: project.statusColor }}>
                {project.status}
              </span>
            </div>

            <div style={{ height: 66, overflow: "hidden", marginBottom: 14, flexShrink: 0 }}>
              <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.65, margin: 0, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {project.tagline}
              </p>
            </div>

            <div style={{ height: 54, overflow: "hidden", marginBottom: 14, flexShrink: 0 }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {project.tech.slice(0, 5).map(t => <TechPill key={t} label={t} accent={project.accent} />)}
                {project.tech.length > 5 && (
                  <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", color: "#475569", alignSelf: "center" }}>+{project.tech.length - 5}</span>
                )}
              </div>
            </div>

            <div style={{ height: 1, background: `linear-gradient(90deg,${project.accent}1e,transparent 70%)`, marginBottom: 14, flexShrink: 0 }} />

            <div style={{ display: "flex", alignItems: "center", gap: 10, height: 38, flexShrink: 0 }}>
              {project.demo && (
                <a href={project.demo} target="_blank" rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 7,
                    padding: "9px 18px", borderRadius: 12,
                    fontSize: 12, fontWeight: 700, textDecoration: "none",
                    background: `linear-gradient(135deg,${project.accent}28,${project.accent}10)`,
                    border: `1px solid ${project.accent}45`,
                    color: project.accent,
                    boxShadow: hovered ? `0 6px 24px -8px ${project.accent}55` : "none",
                    transition: "box-shadow 0.3s",
                  }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                  View Demo
                </a>
              )}
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  style={{
                    width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(148,163,184,0.1)",
                    color: "#475569", textDecoration: "none", transition: "color 0.2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = "#94a3b8"}
                  onMouseLeave={e => e.currentTarget.style.color = "#475569"}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                  </svg>
                </a>
              )}
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontFamily: "'JetBrains Mono',monospace", color: hovered ? project.accent : "#2d3f57", transition: "color 0.25s" }}>
                Case study
                <span style={{ display: "inline-block", transform: hovered ? "translateX(4px)" : "translateX(0)", transition: "transform 0.25s" }}>→</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── ACHIEVEMENT MODAL ────────────────────────────────────────────────────────
function AchievementModal({ item, isOpen, onClose }) {
  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose}>
      <div style={{
        position: "relative", borderRadius: 20, overflow: "hidden",
        // transparent glass — no solid fill
        background: "rgba(5,10,20,0.80)",
        backdropFilter: "blur(32px)",
        WebkitBackdropFilter: "blur(32px)",
        border: `1px solid ${item.tierColor}26`,
        boxShadow: `0 40px 100px -20px ${item.tierColor}38, 0 0 0 1px ${item.tierColor}0e`,
        maxHeight: "90vh", overflowY: "auto",
      }}>
        <div style={{ height: 2, background: `linear-gradient(90deg,transparent,${item.tierColor},transparent)` }} />
        <button onClick={onClose} style={{
          position: "absolute", top: 16, right: 16, zIndex: 30,
          width: 34, height: 34, borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)",
          color: "#64748b", cursor: "pointer", fontSize: 13, transition: "color 0.2s",
        }}
          onMouseEnter={e => { e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "#64748b"; }}
        >✕</button>
        <div style={{ position: "relative", overflow: "hidden", height: 220 }}>
          <Img src={item.image} alt={item.title} className="w-full h-full object-cover" />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom,${item.tierColor}0a 0%,rgba(5,10,20,0.88) 100%)` }} />
        </div>
        <div style={{ padding: "24px 28px 28px", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <AwardBadge tier={item.tier} color={item.tierColor} />
            <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", padding: "4px 10px", borderRadius: 6, background: "rgba(4,9,20,0.65)", color: "#94a3b8", border: "1px solid rgba(148,163,184,0.13)" }}>{item.year}</span>
          </div>
          <div>
            <h3 style={{ fontSize: 24, fontFamily: "'Syne',sans-serif", fontWeight: 900, color: "#fff", margin: "0 0 4px", lineHeight: 1.2, textShadow: `0 0 32px ${item.tierColor}32` }}>{item.title}</h3>
            <p style={{ fontSize: 11, fontFamily: "'JetBrains Mono',monospace", color: item.tierColor, margin: 0 }}>{item.event}</p>
          </div>
          <p style={{ color: "#cbd5e1", fontSize: 14, lineHeight: 1.65 }}>{item.description}</p>
          <div>
            <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", textTransform: "uppercase", letterSpacing: "0.1em", color: item.tierColor, marginBottom: 10 }}>▸ Focus Areas</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {item.tags.map(t => <TagPill key={t} label={t} color={item.tierColor} />)}
            </div>
          </div>
        </div>
      </div>
    </ModalOverlay>
  );
}

// ─── ACHIEVEMENT CARD ─────────────────────────────────────────────────────────
function AchievementCard({ item, delay }) {
  const ref = useRef(null);
  const visible = useScrollVisible(ref);
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);
  return (
    <>
      <AchievementModal item={item} isOpen={open} onClose={() => setOpen(false)} />
      <div ref={ref} style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(28px) scale(0.97)",
        transition: `opacity 0.55s ease, transform 0.55s cubic-bezier(0.22,1,0.36,1)`,
        transitionDelay: `${delay}s`,
      }}>
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => setOpen(true)}
          style={{
            position: "relative", borderRadius: 20, overflow: "hidden",
            height: "100%", display: "flex", flexDirection: "column",
            cursor: "pointer",
            // ── transparent glass achievement cards ──
            background: hovered ? "rgba(13,24,41,0.60)" : "rgba(10,18,34,0.38)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            border: `1px solid ${hovered ? item.tierColor + "42" : "rgba(148,163,184,0.07)"}`,
            boxShadow: hovered
              ? `0 24px 60px -12px ${item.tierColor}28, 0 0 0 1px ${item.tierColor}10`
              : "0 2px 12px -4px rgba(0,0,0,0.38)",
            transform: hovered ? "translateY(-5px) scale(1.005)" : "translateY(0) scale(1)",
            transition: "border-color 0.28s, box-shadow 0.28s, transform 0.28s cubic-bezier(0.22,1,0.36,1), background 0.28s",
          }}>
          <div style={{ height: 2, background: `linear-gradient(90deg,transparent,${item.tierColor},transparent)`, opacity: hovered ? 0.85 : 0.2, transition: "opacity 0.28s" }} />
          <div style={{ margin: "16px 16px 0", overflow: "hidden", borderRadius: 12, flexShrink: 0, aspectRatio: "16/9" }}>
            <Img src={item.image} alt={item.event} className="w-full h-full object-cover"
              style={{ transform: hovered ? "scale(1.07)" : "scale(1)", transition: "transform 0.5s ease" }} />
          </div>
          <div style={{ padding: "16px 20px 20px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 10 }}>
              <AwardBadge tier={item.tier} color={item.tierColor} />
              <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", padding: "3px 8px", borderRadius: 6, background: "rgba(4,9,20,0.65)", color: "#94a3b8", border: "1px solid rgba(148,163,184,0.13)" }}>{item.year}</span>
            </div>
            <h4 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 16, lineHeight: 1.3, margin: "0 0 2px", color: hovered ? item.tierColor : "#f1f5f9", transition: "color 0.2s" }}>{item.title}</h4>
            <p style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", color: item.tierColor, marginBottom: 12 }}>{item.event}</p>
            <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}>{item.description}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: "auto", marginBottom: 10 }}>
              {item.tags.map(t => <TagPill key={t} label={t} color={item.tierColor} />)}
            </div>
            <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", color: hovered ? item.tierColor : "#475569", transition: "color 0.2s" }}>Click to view full details →</div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function PortfolioCards() {
  const [visibleRows, setVisibleRows] = useState(1);
  const gridRef = useRef(null);
  const cols = useGridColumns(gridRef);

  const cardsPerPage = cols * visibleRows;
  const shownProjects = PROJECTS.slice(0, cardsPerPage);
  const totalRows = Math.ceil(PROJECTS.length / cols);
  const hasMore = visibleRows < totalRows;
  const isExpanded = visibleRows > 1;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=JetBrains+Mono:wght@400;500&family=Outfit:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box}
        body{margin:0}
        .portfolio-root{background:transparent;position:relative;overflow-x:hidden;font-family:'Outfit',sans-serif}
        .grid-bg{background-image:linear-gradient(rgba(6,182,212,0.016) 1px,transparent 1px),linear-gradient(90deg,rgba(6,182,212,0.016) 1px,transparent 1px);background-size:56px 56px}
        ::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#1e293b;border-radius:4px}
        .project-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px}
        @media(max-width:1079px){.project-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media(max-width:719px){.project-grid{grid-template-columns:minmax(0,1fr)}}
        /* Center single last card in 3‑column layout */
        @media(min-width:1080px){
          .project-grid > *:last-child:nth-child(3n+1){grid-column:2}
        }

        /* Mobile: prevent the floating phone preview from clipping */
        @media (max-width: 420px) {
          .proj-mobile-preview {
            right: 10px !important;
            bottom: -54px !important;
            transform: none !important;
          }
        }

        @media (max-width: 360px) {
          .proj-mobile-preview { display: none !important; }
        }

        /* Mobile: keep pager indicators on one row, actions on next row */
        @media (max-width: 520px) {
          .proj-pager {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 12px !important;
          }
          .proj-indicators {
            width: 100% !important;
            justify-content: center !important;
          }
          .proj-actions {
            width: 100% !important;
            justify-content: center !important;
          }
          .proj-actions button {
            min-width: 0 !important;
          }
        }
      `}</style>

      <div className="portfolio-root">
        <div className="absolute inset-0 grid-bg" style={{ pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, left: "25%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.05),transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "25%", right: "25%", width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle,rgba(6,182,212,0.04),transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }} />

        <section id="projects" className="reveal-section section-y page-x" style={{ position: "relative" }}>
          <div className="container-6xl">
            <SectionHeader
              align="center"
              label="selected work"
              title={<>Featured<span className="block" style={{ background: "linear-gradient(135deg,#06b6d4 0%,#6366f1 60%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Projects</span></>}
              subtitle="Production systems, hackathon winners, and real-world deployments. Click any card for the full case study."
            />

            <div ref={gridRef} className="project-grid">
              {shownProjects.map((p, i) => (
                <ProjectCard key={p.id} project={p} delay={i * 0.06} />
              ))}
            </div>

            {totalRows > 1 && (
              <div className="proj-pager" style={{ marginTop: 48, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
                <div className="proj-indicators" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                    {Array.from({ length: totalRows }).map((_, i) => (
                      <div key={i} style={{
                        height: 6, width: i < visibleRows ? 24 : 8, borderRadius: 9999,
                        background: i < visibleRows ? "linear-gradient(90deg,#06b6d4,#6366f1)" : "rgba(148,163,184,0.18)",
                        boxShadow: i < visibleRows ? "0 0 8px rgba(6,182,212,0.4)" : "none",
                        transition: "all 0.35s ease",
                      }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono',monospace", color: "#334155" }}>
                    row {visibleRows}/{totalRows}
                  </span>
                </div>
                <div className="proj-actions" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
                  {hasMore && (
                    <button onClick={() => setVisibleRows(r => r + 1)}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        padding: "10px 22px", borderRadius: 14,
                        fontSize: 13, fontWeight: 600, cursor: "pointer",
                        fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.03em",
                        color: "#67e8f9", border: "1px solid rgba(6,182,212,0.38)",
                        background: "rgba(6,182,212,0.08)",
                        boxShadow: "0 10px 30px -18px rgba(6,182,212,0.55)",
                        transition: "transform 0.2s",
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
                      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                    >Show more ↓</button>
                  )}
                  {isExpanded && (
                    <button onClick={() => setVisibleRows(1)}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        padding: "10px 22px", borderRadius: 14,
                        fontSize: 13, fontWeight: 600, cursor: "pointer",
                        fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.03em",
                        color: "#94a3b8", border: "1px solid rgba(148,163,184,0.18)",
                        background: "rgba(148,163,184,0.05)",
                        transition: "transform 0.2s",
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
                      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                    >Show less ↑</button>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Divider */}
        <div className="page-x">
          <div className="container-6xl" style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(99,102,241,0.3),rgba(6,182,212,0.3),transparent)" }} />
        </div>

        <AchievementsPodium achievements={ACHIEVEMENTS_DATA} />
      </div>
    </>
  );
}