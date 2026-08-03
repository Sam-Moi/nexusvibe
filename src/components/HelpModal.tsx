import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket;

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: { email?: string; name?: string };
}

interface ChatMessage {
  sender: 'user' | 'support' | 'bot';
  text: string;
  time: string;
}

export default function HelpModal({ isOpen, onClose, user }: HelpModalProps) {
  const [activeTab, setActiveTab] = useState<'faqs' | 'chat'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    socket = io();

    socket.on('support_reply', (data: { text: string; sender: string; time: string }) => {
      setMessages((prev) => [
        ...prev,
        { sender: 'support', text: data.text, time: data.time }
      ]);
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const currentMsg = inputText;
    setInputText('');

    const userMsg: ChatMessage = {
      sender: 'user',
      text: currentMsg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      await fetch('/api/support/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user?.name || 'Guest User',
          email: user?.email || 'No email provided',
          message: currentMsg,
          socketId: socket?.id,
        }),
      });
    } catch (err) {
      console.error('Failed to notify support:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-4 bg-slate-800/50 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">Help & Support</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`p-3 rounded-xl max-w-[80%] text-sm ${
                  msg.sender === 'user'
                    ? 'bg-pink-600 text-white rounded-br-none'
                    : 'bg-slate-800 text-slate-200 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-slate-500 mt-1">{msg.time}</span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <span>Support is typing</span>
              <span className="animate-ping">...</span>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Describe your issue or ask a question..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-pink-500"
          />
          <button
            type="submit"
            className="bg-pink-600 hover:bg-pink-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
          >
            Send
          </button>
        </form>

      </div>
    </div>
  );
}