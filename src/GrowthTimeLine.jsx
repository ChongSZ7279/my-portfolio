import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import Tilt from "react-parallax-tilt";
import { timelineData } from "./data/growthJourney";
import SectionHeader from "./components/SectionHeader";

/* ─────────────────────────────────────────────
   TOKENS — same "canopy & roots" palette as Journey.jsx
   so the whole page reads as one connected world:
   organic (moss/growth) + precise (circuit/data).
───────────────────────────────────────────── */
const MOSS = "#34d399";
const TEAL = "#22d3ee";
const AMBER = "#fbbf24";
const INK = "#eef5f0";
const MUTED = "#8fa79b";
const MUTED_DARK = "#4a5f54";
const BG_DEEP = "#050f0a";
const RAIL_TRACK = "rgba(143,167,155,0.10)";

const RAIL_GRADIENT = `linear-gradient(180deg, ${MOSS} 0%, ${TEAL} 45%, ${AMBER} 100%)`;
const HERO_GRADIENT = `linear-gradient(135deg, ${MOSS} 0%, ${TEAL} 55%, ${AMBER} 100%)`;

/* ─────────────────────────────────────────────
   HOOKS
───────────────────────────────────────────── */
function useIntersection(ref, options = {}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.08, ...options });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return visible;
}

function useScrollProgress(containerRef) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      const activationLine = windowH * 0.65;
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

function useMousePosition() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handler = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, []);
  return pos;
}

function getMilestoneImages(milestone) {
  if (Array.isArray(milestone.images) && milestone.images.length > 0) return milestone.images.filter(Boolean);
  if (milestone.image) return [milestone.image];
  if (milestone.coverImage) return [milestone.coverImage];
  return [];
}

/* ─────────────────────────────────────────────
   PARTICLES — "spores drifting past a circuit board"
   Same idea as before, recolored to moss/teal/amber and
   slowed down so it reads as organic drift, not tech noise.
───────────────────────────────────────────── */
function Particles() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const pts = Array.from({ length: 46 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.14,
      vy: (Math.random() - 0.5) * 0.14,
      r: Math.random() * 1.2 + 0.3,
      a: Math.random() * 0.26 + 0.06,
      c: ["52,211,153", "34,211,238", "251,191,36"][Math.floor(Math.random() * 3)],
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
      // Faint traces between nearby spores — the "circuit" half of the motif.
      for (let i = 0; i < pts.length; i++)
        for (let j = i + 1; j < pts.length; j++) {
          const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
          if (d < 85) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(52,211,153,${0.05 * (1 - d / 85)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.7 }} />;
}

function CursorGlow() {
  const pos = useMousePosition();
  return (
    <div
      className="fixed pointer-events-none z-0"
      style={{
        left: pos.x - 200,
        top: pos.y - 200,
        width: 400,
        height: 400,
        borderRadius: "50%",
        background: `radial-gradient(circle, rgba(52,211,153,0.05) 0%, transparent 70%)`,
        transition: "left 0.4s ease, top 0.4s ease",
      }}
    />
  );
}

/* ─────────────────────────────────────────────
   TECH TAG — mono pill, unchanged in shape, recolored
───────────────────────────────────────────── */
function Tag({ label, accent = MOSS }) {
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border"
      style={{
        color: accent,
        borderColor: `${accent}35`,
        background: `linear-gradient(135deg, ${accent}12, ${accent}06)`,
        boxShadow: `inset 0 0 8px ${accent}10, 0 0 6px ${accent}10`,
        letterSpacing: "0.03em",
      }}
    >
      {label}
    </span>
  );
}

function Badge({ label, color = AMBER }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border"
      style={{
        color,
        borderColor: `${color}45`,
        background: `linear-gradient(135deg, ${color}18, ${color}08)`,
        boxShadow: `0 0 12px ${color}18`,
        animation: "badge-pulse 3s ease-in-out infinite",
        letterSpacing: "0.06em",
      }}
    >
      {label}
    </span>
  );
}

/* ─────────────────────────────────────────────
   GROWTH GLYPH — a small standalone mark built from the same
   rings + radiating legs + diamond core as the timeline nodes.
   Used to dress up any spot with no photo, so "no image" still
   looks designed rather than like a missing asset.
───────────────────────────────────────────── */
function GrowthGlyph({ accent, size = 56 }) {
  const legs = [0, 60, 120, 180, 240, 300];
  return (
    <svg width={size} height={size} viewBox="-30 -30 60 60" style={{ overflow: "visible" }}>
      <circle r="21" fill="none" stroke={`${accent}45`} strokeWidth="0.7" strokeDasharray="2.5 4" />
      <circle r="14" fill="none" stroke={`${accent}30`} strokeWidth="0.7" />
      {legs.map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = Math.cos(rad) * 14, y1 = Math.sin(rad) * 14;
        const x2 = Math.cos(rad) * 27, y2 = Math.sin(rad) * 27;
        return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke={`${accent}30`} strokeWidth="1" />;
      })}
      <g transform="rotate(45)">
        <rect x="-7" y="-7" width="14" height="14" rx="3" fill={`${accent}18`} stroke={accent} strokeWidth="1.4" />
      </g>
    </svg>
  );
}

/* ─────────────────────────────────────────────
   IMAGE CAROUSEL — unchanged mechanics, recolored chrome
───────────────────────────────────────────── */
function ImageCarousel({ images, accent, title, embedded = false }) {
  const [idx, setIdx] = useState(0);
  const [fading, setFading] = useState(false);

  const goTo = useCallback((i) => {
    if (i === idx) return;
    setFading(true);
    setTimeout(() => { setIdx(i); setFading(false); }, 220);
  }, [idx]);

  if (images.length === 0) return (
    <div className="relative w-full h-full flex flex-col items-center justify-center gap-4 overflow-hidden">
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 42%, ${accent}14 0%, transparent 65%)` }} />
      <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(${accent}18 1px, transparent 1px)`, backgroundSize: "22px 22px", opacity: 0.35, maskImage: "radial-gradient(ellipse at 50% 45%, black 0%, transparent 70%)" }} />
      <div className="relative" style={{ animation: "float-slow 7s ease-in-out infinite" }}>
        <GrowthGlyph accent={accent} size={72} />
      </div>
      <div className="relative text-center px-6">
        <p className="text-[13px] font-medium mb-1" style={{ color: "#cdd9d2" }}>No preview yet</p>
        <p className="text-[11px] font-mono" style={{ color: MUTED }}>the story's all in the details below ↓</p>
      </div>
    </div>
  );

  return (
    <div className={`relative w-full flex flex-col ${embedded ? "h-full min-h-[280px]" : "h-full"}`}>
      <div className={`relative overflow-hidden ${embedded ? "flex-1 min-h-[220px]" : "flex-1 rounded-xl"}`}>
        <img
          src={images[idx]}
          alt={`${title} — ${idx + 1}`}
          className="w-full h-full object-cover"
          style={{ opacity: fading ? 0 : 1, transition: "opacity 0.22s ease" }}
        />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `linear-gradient(to top, rgba(5,15,10,0.75) 0%, transparent 40%)` }} />

        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-mono"
            style={{ background: "rgba(5,15,10,0.65)", color: "rgba(238,245,240,0.65)", backdropFilter: "blur(8px)" }}>
            {idx + 1} / {images.length}
          </div>
        )}

        {images.length > 1 && (
          <>
            <button onClick={() => goTo((idx - 1 + images.length) % images.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all hover:scale-110"
              style={{ background: "rgba(5,15,10,0.6)", color: "rgba(238,245,240,0.85)", backdropFilter: "blur(8px)" }}>‹</button>
            <button onClick={() => goTo((idx + 1) % images.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all hover:scale-110"
              style={{ background: "rgba(5,15,10,0.6)", color: "rgba(238,245,240,0.85)", backdropFilter: "blur(8px)" }}>›</button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className={`flex gap-2 overflow-x-auto pb-1 scrollbar-none ${embedded ? "mt-2 px-1 flex-shrink-0" : "mt-2"}`}>
          {images.map((src, i) => (
            <button key={i} onClick={() => goTo(i)}
              className="shrink-0 rounded-lg overflow-hidden transition-all duration-200"
              style={{
                width: 58, height: 40,
                outline: i === idx ? `2px solid ${accent}` : "2px solid transparent",
                outlineOffset: 1,
                opacity: i === idx ? 1 : 0.45,
                transform: i === idx ? "scale(1.05)" : "scale(1)",
              }}>
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   JOURNEY MODAL — same layout, recolored to the forest/PCB palette
───────────────────────────────────────────── */
function JourneyModal({ milestone, accent, onClose }) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (milestone) {
      setMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      document.body.style.overflow = "hidden";
    } else {
      setVisible(false);
      const t = setTimeout(() => { setMounted(false); document.body.style.overflow = ""; }, 340);
      return () => clearTimeout(t);
    }
    return () => { document.body.style.overflow = ""; };
  }, [milestone]);

  useEffect(() => {
    const esc = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  if (!mounted || !milestone) return null;
  const images = getMilestoneImages(milestone);

  return createPortal(
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 99998,
          background: visible ? "rgba(4,10,7,0.9)" : "rgba(4,10,7,0)",
          backdropFilter: visible ? "blur(24px) saturate(0.8)" : "blur(0px)",
          WebkitBackdropFilter: visible ? "blur(24px) saturate(0.8)" : "blur(0px)",
          transition: "background 0.36s ease, backdrop-filter 0.36s ease",
        }}
      />

      <div style={{
        position: "fixed", inset: 0, zIndex: 99999,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem", overflowY: "auto", pointerEvents: "none",
      }}>
        <div style={{
          width: "100%", maxWidth: 1020, margin: "auto",
          pointerEvents: "all",
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1) translateY(0)" : "scale(0.94) translateY(28px)",
          transition: "opacity 0.36s cubic-bezier(0.22,1,0.36,1), transform 0.36s cubic-bezier(0.22,1,0.36,1)",
        }}>
          <div className="relative rounded-2xl overflow-hidden" style={{
            background: "linear-gradient(160deg, #070f0c 0%, #050b09 100%)",
            border: `1px solid ${accent}30`,
            boxShadow: `0 60px 140px -32px ${accent}38, 0 0 0 1px ${accent}12, inset 0 1px 0 rgba(255,255,255,0.04)`,
            maxHeight: "88vh", overflowY: "auto",
          }}>
            <div style={{ height: 3, background: `linear-gradient(90deg, transparent 0%, ${accent} 40%, ${AMBER} 80%, transparent 100%)` }} />

            <button onClick={onClose}
              className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 hover:rotate-90"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: MUTED,
                transition: "all 0.25s ease",
              }}
              aria-label="Close">✕</button>

            <div className="p-5 md:p-7">
              <div className="flex flex-wrap items-center gap-2.5 mb-5">
                <span className="text-[10px] font-mono uppercase tracking-[0.15em] px-3 py-1 rounded-full"
                  style={{ color: accent, background: `${accent}15`, border: `1px solid ${accent}25` }}>
                  {milestone.category}
                </span>
                <Badge label={milestone.badge} color={milestone.badgeColor || AMBER} />
                {milestone.link && (
                  <a href={milestone.link} target="_blank" rel="noopener noreferrer"
                    className="ml-auto inline-flex items-center gap-1.5 text-[11px] font-mono px-3 py-1 rounded-full border transition-all hover:scale-105"
                    style={{ color: accent, borderColor: `${accent}30`, background: `${accent}10` }}>
                    <span>↗</span>
                    <span>{milestone.link.includes("github") ? "GitHub" : "View Link"}</span>
                  </a>
                )}
              </div>

              <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-5">
                <div className="relative rounded-2xl overflow-hidden border"
                  style={{ borderColor: `${accent}25`, minHeight: 280, background: "rgba(5,15,10,0.85)" }}>
                  <ImageCarousel images={images} accent={accent} title={milestone.title} />
                </div>

                <div className="flex flex-col gap-4">
                  <div>
                    <h3 className="font-display italic text-2xl md:text-3xl font-semibold leading-tight mb-2"
                      style={{ color: INK, letterSpacing: "-0.01em" }}>
                      {milestone.title}
                    </h3>
                    <p style={{ color: MUTED }} className="text-[13.5px] leading-relaxed">{milestone.description}</p>
                  </div>

                  {milestone.details?.length > 0 && (
                    <div className="rounded-xl border p-4"
                      style={{ borderColor: `${accent}20`, background: `${accent}07` }}>
                      <div className="text-[10px] font-mono uppercase tracking-[0.12em] mb-3" style={{ color: accent }}>
                        ▸ Highlights
                      </div>
                      <ul className="space-y-2">
                        {milestone.details.map((d, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-[13px] leading-snug" style={{ color: "#cdd9d2" }}>
                            <span className="mt-0.5 text-xs shrink-0" style={{ color: accent }}>◆</span>
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {milestone.tags?.length > 0 && (
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-[0.12em] mb-2" style={{ color: accent }}>
                        ▸ Focus Areas
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {milestone.tags.map((t) => <Tag key={t} label={t} accent={accent} />)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}

function StatChip({ value, label, accent }) {
  return (
    <div className="flex flex-col items-center px-3 py-2 rounded-lg border"
      style={{ borderColor: `${accent}20`, background: `${accent}08` }}>
      <span className="font-display font-semibold text-base leading-none" style={{ color: accent }}>{value}</span>
      <span className="text-[9px] font-mono uppercase tracking-widest mt-0.5" style={{ color: "rgba(143,167,155,0.75)" }}>{label}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MILESTONE CARD — same interaction model, forest-glass surface
───────────────────────────────────────────── */
function MilestoneCard({ milestone, accent, delay, isMobile }) {
  const ref = useRef(null);
  const visible = useIntersection(ref);
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);
  const images = getMilestoneImages(milestone);

  const cardContent = (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setOpen(true)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.96)",
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s cubic-bezier(0.34,1.35,0.64,1) ${delay}s`,
        cursor: "pointer",
      }}
    >
      <div
        className="relative rounded-2xl border overflow-hidden group"
        style={{
          background: hovered
            ? `linear-gradient(145deg, rgba(9,20,15,0.98), rgba(6,14,10,0.98))`
            : "rgba(7,16,12,0.72)",
          borderColor: hovered ? `${accent}50` : "rgba(143,167,155,0.10)",
          backdropFilter: "blur(20px)",
          boxShadow: hovered
            ? `0 24px 64px -12px ${accent}28, 0 0 0 1px ${accent}20, inset 0 1px 0 rgba(255,255,255,0.05)`
            : "0 4px 20px -4px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.02)",
          transform: hovered && !isMobile ? "translateY(-4px)" : "translateY(0)",
          transition: "all 0.35s cubic-bezier(0.34,1.2,0.64,1)",
        }}
      >
        <div className="h-[2px] w-full" style={{
          background: `linear-gradient(90deg, transparent, ${accent}80, transparent)`,
          opacity: hovered ? 1 : 0.3,
          transition: "opacity 0.35s",
        }} />

        <div className="absolute inset-0 pointer-events-none" style={{
          background: `radial-gradient(ellipse at 50% -10%, ${accent}08 0%, transparent 60%)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.4s",
        }} />

        <div className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none" style={{
          background: `radial-gradient(circle at 100% 100%, ${accent}07 0%, transparent 70%)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.4s",
        }} />

        <div className={isMobile ? "relative p-4" : "relative p-5"}>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.12em] px-2.5 py-0.5 rounded-full border"
              style={{ color: accent, background: `${accent}12`, borderColor: `${accent}25` }}>
              {milestone.category}
            </span>
            <Badge label={milestone.badge} color={milestone.badgeColor || AMBER} />
          </div>

          <h4 className={`font-display font-semibold leading-tight mb-2 ${isMobile ? "text-[15px]" : "text-[16px]"}`}
            style={{
              color: hovered ? INK : "#dce6df",
              letterSpacing: "-0.01em",
              transition: "color 0.3s",
            }}>
            {milestone.title}
          </h4>

          <p className={`leading-relaxed mb-4 ${isMobile ? "text-[12.5px]" : "text-[13px]"}`}
            style={{ color: MUTED, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {milestone.description}
          </p>

          {milestone.stats?.length > 0 && (
            <div className="flex gap-2 mb-4">
              {milestone.stats.map((s, i) => (
                <StatChip key={i} value={s.value} label={s.label} accent={accent} />
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-1.5 mb-3">
            {milestone.tags.slice(0, isMobile ? 4 : 6).map((t) => <Tag key={t} label={t} accent={accent} />)}
            {milestone.tags.length > (isMobile ? 4 : 6) && (
              <span className="text-[11px] font-mono" style={{ color: "rgba(143,167,155,0.55)", alignSelf: "center" }}>
                +{milestone.tags.length - (isMobile ? 4 : 6)}
              </span>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {images.length > 0 ? images.map((src, idx) => (
              <button key={idx} onClick={(e) => { e.stopPropagation(); setOpen(true); }}
                className="relative shrink-0 rounded-xl overflow-hidden border transition-all duration-200 hover:scale-105"
                style={{ width: isMobile ? 110 : 126, height: isMobile ? 70 : 80, borderColor: `${accent}30` }}>
                <img src={src} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${accent}18, transparent)` }} />
              </button>
            )) : (
              <button onClick={(e) => { e.stopPropagation(); setOpen(true); }}
                className="relative shrink-0 rounded-xl border overflow-hidden flex flex-col items-center justify-center gap-1 transition-all duration-200 hover:scale-105 group/glyph"
                style={{
                  width: isMobile ? 110 : 126, height: isMobile ? 70 : 80,
                  borderColor: `${accent}28`,
                  background: `linear-gradient(150deg, ${accent}16, rgba(7,16,12,0.9))`,
                }}>
                <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(${accent}22 1px, transparent 1px)`, backgroundSize: "10px 10px", opacity: 0.5 }} />
                <div className="relative transition-transform duration-300 group-hover/glyph:scale-110">
                  <GrowthGlyph accent={accent} size={isMobile ? 26 : 30} />
                </div>
                <span className="relative text-[9px] font-mono uppercase tracking-wider" style={{ color: accent }}>
                  View story
                </span>
              </button>
            )}
          </div>

          <div className="mt-3 flex items-center gap-1.5">
            <div className="w-1 h-1 rounded-full" style={{ background: accent, animation: "badge-pulse 2s infinite" }} />
            <span className="text-[10px] font-mono" style={{ color: "rgba(143,167,155,0.45)" }}>
              {isMobile ? "Tap" : "Click"} to explore full story
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {open && <JourneyModal milestone={milestone} accent={accent} onClose={() => setOpen(false)} />}
      {isMobile ? cardContent : (
        <Tilt glareEnable glareMaxOpacity={0.15} glareColor={accent} glarePosition="all"
          tiltMaxAngleX={6} tiltMaxAngleY={6} transitionSpeed={1400} scale={1.012} className="w-full">
          {cardContent}
        </Tilt>
      )}
    </>
  );
}

/* ─────────────────────────────────────────────
   TIMELINE NODE — signature element.
   A growth ring (dendrochronology) fused with a circuit via:
   concentric dashed rings read as tree-ring dating, the
   diamond core reads as a PCB component, and four radiating
   ticks read as trace legs. One motif, two readings.
───────────────────────────────────────────── */
function TimelineNode({ accent, active, index }) {
  const ticks = [0, 90, 180, 270];
  return (
    <div className="relative flex items-center justify-center" style={{ width: 52, height: 52 }}>
      <svg width="52" height="52" viewBox="-26 -26 52 52" className="absolute inset-0 overflow-visible">
        {/* Outer growth ring */}
        <circle r="17" fill="none"
          stroke={active ? accent : "rgba(143,167,155,0.14)"}
          strokeWidth="0.8"
          strokeDasharray="2.5 3.5"
          style={{ transition: "stroke 0.6s ease", opacity: active ? 0.6 : 1 }} />
        {/* Inner growth ring */}
        <circle r="11" fill="none"
          stroke={active ? accent : "rgba(143,167,155,0.10)"}
          strokeWidth="0.8"
          style={{ transition: "stroke 0.5s ease", opacity: active ? 0.85 : 1 }} />
        {/* Circuit trace legs */}
        {ticks.map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const x1 = Math.cos(rad) * 17, y1 = Math.sin(rad) * 17;
          const x2 = Math.cos(rad) * 23, y2 = Math.sin(rad) * 23;
          return (
            <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={active ? accent : "rgba(143,167,155,0.12)"}
              strokeWidth="1"
              style={{ transition: "stroke 0.5s ease" }} />
          );
        })}
      </svg>

      {/* Diamond "chip" core */}
      <div className="relative z-10 flex items-center justify-center transition-all duration-500"
        style={{
          width: active ? 15 : 11,
          height: active ? 15 : 11,
          transform: "rotate(45deg)",
          borderRadius: 3,
          background: active ? `linear-gradient(135deg, ${accent}70, ${accent}20)` : "rgba(5,15,10,0.9)",
          border: `1.5px solid ${active ? accent : "rgba(143,167,155,0.25)"}`,
          boxShadow: active ? `0 0 18px ${accent}55, 0 0 36px ${accent}22` : "none",
        }}>
        <div className="rounded-[1px] transition-all duration-400"
          style={{
            width: active ? 4 : 2.5,
            height: active ? 4 : 2.5,
            background: active ? INK : "rgba(143,167,155,0.4)",
          }} />
      </div>

      {active && (
        <div className="absolute inset-0 rounded-full animate-ping"
          style={{ border: `1.5px solid ${accent}`, opacity: 0.18, animationDuration: "2.4s" }} />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   YEAR BLOCK — MOBILE
───────────────────────────────────────────── */
function YearBlockMobile({ item, index, lineProgress }) {
  const ref = useRef(null);
  const visible = useIntersection(ref);
  const nodePosition = index / Math.max(timelineData.length, 1);
  const nodeActive = lineProgress >= nodePosition;
  const accent = item.accent || MOSS;

  return (
    <div ref={ref} className="relative pl-9 mb-10">
      <div className="absolute left-0 top-0.5 flex flex-col items-center" style={{ width: 22 }}>
        <div className="rounded-full transition-all duration-500"
          style={{
            width: nodeActive ? 14 : 10,
            height: nodeActive ? 14 : 10,
            background: nodeActive ? accent : "rgba(143,167,155,0.22)",
            boxShadow: nodeActive ? `0 0 12px ${accent}80, 0 0 24px ${accent}30` : "none",
            border: `2px solid ${nodeActive ? accent : "rgba(143,167,155,0.14)"}`,
            marginLeft: 4,
            flexShrink: 0,
            transition: "all 0.5s ease",
          }} />
      </div>

      <div style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(-18px)",
        transition: "opacity 0.6s ease 0.05s, transform 0.6s cubic-bezier(0.22,1,0.36,1) 0.05s",
      }}>
        <div className="flex items-baseline gap-3 mb-1">
          <span className="font-display italic font-semibold leading-none"
            style={{
              fontSize: "clamp(2.2rem, 11vw, 3rem)",
              background: `linear-gradient(135deg, ${accent} 20%, ${accent}60 100%)`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              filter: nodeActive ? `drop-shadow(0 0 12px ${accent}50)` : "none",
              transition: "filter 0.5s ease",
            }}>
            {item.year}
          </span>
          <div>
            <div className="text-[15px] font-semibold font-display leading-tight" style={{ color: INK }}>
              <span className="mr-1.5">{item.icon}</span>{item.era}
            </div>
            <div className="text-[9px] font-mono tracking-[0.15em] uppercase mt-0.5" style={{ color: accent, opacity: 0.8 }}>
              {item.milestones.length} milestone{item.milestones.length > 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 mt-3">
        {item.milestones.map((m, i) => (
          <MilestoneCard key={i} milestone={m} accent={m.accent || accent} delay={i * 0.07} isMobile />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   YEAR BLOCK — DESKTOP
───────────────────────────────────────────── */
function YearBlockDesktop({ item, index, lineProgress }) {
  const ref = useRef(null);
  const visible = useIntersection(ref);
  const isLeft = item.side === "left";
  const nodePosition = index / Math.max(timelineData.length, 1);
  const nodeActive = lineProgress >= nodePosition;
  const accent = item.accent || MOSS;

  return (
    <div ref={ref} className="relative flex items-start gap-0" style={{
      flexDirection: isLeft ? "row-reverse" : "row",
      marginBottom: "4rem",
    }}>
      <div className="flex-1 min-w-0" style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : isLeft ? "translateX(36px)" : "translateX(-36px)",
        transition: "opacity 0.7s ease 0.1s, transform 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s",
        paddingLeft: isLeft ? 0 : "2rem",
        paddingRight: isLeft ? "2rem" : 0,
      }}>
        <div className="flex items-center gap-4 mb-5" style={{ flexDirection: isLeft ? "row-reverse" : "row" }}>
          <div className="font-display italic font-semibold leading-none select-none"
            style={{
              fontSize: "clamp(3rem, 5vw, 4.5rem)",
              background: `linear-gradient(135deg, ${accent} 10%, ${accent}65 100%)`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              filter: nodeActive ? `drop-shadow(0 0 16px ${accent}55)` : "none",
              transition: "filter 0.6s ease",
            }}>
            {item.year}
          </div>
          <div style={{ textAlign: isLeft ? "right" : "left" }}>
            <div className="text-xl font-semibold font-display leading-tight" style={{ color: INK }}>
              <span className="mr-2">{item.icon}</span>{item.era}
            </div>
            <div className="text-[10px] font-mono tracking-[0.12em] uppercase mt-1" style={{ color: accent, opacity: 0.85 }}>
              {item.milestones.length} milestone{item.milestones.length > 1 ? "s" : ""}
            </div>
          </div>
        </div>

        <div className="space-y-3.5">
          {item.milestones.map((m, i) => (
            <MilestoneCard key={i} milestone={m} accent={m.accent || accent}
              delay={index * 0.1 + i * 0.09} isMobile={false} />
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center" style={{ width: 52, flexShrink: 0 }}>
        <TimelineNode accent={accent} active={nodeActive} index={index} />
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
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500;1,9..144,600&family=Space+Grotesk:wght@400;500;700&family=Outfit:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
        .font-mono    { font-family: 'Space Grotesk', monospace; }
        *             { font-family: 'Outfit', sans-serif; box-sizing: border-box; }

        @keyframes badge-pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0px transparent; }
          50%       { opacity: 0.72; }
        }
        @keyframes line-glow {
          0%, 100% { filter: blur(1.5px) brightness(1); }
          50%       { filter: blur(3px) brightness(1.5); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) scale(1); }
          50%       { transform: translateY(-14px) scale(1.04); }
        }
        @keyframes sap-flow {
          0%   { transform: translateY(-12px); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(12px); opacity: 0; }
        }

        .timeline-section { position: relative; overflow: hidden; }
        .scrollbar-none { scrollbar-width: none; }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .tl-line-glow { animation: line-glow 3.5s ease-in-out infinite; }
      `}</style>

      <section id="journey" className="timeline-section parallax-bg section-y page-x min-h-screen">
        <Particles />
        <CursorGlow />

        {/* Ambient canopy-light blobs — moss / teal / amber, matching Journey.jsx */}
        <div className="absolute top-1/5 left-0 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${MOSS}18 0%, transparent 70%)`,
            filter: "blur(48px)",
            animation: "float-slow 9s ease-in-out infinite",
          }} />
        <div className="absolute bottom-1/3 right-0 w-80 h-80 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${TEAL}14 0%, transparent 70%)`,
            filter: "blur(48px)",
            animation: "float-slow 12s ease-in-out infinite 2.5s",
          }} />
        <div className="absolute top-2/3 left-1/3 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${AMBER}10 0%, transparent 70%)`,
            filter: "blur(40px)",
            animation: "float-slow 14s ease-in-out infinite 5s",
          }} />

        <div className="relative z-10 container-5xl" ref={containerRef}>
          <SectionHeader
            align="center"
            label="career journey"
            title={
              <>
                Growth
                <span className="block italic" style={{
                  background: HERO_GRADIENT,
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}>
                  Timeline
                </span>
              </>
            }
            subtitle="Six years of building, competing, and shipping — from an Arduino in Sarawak to blockchain on Ethereum mainnet."
          />

          <div className="relative">
            {isMobile ? (
              <div className="relative">
                <div className="absolute top-0 bottom-0 pointer-events-none" style={{ left: 9, width: 2, background: RAIL_TRACK }}>
                  <div ref={lineRef} className="tl-line-glow" style={{
                    position: "absolute", top: 0, left: 0, right: 0,
                    height: lineHeightPct,
                    background: RAIL_GRADIENT,
                    borderRadius: 2,
                    transition: "height 0.1s linear",
                    boxShadow: `0 0 8px ${MOSS}55, 0 0 16px ${TEAL}30`,
                  }}>
                    {/* Sap droplet traveling along the rail — organic pulse on a technical line */}
                    <div style={{
                      position: "absolute", bottom: 0, left: -1.5, width: 5, height: 5,
                      borderRadius: "50%", background: AMBER, boxShadow: `0 0 8px ${AMBER}`,
                      animation: "sap-flow 2.6s ease-in-out infinite",
                    }} />
                  </div>
                </div>
                <div className="pt-1">
                  {timelineData.map((item, i) => (
                    <YearBlockMobile key={item.year} item={item} index={i} lineProgress={lineProgress} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute top-0 bottom-0 pointer-events-none"
                  style={{ left: "50%", transform: "translateX(-50%)", width: 2, background: RAIL_TRACK }}>
                  <div ref={lineRef} className="tl-line-glow" style={{
                    position: "absolute", top: 0, left: 0, right: 0,
                    height: lineHeightPct,
                    background: RAIL_GRADIENT,
                    borderRadius: 2,
                    transition: "height 0.1s linear",
                    boxShadow: `0 0 10px ${MOSS}60, 0 0 20px ${TEAL}30`,
                  }}>
                    <div style={{
                      position: "absolute", bottom: 0, left: -1.5, width: 5, height: 5,
                      borderRadius: "50%", background: AMBER, boxShadow: `0 0 8px ${AMBER}`,
                      animation: "sap-flow 2.6s ease-in-out infinite",
                    }} />
                  </div>
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
          <div className="mt-14 md:mt-20 rounded-3xl border overflow-hidden relative"
            style={{
              background: "linear-gradient(145deg, rgba(7,16,12,0.92), rgba(5,11,9,0.96))",
              borderColor: `${MOSS}2e`,
              backdropFilter: "blur(24px)",
              boxShadow: `0 0 80px -24px ${MOSS}30, inset 0 1px 0 rgba(255,255,255,0.04)`,
            }}>
            <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${MOSS} 30%, ${TEAL} 70%, transparent)` }} />

            <div className="p-7 md:p-10 text-center relative">
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 50% 0%, ${MOSS}10 0%, transparent 55%)` }} />

              <div className="relative">
                <div className="text-4xl mb-4" style={{ animation: "float-slow 6s ease-in-out infinite" }}>✦</div>
                <h3 className="font-display italic text-2xl md:text-3xl font-semibold mb-3"
                  style={{ color: INK, letterSpacing: "-0.01em" }}>
                  The Journey Continues
                </h3>
                <p className="text-sm leading-relaxed max-w-md mx-auto mb-7" style={{ color: MUTED }}>
                  Currently exploring the intersection of AI, blockchain, and scalable systems —
                  always learning, always shipping.
                </p>
                <div className="flex flex-wrap justify-center gap-2.5">
                  {[
                    { icon: "🚀", label: "Full-Stack" },
                    { icon: "⛓", label: "Web3" },
                    { icon: "🤖", label: "AI/ML" },
                    { icon: "🏆", label: "Hackathons" },
                    { icon: "📐", label: "System Design" },
                  ].map(({ icon, label }) => (
                    <span key={label}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-300 hover:scale-105 hover:-translate-y-0.5"
                      style={{
                        color: MOSS,
                        borderColor: `${MOSS}30`,
                        background: `${MOSS}0c`,
                        boxShadow: `0 0 12px ${MOSS}10`,
                        cursor: "default",
                      }}>
                      <span>{icon}</span>
                      <span>{label}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}