import { useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { ConversationCollection, MessageCollection } from '../collections/messaging-collections';
import { useAppDispatch, useAppSelector } from '/app/client/store';
import { 
  setConversationsFromSubscription, 
  setMessagesFromSubscription,
  addMessage,
  updateConversationLastMessage 
} from '../state/reducers/messages-slice';
import { Role } from '/app/shared/user-role-identifier';
import { Agent } from '/app/client/library-modules/domain-models/user/Agent';
import { Tenant } from '/app/client/library-modules/domain-models/user/Tenant';
import { Landlord } from '/app/client/library-modules/domain-models/user/Landlord';

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
    if (conversationsReady && conversations.length > 0) {
      dispatch(setConversationsFromSubscription(conversations));
    }
  }, [conversations, conversationsReady, dispatch]);

  // Update Redux store when messages change
  useEffect(() => {
    if (messagesReady && activeConversationId) {
      console.log('🔄 Messages updated via subscription:', messages.length, 'messages');
      dispatch(setMessagesFromSubscription({ 
        conversationId: activeConversationId, 
        messages, 
        currentUserId 
      }));
    }
  }, [messages, messagesReady, activeConversationId, dispatch, currentUserId]);

  // Also update when messages change even if conversation isn't active (for real-time updates)
  useEffect(() => {
    if (messagesReady && activeConversationId && messages.length > 0) {
      console.log('📨 Real-time message update detected');
    }
  }, [messages.length, messagesReady, activeConversationId]);

  return {
    conversationsReady,
    messagesReady,
    conversations,
    messages
  };
}
