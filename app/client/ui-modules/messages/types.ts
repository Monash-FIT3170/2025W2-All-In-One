export interface Conversation {
  id: string;
  name: string;
  role: string;
  avatar: string; 
  lastMessage: string;
  timestamp: string; 
  unreadCount: number;
}

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  isOutgoing: boolean;
  isRead: boolean;
} 