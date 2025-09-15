import { Conversation } from "/app/client/library-modules/domain-models/messaging/Conversation";
import { Message } from "/app/client/library-modules/domain-models/messaging/Message";

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
