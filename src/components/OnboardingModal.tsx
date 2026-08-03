import React, { useState } from 'react';
import { Sparkles, MapPin, User, Camera, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (profileData: any) => void;
}

const AVAILABLE_VIBES = [
  'Web Developer', 'Tech Explorer', 'Music Lover', 'Night Owl',
  'Gamer', 'Coffee Addict', 'Designer', 'Fitness', 'Crypto / Web3',
  'Bookworm', 'Photographer', 'Traveler'
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete }) => {
  const [step, setStep] = useState(1);
  
  // Form State
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [avatarPreview, setAvatarPreview] = useState<string>(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
  );

  if (!isOpen) return null;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const toggleVibe = (vibe: string) => {
    if (selectedVibes.includes(vibe)) {
      setSelectedVibes(selectedVibes.filter((v) => v !== vibe));
    } else {
      if (selectedVibes.length < 5) {
        setSelectedVibes([...selectedVibes, vibe]);
      }
    }
  };

  const handleFinish = () => {
    const completedProfile = {
      name: name || 'Anonymous',
      location: location || 'Global',
      bio: bio || 'Exploring NexusVibe 🚀',
      vibes: selectedVibes.length ? selectedVibes : ['Tech Explorer'],
      avatar: avatarPreview,
    };
    onComplete(completedProfile);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#12141a] border border-[#2b2d3a] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header Progress Bar */}
        <div className="p-6 border-b border-[#22242e] bg-[#161822]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
              Setup Your Vibe Profile
            </span>
            <span className="text-xs text-gray-400">Step {step} of 3</span>
          </div>
          <div className="w-full h-1.5 bg-[#22242e] rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-300" 
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 flex-1 space-y-6">

          {/* STEP 1: Picture & Basic Info */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="text-center">
                <h3 className="text-lg font-bold text-white">Let's set up your profile</h3>
                <p className="text-xs text-gray-400 mt-1">Upload a photo and tell us your name</p>
              </div>

              {/* Avatar Upload */}
              <div className="flex flex-col items-center justify-center py-2">
                <div className="relative group cursor-pointer">
                  <img
                    src={avatarPreview}
                    alt="Preview"
                    className="w-24 h-24 rounded-full object-cover border-4 border-[#22242e] shadow-lg group-hover:opacity-80 transition-opacity"
                  />
                  <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-500 shadow-md">
                    <Camera className="w-4 h-4" />
                  </label>
                  <input 
                    id="avatar-upload" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleAvatarChange} 
                    className="hidden" 
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">Display Name</label>
                <div className="flex items-center bg-[#1b1d28] border border-[#2b2d3a] rounded-xl px-3 py-2 text-white">
                  <User className="w-4 h-4 text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="e.g. Alex Dev"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-transparent text-sm w-full focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">Location</label>
                <div className="flex items-center bg-[#1b1d28] border border-[#2b2d3a] rounded-xl px-3 py-2 text-white">
                  <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="e.g. Newyork, USA"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="bg-transparent text-sm w-full focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Bio */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="text-center">
                <h3 className="text-lg font-bold text-white">Tell the community about yourself</h3>
                <p className="text-xs text-gray-400 mt-1">Write a short bio or status message</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">Bio / Headline</label>
                <textarea
                  rows={4}
                  placeholder="Fluent in sarcasm and late-night conversations. 🚀"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-[#1b1d28] border border-[#2b2d3a] rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500 resize-none"
                />
                <span className="text-[10px] text-gray-500 float-right mt-1">{bio.length}/150</span>
              </div>
            </div>
          )}

          {/* STEP 3: Vibe Tags */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="text-center">
                <h3 className="text-lg font-bold text-white">Select your Vibes</h3>
                <p className="text-xs text-gray-400 mt-1">Pick up to 5 tags so people can match your energy</p>
              </div>

              <div className="flex flex-wrap gap-2 py-2 max-h-48 overflow-y-auto">
                {AVAILABLE_VIBES.map((vibe) => {
                  const isSelected = selectedVibes.includes(vibe);
                  return (
                    <button
                      key={vibe}
                      type="button"
                      onClick={() => toggleVibe(vibe)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center space-x-1 ${
                        isSelected
                          ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-600/30'
                          : 'bg-[#1b1d28] border-[#2b2d3a] text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      <span>⚡ {vibe}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-gray-400 text-center">{selectedVibes.length} / 5 selected</p>
            </div>
          )}

        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 border-t border-[#22242e] bg-[#161822] flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex items-center space-x-1 text-xs text-gray-400 hover:text-white px-3 py-2 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : <div />}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-md transition-all"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-md shadow-emerald-600/30 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Complete Profile</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};