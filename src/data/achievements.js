// src/data/achievements.js
//
// New schema:
//  id           – unique string
//  icon         – emoji
//  competition  – event name (was: event)
//  year         – string
//  organizer    – organiser / host
//  achievement  – award label (was: title)
//  tier         – badge label shown in list row
//  tierColor    – accent hex
//  rankScore    – number: lower = better (drives sort, no string parsing needed)
//  project      – project name
//  projectSummary – short description (was: description)
//  role         – personal contribution note
//  tech[]       – tech stack
//  impact[]     – key metrics / highlights
//  video        – YouTube URL or plain label (lazy-loaded)
//  github       – URL or null
//  demo         – URL or null
//  images[]     – array of image imports / URLs

import StartUp           from "./image/achievements/StartUp.png";
import VarsityHackathon  from "./image/achievements/VarsityHackathon.png";
import Fusion            from "./image/achievements/Fusion.png";
import HCI               from "./image/achievements/HCI.png";
import Hack10            from "./image/achievements/Hackaten.png";
import YoungMakerChallenge from "./image/achievements/YoungMakerChallenge.png";
import RoboconMalaysia   from "./image/achievements/RoboconMalaysia.png";
import ABURobocon        from "./image/achievements/ABURobocon.png";
import FriendlyMatch     from "./image/achievements/FriendlyMatch.png";

export const ACHIEVEMENTS = [
  // ── rankScore 1 → Champion ──────────────────────────────────────────────────

  {
    id: "hci-day-foodful-2024",
    icon: "🥇",
    competition: "HCI Day 2024",
    year: "2024",
    organizer: "Universiti Teknologi Malaysia",
    achievement: "Champion",
    tier: "Champion",
    tierColor: "#f59e0b",
    rankScore: 1,
    project: "FoodFul",
    projectSummary:
      "A Figma prototype addressing SDG 2: Zero Hunger by enabling restaurants to sell surplus food at reduced prices to users in need.",
    role:
      "Applied User-Centered Design principles across design iterations.",
    tech: ["Figma"],
    impact: [
      "Champion",
    ],
    video: "https://www.youtube.com/watch?v=SbSqtFBmD30&feature=youtu.be",
    github: null,
    demo: null,
    images: [HCI],
  },
  {
    id: "robocon-malaysia-2023",
    icon: "🥇",
    competition: "Robocon Malaysia 2023",
    year: "2023",
    organizer: "Robocon Malaysia",
    achievement: "Champion + Best Technology + Best Team",
    tier: "Champion",
    tierColor: "#f59e0b",
    rankScore: 1,
    project: "UTM Robocon Team",
    projectSummary:
      "National robotics competition based on the theme of ABU Robocon 2023",
    role:
      "Support team as a junior programming member",
    tech: ["Robotics", "STM32", "C"],
    impact: [
      "Champion",
      "Best Technology Award",
      "Best Team Award",
    ],
    video: null,
    github: null,
    demo: null,
    images: [RoboconMalaysia],
  },
  {
    id: "young-maker-2019",
    icon: "🏆",
    competition: "Young Maker Challenge 2019",
    year: "2019",
    organizer: "Unimas",
    achievement: "Champion (Sarawak State Level)",
    tier: "Champion",
    tierColor: "#f59e0b",
    rankScore: 1,
    project: "Ecojaya",
    projectSummary:
      "Smart pest control and automated watering system using Arduino Uno with soil-moisture and PIR sensors.",
    role:
      "Designed the circuit, wrote embedded firmware, and presented the project.",
    tech: ["Arduino Uno", "IoT"],
    impact: [
      "Champion of Sarawak State Level",
    ],
    video: null,
    github: null,
    demo: null,
    images: [YoungMakerChallenge],
  },
  {
    id: "friendly-match-2024-champion",
    icon: "🏆",
    competition: "Friendly Match 2024",
    year: "2024",
    organizer: "UTM Robocon",
    achievement: "Champion",
    tier: "Champion",
    tierColor: "#f59e0b",
    rankScore: 1,
    project: "UTM Robocon",
    projectSummary: "Inter-university robotics friendly match based on the theme of ABU Robocon 2024.",
    role: "Support in ESP32 wireless communication and control system",
    tech: ["Robotics", "STM32", "C"],
    impact: ["Champion"],
    video: null,
    github: null,
    demo: null,
    images: [FriendlyMatch],
  },

  // ── rankScore 3 → Bronze ────────────────────────────────────────────────────

  {
    id: "fusion-foodful-2024",
    icon: "🥉",
    competition: "Fusion 2024",
    year: "2024",
    organizer: "myHCI-UX",
    achievement: "Bronze Award",
    tier: "Bronze",
    tierColor: "#cd7c2f",
    rankScore: 3,
    project: "FoodFul",
    projectSummary:
      "Extended the HCI Day project into a full competition entry with a comprehensive poster and extended abstract.",
    role:
      "Designed the poster layout and co-wrote the extended abstract communicating the solution to a wider audience.",
    tech: ["Figma"],
    impact: ["Bronze Award"],
    video: "https://www.youtube.com/watch?v=SbSqtFBmD30&feature=youtu.be",
    github: null,
    demo: null,
    images: [Fusion],
  },

  // ── rankScore 4 → International award ──────────────────────────────────────

  {
    id: "abu-robocon-2024-panasonic",
    icon: "🏅",
    competition: "ABU Robocon 2024",
    year: "2024",
    organizer: "Asia-Pacific Broadcasting Union",
    achievement: "Panasonic Award",
    tier: "International Award",
    tierColor: "#0ea5e9",
    rankScore: 4,
    project: "UTM Robocon",
    projectSummary: "International ABU Robocon competition held in 2024 with the theme \"Harvest Day\"",
    role: "Contributed to the wireless communication and control sytem using ESP32.",
    tech: ["Robotics", "STM32", "C", "ESP32"],
    impact: ["Panasonic Award"],
    video: null,
    github: null,
    demo: null,
    images: [ABURobocon],
  },
  {
    id: "abu-robocon-2023-rohm",
    icon: "🏅",
    competition: "ABU Robocon 2023",
    year: "2023",
    organizer: "Asia-Pacific Broadcasting Union",
    achievement: "Rohm Award",
    tier: "International Award",
    tierColor: "#6366f1",
    rankScore: 4,
    project: "UTM Robocon",
    projectSummary: "International ABU Robocon competition held in 2023 with the theme \"Casting Flowers Over Angkor Wat\"",
    role: "Contributed as a junior programming member",
    tech: ["Robotics", "STM32", "C"],
    impact: ["Rohm Award"],
    video: null,
    github: null,
    demo: null,
    images: [ABURobocon],
  },

  // ── rankScore 5 → Top 10 ────────────────────────────────────────────────────

  {
    id: "vhack-trustchain-2025",
    icon: "🏅",
    competition: "Varsity Hackathon 2025",
    year: "2025",
    organizer: "Universiti Sains Malaysia",
    achievement: "Top 10 – Fintech & Blockchain Track",
    tier: "Top 10",
    tierColor: "#f59e0b",
    rankScore: 5,
    project: "TrustChain",
    projectSummary:
      "Web-based blockchain application enabling transparent, secure peer-to-peer donations via immutable ledger and smart-contract milestone fund disbursement.",
    role:
      "Built full-stack application including React frontend, Laravel API, and Solidity smart contracts — all within 38 days.",
    tech: ["React", "Laravel", "Gemini AI", "MySQL", "Web3.js", "Hardhat", "Solidity", "Ethereum Smart Contracts"],
    impact: [
      "Top 10 team in Fintech & Blockchain track",
    ],
    video: "https://www.youtube.com/watch?v=KfCRkoNDBb8",
    github: "https://github.com/ChongSZ7279/trustchain",
    demo: null,
    images: [VarsityHackathon],
  },

  // ── rankScore 6 → Top 15 ────────────────────────────────────────────────────

  {
    id: "hack10-durian-2023",
    icon: "🏅",
    competition: "Hack@10 2023",
    year: "2023",
    organizer: "UNITEN",
    achievement: "Top 15 Teams",
    tier: "Top 15",
    tierColor: "#8b5cf6",
    rankScore: 6,
    project: "Durian",
    projectSummary:
      "Application to analyze durian quality using YOLOv5 object detection with a React + Node.js stack.",
    role:
      "Implemented YOLOv5 model integration and built the Node.js backend API.",
    tech: ["YOLOv5", "React", "Node.js"],
    impact: ["Top 15"],
    video: null,
    github: null,
    demo: null,
    images: [Hack10],
  },

  // ── rankScore 7 → Consolation ───────────────────────────────────────────────

  {
    id: "startup-kaching-2025",
    icon: "🏅",
    competition: "Start Up 2025",
    year: "2025",
    organizer: "Universiti Teknologi Malaysia",
    achievement: "Consolation Award",
    tier: "Consolation",
    tierColor: "#10b981",
    rankScore: 7,
    project: "Ka-Ching",
    projectSummary:
      "Cross-platform Flutter + Firebase app that helps friends split expenses fairly across different countries, with Smart OCR receipt scanning.",
    role:
      "Full-stack mobile developer — built Flutter UI, Firebase backend, and currency conversion integration.",
    tech: ["Flutter", "Firebase", "Smart OCR"],
    impact: [
      "Consolation Award",
    ],
    video: null,
    github: "https://github.com/wangyt0119/Ka-Ching-flutter-firebase-",
    demo: null,
    images: [StartUp],
  },
];