import { Meteor } from "meteor/meteor";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { ApiConversation } from "/app/shared/api-models/messaging/ApiConversation";
import { ApiMessage } from "/app/shared/api-models/messaging/ApiMessage";

// Helper function to convert server ConversationDocument to ApiConversation
function convertConversationDocumentToApi(doc: any): ApiConversation {
  return {
    conversationId: doc._id,
    agentId: doc.agentId,
    landlordId: doc.landlordId,
    tenantId: doc.tenantId,
    propertyId: doc.propertyId,
    lastMessage: doc.lastMessage ? {
      text: doc.lastMessage.text,
      timestamp: doc.lastMessage.timestamp instanceof Date 
        ? doc.lastMessage.timestamp.toISOString() 
        : doc.lastMessage.timestamp,
      senderId: doc.lastMessage.senderId
    } : undefined,
    unreadCounts: doc.unreadCounts || {},
    activeUsers: doc.activeUsers || [],
    createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : doc.createdAt,
    updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : doc.updatedAt
  };
}

// Helper function to convert server MessageDocument to ApiMessage
function convertMessageDocumentToApi(doc: any): ApiMessage {
  return {
    messageId: doc._id,
    conversationId: doc.conversationId,
    senderId: doc.senderId,
    senderRole: doc.senderRole,
    text: doc.text,
    timestamp: doc.timestamp instanceof Date ? doc.timestamp.toISOString() : doc.timestamp,
    isRead: doc.isRead
  };
}

export async function apiGetConversationsForAgent(agentId: string): Promise<ApiConversation[]> {
  const serverDocs = await Meteor.callAsync(MeteorMethodIdentifier.CONVERSATIONS_GET_FOR_AGENT, agentId);
  return serverDocs.map(convertConversationDocumentToApi);
}

export async function apiGetConversationsForTenant(tenantId: string): Promise<ApiConversation[]> {
  const serverDocs = await Meteor.callAsync(MeteorMethodIdentifier.CONVERSATIONS_GET_FOR_TENANT, tenantId);
  return serverDocs.map(convertConversationDocumentToApi);
}

export async function apiGetConversationsForLandlord(landlordId: string): Promise<ApiConversation[]> {
  const serverDocs = await Meteor.callAsync(MeteorMethodIdentifier.CONVERSATIONS_GET_FOR_LANDLORD, landlordId);
  return serverDocs.map(convertConversationDocumentToApi);
}

export async function apiGetMessagesForConversation(conversationId: string): Promise<ApiMessage[]> {
  const serverDocs = await Meteor.callAsync(MeteorMethodIdentifier.MESSAGES_GET_FOR_CONVERSATION, conversationId);
  return serverDocs.map(convertMessageDocumentToApi);
}

export async function apiInsertMessage(messageData: {
  conversationId: string;
  text: string;
  senderId: string;
  senderRole: string;
}): Promise<string> {
  return await Meteor.callAsync(MeteorMethodIdentifier.MESSAGE_INSERT, messageData);
}

export async function apiInsertConversation(conversationData: {
  agentId: string;
  tenantId?: string;
  landlordId?: string;
  propertyId?: string;
  unreadCounts: Record<string, number>;
}): Promise<string> {
  return await Meteor.callAsync(MeteorMethodIdentifier.CONVERSATION_INSERT, conversationData);
}

export async function apiResetUnreadCount(conversationId: string, userId: string): Promise<void> {
  return await Meteor.callAsync(MeteorMethodIdentifier.CONVERSATION_RESET_UNREAD_COUNT, conversationId, userId);
}

/**
 * Adds a user to the active users list of a conversation
 */
export async function apiAddActiveUser(conversationId: string, userId: string): Promise<void> {
  return await Meteor.callAsync(MeteorMethodIdentifier.CONVERSATION_ADD_ACTIVE_USER, conversationId, userId);
}

/**
 * Removes a user from the active users list of a conversation
 */
export async function apiRemoveActiveUser(conversationId: string, userId: string): Promise<void> {
  return await Meteor.callAsync(MeteorMethodIdentifier.CONVERSATION_REMOVE_ACTIVE_USER, conversationId, userId);
}
