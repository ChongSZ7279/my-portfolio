import { useState, useEffect, useRef } from "react";
import { ArrowRight, Cpu, Layers, GitBranch, Heart } from "lucide-react";
import MyPhoto from "./data/image/SiewZhen.png";
import SectionHeader from "./components/SectionHeader";

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

// ─── Animated number counter ───────────────────────────────────────────────────
function Num({ end, suffix = "" }) {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let i = 0;
        const t = setInterval(() => {
          i += end / 40;
          if (i >= end) { setN(end); clearInterval(t); } else setN(Math.floor(i));
        }, 28);
        obs.disconnect();
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end]);
  return <span ref={ref}>{n}{suffix}</span>;
}

// ─── Inline story card ─────────────────────────────────────────────────────────
const StoryCard = ({ index, label, color, children, style }) => (
  <div
    style={{
      position: "relative",
      padding: "22px 24px",
      borderRadius: 16,
      background: "linear-gradient(145deg, rgba(13,24,41,.9), rgba(15,23,42,.7))",
      border: `1px solid ${color}22`,
      overflow: "hidden",
      ...style,
    }}
  >
    {/* Left accent bar */}
    <div style={{ position: "absolute", left: 0, top: 12, bottom: 12, width: 3, borderRadius: "0 2px 2px 0", background: color, boxShadow: `0 0 10px ${color}80` }} />
    {/* Index label */}
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
      <span style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", color, textTransform: "uppercase", letterSpacing: "0.3em" }}>
        {String(index).padStart(2, "0")} · {label}
      </span>
    </div>
    <div style={{ fontSize: "clamp(13px, 1.3vw, 14px)", color: "#94a3b8", lineHeight: 1.85, fontFamily: "Outfit, sans-serif" }}>
      {children}
    </div>
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
    { Icon: Cpu,       label: "AI Systems",              color: "#06b6d4" },
    { Icon: Layers,    label: "Web Architecture",        color: "#818cf8" },
    { Icon: GitBranch, label: "Blockchain Transparency", color: "#f59e0b" },
    { Icon: Heart,     label: "Human-Centered Design",   color: "#34d399" },
  ];

  const STORY_CARDS = [
    {
      index: 1,
      label: "Story",
      color: "#06b6d4",
      text: (
        <>
          I'm a final-year Software Engineering student at <span style={{ color: "#67e8f9", fontWeight: 600 }}>Universiti Teknologi Malaysia</span> with a passion for building scalable systems and solving real-world problems through technology.
        </>
      ),
    },
    {
      index: 2,
      label: "What I Build",
      color: "#818cf8",
      text: (
        <>
          I build <span style={{ color: "#a5b4fc", fontWeight: 600 }}>production-ready applications</span> across AI, blockchain, and full-stack web development, focusing on systems that are practical, reliable, and impactful.
        </>
      ),
    },
    {
      index: 3,
      label: "How I Work",
      color: "#34d399",
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
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=JetBrains+Mono:wght@400;500&family=Outfit:wght@300;400;500;600&display=swap');

        .ab-root { font-family:'Outfit',sans-serif; color:#f1f5f9; box-sizing:border-box; }
        .ab-root * { box-sizing:border-box; }

        .ab-grid-bg {
          background-image:
            linear-gradient(rgba(6,182,212,.022) 1px,transparent 1px),
            linear-gradient(90deg,rgba(6,182,212,.022) 1px,transparent 1px);
          background-size:56px 56px;
        }

        @keyframes ab-spin     { to { transform:rotate(360deg);  } }
        @keyframes ab-spin-r   { to { transform:rotate(-360deg); } }
        @keyframes ab-glow     { 0%,100%{opacity:.35} 50%{opacity:.85} }
        @keyframes ab-ping     { 0%{transform:scale(1);opacity:.7} 100%{transform:scale(2.4);opacity:0} }
        @keyframes ab-pulse    { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }

        .ab-ring1  { animation: ab-spin   18s linear infinite; }
        .ab-ring2  { animation: ab-spin-r 12s linear infinite; }
        .ab-ping   { animation: ab-ping    2s ease-out infinite; }
        .ab-pulse  { animation: ab-pulse   2s ease-in-out infinite; }

        .ab-dpill { transition: transform .22s ease, box-shadow .22s ease; }
        .ab-dpill:hover { transform: translateY(-3px) scale(1.04); }

        .ab-story-card { transition: border-color .28s ease, box-shadow .28s ease; }
        .ab-story-card:hover { box-shadow: 0 8px 32px -8px rgba(6,182,212,.12) !important; border-color: rgba(6,182,212,.18) !important; }

        .ab-cta { transition: all .22s ease; }
        .ab-cta:hover {
          background: rgba(6,182,212,.18) !important;
          border-color: rgba(6,182,212,.7) !important;
          color: #06b6d4 !important;
          box-shadow: 0 8px 28px -8px rgba(6,182,212,.35);
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
        style={{ position: "relative", overflow: "hidden" }}
      >
        {/* Grid bg */}
        <div className="ab-grid-bg" style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />

        {/* Ambient glows */}
        <div style={{ position: "absolute", top: "5%", right: "-8%", width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,.08),transparent 70%)", filter: "blur(55px)", pointerEvents: "none", animation: "ab-glow 6s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: "0%", left: "-8%", width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle,rgba(6,182,212,.06),transparent 70%)", filter: "blur(55px)", pointerEvents: "none", animation: "ab-glow 8s ease-in-out infinite 2s" }} />

        <div className="container-6xl">

          {/* ── Section Header ── */}
          <div style={fade(0)}>
            <SectionHeader
              align="center"
              label="who i am"
              title={
                <>
                  My{" "}
                  <span style={{ background: "linear-gradient(135deg,#06b6d4 0%,#818cf8 60%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    Story.
                  </span>
                </>
              }
              subtitle="Not just a résumé — a bit of context on where I come from, what I build, and how I work."
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
                <div className="ab-ring1" style={{ position: "absolute", inset: -20, borderRadius: "50%", border: "1px dashed rgba(6,182,212,.2)", pointerEvents: "none" }} />
                <div className="ab-ring2" style={{ position: "absolute", inset: -7, borderRadius: "50%", border: "1px solid rgba(99,102,241,.15)", pointerEvents: "none" }} />

                {/* Cyan orbiting dot */}
                <div style={{ position: "absolute", top: -14, left: "50%", marginLeft: -5, animation: "ab-spin 18s linear infinite", transformOrigin: "5px 144px" }}>
                  <div style={{ position: "relative", width: 10, height: 10 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#06b6d4", boxShadow: "0 0 14px #06b6d4" }} />
                    <div className="ab-ping" style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#06b6d4" }} />
                  </div>
                </div>
                {/* Violet orbiting dot */}
                <div style={{ position: "absolute", bottom: -10, left: "50%", marginLeft: -4, animation: "ab-spin-r 12s linear infinite", transformOrigin: "4px -132px" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#818cf8", boxShadow: "0 0 10px #818cf8" }} />
                </div>

                {/* Photo */}
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden", border: "2px solid rgba(6,182,212,.28)", boxShadow: "0 0 0 5px rgba(6,182,212,.05), 0 20px 60px -12px rgba(6,182,212,.22)" }}>
                  {!imgErr ? (
                    <img src={MyPhoto} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={() => setImgErr(true)} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", background: "linear-gradient(145deg,#0d1829,#1e293b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64, opacity: .35 }}>👤</div>
                  )}
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,transparent 55%,rgba(5,11,23,.4))" }} />
                </div>

                {/* Status pill */}
                <div style={{ position: "absolute", bottom: -1, left: "50%", transform: "translateX(-50%)", padding: "5px 14px", borderRadius: 999, background: "rgba(5,11,23,.92)", border: "1px solid rgba(16,185,129,.35)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
                  <span className="ab-pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981", flexShrink: 0 }} />
                  <span style={{ fontSize: 10, fontFamily: "JetBrains Mono,monospace", color: "#10b981", letterSpacing: "0.08em" }}>Open to Work</span>
                </div>
              </div>

              {/* Focus area pills */}
              <div style={{ width: "100%" }}>
                <div style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", color: "#334155", textTransform: "uppercase", letterSpacing: "0.3em", marginBottom: 10, textAlign: "center" }}>
                  Focus Areas
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                  {DOMAINS.map(({ Icon, label, color }, i) => (
                    <div key={label} className="ab-dpill"
                      style={{ ...fade(0.26 + i * 0.07), display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 13px", borderRadius: 10, background: `${color}0e`, border: `1px solid ${color}28`, color, fontSize: 11, fontFamily: "Outfit, sans-serif", fontWeight: 500, cursor: "default" }}>
                      <Icon size={12} strokeWidth={1.8} />
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ═══ RIGHT — Story Cards ═══════════════════ */}
            <div className="ab-right" style={{ display: "flex", flexDirection: "column", gap: 16, paddingTop: 4 }}>

              {STORY_CARDS.map(({ index, label, color, text }, i) => (
                <div key={label} className="ab-story-card" style={fade(0.12 + i * 0.12)}>
                  <StoryCard index={index} label={label} color={color}>
                    {text}
                  </StoryCard>
                </div>
              ))}

              {/* CTA */}
              <div style={fade(0.52)}>
                <button
                  className="ab-cta"
                  onClick={onExploreProjects}
                  style={{ marginTop: 8, display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 22px", borderRadius: 10, border: "1px solid rgba(6,182,212,.28)", background: "rgba(6,182,212,.07)", color: "#67e8f9", fontSize: 13, fontWeight: 600, fontFamily: "Outfit, sans-serif", cursor: "pointer", letterSpacing: "0.02em" }}
                >
                  Explore My Projects
                  <span className="ab-arr"><ArrowRight size={14} strokeWidth={2.2} /></span>
                </button>
              </div>
            </div>

          </div>

          {/* Divider */}
          <div style={{ marginTop: 72, height: 1, background: "linear-gradient(90deg,transparent,rgba(99,102,241,.28),rgba(6,182,212,.28),transparent)", ...fade(0.6) }} />
        </div>
      </section>
    </>
  );
}