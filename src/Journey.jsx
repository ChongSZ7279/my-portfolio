import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import GrowthTimeline from "./GrowthTimeLine";
import { Terminal, ArrowLeft } from "lucide-react";
import SiewZhenImg from "./data/image/SiewZhen.png";
import useHorizontalSwipeNavigate from "./hooks/useHorizontalSwipeNavigate";

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
            ? 'linear-gradient(180deg, rgba(99,102,241,0.18) 0%, rgba(6,182,212,0.18) 100%)'
            : 'linear-gradient(180deg, rgba(99,102,241,0.07) 0%, rgba(6,182,212,0.07) 100%)',
          border: '1px solid',
          borderLeft: 'none',
          borderColor: hovered ? 'rgba(99,102,241,0.6)' : 'rgba(99,102,241,0.2)',
          boxShadow: hovered
            ? '8px 0 32px -4px rgba(99,102,241,0.25), inset 0 0 20px rgba(99,102,241,0.05)'
            : '4px 0 16px -4px rgba(99,102,241,0.1)',
          transform: hovered ? 'translateX(4px)' : 'translateX(0)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Hover glow edge on the right side */}
        {hovered && (
          <div
            className="absolute right-0 top-0 bottom-0 w-0.5 rounded-full"
            style={{ background: 'linear-gradient(to bottom, #818cf8, #06b6d4)', boxShadow: '0 0 8px #818cf8' }}
          />
        )}

        {/* Arrow */}
        <span
          className="text-xs transition-all duration-300"
          style={{
            color: hovered ? '#818cf8' : '#334155',
            transform: hovered ? 'translateX(2px)' : 'translateX(0)',
          }}
        >
          →
        </span>

        {/* Portfolio label */}
        <span
          className="text-[9px] font-mono uppercase tracking-widest transition-colors duration-300"
          style={{ color: hovered ? '#818cf8' : '#334155' }}
        >
          Portfolio
        </span>

        {/* Gradient line */}
        <div
          className="w-px transition-all duration-500"
          style={{
            height: hovered ? 28 : 16,
            background: 'linear-gradient(to bottom, #818cf8, #06b6d4)',
            opacity: hovered ? 1 : 0.4,
          }}
        />

        {/* Animated orbital SVG icon — violet/indigo palette */}
        <div className="relative w-8 h-8 flex-shrink-0">
          <svg width="32" height="32" viewBox="-18 -18 36 36" className="overflow-visible">
            <circle cx="0" cy="0" r="14" fill="none"
              stroke={hovered ? 'rgba(99,102,241,0.5)' : 'rgba(99,102,241,0.2)'}
              strokeWidth="0.8"
              strokeDasharray="3 4"
              style={{ transition: 'stroke 0.4s' }}
            />
            <circle cx="0" cy="0" r="5" fill="none"
              stroke={hovered ? 'rgba(6,182,212,0.8)' : 'rgba(6,182,212,0.4)'}
              strokeWidth="1"
              style={{ transition: 'stroke 0.4s' }}
            />
            <circle cx="0" cy="0" r="2.5"
              fill={hovered ? '#06b6d4' : 'rgba(6,182,212,0.5)'}
              style={{ transition: 'fill 0.4s' }}
            />
            <circle cx={dotX} cy={dotY} r="2"
              fill={hovered ? '#818cf8' : 'rgba(99,102,241,0.6)'}
              style={{ transition: 'fill 0.2s' }}
            />
            <circle cx={dot2X} cy={dot2Y} r="1.2"
              fill={hovered ? '#06b6d4' : 'rgba(6,182,212,0.4)'}
              style={{ transition: 'fill 0.2s' }}
            />
          </svg>
        </div>

        {/* Vertical text */}
        <span
          className="text-[10px] font-mono uppercase transition-colors duration-300"
          style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            color: hovered ? '#818cf8' : '#64748b',
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
      // Double rAF guarantees CSS transition fires after mount
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

  const accent = item.color || item.accentColor || "#06b6d4";

  return createPortal(
    <>
      {/* ── Full-screen backdrop (covers EVERYTHING including timeline nodes) ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99998,
          background: visible ? "rgba(5,11,23,0.94)" : "rgba(5,11,23,0)",
          backdropFilter: visible ? "blur(22px)" : "blur(0px)",
          WebkitBackdropFilter: visible ? "blur(22px)" : "blur(0px)",
          transition: "background 0.34s ease, backdrop-filter 0.34s ease",
        }}
        onClick={onClose}
      />

      {/* ── Scrollable centering shell ── */}
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
          pointerEvents: "none", // let clicks pass through to backdrop except modal card
        }}
      >
        {/* ── Animated modal card ── */}
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
              background: "linear-gradient(145deg,#060d1c,#0a1220)",
              border: `1px solid ${accent}38`,
              boxShadow: `0 48px 120px -24px ${accent}45, 0 0 0 1px ${accent}14`,
            }}
          >
            {/* Accent top bar */}
            <div style={{ height: 2, width: "100%", background: `linear-gradient(90deg,transparent,${accent},transparent)` }} />

            {/* ── Close button — large, easy to tap ── */}
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
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#cbd5e1",
                fontSize: 16,
                cursor: "pointer",
                transition: "transform 0.2s, background 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.12)"; e.currentTarget.style.background = "rgba(255,255,255,0.13)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
              aria-label="Close"
            >
              ✕
            </button>

            {/* ── Hero image carousel OR icon ── */}
            {images.length > 0 ? (
              <div style={{ position: "relative", height: 220, overflow: "hidden" }}>
                <img
                  src={images[imgIdx]}
                  alt={item.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom,${accent}12 0%,#060d1c 100%)` }} />

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
                            border: `1.5px solid ${i === imgIdx ? accent : "rgba(148,163,184,0.25)"}`,
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
                      <span style={{ fontSize: 10, fontFamily: "JetBrains Mono,monospace", padding: "2px 10px", borderRadius: 6, background: "rgba(4,9,20,0.85)", color: accent, border: `1px solid ${accent}35` }}>
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
                              background: i === imgIdx ? accent : "rgba(148,163,184,0.35)",
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
                  width: 64, height: 64, borderRadius: 16,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 28, background: `${accent}18`, border: `1px solid ${accent}35`,
                }}>
                  {item.icon || item.emoji || "📌"}
                </div>
              </div>
            )}

            {/* ── Content body ── */}
            <div style={{ padding: "20px 24px 28px", display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Pills row */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {(item.date || item.year) && (
                  <span style={{ fontSize: 10, fontFamily: "JetBrains Mono,monospace", padding: "2px 10px", borderRadius: 6, background: "rgba(4,9,20,0.85)", color: "#94a3b8", border: "1px solid rgba(148,163,184,0.2)" }}>
                    {item.date || item.year}
                  </span>
                )}
                {item.category && (
                  <span style={{ fontSize: 10, fontFamily: "JetBrains Mono,monospace", padding: "2px 10px", borderRadius: 999, color: accent, background: `${accent}18`, border: `1px solid ${accent}35` }}>
                    {item.category}
                  </span>
                )}
                {item.type && (
                  <span style={{ fontSize: 10, fontFamily: "JetBrains Mono,monospace", padding: "2px 10px", borderRadius: 999, color: accent, background: `${accent}18`, border: `1px solid ${accent}35`, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {item.type}
                  </span>
                )}
                {/* Award badge from GrowthTimeline shape */}
                {item.award && (
                  <span style={{ fontSize: 10, fontFamily: "JetBrains Mono,monospace", padding: "2px 10px", borderRadius: 999, color: "#f59e0b", background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.35)", display: "inline-flex", alignItems: "center", gap: 4 }}>
                    ⭐ {item.award}
                  </span>
                )}
              </div>

              {/* Title + subtitle */}
              <div>
                <h3 style={{ fontSize: 22, fontWeight: 900, color: "#f1f5f9", lineHeight: 1.25, marginBottom: 4, fontFamily: "'Syne',sans-serif" }}>
                  {item.title}
                </h3>
                {item.subtitle && (
                  <p style={{ fontSize: 12, fontFamily: "JetBrains Mono,monospace", color: accent }}>{item.subtitle}</p>
                )}
                {item.role && (
                  <p style={{ fontSize: 12, fontFamily: "JetBrains Mono,monospace", color: accent }}>↳ {item.role}</p>
                )}
              </div>

              {/* Description */}
              {item.description && (
                <p style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.7 }}>{item.description}</p>
              )}

              {/* Highlights / bullet points */}
              {item.highlights && item.highlights.length > 0 && (
                <div>
                  <div style={{ fontSize: 10, fontFamily: "JetBrains Mono,monospace", color: accent, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 8 }}>▸ Highlights</div>
                  <ul style={{ display: "flex", flexDirection: "column", gap: 8, margin: 0, padding: 0, listStyle: "none" }}>
                    {item.highlights.map((h, i) => (
                      <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 14, color: "#cbd5e1" }}>
                        <span style={{ color: accent, flexShrink: 0, marginTop: 2 }}>›</span>{h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div>
                  <div style={{ fontSize: 10, fontFamily: "JetBrains Mono,monospace", color: accent, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 8 }}>▸ Skills & Tags</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {item.tags.map(tag => (
                      <span key={tag} style={{ fontSize: 11, fontFamily: "JetBrains Mono,monospace", padding: "2px 10px", borderRadius: 999, color: accent, border: `1px solid ${accent}35`, background: `${accent}10` }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Link */}
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
// Drop-in replacement for GrowthTimeLine's own popup.
// Usage inside GrowthTimeLine.jsx:
//
//   import { TimelinePopup } from './Journey';
//
//   // Replace whatever popup JSX you have with:
//   <TimelinePopup item={selectedItem} isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} />
//
// The `item` object should have any of these fields (all optional except title):
//   title, subtitle, role, description, date, year, category, type, award,
//   color/accentColor, icon, emoji, image, highlights (string[]), tags (string[]), link
//
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
    <div className="min-h-screen bg-[#050B17] text-white font-sans overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=JetBrains+Mono:wght@400;500&family=Outfit:wght@300;400;500;600&display=swap');
        * { font-family: 'Outfit', sans-serif; box-sizing: border-box; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #050B17; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: #818cf8; }
      `}</style>

      {/* ── TOP NAV ── */}
      <nav className="fixed w-full z-50 bg-[#050B17]/90 backdrop-blur-xl border-b border-slate-800/80">
        <div className="container-6xl page-x">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate("/")}
              className="group flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-full overflow-hidden border border-cyan-400/40 flex items-center justify-center bg-slate-900/60">
                <img
                  src={SiewZhenImg}
                  alt="Chong Siew Zhen"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-mono text-sm text-slate-300 group-hover:text-cyan-400 transition-colors">
                Chong Siew Zhen
              </span>
            </button>

            <div className="hidden md:flex items-center gap-3">
              <div className="w-10 h-px bg-gradient-to-r from-violet-500 to-cyan-400 opacity-60" />
              <span className="text-xs font-mono tracking-[0.35em] uppercase"
                style={{ color: "#818cf8" }}>
                World of Time
              </span>
              <div className="w-10 h-px bg-gradient-to-r from-cyan-400 to-violet-500 opacity-60" />
            </div>

            {/* Mobile back button */}
            <button
              onClick={() => navigate("/")}
              className="lg:hidden flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all"
              style={{ color: "#818cf8", borderColor: "rgba(99,102,241,0.3)", background: "rgba(99,102,241,0.08)" }}
            >
              ← Portfolio
            </button>
          </div>
        </div>
      </nav>

      {/* ── BACK TO PORTFOLIO SIDE RAIL (desktop) ── */}
      <BackToPortfolioButton onClick={() => navigate("/")} />

      {/* ── MOBILE HOME CTA ── */}
      <button
        onClick={() => navigate("/")}
        className="lg:hidden fixed bottom-6 left-6 z-40 flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold active:scale-95 transition-all duration-200"
        style={{
          background: "linear-gradient(135deg, rgba(99,102,241,0.95) 0%, rgba(6,182,212,0.9) 70%)",
          color: "#050B17",
          boxShadow: "0 18px 40px -14px rgba(99,102,241,0.5), 0 0 0 1px rgba(99,102,241,0.14)",
        }}
        aria-label="Back to Home"
      >
        <ArrowLeft size={16} />
        <span className="font-mono tracking-wide">Home</span>
      </button>

      {/* ── MAIN CONTENT ── */}
      <main className="pt-20">
        {/*
          ── HOW TO WIRE UP FULL-SCREEN MODALS IN GrowthTimeLine.jsx ──────────

          GrowthTimeline has its own built-in inline popup. Replace it like this:

          STEP 1 — In GrowthTimeLine.jsx, import TimelinePopup:
            import { TimelinePopup } from './Journey';

          STEP 2 — Find the state that tracks which item is open, e.g.:
            const [selected, setSelected] = useState(null);

          STEP 3 — Find the existing popup JSX (usually a floating div with
            absolute/fixed positioning that shows item details). DELETE it entirely.

          STEP 4 — Add TimelinePopup once, anywhere inside the component return:
            <TimelinePopup
              item={selected}
              isOpen={!!selected}
              onClose={() => setSelected(null)}
            />

          STEP 5 — Make sure each card's onClick sets `selected`:
            onClick={() => setSelected(entry)}   // was: setSelected / setOpen / etc.

          The `item` object can have any of:
            title*, subtitle, role, description,
            date / year, category, type, award,
            color / accentColor, icon, emoji, image,
            highlights (string[]), tags (string[]), link
        */}
        <GrowthTimeline />
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-800 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full overflow-hidden border border-cyan-400/40 flex items-center justify-center bg-slate-900/60">
              <img
                src={SiewZhenImg}
                alt="Chong Siew Zhen"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-slate-500 text-sm font-mono">
              Chong Siew Zhen <span className="text-slate-700">·</span> UTM Software
              Engineering <span className="text-slate-700">·</span> CGPA 3.96
            </span>
          </div>
          <p className="text-slate-700 text-xs font-mono">
            © 2026 · Built with React + Tailwind · Imperfectly Perfect
          </p>
        </div>
      </footer>
    </div>
  );
}