import React, { useEffect } from "react";
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
import { apiAddActiveUser, apiRemoveActiveUser } from "/app/client/library-modules/apis/messaging/messaging-api";
import { Role } from "/app/shared/user-role-identifier";
import { Agent } from "/app/client/library-modules/domain-models/user/Agent";
import { Tenant } from "/app/client/library-modules/domain-models/user/Tenant";
import { Landlord } from "/app/client/library-modules/domain-models/user/Landlord";

type UserRole = 'agent' | 'landlord' | 'tenant';

interface MessagesPageProps {
  role: UserRole;
} 

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

  // Helper function to get current user ID
  const getCurrentUserId = (): string | null => {
    if (!authUser || !currentUser) return null;
    
    if (authUser.role === Role.AGENT && isAgent(currentUser)) {
      return currentUser.agentId;
    } else if (authUser.role === Role.TENANT && isTenant(currentUser)) {
      return currentUser.tenantId;
    } else if (authUser.role === Role.LANDLORD && isLandlord(currentUser)) {
      return currentUser.landlordId;
    }
    return null;
  };

  // Helper function to handle active user management
  const handleActiveUserManagement = async (conversationId: string, action: 'add' | 'remove') => {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) return;

    try {
      if (action === 'add') {
        await apiAddActiveUser(conversationId, currentUserId);
      } else {
        await apiRemoveActiveUser(conversationId, currentUserId);
      }
    } catch (error) {
      console.error(`Failed to ${action} user from active users:`, error);
    }
  };

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
      if (activeConversationId) {
        handleActiveUserManagement(activeConversationId, 'remove');
      }
    };
  }, [activeConversationId]);

  const handleSelectConversation = async (conversationId: string) => {
    // Validate conversationId is not null/undefined
    if (!conversationId) {
      console.error('Cannot select conversation: conversationId is null or undefined');
      return;
    }

    // Remove current user from previous conversation's active users (if any)
    if (activeConversationId && activeConversationId !== conversationId) {
      await handleActiveUserManagement(activeConversationId, 'remove');
    }

    dispatch(setActiveConversation(conversationId));
    // Reset unread count when opening a conversation
    dispatch(resetUnreadCount(conversationId));

    // Add current user to new conversation's active users
    await handleActiveUserManagement(conversationId, 'add');
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
