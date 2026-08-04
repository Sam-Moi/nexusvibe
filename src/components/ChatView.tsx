import React, { useState, useRef } from 'react';
import { 
  Phone, 
  Video, 
  Smile, 
  Mic, 
  Paperclip, 
  Image as ImageIcon,
  Send, 
  MoreVertical,
  CheckCheck,
  Wallpaper,
  User,
  Search,
  BellOff,
  Folder,
  Trash2,
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';
import { Conversation, Message } from '../types';
import { CallModal } from './CallModal';
import { ProfileModal } from './ProfileModal';

const MOCK_CONVERSATIONS: any[] = [
  {
    id: '1',
    user: { id: 'u1', name: 'Matilda', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', isOnline: true },
    lastMessage: { id: 'm1', sender: 'ai', text: 'Hey! Are we still meeting up?', timestamp: '10:42 AM' },
    unreadCount: 2,
  },
  {
    id: '2',
    user: { id: 'u2', name: 'Nellie', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100', isOnline: false, lastSeen: '2h ago' },
    lastMessage: { id: 'm2', sender: 'user', text: 'Sounds like a plan!', timestamp: 'Yesterday' },
    unreadCount: 0,
  },
];

const ChatView: React.FC = () => {
  const [conversations] = useState<any[]>(MOCK_CONVERSATIONS);
  const [activeChat, setActiveChat] = useState<Conversation | null>(MOCK_CONVERSATIONS[0]);
  const [messages, setMessages] = useState<any[]>([
    { id: '1', sender: 'ai', text: 'Hey! Are we still meeting up?', timestamp: '10:42 AM' },
    { id: '2', sender: 'user', text: 'hello', timestamp: '03:34 PM' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [chatBg, setChatBg] = useState<string>('default');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal States
  const [isCallActive, setIsCallActive] = useState(false);
  const [callType, setCallType] = useState<'voice' | 'video'>('voice');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCall = (type: 'voice' | 'video') => {
    setCallType(type);
    setIsCallActive(true);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newMessage.trim()) return;

    const msg: any = {
      id: Date.now().toString(),
      sender: 'user',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, msg]);
    setNewMessage('');
    setShowEmojiPicker(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isImg = file.type.startsWith('image/');
      const msg: any = {
        id: Date.now().toString(),
        sender: 'user',
        text: isImg ? `📷 Sent an image: ${file.name}` : `📁 Sent a file: ${file.name}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, msg]);
    }
  };

  const addEmoji = (emoji: string) => {
    setNewMessage((prev) => prev + emoji);
  };

  const cycleBackground = () => {
    const bgs = ['default', 'subtle-grid', 'vibe-gradient'];
    const nextIdx = (bgs.indexOf(chatBg) + 1) % bgs.length;
    setChatBg(bgs[nextIdx]);
  };

  const clearChatHistory = () => {
    if (activeChat && window.confirm(`Clear all messages with ${activeChat.user.name}?`)) {
      setMessages([]);
      setShowMenu(false);
    }
  };
  const filteredConversations = conversations.filter((chat: any) => 
  chat.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
);

  return (
    <div className="flex h-[85vh] md:h-[82vh] bg-[#0d0e12] border border-[#22242e] rounded-xl overflow-hidden shadow-2xl relative">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept="image/*,video/*,.pdf,.doc" 
        className="hidden" 
      />

      {/* CALL MODAL OVERLAY */}
      {activeChat && (
        <CallModal
          isOpen={isCallActive}
          onClose={() => setIsCallActive(false)}
          userName={activeChat.user.name}
          userAvatar={activeChat.user.avatar}
          callType={callType}
        />
      )}

      {/* PROFILE MODAL OVERLAY */}
      {activeChat && (
        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          user={activeChat.user}
        />
      )}

      {/* LEFT SIDEBAR */}
      <div 
        className={`w-full md:w-72 border-r border-[#22242e] bg-[#12141a] flex flex-col ${
          activeChat ? 'hidden md:flex' : 'flex'
        }`}
      >
        <div className="p-4 border-b border-[#22242e] flex flex-col gap-3 ">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white tracking-wide">Message</h2>
            <button
            onClick={() => {}}
            className="bg-[#1f2233] hover:bg-[#2b2f45] text-xs font-semibold text-blue-400 px-3 py-1.5 rounded-full transition"
            >
              + Find People
            </button>
        </div>
        <input
        type="text"
        placeholder="Search users..."
        className="w-full bg-[#161822] border border-[#26293a] text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500"
        />
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((chat) => (
            <div
              key={chat.id}
              onClick={() => {
                setActiveChat(chat);
                setShowMenu(false);
              }}
              className={`flex items-center p-3 cursor-pointer transition-colors border-b border-[#1a1c24] ${
                activeChat?.id === chat.id ? 'bg-[#1e202b]' : 'hover:bg-[#161822]'
              }`}
            >
              <div className="relative mr-3">
                <img src={chat.user.avatar} alt={chat.user.name} className="w-10 h-10 rounded-full object-cover" />
                <span
                  className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#12141a] ${
                    chat.user.isOnline ? 'bg-green-500' : 'bg-gray-500'
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-white truncate">{chat.user.name}</h4>
                <p className="text-xs text-gray-400 truncate">{chat.lastMessage.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT MAIN PANEL */}
      {activeChat ? (
        <div className="flex-1 flex flex-col bg-[#0b0c10] relative w-full">
          
          {/* HEADER */}
          <div className="px-3 md:px-6 py-3 border-b border-[#22242e] bg-[#12141a] flex items-center justify-between relative z-20">
            <div className="flex items-center space-x-2 md:space-x-3">
              <button 
                onClick={() => setActiveChat(null)}
                className="md:hidden p-1.5 text-gray-400 hover:text-white rounded-lg"
                title="Back to Conversations"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div 
                className="relative cursor-pointer"
                onClick={() => setIsProfileOpen(true)}
              >
                <img src={activeChat.user.avatar} alt={activeChat.user.name} className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover hover:opacity-90 transition-opacity" />
                <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#12141a] ${activeChat.user.isOnline ? 'bg-green-500' : 'bg-gray-500'}`} />
              </div>
              <div 
                className="cursor-pointer"
                onClick={() => setIsProfileOpen(true)}
              >
                <div className="flex items-center space-x-1">
                  <h3 className="text-xs md:text-sm font-bold text-white truncate max-w-[100px] md:max-w-none hover:text-blue-400 transition-colors">
                    {activeChat.user.name}
                  </h3>
                  {isMuted && <BellOff className="w-3 h-3 text-amber-500" />}
                </div>
                <span className="text-[10px] md:text-xs text-green-400 font-medium block">
                  {activeChat.user.isOnline ? 'Online' : `Last seen ${activeChat.user.lastSeen}`}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-1.5 md:space-x-3">
              <button 
                onClick={() => startCall('voice')}
                className="flex items-center space-x-1 px-2.5 py-1.5 bg-[#1e202b] hover:bg-emerald-600/20 hover:border-emerald-500 border border-[#2e3142] text-emerald-400 rounded-lg text-xs font-semibold transition-all"
              >
                <Phone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Voice</span>
              </button>

              <button 
                onClick={() => startCall('video')}
                className="flex items-center space-x-1 px-2.5 py-1.5 bg-[#1e202b] hover:bg-indigo-600/20 hover:border-indigo-500 border border-[#2e3142] text-indigo-400 rounded-lg text-xs font-semibold transition-all"
              >
                <Video className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Video</span>
              </button>

              <button 
                onClick={cycleBackground}
                title="Change Wallpaper"
                className="p-1.5 md:p-2 hover:bg-[#22242e] text-gray-400 hover:text-white rounded-lg transition-colors"
              >
                <Wallpaper className="w-4 h-4" />
              </button>

              <button 
                onClick={() => setShowMenu(!showMenu)}
                className={`p-1.5 md:p-2 rounded-lg transition-colors ${
                  showMenu ? 'bg-[#282a38] text-white' : 'hover:bg-[#22242e] text-gray-400 hover:text-white'
                }`}
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            {/* DROPDOWN MENU */}
            {showMenu && (
              <div className="absolute top-14 right-3 md:right-6 w-52 md:w-56 bg-[#161822] border border-[#2c2f3e] rounded-xl shadow-2xl py-2 z-50 text-xs text-gray-200 divide-y divide-[#232636]">
                <div className="py-1">
                  <button 
                    onClick={() => { setIsProfileOpen(true); setShowMenu(false); }}
                    className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-[#222534]"
                  >
                    <User className="w-4 h-4 text-blue-400" />
                    <span>View Profile</span>
                  </button>
                  <button 
                    onClick={() => { alert("Search messages feature triggered!"); setShowMenu(false); }}
                    className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-[#222534]"
                  >
                    <Search className="w-4 h-4 text-gray-400" />
                    <span>Search Chat</span>
                  </button>
                  <button 
                    onClick={() => { alert("Showing media & links"); setShowMenu(false); }}
                    className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-[#222534]"
                  >
                    <Folder className="w-4 h-4 text-purple-400" />
                    <span>Shared Media</span>
                  </button>
                </div>

                <div className="py-1">
                  <button 
                    onClick={() => { setIsMuted(!isMuted); setShowMenu(false); }}
                    className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-[#222534]"
                  >
                    <BellOff className="w-4 h-4 text-amber-400" />
                    <span>{isMuted ? 'Unmute' : 'Mute Notifications'}</span>
                  </button>
                </div>

                <div className="py-1">
                  <button 
                    onClick={clearChatHistory}
                    className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-[#222534] text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Clear Chat</span>
                  </button>
                  <button 
                    onClick={() => { alert(`Blocked ${activeChat.user.name}`); setShowMenu(false); }}
                    className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-[#222534] text-red-500 font-medium"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>Block User</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* MESSAGE HISTORY */}
          <div 
            onClick={() => { if(showMenu) setShowMenu(false); }}
            className={`flex-1 p-4 md:p-6 overflow-y-auto space-y-4 transition-all ${
              chatBg === 'vibe-gradient' ? 'bg-gradient-to-b from-[#141026] to-[#0b0c10]' :
              chatBg === 'subtle-grid' ? 'bg-[radial-gradient(#22242e_1px,transparent_1px)] [background-size:16px_16px]' : ''
            }`}
          >
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500 text-xs">
                No messages yet. Say hello!
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] md:max-w-[65%] px-3.5 py-2 rounded-2xl text-xs md:text-sm shadow-md ${
                        isMe
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-[#1e202b] text-gray-200 rounded-bl-none border border-[#282a38]'
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>
                    <div className="flex items-center space-x-1 mt-1 text-[9px] md:text-[10px] text-gray-500 px-1">
                      <span>{msg.timestamp}</span>
                      {isMe && <CheckCheck className="w-3 h-3 text-blue-400" />}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* EMOJI POPUP */}
          {showEmojiPicker && (
            <div className="absolute bottom-16 right-4 md:right-28 bg-[#181a24] border border-[#2c2f3e] rounded-xl p-2 md:p-3 shadow-2xl flex gap-1.5 z-50">
              {['😊', '🔥', '❤️', '👍', '😂', '🎉', '🚀'].map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => addEmoji(e)}
                  className="text-lg md:text-xl hover:scale-125 transition-transform"
                >
                  {e}
                </button>
              ))}
            </div>
          )}

          {/* INPUT BAR */}
          <form onSubmit={handleSendMessage} className="p-2.5 md:p-4 border-t border-[#22242e] bg-[#12141a]">
            <div className="flex items-center space-x-1 md:space-x-2 bg-[#1b1d28] px-2 md:px-3 py-1.5 md:py-2 rounded-xl border border-[#2b2d3a] focus-within:border-blue-500 transition-colors">
              
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="text-gray-400 hover:text-blue-400 p-1 rounded-lg hover:bg-[#262938]"
                title="Gallery"
              >
                <ImageIcon className="w-4 h-4 md:w-5 md:h-5" />
              </button>

              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#262938]"
                title="Attach File"
              >
                <Paperclip className="w-4 h-4 md:w-5 md:h-5" />
              </button>

              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={isRecording ? "Recording voice note..." : "Message..."}
                disabled={isRecording}
                className="flex-1 bg-transparent text-xs md:text-sm text-white focus:outline-none placeholder-gray-500 px-1 md:px-2"
              />

              <button 
                type="button" 
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="text-gray-400 hover:text-amber-400 p-1 rounded-lg hover:bg-[#262938]"
                title="Add Emoji"
              >
                <Smile className="w-4 h-4 md:w-5 md:h-5" />
              </button>

              <button
                type="button"
                onClick={() => setIsRecording(!isRecording)}
                className={`p-1 rounded-lg transition-colors ${
                  isRecording 
                    ? 'bg-red-500/20 text-red-500 animate-pulse border border-red-500/50' 
                    : 'text-gray-400 hover:text-red-400 hover:bg-[#262938]'
                }`}
                title="Voice Note"
              >
                <Mic className="w-4 h-4 md:w-5 md:h-5" />
              </button>

              <button
                type="submit"
                disabled={!newMessage.trim()}
                className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-semibold text-xs text-white transition-all ${
                  newMessage.trim() 
                    ? 'bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/30' 
                    : 'bg-blue-600/50 opacity-60 cursor-not-allowed'
                }`}
              >
                Send
              </button>

            </div>
          </form>

        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center text-gray-500 text-sm">
          Select a chat to start messaging
        </div>
      )}
    </div>
  );
};

export default ChatView;