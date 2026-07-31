import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import GrowthTimeline from "./GrowthTimeLine";
import PageSeo, { SITE_URL } from "./components/PageSeo";
import { Terminal, ArrowLeft } from "lucide-react";
import SiewZhenImg from "./data/image/SiewZhen.png";
import useHorizontalSwipeNavigate from "./hooks/useHorizontalSwipeNavigate";

/* ──────────────────────────────────────────────────────────────
   Same "canopy & roots" tokens as the rest of the site.
   ────────────────────────────────────────────────────────────── */
const MOSS = "#34d399";
const TEAL = "#22d3ee";
const AMBER = "#fbbf24";
const INK = "#eef5f0";
const MUTED = "#8fa79b";
const MUTED_DARK = "#4a5f54";
const BG_DEEP = "#050f0a";

// ─── BACK TO PORTFOLIO SIDE RAIL BUTTON ──────────────────────────────────────
// Mirrors the "World of Time" button on the right in Portfolio, but on the left.
const BackToPortfolioButton = ({ onClick }) => {
  const [hovered, setHovered] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 50);
    return () => clearInterval(id);
  }, []);

  // Reverse orbit direction for visual distinction
  const orbitAngle = (360 - (tick * 3) % 360);
  const orbitRad = (orbitAngle * Math.PI) / 180;
  const r = 14;
  const dotX = Math.cos(orbitRad) * r;
  const dotY = Math.sin(orbitRad) * r;
  const dot2X = Math.cos(orbitRad + Math.PI) * r;
  const dot2Y = Math.sin(orbitRad + Math.PI) * r;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="hidden lg:flex fixed left-0 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-0 group"
      aria-label="Back to Portfolio"
    >
      <div
        className="relative flex flex-col items-center gap-3 px-3 py-5 rounded-r-2xl transition-all duration-500"
        style={{
          background: hovered
            ? 'linear-gradient(180deg, rgba(52,211,153,0.18) 0%, rgba(34,211,238,0.18) 100%)'
            : 'linear-gradient(180deg, rgba(52,211,153,0.07) 0%, rgba(34,211,238,0.07) 100%)',
          border: '1px solid',
          borderLeft: 'none',
          borderColor: hovered ? 'rgba(52,211,153,0.6)' : 'rgba(52,211,153,0.2)',
          boxShadow: hovered
            ? '8px 0 32px -4px rgba(52,211,153,0.25), inset 0 0 20px rgba(52,211,153,0.05)'
            : '4px 0 16px -4px rgba(52,211,153,0.1)',
          transform: hovered ? 'translateX(4px)' : 'translateX(0)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {hovered && (
          <div
            className="absolute right-0 top-0 bottom-0 w-0.5 rounded-full"
            style={{ background: `linear-gradient(to bottom, ${MOSS}, ${TEAL})`, boxShadow: `0 0 8px ${MOSS}` }}
          />
        )}

        <span
          className="text-xs transition-all duration-300"
          style={{
            color: hovered ? MOSS : MUTED_DARK,
            transform: hovered ? 'translateX(2px)' : 'translateX(0)',
          }}
        >
          →
        </span>

        <span
          className="text-[9px] font-mono uppercase tracking-widest transition-colors duration-300"
          style={{ color: hovered ? MOSS : MUTED_DARK }}
        >
          Portfolio
        </span>

        <div
          className="w-px transition-all duration-500"
          style={{
            height: hovered ? 28 : 16,
            background: `linear-gradient(to bottom, ${MOSS}, ${TEAL})`,
            opacity: hovered ? 1 : 0.4,
          }}
        />

        <div className="relative w-8 h-8 flex-shrink-0">
          <svg width="32" height="32" viewBox="-18 -18 36 36" className="overflow-visible">
            <circle cx="0" cy="0" r="14" fill="none"
              stroke={hovered ? 'rgba(52,211,153,0.5)' : 'rgba(52,211,153,0.2)'}
              strokeWidth="0.8"
              strokeDasharray="3 4"
              style={{ transition: 'stroke 0.4s' }}
            />
            <circle cx="0" cy="0" r="5" fill="none"
              stroke={hovered ? 'rgba(34,211,238,0.8)' : 'rgba(34,211,238,0.4)'}
              strokeWidth="1"
              style={{ transition: 'stroke 0.4s' }}
            />
            <circle cx="0" cy="0" r="2.5"
              fill={hovered ? TEAL : 'rgba(34,211,238,0.5)'}
              style={{ transition: 'fill 0.4s' }}
            />
            <circle cx={dotX} cy={dotY} r="2"
              fill={hovered ? MOSS : 'rgba(52,211,153,0.6)'}
              style={{ transition: 'fill 0.2s' }}
            />
            <circle cx={dot2X} cy={dot2Y} r="1.2"
              fill={hovered ? TEAL : 'rgba(34,211,238,0.4)'}
              style={{ transition: 'fill 0.2s' }}
            />
          </svg>
        </div>

        <span
          className="text-[10px] font-mono uppercase transition-colors duration-300"
          style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            color: hovered ? MOSS : '#6b8277',
            letterSpacing: '0.35em',
          }}
        >
          Back to Home
        </span>
      </div>
    </button>
  );
};

// ─── FULL-SCREEN TIMELINE MODAL (Portal-based) ───────────────────────────────
// Renders via createPortal into document.body — always on top, no z-index issues.
// Used by both TimelineCardWrapper and the exported TimelinePopup.

function TimelineModalInner({ item, isOpen, onClose }) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    if (isOpen) {
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
  }, [isOpen]);

  useEffect(() => {
    const esc = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  const images = Array.isArray(item?.images)
    ? item.images.filter(Boolean)
    : (item?.image ? [item.image] : []);

  useEffect(() => {
    setImgIdx(0);
  }, [item?.title]);

  if (!mounted || !item) return null;

  const accent = item.color || item.accentColor || MOSS;

  return createPortal(
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99998,
          background: visible ? "rgba(4,10,7,0.94)" : "rgba(4,10,7,0)",
          backdropFilter: visible ? "blur(22px)" : "blur(0px)",
          WebkitBackdropFilter: visible ? "blur(22px)" : "blur(0px)",
          transition: "background 0.34s ease, backdrop-filter 0.34s ease",
        }}
        onClick={onClose}
      />

      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99999,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          overflowY: "auto",
          padding: "1.25rem",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 600,
            margin: "auto",
            pointerEvents: "all",
            opacity: visible ? 1 : 0,
            transform: visible ? "scale(1) translateY(0)" : "scale(0.92) translateY(28px)",
            transition: "opacity 0.34s cubic-bezier(0.22,1,0.36,1), transform 0.34s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <div
            style={{
              position: "relative",
              borderRadius: 20,
              overflow: "hidden",
              background: "linear-gradient(145deg,#070f0c,#0a1610)",
              border: `1px solid ${accent}38`,
              boxShadow: `0 48px 120px -24px ${accent}45, 0 0 0 1px ${accent}14`,
            }}
          >
            <div style={{ height: 2, width: "100%", background: `linear-gradient(90deg,transparent,${accent},transparent)` }} />

            <button
              onClick={e => { e.stopPropagation(); onClose(); }}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                zIndex: 10,
                width: 40,
                height: 40,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.14)",
                color: "#cdd9d2",
                fontSize: 16,
                cursor: "pointer",
                transition: "transform 0.2s, background 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.12)"; e.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
              aria-label="Close"
            >
              ✕
            </button>

            {images.length > 0 ? (
              <div style={{ position: "relative", height: 220, overflow: "hidden" }}>
                <img
                  src={images[imgIdx]}
                  alt={item.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom,${accent}12 0%,#070f0c 100%)` }} />

                {images.length > 1 && (
                  <>
                    <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 6, zIndex: 5 }}>
                      {images.map((src, i) => (
                        <button
                          key={src + i}
                          onClick={(e) => { e.stopPropagation(); setImgIdx(i); }}
                          aria-label={`View image ${i + 1}`}
                          style={{
                            width: 38,
                            height: 28,
                            borderRadius: 8,
                            overflow: "hidden",
                            border: `1.5px solid ${i === imgIdx ? accent : "rgba(255,255,255,0.2)"}`,
                            background: "rgba(0,0,0,0.25)",
                            padding: 0,
                            cursor: "pointer",
                            opacity: i === imgIdx ? 1 : 0.7,
                            transition: "opacity 0.2s, border-color 0.2s",
                          }}
                        >
                          <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </button>
                      ))}
                    </div>

                    <div style={{ position: "absolute", bottom: 12, left: 12, right: 12, display: "flex", alignItems: "center", gap: 10, zIndex: 5 }}>
                      <span style={{ fontSize: 10, fontFamily: "'Space Grotesk',monospace", padding: "2px 10px", borderRadius: 6, background: "rgba(5,15,10,0.85)", color: accent, border: `1px solid ${accent}35` }}>
                        {imgIdx + 1}/{images.length}
                      </span>
                      <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                        {images.map((_, i) => (
                          <button
                            key={i}
                            onClick={(e) => { e.stopPropagation(); setImgIdx(i); }}
                            aria-label={`Go to image ${i + 1}`}
                            style={{
                              width: i === imgIdx ? 20 : 7,
                              height: 7,
                              borderRadius: 9999,
                              background: i === imgIdx ? accent : "rgba(255,255,255,0.3)",
                              boxShadow: i === imgIdx ? `0 0 10px ${accent}80` : "none",
                              border: "none",
                              cursor: "pointer",
                              padding: 0,
                              transition: "all 0.25s ease",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "center", paddingTop: 36, paddingBottom: 8 }}>
                <div style={{
                  width: 64, height: 64, borderRadius: "42% 58% 63% 37% / 41% 44% 56% 59%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 28, background: `${accent}18`, border: `1px solid ${accent}35`,
                }}>
                  {item.icon || item.emoji || "📌"}
                </div>
              </div>
            )}

            <div style={{ padding: "20px 24px 28px", display: "flex", flexDirection: "column", gap: 16 }}>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {(item.date || item.year) && (
                  <span style={{ fontSize: 10, fontFamily: "'Space Grotesk',monospace", padding: "2px 10px", borderRadius: 6, background: "rgba(5,15,10,0.85)", color: MUTED, border: "1px solid rgba(255,255,255,0.14)" }}>
                    {item.date || item.year}
                  </span>
                )}
                {item.category && (
                  <span style={{ fontSize: 10, fontFamily: "'Space Grotesk',monospace", padding: "2px 10px", borderRadius: 999, color: accent, background: `${accent}18`, border: `1px solid ${accent}35` }}>
                    {item.category}
                  </span>
                )}
                {item.type && (
                  <span style={{ fontSize: 10, fontFamily: "'Space Grotesk',monospace", padding: "2px 10px", borderRadius: 999, color: accent, background: `${accent}18`, border: `1px solid ${accent}35`, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {item.type}
                  </span>
                )}
                {item.award && (
                  <span style={{ fontSize: 10, fontFamily: "'Space Grotesk',monospace", padding: "2px 10px", borderRadius: 999, color: AMBER, background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.35)", display: "inline-flex", alignItems: "center", gap: 4 }}>
                    ⭐ {item.award}
                  </span>
                )}
              </div>

              <div>
                <h3 style={{ fontSize: 22, fontWeight: 600, fontStyle: "italic", color: INK, lineHeight: 1.25, marginBottom: 4, fontFamily: "'Fraunces',serif" }}>
                  {item.title}
                </h3>
                {item.subtitle && (
                  <p style={{ fontSize: 12, fontFamily: "'Space Grotesk',monospace", color: accent }}>{item.subtitle}</p>
                )}
                {item.role && (
                  <p style={{ fontSize: 12, fontFamily: "'Space Grotesk',monospace", color: accent }}>↳ {item.role}</p>
                )}
              </div>

              {item.description && (
                <p style={{ fontSize: 14, color: "#cdd9d2", lineHeight: 1.7 }}>{item.description}</p>
              )}

              {item.highlights && item.highlights.length > 0 && (
                <div>
                  <div style={{ fontSize: 10, fontFamily: "'Space Grotesk',monospace", color: accent, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 8 }}>▸ Highlights</div>
                  <ul style={{ display: "flex", flexDirection: "column", gap: 8, margin: 0, padding: 0, listStyle: "none" }}>
                    {item.highlights.map((h, i) => (
                      <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 14, color: "#cdd9d2" }}>
                        <span style={{ color: accent, flexShrink: 0, marginTop: 2 }}>›</span>{h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {item.tags && item.tags.length > 0 && (
                <div>
                  <div style={{ fontSize: 10, fontFamily: "'Space Grotesk',monospace", color: accent, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 8 }}>▸ Skills & Tags</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {item.tags.map(tag => (
                      <span key={tag} style={{ fontSize: 11, fontFamily: "'Space Grotesk',monospace", padding: "2px 10px", borderRadius: 999, color: accent, border: `1px solid ${accent}35`, background: `${accent}10` }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {item.link && (
                <a href={item.link} target="_blank" rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10, fontSize: 12, fontWeight: 600, color: accent, border: `1px solid ${accent}40`, background: `${accent}10`, textDecoration: "none", width: "fit-content" }}
                  onClick={e => e.stopPropagation()}
                >
                  View more ↗
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}

// ─── TimelineCardWrapper ──────────────────────────────────────────────────────
// Wrap any timeline card child so clicking it opens the full-screen modal.
export function TimelineCardWrapper({ item, children }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TimelineModalInner item={item} isOpen={open} onClose={() => setOpen(false)} />
      <div onClick={() => setOpen(true)} style={{ cursor: "pointer" }}>
        {children}
      </div>
    </>
  );
}

// ─── TimelinePopup (EXPORTED) ─────────────────────────────────────────────────
export function TimelinePopup({ item, isOpen, onClose }) {
  return <TimelineModalInner item={item} isOpen={isOpen} onClose={onClose} />;
}

// ─── JOURNEY PAGE ─────────────────────────────────────────────────────────────
export default function Journey() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useHorizontalSwipeNavigate({
    enabled: true,
    onSwipeRight: () => navigate("/"),
  });

  return (
    <div className="natural-tech-page journey-page min-h-screen text-white font-sans overflow-x-hidden" style={{ background: `radial-gradient(ellipse at 50% -10%, #0a1a12 0%, ${BG_DEEP} 60%)` }}>
      <PageSeo
        title="Growth Journey | Chong Siew Zhen"
        description="Six years of building, competing, and shipping — from Young Maker Challenge in Sarawak to Robocon Malaysia, ABU Robocon, and blockchain hackathons."
        path="/journey"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Growth Journey | Chong Siew Zhen",
          "url": `${SITE_URL}/journey`,
          "description": "Timeline of competitions, internships, and projects by Chong Siew Zhen.",
          "isPartOf": { "@id": `${SITE_URL}/#website` },
        }}
      />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500;1,9..144,600&family=Space+Grotesk:wght@400;500;700&family=Outfit:wght@300;400;500;600&display=swap');
        * { font-family: 'Outfit', sans-serif; box-sizing: border-box; }
        .font-mono { font-family: 'Space Grotesk', monospace; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${BG_DEEP}; }
        ::-webkit-scrollbar-thumb { background: #16261d; border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: ${MOSS}; }

        @keyframes jr-blob { 0%,100% { opacity:.4 } 50% { opacity:.8 } }
        @keyframes jr-drift { 0%{transform:translateY(0);opacity:0} 10%{opacity:.65} 90%{opacity:.3} 100%{transform:translateY(-120px);opacity:0} }
        .jr-spore { position:fixed; width:3px; height:3px; border-radius:50%; animation: jr-drift linear infinite; pointer-events:none; z-index:1; }
      `}</style>

      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-10%", right: "-6%", width: 520, height: 520, background: "radial-gradient(circle, rgba(52,211,153,.08) 0%, transparent 70%)", filter: "blur(60px)", animation: "jr-blob 12s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: "5%", left: "-8%", width: 440, height: 440, background: "radial-gradient(circle, rgba(34,211,238,.06) 0%, transparent 70%)", filter: "blur(60px)", animation: "jr-blob 15s ease-in-out infinite 3s" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      </div>
      {[
        { l: "10%", d: "0s", dur: "10s", c: MOSS },
        { l: "38%", d: "2.5s", dur: "8s", c: TEAL },
        { l: "72%", d: "1s", dur: "12s", c: AMBER },
        { l: "90%", d: "3.5s", dur: "9s", c: MOSS },
      ].map((s, i) => (
        <span key={i} className="jr-spore" style={{ left: s.l, bottom: "4%", background: s.c, boxShadow: `0 0 6px 1px ${s.c}`, animationDelay: s.d, animationDuration: s.dur }} />
      ))}

      {/* ── TOP NAV ── */}
      <nav className="site-nav is-scrolled fixed w-full z-50 backdrop-blur-xl border-b" style={{ background: "rgba(5,15,10,0.9)", borderColor: "rgba(255,255,255,0.07)" }}>
        <div className="container-6xl page-x">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate("/")}
              className="group flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-full overflow-hidden border flex items-center justify-center" style={{ borderColor: "rgba(52,211,153,0.4)", background: "rgba(9,20,15,0.6)" }}>
                <img
                  src={SiewZhenImg}
                  alt="Chong Siew Zhen"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-mono text-sm transition-colors" style={{ color: MUTED }} onMouseEnter={e => e.currentTarget.style.color = MOSS} onMouseLeave={e => e.currentTarget.style.color = MUTED}>
                Chong Siew Zhen
              </span>
            </button>

            <div className="hidden md:flex items-center gap-3">
              <div className="w-10 h-px" style={{ background: `linear-gradient(to right, ${MOSS}, ${TEAL})`, opacity: 0.6 }} />
              <span className="text-xs font-mono tracking-[0.35em] uppercase" style={{ color: MOSS }}>
                World of Time
              </span>
              <div className="w-10 h-px" style={{ background: `linear-gradient(to right, ${TEAL}, ${MOSS})`, opacity: 0.6 }} />
            </div>

            <button
              onClick={() => navigate("/")}
              className="lg:hidden flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all"
              style={{ color: MOSS, borderColor: "rgba(52,211,153,0.3)", background: "rgba(52,211,153,0.08)" }}
            >
              ← Portfolio
            </button>
          </div>
        </div>
      </nav>

      <BackToPortfolioButton onClick={() => navigate("/")} />

      <button
        onClick={() => navigate("/")}
        className="lg:hidden fixed bottom-6 left-6 z-40 flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold active:scale-95 transition-all duration-200"
        style={{
          background: `linear-gradient(135deg, rgba(52,211,153,0.95) 0%, rgba(34,211,238,0.9) 70%)`,
          color: BG_DEEP,
          boxShadow: "0 18px 40px -14px rgba(52,211,153,0.5), 0 0 0 1px rgba(52,211,153,0.14)",
        }}
        aria-label="Back to Home"
      >
        <ArrowLeft size={16} />
        <span className="font-mono tracking-wide">Home</span>
      </button>

      <main className="pt-20" style={{ position: "relative", zIndex: 2 }}>
        {/*
          GrowthTimeLine.jsx now shares this page's moss / teal / amber
          "canopy & roots" palette and the same Fraunces / Outfit /
          Space Grotesk type system, so the two files read as one
          continuous world rather than two different products.

          Its signature element is a growth-ring node: concentric
          dashed rings (dendrochronology) fused with radiating circuit
          legs and a diamond "chip" core (PCB) — one shape, read two
          ways: nature's record-keeping and a system's data trace.

          If you later want Journey.jsx's full-screen TimelineModalInner
          (exported as TimelinePopup/TimelineCardWrapper below) wired
          into GrowthTimeline's cards instead of its own inline modal,
          swap GrowthTimeline's `open`/`setOpen` state for this file's
          TimelinePopup — both now use identical colors, so the choice
          is purely about which modal mechanics you prefer.
        */}
        <GrowthTimeline />
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t py-8 px-6" style={{ borderColor: "rgba(255,255,255,0.08)", position: "relative", zIndex: 2 }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full overflow-hidden border flex items-center justify-center" style={{ borderColor: "rgba(52,211,153,0.4)", background: "rgba(9,20,15,0.6)" }}>
              <img
                src={SiewZhenImg}
                alt="Chong Siew Zhen"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm font-mono" style={{ color: "#6b8277" }}>
              Chong Siew Zhen <span style={{ color: "#2a3a32" }}>·</span> UTM Software
              Engineering <span style={{ color: "#2a3a32" }}>·</span> CGPA 3.97
            </span>
          </div>
          <p className="text-xs font-mono" style={{ color: "#2a3a32" }}>
            © 2026 · Built with React + Tailwind · Imperfectly Perfect
          </p>
        </div>
      </footer>
    </div>
  );
}