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

import RTMSWeb from "./image/projects/rtms/web.png";
import FoodfulWeb from "./image/projects/foodful/web.png";

export const PROJECTS = [
  {
    id: "robocon-management",
    index: "01",
    title: "UTM Robocon Team Management System",
    tagline:
      "Centralized full-stack management platform digitalizing the operations of the UTM Robocon Team.",
    accent: "#8b5cf6",
    accentGlow: "rgba(139,92,246,0.35)",
    category: "Web · Full-Stack · Management",
    status: "2025 – 2026",
    statusColor: "#8b5cf6",
    tech: ["React.js", "Laravel", "MySQL", "Python", "Face Recognition", "OCR"],
    github: null,
    videoUrl: null,
    liveUrl: "app.utmrobocon.com", // internal system — add if you get a staging/demo URL
    images: {
      hero: RTMSWeb,
      supporting: [],
      supportingLabels: ["System Overview"],
    },

    problem:
      "UTM Robocon operations involve multiple departments, bureaus, members, documents, inventory, finances, events, and partnerships, making information difficult to manage when distributed across different platforms.",

    solution:
      "Designed and developed a centralized web-based management system covering 11 operational modules. The system integrates role-based access, attendance with face recognition, OCR-assisted claims processing, task management, inventory, purchasing, financial management, partnerships, events, documents, and maintenance.",

    architecture: "React.js · Laravel · MySQL · Python AI Services",

    impact: [
      "11 integrated management modules",
      "Supports 4 management roles, 3 department roles, and 6 bureau roles",
      "Face recognition for attendance management",
      "OCR-assisted receipt and claim processing",
      "Individually handled requirements, design, development, testing, deployment, and maintenance",
    ],
  },

  {
    id: "ihome",
    index: "02",
    title: "iHome",
    tagline:
      "AI-powered household management platform that organizes daily home activities through modular smart services.",
    accent: "#06b6d4",
    accentGlow: "rgba(6,182,212,0.35)",
    category: "Mobile · AI · Smart Home",
    status: "Jan 2026 – Feb 2026",
    statusColor: "#06b6d4",
    tech: ["Flutter", "Firebase", "Gemini API", "OCR"],
    github: "https://github.com/ChongSZ7279/ihome",
    videoUrl: "https://youtu.be/9S38e9rzjxM",
    liveUrl: null, // add TestFlight / Play Store / web build link if available
    images: {
      hero: IHomeWeb,
      supporting: [IHomeMobile, IHomeAll],
      supportingLabels: ["Mobile UI", "System Overview"],
    },

    problem:
      "Managing household expenses, food inventory, and clothing organization often requires multiple apps or manual tracking, resulting in fragmented information and inefficient home management.",

    solution:
      "Developed iHome, a modular smart home management application that centralizes household activities into structured modules. The platform includes Financial, Food, and Clothing modules, along with customizable modules. AI and OCR technologies are integrated to automate data entry and provide intelligent assistance.",

    architecture: "Flutter · Firebase · Gemini AI · OCR",

    impact: [
      "Modular architecture supporting Financial, Food, Clothing, and Custom modules",
      "OCR-based data extraction to reduce manual data entry",
      "Gemini AI integration for intelligent household assistance",
      "Firebase-based backend and data management",
    ],
  },

  {
    id: "trustchain",
    index: "03",
    title: "TrustChain",
    tagline:
      "Blockchain-based donation platform with smart contract milestone fund disbursement on the Scroll network.",
    accent: "#f59e0b",
    accentGlow: "rgba(245,158,11,0.35)",
    category: "Web3 · Blockchain · Full-Stack",
    status: "Mar 2025 – Apr 2025",
    statusColor: "#f59e0b",
    tech: ["React.js", "Laravel", "Scroll", "Solidity", "Web3.js"],
    github: "https://github.com/ChongSZ7279/trustchain",
    videoUrl: "https://www.youtube.com/watch?v=KfCRkoNDBb8",
    liveUrl: null, // add the deployed testnet/live app URL if it's still up
    images: {
      hero: TrustChainWeb,
      supporting: [TrustChainMobile, TrustChainAll],
      supportingLabels: ["Organization Card", "Case Study"],
    },

    problem:
      "Donors often lack transparency and assurance on how funds are disbursed and used in charity workflows.",

    solution:
      "Built a peer-to-peer donation platform with smart contract-controlled disbursements and immutable records, delivering full frontend and backend development within 38 days.",

    architecture: "React.js · Laravel · Solidity · Web3.js · Scroll",

    impact: [
      "Top 10 Teams — Fintech & Blockchain, VHACK 2025",
      "Smart contract milestone-based fund disbursement",
      "Scroll network integration with Web3.js and Solidity",
      "Full-stack frontend and backend development within 38 days",
    ],
  },

  {
    id: "foodful",
    index: "04",
    title: "Foodful",
    tagline:
      "Food surplus management platform connecting restaurants with consumers to reduce food waste.",
    accent: "#22c55e",
    accentGlow: "rgba(34,197,94,0.35)",
    category: "Web · HCI · Sustainability",
    status: "2024",
    statusColor: "#22c55e",
    tech: ["React.js", "Node.js", "MySQL", "HCI"],
    github: null,
    videoUrl: "https://www.youtube.com/watch?v=CPulWMOw8ZA",
    liveUrl: null,
    images: {
      hero: FoodfulWeb,
      supporting: [],
      supportingLabels: ["System Overview"],
    },

    problem:
      "Restaurants may have surplus food that remains unsold, while consumers lack an efficient platform to discover and purchase available surplus food.",

    solution:
      "Developed Foodful, a two-interface platform connecting restaurant owners and consumers. The system supports surplus food inventory management, filtering, searching, purchasing, and real-time tracking of inventory and purchase status.",

    architecture: "React.js · Node.js · MySQL",

    impact: [
      "HCI Day Champion",
      "Fusion 2024 Bronze Award",
      "Two-interface platform connecting restaurants and consumers",
      "Inventory management, filtering, search, and purchasing",
      "Real-time tracking of inventory and purchase status",
    ],
  },

  {
    id: "tvpss",
    index: "05",
    title: "TVPSS Management System",
    tagline:
      "Web platform to streamline TVPSS program administration across schools through user, activity, and feedback management.",
    accent: "#0ea5e9",
    accentGlow: "rgba(14,165,233,0.35)",
    category: "Web · Education Administration",
    status: "Oct 2024 – Jan 2025",
    statusColor: "#0ea5e9",
    tech: ["Spring MVC", "MySQL"],
    github: "https://github.com/ChongSZ7279/TVPSSHub",
    videoUrl: null,
    liveUrl: null,
    images: {
      hero: TVPSSWeb,
      supporting: [TVPSSAll],
      supportingLabels: ["Activity Tracking"],
    },

    problem:
      "Managing users, activities, and feedback across multiple schools is difficult without a centralized and scalable administration platform.",

    solution:
      "Developed User Management and Activity Management features together with a feedback system using Spring MVC and MySQL to support scalable TVPSS program operations.",

    architecture: "Spring MVC · MySQL",

    impact: [
      "User Management and Activity Management modules",
      "Feedback system for program improvement",
      "Scalable Spring MVC backend with MySQL storage",
      "Designed to support TVPSS program administration across schools",
    ],
  },
];