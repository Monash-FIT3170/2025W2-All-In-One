import { Meteor } from "meteor/meteor";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { MessagingRepository } from "../../repositories/messaging/messaging-repository";

// Create a single instance of the messaging repository
const messagingRepository = new MessagingRepository();

// Repository-based method to get conversations for an agent
const getConversationsForAgentMethod = {
  [MeteorMethodIdentifier.CONVERSATIONS_GET_FOR_AGENT]: async (
    agentId: string
  ) => {
    return await messagingRepository.getConversationsForAgent(agentId);
  },
};

// Repository-based method to get conversations for a tenant
const getConversationsForTenantMethod = {
  [MeteorMethodIdentifier.CONVERSATIONS_GET_FOR_TENANT]: async (
    tenantId: string
  ) => {
    return await messagingRepository.getConversationsForTenant(tenantId);
  },
};

// Repository-based method to get conversations for a landlord
const getConversationsForLandlordMethod = {
  [MeteorMethodIdentifier.CONVERSATIONS_GET_FOR_LANDLORD]: async (
    landlordId: string
  ) => {
    return await messagingRepository.getConversationsForLandlord(landlordId);
  },
};

// Repository-based method to get messages for a specific conversation
const getMessagesForConversationMethod = {
  [MeteorMethodIdentifier.MESSAGES_GET_FOR_CONVERSATION]: async (
    conversationId: string
  ) => {
    return await messagingRepository.getMessagesForConversation(conversationId);
  },
};

// Repository-based method to send a new message
const sendMessageMethod = {
  [MeteorMethodIdentifier.MESSAGE_INSERT]: async (
    messageData: { conversationId: string; text: string; senderId: string; senderRole: string }
  ): Promise<string> => {
    return await messagingRepository.insertMessage(messageData);
  },
};

// Repository-based method to insert a new conversation
const insertConversationMethod = {
  [MeteorMethodIdentifier.CONVERSATION_INSERT]: async (
    conversationData: {
      agentId: string;
      landlordId?: string;
      tenantId?: string;
      propertyId?: string;
      unreadCounts: Record<string, number>;
    }
  ): Promise<string> => {
    return await messagingRepository.insertConversation(conversationData);
  },
};

// Repository-based method to reset unread count for a user in a conversation
const resetUnreadCountMethod = {
  [MeteorMethodIdentifier.CONVERSATION_RESET_UNREAD_COUNT]: async (
    conversationId: string,
    userId: string
  ): Promise<void> => {
    return await messagingRepository.resetUnreadCount(conversationId, userId);
  },
};

// Repository-based method to add user to active users list when they open a conversation
const addActiveUserMethod = {
  [MeteorMethodIdentifier.CONVERSATION_ADD_ACTIVE_USER]: async (
    conversationId: string,
    userId: string
  ): Promise<void> => {
    return await messagingRepository.addActiveUser(conversationId, userId);
  },
};

// Repository-based method to remove user from active users list when they close a conversation
const removeActiveUserMethod = {
  [MeteorMethodIdentifier.CONVERSATION_REMOVE_ACTIVE_USER]: async (
    conversationId: string,
    userId: string
  ): Promise<void> => {
    return await messagingRepository.removeActiveUser(conversationId, userId);
  },
};

Meteor.methods({
  ...getConversationsForAgentMethod,
  ...getConversationsForTenantMethod,
  ...getConversationsForLandlordMethod,
  ...getMessagesForConversationMethod,
  ...sendMessageMethod,
  ...insertConversationMethod,
  ...resetUnreadCountMethod,
  ...addActiveUserMethod,
  ...removeActiveUserMethod,
});
