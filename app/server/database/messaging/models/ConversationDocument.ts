export type ConversationDocument = {
  _id: string;
  agentId: string; // The agent managing the conversation
  landlordId?: string; // The landlord (if property-related)
  tenantId?: string; // The tenant (if property-related)
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
