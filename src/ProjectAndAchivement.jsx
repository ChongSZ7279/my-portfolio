import { useEffect, useMemo, useState, useCallback } from "react";
import SectionHeader from "./components/SectionHeader";
import { ACHIEVEMENTS as ACHIEVEMENTS_DATA } from "./data/achievements";
import { PROJECTS } from "./data/projects";

// Tier color is derived from the competition level itself, not stored
// per-award — so "International" (or any tier) always reads the same
// color no matter which entry it's on. Scale runs cool → warm as the
// stage gets bigger: University and State stay in the site's existing
// cyan/emerald accents; National steps up to violet; International,
// the highest stage, takes the gold reserved for it elsewhere on the
// page (medal emoji, highlight box).
const TIER_COLORS = {
  University: "#22d3ee",
  State: "#34d399",
  National: "#a78bfa",
  International: "#f59e0b",
};

function getTierColor(tier) {
  return TIER_COLORS[tier] || "#34d399";
}

function Img({ src, alt, style }) {
  if (!src) {
    return (
      <div
        style={{
          ...style,
          display: "grid",
          placeItems: "center",
          background: "linear-gradient(135deg, rgba(9,20,15,0.95), rgba(15,30,22,0.9))",
          color: "#7d9488",
          fontSize: 12,
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12,
        }}
      >
        No preview
      </div>
    );
  }
  return <img src={src} alt={alt} style={style} loading="lazy" />;
}

function ProjectPlaceholder({ category, status }) {
  return (
    <div className="pa-placeholder">
      <div className="pa-placeholder-ring" />
      <div className="pa-placeholder-core">
        <span className="pa-placeholder-eyebrow">{category}</span>
        <span className="pa-placeholder-status">{status}</span>
      </div>
    </div>
  );
}

function AchievementCard({ item, onClick }) {
  return (
    <article className="pa-achievement-col" style={{ "--tier-color": getTierColor(item.tier) }}>
      <div className="pa-timeline-year">{item.year}</div>
      <div className="pa-timeline-node" />
      <div className="pa-timeline-stem" />
      <div
        className="pa-achievement-card"
        role="button"
        tabIndex={0}
        onClick={() => onClick?.(item)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick?.(item);
          }
        }}
      >
        <div className="pa-achievement-icon">{item.icon}</div>
        <span className="pa-tier-badge">{item.tier}</span>
        <h4>{item.competition}</h4>
        <p>{item.project}</p>
      </div>
    </article>
  );
}

function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
  } catch {
    return null;
  }
  return null;
}

function toPoints(text) {
  if (!text) return [];
  return text
    .split(/[.;]\s+/)
    .map((point) => point.trim())
    .filter(Boolean);
}

export default function ProjectAndAchievement() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeAchievement, setActiveAchievement] = useState(null);

  const projects = PROJECTS || [];
  const activeProject = projects[activeIndex] || null;

  const timelineItems = useMemo(() => {
    return [...(ACHIEVEMENTS_DATA || [])]
      .filter((a) => {
        const year = Number(a.year);
        return year >= 2019 && year <= 2026;
      })
      .sort((a, b) => Number(a.year) - Number(b.year) || a.rankScore - b.rankScore);
  }, []);

  const handleProjectSwitch = useCallback((idx) => {
    if (idx === activeIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIndex(idx);
      setIsTransitioning(false);
    }, 200);
  }, [activeIndex]);

  const videoEmbedUrl = getYouTubeEmbedUrl(activeProject?.videoUrl);
  const showMobileFrame =
    Boolean(activeProject?.category?.toLowerCase().includes("mobile")) ||
    Boolean(activeProject?.tech?.some((t) => t.toLowerCase().includes("flutter")));
  const challengePoints = toPoints(activeProject?.problem);
  const solutionPoints = toPoints(activeProject?.solution);
  const highlightPoints = (activeProject?.impact || []).length
    ? activeProject.impact
    : [activeProject?.status].filter(Boolean);

  useEffect(() => {
    if (isPaused || projects.length <= 1) return undefined;
    const timer = setInterval(() => {
      const nextIndex = (activeIndex + 1) % projects.length;
      handleProjectSwitch(nextIndex);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeIndex, handleProjectSwitch, isPaused, projects.length]);

  useEffect(() => {
    if (!activeAchievement) return undefined;
    document.body.style.overflow = "hidden";
    const onEsc = (e) => {
      if (e.key === "Escape") setActiveAchievement(null);
    };
    window.addEventListener("keydown", onEsc);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onEsc);
    };
  }, [activeAchievement]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500;1,9..144,600;1,9..144,700&family=Space+Grotesk:wght@400;500;700&family=Outfit:wght@400;500;600;700&display=swap');

        /* ── Shell & background ──────────────────────────────── */
        .pa-shell {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          padding: 88px 0;
        }

        .pa-shell::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -2;
          background:
            radial-gradient(50rem 30rem at 10% 12%, rgba(52,211,153,0.08), transparent 68%),
            radial-gradient(46rem 28rem at 90% 18%, rgba(34,211,238,0.07), transparent 70%);
        }

        .pa-shell::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          pointer-events: none;
          background-image: radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 28px 28px;
        }

        /* ── Glass card ──────────────────────────────────────── */
        .pa-glass {
          border: 1px solid rgba(255,255,255,0.08);
          background: linear-gradient(
            145deg,
            rgba(255,255,255,0.055),
            rgba(255,255,255,0.016)
          );
          backdrop-filter: blur(36px);
          -webkit-backdrop-filter: blur(36px);
          border-radius: 28px;
          box-shadow:
            0 2px 0 rgba(255,255,255,0.05) inset,
            0 24px 64px rgba(0,0,0,0.55),
            0 0 0 0.5px rgba(255,255,255,0.03) inset;
        }

        /* ── Project frame — carries per-project accent color down to
               both the feature card and the switcher dots below it ── */
        .pa-project-frame {
          transition: color .4s ease;
        }

        /* ── Feature wrap ────────────────────────────────────── */
        .pa-feature-wrap {
          padding: 1.5rem;
          transition: transform .5s cubic-bezier(.22,1,.36,1), box-shadow .5s ease;
          animation: pa-fade-up .6s cubic-bezier(.22,1,.36,1) both;
          position: relative;
          overflow: hidden;
          min-height: 500px;
        }

        .pa-feature-wrap::before {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--proj-accent, #34d399) 65%, transparent), rgba(34,211,238,0.5), transparent);
          opacity: .7;
          transition: background .4s ease;
        }

        @keyframes pa-fade-up {
          from { opacity: 0; transform: translateY(36px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Content transition ──────────────────────────────── */
        .pa-content-transition {
          transition: opacity .2s ease, transform .2s ease;
        }

        .pa-content-transition.is-hiding {
          opacity: 0;
          transform: scale(0.985) translateY(6px);
        }

        /* ── Feature grid ────────────────────────────────────── */
        .pa-feature-grid {
          display: grid;
          grid-template-columns: 1.1fr 1.18fr .92fr;
          gap: 1.25rem;
          align-items: stretch;
          min-height: 100%;
        }

        /* ── Left column ─────────────────────────────────────── */
        .pa-feature-left {
          display: flex;
          flex-direction: column;
          gap: 0;
          min-height: 100%;
        }

        .pa-feature-left h3 {
          margin: .6rem 0 0;
          font-size: clamp(2rem, 2.6vw, 2.75rem);
          line-height: 1.1;
          font-weight: 600;
          font-style: italic;
          background: linear-gradient(100deg, #eef5f0 12%, var(--proj-accent, #34d399) 52%, #22d3ee 100%);
          -webkit-background-clip: text;
          color: transparent;
          background-clip: text;
          letter-spacing: -0.01em;
          font-family: 'Fraunces', serif;
          transition: background .4s ease;
        }

        .pa-feature-left > p {
          margin: .6rem 0 0;
          color: #8fa79b;
          line-height: 1.65;
          font-size: .9rem;
          font-family: 'Outfit', sans-serif;
        }

        /* ── Eyebrow row: category badge + timeframe pill ───── */
        .pa-eyebrow-row {
          display: flex;
          align-items: center;
          gap: .5rem;
          flex-wrap: wrap;
        }

        /* ── Badge ───────────────────────────────────────────── */
        .pa-badge {
          display: inline-flex;
          align-items: center;
          gap: .3rem;
          padding: .28rem .55rem;
          border-radius: 999px;
          font: 600 9px 'Space Grotesk', monospace;
          text-transform: uppercase;
          letter-spacing: .12em;
          color: color-mix(in srgb, var(--proj-accent, #34d399) 85%, #fff 15%);
          border: 1px solid color-mix(in srgb, var(--proj-accent, #34d399) 40%, transparent);
          background: color-mix(in srgb, var(--proj-accent, #34d399) 12%, transparent);
          width: fit-content;
          transition: all .4s ease;
        }

        .pa-badge::before {
          content: "";
          display: inline-block;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--proj-accent, #34d399);
          box-shadow: 0 0 6px var(--proj-accent, #34d399);
          animation: pa-blink 2s ease infinite;
          transition: background .4s ease;
        }

        @keyframes pa-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: .3; }
        }

        .pa-status-pill {
          font: 600 9px 'Space Grotesk', monospace;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: #8fa79b;
          border: 1px solid rgba(255,255,255,0.09);
          background: rgba(255,255,255,0.02);
          padding: .28rem .55rem;
          border-radius: 999px;
        }

        /* ── Tech pills ──────────────────────────────────────── */
        .pa-tech-row {
          margin-top: .85rem;
          display: flex;
          flex-wrap: wrap;
          gap: .4rem;
        }

        .pa-tech-pill {
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(9,20,15,0.55);
          color: #8fa79b;
          padding: .22rem .55rem;
          font: 500 10px 'Space Grotesk', monospace;
          transition: all .25s ease;
          cursor: default;
        }

        .pa-tech-pill:hover {
          background: color-mix(in srgb, var(--proj-accent, #a78bfa) 16%, transparent);
          border-color: color-mix(in srgb, var(--proj-accent, #a78bfa) 45%, transparent);
          color: color-mix(in srgb, var(--proj-accent, #a78bfa) 80%, #fff 20%);
          transform: translateY(-2px);
        }

        /* ── Highlight box ───────────────────────────────────── */
        .pa-highlight-box {
          margin-top: .95rem;
          border-radius: 14px;
          border: 1px solid rgba(251,191,36,0.28);
          background: linear-gradient(135deg, rgba(251,191,36,0.07), rgba(253,224,71,0.04));
          padding: .8rem .9rem;
          position: relative;
          overflow: hidden;
        }

        .pa-highlight-box::before {
          content: "";
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 2px;
          background: linear-gradient(to bottom, #fbbf24, rgba(251,191,36,0.2));
          border-radius: 0 2px 2px 0;
        }

        .pa-highlight-box h4 {
          margin: 0 0 .5rem;
          color: #fcd34d;
          font: 700 10px 'Space Grotesk', monospace;
          text-transform: uppercase;
          letter-spacing: .1em;
        }

        /* ── Point list ──────────────────────────────────────── */
        .pa-point-list {
          margin: .5rem 0 0;
          padding-left: 1.1rem;
          display: grid;
          gap: .3rem;
          list-style: none;
          padding-left: 0;
        }

        .pa-point-list li {
          color: #cdd9d2;
          font-size: .8rem;
          line-height: 1.5;
          padding-left: 1rem;
          position: relative;
        }

        .pa-point-list li::before {
          content: "→";
          position: absolute;
          left: 0;
          color: #4a5f54;
          font-size: .75rem;
        }

        /* ── Action row ──────────────────────────────────────── */
        .pa-action-row {
          margin-top: 1rem;
          display: flex;
          gap: .5rem;
          flex-wrap: wrap;
        }

        .pa-link {
          text-decoration: none;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.12);
          color: #e5efe8;
          background: rgba(9,20,15,0.7);
          font: 600 11px 'Outfit', sans-serif;
          padding: .5rem .9rem;
          transition: all .22s ease;
          display: inline-flex;
          align-items: center;
          gap: .3rem;
        }

        .pa-link:hover {
          transform: translateY(-2px);
          border-color: color-mix(in srgb, var(--proj-accent, #34d399) 55%, transparent);
          background: color-mix(in srgb, var(--proj-accent, #34d399) 10%, transparent);
          color: color-mix(in srgb, var(--proj-accent, #34d399) 80%, #fff 20%);
          box-shadow: 0 4px 20px color-mix(in srgb, var(--proj-accent, #34d399) 18%, transparent);
        }

        .pa-link:active {
          transform: translateY(0);
        }

        /* Primary CTA — solid, only shown when a real live URL exists */
        .pa-link.pa-link-primary {
          background: color-mix(in srgb, var(--proj-accent, #34d399) 88%, #000 2%);
          border-color: transparent;
          color: #06120c;
          font-weight: 700;
        }

        .pa-link.pa-link-primary:hover {
          transform: translateY(-2px);
          background: color-mix(in srgb, var(--proj-accent, #34d399) 95%, #fff 5%);
          color: #06120c;
          box-shadow: 0 8px 26px color-mix(in srgb, var(--proj-accent, #34d399) 45%, transparent);
        }

        /* ── Project switcher ────────────────────────────────── */
        .pa-switch-row {
          margin-top: .8rem;
          display: flex;
          gap: .4rem;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
        }

        .pa-switch-btn {
          position: relative;
          height: 3px;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          background: rgba(255,255,255,0.14);
          transition: all .3s cubic-bezier(.22,1,.36,1);
          width: 28px;
          padding: 0;
          overflow: hidden;
        }

        .pa-switch-btn::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, var(--proj-accent, #34d399), #22d3ee);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform .3s ease;
          border-radius: inherit;
        }

        .pa-switch-btn.active {
          width: 42px;
          background: color-mix(in srgb, var(--proj-accent, #34d399) 28%, transparent);
        }

        .pa-switch-btn.active::after {
          transform: scaleX(1);
        }

        .pa-switch-btn:not(.active):hover {
          background: rgba(255,255,255,0.28);
          width: 34px;
        }

        /* ── Feature image center — the "bombastic" laptop display ── */
        .pa-feature-image {
          position: relative;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.09);
          min-height: 240px;
          background: radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--proj-accent, #34d399) 16%, transparent), rgba(9,20,15,0.92));
          display: grid;
          place-items: center;
          padding: 1rem;
          overflow: hidden;
          transition: background .4s ease;
        }

        .pa-feature-image::after {
          content: "";
          position: absolute;
          left: 0; right: 0;
          height: 60%;
          background: linear-gradient(to bottom, transparent, color-mix(in srgb, var(--proj-accent, #34d399) 14%, transparent), transparent);
          animation: pa-scan 5s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes pa-scan {
          0%   { transform: translateY(-100%); opacity: 0; }
          20%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateY(200%); opacity: 0; }
        }

        /* ── Placeholder (no screenshot yet) ─────────────────── */
        .pa-placeholder {
          position: relative;
          display: grid;
          place-items: center;
          width: 200px;
          height: 200px;
        }

        .pa-placeholder-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: conic-gradient(from 0deg, transparent, color-mix(in srgb, var(--proj-accent, #34d399) 55%, transparent), transparent 62%);
          animation: pa-rotate 7s linear infinite;
          -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px));
          mask: radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px));
        }

        @keyframes pa-rotate {
          to { transform: rotate(360deg); }
        }

        .pa-placeholder-core {
          display: grid;
          gap: .35rem;
          justify-items: center;
          text-align: center;
          padding: 0 1.2rem;
        }

        .pa-placeholder-eyebrow {
          font: 700 10px 'Space Grotesk', monospace;
          text-transform: uppercase;
          letter-spacing: .1em;
          color: color-mix(in srgb, var(--proj-accent, #34d399) 85%, #fff 15%);
        }

        .pa-placeholder-status {
          font: 500 11px 'Outfit', sans-serif;
          color: #6b8277;
        }

        /* ── Device frames ───────────────────────────────────── */
        .pa-device {
          width: 100%;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(4,10,7,0.92);
          position: relative;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.04) inset,
            0 24px 48px -12px rgba(0,0,0,0.7),
            0 0 34px color-mix(in srgb, var(--proj-accent, #34d399) 22%, transparent);
          transition: box-shadow .4s ease;
        }

        .pa-device.laptop {
          max-width: 440px;
          border-radius: 16px;
          padding: .55rem .55rem .8rem;
        }

        .pa-device.mobile {
          max-width: 235px;
          border-radius: 32px;
          padding: .5rem .45rem .65rem;
        }

        .pa-device-notch {
          width: 60px;
          height: 6px;
          border-radius: 999px;
          background: rgba(255,255,255,0.14);
          margin: 0 auto .35rem;
        }

        .pa-device.laptop .pa-device-notch {
          width: 40px;
          height: 4px;
        }

        .pa-device-screen {
          overflow: hidden;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.1);
          background: #071410;
        }

        .pa-device.mobile .pa-device-screen {
          border-radius: 22px;
        }

        .pa-device-screen img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          aspect-ratio: 16 / 9;
        }

        .pa-device.mobile .pa-device-screen img {
          aspect-ratio: 9 / 16;
        }

        /* ── Monitor (YouTube) ───────────────────────────────── */
        .pa-monitor {
          width: 100%;
          max-width: 440px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.13);
          background: rgba(4,10,7,0.88);
          box-shadow: 0 0 34px color-mix(in srgb, var(--proj-accent, #34d399) 26%, transparent);
          overflow: hidden;
          transition: box-shadow .4s ease;
        }

        .pa-monitor-top {
          height: 20px;
          border-bottom: 1px solid rgba(255,255,255,0.09);
          background: rgba(255,255,255,0.05);
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 0 8px;
        }

        .pa-monitor-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }

        .pa-monitor-video {
          width: 100%;
          aspect-ratio: 16 / 9;
          border: none;
          display: block;
        }

        /* ── Side stack ──────────────────────────────────────── */
        .pa-side-stack {
          display: grid;
          gap: .6rem;
          grid-template-rows: 1fr 1fr;
          min-height: 100%;
        }

        /* ── Side cards ──────────────────────────────────────── */
        .pa-side-card {
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(9,20,15,0.72);
          padding: .85rem .9rem;
          cursor: default;
          transition: all .25s ease;
          position: relative;
          overflow: hidden;
          height: 100%;
        }

        .pa-side-card::before {
          content: "";
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 2px;
          border-radius: 0 2px 2px 0;
          opacity: 1;
          transition: opacity .25s ease;
        }

        .pa-side-card.challenge::before {
          background: linear-gradient(to bottom, #fb7185, rgba(251,113,133,0.2));
        }

        .pa-side-card.solution::before {
          background: linear-gradient(to bottom, #6ee7b7, rgba(110,231,183,0.2));
        }

        .pa-side-card.challenge {
          border-color: rgba(251,113,133,0.3);
          box-shadow: 0 0 20px rgba(251,113,133,0.07);
        }

        .pa-side-card.solution {
          border-color: rgba(110,231,183,0.3);
          box-shadow: 0 0 20px rgba(110,231,183,0.07);
        }

        .pa-side-toggle {
          width: 100%;
          border: none;
          background: transparent;
          padding: 0;
          text-align: left;
          cursor: default;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: .5rem;
        }

        .pa-side-title {
          margin: 0;
          font: 700 10px 'Space Grotesk', monospace;
          text-transform: uppercase;
          letter-spacing: .1em;
        }

        .pa-panel-arrow {
          font-size: 10px;
          color: #4a5f54;
          transition: transform .2s ease;
          flex-shrink: 0;
        }

        .pa-panel-arrow.open {
          transform: rotate(180deg);
          color: #6b8277;
        }

        .pa-panel-body {
          overflow: visible;
          max-height: none;
          opacity: 1;
        }

        /* ── Achievements ────────────────────────────────────── */
        .pa-achievement-wrap {
          margin-top: 4rem;
          animation: pa-fade-up .7s cubic-bezier(.22,1,.36,1) both;
          animation-delay: .1s;
        }

        .pa-timeline-wrap {
          position: relative;
          overflow: hidden;
          border-radius: 20px;
          padding: .5rem 0;
        }

        .pa-timeline-wrap::before,
        .pa-timeline-wrap::after {
          content: "";
          position: absolute;
          top: 0; bottom: 0;
          width: 80px;
          z-index: 2;
          pointer-events: none;
        }

        .pa-timeline-wrap::before {
          left: 0;
          background: linear-gradient(to right, var(--bg-fade, rgba(5,15,10,1)), transparent);
        }

        .pa-timeline-wrap::after {
          right: 0;
          background: linear-gradient(to left, var(--bg-fade, rgba(5,15,10,1)), transparent);
        }

        .pa-timeline-line {
          position: absolute;
          left: 0; right: 0;
          top: calc(2rem + 1.6rem);
          height: 1px;
          background: linear-gradient(90deg, transparent 2%, rgba(52,211,153,0.5), rgba(167,139,250,0.55), rgba(34,211,238,0.5), transparent 98%);
          z-index: 1;
        }

        .pa-timeline {
          position: relative;
          display: flex;
          gap: .8rem;
          padding-top: 2rem;
          padding-bottom: .4rem;
          width: max-content;
          animation: pa-timeline-marquee 44s linear infinite;
          will-change: transform;
        }

        .pa-timeline-wrap:hover .pa-timeline {
          animation-play-state: paused;
        }

        @keyframes pa-timeline-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        /* ── Achievement column ──────────────────────────────── */
        .pa-achievement-col {
          position: relative;
          padding-top: .2rem;
          width: 182px;
          flex: 0 0 auto;
        }

        .pa-timeline-year {
          text-align: center;
          color: color-mix(in srgb, var(--tier-color) 86%, #ffffff 24%);
          font: 700 10px 'Space Grotesk', monospace;
          letter-spacing: .12em;
          margin-bottom: .5rem;
        }

        .pa-timeline-node {
          width: .6rem;
          height: .6rem;
          border-radius: 999px;
          margin: 0 auto;
          background: color-mix(in srgb, var(--tier-color) 82%, #ffffff 18%);
          box-shadow:
            0 0 0 3px color-mix(in srgb, var(--tier-color) 20%, transparent),
            0 0 14px color-mix(in srgb, var(--tier-color) 60%, transparent);
          position: relative;
          z-index: 2;
          animation: pa-pulse 2.4s ease infinite;
        }

        @keyframes pa-pulse {
          0%   { box-shadow: 0 0 0 0 color-mix(in srgb, var(--tier-color) 55%, transparent), 0 0 14px color-mix(in srgb, var(--tier-color) 55%, transparent); }
          65%  { box-shadow: 0 0 0 10px transparent, 0 0 14px color-mix(in srgb, var(--tier-color) 45%, transparent); }
          100% { box-shadow: 0 0 0 0 transparent, 0 0 14px color-mix(in srgb, var(--tier-color) 55%, transparent); }
        }

        .pa-timeline-stem {
          width: 1px;
          height: 1rem;
          margin: 0 auto .4rem;
          background: linear-gradient(to bottom, color-mix(in srgb, var(--tier-color) 65%, transparent), rgba(255,255,255,0.06));
        }

        /* ── Achievement card ────────────────────────────────── */
        .pa-achievement-card {
          border: 1px solid color-mix(in srgb, var(--tier-color) 38%, rgba(255,255,255,0.07) 62%);
          background: linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.016));
          border-radius: 16px;
          padding: .8rem .75rem;
          min-height: 160px;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow:
            0 1px 0 rgba(255,255,255,0.05) inset,
            0 8px 24px -6px rgba(0,0,0,0.5),
            0 0 16px color-mix(in srgb, var(--tier-color) 16%, transparent);
          transition: transform .28s cubic-bezier(.22,1,.36,1), box-shadow .28s ease;
          display: flex;
          flex-direction: column;
          cursor: pointer;
        }

        .pa-achievement-card:hover {
          transform: translateY(-5px) scale(1.025);
          box-shadow:
            0 1px 0 rgba(255,255,255,0.07) inset,
            0 16px 40px -8px rgba(0,0,0,0.6),
            0 0 28px color-mix(in srgb, var(--tier-color) 28%, transparent);
        }

        .pa-achievement-icon {
          font-size: 1.1rem;
          margin-bottom: .4rem;
        }

        /* Tier badge — single, unambiguous statement of rank.
           Used on both the mini card and the modal, so the
           award level never needs to be repeated as text. */
        .pa-tier-badge {
          display: inline-flex;
          width: fit-content;
          align-items: center;
          padding: .18rem .5rem;
          border-radius: 999px;
          margin-bottom: .45rem;
          font: 700 9.5px 'Space Grotesk', monospace;
          text-transform: uppercase;
          letter-spacing: .08em;
          color: color-mix(in srgb, var(--tier-color) 90%, #ffffff 10%);
          border: 1px solid color-mix(in srgb, var(--tier-color) 45%, transparent);
          background: color-mix(in srgb, var(--tier-color) 15%, transparent);
        }

        .pa-achievement-card h4 {
          margin: 0;
          color: #eef5f0;
          font: 600 .95rem 'Fraunces', serif;
          font-style: italic;
          line-height: 1.35;
        }

        .pa-achievement-card > p:last-child {
          margin: .3rem 0 0;
          color: #6b8277;
          font-size: .74rem;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .pa-achievement-modal {
          position: fixed;
          inset: 0;
          z-index: 2000;
          background: rgba(4, 10, 7, 0.8);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          display: grid;
          place-items: center;
          padding: 1rem;
        }

        .pa-achievement-modal-card {
          width: min(920px, 96vw);
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.1);
          background: linear-gradient(145deg, rgba(9,20,15,0.96), rgba(4,10,7,0.94));
          box-shadow: 0 32px 80px rgba(0,0,0,0.55);
          overflow: hidden;
        }

        .pa-achievement-modal-grid {
          display: grid;
          grid-template-columns: 1.1fr .9fr;
        }

        .pa-achievement-modal-media {
          min-height: 280px;
          background: rgba(9,20,15,0.8);
          border-right: 1px solid rgba(255,255,255,0.08);
        }

        .pa-achievement-modal-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .pa-achievement-modal-content {
          padding: 1rem 1rem 1.1rem;
          display: grid;
          gap: .7rem;
          align-content: start;
        }

        .pa-achievement-modal-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: .8rem;
        }

        .pa-achievement-modal-close {
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(9,20,15,0.75);
          color: #cdd9d2;
          border-radius: 10px;
          padding: .35rem .55rem;
          cursor: pointer;
          font-size: .8rem;
        }

        .pa-achievement-modal-title {
          margin: 0;
          color: #f4f9f5;
          font: 600 1.15rem 'Fraunces', serif;
          font-style: italic;
          line-height: 1.3;
        }

        /* Organizer · project — one quiet meta line instead of
           repeating the award name in a second sentence. */
        .pa-achievement-modal-meta {
          margin: -.35rem 0 0;
          color: #6b8277;
          font: 500 .74rem 'Space Grotesk', monospace;
          letter-spacing: .02em;
        }

        .pa-achievement-modal-sub {
          margin: 0;
          color: #8fa79b;
          font-size: .82rem;
          line-height: 1.5;
        }

        /* Role — labelled the same way tech/highlights are elsewhere,
           so the contributor's part reads as its own fact, not folded
           into the summary paragraph. */
        .pa-achievement-modal-role {
          margin: 0;
          font-size: .82rem;
          line-height: 1.55;
          color: #cdd9d2;
        }

        .pa-modal-field-label {
          display: block;
          margin-bottom: .3rem;
          color: #6b8277;
          font: 700 9.5px 'Space Grotesk', monospace;
          text-transform: uppercase;
          letter-spacing: .1em;
        }

        /* Award chips — the single place recognitions are listed.
           Icon + label per chip; nothing above repeats these words. */
        .pa-award-chips {
          display: flex;
          flex-wrap: wrap;
          gap: .4rem;
        }

        .pa-award-chip {
          display: inline-flex;
          align-items: center;
          gap: .35rem;
          border-radius: 999px;
          border: 1px solid rgba(251,191,36,0.3);
          background: linear-gradient(135deg, rgba(251,191,36,0.1), rgba(253,224,71,0.04));
          color: #fcd34d;
          padding: .32rem .65rem;
          font: 600 .72rem 'Space Grotesk', monospace;
          letter-spacing: .01em;
        }

        .pa-achievement-modal-chip {
          display: inline-flex;
          align-items: center;
          gap: .35rem;
          width: fit-content;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(9,20,15,0.7);
          color: #cdd9d2;
          padding: .25rem .55rem;
          font: 600 .65rem 'Space Grotesk', monospace;
          text-transform: uppercase;
          letter-spacing: .08em;
        }

        @media (max-width: 780px) {
          .pa-achievement-modal-grid {
            grid-template-columns: 1fr;
          }

          .pa-achievement-modal-media {
            min-height: 220px;
            border-right: none;
            border-bottom: 1px solid rgba(255,255,255,0.08);
          }
        }

        /* ── Responsive ──────────────────────────────────────── */
        @media (max-width: 1080px) {
          .pa-feature-grid {
            grid-template-columns: 1fr;
            min-height: auto;
          }
          .pa-side-stack {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            grid-template-rows: none;
          }
        }

        @media (max-width: 640px) {
          .pa-shell { padding: 72px 0; }
          .pa-feature-wrap { padding: 1rem; min-height: auto; }
          .pa-side-stack { grid-template-columns: 1fr; }
          .pa-achievement-col { width: 210px; }
        }
      `}</style>

      <section className="pa-shell section-y page-x">
        <div className="container-6xl">

          {/* ── Section header ── */}
          <SectionHeader
            align="center"
            label="my work"
            title={
              <>
                Featured{" "}
                <span
                  style={{
                    fontStyle: "italic",
                    background: "linear-gradient(135deg, #34d399 0%, #22d3ee 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Projects
                </span>
              </>
            }
            subtitle="Real solutions. Real impact."
          />

          {activeProject && (
            <div
              className="pa-project-frame"
              style={{
                "--proj-accent": activeProject.accent || "#34d399",
                "--proj-accent-glow": activeProject.accentGlow || "rgba(52,211,153,0.35)",
              }}
            >
              <div
                className="pa-glass pa-feature-wrap"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <div
                  className={`pa-feature-grid pa-content-transition${isTransitioning ? " is-hiding" : ""}`}
                  key={activeProject.id}
                >
                {/* ── Left: description ── */}
                <div className="pa-feature-left">
                  <div className="pa-eyebrow-row">
                    <span className="pa-badge">{activeProject.category}</span>
                    <span className="pa-status-pill">{activeProject.status}</span>
                  </div>
                  <h3>{activeProject.title}</h3>
                  <p>{activeProject.tagline}</p>

                  <div className="pa-tech-row">
                    {(activeProject.tech || []).slice(0, 6).map((t) => (
                      <span key={t} className="pa-tech-pill">{t}</span>
                    ))}
                  </div>

                  <div className="pa-highlight-box">
                    <h4>Highlights</h4>
                    <ul className="pa-point-list">
                      {highlightPoints.map((point, idx) => (
                        <li key={`hl-${idx}`}>{point}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="pa-action-row">
                    {activeProject.liveUrl && (
                      <a
                        className="pa-link pa-link-primary"
                        href={activeProject.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        ↗ Visit Live Site
                      </a>
                    )}
                    {activeProject.videoUrl && (
                      <a className="pa-link" href={activeProject.videoUrl} target="_blank" rel="noreferrer">
                        ▶ Watch Demo
                      </a>
                    )}
                    {activeProject.github && (
                      <a className="pa-link" href={activeProject.github} target="_blank" rel="noreferrer">
                        {"</>"} View Code
                      </a>
                    )}
                  </div>

                </div>

                {/* ── Center: the laptop/monitor display ── */}
                <div className="pa-feature-image">
                  {videoEmbedUrl ? (
                    <div className="pa-monitor">
                      <div className="pa-monitor-top">
                        <div className="pa-monitor-dot" style={{ background: "#fb7185" }} />
                        <div className="pa-monitor-dot" style={{ background: "#fbbf24" }} />
                        <div className="pa-monitor-dot" style={{ background: "#34d399" }} />
                      </div>
                      <iframe
                        className="pa-monitor-video"
                        src={videoEmbedUrl}
                        title={`${activeProject.title} demo`}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    </div>
                  ) : activeProject.images?.hero ? (
                    <div className={`pa-device ${showMobileFrame ? "mobile" : "laptop"}`}>
                      <div className="pa-device-notch" />
                      <div className="pa-device-screen">
                        <Img
                          src={activeProject.images?.hero}
                          alt={activeProject.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                    </div>
                  ) : (
                    <ProjectPlaceholder category={activeProject.category} status={activeProject.status} />
                  )}
                </div>

                {/* ── Right: challenge / solution panels ── */}
                <div className="pa-side-stack">
                  <div className="pa-side-card challenge">
                    <div className="pa-side-toggle">
                      <h4 className="pa-side-title" style={{ color: "#fda4af" }}>Challenge</h4>
                    </div>
                    <div className="pa-panel-body">
                      <ul className="pa-point-list">
                        {challengePoints.map((point, idx) => (
                          <li key={`ch-${idx}`}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pa-side-card solution">
                    <div className="pa-side-toggle">
                      <h4 className="pa-side-title" style={{ color: "#6ee7b7" }}>Solution</h4>
                    </div>
                    <div className="pa-panel-body">
                      <ul className="pa-point-list">
                        {solutionPoints.map((point, idx) => (
                          <li key={`so-${idx}`}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              </div>

              {/* Project switcher dots — inherits --proj-accent from this frame */}
              <div className="pa-switch-row">
                {projects.map((p, idx) => (
                  <button
                    key={p.id}
                    type="button"
                    aria-label={`Show ${p.title}`}
                    className={`pa-switch-btn${idx === activeIndex ? " active" : ""}`}
                    onClick={() => handleProjectSwitch(idx)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── Achievements section ── */}
          <div className="pa-achievement-wrap">
            <SectionHeader
              align="center"
              label="my journey"
              title={
                <>
                  Achievements &{" "}
                  <span
                    style={{
                      fontStyle: "italic",
                      background: "linear-gradient(135deg, #34d399 0%, #22d3ee 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Awards
                  </span>
                </>
              }
              subtitle="Milestones that shaped my journey."
            />

            <div className="pa-timeline-wrap">
              <div className="pa-timeline-line" />
              <div className="pa-timeline">
                {[...timelineItems, ...timelineItems].map((item, idx) => (
                  <AchievementCard
                    key={`${item.id}-${idx}`}
                    item={item}
                    onClick={(picked) => setActiveAchievement(picked)}
                  />
                ))}
              </div>
            </div>
          </div>

          {activeAchievement && (
            <div
              className="pa-achievement-modal"
              onClick={() => setActiveAchievement(null)}
            >
              <div
                className="pa-achievement-modal-card"
                style={{ "--tier-color": getTierColor(activeAchievement.tier) }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="pa-achievement-modal-grid">
                  <div className="pa-achievement-modal-media">
                    <Img
                      src={activeAchievement.images?.[0]}
                      alt={activeAchievement.competition}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>

                  <div className="pa-achievement-modal-content">
                    <div className="pa-achievement-modal-top">
                      <span className="pa-achievement-modal-chip">{activeAchievement.year}</span>
                      <button
                        type="button"
                        className="pa-achievement-modal-close"
                        onClick={() => setActiveAchievement(null)}
                      >
                        ✕
                      </button>
                    </div>

                    <span className="pa-tier-badge">
                      {activeAchievement.icon} {activeAchievement.tier}
                    </span>

                    <h3 className="pa-achievement-modal-title">{activeAchievement.competition}</h3>

                    {(activeAchievement.organizer || activeAchievement.project) && (
                      <p className="pa-achievement-modal-meta">
                        {[activeAchievement.organizer, activeAchievement.project]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    )}

                    {activeAchievement.projectSummary && (
                      <p className="pa-achievement-modal-sub">{activeAchievement.projectSummary}</p>
                    )}

                    {activeAchievement.role && (
                      <p className="pa-achievement-modal-role">
                        <span className="pa-modal-field-label">Role</span>
                        {activeAchievement.role}
                      </p>
                    )}

                    {(activeAchievement.tech || []).length > 0 && (
                      <div>
                        <span className="pa-modal-field-label">Stack</span>
                        <div className="pa-tech-row" style={{ marginTop: 0 }}>
                          {activeAchievement.tech.map((t) => (
                            <span key={t} className="pa-tech-pill">{t}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {(activeAchievement.impact || []).length > 0 && (
                      <div>
                        <span className="pa-modal-field-label">Recognition</span>
                        <div className="pa-award-chips">
                          {activeAchievement.impact.map((point, idx) => (
                            <span key={`impact-${idx}`} className="pa-award-chip">🏅 {point}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}