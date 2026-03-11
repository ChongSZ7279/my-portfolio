import { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { TECH_STACK } from "./data/techStack";
import { getTechLogo } from "./data/techStack";
import SectionHeader from "./components/SectionHeader";

/* ─────────────────────────────────────────────────────────────
   INTERSECTION OBSERVER HOOK — fires once when element enters view
───────────────────────────────────────────────────────────── */
function useInView(ref, margin = "-60px") {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setSeen(true); obs.disconnect(); } },
      { rootMargin: margin, threshold: 0.08 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return seen;
}

/* ─────────────────────────────────────────────────────────────
   PORTAL TOOLTIP
───────────────────────────────────────────────────────────── */
function PortalTooltip({ anchorRef, color, name, description, visible }) {
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!visible || !anchorRef.current) return;
    const update = () => {
      const r = anchorRef.current.getBoundingClientRect();
      setPos({
        top:  r.bottom + window.scrollY + 10,
        left: r.left   + window.scrollX + r.width / 2,
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [visible, anchorRef]);

  if (!visible) return null;

  return ReactDOM.createPortal(
    <div style={{
      position:      "absolute",
      top:           pos.top,
      left:          pos.left,
      transform:     "translateX(-50%)",
      zIndex:        99999,
      width:         224,
      pointerEvents: "none",
      animation:     "ts-tooltip-in 0.18s ease forwards",
    }}>
      <div style={{
        width: 10, height: 10,
        background: "#0a1628",
        border: `1px solid ${color}50`,
        borderBottom: "none", borderRight: "none",
        transform: "rotate(45deg)",
        margin: "0 auto -5px",
        position: "relative", zIndex: 1,
      }} />
      <div style={{
        background:     "rgba(9,18,40,0.98)",
        border:         `1px solid ${color}45`,
        borderRadius:   14,
        padding:        "10px 14px",
        backdropFilter: "blur(16px)",
        boxShadow:      `0 12px 40px -8px ${color}35, 0 0 0 1px ${color}12`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
          <img src={getTechLogo(name)} alt="" style={{ width: 14, height: 14, objectFit: "contain", flexShrink: 0 }} />
          <span style={{ color: "#f1f5f9", fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
            {name}
          </span>
        </div>
        <p style={{ color: "#94a3b8", fontSize: 10.5, lineHeight: 1.55, fontFamily: "'Outfit', sans-serif", margin: 0 }}>
          {description}
        </p>
      </div>
    </div>,
    document.body
  );
}

/* ─────────────────────────────────────────────────────────────
   SINGLE TECH BADGE — with stagger-in animation
───────────────────────────────────────────────────────────── */
function TechBadge({ item, color, animDelay = 0, cardSeen }) {
  const [hovered, setHovered] = useState(false);
  const [iconErr, setIconErr]   = useState(false);
  const ref = useRef(null);

  return (
    <>
      <div
        ref={ref}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display:      "inline-flex",
          alignItems:   "center",
          gap:          7,
          padding:      "6px 12px",
          borderRadius: 999,
          border:       `1px solid ${hovered ? color + "70" : "rgba(148,163,184,0.22)"}`,
          background:   hovered
            ? `color-mix(in srgb, ${color} 9%, rgb(15 23 42))`
            : "rgba(15,23,42,0.85)",
          boxShadow:    hovered ? `0 0 12px -2px ${color}55` : "none",
          cursor:       "default",
          userSelect:   "none",
          transition:   "border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease, opacity 0.5s ease, transform 0.5s cubic-bezier(.22,1,.36,1)",
          /* stagger pop-in */
          opacity:      cardSeen ? 1 : 0,
          transform:    cardSeen
            ? (hovered ? "translateY(-2px) scale(1.03)" : "translateY(0) scale(1)")
            : "translateY(10px) scale(0.94)",
          transitionDelay: cardSeen ? `${animDelay}s` : "0s",
        }}
      >
        {!iconErr && (
          <img
            src={getTechLogo(item.name)}
            alt={item.name}
            onError={() => setIconErr(true)}
            style={{
              width: 16, height: 16, objectFit: "contain", flexShrink: 0,
              transform:  hovered ? "scale(1.18) rotate(-5deg)" : "scale(1) rotate(0deg)",
              transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1)",
              filter:     hovered ? `drop-shadow(0 0 4px ${color}90)` : "none",
            }}
          />
        )}
        <span style={{
          fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
          color: hovered ? "#f1f5f9" : "#cbd5e1",
          lineHeight: 1, transition: "color 0.2s ease", whiteSpace: "nowrap",
        }}>
          {item.name}
        </span>
      </div>

      <PortalTooltip anchorRef={ref} color={color} name={item.name} description={item.description} visible={hovered} />
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   CATEGORY CARD — slides in on scroll, badges stagger after
───────────────────────────────────────────────────────────── */
function CategoryCard({ categoryKey, label, color, cardDelay = 0 }) {
  const [hovered, setHovered] = useState(false);
  const cardRef  = useRef(null);
  const cardSeen = useInView(cardRef, "-40px");

  return (
    <div
      className="ts-card"
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position:       "relative",
        borderRadius:   18,
        border:         `1px solid ${hovered ? color + "65" : "rgba(148,163,184,0.18)"}`,
        background:     "rgba(9,18,40,0.6)",
        backdropFilter: "blur(14px)",
        padding:        "22px 22px 22px",
        overflow:       "visible",
        /* card slide-up */
        opacity:    cardSeen ? 1 : 0,
        transform:  cardSeen
          ? (hovered ? "translateY(-5px)" : "translateY(0)")
          : "translateY(32px)",
        boxShadow:  hovered ? `0 20px 60px -18px ${color}50` : "none",
        transition: `opacity 0.6s cubic-bezier(.22,1,.36,1) ${cardDelay}s,
                     transform 0.6s cubic-bezier(.22,1,.36,1) ${cardDelay}s,
                     border-color 0.25s ease,
                     box-shadow 0.25s ease`,
      }}
    >
      {/* Radial glow overlay */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: 18,
        background: `radial-gradient(circle at top, ${color}12 0%, transparent 60%)`,
        opacity: hovered ? 1 : 0, pointerEvents: "none",
        transition: "opacity 0.5s ease",
      }} />

      {/* ── Category header ── */}
      <div style={{ position: "relative", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 11,
            background: "rgba(15,23,42,0.9)",
            border: `1px solid ${color}60`,
            boxShadow: `0 0 14px ${color}28`,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <span style={{ fontSize: 13, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", color }}>
              {label[0]}
            </span>
          </div>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f8fafc", fontFamily: "'Syne', sans-serif", margin: 0, lineHeight: 1.2 }}>
              {label}
            </h3>
            <p style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color, textTransform: "uppercase", letterSpacing: "0.28em", margin: "3px 0 0" }}>
              {categoryKey}
            </p>
          </div>
        </div>
        <div style={{ height: 1, background: `linear-gradient(90deg, ${color}55, transparent)`, borderRadius: 1 }} />
      </div>

      {/* ── Badges with staggered pop-in ── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, position: "relative" }}>
        {TECH_STACK[categoryKey].map((item, i) => (
          <TechBadge
            key={item.name}
            item={item}
            color={color}
            cardSeen={cardSeen}
            animDelay={0.1 + i * 0.06}
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────────────────────── */
export default function TechStack() {
  const headerRef  = useRef(null);
  const headerSeen = useInView(headerRef, "-40px");

  const CATEGORIES = [
    { key: "languages", label: "Languages",               color: "#06b6d4" },
    { key: "frontend",  label: "Frontend",                color: "#818cf8" },
    { key: "backend",   label: "Backend",                 color: "#8b5cf6" },
    { key: "database",  label: "Database",                color: "#22c55e" },
    { key: "devtools",  label: "Dev Tools",               color: "#f97316" },
    { key: "other",     label: "AI, Blockchain & Hardware", color: "#f59e0b" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=JetBrains+Mono:wght@400;500;700&family=Outfit:wght@300;400;500;600&display=swap');

        @keyframes ts-tooltip-in {
          from { opacity: 0; transform: translateX(-50%) translateY(4px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0);   }
        }

        .ts-grid-bg {
          background-image:
            linear-gradient(rgba(6,182,212,.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,.018) 1px, transparent 1px);
          background-size: 56px 56px;
        }

        @keyframes ts-glow { 0%,100%{opacity:.3} 50%{opacity:.7} }

        /* TechStack card grid: center last row on large screens */
        .ts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 24px;
          justify-content: center;
        }

        @media (min-width: 1024px) {
          .ts-grid {
            grid-template-columns: repeat(4, minmax(260px, 1fr));
          }
          .ts-grid .ts-card:nth-child(5) { grid-column: 2; }
          .ts-grid .ts-card:nth-child(6) { grid-column: 3; }
        }
      `}</style>

      <section
        id="stack"
        className="reveal-section section-y page-x"
        style={{ position: "relative", fontFamily: "'Outfit', sans-serif", overflow: "hidden" }}
      >
        {/* Subtle grid background */}
        <div className="ts-grid-bg" style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />

        {/* Ambient glows — mirroring AboutMe */}
        <div style={{ position:"absolute", top:"5%", right:"-8%", width:480, height:480, borderRadius:"50%", background:"radial-gradient(circle,rgba(129,140,248,.07),transparent 70%)", filter:"blur(55px)", pointerEvents:"none", animation:"ts-glow 7s ease-in-out infinite" }} />
        <div style={{ position:"absolute", bottom:"5%", left:"-8%", width:360, height:360, borderRadius:"50%", background:"radial-gradient(circle,rgba(6,182,212,.05),transparent 70%)", filter:"blur(55px)", pointerEvents:"none", animation:"ts-glow 9s ease-in-out infinite 2s" }} />

        <div className="container-6xl">

          {/* ── Section header — same component, same style as AboutMe ── */}
          <div
            ref={headerRef}
            style={{
              opacity:    headerSeen ? 1 : 0,
              transform:  headerSeen ? "none" : "translateY(24px)",
              transition: "opacity .65s cubic-bezier(.22,1,.36,1), transform .65s cubic-bezier(.22,1,.36,1)",
            }}
          >
            <SectionHeader
              align="center"
              label="stack"
              title={
                <>
                  Tech{" "}
                  <span style={{
                    background: "linear-gradient(135deg,#06b6d4 0%,#818cf8 60%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}>
                    Stack.
                  </span>
                </>
              }
              subtitle="The tools I use to design, build, and ship scalable systems — from frontend to backend, AI, and Web3."
            />
          </div>

          {/* ── Responsive card grid ── */}
          <div className="ts-grid">
            {CATEGORIES.map(({ key, label, color }, i) => (
              <CategoryCard
                key={key}
                categoryKey={key}
                label={label}
                color={color}
                cardDelay={i * 0.08}
              />
            ))}
          </div>

          {/* Divider — same as AboutMe */}
          <div style={{
            marginTop: 72, height: 1,
            background: "linear-gradient(90deg,transparent,rgba(99,102,241,.28),rgba(6,182,212,.28),transparent)",
            opacity: headerSeen ? 1 : 0,
            transition: "opacity .65s cubic-bezier(.22,1,.36,1) .6s",
          }} />
        </div>
      </section>
    </>
  );
}