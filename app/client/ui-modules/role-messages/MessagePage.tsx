import React, { useEffect } from "react";
import { Meteor } from 'meteor/meteor';
import { useAppDispatch, useAppSelector } from "/app/client/store";
import { ConversationList } from "./components/ConversationList";
import { ChatWindow } from "./components/ChatWindow";
import {
  selectConversationsForRole,
  selectActiveConversationId,
  selectAllMessages,
  selectMessageText,
  selectConversationsLoading,
  selectError,
  fetchConversations,
  fetchConversationMessages,
  sendMessage,
  setActiveConversation,
  setMessageText,
  resetUnreadCount,
} from "./state/reducers/messages-slice";
import { useMessagingSubscriptions } from "./hooks/useMessagingSubscriptions";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { Role } from "/app/shared/user-role-identifier";
import { Agent } from "/app/client/library-modules/domain-models/user/Agent";
import { Tenant } from "/app/client/library-modules/domain-models/user/Tenant";
import { Landlord } from "/app/client/library-modules/domain-models/user/Landlord";

type UserRole = 'agent' | 'landlord' | 'tenant';

interface MessagesPageProps {
  role: UserRole;
} 

export function MessagesPage({ role }: MessagesPageProps): React.JSX.Element {
  const dispatch = useAppDispatch();
  
  // Selectors
  const conversations = useAppSelector(selectConversationsForRole(role));
  const activeConversationId = useAppSelector(selectActiveConversationId);
  const messages = useAppSelector(selectAllMessages);
  const messageText = useAppSelector(selectMessageText);
  const conversationsLoading = useAppSelector(selectConversationsLoading);
  const error = useAppSelector(selectError);

  // Get current user ID for fetching conversations
  const currentUser = useAppSelector((state) => state.currentUser.currentUser);
  const authUser = useAppSelector((state) => state.currentUser.authUser);

  // Use real-time subscriptions for live messaging
  const { conversationsReady, messagesReady } = useMessagingSubscriptions(activeConversationId);

  // Initial fetch for conversations (fallback for when subscriptions aren't ready)
  useEffect(() => {
    if (authUser && !conversationsReady) {
      dispatch(fetchConversations());
    }
  }, [dispatch, authUser, conversationsReady]);

  // Initial fetch for messages (fallback for when subscriptions aren't ready)
  useEffect(() => {
    if (activeConversationId && !messagesReady) {
      dispatch(fetchConversationMessages(activeConversationId));
    }
  }, [dispatch, activeConversationId, messagesReady]);

  // Cleanup function to remove user from active users when leaving
  useEffect(() => {
    return () => {
      if (activeConversationId && authUser && currentUser) {
        // Remove user from active users when component unmounts
        let currentUserId: string;
        if (authUser.role === Role.AGENT) {
          const agent = currentUser as Agent;
          currentUserId = agent.agentId;
        } else if (authUser.role === Role.TENANT) {
          const tenant = currentUser as Tenant;
          currentUserId = tenant.tenantId;
        } else if (authUser.role === Role.LANDLORD) {
          const landlord = currentUser as Landlord;
          currentUserId = landlord.landlordId;
        } else {
          return;
        }

        // Remove user from active users
        Meteor.callAsync(
          MeteorMethodIdentifier.CONVERSATION_REMOVE_ACTIVE_USER,
          activeConversationId,
          currentUserId
        ).catch(error => {
          console.error('Failed to remove active user on cleanup:', error);
        });
      }
    };
  }, [activeConversationId, authUser, currentUser]);

  const handleSelectConversation = async (conversationId: string) => {
    // Remove current user from previous conversation's active users (if any)
    if (activeConversationId && currentUser) {
      let currentUserId: string;
      if (authUser?.role === 'agent') {
        const agent = currentUser as any;
        currentUserId = agent.agentId;
      } else if (authUser?.role === 'tenant') {
        const tenant = currentUser as any;
        currentUserId = tenant.tenantId;
      } else if (authUser?.role === 'landlord') {
        const landlord = currentUser as any;
        currentUserId = landlord.landlordId;
      } else {
        return;
      }

      try {
        await Meteor.callAsync(
          MeteorMethodIdentifier.CONVERSATION_REMOVE_ACTIVE_USER,
          activeConversationId,
          currentUserId
        );
      } catch (error) {
        console.error('Failed to remove user from active users:', error);
      }
    }

    dispatch(setActiveConversation(conversationId));
    // Reset unread count when opening a conversation
    dispatch(resetUnreadCount(conversationId));

    // Add current user to new conversation's active users
    if (currentUser) {
      let currentUserId: string;
      if (authUser?.role === 'agent') {
        const agent = currentUser as any;
        currentUserId = agent.agentId;
      } else if (authUser?.role === 'tenant') {
        const tenant = currentUser as any;
        currentUserId = tenant.tenantId;
      } else if (authUser?.role === 'landlord') {
        const landlord = currentUser as any;
        currentUserId = landlord.landlordId;
      } else {
        return;
      }

      try {
        await Meteor.callAsync(
          MeteorMethodIdentifier.CONVERSATION_ADD_ACTIVE_USER,
          conversationId,
          currentUserId
        );
      } catch (error) {
        console.error('Failed to add user to active users:', error);
      }
    }
  };

  const handleChangeMessage = (value: string) => {
    dispatch(setMessageText(value));
  };

  const handleSend = () => {
    const trimmedText = messageText.trim();
    if (!trimmedText || !activeConversationId) return;

    dispatch(
      sendMessage({
        conversationId: activeConversationId,
        text: trimmedText,
      })
    );
  };

  const active = conversations.find(c => c.id === activeConversationId) || null;

  if (conversationsLoading) {
    return (
      <div className="bg-gray-50 flex justify-center p-2 pt-3">
        <div className="w-full max-w-[1720px] h-[calc(100vh-8rem)] bg-white rounded-xl shadow-lg flex items-center justify-center">
          <div className="text-gray-500">Loading conversations...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 flex justify-center p-2 pt-3">
        <div className="w-full max-w-[1720px] h-[calc(100vh-8rem)] bg-white rounded-xl shadow-lg flex items-center justify-center">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 flex justify-center p-2 pt-3">
      <div className="w-full max-w-[1720px] h-[calc(100vh-8rem)] bg-white rounded-xl shadow-lg flex overflow-hidden">
        <ConversationList 
          conversations={conversations} 
          activeConversationId={activeConversationId || undefined} 
          onSelect={handleSelectConversation} 
        />
        <ChatWindow
          header={active ? { name: active.name, role: active.role, avatar: active.avatar } : null}
          messages={messages}
          messageText={messageText}
          onChangeMessage={handleChangeMessage}
          onSend={handleSend}
        />
      </div>
    </div>
  );
}
