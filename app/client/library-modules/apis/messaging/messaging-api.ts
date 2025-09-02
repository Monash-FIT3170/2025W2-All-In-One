import { Meteor } from "meteor/meteor";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { ApiConversation } from "/app/shared/api-models/messaging/ApiConversation";
import { ApiMessage } from "/app/shared/api-models/messaging/ApiMessage";

export async function apiGetConversationsForAgent(agentId: string): Promise<ApiConversation[]> {
  return await Meteor.callAsync(MeteorMethodIdentifier.CONVERSATIONS_GET_FOR_AGENT, agentId);
}

export async function apiGetConversationsForTenant(tenantId: string): Promise<ApiConversation[]> {
  return await Meteor.callAsync(MeteorMethodIdentifier.CONVERSATIONS_GET_FOR_TENANT, tenantId);
}

export async function apiGetConversationsForLandlord(landlordId: string): Promise<ApiConversation[]> {
  return await Meteor.callAsync(MeteorMethodIdentifier.CONVERSATIONS_GET_FOR_LANDLORD, landlordId);
}

export async function apiGetMessagesForConversation(conversationId: string): Promise<ApiMessage[]> {
  return await Meteor.callAsync(MeteorMethodIdentifier.MESSAGES_GET_FOR_CONVERSATION, conversationId);
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
