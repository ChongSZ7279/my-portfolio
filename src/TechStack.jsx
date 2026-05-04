import { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { TECH_STACK } from "./data/techStack";
import { getTechLogo } from "./data/techStack";
import SectionHeader from "./components/SectionHeader";

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
    <div style={{ position: "absolute", top: pos.top, left: pos.left, transform: "translateX(-50%)", zIndex: 99999, width: 210, pointerEvents: "none", animation: "tipIn 0.16s ease forwards" }}>
      <div style={{ width: 8, height: 8, background: "#070e1f", border: `1px solid ${color}50`, borderBottom: "none", borderRight: "none", transform: "rotate(45deg)", margin: "0 auto -4px", position: "relative", zIndex: 1 }} />
      <div style={{ background: "rgba(7,14,31,0.97)", border: `1px solid ${color}40`, borderRadius: 12, padding: "9px 13px", backdropFilter: "blur(20px)", boxShadow: `0 14px 44px -6px ${color}30` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
          <img src={getTechLogo(name)} alt="" style={{ width: 13, height: 13, objectFit: "contain" }} />
          <span style={{ color: "#f1f5f9", fontSize: 10.5, fontWeight: 700, fontFamily: "'Space Mono', monospace" }}>{name}</span>
        </div>
        <p style={{ color: "#94a3b8", fontSize: 10, lineHeight: 1.55, margin: 0, fontFamily: "'Outfit', sans-serif" }}>{description}</p>
      </div>
    </div>,
    document.body
  );
}

/* ── Tech Pill ── */
function Pill({ item, color, delay = 0, seen }) {
  const [hov, setHov] = useState(false);
  const ref = useRef(null);
  return (
    <>
      <div
        ref={ref}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "5px 11px", borderRadius: 999,
          border: `1px solid ${hov ? color + "80" : "rgba(255,255,255,0.1)"}`,
          background: hov ? `color-mix(in srgb, ${color} 12%, #07111f)` : "rgba(255,255,255,0.04)",
          cursor: "default", userSelect: "none",
          boxShadow: hov ? `0 0 16px -3px ${color}60` : "none",
          opacity: seen ? 1 : 0,
          transform: seen ? (hov ? "translateY(-2px) scale(1.04)" : "none") : "translateY(8px)",
          transition: `opacity .5s ease ${delay}s, transform .5s cubic-bezier(.22,1,.36,1) ${delay}s, border-color .2s, background .2s, box-shadow .2s`,
        }}
      >
        <img
          src={getTechLogo(item.name)} alt={item.name}
          style={{ width: 14, height: 14, objectFit: "contain", flexShrink: 0, transition: "transform .25s cubic-bezier(.34,1.56,.64,1), filter .25s", transform: hov ? "scale(1.2) rotate(-6deg)" : "none", filter: hov ? `drop-shadow(0 0 4px ${color}90)` : "none" }}
        />
        <span style={{ fontSize: 11, fontFamily: "'Space Mono', monospace", color: hov ? "#f1f5f9" : "#94a3b8", whiteSpace: "nowrap", transition: "color .2s" }}>{item.name}</span>
      </div>
      <PortalTooltip anchorRef={ref} color={color} name={item.name} description={item.description} visible={hov} />
    </>
  );
}

/* ── Bento Cell ── */
function BentoCell({ categoryKey, label, color, icon, span, delay = 0, accent2 }) {
  const [hov, setHov] = useState(false);
  const ref = useRef(null);
  const seen = useInView(ref, "-30px");
  const items = TECH_STACK[categoryKey] || [];

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        gridColumn: `span ${span}`,
        position: "relative",
        borderRadius: 20,
        border: `1px solid ${hov ? color + "55" : "rgba(255,255,255,0.08)"}`,
        background: "linear-gradient(135deg, rgba(7,14,31,0.95) 0%, rgba(7,14,31,0.80) 100%)",
        backdropFilter: "blur(20px)",
        padding: "1.4rem 1.5rem",
        overflow: "hidden",
        opacity: seen ? 1 : 0,
        transform: seen ? (hov ? "translateY(-4px) scale(1.012)" : "none") : "translateY(24px) scale(0.98)",
        boxShadow: hov
          ? `0 0 0 1px ${color}25, 0 24px 60px -16px ${color}45, inset 0 1px 0 rgba(255,255,255,0.06)`
          : `0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)`,
        transition: `opacity .65s cubic-bezier(.22,1,.36,1) ${delay}s, transform .65s cubic-bezier(.22,1,.36,1) ${delay}s, border-color .25s, box-shadow .25s`,
      }}
    >
      {/* Mesh gradient */}
      <div style={{ position: "absolute", inset: 0, borderRadius: 20, pointerEvents: "none", background: `radial-gradient(ellipse at 10% 10%, ${color}14 0%, transparent 55%), radial-gradient(ellipse at 90% 90%, ${accent2 || color}0a 0%, transparent 55%)`, opacity: hov ? 1 : 0.5, transition: "opacity .4s ease" }} />
      {/* Shine top */}
      <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: `linear-gradient(90deg, transparent, ${color}40, transparent)`, pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1, height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: `color-mix(in srgb, ${color} 18%, #07111f)`,
              border: `1px solid ${color}50`,
              boxShadow: `0 0 18px ${color}30`,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              fontSize: 16, transition: "transform .3s cubic-bezier(.34,1.56,.64,1)",
              transform: hov ? "scale(1.15) rotate(-8deg)" : "none",
            }}>
              {icon}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 13, fontWeight: 800, fontFamily: "'Syne', sans-serif", color: "#f8fafc", lineHeight: 1.1 }}>{label}</h3>
              <span style={{ fontSize: 9, fontFamily: "'Space Mono', monospace", color, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.8 }}>{categoryKey}</span>
            </div>
          </div>
          <div style={{ fontSize: 10, fontFamily: "'Space Mono', monospace", color, background: `${color}15`, border: `1px solid ${color}30`, borderRadius: 999, padding: "2px 8px" }}>
            {items.length}
          </div>
        </div>
        {/* Divider */}
        <div style={{ height: 1, background: `linear-gradient(90deg, ${color}40, transparent)`, marginBottom: "0.9rem", flexShrink: 0 }} />
        {/* Pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, flex: 1, alignContent: "flex-start" }}>
          {items.map((item, i) => (
            <Pill key={item.name} item={item} color={color} seen={seen} delay={0.08 + i * 0.055} />
          ))}
        </div>
      </div>

      {/* BG letter */}
      <div style={{ position: "absolute", bottom: "0.8rem", right: "1rem", fontFamily: "'Syne', sans-serif", fontSize: "4.5rem", fontWeight: 900, color: hov ? `${color}12` : `${color}08`, lineHeight: 1, userSelect: "none", pointerEvents: "none", transition: "color .3s" }}>
        {label[0]}
      </div>
    </div>
  );
}

/* ── Wide Banner Cell ── */
function BannerCell({ delay = 0 }) {
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
        borderRadius: 20,
        border: "1px solid rgba(255,255,255,0.08)",
        background: "linear-gradient(135deg, rgba(6,182,212,0.06) 0%, rgba(129,140,248,0.06) 50%, rgba(251,146,60,0.05) 100%)",
        backdropFilter: "blur(20px)",
        padding: "1.2rem 2rem",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap",
        boxShadow: hov
          ? "0 0 0 1px rgba(129,140,248,0.2), 0 20px 50px -16px rgba(129,140,248,0.3)"
          : "0 4px 24px rgba(0,0,0,0.3)",
        opacity: seen ? 1 : 0,
        transform: seen ? "none" : "translateY(20px)",
        transition: `opacity .65s ease ${delay}s, transform .65s cubic-bezier(.22,1,.36,1) ${delay}s, box-shadow .25s`,
      }}
    >
      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 900, color: "#f8fafc", letterSpacing: "-0.04em", lineHeight: 1 }}>
        Full-Stack{" "}
        <span style={{ background: "linear-gradient(90deg, #06b6d4, #818cf8, #fb923c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
          Developer.
        </span>
      </div>
      <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
        {[["⚡", "#06b6d4", "Frontend"], ["🔩", "#818cf8", "Backend"], ["🗄️", "#22c55e", "Data"], ["🧠", "#f59e0b", "AI & Web3"]].map(([ic, col, lbl]) => (
          <div key={lbl} style={{ display: "flex", alignItems: "center", gap: 5, background: `${col}15`, border: `1px solid ${col}35`, borderRadius: 999, padding: "5px 12px" }}>
            <span style={{ fontSize: 13 }}>{ic}</span>
            <span style={{ fontSize: 10, fontFamily: "'Space Mono', monospace", color: col, letterSpacing: "0.1em" }}>{lbl}</span>
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
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Space+Mono:wght@400;700&family=Outfit:wght@300;400;500;600&display=swap');

        @keyframes tipIn {
          from { opacity:0; transform:translateX(-50%) translateY(5px); }
          to   { opacity:1; transform:translateX(-50%) translateY(0); }
        }
        @keyframes bgFloat {
          0%,100% { transform: translateY(0) scale(1); }
          50%      { transform: translateY(-20px) scale(1.04); }
        }

        .ts-bento-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 0.8rem;
        }

        @media (max-width: 1024px) {
          .ts-bento-grid > * { grid-column: span 6 !important; }
          .ts-bento-grid > *:first-child { grid-column: span 12 !important; }
        }
        @media (max-width: 600px) {
          .ts-bento-grid > * { grid-column: span 12 !important; }
        }
      `}</style>

      <section
        id="stack"
        style={{ position: "relative", overflow: "hidden", fontFamily: "'Outfit', sans-serif" }}
        className="reveal-section section-y page-x"
      >
        {/* Ambient blobs */}
        <div style={{ position: "absolute", top: "-10%", right: "-5%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(129,140,248,.07) 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none", animation: "bgFloat 10s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: "-5%", left: "-5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,.05) 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none", animation: "bgFloat 13s ease-in-out infinite 3s" }} />
        <div style={{ position: "absolute", top: "40%", left: "40%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(251,146,60,.04) 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none", animation: "bgFloat 8s ease-in-out infinite 1s" }} />
        {/* Dot grid */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

        <div className="container-6xl">
          <div
            ref={headerRef}
            style={{ opacity: headerSeen ? 1 : 0, transform: headerSeen ? "none" : "translateY(20px)", transition: "opacity .7s cubic-bezier(.22,1,.36,1), transform .7s cubic-bezier(.22,1,.36,1)", marginBottom: "1.8rem" }}
          >
            <SectionHeader
              align="center"
              label="stack"
              title={
                <>
                  Tech{" "}
                  <span style={{ background: "linear-gradient(135deg,#06b6d4 0%,#818cf8 60%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    Stack.
                  </span>
                </>
              }
              subtitle="Tools I ship with."
            />
          </div>

          {/* ── Bento Grid ──
              Row 1: Banner (12)
              Row 2: languages(4) + frontend(5) + backend(3) = 12
              Row 3: database(3) + devtools(5) + other(4) = 12
          */}
          <div className="ts-bento-grid">
            {/* <BannerCell delay={0} /> */}

            <BentoCell categoryKey="languages" label="Languages" color="#06b6d4" accent2="#22d3ee" icon="<>" span={4} delay={0.08} />
            <BentoCell categoryKey="frontend"  label="Frontend"  color="#818cf8" accent2="#a5b4fc" icon="✦"  span={5} delay={0.14} />
            <BentoCell categoryKey="backend"   label="Backend"   color="#8b5cf6" accent2="#c4b5fd" icon="⚙"  span={3} delay={0.20} />

            <BentoCell categoryKey="database"  label="Database"  color="#22c55e" accent2="#4ade80" icon="🗄" span={3} delay={0.26} />
            <BentoCell categoryKey="devtools"  label="Dev Tools" color="#f97316" accent2="#fb923c" icon="⚒" span={5} delay={0.32} />
            <BentoCell categoryKey="other"     label="AI & More" color="#f59e0b" accent2="#fcd34d" icon="🧠" span={4} delay={0.38} />
          </div>

          <div style={{ marginTop: "3.5rem", height: 1, background: "linear-gradient(90deg,transparent,rgba(99,102,241,.3),rgba(6,182,212,.3),transparent)", opacity: headerSeen ? 1 : 0, transition: "opacity .65s ease .7s" }} />
        </div>
      </section>
    </>
  );
}