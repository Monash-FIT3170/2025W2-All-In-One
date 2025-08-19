export type ConversationDocument = {
  _id: string;
  participants: {
    userId: string;
    role: 'agent' | 'landlord' | 'tenant';
  }[];
  propertyId?: string; // Reference to property if property-related
  lastMessage?: {
    text: string;
    timestamp: Date;
    senderId: string;
  };
  unreadCounts: Record<string, number>; // userId -> count
  createdAt: Date;
  updatedAt: Date;
}
