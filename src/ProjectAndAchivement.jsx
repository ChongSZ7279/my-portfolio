import { useEffect, useMemo, useState, useCallback } from "react";
import SectionHeader from "./components/SectionHeader";
import { ACHIEVEMENTS as ACHIEVEMENTS_DATA } from "./data/achievements";
import { PROJECTS } from "./data/projects";

function Img({ src, alt, style }) {
  if (!src) {
    return (
      <div
        style={{
          ...style,
          display: "grid",
          placeItems: "center",
          background: "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.9))",
          color: "#64748b",
          fontSize: 12,
          border: "1px solid rgba(148,163,184,0.12)",
          borderRadius: 12,
        }}
      >
        No preview
      </div>
    );
  }
  return <img src={src} alt={alt} style={style} loading="lazy" />;
}

function AchievementCard({ item, onClick }) {
  return (
    <article className="pa-achievement-col" style={{ "--tier-color": item.tierColor || "#06b6d4" }}>
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
        <h4>{item.competition}</h4>
        <p className="pa-achievement-tier">{item.achievement}</p>
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
        return year >= 2019 && year <= 2025;
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

  const demoEmbedUrl = getYouTubeEmbedUrl(activeProject?.demo);
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
    const onEsc = (e) => {
      if (e.key === "Escape") setActiveAchievement(null);
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [activeAchievement]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=JetBrains+Mono:wght@400;500;700&family=Outfit:wght@400;500;600;700&display=swap');

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
            radial-gradient(50rem 30rem at 10% 12%, rgba(96,165,250,0.08), transparent 68%),
            radial-gradient(46rem 28rem at 90% 18%, rgba(56,189,248,0.07), transparent 70%);
        }

        /* ── Glass card ──────────────────────────────────────── */
        .pa-glass {
          border: 1px solid rgba(255,255,255,0.09);
          background: linear-gradient(
            145deg,
            rgba(255,255,255,0.065),
            rgba(255,255,255,0.018)
          );
          backdrop-filter: blur(36px);
          -webkit-backdrop-filter: blur(36px);
          border-radius: 28px;
          box-shadow:
            0 2px 0 rgba(255,255,255,0.06) inset,
            0 24px 64px rgba(0,0,0,0.55),
            0 0 0 0.5px rgba(255,255,255,0.04) inset;
        }

        /* ── Feature wrap ────────────────────────────────────── */
        .pa-feature-wrap {
          padding: 1.5rem;
          transition: transform .5s cubic-bezier(.22,1,.36,1);
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
          background: linear-gradient(90deg, transparent, rgba(99,102,241,0.6), rgba(6,182,212,0.5), transparent);
          opacity: .7;
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
          font-weight: 900;
          background: linear-gradient(100deg, #f8fafc 20%, #a5b4fc 60%, #22d3ee 100%);
          -webkit-background-clip: text;
          color: transparent;
          background-clip: text;
          letter-spacing: -0.035em;
          font-family: 'Syne', sans-serif;
        }

        .pa-feature-left > p {
          margin: .6rem 0 0;
          color: #94a3b8;
          line-height: 1.65;
          font-size: .9rem;
          font-family: 'Outfit', sans-serif;
        }

        /* ── Badge ───────────────────────────────────────────── */
        .pa-badge {
          display: inline-flex;
          align-items: center;
          gap: .3rem;
          padding: .28rem .55rem;
          border-radius: 999px;
          font: 600 9px 'JetBrains Mono', monospace;
          text-transform: uppercase;
          letter-spacing: .12em;
          color: #67e8f9;
          border: 1px solid rgba(6,182,212,0.35);
          background: rgba(6,182,212,0.1);
          width: fit-content;
        }

        .pa-badge::before {
          content: "";
          display: inline-block;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #06b6d4;
          box-shadow: 0 0 6px #06b6d4;
          animation: pa-blink 2s ease infinite;
        }

        @keyframes pa-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: .3; }
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
          border: 1px solid rgba(148,163,184,0.18);
          background: rgba(15,23,42,0.55);
          color: #94a3b8;
          padding: .22rem .55rem;
          font: 500 10px 'JetBrains Mono', monospace;
          transition: all .25s ease;
          cursor: default;
        }

        .pa-tech-pill:hover {
          background: rgba(99,102,241,0.18);
          border-color: rgba(99,102,241,0.5);
          color: #c7d2fe;
          transform: translateY(-2px);
        }

        /* ── Highlight box ───────────────────────────────────── */
        .pa-highlight-box {
          margin-top: .95rem;
          border-radius: 14px;
          border: 1px solid rgba(245,158,11,0.28);
          background: linear-gradient(135deg, rgba(245,158,11,0.07), rgba(251,191,36,0.04));
          padding: .8rem .9rem;
          position: relative;
          overflow: hidden;
        }

        .pa-highlight-box::before {
          content: "";
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 2px;
          background: linear-gradient(to bottom, #fbbf24, rgba(245,158,11,0.2));
          border-radius: 0 2px 2px 0;
        }

        .pa-highlight-box h4 {
          margin: 0 0 .5rem;
          color: #fcd34d;
          font: 700 10px 'JetBrains Mono', monospace;
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
          color: #cbd5e1;
          font-size: .8rem;
          line-height: 1.5;
          padding-left: 1rem;
          position: relative;
        }

        .pa-point-list li::before {
          content: "→";
          position: absolute;
          left: 0;
          color: #475569;
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
          border: 1px solid rgba(148,163,184,0.22);
          color: #e2e8f0;
          background: rgba(15,23,42,0.7);
          font: 600 11px 'Outfit', sans-serif;
          padding: .5rem .9rem;
          transition: all .22s ease;
          display: inline-flex;
          align-items: center;
          gap: .3rem;
        }

        .pa-link:hover {
          transform: translateY(-2px);
          border-color: rgba(6,182,212,0.5);
          background: rgba(6,182,212,0.1);
          color: #67e8f9;
          box-shadow: 0 4px 20px rgba(6,182,212,0.15), 0 0 0 1px rgba(6,182,212,0.2);
        }

        .pa-link:active {
          transform: translateY(0);
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
          background: rgba(148,163,184,0.2);
          transition: all .3s cubic-bezier(.22,1,.36,1);
          width: 28px;
          padding: 0;
          overflow: hidden;
        }

        .pa-switch-btn::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, #6366f1, #06b6d4);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform .3s ease;
          border-radius: inherit;
        }

        .pa-switch-btn.active {
          width: 42px;
          background: rgba(99,102,241,0.3);
        }

        .pa-switch-btn.active::after {
          transform: scaleX(1);
        }

        .pa-switch-btn:not(.active):hover {
          background: rgba(148,163,184,0.4);
          width: 34px;
        }

        /* ── Feature image center ────────────────────────────── */
        .pa-feature-image {
          position: relative;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.1);
          min-height: 240px;
          background: radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.12), rgba(15,23,42,0.92));
          display: grid;
          place-items: center;
          padding: 1rem;
          overflow: hidden;
        }

        .pa-feature-image::after {
          content: "";
          position: absolute;
          left: 0; right: 0;
          height: 60%;
          background: linear-gradient(to bottom, transparent, rgba(6,182,212,0.08), transparent);
          animation: pa-scan 5s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes pa-scan {
          0%   { transform: translateY(-100%); opacity: 0; }
          20%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateY(200%); opacity: 0; }
        }

        /* ── Device frames ───────────────────────────────────── */
        .pa-device {
          width: 100%;
          border: 1px solid rgba(148,163,184,0.28);
          background: rgba(2,6,23,0.92);
          position: relative;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.05) inset,
            0 24px 48px -12px rgba(0,0,0,0.7),
            0 0 30px rgba(99,102,241,0.2);
        }

        .pa-device.laptop {
          max-width: 440px;
          border-radius: 14px;
          padding: .55rem .55rem .8rem;
        }

        .pa-device.mobile {
          max-width: 235px;
          border-radius: 30px;
          padding: .5rem .45rem .65rem;
        }

        .pa-device-notch {
          width: 60px;
          height: 6px;
          border-radius: 999px;
          background: rgba(148,163,184,0.2);
          margin: 0 auto .35rem;
        }

        .pa-device.laptop .pa-device-notch {
          width: 40px;
          height: 4px;
        }

        .pa-device-screen {
          overflow: hidden;
          border-radius: 10px;
          border: 1px solid rgba(148,163,184,0.15);
          background: #0a0f1e;
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
          border-radius: 14px;
          border: 1px solid rgba(148,163,184,0.22);
          background: rgba(2,6,23,0.88);
          box-shadow: 0 0 32px rgba(99,102,241,0.28);
          overflow: hidden;
        }

        .pa-monitor-top {
          height: 20px;
          border-bottom: 1px solid rgba(148,163,184,0.15);
          background: rgba(148,163,184,0.08);
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
          border: 1px solid rgba(148,163,184,0.16);
          background: rgba(15,23,42,0.5);
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
          opacity: 0;
          transition: opacity .25s ease;
        }

        .pa-side-card.challenge::before {
          background: linear-gradient(to bottom, #f87171, rgba(248,113,113,0.2));
        }

        .pa-side-card.solution::before {
          background: linear-gradient(to bottom, #6ee7b7, rgba(110,231,183,0.2));
        }

        .pa-side-card::before {
          opacity: 1;
        }

        .pa-side-card {
          background: rgba(15,23,42,0.72);
        }

        .pa-side-card.challenge {
          border-color: rgba(248,113,113,0.3);
          box-shadow: 0 0 20px rgba(248,113,113,0.07);
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
          font: 700 10px 'JetBrains Mono', monospace;
          text-transform: uppercase;
          letter-spacing: .1em;
        }

        .pa-panel-arrow {
          font-size: 10px;
          color: #475569;
          transition: transform .2s ease;
          flex-shrink: 0;
        }

        .pa-panel-arrow.open {
          transform: rotate(180deg);
          color: #64748b;
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
          background: linear-gradient(to right, var(--bg-fade, rgba(15,23,42,1)), transparent);
        }

        .pa-timeline-wrap::after {
          right: 0;
          background: linear-gradient(to left, var(--bg-fade, rgba(15,23,42,1)), transparent);
        }

        .pa-timeline-line {
          position: absolute;
          left: 0; right: 0;
          top: calc(2rem + 1.6rem);
          height: 1px;
          background: linear-gradient(90deg, transparent 2%, rgba(59,130,246,0.5), rgba(139,92,246,0.55), rgba(6,182,212,0.5), transparent 98%);
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
          font: 700 10px 'JetBrains Mono', monospace;
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
          background: linear-gradient(to bottom, color-mix(in srgb, var(--tier-color) 65%, transparent), rgba(148,163,184,0.08));
        }

        /* ── Achievement card ────────────────────────────────── */
        .pa-achievement-card {
          border: 1px solid color-mix(in srgb, var(--tier-color) 38%, rgba(255,255,255,0.08) 62%);
          background: linear-gradient(145deg, rgba(255,255,255,0.055), rgba(255,255,255,0.02));
          border-radius: 16px;
          padding: .8rem .75rem;
          min-height: 160px;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow:
            0 1px 0 rgba(255,255,255,0.06) inset,
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
            0 1px 0 rgba(255,255,255,0.08) inset,
            0 16px 40px -8px rgba(0,0,0,0.6),
            0 0 28px color-mix(in srgb, var(--tier-color) 28%, transparent);
        }

        .pa-achievement-icon {
          font-size: 1.1rem;
          margin-bottom: .4rem;
        }

        .pa-achievement-card h4 {
          margin: 0;
          color: #f1f5f9;
          font: 700 .85rem 'Outfit', sans-serif;
          line-height: 1.35;
        }

        .pa-achievement-tier {
          margin: .25rem 0 0;
          color: color-mix(in srgb, var(--tier-color) 85%, #ffffff 20%);
          font: 600 .7rem 'JetBrains Mono', monospace;
          letter-spacing: .04em;
        }

        .pa-achievement-card > p:last-child {
          margin: .25rem 0 0;
          color: #64748b;
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
          background: rgba(2, 6, 23, 0.78);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          display: grid;
          place-items: center;
          padding: 1rem;
        }

        .pa-achievement-modal-card {
          width: min(920px, 96vw);
          border-radius: 18px;
          border: 1px solid rgba(148,163,184,0.22);
          background: linear-gradient(145deg, rgba(15,23,42,0.96), rgba(2,6,23,0.94));
          box-shadow: 0 32px 80px rgba(0,0,0,0.55);
          overflow: hidden;
        }

        .pa-achievement-modal-grid {
          display: grid;
          grid-template-columns: 1.1fr .9fr;
        }

        .pa-achievement-modal-media {
          min-height: 280px;
          background: rgba(15,23,42,0.8);
          border-right: 1px solid rgba(148,163,184,0.14);
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
          gap: .65rem;
        }

        .pa-achievement-modal-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: .8rem;
        }

        .pa-achievement-modal-close {
          border: 1px solid rgba(148,163,184,0.22);
          background: rgba(15,23,42,0.75);
          color: #cbd5e1;
          border-radius: 10px;
          padding: .35rem .55rem;
          cursor: pointer;
          font-size: .8rem;
        }

        .pa-achievement-modal-title {
          margin: 0;
          color: #f8fafc;
          font: 800 1.05rem 'Outfit', sans-serif;
          line-height: 1.3;
        }

        .pa-achievement-modal-sub {
          margin: 0;
          color: #94a3b8;
          font-size: .82rem;
          line-height: 1.5;
        }

        .pa-achievement-modal-chip {
          display: inline-flex;
          align-items: center;
          gap: .35rem;
          width: fit-content;
          border-radius: 999px;
          border: 1px solid rgba(148,163,184,0.24);
          background: rgba(15,23,42,0.7);
          color: #cbd5e1;
          padding: .25rem .55rem;
          font: 600 .65rem 'JetBrains Mono', monospace;
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
            border-bottom: 1px solid rgba(148,163,184,0.14);
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

          {/* ── Section header — untouched ── */}
          <SectionHeader
            align="center"
            label="my work"
            title={
              <>
                Featured{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)",
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
            <>
              <div
                className="pa-glass pa-feature-wrap"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <div
                  className={`pa-feature-grid pa-content-transition${isTransitioning ? " is-hiding" : ""}`}
                  key={activeProject.id}
                >
                {/* ── Left ── */}
                <div className="pa-feature-left">
                  <span className="pa-badge">Featured Project</span>
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
                    {activeProject.demo && (
                      <a className="pa-link" href={activeProject.demo} target="_blank" rel="noreferrer">
                        ↗ Live Demo
                      </a>
                    )}
                    {activeProject.github && (
                      <a className="pa-link" href={activeProject.github} target="_blank" rel="noreferrer">
                        ↗ GitHub
                      </a>
                    )}
                  </div>

                </div>

                {/* ── Center: image/video ── */}
                <div className="pa-feature-image">
                  {demoEmbedUrl ? (
                    <div className="pa-monitor">
                      <div className="pa-monitor-top">
                        <div className="pa-monitor-dot" style={{ background: "#f87171" }} />
                        <div className="pa-monitor-dot" style={{ background: "#fbbf24" }} />
                        <div className="pa-monitor-dot" style={{ background: "#4ade80" }} />
                      </div>
                      <iframe
                        className="pa-monitor-video"
                        src={demoEmbedUrl}
                        title={`${activeProject.title} demo`}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    </div>
                  ) : (
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
                  )}
                </div>

                {/* ── Right: collapsible panels ── */}
                <div className="pa-side-stack">
                  {/* Challenge panel */}
                  <div className="pa-side-card challenge">
                    <div className="pa-side-toggle">
                      <h4 className="pa-side-title" style={{ color: "#fca5a5" }}>Challenge</h4>
                    </div>
                    <div className="pa-panel-body">
                      <ul className="pa-point-list">
                        {challengePoints.map((point, idx) => (
                          <li key={`ch-${idx}`}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Solution panel */}
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

              {/* Project switcher dots outside feature box */}
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
            </>
          )}

          {/* ── Achievements section ── */}
          <div className="pa-achievement-wrap">

            {/* Section header — untouched */}
            <SectionHeader
              align="center"
              label="my journey"
              title={
                <>
                  Achievements &{" "}
                  <span
                    style={{
                      background: "linear-gradient(135deg, #a5b4fc 0%, #22d3ee 100%)",
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

                    <h3 className="pa-achievement-modal-title">
                      {activeAchievement.icon} {activeAchievement.competition}
                    </h3>
                    <p className="pa-achievement-tier">{activeAchievement.achievement}</p>
                    <p className="pa-achievement-modal-sub">{activeAchievement.project}</p>
                    {activeAchievement.projectSummary && (
                      <p className="pa-achievement-modal-sub">{activeAchievement.projectSummary}</p>
                    )}
                    {(activeAchievement.impact || []).length > 0 && (
                      <ul className="pa-point-list" style={{ marginTop: ".2rem" }}>
                        {activeAchievement.impact.map((point, idx) => (
                          <li key={`impact-${idx}`}>{point}</li>
                        ))}
                      </ul>
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