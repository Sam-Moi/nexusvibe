import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutGrid, Plus, FolderHeart, Trash2, ArrowUpRight, Folder, Check, Compass } from 'lucide-react';
import { VibeCard, VibeBoard, TabType } from '../types';

interface BoardsViewProps {
  savedCards: VibeCard[];
  boards: VibeBoard[];
  setBoards: React.Dispatch<React.SetStateAction<VibeBoard[]>>;
  onRemoveCard: (id: string) => void;
  setActiveTab: (tab: TabType) => void;
}

export default function BoardsView({ savedCards, boards, setBoards, onRemoveCard, setActiveTab }: BoardsViewProps) {
  const [newBoardName, setNewBoardName] = useState('');
  const [newBoardDesc, setNewBoardDesc] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);

  const handleCreateBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardName.trim()) return;

    const newBoard: VibeBoard = {
      id: `board-${Date.now()}`,
      name: newBoardName,
      description: newBoardDesc || 'A custom collection of handpicked digital aesthetics.',
      cards: [],
    };

    setBoards((prev) => [...prev, newBoard]);
    setNewBoardName('');
    setNewBoardDesc('');
    setShowCreateForm(false);
  };

  const handleAddCardToBoard = (boardId: string, card: VibeCard) => {
    setBoards((prev) =>
      prev.map((b) => {
        if (b.id === boardId) {
          // Check if already exists in the board
          if (b.cards.some((c) => c.id === card.id)) return b;
          return { ...b, cards: [...b.cards, card] };
        }
        return b;
      })
    );
  };

  const handleRemoveBoard = (boardId: string) => {
    setBoards((prev) => prev.filter((b) => b.id !== boardId));
    if (selectedBoardId === boardId) {
      setSelectedBoardId(null);
    }
  };

  const selectedBoard = boards.find((b) => b.id === selectedBoardId);

  return (
    <div className="w-full min-h-screen text-[#dfe1f6] px-4 md:px-10 lg:px-16 py-24 md:py-28 relative select-none pb-24">
      
      {/* Top Welcome Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12 border-b border-white/5 pb-8">
        <div>
          <span className="text-xs font-display font-bold uppercase tracking-widest text-[#fface8]">Collections</span>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight mt-1">
            Your Vibe Boards
          </h1>
          <p className="text-xs text-[#ddbed1]/60 font-sans mt-2">
            Curated visual folders of code, photography, music and fine art.
          </p>
        </div>

        {/* Create Board Button */}
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-white/5 hover:bg-white/10 border border-[#fface8]/20 hover:border-[#fface8] text-white px-5 py-3 rounded-xl font-display text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-[#fface8]" />
          Create Board
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Boards List */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="font-display text-xs font-bold uppercase tracking-widest text-[#fface8]/80 mb-4 flex items-center gap-2">
            <LayoutGrid className="w-4 h-4" />
            Board list
          </h2>

          <div className="space-y-3">
            {boards.map((b) => {
              const isSelected = selectedBoardId === b.id;
              return (
                <div
                  key={b.id}
                  onClick={() => setSelectedBoardId(b.id)}
                  className={`p-5 rounded-2xl border cursor-pointer text-left transition-all relative overflow-hidden group ${
                    isSelected
                      ? 'bg-[#141829] border-[#fface8]/60 shadow-[0_0_15px_rgba(255,172,232,0.15)]'
                      : 'bg-[#0a0d1c]/40 border-white/5 hover:border-[#fface8]/20 hover:bg-[#0a0d1c]/60'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3 items-center">
                      <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-[#fface8]/20 text-[#fface8]' : 'bg-white/5 text-[#ddbed1]/60'}`}>
                        <Folder className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider group-hover:text-[#fface8] transition-colors">
                          {b.name}
                        </h3>
                        <p className="text-[10px] text-[#ddbed1]/50 font-mono mt-0.5">
                          {b.cards.length} items saved
                        </p>
                      </div>
                    </div>

                    {/* Delete Board Button (only custom boards, keeping system safe) */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveBoard(b.id);
                      }}
                      className="p-1.5 rounded-lg text-[#ddbed1]/30 hover:text-red-400 hover:bg-white/5 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete Board"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  <p className="text-[11px] text-[#ddbed1]/70 font-sans mt-3 line-clamp-1">
                    {b.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column: Selected Board Details or Inbox of Saved Cards */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {selectedBoardId && selectedBoard ? (
              <motion.div
                key={selectedBoard.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-[#0a0d1c]/40 backdrop-blur-xl border border-white/5 p-6 md:p-8 rounded-3xl space-y-6 shadow-xl"
              >
                <div className="flex justify-between items-start border-b border-white/5 pb-5">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-white uppercase tracking-wider">
                      {selectedBoard.name}
                    </h2>
                    <p className="font-sans text-xs text-[#ddbed1]/80 mt-1">
                      {selectedBoard.description}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedBoardId(null)}
                    className="text-xs font-display font-semibold uppercase tracking-wider text-[#fface8] hover:text-white bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 cursor-pointer"
                  >
                    Back to Feed
                  </button>
                </div>

                {/* Grid of Board cards */}
                {selectedBoard.cards.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedBoard.cards.map((card) => (
                      <div key={card.id} className="p-4 bg-[#111425] border border-white/5 rounded-xl flex gap-4 relative group">
                        {card.image && (
                          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-display text-xs font-bold text-white truncate uppercase tracking-wider">{card.title}</h4>
                          <p className="text-[10px] text-[#ddbed1]/50 mt-1">@{card.authorHandle}</p>
                          <span className="inline-block mt-2 text-[9px] font-display text-[#fface8] font-bold uppercase bg-[#fface8]/10 px-1.5 py-0.5 rounded">
                            {card.categoryLabel}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center border-2 border-dashed border-white/5 rounded-2xl space-y-4">
                    <p className="text-sm text-[#ddbed1]/50 font-sans">This board is currently empty.</p>
                    {savedCards.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-[10px] text-[#ddbed1]/40 uppercase font-display font-bold">Add from saved bookmark inbox:</p>
                        <div className="flex flex-wrap gap-2 justify-center max-w-sm mx-auto">
                          {savedCards.map((c) => (
                            <button
                              key={c.id}
                              onClick={() => handleAddCardToBoard(selectedBoard.id, c)}
                              className="text-[10px] bg-[#1a1e35] hover:bg-[#fface8]/15 border border-white/5 text-white px-2.5 py-1.5 rounded-lg cursor-pointer flex items-center gap-1.5 transition-colors"
                            >
                              <span>{c.title}</span>
                              <Plus className="w-3 h-3 text-[#fface8]" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="saved-inbox"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[#0a0d1c]/40 backdrop-blur-xl border border-[#fface8]/10 p-6 md:p-8 rounded-3xl space-y-6 shadow-xl"
              >
                <div>
                  <h2 className="font-display text-xs font-bold uppercase tracking-widest text-[#fface8]/80 mb-2 flex items-center gap-2">
                    <FolderHeart className="w-4 h-4 text-[#fface8]" />
                    Bookmarked items inbox
                  </h2>
                  <p className="font-sans text-xs text-[#ddbed1]/70 leading-relaxed">
                    Cards you bookmark in the discovery feed land here automatically. Drop them into existing boards to organize your digital DNA.
                  </p>
                </div>

                {savedCards.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {savedCards.map((card) => (
                      <div key={card.id} className="p-5 bg-[#111425] border border-white/5 rounded-2xl flex flex-col justify-between hover:border-[#fface8]/30 transition-all relative group">
                        
                        {/* Quick Delete */}
                        <button
                          onClick={() => onRemoveCard(card.id)}
                          className="absolute top-4 right-4 p-1 rounded-md text-[#ddbed1]/40 hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer"
                          title="Remove bookmark"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <div className="space-y-2">
                          <span className="text-[9px] font-display font-bold uppercase tracking-wider text-[#fface8] bg-[#fface8]/10 px-1.5 py-0.5 rounded">
                            {card.categoryLabel}
                          </span>
                          <h3 className="font-display text-xs font-bold text-white uppercase tracking-wider truncate max-w-[85%]">
                            {card.title}
                          </h3>
                        </div>

                        {/* Dropdown/Quick Board add list */}
                        <div className="mt-4 pt-3 border-t border-white/5 space-y-1.5">
                          <div className="text-[9px] text-[#ddbed1]/50 uppercase font-display font-bold">Add to board:</div>
                          <div className="flex flex-wrap gap-1.5">
                            {boards.map((b) => {
                              const alreadyAdded = b.cards.some((c) => c.id === card.id);
                              return (
                                <button
                                  key={b.id}
                                  disabled={alreadyAdded}
                                  onClick={() => handleAddCardToBoard(b.id, card)}
                                  className={`text-[9px] px-2 py-1 rounded-md border font-display uppercase tracking-wider cursor-pointer flex items-center gap-1 transition-colors ${
                                    alreadyAdded
                                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                      : 'bg-white/5 border-white/5 hover:border-[#fface8]/20 text-[#ddbed1]/80 hover:text-white'
                                  }`}
                                >
                                  {alreadyAdded ? (
                                    <>
                                      <Check className="w-2.5 h-2.5" />
                                      <span>{b.name}</span>
                                    </>
                                  ) : (
                                    <>
                                      <Plus className="w-2.5 h-2.5 text-[#fface8]" />
                                      <span>{b.name}</span>
                                    </>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl space-y-4">
                    <p className="text-sm text-[#ddbed1]/50 font-sans">No bookmarked cards inside your inbox yet.</p>
                    <button
                      onClick={() => setActiveTab('explore')}
                      className="px-5 py-2.5 bg-[#ff24e4] hover:bg-[#fface8] text-white hover:text-[#5e0053] rounded-xl font-display text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Browse Explore Feed
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Create New Board Overlay Form */}
      <AnimatePresence>
        {showCreateForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0c0f1d] border border-[#fface8]/30 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">Create Custom Vibe Board</h3>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-[11px] text-[#ddbed1]/50 hover:text-white font-display uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleCreateBoard} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-[#fface8] font-display font-bold uppercase tracking-widest">Board Name</label>
                  <input
                    type="text"
                    required
                    maxLength={25}
                    value={newBoardName}
                    onChange={(e) => setNewBoardName(e.target.value)}
                    placeholder="e.g. brutalist concrete, synthwave"
                    className="w-full bg-[#050816]/75 border border-white/10 focus:border-[#fface8] rounded-xl px-4 py-3 text-sm text-white placeholder-[#ddbed1]/30 focus:outline-none focus:ring-1 focus:ring-[#fface8] font-sans transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-[#fface8] font-display font-bold uppercase tracking-widest">Description</label>
                  <textarea
                    maxLength={100}
                    value={newBoardDesc}
                    onChange={(e) => setNewBoardDesc(e.target.value)}
                    placeholder="Describe the aesthetic and tone..."
                    rows={3}
                    className="w-full bg-[#050816]/75 border border-white/10 focus:border-[#fface8] rounded-xl px-4 py-3 text-sm text-white placeholder-[#ddbed1]/30 focus:outline-none focus:ring-1 focus:ring-[#fface8] font-sans transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#fface8] hover:bg-[#ff24e4] text-[#5e0053] hover:text-white rounded-xl font-display text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-[0_0_12px_rgba(255,172,232,0.15)]"
                >
                  Assemble Board
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
