import React from 'react';
import { X, Sparkles, MapPin, Calendar, Heart } from 'lucide-react';

export interface ProfileData {
  name: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: string;
  bio?: string;
  location?: string;
  joinedDate?: string;
  vibes?: string[];
  mutualVibes?: number;
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: ProfileData;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, user }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#12141a] border border-[#2b2d3a] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative flex flex-col">
        
        {/* Cover Banner */}
        <div className="h-28 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 text-gray-200 hover:text-white hover:bg-black/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pb-6 pt-0 relative flex-1">
          <div className="relative -mt-12 mb-4 flex items-end justify-between">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-[#12141a] shadow-xl"
              />
              <span
                className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-[#12141a] ${
                  user.isOnline ? 'bg-green-500' : 'bg-gray-500'
                }`}
              />
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => alert(`Signaled a vibe to ${user.name}!`)}
                className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-blue-600/30 transition-all"
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>Send Vibe</span>
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <span>{user.name}</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-green-400 font-medium mt-0.5">
              {user.isOnline ? 'Active Now' : `Last seen ${user.lastSeen || 'recently'}`}
            </p>
          </div>

          <p className="text-xs text-gray-300 mt-3 leading-relaxed bg-[#1b1d28] p-3 rounded-xl border border-[#262838]">
            {user.bio || 'Exploring NexusVibe 🚀'}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-gray-400">
            <div className="flex items-center space-x-2 bg-[#161822] p-2 rounded-lg border border-[#222432]">
              <MapPin className="w-4 h-4 text-red-400 shrink-0" />
              <span className="truncate">{user.location || 'Not specified'}</span>
            </div>
            <div className="flex items-center space-x-2 bg-[#161822] p-2 rounded-lg border border-[#222432]">
              <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="truncate">{user.joinedDate || 'Recently Joined'}</span>
            </div>
          </div>

          <div className="mt-5">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Vibe Match</span>
              <span className="text-blue-400 text-[10px] lowercase font-normal">{user.mutualVibes ?? 4} mutual vibes</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {(user.vibes && user.vibes.length > 0 ? user.vibes : ['Web Developer', 'Tech Explorer']).map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 bg-[#1e202e] border border-[#2c2f44] text-gray-200 rounded-full text-[11px] font-medium hover:border-blue-500/50 transition-colors"
                >
                  ⚡ {tag}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};