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

function getCoverImage(milestone) {
  if (milestone.coverImage) return milestone.coverImage;
  if (milestone.image) return milestone.image;
  if (Array.isArray(milestone.images)) {
    const first = milestone.images.filter(Boolean)[0];
    if (first) return first;
  }
  return null;
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
   COVER IMAGE — full photo shown via a blurred backdrop
   fill (no letterboxing, no color mismatch) with the actual
   photo layered on top using object-contain, so nobody gets
   cropped out. Framed like a HUD viewfinder: corner brackets,
   a slow scan sweep, and a small pulsing readout — reads as
   tech instrumentation rather than a plain photo crop.
───────────────────────────────────────────── */
function CoverImage({ src, accent, title }) {
  if (!src) return null;
  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: "#050f0a" }}>
      {/* Blurred backdrop — same image, scaled up, fills any empty space */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(28px) saturate(1.3) brightness(0.55)",
          transform: "scale(1.25)",
        }}
      />
      <div className="absolute inset-0" style={{ background: `${accent}14` }} />

      {/* Full, uncropped photo */}
      <img
        src={src}
        alt={title}
        className="relative w-full h-full"
        style={{ objectFit: "contain" }}
      />

      {/* Bottom readability gradient — kept minimal so the photo stays visible */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `linear-gradient(to top, rgba(5,15,10,0.55) 0%, transparent 30%)` }} />

      {/* HUD corner brackets */}
      {[
        { top: 10, left: 10, rotate: 0 },
        { top: 10, right: 10, rotate: 90 },
        { bottom: 10, left: 10, rotate: -90 },
        { bottom: 10, right: 10, rotate: 180 },
      ].map((pos, i) => (
        <svg key={i} width="18" height="18" viewBox="0 0 18 18"
          className="absolute pointer-events-none"
          style={{ ...pos, transform: `rotate(${pos.rotate}deg)`, opacity: 0.85 }}>
          <path d="M1,9 L1,1 L9,1" fill="none" stroke={accent} strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      ))}

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
  const cover = getCoverImage(milestone);

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

              <div className={cover ? "grid md:grid-cols-[1.1fr_0.9fr] gap-5" : "grid gap-5"}>
                {cover && (
                  <div className="relative rounded-2xl overflow-hidden border"
                    style={{ borderColor: `${accent}25`, minHeight: 340, background: "rgba(5,15,10,0.85)" }}>
                    <CoverImage src={cover} accent={accent} title={milestone.title} />
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  <div>
                    <h3 className="font-display italic text-2xl md:text-3xl font-semibold leading-tight mb-2"
                      style={{ color: INK, letterSpacing: "-0.01em" }}>
                      {milestone.title}
                    </h3>
                    <p style={{ color: MUTED }} className={cover ? "text-[13.5px] leading-relaxed" : "text-[15px] leading-relaxed max-w-2xl"}>{milestone.description}</p>
                  </div>

                  {milestone.details?.length > 0 && (
                    <div className={cover ? "rounded-xl border p-4" : "rounded-xl border p-5 max-w-2xl"}
                      style={{ borderColor: `${accent}20`, background: `${accent}07` }}>
                      <div className="text-[10px] font-mono uppercase tracking-[0.12em] mb-3" style={{ color: accent }}>
                        ▸ Highlights
                      </div>
                      <ul className={cover ? "space-y-2" : "space-y-2.5"}>
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
  const cover = getCoverImage(milestone);

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
            style={{ color: MUTED, display: "-webkit-box", WebkitLineClamp: cover ? 3 : 4, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
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

          {cover && (
            <button onClick={(e) => { e.stopPropagation(); setOpen(true); }}
              className="relative w-full rounded-xl overflow-hidden border transition-all duration-200 hover:scale-[1.015]"
              style={{ height: isMobile ? 170 : 200, borderColor: `${accent}30` }}>
              <CoverImage src={cover} accent={accent} title={milestone.title} />
            </button>
          )}

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
   VINE RAIL — the spine of the whole timeline, redrawn as a
   winding vine instead of a straight rail. It swings in one
   wide S-bend per era rather than a tight repeating wiggle, so
   it actually reads as a vine curving down the page. One leaf
   pair per era unfurls as the vine grows past it, and a small
   sprout sways at the current growing tip.
───────────────────────────────────────────── */
const VINE_AMP = 15; // how far the vine swings from center, in a 0–40 viewBox

function buildVinePath(n, amp = VINE_AMP, total = 1000) {
  const h = total / n;
  let d = "M20,0";
  for (let i = 0; i < n; i++) {
    const yEnd = (i + 1) * h;
    const dir = i % 2 === 0 ? 1 : -1;
    const cx = 20 + dir * amp * 1.55;
    const c1y = i * h + h / 3;
    const c2y = i * h + (2 * h) / 3;
    d += ` C${cx},${c1y} ${cx},${c2y} 20,${yEnd}`;
  }
  return d;
}

// Matches the S-bend above closely enough to place leaves/tip on the curve —
// one full swing (out and back) per era, same as the path's rhythm.
function xOnVine(y, n, amp = VINE_AMP, total = 1000) {
  const period = (2 * total) / n;
  return 20 + amp * Math.sin((2 * Math.PI * y) / period);
}

function VineRail({ progress, idSuffix }) {
  const n = Math.max(timelineData.length, 1);
  const vinePath = buildVinePath(n);
  const tipY = Math.min(Math.max(progress, 0), 1) * 1000;
  const tipX = xOnVine(tipY, n);
  const clipId = `vine-clip-${idSuffix}`;
  const gradId = `vine-grad-${idSuffix}`;

  return (
    <svg viewBox="0 0 40 1000" preserveAspectRatio="none"
      className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={MOSS} />
          <stop offset="45%" stopColor={TEAL} />
          <stop offset="100%" stopColor={AMBER} />
        </linearGradient>
        <clipPath id={clipId}>
          <rect x="0" y="0" width="40" height={tipY} />
        </clipPath>
      </defs>

      {/* Ungrown vine — the path yet to come */}
      <path d={vinePath} fill="none" stroke={RAIL_TRACK} strokeWidth="2.2" strokeLinecap="round" />

      {/* Grown vine */}
      <g clipPath={`url(#${clipId})`}>
        <path d={vinePath} fill="none" stroke={`url(#${gradId})`} strokeWidth="2.2" strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 4px ${MOSS}60)` }} />
      </g>

      {/* One leaf pair per era, colored by that era's own accent, tucked at the vine's edge */}
      {timelineData.map((item, i) => {
        const frac = (i + 0.5) / n;
        const y = frac * 1000;
        const x = xOnVine(y, n);
        const side = i % 2 === 0 ? 1 : -1;
        const active = tipY >= y;
        const accent = item.accent || MOSS;
        return (
          <g key={item.year || i} transform={`translate(${x} ${y}) rotate(${side > 0 ? -18 : 198})`}>
            <g style={{
              transform: `scale(${active ? 1 : 0.35})`,
              transformOrigin: "0px 0px",
              transition: "transform 0.7s cubic-bezier(0.34,1.4,0.64,1), opacity 0.7s ease",
              opacity: active ? 0.9 : 0.14,
            }}>
              <path d="M0,0 C4,-2.6 9,-2.2 13,0 C9,2.2 4,2.6 0,0 Z" fill={accent} />
            </g>
          </g>
        );
      })}

      {/* Growing tip — a small sprout swaying at the current frontier */}
      <g transform={`translate(${tipX} ${tipY})`}>
        <g style={{ animation: "vine-sway 3.4s ease-in-out infinite", transformOrigin: "0px 0px" }}>
          <path d="M0,0 C3,-4.5 3,-9.5 0,-14 C-3,-9.5 -3,-4.5 0,0 Z" fill={AMBER}
            style={{ filter: `drop-shadow(0 0 6px ${AMBER}85)` }} />
        </g>
      </g>
    </svg>
  );
}

/* ─────────────────────────────────────────────
   TIMELINE NODE — a bud on the vine. The rings still read as
   growth-ring dating and the diamond core still reads as a
   circuit component, but once the vine has grown past it, two
   small leaves unfurl on either side — the node blooms.
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
        {/* Two leaves that unfurl once this bud has bloomed */}
        <g style={{
          transform: `scale(${active ? 1 : 0.15})`,
          transformOrigin: "0px 8px",
          transition: "transform 0.6s cubic-bezier(0.34,1.4,0.64,1) 0.15s",
          opacity: active ? 0.9 : 0,
        }}>
          <path d="M0,8 C-6,5 -11,7 -14,12 C-9,14 -3,13 0,8 Z" fill={accent} />
        </g>
        <g style={{
          transform: `scale(${active ? 1 : 0.15})`,
          transformOrigin: "0px 8px",
          transition: "transform 0.6s cubic-bezier(0.34,1.4,0.64,1) 0.28s",
          opacity: active ? 0.9 : 0,
        }}>
          <path d="M0,8 C6,5 11,7 14,12 C9,14 3,13 0,8 Z" fill={accent} />
        </g>
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
  // Same bend direction as the vine for this era — nudges the indent
  // so the single mobile column still leans with the curve.
  const curveDir = index % 2 === 0 ? 1 : -1;

  return (
    <div ref={ref} className="relative mb-10" style={{ paddingLeft: 36 + curveDir * 8 }}>
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
  // Same alternation as the vine path's bend direction for this era —
  // the content leans the way the vine is swinging, instead of sitting
  // in a rigid fixed column.
  const curveDir = index % 2 === 0 ? 1 : -1;
  const curveShift = curveDir * 18;

  return (
    <div ref={ref} className="relative flex items-start gap-0" style={{
      flexDirection: isLeft ? "row-reverse" : "row",
      marginBottom: "4rem",
    }}>
      <div className="flex-1 min-w-0" style={{
        opacity: visible ? 1 : 0,
        transform: visible ? `translateX(${curveShift}px)` : isLeft ? "translateX(36px)" : "translateX(-36px)",
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
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) scale(1); }
          50%       { transform: translateY(-14px) scale(1.04); }
        }
        @keyframes vine-sway {
          0%, 100% { transform: rotate(-6deg); }
          50%       { transform: rotate(6deg); }
        }
        @keyframes scan-sweep {
          0%   { top: -10%; opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }

        .timeline-section { position: relative; overflow: hidden; }
        .scrollbar-none { scrollbar-width: none; }
        .scrollbar-none::-webkit-scrollbar { display: none; }
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
                <div className="absolute top-0 bottom-0 pointer-events-none" style={{ left: -10, width: 40 }}>
                  <VineRail progress={lineProgress} idSuffix="mobile" />
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
                  style={{ left: "50%", transform: "translateX(-50%)", width: 58 }}>
                  <VineRail progress={lineProgress} idSuffix="desktop" />
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