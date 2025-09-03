export type ApiConversation = {
  conversationId: string;
  agentId: string;
  landlordId?: string;
  tenantId?: string;
  propertyId?: string;
  lastMessage?: {
    text: string;
    timestamp: string; 
    senderId: string;
  };
  unreadCounts: Record<string, number>;
  activeUsers: string[];
  createdAt: string; 
  updatedAt: string; 
};
