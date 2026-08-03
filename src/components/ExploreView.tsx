import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Heart, MessageSquare, Bookmark, Compass, Terminal, Cpu, Clock, HelpCircle, Bot, Plus } from 'lucide-react';
import { VibeCard, TabType } from '../types';

interface ExploreViewProps {
  vibeCards: VibeCard[];
  setVibeCards: React.Dispatch<React.SetStateAction<VibeCard[]>>;
  setActiveTab: (tab: TabType) => void;
  onSaveToBoard: (card: VibeCard) => void;
}

export default function ExploreView({ vibeCards, setVibeCards, setActiveTab, onSaveToBoard }: ExploreViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showCodeDetails, setShowCodeDetails] = useState(false);
  const [communityMembers, setCommunityMembers] = useState([
  { id: '1', name: 'Matilda', role: 'Web Developer', location: 'Nairobi', isFollowing: false, isLiked: false, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
  { id: '2', name: 'Nellie', role: 'UI/UX Designer', location: 'Nakuru', isFollowing: false, isLiked: false, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150' },
]);

const handleToggleFollow = (id: string) => {
  setCommunityMembers(prev => prev.map(m => m.id === id ? { ...m, isFollowing: !m.isFollowing } : m));
};

const handleToggleLike = (id: string) => {
  setCommunityMembers(prev => prev.map(m => m.id === id ? { ...m, isLiked: !m.isLiked } : m));
};

  const categories = [
    { id: 'all', label: 'All Vibes' },
    { id: 'photography', label: 'Photography' },
    { id: 'ai_art', label: 'AI Art' },
    { id: 'coding', label: 'Coding' },
    { id: 'travel', label: 'Travel' },
    { id: 'food', label: 'Food' },
  ];

  // Filtering logic
  const filteredCards = vibeCards.filter((card) => {
    const matchesSearch = 
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.authorHandle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (card.description && card.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = activeCategory === 'all' || card.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setVibeCards(prev => prev.map(card => {
      if (card.id === id) {
        const hasLiked = !card.hasLiked;
        return {
          ...card,
          hasLiked,
          likes: hasLiked ? card.likes + 1 : card.likes - 1
        };
      }
      return card;
    }));
  };

  const handleBookmark = (card: VibeCard, e: React.MouseEvent) => {
    e.stopPropagation();
    setVibeCards(prev => prev.map(c => {
      if (c.id === card.id) {
        const hasBookmarked = !c.hasBookmarked;
        if (hasBookmarked) {
          onSaveToBoard(card);
        }
        return { ...c, hasBookmarked };
      }
      return c;
    }));
  };

  return (
    <div className="w-full min-h-screen text-[#dfe1f6] px-4 md:px-10 lg:px-16 py-24 md:py-28 relative select-none pb-24">
      
      {/* Top Welcome Banner & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
        <div>
          <span className="text-xs font-display font-bold uppercase tracking-widest text-[#fface8]">For You Feed</span>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight mt-1">
            Hey Alex! Discover your next favorite vibe.
          </h1>
        </div>

        {/* Search Input Box */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ddbed1]/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vibes, authors, or tags..."
            className="w-full bg-[#0a0d1c]/50 border border-[#fface8]/15 focus:border-[#fface8] rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-[#ddbed1]/30 focus:outline-none focus:ring-1 focus:ring-[#fface8] font-sans transition-all backdrop-blur-md"
          />
        </div>
      </div>

      {/* Category Selectors */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-thin scrollbar-thumb-white/10">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full font-display text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#ff24e4] to-[#fface8] text-white shadow-[0_0_12px_rgba(255,36,228,0.3)]'
                  : 'bg-[#0a0d1c]/40 border border-[#fface8]/10 text-[#ddbed1]/70 hover:text-white hover:border-[#fface8]/30'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Masonry Grid Feed */}
      {filteredCards.length > 0 ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          <AnimatePresence mode="popLayout">
            {filteredCards.map((card) => {
              const isCoding = card.category === 'coding';
              
              return (
                <motion.div
                  key={card.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="break-inside-avoid bg-[#0a0d1c]/40 backdrop-blur-xl border border-[#fface8]/10 rounded-2xl overflow-hidden group hover:border-[#fface8]/45 transition-all shadow-lg flex flex-col cursor-default"
                >
                  {/* Photo vibe block */}
                  {!isCoding && card.image && (
                    <div className="relative overflow-hidden aspect-video max-h-72 w-full border-b border-white/5">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050816] to-transparent opacity-40" />
                      
                      {/* Floating tag */}
                      <span className="absolute top-3 left-3 bg-[#050816]/80 backdrop-blur-md text-[#fface8] border border-[#fface8]/30 px-2.5 py-1 rounded-md text-[10px] uppercase font-display font-bold tracking-wider">
                        {card.categoryLabel}
                      </span>
                    </div>
                  )}

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    {isCoding && (
                      <div className="flex justify-between items-center">
                        <span className="bg-[#00dbe9]/10 text-[#00dbe9] border border-[#00dbe9]/30 px-2.5 py-1 rounded-md text-[10px] uppercase font-display font-bold tracking-wider">
                          {card.categoryLabel}
                        </span>
                        <Terminal className="w-4 h-4 text-[#00dbe9]" />
                      </div>
                    )}

                    <h3 className="font-display text-lg font-bold text-white tracking-tight leading-snug group-hover:text-[#fface8] transition-colors">
                      {card.title}
                    </h3>

                    {card.description && (
                      <p className="font-sans text-xs text-[#ddbed1]/80 leading-relaxed">
                        {card.description}
                      </p>
                    )}

                    {/* Specific Code Snippet Box (Card 3 design layout) */}
                    {isCoding && (
                      <div className="p-4 bg-[#111425] border border-white/5 rounded-xl font-mono text-[11px] text-[#00dbe9] space-y-3">
                        <div className="flex items-center gap-1.5 border-b border-white/5 pb-2">
                          <Terminal className="w-3.5 h-3.5" />
                          <span>threejs_glass_optimized.js</span>
                        </div>
                        
                        {/* Stats progress bars */}
                        <div className="space-y-2">
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px]">
                              <span>Memory Utilization</span>
                              <span>85%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-[#00dbe9] rounded-full" style={{ width: '85%' }} />
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px]">
                              <span>Performance Baseline</span>
                              <span>60 FPS</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-[#ff24e4] rounded-full" style={{ width: '100%' }} />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px]">
                              <span>Render Draw Pass</span>
                              <span>2.1 ms</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-[#d1bcff] rounded-full" style={{ width: '30%' }} />
                            </div>
                          </div>
                        </div>

                        <button 
                          onClick={() => setShowCodeDetails(true)}
                          className="w-full py-2 bg-[#fface8]/10 hover:bg-[#fface8]/20 border border-[#fface8]/20 hover:border-[#fface8]/45 text-[#fface8] rounded-lg text-center cursor-pointer transition-colors font-display text-[10px] font-bold uppercase tracking-wider"
                        >
                          View Gist
                        </button>
                      </div>
                    )}

                    {/* Meta location / tag info */}
                    {card.location && (
                      <div className="flex items-center gap-1 text-[11px] text-[#ddbed1]/50 font-sans">
                        <Compass className="w-3.5 h-3.5 text-[#00dbe9]" />
                        <span>{card.location}</span>
                      </div>
                    )}

                    {card.tags && (
                      <div className="flex flex-wrap gap-1.5">
                        {card.tags.map((tag) => (
                          <span key={tag} className="text-[10px] font-display text-[#d1bcff] bg-[#d1bcff]/15 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Author Bar & Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-display font-semibold text-xs text-white uppercase border border-white/10">
                          {card.authorHandle.charAt(0)}
                        </div>
                        <div>
                          <div className="text-[11px] font-semibold text-white leading-tight">{card.authorName}</div>
                          <div className="text-[10px] text-[#ddbed1]/50">@{card.authorHandle}</div>
                        </div>
                      </div>

                      {/* Social/Bookmark CTAs */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => handleLike(card.id, e)}
                          className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                            card.hasLiked
                              ? 'bg-[#ff24e4]/10 border-[#ff24e4]/40 text-[#ff24e4]'
                              : 'bg-white/5 border-white/5 text-[#ddbed1]/60 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${card.hasLiked ? 'fill-[#ff24e4]' : ''}`} />
                          <span className="text-[10px] font-mono">{card.likes}</span>
                        </button>

                        <button
                          onClick={(e) => handleBookmark(card, e)}
                          className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                            card.hasBookmarked
                              ? 'bg-[#00dbe9]/10 border-[#00dbe9]/40 text-[#00dbe9]'
                              : 'bg-white/5 border-white/5 text-[#ddbed1]/60 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${card.hasBookmarked ? 'fill-[#00dbe9]' : ''}`} />
                          <span className="text-[10px] font-mono">{card.comments}</span>
                        </button>
                      </div>
                    </div>
                  </div>
               </motion.div>
    );
  })}
  </AnimatePresence>
</div>
) : (
  <div className="py-20 text-center">
    <p className="text-[#ddbed1]/50 font-sans">No vibe cards found.</p>
  </div>
)}
      {/* Floating Action Button (FAB) (Ask AI Companion) */}
      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setActiveTab('chat')}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 bg-gradient-to-r from-[#ff24e4] via-[#fface8] to-[#00dbe9] p-3 md:p-4 rounded-full text-white font-display font-semibold text-xs tracking-widest uppercase flex items-center gap-2 shadow-[0_0_20px_rgba(255,36,228,0.4)] cursor-pointer group"
      >
        <Bot className="w-5 h-5 animate-pulse text-white group-hover:rotate-12 transition-transform" />
        <span className="hidden md:inline">Ask AI Companion</span>
      </motion.button>

   {/* Gist Modal overlay */}
      <AnimatePresence>
        {showCodeDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0c0f1d] border border-[#00dbe9]/30 rounded-2xl max-w-lg w-full p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-[#00dbe9] font-mono text-sm">
                  Gist Details
                </span>
                <button
                  onClick={() => setShowCodeDetails(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="text-gray-300 text-sm mb-6">
                {/* Modal content goes here */}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Community Members */}
      <div className="mt-8 mb-12">
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white mb-4">
            Discover Community Members
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {communityMembers.map((member) => (
              <div
                key={member.id}
                className="bg-[#12141a] border border-[#262838] p-4 rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />

                  <div>
                    <h4 className="text-white font-semibold text-sm">
                      {member.name}
                    </h4>

                    <p className="text-xs text-gray-400">
                      {member.role} • {member.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleLike(member.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      member.isLiked
                        ? "bg-pink-500/20 text-pink-400 border border-pink-500/30"
                        : "bg-[#1a1d26] text-gray-300 hover:bg-[#222634]"
                    }`}
                  >
                    {member.isLiked ? "Liked ❤️" : "Like"}
                  </button>

                  <button
                    onClick={() => handleToggleFollow(member.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      member.isFollowing
                        ? "bg-[#2a2f40] text-white"
                        : "bg-[#ddbed1] text-[#12141a] hover:opacity-90"
                    }`}
                  >
                    {member.isFollowing ? "Following" : "Follow"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
);
}  