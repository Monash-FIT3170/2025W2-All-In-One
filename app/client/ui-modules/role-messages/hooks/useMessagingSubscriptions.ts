import { useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Mongo } from "meteor/mongo";
import { useAppDispatch, useAppSelector } from '/app/client/store';
import { 
  setConversationsFromSubscription, 
  setMessagesFromSubscription,
  addMessage,
  updateConversationLastMessage
} from '../state/reducers/messages-slice';
import { formatConversationTimestamp } from '../utils/timestamp-utils';
import { Role } from '/app/shared/user-role-identifier';
import { Agent } from '/app/client/library-modules/domain-models/user/Agent';
import { Tenant } from '/app/client/library-modules/domain-models/user/Tenant';
import { Landlord } from '/app/client/library-modules/domain-models/user/Landlord';
import { ApiConversation } from '/app/shared/api-models/messaging/ApiConversation';
import { ApiMessage } from '/app/shared/api-models/messaging/ApiMessage';

// Client-side collections that mirror the server collections
// These will be automatically synchronized via Meteor's pub/sub system
const ConversationCollection: Mongo.Collection<any> = new Mongo.Collection("conversations");
const MessageCollection: Mongo.Collection<any> = new Mongo.Collection("messages");

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
    if (userRole === Role.AGENT) {
      const agent = currentUser as Agent;
      currentUserId = agent.agentId;
      roleId = agent.agentId; // Use agentId as the roleId
    } else if (userRole === Role.TENANT) {
      const tenant = currentUser as Tenant;
      currentUserId = tenant.tenantId;
      roleId = tenant.tenantId; // Use tenantId as the roleId
    } else if (userRole === Role.LANDLORD) {
      const landlord = currentUser as Landlord;
      currentUserId = landlord.landlordId;
      roleId = landlord.landlordId; // Use landlordId as the roleId
    }
  }

  // Subscribe to conversations with role and roleId
  const conversationsReady = useTracker(() => {
    if (!userRole || !roleId) {
      console.log('🔔 No user role or roleId, skipping conversations subscription. userRole:', userRole, 'roleId:', roleId);
      return true; // Return true instead of false to avoid blocking
    }
    const handle = Meteor.subscribe('conversations', userRole, roleId);
    console.log('🔔 Conversations subscription for role:', userRole, 'roleId:', roleId, 'ready:', handle.ready());
    return handle.ready();
  }, [userRole, roleId]);

  // Subscribe to messages for active conversation with role and roleId
  const messagesReady = useTracker(() => {
    if (!activeConversationId) {
      console.log('🔔 No active conversation, skipping messages subscription');
      return true;
    }
    if (!userRole || !roleId) {
      console.log('🔔 No user role or roleId for messages, skipping subscription. userRole:', userRole, 'roleId:', roleId);
      return true; // Return true instead of false to avoid blocking
    }
    const handle = Meteor.subscribe('messages', activeConversationId, userRole, roleId);
    console.log('🔔 Messages subscription for conversation:', activeConversationId, 'role:', userRole, 'roleId:', roleId, 'ready:', handle.ready());
    return handle.ready();
  }, [activeConversationId, userRole, roleId]);

  // Get conversations from local collection (reactive)
  const conversations = useTracker(() => {
    if (!conversationsReady) return [];
    const convs = ConversationCollection.find({}).fetch();
    console.log('📋 Found conversations in client collection:', convs.length, convs);
    return convs;
  }, [conversationsReady]);

  // Get messages from local collection (reactive)
  const messages = useTracker(() => {
    if (!activeConversationId || !messagesReady) return [];
    const msgs = MessageCollection.find(
      { conversationId: activeConversationId },
      { sort: { timestamp: 1 } }
    ).fetch();
    console.log('💬 Found messages in client collection for conversation', activeConversationId, ':', msgs.length, msgs);
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
        currentUserId 
      }));
    }
  }, [conversations, conversationsReady, dispatch, currentUserId]);

  // Update Redux store when messages change
  useEffect(() => {
    if (messagesReady && activeConversationId) {
      console.log('🔄 Messages updated via subscription:', messages.length, 'messages');
      
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
        messages: apiMessages as any, 
        currentUserId 
      }));
      
      // Note: Don't manually update conversation tile here since the conversations 
      // subscription will automatically receive the updated lastMessage from the server
      // This prevents incorrect timestamp updates for conversations without new messages
    }
  }, [messages, messagesReady, activeConversationId, dispatch, currentUserId]);

  // Also update when messages change even if conversation isn't active (for real-time updates)
  useEffect(() => {
    if (messagesReady && activeConversationId && messages.length > 0) {
      console.log('🔄 Real-time message update detected');
    }
  }, [messages.length, messagesReady, activeConversationId]);

  return {
    conversationsReady,
    messagesReady,
    conversations,
    messages
  };
}
