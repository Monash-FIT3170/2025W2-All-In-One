export type MessageDocument = {
  _id: string;
  conversationId: string; // Reference to conversation
  senderId: string;
  senderRole: 'agent' | 'landlord' | 'tenant';
  text: string;
  timestamp: Date;
  isRead: boolean;
}
