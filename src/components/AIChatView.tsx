import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, Sparkles, User, ShieldAlert, Edit, Check, Lock, Trophy, Zap, RefreshCw } from 'lucide-react';
import { Message, UserProfile } from '../types';
import { VideoCallModal } from './VideoCallModal';
import { io } from 'socket.io-client';

interface AIChatViewProps {
  chatHistory: Message[];
  setChatHistory: React.Dispatch<React.SetStateAction<Message[]>>;
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  isPremium: boolean;
}

export default function AIChatView({ chatHistory, setChatHistory, profile, setProfile, isPremium: isPremiumProp }: AIChatViewProps) {
  const isPremium = true; // Hardcoded to true for dev testing!
  const [inputText, setInputText] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [editingBio, setEditingBio] = useState(false);
  const [tempBio, setTempBio] = useState(profile.bio);
  const [userMessageCount, setUserMessageCount] = useState<number>(() => {
    const saved = localStorage.getItem('nexus_user_msg_count');
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  // State to control when the video call modal is open
  const [activeCallRoom, setActiveCallRoom] = useState<string | null>(null);

  // Handler for starting a video call
  const startCall = () => {
    if (!isPremium) {
      alert("Video calling is a Premium feature! Please upgrade to access.");
      return;
    }
    // Set a room ID (e.g., based on the active chat or user ID)
    setActiveCallRoom("nexus-room-123");
  };

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isPending]);
  // --- INCOMING CALL LOGIC ---
  const [incomingCall, setIncomingCall] = useState<{
    isReceivingCall: boolean;
    from: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    const socket = io('http://localhost:3000');

    socket.on('incoming-call', ({ from, name }: { from: string; name: string }) => {
      setIncomingCall({
        isReceivingCall: true,
        from,
        name,
      });
    });

    return () => {
      socket.off('incoming-call');
    };
  }, []);

  const handleAcceptCall = () => {
    if (incomingCall) {
      setActiveCallRoom(`room_${incomingCall.from}`);
      setIncomingCall(null);
    }
  };

  const handleDeclineCall = () => {
    const socket = io('http://localhost:3000');
    if (incomingCall) {
      socket.emit('reject-call', { to: incomingCall.from });
    }
    setIncomingCall(null);
  };

  const handleBioSave = () => {
    setProfile(prev => ({ ...prev, bio: tempBio }));
    setEditingBio(false);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Check free message limit
    if (!isPremium && userMessageCount >= 5) {
      alert("You've reached your free 5-message limit! Upgrade to Pro for unlimited messaging.");
      return;
    }

    if (!isPremium) {
      const newCount = userMessageCount + 1;
      setUserMessageCount(newCount);
      localStorage.setItem('nexus_user_msg_count', newCount.toString());
    }

    // Create unique user message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setInputText('');
    setIsPending(true);

    try {
      // Call server-side Express API route for Gemini AI
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          history: chatHistory.map(m => ({
            role: m.sender === 'ai' ? 'model' : 'user',
            text: m.text,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('API server returned error');
      }

      const data = await response.json();
      
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.reply,
        quote: data.quote || undefined,
        options: data.options || ['Improve my Bio', 'Generate Icebreaker', 'Compatibility Report'],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatHistory((prev) => [...prev, aiMsg]);

      // If AI recommends/generates a new Bio
      if (data.newBio) {
        setProfile(prev => ({ ...prev, bio: data.newBio }));
      }

      // Dynamically adjust vibe score or metrics based on input
      setProfile((prev) => {
        const charismaBonus = text.length > 25 ? 1 : 0;
        const witBonus = text.includes('?') ? 1 : 0;
        const newScore = Math.min(100, Math.max(50, prev.vibeScore + (Math.random() > 0.5 ? 1 : -1)));
        
        return {
          ...prev,
          vibeScore: newScore,
          metrics: {
            charisma: Math.min(100, prev.metrics.charisma + charismaBonus),
            wit: Math.min(100, prev.metrics.wit + witBonus),
            authenticity: Math.min(100, prev.metrics.authenticity + (Math.random() > 0.7 ? 1 : 0)),
          }
        };
      });

    } catch (error) {
      console.error("Error communicating with server:", error);
      
      // Fallback response if AI API fails or is unreachable
      const fallbackReply = `Awesome query! Based on your digital footprint, here is a highly curated suggestion: "Let's explore some brutalist design layouts in neon hues next week. I feel our architectural compatibility index is rising."`;
      
      const aiMsg: Message = {
        id: `ai-fallback-${Date.now()}`,
        sender: 'ai',
        text: fallbackReply,
        options: ['Improve my Bio', 'Generate Icebreaker', 'Compatibility Report'],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatHistory((prev) => [...prev, aiMsg]);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="w-full min-h-screen text-[#dfe1f6] px-4 md:px-10 lg:px-16 py-24 md:py-28 relative select-none pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch h-[calc(100vh-180px)]">
       
        {/* Left Column: Chat Area (8 cols) */}
        <div className="lg:col-span-8 flex flex-col h-full bg-[#0a0d1c]/40 backdrop-blur-xl border border-[#fface8]/15 rounded-3xl overflow-hidden shadow-2xl">
          
          {/* Companion header */}
          <div className="px-6 py-4 border-b border-white/5 bg-[#0a0d1c]/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#ff24e4] to-[#00dbe9] p-0.5 animate-pulse">
                <div className="w-full h-full rounded-full bg-[#050816] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-[#fface8]" />
                </div>             
              </div>
              <div>
                <div className="text-sm font-display font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  Nexus Companion
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <button 
  onClick={startCall} 
  className="ml-auto flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-sm transition"
>
  📹 Video Call
</button>
                </div>
                <div className="text-[10px] text-[#00dbe9] font-mono">NEURAL MODEL G3.5</div>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {chatHistory.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-[#ff24e4]/20 border border-[#ff24e4]/40 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-[#fface8]" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] p-4 rounded-2xl text-sm ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-[#ff24e4] to-[#c800cc] text-white rounded-br-none'
                      : 'bg-[#050816]/80 border border-white/10 text-slate-200 rounded-bl-none'
                  }`}
                >
                  <p>{m.text}</p>
                  <span className="text-[10px] opacity-60 mt-1 block text-right">{m.timestamp}</span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-4 border-t border-white/5 bg-[#0a0d1c]/80 flex gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
              placeholder="Ask Nexus AI..."
              className="flex-1 bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ff24e4]"
            />
            <button
              onClick={() => handleSendMessage(inputText)}
              disabled={isPending}
              className="bg-gradient-to-r from-[#ff24e4] to-[#00dbe9] hover:opacity-90 text-white px-5 py-3 rounded-xl font-medium transition flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
      {/* INCOMING CALL RINGING POPUP */}
      {incomingCall?.isReceivingCall && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white p-5 rounded-2xl shadow-2xl z-50 flex items-center gap-5 border border-slate-700 animate-bounce">
          <div>
            <p className="font-bold text-lg">{incomingCall.name}</p>
            <p className="text-sm text-slate-400">Incoming Video Call...</p>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={handleAcceptCall} 
              className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-xl font-semibold transition-all"
            >
              Accept
            </button>
            <button 
              onClick={handleDeclineCall} 
              className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl font-semibold transition-all"
            >
              Decline
            </button>
          </div>
        </div>
      )}
      {activeCallRoom && (
        <VideoCallModal
          roomId={activeCallRoom}
          onClose={() => setActiveCallRoom(null)}
        />
      )}
    </div>
  );
}