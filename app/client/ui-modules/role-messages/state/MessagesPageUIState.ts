import { Conversation, Message } from "../types";

export interface MessagesState {
  isLoading: boolean;
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Message[];
  messageText: string;
  error: string | null;
  conversationsLoading: boolean;
  messagesLoading: boolean;
} 