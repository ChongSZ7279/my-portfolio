/**
 * AchievementsPodium — Refactored
 *
 * Changes vs original:
 *  • Decomposed into TechTag, ImageCarousel, LazyVideo, LinkButton,
 *    ModalSection, AchievementModal, PodiumBlock, OtherRow
 *  • New data schema (competition / project / role / impact / rankScore …)
 *  • rankScore drives sort — no more string-parsing
 *  • Keyboard nav: ESC closes, ← → navigate images
 *  • Lazy-loaded video iframe (IntersectionObserver)
 *  • React.memo on pure sub-components
 *  • Safe optional-chaining throughout
 *  • aria-* labels, role attributes, alt text
 *  • Smooth glassmorphism modal, staggered podium reveal,
 *    subtle first-place crown glow, responsive mobile layout
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  memo,
} from "react";
import { createPortal } from "react-dom";
import SectionHeader from "./components/SectionHeader";

// ─── Utility helpers ─────────────────────────────────────────────────────────

function alpha(hex, a) {
  if (typeof hex !== "string" || !hex.startsWith("#")) return hex;
  const h = hex.length === 7 ? hex : hex.slice(0, 7);
  return `${h}${a}`;
}

function isUrl(v) {
  return typeof v === "string" && /^https?:\/\//i.test(v);
}

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap');
`;

// ─── TechTag ─────────────────────────────────────────────────────────────────

const TechTag = memo(function TechTag({ label, accent }) {
  return (
    <span
      style={{
        padding: "4px 11px",
        borderRadius: 999,
        fontSize: 10,
        fontFamily: "'JetBrains Mono', monospace",
        fontWeight: 600,
        color: accent,
        background: alpha(accent, "18"),
        border: `1px solid ${alpha(accent, "35")}`,
        letterSpacing: "0.04em",
      }}
    >
      {label}
    </span>
  );
});



// ─── LazyVideo ────────────────────────────────────────────────────────────────

function getYouTubeEmbedUrl(src) {
  if (!src || typeof src !== "string") return null;
  if (src.includes("youtube.com/embed/")) return src;
  const watchMatch = src.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  const shortMatch = src.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  return null;
}

const LazyVideo = memo(function LazyVideo({ src, accent }) {
  const ref = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (!src) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setShouldLoad(true); obs.disconnect(); } },
      { threshold: 0, rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [src]);

  if (!src) return null;

  const embedUrl = getYouTubeEmbedUrl(src);

  return (
    <div
      ref={ref}
      style={{
        borderRadius: 12,
        overflow: "hidden",
        background: "rgba(0,0,0,0.5)",
        border: `1px solid ${alpha(accent, "25")}`,
        position: "relative",
        width: "100%",
        paddingTop: "56.25%",
      }}
    >
      {shouldLoad && embedUrl ? (
        <iframe
          src={`${embedUrl}?rel=0&modestbranding=1`}
          title="Pitching video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
        />
      ) : shouldLoad && !embedUrl ? (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, padding: "0 20px" }}>
          <span style={{ fontSize: 28 }}>🎬</span>
          <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#475569", textAlign: "center" }}>{src}</span>
        </div>
      ) : (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: alpha(accent, "20"), border: `1px solid ${alpha(accent, "40")}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: accent }}>
            ▶
          </div>
          <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#334155" }}>Loading video…</span>
        </div>
      )}
    </div>
  );
});



// ─── AchievementModal ─────────────────────────────────────────────────────────
// Shell mirrors ProjectModal exactly:
//   • Glassmorphism dark background + backdrop blur
//   • Image carousel at top (auto-advances)
//   • Ambient radial behind title
//   • Top accent gradient bar
//   • Absolute close button (top-right)
//   • Scrollable body with SectionLabel headers
// Content structure (achievement-specific):
//   Header  → icon · achievement label · competition name
//   Meta    → Date chip + Location chip  (new)
//   Project → name + summary
//   Role    → contribution text
//   Tech    → pill badges
//   Impact  → bordered bullet list
//   Video   → lazy youtube embed
//   Links   → Demo / GitHub CTAs

// ── Carousel used inside modal (auto-slides like ProjectModal's CarouselWithTimer) ──
const SLIDE_MS = 4000;

function AchCarousel({ images, accent, isOpen, onNav }) {
  const [idx, setIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const startRef = useRef(null);
  const rafRef = useRef(null);

  const goTo = useCallback((i) => { setIdx(i); setProgress(0); startRef.current = performance.now(); }, []);
  const prev = useCallback(() => goTo((idx - 1 + images.length) % images.length), [idx, images.length, goTo]);
  const next = useCallback(() => goTo((idx + 1) % images.length), [idx, images.length, goTo]);

  useEffect(() => { if (isOpen) { setIdx(0); setProgress(0); startRef.current = performance.now(); } }, [isOpen]);
  useEffect(() => { if (onNav) onNav({ prev, next }); }, [onNav, prev, next]);

  useEffect(() => {
    if (!isOpen || images.length <= 1) return;
    const tick = (now) => {
      if (!startRef.current) startRef.current = now;
      const pct = Math.min(((now - startRef.current) / SLIDE_MS) * 100, 100);
      setProgress(pct);
      if (pct >= 100) { goTo((idx + 1) % images.length); }
      else { rafRef.current = requestAnimationFrame(tick); }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isOpen, idx, images.length]);

  if (!images.length) return null;

  return (
    <div style={{ position: "relative", height: 260, overflow: "hidden", background: "rgba(4,8,18,0.9)" }}>
      {images.map((src, i) => (
        <div key={i} style={{
          position: "absolute", inset: 0,
          opacity: i === idx ? 1 : 0,
          transition: "opacity 0.55s ease",
          pointerEvents: i === idx ? "auto" : "none",
        }}>
          <img src={src} alt={`Screenshot ${i + 1}`} loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            onError={(e) => { e.target.style.display = "none"; }}
          />
        </div>
      ))}

      {/* Gradient overlay */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(to bottom, transparent 50%, rgba(5,10,20,0.92) 100%)" }} />

      {/* Progress bar */}
      {images.length > 1 && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "rgba(255,255,255,0.06)" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${accent}, ${accent}bb)`, boxShadow: `0 0 8px ${accent}`, transition: "none" }} />
        </div>
      )}

      {/* Thumbnails top-left */}
      {images.length > 1 && (
        <div style={{ position: "absolute", top: 10, left: 12, display: "flex", gap: 5, zIndex: 10 }}>
          {images.map((img, i) => (
            <button key={i} onClick={() => goTo(i)} aria-label={`Go to image ${i + 1}`}
              style={{
                width: 34, height: 24, borderRadius: 6, overflow: "hidden",
                border: `1.5px solid ${i === idx ? accent : "rgba(148,163,184,0.2)"}`,
                opacity: i === idx ? 1 : 0.55, padding: 0, cursor: "pointer",
                background: "#0a1628", transition: "border-color 0.2s, opacity 0.2s",
              }}>
              <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </button>
          ))}
        </div>
      )}

      {/* Counter + dots bottom-left */}
      {images.length > 1 && (
        <div style={{ position: "absolute", bottom: 12, left: 14, right: 14, display: "flex", alignItems: "center", gap: 10, zIndex: 5 }}>
          <span style={{
            fontSize: 10, fontFamily: "'JetBrains Mono',monospace",
            padding: "3px 9px", borderRadius: 6,
            color: accent, background: "rgba(4,9,20,0.85)",
            border: `1px solid ${alpha(accent, "30")}`, backdropFilter: "blur(8px)", flexShrink: 0,
          }}>
            {idx + 1}/{images.length}
          </span>
          <div style={{ display: "flex", gap: 5 }}>
            {images.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} aria-label={`Dot ${i + 1}`}
                style={{
                  width: i === idx ? 20 : 7, height: 7, borderRadius: 9999,
                  background: i === idx ? accent : "rgba(148,163,184,0.28)",
                  boxShadow: i === idx ? `0 0 8px ${accent}` : "none",
                  border: "none", cursor: "pointer", padding: 0, transition: "all 0.28s ease",
                }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── SectionLabel identical to ProjectModal's ──
function AchSectionLabel({ label, accent }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
      <span style={{
        fontSize: 10, fontFamily: "'JetBrains Mono',monospace",
        textTransform: "uppercase", letterSpacing: "0.14em",
        fontWeight: 700, color: accent,
      }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${alpha(accent, "35")}, transparent)` }} />
    </div>
  );
}

// ── GlassPanel identical to ProjectModal's ──
function AchGlassPanel({ accent, children }) {
  return (
    <div style={{
      borderRadius: 14,
      background: "rgba(255,255,255,0.025)",
      border: "1px solid rgba(255,255,255,0.065)",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      padding: "16px 18px",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, width: 90, height: 48,
        background: `radial-gradient(ellipse at 0% 0%, ${alpha(accent, "10")}, transparent 70%)`,
        pointerEvents: "none",
      }} />
      {children}
    </div>
  );
}

function AchievementModal({ item, onClose }) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const carouselNavRef = useRef(null);
  const accent = item?.tierColor ?? "#06b6d4";

  useEffect(() => {
    setMounted(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 340);
  }, [onClose]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft") carouselNavRef.current?.prev();
      if (e.key === "ArrowRight") carouselNavRef.current?.next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleClose]);

  const handleCarouselNav = useCallback((nav) => { carouselNavRef.current = nav; }, []);

  if (!item || !mounted) return null;

  const images = Array.isArray(item.images) ? item.images.filter(Boolean) : [];
  const hasLinks = item.github || item.demo;
  const isYoutube = item.video && (item.video.includes("youtube") || item.video.includes("youtu.be"));

  return createPortal(
    /* ── Backdrop ── */
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${item.competition} achievement details`}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        overflowY: "auto", padding: "1.5rem 1rem",
        background: `rgba(3,7,18,${visible ? "0.92" : "0"})`,
        backdropFilter: `blur(${visible ? "24px" : "0px"})`,
        WebkitBackdropFilter: `blur(${visible ? "24px" : "0px"})`,
        transition: "background 0.34s ease, backdrop-filter 0.34s ease",
      }}
    >
      {/* ── Modal card — same shell as ProjectModal ── */}
      <div
        style={{
          position: "relative", width: "100%", maxWidth: 680, margin: "auto",
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1) translateY(0)" : "scale(0.93) translateY(24px)",
          transition: "opacity 0.34s cubic-bezier(0.22,1,0.36,1), transform 0.34s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <div style={{
          position: "relative", borderRadius: 22, overflow: "hidden",
          background: "rgba(5,10,20,0.78)",
          backdropFilter: "blur(36px)", WebkitBackdropFilter: "blur(36px)",
          border: `1px solid ${alpha(accent, "28")}`,
          boxShadow: `0 0 0 1px ${alpha(accent, "10")}, 0 48px 120px -24px ${alpha(accent, "40")}`,
        }}>

          {/* Top accent gradient bar */}
          <div style={{ height: 2, background: `linear-gradient(90deg, transparent 5%, ${accent} 45%, ${alpha(accent, "bb")} 55%, transparent 95%)` }} />

          {/* Ambient radial behind content */}
          <div style={{
            position: "absolute", top: 0, left: "15%", width: 420, height: 240,
            background: `radial-gradient(ellipse, ${alpha(accent, "0b")} 0%, transparent 70%)`,
            pointerEvents: "none", zIndex: 0,
          }} />

          {/* Close button — absolute top-right, same as ProjectModal */}
          <button
            onClick={handleClose}
            aria-label="Close modal"
            style={{
              position: "absolute", top: 16, right: 16, zIndex: 30,
              width: 34, height: 34, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)",
              color: "#64748b", cursor: "pointer", fontSize: 13,
              transition: "color 0.2s, background 0.2s, transform 0.25s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.transform = "rotate(90deg)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.transform = "rotate(0deg)"; }}
          >✕</button>

          {/* ── IMAGE CAROUSEL (top, like ProjectModal) ── */}
          <div style={{ position: "relative", zIndex: 1 }}>
            {images.length > 0
              ? <AchCarousel images={images} accent={accent} isOpen={true} onNav={handleCarouselNav} />
              : (
                // No images — show a stylised ambient header band instead
                <div style={{
                  height: 100,
                  background: `radial-gradient(ellipse at 30% 50%, ${alpha(accent, "0e")}, transparent 65%)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ fontSize: 48, filter: `drop-shadow(0 0 18px ${alpha(accent, "66")})` }}>{item.icon ?? "🏅"}</span>
                </div>
              )
            }
          </div>

          {/* ── BODY ── */}
          <div style={{ padding: "28px 28px 36px", display: "flex", flexDirection: "column", gap: 28, position: "relative", zIndex: 1 }}>

            {/* ══ 1. HERO HEADER ══ */}
            <div>
              {/* Category row: index · tier */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                <span style={{
                  fontSize: 10, fontFamily: "'JetBrains Mono',monospace",
                  color: accent, letterSpacing: "0.1em", opacity: 0.85,
                }}>
                  {item.icon ?? "🏅"} · {item.tier}
                </span>
                {/* Achievement tier badge */}
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "4px 12px", borderRadius: 9999,
                  background: alpha(accent, "12"), border: `1px solid ${alpha(accent, "32")}`,
                  color: accent, fontFamily: "'JetBrains Mono',monospace", flexShrink: 0,
                  letterSpacing: "0.07em", textTransform: "uppercase",
                }}>{item.achievement}</span>
              </div>

              {/* Competition name */}
              <h2 style={{
                fontSize: 28, fontFamily: "'Syne',sans-serif", fontWeight: 900,
                color: "#fff", margin: "0 0 6px", lineHeight: 1.1,
                textShadow: `0 0 50px ${alpha(accent, "38")}`,
              }}>{item.competition}</h2>

              {/* ── Date + Location chips — the key new element ── */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
                {/* Calendar / Date chip */}
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "5px 13px", borderRadius: 8,
                  fontSize: 11, fontFamily: "'JetBrains Mono',monospace",
                  color: "#94a3b8",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.09)",
                }}>
                  {/* Calendar icon */}
                  <svg width="11" height="11" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                    <rect x="1" y="3" width="14" height="12" rx="2" stroke="#64748b" strokeWidth="1.4"/>
                    <path d="M1 7h14" stroke="#64748b" strokeWidth="1.4"/>
                    <path d="M5 1v3M11 1v3" stroke="#64748b" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                  {item.year}
                </span>

                {/* Location chip */}
                {item.organizer && (
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "5px 13px", borderRadius: 8,
                    fontSize: 11, fontFamily: "'JetBrains Mono',monospace",
                    color: "#94a3b8",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.09)",
                  }}>
                    {/* Location pin icon */}
                    <svg width="9" height="11" viewBox="0 0 12 16" fill="none" style={{ flexShrink: 0 }}>
                      <path d="M6 1C3.79 1 2 2.79 2 5c0 3.5 4 9 4 9s4-5.5 4-9c0-2.21-1.79-4-4-4z" stroke="#64748b" strokeWidth="1.4"/>
                      <circle cx="6" cy="5" r="1.5" stroke="#64748b" strokeWidth="1.2"/>
                    </svg>
                    {item.organizer}
                  </span>
                )}
              </div>

              {/* CTA links (Demo / GitHub) mirroring ProjectModal style */}
              {hasLinks && (
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {item.demo && (
                    <a href={item.demo} target="_blank" rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        padding: "10px 22px", borderRadius: 12,
                        fontSize: 12, fontWeight: 700, textDecoration: "none",
                        background: `linear-gradient(135deg, ${alpha(accent, "38")}, ${alpha(accent, "18")})`,
                        border: `1px solid ${alpha(accent, "52")}`,
                        color: accent,
                        boxShadow: `0 4px 22px -6px ${alpha(accent, "50")}`,
                        transition: "box-shadow 0.2s, transform 0.2s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 8px 32px -4px ${alpha(accent, "70")}`; e.currentTarget.style.transform = "translateY(-2px)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = `0 4px 22px -6px ${alpha(accent, "50")}`; e.currentTarget.style.transform = "translateY(0)"; }}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                        <polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/>
                      </svg>
                      Live Demo
                    </a>
                  )}
                  {item.github && (
                    <a href={item.github} target="_blank" rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        padding: "10px 22px", borderRadius: 12,
                        fontSize: 12, fontWeight: 700, textDecoration: "none",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(148,163,184,0.14)",
                        color: "#94a3b8",
                        transition: "background 0.2s, color 0.2s, transform 0.2s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.09)"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.transform = "translateY(0)"; }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                      </svg>
                      View Code
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* ══ 2. PROJECT ══ */}
            {(item.project || item.projectSummary) && (
              <div>
                <AchSectionLabel label="Project" accent={accent} />
                <AchGlassPanel accent={accent}>
                  {item.project && (
                    <div style={{ fontSize: 15, fontWeight: 800, color: "#e2e8f0", fontFamily: "'Syne',sans-serif", marginBottom: 7 }}>
                      {item.project}
                    </div>
                  )}
                  {item.projectSummary && (
                    <p style={{ color: "#cbd5e1", fontSize: 13, lineHeight: 1.72, margin: 0 }}>
                      {item.projectSummary}
                    </p>
                  )}
                </AchGlassPanel>
              </div>
            )}

            {/* ══ 3. ROLE ══ */}
            {item.role && (
              <div>
                <AchSectionLabel label="Your Role" accent={accent} />
                <AchGlassPanel accent={accent}>
                  <p style={{ color: "#cbd5e1", fontSize: 13, lineHeight: 1.72, margin: 0 }}>
                    {item.role}
                  </p>
                </AchGlassPanel>
              </div>
            )}

            {/* ══ 4. TECH STACK ══ */}
            {item.tech?.length > 0 && (
              <div>
                <AchSectionLabel label="Tech Stack" accent={accent} />
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {item.tech.map((t) => (
                    <TechTag key={t} label={t} accent={accent} />
                  ))}
                </div>
              </div>
            )}

            {/* ══ 5. IMPACT ══ */}
            {item.impact?.length > 0 && (
              <div>
                <AchSectionLabel label="Key Impact" accent={accent} />
                <AchGlassPanel accent={accent}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {item.impact.map((line, i) => (
                      <div key={i} style={{
                        display: "flex", gap: 10,
                        fontSize: 13, color: "#cbd5e1", lineHeight: 1.65,
                      }}>
                        <span style={{
                          color: accent, flexShrink: 0, marginTop: 4,
                          fontSize: 7, width: 14, height: 14, borderRadius: "50%",
                          border: `1.5px solid ${alpha(accent, "75")}`,
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          boxShadow: `0 0 7px ${alpha(accent, "40")}`,
                        }}>▸</span>
                        {line}
                      </div>
                    ))}
                  </div>
                </AchGlassPanel>
              </div>
            )}

            {/* ══ 6. PITCHING VIDEO ══ */}
            {item.video && (
              <div>
                <AchSectionLabel label="Pitching Video" accent={accent} />
                <LazyVideo src={item.video} accent={accent} />
              </div>
            )}

          </div>

          {/* Bottom accent edge */}
          <div style={{ height: 1, background: `linear-gradient(90deg, transparent 5%, ${alpha(accent, "28")} 50%, transparent 95%)` }} />
        </div>
      </div>
    </div>,
    document.body
  );
}


// ─── PodiumBlock ──────────────────────────────────────────────────────────────

const PodiumBlock = memo(function PodiumBlock({ item, podiumHeight, delay, animate, onOpen }) {
  const [hovered, setHovered] = useState(false);
  const isFirst = item.rank === 1;
  const accent = item.tierColor ?? "#06b6d4";
  const glow = alpha(accent, "66");
  const dim = alpha(accent, "14");

  return (
    <div
      role="listitem"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flex: 1,
        minWidth: 0,
        opacity: animate ? 1 : 0,
        transform: animate ? "translateY(0)" : "translateY(44px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s cubic-bezier(.22,1,.36,1) ${delay}s`,
      }}
    >
      {/* Card */}
      <button
        onClick={() => onOpen(item)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label={`View details for ${item.competition}`}
        style={{
          all: "unset",
          display: "block",
          width: "100%",
          maxWidth: isFirst ? 240 : 210,
          padding: "14px 14px 16px",
          borderRadius: 14,
          background: hovered
            ? `linear-gradient(145deg, ${dim}, rgba(6,10,22,0.96))`
            : "linear-gradient(145deg, rgba(9,15,33,0.92), rgba(6,10,22,0.96))",
          border: `1px solid ${alpha(accent, hovered ? "70" : "32")}`,
          boxShadow: isFirst && hovered
            ? `0 0 50px -8px ${glow}, 0 20px 60px -15px ${glow}`
            : hovered
            ? `0 20px 60px -15px ${glow}`
            : `0 8px 30px -10px ${alpha(accent, "44")}`,
          cursor: "pointer",
          transform: hovered ? "translateY(-7px) scale(1.02)" : "translateY(0) scale(1)",
          transition: "all 0.28s cubic-bezier(.22,1,.36,1)",
          textAlign: "center",
          boxSizing: "border-box",
        }}
      >
        {/* Crown glow for first place */}
        {isFirst && (
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: -18,
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: 18,
              filter: `drop-shadow(0 0 8px ${glow})`,
              animation: "ach-crownPulse 2.4s ease-in-out infinite",
              pointerEvents: "none",
            }}
          >
            👑
          </div>
        )}

        <div
          aria-hidden="true"
          style={{
            fontSize: isFirst ? 30 : 24,
            marginBottom: 8,
            filter: hovered ? `drop-shadow(0 0 10px ${accent})` : "none",
            transition: "filter 0.3s",
          }}
        >
          {item.icon ?? "🏅"}
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "3px 10px",
            borderRadius: 999,
            marginBottom: 8,
            fontSize: 9,
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: accent,
            background: dim,
            border: `1px solid ${alpha(accent, "35")}`,
          }}
        >
          {item.achievement}
        </div>

        <div
          style={{
            fontSize: isFirst ? 14 : 12.5,
            fontWeight: 900,
            color: "#f1f5f9",
            fontFamily: "'Syne', sans-serif",
            lineHeight: 1.2,
            marginBottom: 4,
          }}
        >
          {item.competition}
        </div>

        {item.project && (
          <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#475569", marginBottom: 4 }}>
            {item.project}
          </div>
        )}

        <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: accent, opacity: 0.75 }}>
          {item.year}
        </div>

        <div
          style={{
            marginTop: 10,
            fontSize: 9,
            fontFamily: "'JetBrains Mono', monospace",
            color: hovered ? accent : "#2d3f52",
            transition: "color 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
          }}
        >
          View details{" "}
          <span style={{ transform: hovered ? "translateX(3px)" : "translateX(0)", transition: "transform 0.2s" }}>→</span>
        </div>
      </button>

      {/* Connector */}
      <div
        aria-hidden="true"
        style={{
          width: 1,
          height: 18,
          background: `linear-gradient(to bottom, ${alpha(accent, "70")}, ${alpha(accent, "15")})`,
        }}
      />

      {/* Podium column */}
      <div
        aria-hidden="true"
        style={{
          width: "100%",
          height: podiumHeight,
          borderRadius: "10px 10px 0 0",
          background: `linear-gradient(180deg, ${dim} 0%, rgba(5,8,18,0.55) 100%)`,
          border: `1px solid ${alpha(accent, "28")}`,
          borderBottom: "none",
          boxShadow: `inset 0 1px 0 ${alpha(accent, "28")}, 0 -6px 24px -8px ${alpha(accent, "44")}`,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          paddingTop: 12,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <span
          style={{
            fontSize: isFirst ? 48 : 36,
            fontWeight: 900,
            fontFamily: "'Syne', sans-serif",
            color: accent,
            opacity: 0.1,
            lineHeight: 1,
            userSelect: "none",
            letterSpacing: "-0.04em",
          }}
        >
          {item.rank}
        </span>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${alpha(accent, "70")}, transparent)`,
          }}
        />
      </div>
    </div>
  );
});

// ─── OtherRow ─────────────────────────────────────────────────────────────────

const OtherRow = memo(function OtherRow({ item, index, animate, onOpen }) {
  const [hovered, setHovered] = useState(false);
  const accent = item.tierColor ?? "#06b6d4";

  return (
    <button
      onClick={() => onOpen(item)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`View details for ${item.competition}`}
      style={{
        all: "unset",
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "13px 18px",
        borderRadius: 12,
        background: hovered ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${hovered ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.05)"}`,
        cursor: "pointer",
        transition: "all 0.22s ease",
        transform: hovered ? "translateX(5px)" : "translateX(0)",
        opacity: animate ? 1 : 0,
        animation: animate ? `ach-fadeSlide 0.5s ease ${index * 0.07}s forwards` : "none",
        boxSizing: "border-box",
        width: "100%",
        textAlign: "left",
        "--ach-accent": accent,
      }}
      className="ach-other-row"
    >
      <span
        style={{
          fontSize: 10,
          fontFamily: "'JetBrains Mono', monospace",
          color: "#1e293b",
          width: 20,
          flexShrink: 0,
          textAlign: "right",
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.07)", flexShrink: 0 }} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          className="ach-other-title"
          style={{
            fontSize: 12,
            fontWeight: 800,
            color: "#e2e8f0",
            fontFamily: "'Syne', sans-serif",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {item.competition}{item.project ? ` · ${item.project}` : ""}
        </div>
        <div
          style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#475569", marginTop: 2 }}
          className="ach-other-achievement"
        >
          {item.achievement}
        </div>
      </div>

      <span
        style={{
          padding: "3px 10px",
          borderRadius: 999,
          flexShrink: 0,
          fontSize: 9,
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: accent,
          background: alpha(accent, "15"),
          border: `1px solid ${alpha(accent, "35")}`,
        }}
        className="ach-other-tier"
      >
        {item.tier}
      </span>

      <span
        style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#334155", flexShrink: 0 }}
        className="ach-other-year"
      >
        {item.year}
      </span>
    </button>
  );
});

// ─── Section label row ────────────────────────────────────────────────────────

function SectionDividerLabel({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28, justifyContent: "center" }}>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(255,255,255,0.07))" }} />
      <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: "#1e293b", letterSpacing: "0.16em", textTransform: "uppercase" }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, transparent, rgba(255,255,255,0.07))" }} />
    </div>
  );
}

// ─── AchievementsPodium (main) ────────────────────────────────────────────────

export default function AchievementsPodium({ achievements }) {
  const [podiumVisible, setPodiumVisible] = useState(false);
  const [listVisible, setListVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const podiumRef = useRef(null);
  const listRef = useRef(null);

  const { podiumItems, otherItems } = useMemo(() => {
    const arr = Array.isArray(achievements) ? achievements : [];
    const sorted = [...arr].sort((a, b) => {
      const s = (a.rankScore ?? 99) - (b.rankScore ?? 99);
      if (s !== 0) return s;
      return Number(b.year ?? 0) - Number(a.year ?? 0);
    });
    const top = sorted.slice(0, 3).map((it, i) => ({ ...it, rank: i + 1 }));
    const rest = sorted.slice(3);
    return { podiumItems: top, otherItems: rest };
  }, [achievements]);

  useObserveOnce(podiumRef, () => setPodiumVisible(true));
  useObserveOnce(listRef, () => setListVisible(true), 0.05);

  // Podium visual order: 2nd | 1st | 3rd
  const podiumOrder =
    podiumItems.length === 3
      ? [podiumItems[1], podiumItems[0], podiumItems[2]]
      : podiumItems;

  const podiumHeights = { 2: 88, 1: 132, 3: 62 };
  const podiumDelays  = { 2: 0.15, 1: 0.0, 3: 0.3 };

  return (
    <>
      {selected && (
        <AchievementModal item={selected} onClose={() => setSelected(null)} />
      )}

      <style>{`
        ${FONTS}
        @keyframes ach-fadeSlide {
          from { opacity: 0; transform: translateX(-14px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes ach-crownPulse {
          0%, 100% { opacity: 0.55; transform: translateX(-50%) scale(1); }
          50%       { opacity: 1;    transform: translateX(-50%) scale(1.15); }
        }
        @media (max-width: 600px) {
          .ach-podium-row {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 16px !important;
          }
          .ach-podium-row > div { flex: none !important; }
        }

        /* Mobile: free horizontal space in the "More Recognition" list */
        @media (max-width: 480px) {
          .ach-other-tier,
          .ach-other-year {
            display: none !important;
          }
          .ach-other-row {
            padding: 12px 14px !important;
          }
          .ach-other-title {
            white-space: normal !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            display: -webkit-box !important;
            -webkit-line-clamp: 2 !important;
            -webkit-box-orient: vertical !important;
          }

          /* Make achievement attribute pop on mobile only */
          .ach-other-achievement {
            display: inline-flex !important;
            align-items: center !important;
            width: fit-content !important;
            padding: 3px 10px !important;
            border-radius: 999px !important;
            color: var(--ach-accent) !important;
            background: color-mix(in srgb, var(--ach-accent) 14%, rgba(15,23,42,0.7)) !important;
            border: 1px solid color-mix(in srgb, var(--ach-accent) 35%, transparent) !important;
            box-shadow: 0 0 18px -8px color-mix(in srgb, var(--ach-accent) 55%, transparent) !important;
            letter-spacing: 0.06em !important;
            text-transform: uppercase !important;
            font-size: 9px !important;
          }
        }
      `}</style>

      <section
        id="achievements"
        aria-labelledby="achievements-heading"
        style={{ position: "relative", padding: "80px 0" }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>

          {/* Section heading */}
          <div id="achievements-heading">
            <SectionHeader
              align="center"
              label="recognition"
              title={
                <>
                  Awards &{" "}
                  <span
                    style={{
                      background: "linear-gradient(135deg, #f59e0b 0%, #ec4899 65%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Achievements
                  </span>
                </>
              }
              subtitle="Competition results and recognition earned through building real solutions under pressure."
              className="text-center"
            />
          </div>

          {/* ── Podium ── */}
          <div ref={podiumRef}>
            <SectionDividerLabel label="Top Finishes" />

            <div
              role="list"
              className="ach-podium-row"
              style={{ display: "flex", alignItems: "flex-end", gap: 10, justifyContent: "center" }}
            >
              {podiumOrder.map((item) => (
                <PodiumBlock
                  key={item.id}
                  item={item}
                  podiumHeight={podiumHeights[item.rank] ?? 80}
                  delay={podiumDelays[item.rank] ?? 0.1}
                  animate={podiumVisible}
                  onOpen={setSelected}
                />
              ))}
            </div>

            {/* Base platform */}
            <div style={{ height: 4, borderRadius: "0 0 6px 6px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 50%, transparent)", marginBottom: 10 }} />
            <div style={{ height: 2, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)", marginBottom: 56 }} />
          </div>

          {/* ── More achievements list ── */}
          {otherItems.length > 0 && (
            <div ref={listRef}>
              <SectionDividerLabel label="More Recognition" />

              <div role="list" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {otherItems.map((item, i) => (
                  <OtherRow
                    key={item.id}
                    item={item}
                    index={i}
                    animate={listVisible}
                    onOpen={setSelected}
                  />
                ))}
              </div>
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: 48 }}>
            <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#1e293b", letterSpacing: "0.1em" }}>
              Click any achievement to view full details ↑
            </span>
          </div>
        </div>
      </section>
    </>
  );
}

// ─── Hook: observe once ───────────────────────────────────────────────────────

function useObserveOnce(ref, cb, threshold = 0.1) {
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { cb(); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
}