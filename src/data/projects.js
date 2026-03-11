// src/data/projects.js
import KachingWeb from "./image/projects/kaching/web.png";
import KachingMobile from "./image/projects/kaching/mobile.png";
import KachingAll from "./image/projects/kaching/all.png";

import IHomeWeb from "./image/projects/ihome/web.png";
import IHomeMobile from "./image/projects/ihome/mobile.png";
import IHomeAll from "./image/projects/ihome/all.png";

import MindfulMeWeb from "./image/projects/mindfulme/web.png";
import MindfulMeMobile from "./image/projects/mindfulme/mobile.png";
import MindfulMeAll from "./image/projects/mindfulme/all.png";

import TrustChainWeb from "./image/projects/trustchain/web.png";
import TrustChainMobile from "./image/projects/trustchain/mobile.png";
import TrustChainAll from "./image/projects/trustchain/all.png";

import TVPSSWeb from "./image/projects/tvpss/web.png";
import TVPSSAll from "./image/projects/tvpss/all.png";

import RoboconWeb from "./image/projects/robocon/web.png";
import RoboconMobile from "./image/projects/robocon/mobile.png";
import RoboconAll from "./image/projects/robocon/all.png";

export const PROJECTS = [
  {
    id: "ihome",
    index: "01",
    title: "iHome",
    tagline:
      "AI-powered household management platform that organizes daily home activities through modular smart services.",
    accent: "#06b6d4",
    accentGlow: "rgba(6,182,212,0.35)",
    category: "Mobile · Smart Home",
    status: "Jan 2026 – Feb 2026",
    statusColor: "#06b6d4",
    tech: ["Flutter", "Firebase", "Gemini API", "OCR"],
    github: "https://github.com/ChongSZ7279/ihome",
    demo: "https://youtu.be/9S38e9rzjxM",
    images: {
      hero: IHomeWeb,
      supporting: [IHomeMobile, IHomeAll],
      supportingLabels: ["Mobile UI", "System Overview"],
    },
  
    problem:
      "Managing household tasks such as expenses, food inventory, and clothing organization often requires multiple apps or manual tracking, resulting in fragmented information and inefficient home management.",
  
    solution:
      "Developed iHome, a modular smart home management application that centralizes household activities into structured modules. The platform includes Financial, Food, and Clothing modules, along with a customizable module system that allows users to create their own management categories. AI and OCR technologies are integrated to automate data entry and provide intelligent assistance.",
  
    architecture: "Flutter · Firebase · AI Integration",
  
    impact: [
      "Modular system architecture supporting Financial, Food, Clothing, and Custom modules",
      "OCR-based data extraction to simplify manual input (e.g., bills or receipts)",
      "AI-powered insights to assist users in organizing household information",
    ],
  },
  {
    id: "kaching",
    index: "02",
    title: "Ka-Ching",
    tagline:
      "Smart expense-sharing app with real-time balances and OCR-assisted expense entry.",
    accent: "#10b981",
    accentGlow: "rgba(16,185,129,0.35)",
    category: "Mobile · FinTech",
    status: "Apr 2025 – Jun 2025",
    statusColor: "#10b981",
    tech: ["Flutter", "Firebase", "Currency API", "OCR"],
    github: "https://github.com/wangyt0119/Ka-Ching-flutter-firebase-",
    demo: "https://www.canva.com/design/DAG_rxMXTzc/gOOphTsqS5-a995v5--KXA/edit?utm_content=DAG_rxMXTzc&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
    images: {
      hero: KachingWeb,
      supporting: [KachingMobile, KachingAll],
      supportingLabels: ["Mobile UI", "Admin UI"],
    },
    problem:
      "Group expense tracking often causes confusion and conflict due to unclear balances, cross-currency issues, and manual entry friction.",
    solution:
      "Built Ka-Ching to record shared expenses, auto-calculate balances, and present clear summaries with fairness and transparency for groups.",
    architecture: null,
    impact: [
      "Real-time balance calculation and summaries",
      "Cross-currency friendly workflows via Currency API",
      "OCR-assisted expense input to reduce manual effort",
    ],
  },
  {
    id: "mindfulme",
    index: "03",
    title: "MindfulMe",
    tagline:
      "Mental health self-care app with mood tracker, diary, stress release-to-fire, AI chat, and meditation — in 3 languages.",
    accent: "#8b5cf6",
    accentGlow: "rgba(139,92,246,0.35)",
    category: "AI · Mobile",
    status: "Feb 2025 – Apr 2025",
    statusColor: "#8b5cf6",
    tech: ["Flutter", "Gemini AI", "Node.js", "Express.js"],
    github: "https://github.com/ChongSZ7279/mental_help",
    demo: "https://www.youtube.com/watch?v=R92lvP_vL5Q",
    images: {
      hero: MindfulMeWeb,
      supporting: [MindfulMeMobile, MindfulMeAll],
      supportingLabels: ["Mobile UI", "5 Keys Insight"],
    },
    problem:
      "Many users struggle to find accessible, approachable self-care tools that fit their language and daily routines.",
    solution:
      "Developed MindfulMe with multiple self-care features and multilingual accessibility (3 languages) to broaden reach across diverse users.",
    architecture: null,
    impact: [
      "Mood tracker + digital diary for daily reflection",
      "Stress release-to-fire interaction for quick relief",
      "Gemini AI-powered chat",
      "3-language support for accessibility",
    ],
  },
  {
    id: "trustchain",
    index: "04",
    title: "TrustChain",
    tagline:
      "Blockchain-based donation platform with smart contract milestone fund disbursement (Scroll network).",
    accent: "#f59e0b",
    accentGlow: "rgba(245,158,11,0.35)",
    category: "Web3 · Full-Stack",
    status: "Mar 2025 – Apr 2025",
    statusColor: "#f59e0b",
    tech: ["React.js", "Laravel", "Scroll", "Solidity", "Web3.js"],
    github: "https://github.com/ChongSZ7279/trustchain",
    demo: "https://www.youtube.com/watch?v=KfCRkoNDBb8",
    images: {
      hero: TrustChainWeb,
      supporting: [TrustChainMobile, TrustChainAll],
      supportingLabels: ["Organization Card", "Case Study"],
    },
    problem:
      "Donors often lack transparency and assurance on how funds are disbursed and used in charity workflows.",
    solution:
      "Built a peer-to-peer donation platform with smart contract–controlled disbursements and immutable records, delivering full frontend + backend within 38 days.",
    architecture: null,
    impact: [
      "Top 10 Teams — Fintech & Blockchain, Varsity Hackathon 2025",
      "Smart contract milestone-based fund disbursement",
      "Scroll network integration with Web3.js + Solidity",
    ],
  },
  {
    id: "sagile",
    index: "05",
    title: "SAgile Development Tools",
    tagline:
      "Web-based project management platform for UTM students to manage agile projects (stories, tasks, NFRs).",
    accent: "#6366f1",
    accentGlow: "rgba(99,102,241,0.35)",
    category: "Web · Project Management",
    status: "Oct 2024 – Jan 2025",
    statusColor: "#6366f1",
    tech: ["Laravel", "Bootstrap", "MySQL"],
    github: null,
    demo: null,
    images: {
      hero: null,
      supporting: [null],
      supportingLabels: ["Agile Boards", "Collaboration"],
    },
    problem:
      "Student teams need a practical, structured tool to manage agile deliverables with collaboration and non-functional requirements(NFR) tracking.",
    solution:
      "Contributed to a Laravel-based platform supporting user stories, tasks, NFR tracking, comments, and email notifications for smoother teamwork.",
    architecture: null,
    impact: [
      "Supports agile workflow: stories, tasks, and NFR tracking",
      "Collaboration: commenting + email notifications",
      "Built for real UTM student team usage",
    ],
  },
  {
    id: "tvpss",
    index: "06",
    title: "TVPSS Management System",
    tagline:
      "Web platform to streamline TVPSS program administration across schools (user + activity management, feedback system).",
    accent: "#0ea5e9",
    accentGlow: "rgba(14,165,233,0.35)",
    category: "Web · Education Admin",
    status: "Oct 2024 – Jan 2025",
    statusColor: "#0ea5e9",
    tech: ["Spring MVC", "MySQL"],
    github: "https://github.com/JingZheee/TVPSSHub",
    demo: null,
    images: {
      hero: TVPSSWeb,
      supporting: [TVPSSAll],
      supportingLabels: ["Activity Tracking"],
    },
    problem:
      "Managing users, activities, and feedback across multiple schools is difficult without a scalable admin platform.",
    solution:
      "Developed User Management and Activity Management features plus a feedback system using Spring MVC + MySQL for scalable operations.",
    architecture: null,
    impact: [
      "User management + activity management modules",
      "Feedback system for program improvement",
      "Scalable Spring MVC backend with MySQL storage",
    ],
  },
  {
    id: "robocon-website",
    index: "07",
    title: "UTM Robocon Team External Website",
    tagline:
      "Official team website built from scratch to share updates and engage students, sponsors, and robotics enthusiasts.",
    accent: "#ec4899",
    accentGlow: "rgba(236,72,153,0.35)",
    category: "Web · Full-Stack",
    status: "Aug 2023 – Aug 2024",
    statusColor: "#ec4899",
    tech: ["React.js", "Node.js", "Web Development"],
    github: null,
    demo: null,
    images: {
      hero: RoboconWeb,
      supporting: [RoboconMobile, RoboconAll],
      supportingLabels: ["Website UI", "Updates & Engagement"],
    },
    problem:
      "The team needed an official digital presence to centralize information, updates, and outreach to the community.",
    solution:
      "Built a full-stack website (React.js frontend + Node.js backend) serving as the official platform for UTM Robocon Team updates and engagement.",
    architecture: null,
    impact: [
      "Official digital presence for students, sponsors, and enthusiasts",
      "From-scratch full-stack build (React + Node)",
      "Designed for updates and engagement opportunities",
    ],
  },
];