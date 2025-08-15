// TODO: These are temporary view models for UI display.
// They will be replaced with proper domain models from library modules and database collections 
// when implemented in backend half of this feature

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