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
      
      // Get the conversation to determine who should receive the unread count increment
      const conversation = await ConversationCollection.findOneAsync({ _id: messageData.conversationId });
      
      if (!conversation) {
        throw new Error(`Conversation with ID ${messageData.conversationId} not found`);
      }
      
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

      // Determine who should get the unread count increment (everyone except the sender AND those who have the conversation open)
      const unreadCountUpdates: Record<string, number> = {};
      
      // Increment unread count for participants except the sender and those who have the conversation actively open
      if (conversation.agentId && 
          conversation.agentId !== messageData.senderId && 
          !conversation.activeUsers.includes(conversation.agentId)) {
        unreadCountUpdates[`unreadCounts.${conversation.agentId}`] = (conversation.unreadCounts[conversation.agentId] || 0) + 1;
      }
      if (conversation.tenantId && 
          conversation.tenantId !== messageData.senderId && 
          !conversation.activeUsers.includes(conversation.tenantId)) {
        unreadCountUpdates[`unreadCounts.${conversation.tenantId}`] = (conversation.unreadCounts[conversation.tenantId] || 0) + 1;
      }
      if (conversation.landlordId && 
          conversation.landlordId !== messageData.senderId && 
          !conversation.activeUsers.includes(conversation.landlordId)) {
        unreadCountUpdates[`unreadCounts.${conversation.landlordId}`] = (conversation.unreadCounts[conversation.landlordId] || 0) + 1;
      }

      // Update the conversation's last message, timestamp, and unread counts
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
            ...unreadCountUpdates,
          },
        }
      );

      console.log(`✅ Inserted new message with ID: ${messageId} and updated unread counts`);
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
        activeUsers: [], // Initialize with empty array - no users have the conversation open yet
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

// Reset unread count for a user in a conversation
const resetUnreadCountMethod = {
  [MeteorMethodIdentifier.CONVERSATION_RESET_UNREAD_COUNT]: async (
    conversationId: string,
    userId: string
  ): Promise<void> => {
    try {
      // Find the conversation
      const conversation = await ConversationCollection.findOneAsync({ _id: conversationId });
      
      if (!conversation) {
        throw new Error(`Conversation with ID ${conversationId} not found`);
      }

      // Reset the unread count for the specific user
      const updateQuery = {
        [`unreadCounts.${userId}`]: 0,
        updatedAt: new Date(),
      };

      await ConversationCollection.updateAsync(
        { _id: conversationId },
        { $set: updateQuery }
      );

      console.log(`✅ Reset unread count for user ${userId} in conversation ${conversationId}`);
    } catch (error) {
      console.error("Error in resetUnreadCountMethod:", error);
      throw error;
    }
  },
};

// Add user to active users list when they open a conversation
const addActiveUserMethod = {
  [MeteorMethodIdentifier.CONVERSATION_ADD_ACTIVE_USER]: async (
    conversationId: string,
    userId: string
  ): Promise<void> => {
    try {
      // Find the conversation
      const conversation = await ConversationCollection.findOneAsync({ _id: conversationId });
      
      if (!conversation) {
        throw new Error(`Conversation with ID ${conversationId} not found`);
      }

      // Add user to activeUsers array if not already present
      if (!conversation.activeUsers.includes(userId)) {
        await ConversationCollection.updateAsync(
          { _id: conversationId },
          { 
            $addToSet: { activeUsers: userId },
            $set: { updatedAt: new Date() }
          }
        );
        console.log(`✅ Added user ${userId} to active users in conversation ${conversationId}`);
      }
    } catch (error) {
      console.error("Error in addActiveUserMethod:", error);
      throw error;
    }
  },
};

// Remove user from active users list when they close a conversation
const removeActiveUserMethod = {
  [MeteorMethodIdentifier.CONVERSATION_REMOVE_ACTIVE_USER]: async (
    conversationId: string,
    userId: string
  ): Promise<void> => {
    try {
      // Remove user from activeUsers array
      await ConversationCollection.updateAsync(
        { _id: conversationId },
        { 
          $pull: { activeUsers: userId },
          $set: { updatedAt: new Date() }
        }
      );
      console.log(`✅ Removed user ${userId} from active users in conversation ${conversationId}`);
    } catch (error) {
      console.error("Error in removeActiveUserMethod:", error);
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
  ...resetUnreadCountMethod,
  ...addActiveUserMethod,
  ...removeActiveUserMethod,
});
