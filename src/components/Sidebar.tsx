import { TabType, UserProfile } from '../types';
import { Home, Compass, LayoutGrid, MessageSquareText, Award, Settings, HelpCircle, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isPremium: boolean;
  onUpgradeClick: () => void;
  profile: UserProfile;
  onOpenSettings?: () => void;
  onOpenHelp?: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, isPremium, onUpgradeClick, profile, onOpenSettings, onOpenHelp }: SidebarProps) {
  const menuItems = [
    { id: 'home' as TabType, label: 'Home', icon: Home },
    { id: 'explore' as TabType, label: 'Explore', icon: Compass },
    { id: 'boards' as TabType, label: 'Boards', icon: LayoutGrid }, 
    { id: 'messages' as TabType, label: 'MESSAGES', icon: MessageSquareText },
    { id: 'chat' as TabType, label: 'AI Chat', icon: MessageSquareText },
    { id: 'premium' as TabType, label: 'Premium', icon: Award },
  ];

  return (
    <>
      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 z-40 bg-[#0a0d1c]/60 backdrop-blur-2xl border-r border-[#fface8]/10 py-8 select-none">
        {/* Header / Brand */}
        <div className="px-6 mb-12">
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-[#fface8] tracking-tighter">
              NexusVibe
            </h1>
            {isPremium && (
              <span className="bg-gradient-to-r from-[#ff24e4] to-[#00dbe9] p-[2px] rounded-full">
                <span className="block bg-[#0f1321] text-[10px] text-[#fface8] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  Pro
                </span>
              </span>
            )}
          </div>
          <p className="font-display text-xs text-[#ddbed1]/70 tracking-widest uppercase mt-1">
            Premium AI Discovery
          </p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 text-left transition-all relative group cursor-pointer ${
                  isActive 
                    ? 'text-[#fface8] font-semibold bg-[#fface8]/10' 
                    : 'text-[#ddbed1]/70 hover:text-[#dfe1f6] hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeTabIndicator"
                    className="absolute right-0 top-0 bottom-0 w-1 bg-[#fface8] shadow-[0_0_8px_#fface8]"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#fface8]' : 'text-[#ddbed1]/50 group-hover:text-[#fface8]/80'}`} />
                <span className="font-display text-sm uppercase tracking-wider">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom CTA / Actions */}
        <div className="px-6 mt-auto space-y-4">
          {!isPremium ? (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onUpgradeClick}
              className="w-full py-3 px-4 bg-[#fface8] hover:bg-[#ff24e4] text-[#5e0053] hover:text-[#dfe1f6] font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(255,172,232,0.25)] flex items-center justify-center gap-2 cursor-pointer text-sm font-display tracking-wider uppercase"
            >
              <Sparkles className="w-4 h-4" />
              Upgrade to Pro
            </motion.button>
          ) : (
            <div className="p-3 bg-gradient-to-tr from-[#fface8]/10 to-[#00dbe9]/10 rounded-xl border border-[#fface8]/20">
              <p className="text-xs text-[#fface8] font-semibold font-display tracking-wider uppercase mb-1">
                Pro Access Unlocked
              </p>
              <p className="text-[11px] text-[#ddbed1]/80">
                Unlimited AI Companion features & dynamic premium themes.
              </p>
            </div>
          )}

          <div className="pt-4 border-t border-white/5 space-y-1">
            <button 
              onClick={onOpenSettings}
              className="w-full flex items-center gap-4 text-[#ddbed1]/70 hover:text-[#fface8] py-2 transition-colors cursor-pointer text-left"
            >
              <Settings className="w-4 h-4 text-[#ddbed1]/40" />
              <span className="text-xs font-display uppercase tracking-wider">Settings</span>
            </button>
            <button 
              onClick={onOpenHelp}
              className="w-full flex items-center gap-4 text-[#ddbed1]/70 hover:text-[#fface8] py-2 transition-colors cursor-pointer text-left"
            >
              <HelpCircle className="w-4 h-4 text-[#ddbed1]/40" />
              <span className="text-xs font-display uppercase tracking-wider">Help</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Utility Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a0d1c]/90 backdrop-blur-xl border-t border-white/10 flex justify-around items-center py-3 px-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 p-2 cursor-pointer relative ${
                isActive ? 'text-[#fface8]' : 'text-[#ddbed1]/50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px] uppercase tracking-wider font-display font-medium">
                {item.label}
              </span>
              {isActive && (
                <span className="absolute -top-3 w-1.5 h-1.5 rounded-full bg-[#fface8] shadow-[0_0_8px_#fface8]" />
              )}
            </button>
          );
        })}
        {/* Profile preview quick nav */}
        <button
          onClick={() => setActiveTab('chat')}
          className="w-8 h-8 rounded-full border border-[#fface8]/60 p-0.5 overflow-hidden active:scale-95 transition-transform"
        >
          <img src={profile.avatar} alt={profile.name} className="w-full h-full rounded-full object-cover" />
        </button>
      </nav>
    </>
  );
}
