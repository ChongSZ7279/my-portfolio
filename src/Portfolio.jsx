import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, ExternalLink, ChevronDown, Menu, X, Code, Briefcase, Award, User, Sparkles, TrendingUp, Heart, Download, ArrowRight, Star, Zap } from 'lucide-react';
import { Trophy, Database, Settings } from 'lucide-react';
import MindfulMeImg from "./assets/projects/MindfulMe.png"; 
import Arduino from "./assets/projects/Arduino.png"
import Durian from "./assets/projects/Durian.png"
import FoodFul from "./assets/projects/FoodFul.png"
import TrustChain from "./assets/projects/TrustChain.png"
import Robocon from "./assets/projects/UTMRobocon.png"

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      const sections = ['home', 'journey', 'projects', 'skills', 'achievements', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // Simulate loading
    setTimeout(() => setIsLoading(false), 2000);

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
      setIsMenuOpen(false);
    }
  };

  // Loading Screen
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center z-50">
        <div className="flex flex-col items-center justify-center relative">
          {/* Spinner */}
          <div className="w-20 h-20 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin relative mb-4">
            {/* Sparkles icon centered inside spinner */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="text-purple-400 animate-pulse" size={24} />
            </div>
          </div>
          {/* Loading Text */}
          <p className="text-purple-300 text-lg mt-4 animate-pulse text-center">
            Loading Portfolio...
          </p>
        </div>
      </div>
    );
  }


  const projects = [
    {
      title: "MindfulMe",
      desc: "A multilingual mental health app with AI chat, mood tracking, and meditation features.",
      tech: ["Flutter", "Node.js", "Express.js", "MySQL", "Gemini AI"],
      link: "https://github.com/ChongSZ7279/mental_help",
      demo: "https://www.youtube.com/watch?si=8sRQN_LR0aHeksN5&v=R92lvP_vL5Q&feature=youtu.be",
      image: MindfulMeImg,
      color: "from-blue-500/20 to-purple-500/20",
      journey: [
        "Started as a class project focusing on basic mood tracking",
        "Integrated AI chat after learning about NLP APIs",
        "Expanded to multilingual support for wider accessibility",
        "Optimized performance through state management improvements"
      ],
      growth: "Learned full-stack development integration and AI implementation"
    },
    {
      title: "TrustChain",
      desc: "Blockchain-based donation platform with smart contract disbursements. Top 10 at VHACK 2025.",
      tech: ["React", "Laravel", "Solidity", "Web3.js", "Scroll"],
      link: "https://github.com/ChongSZ7279/TrustChain",
      demo: "https://www.youtube.com/watch?v=KfCRkoNDBb8",
      image: TrustChain,
      color: "from-emerald-500/20 to-teal-500/20",
      journey: [
        "Initial concept focused on basic blockchain transactions",
        "Implemented smart contracts for automated fund disbursement",
        "Added multi-signature wallet security features",
        "Integrated with Scroll blockchain for better scalability"
      ],
      growth: "Mastered Web3 technologies and decentralized application architecture"
    },
    {
      title: "Durian Quality Checker",
      desc: "Visual durian grading tool using YOLOv5 and a full-stack web interface. Top 15 at Hack@10 2023.",
      tech: ["YOLOv5", "React", "Node.js"],
      link: "https://github.com/ChongSZ7279",
      demo: "https://www.youtube.com/watch?v=anNPeiwjJas&feature=youtu.be",
      image: Durian,
      color: "from-amber-500/20 to-orange-500/20",
      journey: [
        "Began with basic image processing algorithms",
        "Transitioned to YOLOv5 for real-time object detection",
        "Built custom dataset with 1000+ durian images",
        "Optimized model accuracy from 65% to 89% through iterative training"
      ],
      growth: "Gained expertise in computer vision and machine learning deployment"
    },
    {
      title: "UTM Robocon Website",
      desc: "Official digital platform for UTM Robocon team with full SEO optimization.",
      tech: ["React", "Node.js", "Next.js", "SEO"],
      link: "https://utmrobocon.com",
      demo: "https://utmrobocon.com",
      image: Robocon,
      color: "from-pink-500/20 to-rose-500/20",
      journey: [
        "Started with basic React components",
        "Implemented SSR with Next.js for better SEO",
        "Added performance optimizations and lazy loading",
        "Integrated analytics and monitoring tools"
      ],
      growth: "Deepened understanding of web performance and search engine optimization"
    }
  ];

  const skills = {
    "Languages": ["C++", "C", "Java", "Python", "JavaScript"],
    "Frontend": ["HTML", "CSS", "React", "Flutter", "Next.js"],
    "Backend": ["Node.js", "Laravel", "Spring MVC", "Express.js"],
    "Databases": ["MySQL", "Oracle"],
    "Tools & Others": ["Git", "Figma", "Web3.js", "Solidity", "Arduino"]
  };

  const getTechLogo = (techName) => {
    const logoMap = {
      "C++": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
      "C": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg",
      "Java": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
      "Python": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
      "JavaScript": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
      "HTML": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
      "CSS": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
      "React": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
      "Flutter": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg",
      "Next.js": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
      "Node.js": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
      "Laravel": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg",
      "Spring MVC": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg",
      "Express.js": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
      "MySQL": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
      "Oracle": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oracle/oracle-original.svg",
      "Git": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
      "Figma": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
      "Web3.js": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/web3js/web3js-original.svg",
      "Solidity": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/solidity/solidity-original.svg",
      "Arduino": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/arduino/arduino-original.svg"
    };
    
    return logoMap[techName] || "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/codepen/codepen-original.svg";
  };

  const getCategoryIcon = (category) => {
    const icons = {
      "Languages": <Code className="text-white" size={24} />,
      "Frontend": <Sparkles className="text-white" size={24} />,
      "Backend": <Zap className="text-white" size={24} />,
      "Databases": <Database className="text-white" size={24} />,
      "Tools & Others": <Settings className="text-white" size={24} />
    };
    return icons[category] || <Code className="text-white" size={24} />;
  };

  const getTechType = (tech) => {
    const types = {
      "C++": "Systems Programming",
      "C": "Low-level Programming", 
      "Java": "Enterprise Development",
      "Python": "AI/ML & Scripting",
      "JavaScript": "Web Development",
      "React": "UI Framework",
      "Flutter": "Cross-platform",
      "Next.js": "Full-stack Framework",
      "Node.js": "Runtime Environment",
      "Laravel": "PHP Framework",
      "Spring MVC": "Java Framework",
      "Express.js": "Web Framework",
      "MySQL": "Relational Database",
      "Oracle": "Enterprise Database",
      "Git": "Version Control",
      "Figma": "Design Tool",
      "Web3.js": "Blockchain Library",
      "Solidity": "Smart Contracts",
      "Arduino": "Embedded Systems"
    };
    return types[tech] || "Technology";
  };

  const getProficiencyLevel = (tech) => {
    const levels = {
      "C++": 3, "C": 3, "Java": 3, "Python": 3, "JavaScript": 3,
      "React": 3, "Flutter": 2, "Next.js": 2, "Node.js": 3,
      "Laravel": 2, "Spring MVC": 2, "Express.js": 3,
      "MySQL": 3, "Oracle": 2, "Git": 3, "Figma": 2,
      "Web3.js": 2, "Solidity": 2, "Arduino": 2
    };
    return levels[tech] || 2;
  };

  const achievements = [
    { 
      title: "Top 10 Finalist", 
      event: "VHACK 2025 (TrustChain)", 
      icon: "🏅", 
      learning: "Blockchain security",
      image: TrustChain,
      color: "from-emerald-500/20 to-teal-500/20"
    },
    { 
      title: "Panasonic Award", 
      event: "ABU Robocon 2024", 
      icon: "🏅", 
      learning: "Hardware-software integration",
      image: Robocon,
      color: "from-blue-500/20 to-cyan-500/20"
    },
    { 
      title: "Champion", 
      event: "HCI Day 2024 (Foodful App)", 
      icon: "🥇", 
      learning: "User-centered design principles",
      image: FoodFul,
      color: "from-purple-500/20 to-pink-500/20"
    },
    { 
      title: "Bronze Award", 
      event: "Fusion 2024 (Foodful App)", 
      icon: "🥉", 
      learning: "Cross-platform development",
      image: FoodFul,
      color: "from-amber-500/20 to-orange-500/20"
    },
    { 
      title: "Top 15 Finalist", 
      event: "Hack@10 2023 (Durian)", 
      icon: "🏅", 
      learning: "Machine learning deployment",
      image: Durian,
      color: "from-orange-500/20 to-red-500/20"
    },
    { 
      title: "Champion", 
      event: "Young Maker Challenge 2019", 
      icon: "🏆", 
      learning: "Prototype development",
      image: Arduino,
      color: "from-purple-500/20 to-indigo-500/20"
    },
  ];

  const growthTimeline = [
    { 
      year: "2019", 
      event: "First Programming Experience", 
      learning: "Learned Arduino and discovered programming through hardware interaction" 
    },
    { 
      year: "2021", 
      event: "Foundation Studies", 
      learning: "Built programming fundamentals at Labuan Matriculation College" 
    },
    { 
      year: "2022", 
      event: "University Journey Begins", 
      learning: "Started Software Engineering degree at Universiti Teknologi Malaysia (UTM)" 
    },
    { 
      year: "2023", 
      event: "Hardware Programming & Robotics", 
      learning: "Joined UTM Robocon as Programming Member, learned embedded systems" 
    },
    { 
      year: "2024", 
      event: "Real-World Project Deployment", 
      learning: "First stakeholder project - Sagile Development Tools, learned deployment and client collaboration" 
    },
    { 
      year: "2025", 
      event: "Blockchain Technology", 
      learning: "Exploring Web3, smart contracts, and decentralized applications" 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(139,92,246,0.05)_25%,transparent_25%),linear-gradient(-45deg,rgba(139,92,246,0.05)_25%,transparent_25%),linear-gradient(45deg,transparent_75%,rgba(139,92,246,0.05)_75%),linear-gradient(-45deg,transparent_75%,rgba(139,92,246,0.05)_75%)] bg-[length:20px_20px]"></div>
        <div 
          className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl transition-all duration-700 ease-out"
          style={{
            left: `${mousePosition.x - 192}px`,
            top: `${mousePosition.y - 192}px`,
          }}
        ></div>
      </div>

      {/* Enhanced Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-slate-900/90 backdrop-blur-xl shadow-2xl shadow-purple-500/10 border-b border-purple-500/20' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => scrollToSection('home')}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 blur-lg opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <div className="relative text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                  CSZ
                </div>
              </div>
              <div className="ml-3 text-sm text-purple-300 italic hidden sm:block font-light group-hover:text-purple-200 transition-colors">
                Imperfectly Perfect
              </div>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-1">
              {['home', 'journey', 'projects', 'skills', 'achievements', 'contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className={`relative px-4 py-2 rounded-xl capitalize transition-all duration-300 group ${
                    activeSection === item 
                      ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-purple-300 shadow-lg shadow-purple-500/20' 
                      : 'hover:bg-purple-500/10 hover:text-purple-300'
                  }`}
                >
                  <span className="relative z-10">{item}</span>
                  {activeSection === item && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-xl hover:bg-purple-500/20 transition-all group"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="relative">
                {isMenuOpen ? (
                  <X className="text-purple-400 group-hover:text-pink-400 transition-colors" />
                ) : (
                  <Menu className="text-purple-400 group-hover:text-pink-400 transition-colors" />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-900/95 backdrop-blur-xl border-t border-purple-500/20 animate-slide-down">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {['home', 'journey', 'projects', 'skills', 'achievements', 'contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className={`block w-full text-left px-4 py-3 capitalize rounded-xl transition-all duration-300 group ${
                    activeSection === item 
                      ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-purple-300' 
                      : 'hover:bg-purple-500/10 text-gray-300'
                  }`}
                >
                  <span className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-3 transition-all ${
                      activeSection === item ? 'bg-purple-400 animate-pulse' : 'bg-gray-500 group-hover:bg-purple-400'
                    }`}></div>
                    {item}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Enhanced Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center px-4 pt-16 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Enhanced Welcome Badge */}
          <div className="inline-flex items-center space-x-2 mb-8 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30 backdrop-blur-sm animate-bounce-slow hover:scale-105 transition-transform cursor-pointer">
            <Sparkles className="text-purple-400 animate-pulse" size={20} />
            <span className="text-purple-300 text-sm font-medium">Welcome to my portfolio</span>
            <Sparkles className="text-pink-400 animate-pulse" size={20} />
          </div>

          {/* Enhanced Profile Avatar */}
          <div className="mb-8 relative inline-block group">
            {/* Orbital Rings */}
            <div className="absolute inset-0 animate-spin-slow">
              <div className="absolute inset-8 border-2 border-purple-400/30 rounded-full animate-pulse"></div>
            </div>
            {/* Outer Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
            {/* Profile Image */}
            <div className="relative w-40 h-40 mx-auto rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-purple-500 flex items-center justify-center text-7xl border-4 border-purple-400/30 shadow-2xl animate-float group-hover:scale-110 transition-transform duration-300">
              👋
            </div>
            {/* Floating Elements */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce shadow-lg"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-400 rounded-full animate-bounce shadow-lg delay-300"></div>
          </div>

          {/* Enhanced Main Heading */}
          <div className="mb-6">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 animate-gradient bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent leading-tight">
              Hi, I'm <span className="animate-wave inline-block hover:scale-110 transition-transform">Chong Siew Zhen</span>
            </h1>
          </div>

          {/* Enhanced Subtitle */}
          <div className="relative inline-block mb-6 animate-slide-up group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 blur-xl group-hover:blur-2xl transition-all opacity-50"></div>
            <p className="relative text-2xl md:text-3xl text-gray-200 font-light px-6 py-2 animate-glow group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all">
              Software Engineering Student @ UTM
            </p>
          </div>

          {/* Enhanced Stats */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8 text-lg animate-stagger">
            {[
              { icon: Star, text: "CGPA: 3.96", color: "purple" },
              { icon: Briefcase, text: "Full-Stack Developer", color: "pink" },
              { icon: Zap, text: "Open for Projects", color: "purple" }
            ].map((stat, index) => (
              <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <span className={`px-4 py-2 bg-${stat.color}-500/20 rounded-full border border-${stat.color}-500/30 backdrop-blur-sm hover:bg-${stat.color}-500/30 transition-all duration-300 hover:scale-105 hover:shadow-lg group flex items-center`}>
                  <stat.icon className={`inline mr-2 text-${stat.color}-400 group-hover:animate-bounce`} size={18} />
                  {stat.text}
                </span>
              </div>
            ))}
          </div>

          {/* Enhanced Social Links - Simplified */}
          <div className="flex justify-center space-x-4 mb-12 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            {/* Email */}
            <a 
              href="mailto:chong.zhen@graduate.utm.my"
              className="group relative p-4 bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 rounded-full transition-all transform hover:scale-110 hover:shadow-xl hover:shadow-purple-500/50 animate-float"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Mail size={24} className="relative group-hover:animate-bounce" />
            </a>

            {/* LinkedIn */}
            <a 
              href="https://linkedin.com/in/chongsiewzhen"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-4 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-full transition-all transform hover:scale-110 hover:shadow-xl hover:shadow-blue-500/50 animate-float"
              style={{ animationDelay: '0.1s' }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Linkedin size={24} className="relative group-hover:animate-bounce" />
            </a>

            {/* GitHub - Enhanced visibility */}
            <a 
              href="https://github.com/ChongSZ7279"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-4 bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 rounded-full transition-all transform hover:scale-110 hover:shadow-xl hover:shadow-gray-500/50 animate-float"
              style={{ animationDelay: '0.2s' }}
            >
              {/* Make the background more visible by reducing opacity on the gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-gray-500/30 to-gray-600/30 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
              <Github size={24} className="relative group-hover:animate-bounce text-white" />
            </a>
          </div>

          {/* Enhanced Scroll Indicator */}
          <div className="flex justify-center w-full">
            <button 
              onClick={() => scrollToSection('journey')} 
              className="animate-bounce-slow hover:animate-none transition-all group flex flex-col items-center"
            >
              <div className="relative w-12 h-12 flex items-center justify-center">
                <div className="absolute inset-0 bg-purple-400 rounded-full blur-md group-hover:blur-lg transition-all opacity-50"></div>
                <ChevronDown size={40} className="relative text-purple-400 hover:text-pink-400 group-hover:scale-110 transition-transform" />
              </div>
              <div className="mt-2 text-sm text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity">
                Explore my journey
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Enhanced Growth Journey Section */}
      <section id="journey" className="relative min-h-screen py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 group">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <TrendingUp className="relative text-purple-400 group-hover:scale-110 transition-transform" size={36} />
            </div>
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-4 group-hover:scale-105 transition-transform">
              My Growth Journey
            </h2>
            <p className="text-xl text-gray-300 text-center mb-16 max-w-3xl mx-auto font-light">
              Every step in my journey represents learning, iteration, and growth. Here's how I've evolved as a developer.
            </p>
          </div>

          
          {/* Enhanced Timeline */}
          <div className="relative">
            <div className="absolute left-6 md:left-1/2 transform md:-translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-500 via-pink-500 to-purple-500 rounded-full opacity-30"></div>
            
            <div className="space-y-8 pl-12 md:pl-0">
              {growthTimeline.map((item, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-9 md:left-1/2 transform md:-translate-x-1/2 z-20">
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-4 border-slate-900 shadow-lg shadow-purple-500/50 group-hover:scale-125 transition-transform"></div>
                    <div className="absolute inset-0 w-6 h-6 bg-purple-400 rounded-full animate-ping opacity-20"></div>
                  </div>
                  
                  <div className="group relative bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 hover:scale-105">
                    <div className="absolute -top-3 -left-3 group-hover:scale-110 transition-transform">
                      <div className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-sm font-bold shadow-lg">
                        {item.year}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all">
                      {item.event}
                    </h3>
                    <p className="text-gray-300 italic leading-relaxed group-hover:text-gray-200 transition-colors">{item.learning}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Summary Card */}
          <div className="text-center mt-16 group">
            <div className="relative bg-gradient-to-br from-purple-900/30 via-slate-800/30 to-pink-900/30 rounded-2xl p-8 backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 group-hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <Heart className="mx-auto mb-4 text-pink-400 group-hover:scale-110 transition-transform" size={32} />
                <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 group-hover:scale-105 transition-transform">
                  Summary
                </h3>
                <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed group-hover:text-gray-200 transition-colors">
                  A concise overview of my skills, experiences, and achievements, highlighting what I bring to the table 
                  in building full-stack projects and real-world applications.
                </p>
                <div className="flex flex-wrap justify-center gap-4 mt-6">
                  {["🚀 Fast Learner", "💡 Problem Solver", "⚡ Production Ready"].map((badge, index) => (
                    <span 
                      key={index}
                      className="px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30 text-purple-300 text-sm hover:bg-purple-500/30 hover:scale-105 transition-all"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Enhanced Projects Section */}
      <section id="projects" className="relative min-h-screen py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 group">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <Code className="relative text-purple-400 group-hover:scale-110 transition-transform" size={48} />
              </div>
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-4 group-hover:scale-105 transition-transform">
              Featured Projects
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light group-hover:text-gray-200 transition-colors">
              Some of the projects I've built to solve real-world problems and showcase my skills in web and software development
            </p>
          </div>

          
          <div className="grid md:grid-cols-2 gap-8  mb-12">
            {projects.map((project, idx) => (
              <div 
                key={idx} 
                className="group relative bg-slate-800/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-purple-500/20 hover:border-purple-500/50 transition-all duration-500 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20"
              >
                <div className="relative h-48 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-80`}></div>
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text group-hover:scale-105 transition-transform">
                      {project.title}
                    </h3>
                    <Zap className="text-yellow-400 group-hover:animate-pulse group-hover:scale-110 transition-transform" size={24} />
                  </div>
                  
                  <p className="text-gray-300 mb-4 leading-relaxed group-hover:text-gray-200 transition-colors">{project.desc}</p>
                  
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold text-purple-300 mb-2 flex items-center group-hover:text-purple-200 transition-colors">
                      <TrendingUp size={18} className="mr-2 group-hover:scale-110 transition-transform" />
                      Development Journey:
                    </h4>
                    <ul className="text-sm text-gray-400 space-y-2">
                      {project.journey.map((step, i) => (
                        <li key={i} className="flex items-start group/item hover:text-gray-300 transition-colors">
                          <ArrowRight size={16} className="text-purple-400 mr-2 mt-1 flex-shrink-0 group-hover/item:scale-110 transition-transform" />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-4 p-4 bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-xl backdrop-blur-sm border border-purple-500/20 group-hover:border-purple-500/40 transition-colors">
                    <h4 className="text-sm font-semibold text-purple-300 mb-2 flex items-center">
                      <Sparkles size={16} className="mr-2 group-hover:animate-pulse" />
                      Key Growth:
                    </h4>
                    <p className="text-sm text-gray-300 leading-relaxed group-hover:text-gray-200">{project.growth}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech, i) => (
                      <span 
                        key={i} 
                        className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-sm hover:bg-purple-500/30 hover:scale-105 transition-all group/tech"
                      >
                        <span className="group-hover/tech:text-purple-300 transition-colors">{tech}</span>
                      </span>
                    ))}
                  </div>

                  <div className="flex space-x-4">
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center text-purple-400 hover:text-purple-300 transition-all group/link hover:scale-105"
                    >
                      <Github size={20} className="mr-2 group-hover/link:animate-pulse" />
                      <span className="border-b border-transparent group-hover/link:border-purple-400">Code</span>
                    </a>
                    <a 
                      href={project.demo} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center text-pink-400 hover:text-pink-300 transition-all group/link hover:scale-105"
                    >
                      <ExternalLink size={20} className="mr-2 group-hover/link:animate-pulse" />
                      <span className="border-b border-transparent group-hover/link:border-pink-400">Demo</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Enhanced Featured Projects Summary */}
          <div className="text-center group">
            <div className="relative bg-gradient-to-br from-purple-900/40 via-slate-800/40 to-pink-900/40 rounded-3xl p-8 backdrop-blur-xl border border-purple-500/30 hover:border-purple-400/60 transition-all duration-500 group-hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 group-hover:scale-105 transition-transform">
                  Featured Projects
                </h3>
                <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed group-hover:text-gray-200 transition-colors">
                  A selection of projects I’ve built to tackle real-world problems, demonstrate my skills, 
                  and showcase creative solutions using modern technologies.
                </p>
                <div className="flex flex-wrap justify-center gap-4 mt-6">
                  {["💻 Web Development", "📱 Mobile Apps", "🛠 Full-Stack Solutions"].map((badge, index) => (
                    <span 
                      key={index}
                      className="px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30 text-purple-300 text-sm hover:bg-purple-500/30 hover:scale-105 transition-all"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Enhanced Skills Section */}
      <section id="skills" className="relative min-h-screen py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 group">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <Briefcase className="relative text-purple-400 group-hover:scale-110 transition-transform" size={48} />
              </div>
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-4 group-hover:scale-105 transition-transform">
              Tech Stack
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light group-hover:text-gray-200 transition-colors">
              Technologies I've mastered through building real-world projects and continuous learning
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
            {Object.entries(skills).map(([category, items], categoryIndex) => (
              <div 
                key={category}
                className="group relative"
                style={{ animationDelay: `${categoryIndex * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                
                <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 hover:border-purple-400/60 transition-all duration-500 group-hover:transform group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-purple-500/30">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-md opacity-50 group-hover:opacity-70 transition-opacity"></div>
                        <div className="relative w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          {getCategoryIcon(category)}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all">
                          {category}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse group-hover:scale-150 transition-transform"></div>
                          <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">{items.length} technologies</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {items.map((skill, skillIndex) => (
                      <div
                        key={skill}
                        className="group/item relative bg-slate-700/30 rounded-2xl p-4 border border-purple-500/10 hover:border-purple-400/40 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
                        style={{ animationDelay: `${skillIndex * 50}ms` }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <div className="absolute inset-0 bg-purple-500 rounded-xl blur-sm opacity-0 group-hover/item:opacity-50 transition-opacity"></div>
                              <img 
                                src={getTechLogo(skill)} 
                                alt={skill} 
                                className="relative w-10 h-10 group-hover/item:scale-110 group-hover/item:rotate-3 transition-transform duration-300" 
                              />
                            </div>
                            
                            <div>
                              <span className="text-lg font-semibold text-white group-hover/item:text-transparent group-hover/item:bg-gradient-to-r group-hover/item:from-purple-400 group-hover/item:to-pink-400 group-hover/item:bg-clip-text transition-all">
                                {skill}
                              </span>
                              <div className="flex items-center space-x-2 mt-1">
                                <div className="w-1 h-1 bg-purple-400 rounded-full group-hover/item:scale-150 transition-transform"></div>
                                <span className="text-xs text-gray-400 group-hover/item:text-gray-300 transition-colors">{getTechType(skill)}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 opacity-0 group-hover/item:opacity-100 transform translate-x-2 group-hover/item:translate-x-0 transition-all duration-300">
                            <div className="flex space-x-1">
                              {[1, 2, 3].map((dot) => (
                                <div
                                  key={dot}
                                  className={`w-2 h-2 rounded-full transition-all ${
                                    dot <= getProficiencyLevel(skill) 
                                      ? 'bg-green-400 group-hover/item:scale-125' 
                                      : 'bg-gray-600'
                                  }`}
                                ></div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover/item:w-full transition-all duration-500"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Tech Stack Summary */}
          <div className="text-center group">
            <div className="relative bg-gradient-to-br from-purple-900/40 via-slate-800/40 to-pink-900/40 rounded-3xl p-8 backdrop-blur-xl border border-purple-500/30 hover:border-purple-400/60 transition-all duration-500 group-hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 group-hover:scale-105 transition-transform">
                  Full-Stack Capabilities
                </h3>
                <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed group-hover:text-gray-200 transition-colors">
                  From frontend interfaces to backend systems and databases, I build complete, scalable solutions 
                  with modern technologies and best practices.
                </p>
                <div className="flex flex-wrap justify-center gap-4 mt-6">
                  {["🚀 15+ Technologies", "💡 Continuous Learning", "⚡ Production Ready"].map((badge, index) => (
                    <span 
                      key={index}
                      className="px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30 text-purple-300 text-sm hover:bg-purple-500/30 hover:scale-105 transition-all"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Achievements Section */}
      <section id="achievements" className="relative min-h-screen py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 group">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <Award className="relative text-purple-400 group-hover:scale-110 transition-transform" size={48} />
              </div>
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-4 group-hover:scale-105 transition-transform">
              Achievements
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light group-hover:text-gray-200 transition-colors">
              Recognitions that celebrate innovation, problem-solving, and technical excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {achievements.map((achievement, index) => (
              <div 
                key={index}
                className="group relative"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                
                <div className="relative h-full bg-slate-800/40 backdrop-blur-xl rounded-3xl overflow-hidden border border-purple-500/30 hover:border-purple-400/60 transition-all duration-500 group-hover:transform group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-purple-500/30">
                  
                  <div className="relative h-32 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${achievement.color} opacity-80`}></div>
                    <img 
                      src={achievement.image} 
                      alt={achievement.event}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                    
                    <div className="absolute top-4 left-4 group-hover:scale-110 transition-transform">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-md opacity-50"></div>
                        <div className="relative w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg text-xl">
                          {achievement.icon}
                        </div>
                      </div>
                    </div>

                    <div className="absolute top-4 right-4 group-hover:scale-110 transition-transform">
                      <div className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm ${
                        achievement.title.includes("Champion") 
                          ? "bg-gradient-to-r from-yellow-500/30 to-yellow-600/30 border border-yellow-500/50 text-yellow-300"
                          : achievement.title.includes("Bronze")
                          ? "bg-gradient-to-r from-amber-500/30 to-amber-600/30 border border-amber-500/50 text-amber-300"
                          : "bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-500/50 text-purple-300"
                      }`}>
                        {achievement.title}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all leading-tight">
                      {achievement.event}
                    </h3>
                    
                    <div className="bg-slate-700/30 rounded-2xl p-4 border border-purple-500/10 group-hover:border-purple-400/30 transition-all duration-300 group-hover:scale-105">
                      <div className="flex items-start space-x-3">
                        <Sparkles className="text-purple-400 mt-1 flex-shrink-0 group-hover:animate-pulse" size={18} />
                        <div>
                          <p className="text-sm font-semibold text-purple-300 mb-1 group-hover:text-purple-200">Key Learning</p>
                          <p className="text-gray-300 text-sm leading-relaxed group-hover:text-gray-200">{achievement.learning}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                      <div className="flex items-center space-x-2">
                        <Zap className="text-pink-400 group-hover:scale-110 transition-transform" size={16} />
                        <span>Project Experience</span>
                      </div>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse group-hover:scale-150 transition-transform"></div>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-700"></div>
                  
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-purple-400/50 rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-pink-400/50 rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Achievements Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { number: "2x", text: "Champion Titles", color: "purple" },
              { number: "6+", text: "Total Awards", color: "pink" },
              { number: "4", text: "Different Domains", color: "gradient" }
            ].map((stat, index) => (
              <div 
                key={index}
                className={`bg-gradient-to-br from-${stat.color === 'gradient' ? 'purple-500/10 to-pink-500/10' : `${stat.color}-500/10 to-transparent`} rounded-2xl p-6 border border-${stat.color === 'gradient' ? 'purple' : stat.color}-500/20 text-center group hover:border-${stat.color === 'gradient' ? 'purple' : stat.color}-400/40 transition-all hover:scale-105`}
              >
                <div className={`text-3xl font-bold ${
                  stat.color === 'gradient' 
                    ? 'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'
                    : `text-${stat.color}-400`
                } mb-2 group-hover:scale-110 transition-transform`}>
                  {stat.number}
                </div>
                <div className="text-gray-300 group-hover:text-gray-200 transition-colors">{stat.text}</div>
              </div>
            ))}
          </div>

          {/* Enhanced Inspirational Quote */}
          <div className="text-center group">
            <div className="relative bg-gradient-to-br from-purple-900/40 via-slate-800/40 to-pink-900/40 rounded-3xl p-8 backdrop-blur-xl border border-purple-500/30 hover:border-purple-400/60 transition-all duration-500 group-hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Award className="text-purple-400 mr-3 group-hover:animate-pulse" size={32} />
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Beyond the Trophy
                  </h3>
                </div>
                <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed italic group-hover:text-gray-200 transition-colors">
                  "Every achievement represents countless hours of learning, iteration, and growth. 
                  The real victory is in the skills gained and problems solved along the way."
                </p>
                <div className="flex flex-wrap justify-center gap-4 mt-6">
                  {["🏆 Competition Excellence", "💡 Innovative Solutions", "🚀 Real-world Impact"].map((badge, index) => (
                    <span 
                      key={index}
                      className="px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30 text-purple-300 text-sm hover:bg-purple-500/30 hover:scale-105 transition-all"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Contact Section */}
      <section id="contact" className="relative min-h-screen py-20 px-4 flex items-center">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 group">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <User className="relative text-purple-400 group-hover:scale-110 transition-transform" size={36} />
              </div>
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-4 group-hover:scale-105 transition-transform">
              Let's Connect
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light group-hover:text-gray-200 transition-colors">
              I'm always open to new ideas, collaborations, and opportunities to learn and grow together.
            </p>
          </div>

          {/* Get in Touch Summary Card */}
          <div className="text-center group">
            <div className="relative bg-gradient-to-br from-purple-900/40 via-slate-800/40 to-pink-900/40 rounded-3xl p-8 backdrop-blur-xl border border-purple-500/30 hover:border-purple-400/60 transition-all duration-500 group-hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                {/* Icon + Title */}
                <div className="flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <User className="text-purple-400 mr-3 group-hover:animate-pulse" size={36} />
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Get in Touch
                  </h3>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed mb-6 group-hover:text-gray-200 transition-colors">
                  I'm always excited to discuss new opportunities, collaborate on interesting projects, 
                  or connect with fellow developers and innovators.
                </p>

                {/* Optional Quote */}
                <p className="text-lg text-gray-400 mb-6 italic font-light group-hover:text-gray-300 transition-colors">
                  "Code with empathy. Design with purpose. Grow with every iteration."
                </p>

                {/* Badges (optional, can replace contact buttons) */}
                <div className="flex flex-wrap justify-center gap-4 mt-6">
                  {["🤝 Collaboration", "💡 Ideas Exchange", "🚀 Innovative Projects"].map((badge, index) => (
                    <span 
                      key={index}
                      className="px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30 text-purple-300 text-sm hover:bg-purple-500/30 hover:scale-105 transition-all"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>


          {/* Contact Cards */}
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mt-8">
            {[
              { icon: Mail, text: "Email Me", color: "purple", href: "mailto:chong.zhen@graduate.utm.my" },
              { icon: Linkedin, text: "LinkedIn", color: "blue", href: "https://linkedin.com/in/chongsiewzhen" },
              { icon: Github, text: "GitHub", color: "gray", href: "https://github.com/ChongSZ7279", alwaysVisible: true }
            ].map((button, index) => (
              <a
                key={index}
                href={button.href}
                target={button.href.startsWith('http') ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className={`relative flex items-center px-8 py-4 rounded-2xl transition-all transform hover:scale-105 hover:shadow-2xl
                  ${button.color === 'purple' ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600' : ''}
                  ${button.color === 'blue' ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600' : ''}
                  ${button.color === 'gray' ? 'bg-gradient-to-r from-gray-700 to-gray-800' : ''} 
                  border border-purple-500/20`}
              >
                <div className={`absolute inset-0 rounded-2xl 
                  ${button.alwaysVisible ? 'bg-gradient-to-r from-gray-500/20 to-gray-400/20 opacity-100' : 'bg-gradient-to-r from-purple-400/10 to-pink-400/10 opacity-0 group-hover:opacity-100'} 
                  transition-opacity`}></div>
                <button.icon className="mr-3 relative z-10 group-hover:animate-bounce text-white" size={24} />
                <span className="font-semibold relative z-10 text-white">{button.text}</span>
              </a>
            ))}
          </div>

        </div>

      </section>

      {/* Enhanced Footer */}
      <footer className="relative py-12 text-center border-t border-purple-500/20 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 group">
            <div className="text-left group-hover:scale-105 transition-transform">
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                Chong Siew Zhen
              </div>
              <p className="text-purple-300 italic text-sm group-hover:text-purple-200 transition-colors">
                Imperfectly Perfect: Where Growth Meets Code
              </p>
            </div>
            <div className="flex space-x-4">
              {[
                { icon: Mail, href: "mailto:chong.zhen@graduate.utm.my", color: "purple" },
                { icon: Linkedin, href: "https://linkedin.com/in/chongsiewzhen", color: "blue" },
                { icon: Github, href: "https://github.com/ChongSZ7279", color: "gray" }
              ].map((social, index) => (
                <a 
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 bg-${social.color}-500/20 rounded-lg hover:bg-${social.color}-500/30 transition-all hover:scale-110 group/social`}
                >
                  <social.icon size={20} className={`text-${social.color}-300 group-hover/social:animate-bounce`} />
                </a>
              ))}
            </div>
          </div>
          
          <div className="border-t border-purple-500/20 pt-6 group">
            <p className="text-gray-400 mb-2 group-hover:text-gray-300 transition-colors">
              © 2025 Chong Siew Zhen. Built with React & Tailwind CSS.
            </p>
            <p className="text-gray-500 text-sm group-hover:text-gray-400 transition-colors">
              CGPA: 3.96 | UTM Software Engineering | FullStack Developer
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;