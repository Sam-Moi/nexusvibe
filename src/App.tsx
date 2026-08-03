import React, { useState, lazy, Suspense } from 'react';
import { TabType, Message, VibeCard, VibeBoard, UserProfile } from './types';
import { 
  INITIAL_VIBE_CARDS, 
  INITIAL_USER_PROFILE, 
  INITIAL_CHAT_HISTORY 
} from './data';
import ShaderBackground from './components/ShaderBackground';
import Sidebar from './components/Sidebar';
import HomeView from './components/HomeView';
import ExploreView from './components/ExploreView';
import BoardsView from './components/BoardsView';
import AIChatView from './components/AIChatView';
import PremiumView from './components/PremiumView';
import AuthModal from "./components/AuthModal";
import SettingsModal from './components/SettingsModal';
import HelpModal from './components/HelpModal';
const ChatView = lazy(() => import('./components/ChatView'));
import{ OnboardingModal } from './components/OnboardingModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isPremium, setIsPremium] = useState<boolean>(() => {
  return localStorage.getItem('isPremium') === 'true';
});
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [vibeCards, setVibeCards] = useState<VibeCard[]>(INITIAL_VIBE_CARDS);
  const [profile, setProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [chatHistory, setChatHistory] = useState<Message[]>(INITIAL_CHAT_HISTORY);
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string } | null>(() => {
  const saved = localStorage.getItem('nexus_user');
  return saved ? JSON.parse(saved) : null;
});
const [isSettingsOpen, setIsSettingsOpen] = useState(false);
const [isHelpOpen, setIsHelpOpen] = useState(false);
const handleOnboardingComplete = (profileData: any) => {
  setShowOnboarding(false);
};
  
  // Set up 4 initial system aesthetic boards matching bento cards on home page
  const [boards, setBoards] = useState<VibeBoard[]>([
    {
      id: 'system-1',
      name: 'Analog nostalgia',
      description: 'Warm, low-fidelity jazz tunes, vinyl crackles, and mid-century modern architectures.',
      cards: []
    },
    {
      id: 'system-2',
      name: 'Neon cyber-grid',
      description: 'Vibrant neon streetlights, futuristic Tokyo long-exposure snapshots, and cyber aesthetics.',
      cards: []
    },
    {
      id: 'system-3',
      name: 'Brutalist concrete',
      description: 'Clean monochrome lines, raw architectural angles, and shadows cast across light concrete.',
      cards: []
    },
    {
      id: 'system-4',
      name: 'Iridescent swirl',
      description: 'Futuristic trippy gradients, metallic liquid flows, and hyper-colored machine dream portals.',
      cards: []
    }
  ]);

  // List of items currently bookmarked in the general inbox
  const [savedCards, setSavedCards] = useState<VibeCard[]>([]);

 const handleSaveToBoardInbox = (card: VibeCard) => {
  setSavedCards((prevCards) => {
    const alreadySaved = prevCards.some(
      (savedCard) => savedCard.id === card.id
    );

    if (alreadySaved) {
      return prevCards;
    }

    return [...prevCards, card];
  });
};

const handleRemoveFromBoardInbox = (id: string) => {
  // Remove from saved cards
  setSavedCards((prevCards) =>
    prevCards.filter((card) => card.id !== id)
  );

  // Remove from every board
  setBoards((prevBoards) =>
    prevBoards.map((board) => ({
      ...board,
      cards: board.cards.filter((card) => card.id !== id),
    }))
  );
};
  const handleLogout = () => {
  localStorage.removeItem("nexus_user");
  setCurrentUser(null);
  setIsSettingsOpen(false);
};

  const handleUpgradeClick = () => {
    setActiveTab('premium');
  };

  return (
  <div className="min-h-screen bg-[#050816] font-sans antialiased flex text-[#dfe1f6] relative">
    <ShaderBackground />
  <OnboardingModal
  isOpen={showOnboarding}
  onComplete={handleOnboardingComplete}
/>

    <Sidebar
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      isPremium={isPremium}
      onUpgradeClick={handleUpgradeClick}
      profile={profile}
      onOpenSettings={() => setIsSettingsOpen(true)}
      onOpenHelp={() => setIsHelpOpen(true)}
    />

    <main className="flex-1 md:pl-64 min-h-screen overflow-x-hidden relative">
      <div className="w-full max-w-7xl mx-auto">
        {activeTab === "home" && (
          <HomeView
            setActiveTab={setActiveTab}
            isPremium={isPremium}
            onOpenHelp={() => setIsHelpOpen(true)}
          />
        )}
       {activeTab === 'messages' && (
  <Suspense fallback={<div className="p-4 text-white">Loading Chat...</div>}>
    <ChatView />
  </Suspense>
)} 

        {activeTab === "explore" && (
          <ExploreView
            vibeCards={vibeCards}
            setVibeCards={setVibeCards}
            setActiveTab={setActiveTab}
            onSaveToBoard={handleSaveToBoardInbox}
          />
        )}

        {activeTab === "boards" && (
          <BoardsView
            savedCards={savedCards}
            boards={boards}
            setBoards={setBoards}
            onRemoveCard={handleRemoveFromBoardInbox}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "chat" && (
          <AIChatView
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            profile={profile}
            setProfile={setProfile}
            isPremium={isPremium}
          />
        )}

        {activeTab === "premium" && (
          <PremiumView
            isPremium={isPremium}
            setIsPremium={setIsPremium}
          />
        )}
      </div>
    </main>

    <AuthModal
      isOpen={!currentUser}
      onLoginSuccess={setCurrentUser}
    />

    <SettingsModal
      isOpen={isSettingsOpen}
      onClose={() => setIsSettingsOpen(false)}
      user={currentUser}
      onLogout={handleLogout}
    />

    <HelpModal
      isOpen={isHelpOpen}
      onClose={() => setIsHelpOpen(false)}
      user={currentUser ?? undefined}
    />
  </div>
);
}