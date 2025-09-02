import { ApiConversation } from "/app/shared/api-models/messaging/ApiConversation";
import { ApiMessage } from "/app/shared/api-models/messaging/ApiMessage";
import { ConversationDocument } from "../../database/messaging/models/ConversationDocument";
import { MessageDocument } from "../../database/messaging/models/MessageDocument";
import { ConversationCollection, MessageCollection } from "../../database/messaging/messaging-collections";

// Helper function to convert server ConversationDocument to ApiConversation
function convertConversationDocumentToApi(doc: ConversationDocument): ApiConversation {
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
function convertMessageDocumentToApi(doc: MessageDocument): ApiMessage {
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


export class MessagingRepository {
  
  async getConversationsForAgent(agentId: string): Promise<ApiConversation[]> {
    try {
      // Get conversations where agent is the agentId
      const conversations = await ConversationCollection.find({
        agentId: agentId
      }).fetchAsync();
      
      return conversations.map(convertConversationDocumentToApi);
    } catch (error) {
      console.error("Error in getConversationsForAgent:", error);
      throw error;
    }
  }

  async getConversationsForTenant(tenantId: string): Promise<ApiConversation[]> {
    try {
      // Get conversations where tenant is the tenantId
      const conversations = await ConversationCollection.find({
        tenantId: tenantId
      }).fetchAsync();
      
      return conversations.map(convertConversationDocumentToApi);
    } catch (error) {
      console.error("Error in getConversationsForTenant:", error);
      throw error;
    }
  }

  async getConversationsForLandlord(landlordId: string): Promise<ApiConversation[]> {
    try {
      // Get conversations where landlord is the landlordId
      const conversations = await ConversationCollection.find({
        landlordId: landlordId
      }).fetchAsync();
      
      return conversations.map(convertConversationDocumentToApi);
    } catch (error) {
      console.error("Error in getConversationsForLandlord:", error);
      throw error;
    }
  }

  async getMessagesForConversation(conversationId: string): Promise<ApiMessage[]> {
    try {
      // Get all messages for the conversation, sorted by timestamp
      const messages = await MessageCollection.find(
        { conversationId },
        { sort: { timestamp: 1 } }
      ).fetchAsync();
      
      return messages.map(convertMessageDocumentToApi);
    } catch (error) {
      console.error("Error in getMessagesForConversation:", error);
      throw error;
    }
  }

  async insertMessage(messageData: {
    conversationId: string;
    text: string;
    senderId: string;
    senderRole: string;
  }): Promise<string> {
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

      return messageId;
    } catch (error) {
      console.error("Error in insertMessage:", error);
      throw error;
    }
  }

  async insertConversation(conversationData: {
    agentId: string;
    tenantId?: string;
    landlordId?: string;
    propertyId?: string;
    unreadCounts: Record<string, number>;
  }): Promise<string> {
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
          return existingConversation._id;
        }
      } else if (conversationData.landlordId) {
        // Agent-Landlord conversation
        existingConversation = await ConversationCollection.findOneAsync({
          agentId: conversationData.agentId,
          landlordId: conversationData.landlordId
        });
        
        if (existingConversation) {
          return existingConversation._id;
        }
      }

      const newConversation: Omit<ConversationDocument, '_id'> = {
        agentId: conversationData.agentId,
        landlordId: conversationData.landlordId,
        tenantId: conversationData.tenantId,
        propertyId: conversationData.propertyId,
        lastMessage: undefined,
        unreadCounts: conversationData.unreadCounts,
        activeUsers: [], // Initialize with empty array - no users have the conversation open yet
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const conversationId = await ConversationCollection.insertAsync(newConversation);
      return conversationId;
    } catch (error) {
      console.error("Error in insertConversation:", error);
      throw error;
    }
  }

  async resetUnreadCount(conversationId: string, userId: string): Promise<void> {
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

    } catch (error) {
      console.error("Error in resetUnreadCount:", error);
      throw error;
    }
  }

  async addActiveUser(conversationId: string, userId: string): Promise<void> {
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
      }
    } catch (error) {
      console.error("Error in addActiveUser:", error);
      throw error;
    }
  }

  async removeActiveUser(conversationId: string, userId: string): Promise<void> {
    try {
      // Remove user from activeUsers array
      await ConversationCollection.updateAsync(
        { _id: conversationId },
        { 
          $pull: { activeUsers: userId },
          $set: { updatedAt: new Date() }
        }
      );
    } catch (error) {
      console.error("Error in removeActiveUser:", error);
      throw error;
    }
  }
}
