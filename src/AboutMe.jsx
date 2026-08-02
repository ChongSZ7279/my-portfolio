import { useState, useEffect, useRef } from "react";
import { ArrowRight, Cpu, Layers, GitBranch, Heart } from "lucide-react";
import MyPhoto from "./data/image/SiewZhen.png";
import SectionHeader from "./components/SectionHeader";

/* ──────────────────────────────────────────────────────────────
   Same "canopy & roots" system as TechStack — forest palette,
   organic blob shapes, Fraunces + Space Grotesk type.
   ────────────────────────────────────────────────────────────── */
const INK = "#eef5f0";
const MUTED = "#8fa79b";

const BLOB_RADII = [
  "42% 58% 63% 37% / 41% 44% 56% 59%",
  "58% 42% 39% 61% / 55% 38% 62% 45%",
  "38% 62% 55% 45% / 46% 60% 40% 54%",
  "63% 37% 45% 55% / 40% 55% 45% 60%",
];

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

// ─── Inline story card (a "leaf" of the story) ─────────────────────────────
const StoryCard = ({ index, label, color, radiusSeed = 0, children, style }) => (
  <div
    style={{
      position: "relative",
      padding: "22px 24px",
      borderRadius: 18,
      background: "linear-gradient(155deg, rgba(9,20,15,.94), rgba(7,16,12,.76))",
      border: `1px solid ${color}22`,
      overflow: "hidden",
      ...style,
    }}
  >
    {/* Left accent — a thin root, not a hard bar */}
    <svg width="4" height="calc(100% - 24px)" style={{ position: "absolute", left: 0, top: 12 }} viewBox="0 0 4 100" preserveAspectRatio="none">
      <path d="M2,0 Q0,25 2,50 T2,100" fill="none" stroke={color} strokeWidth="2.4" opacity="0.75" strokeLinecap="round" />
    </svg>
    {/* Index label */}
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
      <span style={{ fontSize: 9, fontFamily: "'Space Grotesk', monospace", color, textTransform: "uppercase", letterSpacing: "0.3em" }}>
        {String(index).padStart(2, "0")} · {label}
      </span>
    </div>
    <div style={{ fontSize: "clamp(13px, 1.3vw, 14px)", color: MUTED, lineHeight: 1.85, fontFamily: "'Outfit', sans-serif" }}>
      {children}
    </div>
    {/* Faint blob icon badge in the corner, echoes TechStack cells */}
    <div style={{ position: "absolute", bottom: -18, right: -14, width: 70, height: 70, borderRadius: BLOB_RADII[radiusSeed % BLOB_RADII.length], background: `${color}08`, pointerEvents: "none" }} />
  </div>
);

export default function AboutMe({ onExploreProjects }) {
  const root = useRef(null);
  const seen = useInView(root, "-40px");
  const [imgErr, setImgErr] = useState(false);

  const fade = (d = 0) => ({
    opacity: seen ? 1 : 0,
    transform: seen ? "none" : "translateY(22px)",
    transition: `opacity .65s cubic-bezier(.22,1,.36,1) ${d}s, transform .65s cubic-bezier(.22,1,.36,1) ${d}s`,
  });

  const fromLeft = (d = 0) => ({
    opacity: seen ? 1 : 0,
    transform: seen ? "none" : "translateX(-24px)",
    transition: `opacity .7s cubic-bezier(.22,1,.36,1) ${d}s, transform .7s cubic-bezier(.22,1,.36,1) ${d}s`,
  });

  const DOMAINS = [
    { Icon: Cpu,       label: "AI Systems",              color: "#22d3ee" },
    { Icon: Layers,    label: "Web Architecture",        color: "#a78bfa" },
    { Icon: GitBranch, label: "Blockchain Transparency", color: "#fbbf24" },
    { Icon: Heart,     label: "Human-Centered Design",   color: "#34d399" },
  ];

  const STORY_CARDS = [
    {
      index: 1,
      label: "Story",
      color: "#22d3ee",
      radiusSeed: 0,
      text: (
        <>
          I'm a final-year Software Engineering student at <span style={{ color: "#67e8f9", fontWeight: 600 }}>Universiti Teknologi Malaysia</span> with a passion for building scalable systems and solving real-world problems through technology.
        </>
      ),
    },
    {
      index: 2,
      label: "What I Build",
      color: "#a78bfa",
      radiusSeed: 1,
      text: (
        <>
          I build <span style={{ color: "#c4b5fd", fontWeight: 600 }}>production-ready applications</span> across AI, blockchain, and full-stack web development, focusing on systems that are practical, reliable, and impactful.
        </>
      ),
    },
    {
      index: 3,
      label: "How I Work",
      color: "#34d399",
      radiusSeed: 2,
      text: (
        <>
          I <span style={{ color: "#6ee7b7", fontWeight: 600 }}>learn by building</span> — through hackathons, robotics competitions, and collaborative projects where ideas quickly turn into working prototypes.
        </>
      ),
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500;1,9..144,600&family=Space+Grotesk:wght@400;500;700&family=Outfit:wght@300;400;500;600&display=swap');

        .ab-root { font-family:'Outfit',sans-serif; color:${INK}; box-sizing:border-box; }
        .ab-root * { box-sizing:border-box; }

        .ab-grain-bg {
          background-image: radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 28px 28px;
        }

        @keyframes ab-spin     { to { transform:rotate(360deg);  } }
        @keyframes ab-spin-r   { to { transform:rotate(-360deg); } }
        @keyframes ab-blob     { 0%,100%{ border-radius:42% 58% 63% 37% / 41% 44% 56% 59%; opacity:.4 } 50%{ border-radius:58% 42% 39% 61% / 55% 38% 62% 45%; opacity:.85 } }
        @keyframes ab-ping     { 0%{transform:scale(1);opacity:.7} 100%{transform:scale(2.4);opacity:0} }
        @keyframes ab-pulse    { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }
        @keyframes ab-drift    { 0%{transform:translateY(0);opacity:0} 10%{opacity:.7} 90%{opacity:.35} 100%{transform:translateY(-120px);opacity:0} }

        .ab-ring1  { animation: ab-spin   18s linear infinite; }
        .ab-ring2  { animation: ab-spin-r 12s linear infinite; }
        .ab-ping   { animation: ab-ping    2s ease-out infinite; }
        .ab-pulse  { animation: ab-pulse   2s ease-in-out infinite; }
        .ab-spore  { position:absolute; width:3px; height:3px; border-radius:50%; animation: ab-drift linear infinite; pointer-events:none; }

        .ab-dpill { transition: transform .22s ease, box-shadow .22s ease, border-radius .5s ease; }
        .ab-dpill:hover { transform: translateY(-3px) scale(1.04); }

        .ab-story-card { transition: border-color .28s ease, box-shadow .28s ease; }
        .ab-story-card:hover { box-shadow: 0 10px 34px -10px rgba(34,211,238,.15) !important; border-color: rgba(34,211,238,.2) !important; }

        .ab-cta { transition: all .22s ease; }
        .ab-cta:hover {
          background: rgba(52,211,153,.16) !important;
          border-color: rgba(52,211,153,.65) !important;
          color: #6ee7b7 !important;
          box-shadow: 0 10px 30px -8px rgba(52,211,153,.32);
          transform: translateY(-1px);
        }
        .ab-cta:hover .ab-arr { transform:translateX(4px); }
        .ab-arr { transition:transform .22s ease; display:inline-flex; }

        @media (max-width:720px) {
          .ab-cols { grid-template-columns:1fr !important; }
          .ab-avatar-wrap { max-width:220px !important; height:220px !important; margin:0 auto; }
          .ab-right { padding-top:0 !important; }
        }
      `}</style>

      <section
        ref={root}
        id="about"
        className="ab-root reveal-section section-y page-x"
        style={{ position: "relative", overflow: "hidden",  }}
      >
        {/* Fine grain, matches Tech Stack section */}
        <div className="ab-grain-bg" style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />

        {/* Organic ambient glows — moss / bioluminescent */}
        <div style={{ position: "absolute", top: "5%", right: "-8%", width: 480, height: 480, background: "radial-gradient(circle,rgba(52,211,153,.09),transparent 70%)", filter: "blur(55px)", pointerEvents: "none", animation: "ab-blob 11s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: "0%", left: "-8%", width: 360, height: 360, background: "radial-gradient(circle,rgba(34,211,238,.07),transparent 70%)", filter: "blur(55px)", pointerEvents: "none", animation: "ab-blob 14s ease-in-out infinite 2s" }} />

        {/* Drifting spores */}
        {[
          { l: "12%", d: "0s", dur: "10s", c: "#34d399" },
          { l: "34%", d: "2.5s", dur: "8s", c: "#22d3ee" },
          { l: "71%", d: "1s", dur: "12s", c: "#a78bfa" },
          { l: "88%", d: "3s", dur: "9s", c: "#fbbf24" },
        ].map((s, i) => (
          <span key={i} className="ab-spore" style={{ left: s.l, bottom: "4%", background: s.c, boxShadow: `0 0 6px 1px ${s.c}`, animationDelay: s.d, animationDuration: s.dur }} />
        ))}

        <div className="container-6xl">

          {/* ── Section Header ── */}
          <div style={fade(0)}>
            <SectionHeader
              align="center"
              label="who i am"
              title={
                <>
                  My{" "}
                  <span style={{ fontStyle: "italic", background: "linear-gradient(135deg,#34d399 0%,#22d3ee 60%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    Story.
                  </span>
                </>
              }
              subtitle="Not just a resume — a bit of context on where I come from, what I build, and how I work."
            />
          </div>

          {/* ── Two-column layout ── */}
          <div
            className="ab-cols"
            style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 56, alignItems: "start" }}
          >

            {/* ═══ LEFT — Avatar + Focus Areas ══════════ */}
            <div style={{ ...fromLeft(0.08), display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>

              {/* Avatar orbital system */}
              <div className="ab-avatar-wrap" style={{ position: "relative", width: 260, height: 260, flexShrink: 0 }}>
                <div className="ab-ring1" style={{ position: "absolute", inset: -20, borderRadius: "50%", border: "1px dashed rgba(52,211,153,.22)", pointerEvents: "none" }} />
                <div className="ab-ring2" style={{ position: "absolute", inset: -7, borderRadius: "50%", border: "1px solid rgba(34,211,238,.16)", pointerEvents: "none" }} />

                {/* Moss orbiting dot */}
                <div style={{ position: "absolute", top: -14, left: "50%", marginLeft: -5, animation: "ab-spin 18s linear infinite", transformOrigin: "5px 144px" }}>
                  <div style={{ position: "relative", width: 10, height: 10 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#34d399", boxShadow: "0 0 14px #34d399" }} />
                    <div className="ab-ping" style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#34d399" }} />
                  </div>
                </div>
                {/* Teal orbiting dot */}
                <div style={{ position: "absolute", bottom: -10, left: "50%", marginLeft: -4, animation: "ab-spin-r 12s linear infinite", transformOrigin: "4px -132px" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22d3ee", boxShadow: "0 0 10px #22d3ee" }} />
                </div>

                {/* Photo — organic blob frame instead of a perfect circle */}
                <div style={{ position: "absolute", inset: 6, borderRadius: BLOB_RADII[0], overflow: "hidden", border: "2px solid rgba(52,211,153,.3)", boxShadow: "0 0 0 5px rgba(52,211,153,.05), 0 20px 60px -12px rgba(52,211,153,.24)", transition: "border-radius .6s ease" }}>
                  {!imgErr ? (
                    <img src={MyPhoto} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={() => setImgErr(true)} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", background: "linear-gradient(145deg,#0a1712,#0f2118)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64, opacity: .35 }}>🌱</div>
                  )}
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,transparent 55%,rgba(5,15,10,.45))" }} />
                </div>

                {/* Status pill */}
                <div style={{ position: "absolute", bottom: -1, left: "50%", transform: "translateX(-50%)", padding: "5px 14px", borderRadius: 999, background: "rgba(5,15,10,.92)", border: "1px solid rgba(52,211,153,.4)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
                  <span className="ab-pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", boxShadow: "0 0 8px #34d399", flexShrink: 0 }} />
                  <span style={{ fontSize: 10, fontFamily: "'Space Grotesk', monospace", color: "#34d399", letterSpacing: "0.08em" }}>Open to Work</span>
                </div>
              </div>

              {/* Focus area pills */}
              <div style={{ width: "100%" }}>
                <div style={{ fontSize: 9, fontFamily: "'Space Grotesk', monospace", color: "#4a5f54", textTransform: "uppercase", letterSpacing: "0.3em", marginBottom: 10, textAlign: "center" }}>
                  Focus Areas
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                  {DOMAINS.map(({ Icon, label, color }, i) => (
                    <div key={label} className="ab-dpill"
                      style={{ ...fade(0.26 + i * 0.07), display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 13px", borderRadius: BLOB_RADII[i % BLOB_RADII.length], background: `${color}0e`, border: `1px solid ${color}2c`, color, fontSize: 11, fontFamily: "'Outfit', sans-serif", fontWeight: 500, cursor: "default" }}>
                      <Icon size={12} strokeWidth={1.8} />
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ═══ RIGHT — Story Cards ═══════════════════ */}
            <div className="ab-right" style={{ display: "flex", flexDirection: "column", gap: 16, paddingTop: 4 }}>

              {STORY_CARDS.map(({ index, label, color, radiusSeed, text }, i) => (
                <div key={label} className="ab-story-card" style={fade(0.12 + i * 0.12)}>
                  <StoryCard index={index} label={label} color={color} radiusSeed={radiusSeed}>
                    {text}
                  </StoryCard>
                </div>
              ))}

              {/* CTA */}
              <div style={fade(0.52)}>
                <button
                  className="ab-cta"
                  onClick={onExploreProjects}
                  style={{ marginTop: 8, display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 22px", borderRadius: 999, border: "1px solid rgba(52,211,153,.3)", background: "rgba(52,211,153,.08)", color: "#6ee7b7", fontSize: 13, fontWeight: 600, fontFamily: "'Outfit', sans-serif", cursor: "pointer", letterSpacing: "0.02em" }}
                >
                  Explore My Projects
                  <span className="ab-arr"><ArrowRight size={14} strokeWidth={2.2} /></span>
                </button>
              </div>
            </div>

          </div>

          {/* Divider — vine, not a hairline */}
          <svg width="100%" height="2" viewBox="0 0 1200 2" preserveAspectRatio="none" style={{ marginTop: 72, display: "block", ...fade(0.6) }}>
            <line x1="0" y1="1" x2="1200" y2="1" stroke="url(#abDividerGrad)" strokeWidth="1" />
            <defs>
              <linearGradient id="abDividerGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="35%" stopColor="#34d399" stopOpacity="0.3" />
                <stop offset="65%" stopColor="#22d3ee" stopOpacity="0.3" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </section>
    </>
  );
}