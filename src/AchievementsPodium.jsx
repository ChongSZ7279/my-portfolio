/**
 * AchievementsPodium — Combined Design
 * 
 * Features:
 *  • Top Finishes: Podium cards (1st, 2nd, 3rd) with elevated design
 *  • More Recognition: List view with icons and details
 *  • Neon cyan/magenta color scheme
 *  • Glassmorphic panels with blur effects
 *  • Smooth animations and transitions
 *  • Modal system for full details
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

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap');
`;

// ─── TechTag ─────────────────────────────────────────────────────────────────

const TechTag = memo(function TechTag({ label, accent }) {
  return (
    <span
      style={{
        padding: "5px 13px",
        borderRadius: 999,
        fontSize: 10,
        fontFamily: "'JetBrains Mono', monospace",
        fontWeight: 600,
        color: accent,
        background: alpha(accent, "12"),
        border: `1.5px solid ${alpha(accent, "45")}`,
        letterSpacing: "0.05em",
        boxShadow: `0 0 12px ${alpha(accent, "25")}, inset 0 0 8px ${alpha(accent, "08")}`,
        transition: "all 0.3s ease",
        cursor: "default",
      }}
    >
      {label}
    </span>
  );
});

// ─── Modal Overlay ────────────────────────────────────────────────────────────

function ModalOverlay({ isOpen, onClose, children }) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      document.body.style.overflow = "hidden";
    } else {
      setVisible(false);
      const t = setTimeout(() => { setMounted(false); document.body.style.overflow = ""; }, 340);
      return () => clearTimeout(t);
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);
  useEffect(() => {
    const esc = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);
  if (!mounted) return null;
  return createPortal(
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      overflowY: "auto", padding: "1.5rem 1rem",
      background: `rgba(3,7,18,${visible ? "0.92" : "0"})`,
      backdropFilter: `blur(${visible ? "24px" : "0px"})`,
      WebkitBackdropFilter: `blur(${visible ? "24px" : "0px"})`,
      transition: "background 0.34s ease, backdrop-filter 0.34s ease",
    }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        position: "relative", width: "100%", maxWidth: 720, margin: "auto",
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1) translateY(0)" : "scale(0.93) translateY(24px)",
        transition: "opacity 0.34s cubic-bezier(0.22,1,0.36,1), transform 0.34s cubic-bezier(0.22,1,0.36,1)",
      }}>{children}</div>
    </div>,
    document.body
  );
}

// ─── Achievement Modal ────────────────────────────────────────────────────────

function AchievementModal({ item, isOpen, onClose }) {
  const accent = item.tierColor ?? "#06b6d4";

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose}>
      <div style={{
        position: "relative", borderRadius: 18, overflow: "hidden",
        background: "linear-gradient(135deg, rgba(10,14,39,0.85) 0%, rgba(15,10,35,0.75) 100%)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: `1.5px solid ${alpha(accent, "35")}`,
        boxShadow: `0 0 40px ${alpha(accent, "25")}, 0 40px 100px -20px ${alpha(accent, "35")}`,
      }}>

        {/* Top glow bar */}
        <div style={{ height: 2, background: `linear-gradient(90deg,transparent 5%,${accent} 45%,${accent}bb 55%,transparent 95%)` }} />

        {/* Close button */}
        <button onClick={onClose} style={{
          position: "absolute", top: 16, right: 16, zIndex: 30,
          width: 36, height: 36, borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(255,255,255,0.05)", border: `1px solid ${alpha(accent, "35")}`,
          color: accent, cursor: "pointer", fontSize: 16, transition: "all 0.2s",
          boxShadow: `0 0 12px ${alpha(accent, "15")}`,
        }}
          onMouseEnter={e => { e.currentTarget.style.background = alpha(accent, "15"); e.currentTarget.style.boxShadow = `0 0 20px ${alpha(accent, "35")}`; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.boxShadow = `0 0 12px ${alpha(accent, "15")}`; }}
        >✕</button>

        {/* Content */}
        <div style={{ padding: "28px 32px 32px", display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <h3 style={{ fontSize: 26, fontFamily: "'Syne',sans-serif", fontWeight: 900, color: "#fff", margin: "0 0 8px", lineHeight: 1.2, textShadow: `0 0 32px ${alpha(accent, "30")}` }}>{item.competition}</h3>
            <p style={{ fontSize: 11, fontFamily: "'JetBrains Mono',monospace", color: accent, margin: 0, letterSpacing: "0.05em" }}>{item.achievement} · {item.year}</p>
          </div>

          {/* Project */}
          {(item.project || item.projectSummary) && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
                <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, color: accent }}>▸ Project</span>
                <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${alpha(accent, "35")}, transparent)` }} />
              </div>
              <div style={{
                padding: "14px 16px",
                borderRadius: 10,
                background: `linear-gradient(135deg, ${alpha(accent, "08")} 0%, ${alpha(accent, "04")} 100%)`,
                border: `1px solid ${alpha(accent, "25")}`,
                backdropFilter: "blur(12px)",
              }}>
                {item.project && (
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#e2e8f0", fontFamily: "'Syne',sans-serif", marginBottom: 6 }}>
                    {item.project}
                  </div>
                )}
                {item.projectSummary && (
                  <p style={{ color: "#cbd5e1", fontSize: 13, lineHeight: 1.65, margin: 0 }}>
                    {item.projectSummary}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Role */}
          {item.role && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
                <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, color: accent }}>▸ Your Role</span>
                <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${alpha(accent, "35")}, transparent)` }} />
              </div>
              <div style={{
                padding: "14px 16px",
                borderRadius: 10,
                background: `linear-gradient(135deg, ${alpha(accent, "08")} 0%, ${alpha(accent, "04")} 100%)`,
                border: `1px solid ${alpha(accent, "25")}`,
                backdropFilter: "blur(12px)",
              }}>
                <p style={{ color: "#cbd5e1", fontSize: 13, lineHeight: 1.65, margin: 0 }}>
                  {item.role}
                </p>
              </div>
            </div>
          )}

          {/* Tech Stack */}
          {item.tech?.length > 0 && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
                <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, color: accent }}>▸ Tech Stack</span>
                <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${alpha(accent, "35")}, transparent)` }} />
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {item.tech.map((t) => (
                  <TechTag key={t} label={t} accent={accent} />
                ))}
              </div>
            </div>
          )}

          {/* Impact */}
          {item.impact?.length > 0 && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
                <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, color: accent }}>▸ Key Impact</span>
                <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${alpha(accent, "35")}, transparent)` }} />
              </div>
              <div style={{
                padding: "14px 16px",
                borderRadius: 10,
                background: `linear-gradient(135deg, ${alpha(accent, "08")} 0%, ${alpha(accent, "04")} 100%)`,
                border: `1px solid ${alpha(accent, "25")}`,
                backdropFilter: "blur(12px)",
              }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {item.impact.map((line, i) => (
                    <div key={i} style={{
                      display: "flex", gap: 10,
                      fontSize: 13, color: "#cbd5e1", lineHeight: 1.65,
                    }}>
                      <span style={{
                        color: accent, flexShrink: 0, marginTop: 3,
                        fontSize: 8, width: 16, height: 16, borderRadius: "50%",
                        border: `1.5px solid ${alpha(accent, "60")}`,
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        boxShadow: `0 0 10px ${alpha(accent, "35")}`,
                      }}>▸</span>
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom accent edge */}
        <div style={{ height: 1, background: `linear-gradient(90deg, transparent 5%, ${alpha(accent, "25")} 50%, transparent 95%)` }} />
      </div>
    </ModalOverlay>
  );
}

// ─── Elevated Achievement Card ───────────────────────────────────────────────────

const ElevatedCard = memo(function ElevatedCard({ item, rank, animate, delay, onOpen }) {
  const [hovered, setHovered] = useState(false);
  const accent = item.tierColor ?? "#06b6d4";
  const glow = alpha(accent, "70");
  
  // Card dimensions and positioning
  const cardSizes = { 1: { w: 380, h: 340 }, 2: { w: 320, h: 300 }, 3: { w: 320, h: 300 } };
  const positions = { 1: { x: "50%", y: 0 }, 2: { x: "calc(50% + 220px)", y: 40 }, 3: { x: "calc(50% - 220px)", y: 40 } };

  return (
    <div
      style={{
        position: "absolute",
        left: positions[rank].x,
        top: positions[rank].y,
        transform: "translateX(-50%)",
        opacity: animate ? 1 : 0,
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s cubic-bezier(.22,1,.36,1) ${delay}s`,
      }}
    >
      {/* Crown for 1st place */}
      {rank === 1 && (
        <div style={{
          position: "absolute",
          top: -35,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: 32,
          filter: `drop-shadow(0 0 16px ${glow})`,
          animation: "crownPulse 2.4s ease-in-out infinite",
          zIndex: 50,
        }}>
          👑
        </div>
      )}

      {/* Card */}
      <button
        onClick={() => onOpen(item)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          all: "unset",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          width: cardSizes[rank].w,
          minHeight: cardSizes[rank].h,
          padding: rank === 1 ? "32px 28px" : "24px 20px",
          borderRadius: 16,
          background: hovered
            ? `linear-gradient(135deg, ${alpha(accent, "18")} 0%, ${alpha(accent, "08")} 100%)`
            : `linear-gradient(135deg, ${alpha(accent, "12")} 0%, ${alpha(accent, "04")} 100%)`,
          border: `1.5px solid ${alpha(accent, hovered ? "50" : "35")}`,
          boxShadow: hovered
            ? `0 0 50px ${glow}, 0 30px 80px -20px ${glow}, inset 0 0 24px ${alpha(accent, "12")}`
            : `0 0 30px ${alpha(accent, "25")}, 0 20px 60px -15px ${alpha(accent, "20")}, inset 0 0 16px ${alpha(accent, "08")}`,
          cursor: "pointer",
          transform: hovered ? "translateY(-12px)" : "translateY(0)",
          transition: "all 0.3s cubic-bezier(.22,1,.36,1)",
          textAlign: "center",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        {/* Medal Icon */}
        <div style={{
          fontSize: rank === 1 ? 48 : 40,
          marginBottom: rank === 1 ? 20 : 16,
          filter: hovered ? `drop-shadow(0 0 12px ${accent})` : "none",
          transition: "filter 0.3s",
        }}>
          {item.icon ?? "🏅"}
        </div>

        {/* Achievement Badge */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "6px 14px",
          borderRadius: 999,
          marginBottom: rank === 1 ? 16 : 12,
          fontSize: 9,
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: accent,
          background: alpha(accent, "12"),
          border: `1px solid ${alpha(accent, "40")}`,
          boxShadow: `0 0 12px ${alpha(accent, "20")}`,
        }}>
          {item.achievement}
        </div>

        {/* Competition Name */}
        <div style={{
          fontSize: rank === 1 ? 20 : 16,
          fontWeight: 900,
          color: "#f1f5f9",
          fontFamily: "'Syne', sans-serif",
          lineHeight: 1.3,
          marginBottom: 8,
          maxWidth: "100%",
        }}>
          {item.competition}
        </div>

        {/* Project Name */}
        {item.project && (
          <div style={{
            fontSize: rank === 1 ? 12 : 10,
            fontFamily: "'JetBrains Mono', monospace",
            color: "#94a3b8",
            marginBottom: rank === 1 ? 12 : 8,
          }}>
            {item.project}
          </div>
        )}

        {/* Year */}
        <div style={{
          fontSize: rank === 1 ? 11 : 9,
          fontFamily: "'JetBrains Mono', monospace",
          color: accent,
          opacity: 0.8,
          marginBottom: rank === 1 ? 16 : 12,
        }}>
          {item.year}
        </div>

        {/* View Details Link */}
        <div style={{
          fontSize: rank === 1 ? 11 : 9,
          fontFamily: "'JetBrains Mono', monospace",
          color: hovered ? accent : "#475569",
          transition: "color 0.2s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
        }}>
          View details
          <span style={{
            transform: hovered ? "translateX(3px)" : "translateX(0)",
            transition: "transform 0.2s",
          }}>→</span>
        </div>
      </button>
    </div>
  );
});

// ─── Achievement List Item (More Recognition) ──────────────────────────────

const AchievementListItem = memo(function AchievementListItem({ item, index, animate, onOpen }) {
  const [hovered, setHovered] = useState(false);
  const accent = item.tierColor ?? "#06b6d4";

  return (
    <button
      onClick={() => onOpen(item)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        all: "unset",
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "16px 18px",
        borderRadius: 12,
        background: hovered
          ? `linear-gradient(135deg, ${alpha(accent, "15")} 0%, ${alpha(accent, "08")} 100%)`
          : `linear-gradient(135deg, ${alpha(accent, "08")} 0%, transparent 100%)`,
        border: `1px solid ${alpha(accent, hovered ? "40" : "25")}`,
        boxShadow: hovered
          ? `0 0 24px ${alpha(accent, "25")}, inset 0 0 16px ${alpha(accent, "08")}`
          : `0 0 16px ${alpha(accent, "12")}`,
        cursor: "pointer",
        transform: hovered ? "translateX(6px)" : "translateX(0)",
        transition: "all 0.2s ease",
        opacity: animate ? 1 : 0,
        transitionDelay: `${0.05 + index * 0.03}s`,
        width: "100%",
      }}
    >
      {/* Icon */}
      <div style={{
        fontSize: 24,
        flexShrink: 0,
        filter: hovered ? `drop-shadow(0 0 8px ${accent})` : "none",
        transition: "filter 0.2s",
      }}>
        {item.icon ?? "🏆"}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
        <div style={{
          fontSize: 13,
          fontWeight: 800,
          color: "#f1f5f9",
          fontFamily: "'Syne', sans-serif",
          marginBottom: 4,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}>
          {item.competition}
        </div>
        <div style={{
          fontSize: 11,
          fontFamily: "'JetBrains Mono', monospace",
          color: accent,
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
        }}>
          <span>{item.achievement}</span>
          <span>·</span>
          <span>{item.year}</span>
        </div>
      </div>

      {/* Arrow */}
      <div style={{
        fontSize: 10,
        fontFamily: "'JetBrains Mono', monospace",
        color: hovered ? accent : "#475569",
        transition: "color 0.2s",
        flexShrink: 0,
      }}>
        →
      </div>
    </button>
  );
});

// ─── ROOT COMPONENT ───────────────────────────────────────────────────────────

export default function AchievementsPodium({ achievements = [] }) {
  const podiumRef = useRef(null);
  const listRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const [podiumVisible, setPodiumVisible] = useState(false);
  const [listVisible, setListVisible] = useState(false);

  // Sort by rank
  const podiumOrder = useMemo(
    () => achievements.filter(a => a.rank && a.rank <= 3).sort((a, b) => a.rank - b.rank),
    [achievements]
  );

  const otherItems = useMemo(
    () => achievements.filter(a => !a.rank || a.rank > 3),
    [achievements]
  );

  // Observe podium
  useEffect(() => {
    if (!podiumRef.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setPodiumVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(podiumRef.current);
    return () => obs.disconnect();
  }, []);

  // Observe list
  useEffect(() => {
    if (!listRef.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setListVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(listRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{`
        ${FONTS}
        
        @keyframes crownPulse {
          0%, 100% { transform: translateX(-50%) scale(1); }
          50% { transform: translateX(-50%) scale(1.1); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @media (max-width: 768px) {
          .ach-podium-container { height: 400px; }
        }
      `}</style>

      {selected && (
        <AchievementModal
          item={selected}
          isOpen={!!selected}
          onClose={() => setSelected(null)}
        />
      )}

      <section id="achievements" aria-labelledby="achievements-heading" style={{ position: "relative", padding: "80px 0" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px" }}>

          {/* Section heading */}
          <div id="achievements-heading">
            <SectionHeader
              align="center"
              label="recognition"
              title={
                <>
                  Awards &{" "}
                  <span style={{
                    background: "linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}>
                    Achievements
                  </span>
                </>
              }
              subtitle="Competition results and recognition earned through building real solutions."
            />
          </div>

          {/* ── Top Finishes (Podium) ── */}
          {podiumOrder.length > 0 && (
            <div ref={podiumRef} style={{ marginBottom: 60 }}>
              <div style={{
                fontSize: 11,
                fontFamily: "'JetBrains Mono', monospace",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                fontWeight: 700,
                color: "#475569",
                marginBottom: 32,
                textAlign: "center",
              }}>
                TOP FINISHES
              </div>

              {/* Elevated Cards Container */}
              <div
                role="list"
                style={{
                  position: "relative",
                  height: 420,
                  marginBottom: 60,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-start",
                }}
              >
                {podiumOrder.map((item) => (
                  <ElevatedCard
                    key={item.id}
                    item={item}
                    rank={item.rank}
                    animate={podiumVisible}
                    delay={item.rank === 1 ? 0.1 : item.rank === 2 ? 0.25 : 0.4}
                    onOpen={setSelected}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── More Recognition (List) ── */}
          {otherItems.length > 0 && (
            <div ref={listRef}>
              <div style={{
                fontSize: 11,
                fontFamily: "'JetBrains Mono', monospace",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                fontWeight: 700,
                color: "#475569",
                marginBottom: 24,
              }}>
                MORE RECOGNITION
              </div>

              <div role="list" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {otherItems.map((item, i) => (
                  <AchievementListItem
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