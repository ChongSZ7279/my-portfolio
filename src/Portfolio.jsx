import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, ExternalLink, ChevronDown, Menu, X, Code, Briefcase, Award, User, Sparkles, TrendingUp, Heart } from 'lucide-react';

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
      setIsMenuOpen(false);
    }
  };

  const projects = [
    {
      title: "MindfulMe",
      desc: "A multilingual mental health app with AI chat, mood tracking, and meditation features.",
      tech: ["Flutter", "Node.js", "Express.js", "MySQL", "Gemini AI"],
      link: "https://github.com/ChongSZ7279/Mental-Help",
      demo: "https://youtu.be/VdWpLqm4vBc",
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
      demo: "https://youtu.be/F1Kf8mOOm_o",
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
      demo: "https://youtu.be/AukSKLfIWlM",
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

  const achievements = [
    { title: "Champion", event: "HCI Day 2024 (Foodful App)", icon: "🥇", learning: "User-centered design principles" },
    { title: "Bronze Award", event: "Fusion 2024 (Foodful App)", icon: "🥉", learning: "Cross-platform development" },
    { title: "Panasonic Award", event: "ABU Robocon 2024", icon: "🏅", learning: "Hardware-software integration" },
    { title: "Top 10 Finalist", event: "VHACK 2025 (TrustChain)", icon: "🏅", learning: "Blockchain security" },
    { title: "Top 15 Finalist", event: "Hack@10 2023 (Durian)", icon: "🏅", learning: "Machine learning deployment" },
    { title: "Champion", event: "Young Maker Challenge 2019", icon: "🏆", learning: "Prototype development" }
  ];

  const growthTimeline = [
    { year: "2023", event: "First Hackathon", learning: "Discovered passion for problem-solving through code" },
    { year: "2023", event: "Machine Learning Project", learning: "Learned AI/ML fundamentals and deployment" },
    { year: "2024", event: "Blockchain Exploration", learning: "Mastered Web3 and smart contract development" },
    { year: "2024", event: "Full-Stack Development", learning: "Integrated frontend and backend systems" },
    { year: "2025", event: "Open Source Contribution", learning: "Understanding collaborative development" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-900/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                CSZ
              </div>
              <div className="ml-3 text-sm text-purple-300 italic hidden sm:block">
                Imperfectly Perfect
              </div>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              {['home', 'journey', 'projects', 'skills', 'achievements', 'contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className={`capitalize hover:text-purple-400 transition-colors ${activeSection === item ? 'text-purple-400' : ''}`}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-900/98 backdrop-blur-sm">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {['home', 'journey', 'projects', 'skills', 'achievements', 'contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="block w-full text-left px-3 py-2 capitalize hover:bg-purple-900/50 rounded"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <Sparkles className="mx-auto text-purple-400 mb-2" size={32} />
            <p className="text-lg text-purple-300 italic mb-2">
              Imperfectly Perfect: Where Growth Meets Code
            </p>
          </div>
          <div className="mb-8 animate-bounce">
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-6xl">
              👋
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Hi, I'm Chong Siew Zhen
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-6">
            Software Engineering Student @ UTM
          </p>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            CGPA: 3.96 | Seeking Full Stack / Frontend / Backend / QA Internship (Sept 2025 – Feb 2026)
          </p>
          <div className="flex justify-center space-x-4 mb-12">
            <a href="mailto:chong.zhen@graduate.utm.my" className="p-3 bg-purple-600 hover:bg-purple-700 rounded-full transition-all transform hover:scale-110">
              <Mail size={24} />
            </a>
            <a href="https://linkedin.com/in/chongsiewzhen" target="_blank" rel="noopener noreferrer" className="p-3 bg-purple-600 hover:bg-purple-700 rounded-full transition-all transform hover:scale-110">
              <Linkedin size={24} />
            </a>
            <a href="https://github.com/ChongSZ7279" target="_blank" rel="noopener noreferrer" className="p-3 bg-purple-600 hover:bg-purple-700 rounded-full transition-all transform hover:scale-110">
              <Github size={24} />
            </a>
          </div>
          <button onClick={() => scrollToSection('journey')} className="animate-bounce">
            <ChevronDown size={32} className="text-purple-400" />
          </button>
        </div>
      </section>

      {/* Growth Journey Section */}
      <section id="journey" className="min-h-screen py-20 px-4 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center mb-12">
            <TrendingUp className="mr-3 text-purple-400" size={32} />
            <h2 className="text-4xl md:text-5xl font-bold">My Growth Journey</h2>
          </div>
          <p className="text-xl text-gray-300 text-center mb-12 max-w-3xl mx-auto">
            Every project tells a story of learning, iteration, and growth. Here's how I've evolved as a developer.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {growthTimeline.map((item, idx) => (
              <div key={idx} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/50 transition-all">
                <div className="text-2xl font-bold text-purple-400 mb-2">{item.year}</div>
                <h3 className="text-xl font-bold mb-2 text-white">{item.event}</h3>
                <p className="text-gray-300 italic">{item.learning}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-lg text-purple-300 italic">
              "The master has failed more times than the beginner has even tried."
            </p>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="min-h-screen py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center mb-12">
            <Code className="mr-3 text-purple-400" size={32} />
            <h2 className="text-4xl md:text-5xl font-bold">Featured Projects</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, idx) => (
              <div key={idx} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 hover:transform hover:scale-105 transition-all duration-300 border border-purple-500/20 hover:border-purple-500/50">
                <h3 className="text-2xl font-bold mb-3 text-purple-400">{project.title}</h3>
                <p className="text-gray-300 mb-4">{project.desc}</p>
                
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-purple-300 mb-2">Development Journey:</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    {project.journey.map((step, i) => (
                      <li key={i} className="flex items-start">
                        <Sparkles size={16} className="text-purple-400 mr-2 mt-1 flex-shrink-0" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4 p-3 bg-purple-900/30 rounded-lg">
                  <h4 className="text-sm font-semibold text-purple-300 mb-1">Key Growth:</h4>
                  <p className="text-sm text-gray-300">{project.growth}</p>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech, i) => (
                    <span key={i} className="px-3 py-1 bg-purple-900/50 rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex space-x-4">
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center text-purple-400 hover:text-purple-300">
                    <Github size={20} className="mr-2" />
                    Code
                  </a>
                  <a href={project.demo} target="_blank" rel="noopener noreferrer" className="flex items-center text-purple-400 hover:text-purple-300">
                    <ExternalLink size={20} className="mr-2" />
                    Demo
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="min-h-screen py-20 px-4 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center mb-12">
            <Briefcase className="mr-3 text-purple-400" size={32} />
            <h2 className="text-4xl md:text-5xl font-bold">Tech Stack</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(skills).map(([category, items]) => (
              <div key={category} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                <h3 className="text-2xl font-bold mb-4 text-purple-400">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill, i) => (
                    <span key={i} className="px-3 py-2 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-lg text-sm hover:from-purple-800/50 hover:to-pink-800/50 transition-all">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section id="achievements" className="min-h-screen py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center mb-12">
            <Award className="mr-3 text-purple-400" size={32} />
            <h2 className="text-4xl md:text-5xl font-bold">Achievements & Learnings</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement, idx) => (
              <div key={idx} className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 hover:border-purple-400 transition-all transform hover:scale-105">
                <div className="text-4xl mb-3">{achievement.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-purple-300">{achievement.title}</h3>
                <p className="text-gray-300 mb-3">{achievement.event}</p>
                <div className="p-2 bg-slate-800/50 rounded">
                  <p className="text-sm text-purple-200 italic">Learned: {achievement.learning}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="min-h-screen py-20 px-4 bg-slate-900/50 flex items-center">
        <div className="max-w-4xl mx-auto text-center w-full">
          <div className="flex items-center justify-center mb-12">
            <User className="mr-3 text-purple-400" size={32} />
            <h2 className="text-4xl md:text-5xl font-bold">Let's Connect</h2>
          </div>
          <p className="text-xl text-gray-300 mb-8">
            I'm actively seeking internship opportunities from September 2025 to February 2026.
          </p>
          <p className="text-lg text-gray-400 mb-12 italic">
            "Code with empathy. Design with purpose. Grow with every iteration."
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a href="mailto:chong.zhen@graduate.utm.my" className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-110">
              <Mail className="mr-2" size={20} />
              Email Me
            </a>
            <a href="https://linkedin.com/in/chongsiewzhen" target="_blank" rel="noopener noreferrer" className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-110">
              <Linkedin className="mr-2" size={20} />
              LinkedIn
            </a>
            <a href="https://github.com/ChongSZ7279" target="_blank" rel="noopener noreferrer" className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-110">
              <Github className="mr-2" size={20} />
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-400 border-t border-purple-500/20">
        <p>© 2025 Chong Siew Zhen. <span className="text-purple-300">Imperfectly Perfect: Where Growth Meets Code.</span></p>
        <p className="mt-2">Built with React & Tailwind CSS.</p>
      </footer>
    </div>
  );
};

export default Portfolio;