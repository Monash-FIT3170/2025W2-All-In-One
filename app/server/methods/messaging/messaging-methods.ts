import { Meteor } from "meteor/meteor";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { MessageDocument } from "../../database/messaging/models/MessageDocument";
import { ConversationDocument } from "../../database/messaging/models/ConversationDocument";
import { ConversationCollection } from "../../database/messaging/messaging-collections";

// Simple database method to get conversations for an agent
const getConversationsForAgentMethod = {
  [MeteorMethodIdentifier.CONVERSATIONS_GET_FOR_AGENT]: async (
    agentId: string
  ): Promise<ConversationDocument[]> => {
    try {
      // Get conversations where agent is the agentId
      const conversations = await ConversationCollection.find({
        agentId: agentId
      }).fetchAsync();
      
      return conversations;
    } catch (error) {
      console.error("Error in getConversationsForAgentMethod:", error);
      throw error;
    }
  },
};

// Get messages for a specific conversation
const getMessagesForConversationMethod = {
  [MeteorMethodIdentifier.MESSAGES_GET_FOR_CONVERSATION]: async (
    conversationId: string
  ): Promise<MessageDocument[]> => {
    try {
      // TODO: For now, return empty array since we're just setting up the structure
      // This will be implemented when we add actual message functionality
      return [];
    } catch (error) {
      console.error("Error in getMessagesForConversationMethod:", error);
      throw error;
    }
  },
};

// Send a new message
const sendMessageMethod = {
  [MeteorMethodIdentifier.MESSAGE_INSERT]: async (
    messageData: { conversationId: string; text: string; senderId: string; senderRole: string }
  ): Promise<string> => {
    try {
      // TODO: For now, just return a mock message ID
      // This will be implemented when we add actual message functionality
      return `msg_${Date.now()}`;
    } catch (error) {
      console.error("Error in sendMessageMethod:", error);
      throw error;
    }
  },
};

// Insert a new conversation
const insertConversationMethod = {
  [MeteorMethodIdentifier.CONVERSATION_INSERT]: async (
    conversationData: {
      agentId: string;
      landlordId?: string;
      tenantId?: string;
      propertyId?: string;
      lastMessage?: {
        text: string;
        timestamp: Date;
        senderId: string;
      };
      unreadCounts: Record<string, number>;
    }
  ): Promise<string> => {
    try {
      const newConversation: Omit<ConversationDocument, '_id'> = {
        agentId: conversationData.agentId,
        landlordId: conversationData.landlordId,
        tenantId: conversationData.tenantId,
        propertyId: conversationData.propertyId,
        lastMessage: conversationData.lastMessage,
        unreadCounts: conversationData.unreadCounts,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const conversationId = await ConversationCollection.insertAsync(newConversation);
      console.log(`✅ Inserted new conversation with ID: ${conversationId}`);
      return conversationId;
    } catch (error) {
      console.error("Error in insertConversationMethod:", error);
      throw error;
    }
  },
};

Meteor.methods({
  ...getConversationsForAgentMethod,
  ...getMessagesForConversationMethod,
  ...sendMessageMethod,
  ...insertConversationMethod,
});
