import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ArrowDown, BrainCircuit, Bot, Sparkles, Check, Send, Sparkle, Heart } from 'lucide-react';
import { TabType } from '../types';

interface HomeViewProps {
  setActiveTab: (tab: TabType) => void;
  isPremium: boolean;
  onOpenHelp: () => void;
}

export default function HomeView({ setActiveTab, isPremium, onOpenHelp }: HomeViewProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim().includes('@')) {
      setSubmitted(true);
      setTimeout(() => {
        setEmail('');
      }, 3000);
    }
  };

  const bentoBoards = [
    {
      id: 'board-1',
      title: 'Analog nostalgia',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDU5C3lG4O42AwU6hyaxRojxdUwETcgZ-AMqlw_7-Vss2BD3Rjl9MhTnFna32sjDPqqSieLwTzS8B8Xtza_CydETKs6ivDEPNnl0xB-HAwZgoxX-R9aGCorPvM9u0eVEOlhsTVchfSwbAxdXO_9bMNGRY9N4NciB8xqwRUSk0W1yJ1t6CxzdMXIExLqgc3agCK4R6JWNNqhvtzMj068WQ0xJSFAmNeOBb0ncMIWoHa1ePxsh_ZaSsjYHjt4mQC6_oir8tqT5Vm7DpE',
      desc: 'Warm jazz & vinyl dust'
    },
    {
      id: 'board-2',
      title: 'Neon cyber-grid',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClP9w_7DiD0pVZq4qr0HvjkKm0cZ4LfhIuRyFeUwoQ5khIIT3hFpVBrz44y43e1e5mnvMCDl5Lp-3WIw5UdblbShOrDScH8ZD8QADOhymk8TE2GJn9akIymb639OFxpZj9Ys3rX30R9WtYs8Ji7ZD2I-9sfepcCVgrHfyqydKz8M43nXymkQgCEHTUa8H0MBrSt1OfIg4yy4bb9DUQffyaOfQEXNFWstDM7ZGZsgtk1o79OPlzgy934oDcRCen3rvYlxj6yCPwpmU',
      desc: 'Tokyo night long exposures'
    },
    {
      id: 'board-3',
      title: 'Brutalist concrete',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDehET_d1Vr9ji_HlHGUh9Y60OIYkeLy8pHylKPiYLyWrqZBKejUKEOe-v20xPqGfnI0B0DLSrU-2WggEgiVrZo6yoJEQ9UN0gsw5dicTIxv717oHmlesw-6pBgXfGGU_7ENbNZB-jCjJfO5MK7F44U1N7CBqCssLucISeJttKi60X3BoLLCkYR3eLlHnjxmWoCMMTRZNFMpULvHg9_c5Nh68tcN0tVTGQzmPSZREJqJvdIxVVS12d7am49JpzWP5f_MYnrHrCJ8FA',
      desc: 'Monochrome concrete angles'
    },
    {
      id: 'board-4',
      title: 'Iridescent swirl',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAt8_WGkrTBf-kTavSoHhMLgYe7fSLtTLi3NLd1iXT9ZaxktgmePoqMvCkW5NOuYPhKKBEUSDqeh8-uAaYYsZ5M7LfsdZ2QGenAUN_z9wYqh2UWpsyXcnUkFYReRq_B20f-s-7WpTKmwF11V8wtP6TGTUiybkUMayXNuFW1Br4_2JzA8mvO0P1MmzbUeqJXIKttDTonJkBkrJumx6VQRhhFBuaYaZoau7MZM_aJUIGAJBexiES2tkZrv8vCGCmjmpWDLnxSRSYCwGA',
      desc: 'Trippy metallic fluid'
    }
  ];

  return (
    <div className="w-full text-[#dfe1f6] px-4 md:px-12 lg:px-20 py-24 md:py-32 relative overflow-hidden select-none">
      {/* Hero Header Section */}
      <header className="relative min-h-[70vh] flex flex-col justify-center items-start text-left max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 bg-[#fface8]/10 border border-[#fface8]/20 px-3 py-1 rounded-full text-xs text-[#fface8] tracking-widest uppercase font-display font-semibold">
            <Sparkle className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
            The Future of Social Connection
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-white leading-none">
            Find your vibe <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fface8] via-[#ff24e4] to-[#00dbe9]">
              before you find your person.
            </span>
          </h1>
          <p className="font-sans text-lg md:text-xl text-[#ddbed1]/80 max-w-2xl leading-relaxed">
            Discover people through passions, creativity, conversations, and shared experiences—not just photos. 
            NexusVibe uses AI to map your digital DNA to your perfect match.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab('chat')}
              className="px-8 py-4 bg-[#ff24e4] hover:bg-[#fface8] text-white hover:text-[#5e0053] rounded-xl font-display text-xs font-semibold uppercase tracking-widest shadow-[0_0_20px_rgba(255,36,228,0.4)] transition-all cursor-pointer flex items-center gap-2"
            >
              Get Started
              <ChevronRight className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab('explore')}
              className="px-8 py-4 border border-[#00dbe9]/50 text-[#00dbe9] bg-white/5 backdrop-blur-md hover:bg-[#00dbe9]/10 rounded-xl font-display text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer"
            >
              Explore Vibes
            </motion.button>
          </div>
        </motion.div>

        {/* Double Chevron Bounce Down */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1 opacity-50"
        >
          <span className="text-[10px] font-display uppercase tracking-widest text-[#fface8]/60">Discover More</span>
          <ArrowDown className="w-5 h-5 text-[#fface8]" />
        </motion.div>
      </header>

      {/* Bento Grid Features Section */}
      <section className="py-24 max-w-7xl mx-auto space-y-8">
        <div className="space-y-2 mb-12">
          <span className="text-xs font-display font-bold uppercase tracking-widest text-[#fface8]">Features</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight">
            Designed for Genuine Connections
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* AI Matchmaking (8 cols) */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="lg:col-span-8 bg-[#0a0d1c]/40 backdrop-blur-xl border border-[#fface8]/15 rounded-3xl p-8 md:p-10 flex flex-col justify-between relative overflow-hidden group shadow-xl"
          >
            <div className="flex justify-between items-start mb-8 z-10">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-[#fface8]/10 text-[#fface8] font-display text-xs font-semibold uppercase tracking-wider mb-3">
                  Smart Match
                </span>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-white">AI Matchmaking</h3>
              </div>
              <BrainCircuit className="w-10 h-10 text-[#fface8]" />
            </div>
            
            <p className="font-sans text-sm md:text-base text-[#ddbed1]/90 max-w-lg mb-8 leading-relaxed z-10">
              Our advanced neural network analyzes your music taste, aesthetic preferences, conversation style, and creative boards to predict deep psychological compatibility far beyond the superficial swipe.
            </p>

            <div className="h-60 rounded-2xl overflow-hidden relative group/image border border-white/5">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwr-5rFf7uwwtvgAZ6gcL8pZIJZZZ8h3tCuKpbD2aYYzxmynsdE2V5HM1-0Oy_0KwZePh7Q1FBVYkrS81Z6sq1LvXahJEsMaCS_QBk2KsgQ90mFTPamyqSrZD2CvOqb7bd9CKvfz96eKl8t6CXb-XTKPRmZY3hEBuM9f-EUUyCYC3bmh1qQJYBDADV_4RrbHc4V0q9Z2R0-CZh6KenpFrbHeIJOkpIbXeyFwa0lNQ8-vQc25lhVDuAmsP3LmfVyJW66p0mdKhsRZo" 
                alt="AI Matchmaking Nodes Graph" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover/image:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050816] to-transparent opacity-60" />
            </div>
          </motion.div>

          {/* AI Companion (4 cols) */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="lg:col-span-4 bg-[#0a0d1c]/40 backdrop-blur-xl border border-[#fface8]/15 rounded-3xl p-8 md:p-10 flex flex-col justify-between relative overflow-hidden shadow-xl"
          >
            <div className="mb-6">
              <span className="inline-block px-3 py-1 rounded-full bg-[#00dbe9]/10 text-[#00dbe9] font-display text-xs font-semibold uppercase tracking-wider mb-3">
                Always There
              </span>
              <h3 className="font-display text-2xl font-bold text-white">AI Companion</h3>
            </div>
            
            <p className="font-sans text-sm text-[#ddbed1]/90 leading-relaxed mb-8">
              Your personal wingman. Get creative icebreakers, date recommendations, and profile optimizations tailored to your unique matching vibe.
            </p>

            {/* Simulated Wingman Advice Bubble */}
            <div className="mt-auto p-5 bg-[#171b2a]/60 border border-white/5 rounded-2xl relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-20 h-20 bg-[#00dbe9]/10 blur-2xl rounded-full" />
              <div className="flex gap-3 items-center mb-3">
                <div className="w-8 h-8 rounded-full bg-[#00dbe9]/10 border border-[#00dbe9]/30 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-[#00dbe9]" />
                </div>
                <div>
                  <div className="text-[10px] text-[#00dbe9] font-display font-bold tracking-widest uppercase">Nexus AI</div>
                  <div className="text-[9px] text-[#ddbed1]/50">Real-time Insight</div>
                </div>
              </div>
              <p className="text-xs italic text-white leading-relaxed font-sans">
                "She also loves vintage analog synthesizers. Ask her about her favorite Moog patch!"
              </p>
            </div>
          </motion.div>

          {/* Vibe Boards (12 cols) */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="lg:col-span-12 bg-[#0a0d1c]/40 backdrop-blur-xl border border-[#fface8]/15 rounded-3xl p-8 md:p-10 flex flex-col lg:flex-row gap-12 relative overflow-hidden shadow-xl"
          >
            <div className="lg:w-1/3 flex flex-col justify-center">
              <span className="inline-block self-start px-3 py-1 rounded-full bg-[#d1bcff]/10 text-[#d1bcff] font-display text-xs font-semibold uppercase tracking-wider mb-3">
                Creative Space
              </span>
              <h3 className="font-display text-3xl font-bold text-white mb-4">Vibe Boards</h3>
              <p className="font-sans text-sm text-[#ddbed1]/90 leading-relaxed">
                Express yourself through aesthetic collections, ambient music playlists, and architectural captures. Let people look at the world through your eyes before you ever say hello.
              </p>
            </div>

            {/* Boards Grid: Grayscale hover to Color */}
            <div className="lg:w-2/3 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {bentoBoards.map((b, i) => (
                <div 
                  key={b.id} 
                  className={`relative aspect-square rounded-2xl overflow-hidden border border-white/5 group/board cursor-pointer ${
                    i % 2 === 1 ? 'mt-4 sm:mt-8' : ''
                  }`}
                >
                  <img 
                    src={b.img} 
                    alt={b.title} 
                    className="w-full h-full object-cover grayscale group-hover/board:grayscale-0 group-hover/board:scale-105 transition-all duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover/board:opacity-100 transition-opacity" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <h4 className="text-xs font-display font-semibold text-white tracking-wider uppercase">{b.title}</h4>
                    <p className="text-[10px] text-[#ddbed1]/60 font-sans mt-0.5 group-hover/board:text-[#fface8] transition-colors">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Waitlist Block */}
      <section className="py-24 max-w-5xl mx-auto text-center relative z-10">
        <div className="relative rounded-[40px] overflow-hidden p-8 md:p-16 border border-[#fface8]/15 bg-gradient-to-br from-[#ff24e4]/10 via-[#0a0d1c]/40 to-[#00dbe9]/10 backdrop-blur-2xl shadow-2xl">
          <div className="absolute top-0 left-1/4 w-40 h-40 bg-[#ff24e4]/10 blur-[80px] rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-[#00dbe9]/10 blur-[80px] rounded-full" />
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white tracking-tight">
              Ready to find your tribe?
            </h2>
            <p className="font-sans text-sm md:text-base text-[#ddbed1]/80 leading-relaxed">
              Join 2M+ digital nomads, designers, and visionaries who have swapped shallow swipes for deep vibes. 
              The next generation of genuine social connection is here.
            </p>

            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleWaitlistSubmit}
                  className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-4"
                >
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email" 
                    className="flex-1 bg-[#050816]/75 border border-[#fface8]/30 focus:border-[#fface8] rounded-xl px-5 py-3.5 text-sm text-white placeholder-[#ddbed1]/40 focus:outline-none focus:ring-1 focus:ring-[#fface8] font-sans"
                  />
                  <button 
                    type="submit"
                    className="bg-[#fface8] hover:bg-[#ff24e4] text-[#5e0053] hover:text-white px-6 py-3.5 rounded-xl font-display text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_12px_rgba(255,172,232,0.2)]"
                  >
                    <span>Join Waitlist</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </motion.form>
              ) : (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-4 bg-[#00dbe9]/10 border border-[#00dbe9]/30 rounded-2xl max-w-sm mx-auto flex items-center gap-3 justify-center text-[#00dbe9]"
                >
                  <div className="w-6 h-6 rounded-full bg-[#00dbe9]/25 flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </div>
                  <span className="font-display text-xs font-bold uppercase tracking-wider">You're on the list! Welcome.</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="w-full pt-20 border-t border-white/5 max-w-7xl mx-auto text-[#ddbed1]/60 text-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <h3 className="font-display text-xl font-bold text-[#fface8] tracking-tighter">NexusVibe</h3>
            <p className="font-sans text-xs leading-relaxed max-w-xs">
              The premier destination for AI-curated social discovery, premium digital mood boards, and genuine high-contrast connections.
            </p>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-widest text-white mb-4">Product</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => setActiveTab('explore')} className="hover:text-[#fface8] transition-colors cursor-pointer">
                  Vibe Boards
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('chat')} className="hover:text-[#fface8] transition-colors cursor-pointer">
                  AI Companion
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('premium')} className="hover:text-[#fface8] transition-colors cursor-pointer">
                  Pricing Plans
                </button>
              </li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-widest text-white mb-4">Support</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={onOpenHelp} className="hover:text-[#fface8] transition-colors text-left">Help Center</button>
              </li>
              <li>
                <a href="#" className="hover:text-[#fface8] transition-colors">Community Guidelines</a>
              </li>
              <li>
                <a href="#" className="hover:text-[#fface8] transition-colors">Safety Centre</a>
              </li>
            </ul>
          </div>

          {/* Links 3 */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-widest text-white mb-4">Legal</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#" className="hover:text-[#fface8] transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="hover:text-[#fface8] transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="hover:text-[#fface8] transition-colors">Cookie Policy</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="border-t border-white/5 py-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <p>© 2026 NexusVibe AI. All rights reserved.</p>
          <div className="flex items-center gap-2 text-[#00dbe9] font-display font-semibold uppercase tracking-wider">
            <Check className="w-3.5 h-3.5" />
            Certified Vibe System v2.0
          </div>
        </div>
      </footer>
    </div>
  );
}
