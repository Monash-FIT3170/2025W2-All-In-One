export type ApiMessage = {
  messageId: string;
  conversationId: string;
  senderId: string;
  senderRole: 'agent' | 'landlord' | 'tenant';
  text: string;
  timestamp: string; 
  isRead: boolean;
};
