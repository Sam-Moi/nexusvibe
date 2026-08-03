export type TabType = 'home' | 'explore' | 'boards' | 'ai' | 'messages' | 'chat' | 'premium';

export interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  options?: string[];
  quote?: string;
  isPending?: boolean;
}

export interface VibeCard {
  id: string;
  title: string;
  category: 'photography' | 'ai_art' | 'coding' | 'travel' | 'food';
  categoryLabel: string;
  image: string;
  authorName: string;
  authorHandle: string;
  authorAvatar?: string;
  likes: number;
  comments: number;
  hasLiked?: boolean;
  hasBookmarked?: boolean;
  location?: string;
  tags?: string[];
  description?: string;
}

export interface VibeBoard {
  id: string;
  name: string;
  description: string;
  cards: VibeCard[];
}

export interface UserProfile {
  name: string;
  handle: string;
  avatar: string;
  vibeScore: number;
  vibeStatus: string;
  bio: string;
  achievements: {
    id: string;
    title: string;
    icon: string;
    color: string;
    locked: boolean;
  }[];
  metrics: {
    charisma: number;
    wit: number;
    authenticity: number;
  };
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  user: User;
  lastMessage: Message;
  unreadCount: number;
}