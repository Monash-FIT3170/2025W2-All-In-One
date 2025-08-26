import { Meteor } from "meteor/meteor";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { MessageDocument } from "../../database/messaging/models/MessageDocument";
import { ConversationDocument } from "../../database/messaging/models/ConversationDocument";
import { ConversationCollection, MessageCollection } from "../../database/messaging/messaging-collections";

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

// Simple database method to get conversations for a tenant
const getConversationsForTenantMethod = {
  [MeteorMethodIdentifier.CONVERSATIONS_GET_FOR_TENANT]: async (
    tenantId: string
  ): Promise<ConversationDocument[]> => {
    try {
      // Get conversations where tenant is the tenantId
      const conversations = await ConversationCollection.find({
        tenantId: tenantId
      }).fetchAsync();
      
      return conversations;
    } catch (error) {
      console.error("Error in getConversationsForTenantMethod:", error);
      throw error;
    }
  },
};

// Simple database method to get conversations for a landlord
const getConversationsForLandlordMethod = {
  [MeteorMethodIdentifier.CONVERSATIONS_GET_FOR_LANDLORD]: async (
    landlordId: string
  ): Promise<ConversationDocument[]> => {
    try {
      // Get conversations where landlord is the landlordId
      const conversations = await ConversationCollection.find({
        landlordId: landlordId
      }).fetchAsync();
      
      return conversations;
    } catch (error) {
      console.error("Error in getConversationsForLandlordMethod:", error);
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
      // Get all messages for the conversation, sorted by timestamp
      const messages = await MessageCollection.find(
        { conversationId },
        { sort: { timestamp: 1 } }
      ).fetchAsync();
      
      return messages;
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
      const now = new Date();
      
      // Create the new message
      const newMessage: Omit<MessageDocument, '_id'> = {
        conversationId: messageData.conversationId,
        senderId: messageData.senderId,
        senderRole: messageData.senderRole as 'agent' | 'landlord' | 'tenant',
        text: messageData.text,
        timestamp: now,
        isRead: false,
      };

      // Insert the message
      const messageId = await MessageCollection.insertAsync(newMessage);

      // Update the conversation's last message and timestamp
      await ConversationCollection.updateAsync(
        { _id: messageData.conversationId },
        {
          $set: {
            lastMessage: {
              text: messageData.text,
              timestamp: now,
              senderId: messageData.senderId,
            },
            updatedAt: now,
          },
        }
      );

      console.log(`✅ Inserted new message with ID: ${messageId}`);
      return messageId;
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
      // Check if conversation already exists to prevent duplicates
      let existingConversation;
      
      if (conversationData.tenantId) {
        // Agent-Tenant conversation
        existingConversation = await ConversationCollection.findOneAsync({
          agentId: conversationData.agentId,
          tenantId: conversationData.tenantId
        });
        
        if (existingConversation) {
          console.log(`⚠️ Conversation already exists between agent ${conversationData.agentId} and tenant ${conversationData.tenantId}`);
          return existingConversation._id;
        }
      } else if (conversationData.landlordId) {
        // Agent-Landlord conversation
        existingConversation = await ConversationCollection.findOneAsync({
          agentId: conversationData.agentId,
          landlordId: conversationData.landlordId
        });
        
        if (existingConversation) {
          console.log(`⚠️ Conversation already exists between agent ${conversationData.agentId} and landlord ${conversationData.landlordId}`);
          return existingConversation._id;
        }
      }

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
  ...getConversationsForTenantMethod,
  ...getConversationsForLandlordMethod,
  ...getMessagesForConversationMethod,
  ...sendMessageMethod,
  ...insertConversationMethod,
});
