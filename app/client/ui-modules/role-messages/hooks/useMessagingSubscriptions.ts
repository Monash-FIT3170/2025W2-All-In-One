import { useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Mongo } from "meteor/mongo";
import { useAppDispatch, useAppSelector } from '/app/client/store';
import { 
  setConversationsFromSubscription, 
  setMessagesFromSubscription,
} from '../state/reducers/messages-slice';
import { Role } from '/app/shared/user-role-identifier';
import { Agent } from '/app/client/library-modules/domain-models/user/Agent';
import { Tenant } from '/app/client/library-modules/domain-models/user/Tenant';
import { Landlord } from '/app/client/library-modules/domain-models/user/Landlord';
import { ApiConversation } from '/app/shared/api-models/messaging/ApiConversation';
import { ApiMessage } from '/app/shared/api-models/messaging/ApiMessage';
import { ConversationDocument } from '/app/server/database/messaging/models/ConversationDocument';
import { MessageDocument } from '/app/server/database/messaging/models/MessageDocument';

// Client-side collections that mirror the server collections
// These will be automatically synchronized via Meteor's pub/sub system
const ConversationCollection: Mongo.Collection<ConversationDocument> = new Mongo.Collection("conversations");
const MessageCollection: Mongo.Collection<MessageDocument> = new Mongo.Collection("messages");

// Type guards to safely check user types
function isAgent(user: unknown): user is Agent {
  return user !== null && typeof user === 'object' && 'agentId' in user;
}

function isTenant(user: unknown): user is Tenant {
  return user !== null && typeof user === 'object' && 'tenantId' in user;
}

function isLandlord(user: unknown): user is Landlord {
  return user !== null && typeof user === 'object' && 'landlordId' in user;
}

// Hook for managing messaging subscriptions and real-time updates
export function useMessagingSubscriptions(activeConversationId: string | null) {
  const dispatch = useAppDispatch();
  
  // Get current user info for determining message ownership
  const currentUser = useAppSelector((state) => state.currentUser.currentUser);
  const authUser = useAppSelector((state) => state.currentUser.authUser);
  
  // Determine current user ID and role info
  let currentUserId: string | undefined;
  let userRole: Role | undefined;
  let roleId: string | undefined;
  
  if (authUser && currentUser) {
    userRole = authUser.role;
    if (userRole === Role.AGENT && isAgent(currentUser)) {
      currentUserId = currentUser.agentId;
      roleId = currentUser.agentId;
    } else if (userRole === Role.TENANT && isTenant(currentUser)) {
      currentUserId = currentUser.tenantId;
      roleId = currentUser.tenantId;
    } else if (userRole === Role.LANDLORD && isLandlord(currentUser)) {
      currentUserId = currentUser.landlordId;
      roleId = currentUser.landlordId;
    }
  }

  // Subscribe to conversations with role and roleId
  const conversationsReady = useTracker(() => {
    if (!userRole || !roleId) {
      return true;
    }
    const handle = Meteor.subscribe('conversations', userRole, roleId);
    return handle.ready();
  }, [userRole, roleId]);

  // Subscribe to messages for active conversation with role and roleId
  const messagesReady = useTracker(() => {
    if (!activeConversationId) {
      return true;
    }
    if (!userRole || !roleId) {
      return true;
    }
    const handle = Meteor.subscribe('messages', activeConversationId, userRole, roleId);
    return handle.ready();
  }, [activeConversationId, userRole, roleId]);

  // Get conversations from local collection (reactive)
  const conversations = useTracker(() => {
    if (!conversationsReady) return [];
    const convs = ConversationCollection.find({}).fetch();
    return convs;
  }, [conversationsReady]);

  // Get messages from local collection (reactive)
  const messages = useTracker(() => {
    if (!activeConversationId || !messagesReady) return [];
    const msgs = MessageCollection.find(
      { conversationId: activeConversationId },
      { sort: { timestamp: 1 } }
    ).fetch();
    return msgs;
  }, [activeConversationId, messagesReady]);

  // Update Redux store when conversations change
  useEffect(() => {
    if (conversationsReady && conversations.length > 0 && currentUserId) {
      // Convert server documents to API format
      const apiConversations: ApiConversation[] = conversations.map(conv => ({
        conversationId: conv._id,
        agentId: conv.agentId,
        landlordId: conv.landlordId,
        tenantId: conv.tenantId,
        propertyId: conv.propertyId,
        lastMessage: conv.lastMessage ? {
          text: conv.lastMessage.text,
          timestamp: conv.lastMessage.timestamp instanceof Date 
            ? conv.lastMessage.timestamp.toISOString() 
            : conv.lastMessage.timestamp,
          senderId: conv.lastMessage.senderId
        } : undefined,
        unreadCounts: conv.unreadCounts || {},
        activeUsers: conv.activeUsers || [],
        createdAt: conv.createdAt ? (conv.createdAt instanceof Date ? conv.createdAt.toISOString() : conv.createdAt) : new Date().toISOString(),
        updatedAt: conv.updatedAt ? (conv.updatedAt instanceof Date ? conv.updatedAt.toISOString() : conv.updatedAt) : new Date().toISOString()
      }));
      
      dispatch(setConversationsFromSubscription({
        conversations: apiConversations,
        currentUserId,
        dispatch
      }));
    }
  }, [conversations, conversationsReady, dispatch, currentUserId]);

  // Update Redux store when messages change
  useEffect(() => {
    if (messagesReady && activeConversationId) {
      // Convert server documents to API format
      const apiMessages: ApiMessage[] = messages.map(msg => ({
        messageId: msg._id,
        conversationId: msg.conversationId,
        senderId: msg.senderId,
        senderRole: msg.senderRole,
        text: msg.text,
        timestamp: msg.timestamp instanceof Date ? msg.timestamp.toISOString() : msg.timestamp,
        isRead: msg.isRead
      }));
      
      dispatch(setMessagesFromSubscription({ 
        conversationId: activeConversationId, 
        messages: apiMessages, 
        currentUserId 
      }));
    }
  }, [messages, messagesReady, activeConversationId, dispatch, currentUserId]);

  return {
    conversationsReady,
    messagesReady,
    conversations,
    messages
  };
}
