import { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { TECH_STACK } from "./data/techStack";
import { getTechLogo } from "./data/techStack";
import SectionHeader from "./components/SectionHeader";

/* ──────────────────────────────────────────────────────────────
   DESIGN TOKENS — "canopy & roots"
   A full-stack dev, rendered as an ecosystem: languages are the
   soil/roots, backend the trunk, frontend the canopy, everything
   else the surrounding growth. Dark, bioluminescent, organic.
   ────────────────────────────────────────────────────────────── */
const INK = "#eef5f0";
const MUTED = "#8fa79b";
const BG_DEEP = "#050f0a";

// Several official developer marks are intentionally black or near-black.
// Give those marks a light tile so they remain legible on the dark interface.
const MONOCHROME_LOGOS = new Set(["GitHub", "Next.js", "Solidity & Web3.js"]);

// Soft, irregular corner sets — nothing in nature is a perfect rounded rect.
const BLOB_RADII = [
  "42% 58% 63% 37% / 41% 44% 56% 59%",
  "58% 42% 39% 61% / 55% 38% 62% 45%",
  "38% 62% 55% 45% / 46% 60% 40% 54%",
  "63% 37% 45% 55% / 40% 55% 45% 60%",
];

function TechIcon({ name, color, size = 18, seed = 0 }) {
  const needsLightTile = MONOCHROME_LOGOS.has(name);
  const radius = BLOB_RADII[seed % BLOB_RADII.length];

  return (
    <span
      aria-hidden="true"
      style={{
        width: size + 9,
        height: size + 9,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        borderRadius: radius,
        background: needsLightTile
          ? "rgba(240, 245, 238, 0.95)"
          : `color-mix(in srgb, ${color} 18%, rgba(255,255,255,0.04))`,
        border: `1px solid ${needsLightTile ? "rgba(255,255,255,0.5)" : color + "35"}`,
        boxShadow: needsLightTile ? "0 2px 8px rgba(0,0,0,0.25)" : `0 3px 12px -5px ${color}80`,
      }}
    >
      <img
        src={getTechLogo(name)}
        alt=""
        style={{ width: size, height: size, objectFit: "contain", display: "block" }}
      />
    </span>
  );
}

function useInView(ref, margin = "-60px") {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setSeen(true); obs.disconnect(); } },
      { rootMargin: margin, threshold: 0.06 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return seen;
}

/* ── Portal Tooltip ── */
function PortalTooltip({ anchorRef, color, name, description, visible }) {
  const [pos, setPos] = useState({ top: 0, left: 0 });
  useEffect(() => {
    if (!visible || !anchorRef.current) return;
    const update = () => {
      const r = anchorRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + window.scrollY + 10, left: r.left + window.scrollX + r.width / 2 });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, [visible, anchorRef]);

  if (!visible) return null;
  return ReactDOM.createPortal(
    <div style={{ position: "absolute", top: pos.top, left: pos.left, transform: "translateX(-50%)", zIndex: 99999, width: 212, pointerEvents: "none", animation: "sproutIn 0.18s cubic-bezier(.22,1,.36,1) forwards" }}>
      <div style={{ width: 8, height: 8, background: "#0a1712", border: `1px solid ${color}55`, borderBottom: "none", borderRight: "none", transform: "rotate(45deg)", margin: "0 auto -4px", position: "relative", zIndex: 1, borderRadius: "3px 0 0 0" }} />
      <div style={{ background: "rgba(9,19,15,0.97)", border: `1px solid ${color}40`, borderRadius: "14px 18px 14px 18px", padding: "10px 14px", backdropFilter: "blur(20px)", boxShadow: `0 16px 46px -8px ${color}35` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
          <TechIcon name={name} color={color} size={13} />
          <span style={{ color: INK, fontSize: 10.5, fontWeight: 700, fontFamily: "'Space Grotesk', monospace" }}>{name}</span>
        </div>
        <p style={{ color: MUTED, fontSize: 10, lineHeight: 1.6, margin: 0, fontFamily: "'Outfit', sans-serif" }}>{description}</p>
      </div>
    </div>,
    document.body
  );
}

/* ── Tech Pill (seed pod) ── */
function Pill({ item, color, delay = 0, seen, seed = 0 }) {
  const [hov, setHov] = useState(false);
  const ref = useRef(null);
  return (
    <>
      <div
        ref={ref}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        tabIndex={0}
        onFocus={() => setHov(true)}
        onBlur={() => setHov(false)}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "5px 12px 5px 6px", borderRadius: 999,
          border: `1px solid ${hov ? color + "85" : "rgba(255,255,255,0.09)"}`,
          background: hov ? `color-mix(in srgb, ${color} 14%, #08150f)` : "rgba(255,255,255,0.035)",
          cursor: "default", userSelect: "none",
          boxShadow: hov ? `0 0 18px -3px ${color}65` : "none",
          opacity: seen ? 1 : 0,
          transform: seen ? (hov ? "translateY(-2px) scale(1.04)" : "none") : "translateY(8px)",
          transition: `opacity .5s ease ${delay}s, transform .5s cubic-bezier(.22,1,.36,1) ${delay}s, border-color .2s, background .2s, box-shadow .2s`,
        }}
      >
        <span style={{ display: "inline-flex", transition: "transform .3s cubic-bezier(.34,1.56,.64,1)", transform: hov ? "scale(1.14) rotate(-6deg)" : "none" }}>
          <TechIcon name={item.name} color={color} seed={seed} />
        </span>
        <span style={{ fontSize: 11, fontFamily: "'Space Grotesk', monospace", color: hov ? INK : MUTED, whiteSpace: "nowrap", transition: "color .2s" }}>{item.name}</span>
      </div>
      <PortalTooltip anchorRef={ref} color={color} name={item.name} description={item.description} visible={hov} />
    </>
  );
}

/* ── Grove Cell (formerly "bento") ── */
function GroveCell({ categoryKey, label, color, icon, span, delay = 0, accent2, radiusSeed = 0 }) {
  const [hov, setHov] = useState(false);
  const ref = useRef(null);
  const seen = useInView(ref, "-30px");
  const items = TECH_STACK[categoryKey] || [];
  const radius = BLOB_RADII[radiusSeed % BLOB_RADII.length];

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        gridColumn: `span ${span}`,
        position: "relative",
        borderRadius: 22,
        border: `1px solid ${hov ? color + "50" : "rgba(255,255,255,0.07)"}`,
        background: "linear-gradient(160deg, rgba(9,20,15,0.94) 0%, rgba(7,16,12,0.82) 100%)",
        backdropFilter: "blur(20px)",
        padding: "1.4rem 1.5rem",
        overflow: "hidden",
        opacity: seen ? 1 : 0,
        transform: seen ? (hov ? "translateY(-4px) scale(1.012)" : "none") : "translateY(24px) scale(0.98)",
        boxShadow: hov
          ? `0 0 0 1px ${color}22, 0 26px 64px -18px ${color}40, inset 0 1px 0 rgba(255,255,255,0.05)`
          : `0 4px 24px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.03)`,
        transition: `opacity .65s cubic-bezier(.22,1,.36,1) ${delay}s, transform .65s cubic-bezier(.22,1,.36,1) ${delay}s, border-color .25s, box-shadow .25s`,
      }}
    >
      {/* Organic mesh glow, like light through leaves */}
      <div style={{ position: "absolute", inset: 0, borderRadius: 22, pointerEvents: "none", background: `radial-gradient(ellipse at 8% 6%, ${color}16 0%, transparent 58%), radial-gradient(ellipse at 92% 94%, ${accent2 || color}0c 0%, transparent 58%)`, opacity: hov ? 1 : 0.55, transition: "opacity .4s ease" }} />
      {/* A single root-thread tracing the top edge */}
      <svg width="100%" height="10" style={{ position: "absolute", top: -1, left: 0, opacity: hov ? 0.9 : 0.45, transition: "opacity .3s" }} viewBox="0 0 200 10" preserveAspectRatio="none">
        <path d="M0,6 Q50,0 100,6 T200,6" fill="none" stroke={color} strokeWidth="1" opacity="0.6" />
      </svg>

      <div style={{ position: "relative", zIndex: 1, height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: radius,
              background: `color-mix(in srgb, ${color} 20%, #08150f)`,
              border: `1px solid ${color}55`,
              boxShadow: `0 0 18px ${color}30`,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              fontSize: 16, transition: "transform .35s cubic-bezier(.34,1.56,.64,1), border-radius .5s ease",
              transform: hov ? "scale(1.15) rotate(-8deg)" : "none",
            }}>
              {icon}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, fontFamily: "'Fraunces', serif", fontStyle: "italic", color: INK, lineHeight: 1.15 }}>{label}</h3>
              <span style={{ fontSize: 9, fontFamily: "'Space Grotesk', monospace", color, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.8 }}>{categoryKey}</span>
            </div>
          </div>
          <div style={{ fontSize: 10, fontFamily: "'Space Grotesk', monospace", color, background: `${color}16`, border: `1px solid ${color}35`, borderRadius: 999, padding: "2px 9px" }}>
            {items.length}
          </div>
        </div>
        {/* Divider — a thin vine, not a hairline */}
        <svg width="100%" height="6" viewBox="0 0 300 6" preserveAspectRatio="none" style={{ marginBottom: "0.85rem", flexShrink: 0, opacity: 0.7 }}>
          <path d="M0,3 Q75,0 150,3 T300,3" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
        </svg>
        {/* Pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, flex: 1, alignContent: "flex-start" }}>
          {items.map((item, i) => (
            <Pill key={item.name} item={item} color={color} seen={seen} delay={0.08 + i * 0.055} seed={i} />
          ))}
        </div>
      </div>

      {/* BG letter, softened */}
      <div style={{ position: "absolute", bottom: "0.7rem", right: "1rem", fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: "4.6rem", fontWeight: 600, color: hov ? `${color}14` : `${color}09`, lineHeight: 1, userSelect: "none", pointerEvents: "none", transition: "color .3s" }}>
        {label[0]}
      </div>
    </div>
  );
}

/* ── Canopy banner: roots feed the trunk, the trunk feeds the canopy ── */
function CanopyBanner({ delay = 0 }) {
  const ref = useRef(null);
  const seen = useInView(ref, "-30px");
  const [hov, setHov] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        gridColumn: "span 12",
        borderRadius: 24,
        border: "1px solid rgba(255,255,255,0.07)",
        background: "linear-gradient(120deg, rgba(52,211,153,0.07) 0%, rgba(34,211,238,0.06) 45%, rgba(251,191,36,0.05) 100%)",
        backdropFilter: "blur(20px)",
        padding: "1.3rem 2rem",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap",
        boxShadow: hov
          ? "0 0 0 1px rgba(34,211,238,0.18), 0 22px 54px -18px rgba(52,211,153,0.28)"
          : "0 4px 24px rgba(0,0,0,0.32)",
        opacity: seen ? 1 : 0,
        transform: seen ? "none" : "translateY(20px)",
        transition: `opacity .65s ease ${delay}s, transform .65s cubic-bezier(.22,1,.36,1) ${delay}s, box-shadow .25s`,
      }}
    >
      <div style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.5rem, 3vw, 2.1rem)", fontWeight: 600, color: INK, letterSpacing: "-0.01em", lineHeight: 1 }}>
        Full-Stack,{" "}
        <span style={{ fontStyle: "italic", background: "linear-gradient(90deg, #34d399, #22d3ee, #fbbf24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
          root to canopy.
        </span>
      </div>
      <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
        {[["🌱", "#34d399", "Frontend"], ["🌳", "#22d3ee", "Backend"], ["🍄", "#a78bfa", "Data"], ["✨", "#fbbf24", "AI & Web3"]].map(([ic, col, lbl]) => (
          <div key={lbl} style={{ display: "flex", alignItems: "center", gap: 5, background: `${col}15`, border: `1px solid ${col}35`, borderRadius: 999, padding: "5px 12px" }}>
            <span style={{ fontSize: 13 }}>{ic}</span>
            <span style={{ fontSize: 10, fontFamily: "'Space Grotesk', monospace", color: col, letterSpacing: "0.1em" }}>{lbl}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main Export ── */
export default function TechStack() {
  const headerRef = useRef(null);
  const headerSeen = useInView(headerRef, "-40px");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500;1,9..144,600&family=Space+Grotesk:wght@400;500;700&family=Outfit:wght@300;400;500;600&display=swap');

        @keyframes sproutIn {
          from { opacity:0; transform:translateX(-50%) translateY(5px) scale(0.96); }
          to   { opacity:1; transform:translateX(-50%) translateY(0) scale(1); }
        }
        @keyframes blobDrift {
          0%,100% { transform: translateY(0) scale(1); border-radius: 42% 58% 63% 37% / 41% 44% 56% 59%; }
          33%     { transform: translateY(-18px) scale(1.05); border-radius: 58% 42% 39% 61% / 55% 38% 62% 45%; }
          66%     { transform: translateY(10px) scale(0.97); border-radius: 38% 62% 55% 45% / 46% 60% 40% 54%; }
        }
        @keyframes driftUp {
          0%   { transform: translateY(0) translateX(0); opacity: 0; }
          10%  { opacity: 0.7; }
          90%  { opacity: 0.4; }
          100% { transform: translateY(-140px) translateX(14px); opacity: 0; }
        }
        @keyframes vineDraw {
          from { stroke-dashoffset: 1400; }
          to   { stroke-dashoffset: 0; }
        }

        .ts-grove-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 0.8rem;
        }

        @media (max-width: 1024px) {
          .ts-grove-grid > * { grid-column: span 6 !important; }
          .ts-grove-grid > *:first-child { grid-column: span 12 !important; }
        }
        @media (max-width: 600px) {
          .ts-grove-grid > * { grid-column: span 12 !important; }
        }

        .ts-spore {
          position: absolute; width: 3px; height: 3px; border-radius: 50%;
          animation: driftUp linear infinite;
          pointer-events: none;
        }
      `}</style>

      <section
        id="stack"
        style={{ position: "relative", overflow: "hidden", fontFamily: "'Outfit', sans-serif"}}
        className="reveal-section section-y page-x"
      >
        {/* Organic ambient blobs — moss / bioluminescent / spore */}
        <div style={{ position: "absolute", top: "-12%", right: "-6%", width: 560, height: 560, background: "radial-gradient(circle, rgba(52,211,153,.08) 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none", animation: "blobDrift 12s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: "-6%", left: "-6%", width: 480, height: 480, background: "radial-gradient(circle, rgba(34,211,238,.06) 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none", animation: "blobDrift 15s ease-in-out infinite 3s" }} />
        <div style={{ position: "absolute", top: "38%", left: "42%", width: 380, height: 380, background: "radial-gradient(circle, rgba(251,191,36,.05) 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none", animation: "blobDrift 9s ease-in-out infinite 1s" }} />

        {/* Drifting spores, like fireflies rising through a canopy */}
        {[
          { l: "8%", d: "0s", dur: "9s", c: "#34d399" },
          { l: "22%", d: "2s", dur: "11s", c: "#22d3ee" },
          { l: "48%", d: "1s", dur: "8s", c: "#fbbf24" },
          { l: "67%", d: "3.5s", dur: "12s", c: "#a78bfa" },
          { l: "84%", d: "0.5s", dur: "10s", c: "#34d399" },
        ].map((s, i) => (
          <span key={i} className="ts-spore" style={{ left: s.l, bottom: "6%", background: s.c, boxShadow: `0 0 6px 1px ${s.c}`, animationDelay: s.d, animationDuration: s.dur }} />
        ))}

        {/* Fine grain, like light dust in still air */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

        <div className="container-6xl">
          <div
            ref={headerRef}
            style={{ opacity: headerSeen ? 1 : 0, transform: headerSeen ? "none" : "translateY(20px)", transition: "opacity .7s cubic-bezier(.22,1,.36,1), transform .7s cubic-bezier(.22,1,.36,1)", marginBottom: "0.6rem" }}
          >
            <SectionHeader
              align="center"
              label="stack"
              title={
                <>
                  Tech{" "}
                  <span style={{ display: "inline-block", fontStyle: "italic", backgroundImage: "linear-gradient(135deg,#34d399 0%,#22d3ee 60%)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent" }}>
                    Stack.
                  </span>
                </>
              }
              subtitle="Tools I grow with."
            />
          </div>

          {/* Signature: a single winding vine, drawn once the section comes into view —
              roots below the fold, canopy above; everything else grows from this line. */}
          <svg width="100%" height="46" viewBox="0 0 1200 46" preserveAspectRatio="none" style={{ display: "block", marginBottom: "1.6rem", overflow: "visible" }}>
            <path
              d="M0,23 C120,2 200,44 340,23 C480,2 560,44 700,23 C840,2 920,44 1060,23 C1140,10 1170,30 1200,23"
              fill="none" stroke="url(#vineGrad)" strokeWidth="1.4" strokeLinecap="round"
              strokeDasharray="1400" strokeDashoffset={headerSeen ? 0 : 1400}
              style={{ transition: "stroke-dashoffset 1.6s cubic-bezier(.22,1,.36,1) .3s" }}
            />
            <defs>
              <linearGradient id="vineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="50%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
            </defs>
            {[[340, 23, "#34d399"], [700, 23, "#22d3ee"], [1060, 23, "#fbbf24"]].map(([cx, cy, c], i) => (
              <circle key={i} cx={cx} cy={cy} r="3.5" fill={c} opacity={headerSeen ? 0.9 : 0} style={{ transition: `opacity .4s ease ${0.9 + i * 0.15}s` }} />
            ))}
          </svg>

          {/* ── Grove Grid ──
              Row 1: canopy banner (12)
              Row 2: languages(4) + frontend(5) + backend(3) = 12
              Row 3: database(3) + devtools(5) + other(4) = 12
          */}
          <div className="ts-grove-grid">
            <CanopyBanner delay={0} />

            <GroveCell categoryKey="languages" label="Languages" color="#34d399" accent2="#6ee7b7" icon="🌱" span={4} delay={0.1} radiusSeed={0} />
            <GroveCell categoryKey="frontend"  label="Frontend"  color="#22d3ee" accent2="#67e8f9" icon="✦"  span={5} delay={0.16} radiusSeed={1} />
            <GroveCell categoryKey="backend"   label="Backend"   color="#a78bfa" accent2="#c4b5fd" icon="⚙"  span={3} delay={0.22} radiusSeed={2} />

            <GroveCell categoryKey="database"  label="Database"  color="#fbbf24" accent2="#fde68a" icon="🗄" span={3} delay={0.28} radiusSeed={3} />
            <GroveCell categoryKey="devtools"  label="Dev Tools" color="#fb7185" accent2="#fda4af" icon="⚒" span={5} delay={0.34} radiusSeed={1} />
            <GroveCell categoryKey="other"     label="AI & More" color="#a3e635" accent2="#d9f99d" icon="✨" span={4} delay={0.4} radiusSeed={2} />
          </div>

          <div style={{ marginTop: "3.5rem", height: 1, background: "linear-gradient(90deg,transparent,rgba(52,211,153,.28),rgba(34,211,238,.28),transparent)", opacity: headerSeen ? 1 : 0, transition: "opacity .65s ease .7s" }} />
        </div>
      </section>
    </>
  );
}