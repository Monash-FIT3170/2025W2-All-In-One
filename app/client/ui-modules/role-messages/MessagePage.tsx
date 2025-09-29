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
  removeActiveUser,
  selectConversation,
} from "./state/reducers/messages-slice";
import { useMessagingSubscriptions } from "./hooks/useMessagingSubscriptions";
import { useLocation } from "react-router";

type UserRole = 'agent' | 'landlord' | 'tenant';

interface MessagesPageProps {
  role: UserRole;
}

export function MessagesPage({ role }: MessagesPageProps): React.JSX.Element {
  const dispatch = useAppDispatch();
  const location = useLocation();

  // Selectors
  const conversations = useAppSelector(selectConversationsForRole(role));
  const activeConversationId = useAppSelector(selectActiveConversationId);
  const messages = useAppSelector(selectAllMessages);
  const messageText = useAppSelector(selectMessageText);
  const conversationsLoading = useAppSelector(selectConversationsLoading);
  const error = useAppSelector(selectError);

  // Get current user for authentication checks
  const authUser = useAppSelector((state) => state.currentUser.authUser);

  // Use real-time subscriptions for live messaging
  const { conversationsReady, messagesReady } = useMessagingSubscriptions(activeConversationId);

  // Initial fetch for conversations (fallback for when subscriptions aren't ready)
  useEffect(() => {
    if (authUser && !conversationsReady) {
      dispatch(fetchConversations());
    }
  }, [dispatch, authUser, conversationsReady]);

  // Auto-select conversation from navigation state
  useEffect(() => {
    const state = location.state as { conversationId?: string; agentId?: string; shouldAutoSelect?: boolean } | null;
    if (state?.conversationId && state.shouldAutoSelect && conversations.length > 0) {
      const conversation = conversations.find(c => c.id === state.conversationId);
      if (conversation) {
        dispatch(selectConversation(state.conversationId));
      } else {
        // If conversation not found, try to refresh conversations in case it was just created
        if (!conversationsLoading) {
          dispatch(fetchConversations());
        }
      }
    }
  }, [conversations, location.state, dispatch, conversationsLoading]);

  // Additional effect to ensure conversation selection works even if activeConversationId is already set
  useEffect(() => {
    const state = location.state as { conversationId?: string; agentId?: string; shouldAutoSelect?: boolean } | null;
    if (state?.conversationId && state.shouldAutoSelect && conversations.length > 0) {
      const conversation = conversations.find(c => c.id === state.conversationId);
      if (conversation && activeConversationId !== state.conversationId) {
        dispatch(selectConversation(state.conversationId));
      }
    }
  }, [conversations, activeConversationId, location.state, dispatch]);

  // Retry mechanism for conversation selection with timeout
  useEffect(() => {
    const state = location.state as { conversationId?: string; agentId?: string; shouldAutoSelect?: boolean } | null;
    if (state?.conversationId && state.shouldAutoSelect) {
      const conversationId = state.conversationId;
      const trySelectConversation = () => {
        const conversation = conversations.find(c => c.id === conversationId);
        if (conversation && activeConversationId !== conversationId) {
          dispatch(selectConversation(conversationId));
          return true;
        }
        return false;
      };

      // Try immediately
      if (!trySelectConversation()) {
        // If not found, try again after a short delay
        const timeoutId = setTimeout(() => {
          if (!trySelectConversation()) {
            // Conversation still not found after retry
          }
        }, 1000);

        return () => clearTimeout(timeoutId);
      }
    }
  }, [conversations, activeConversationId, location.state, dispatch]);

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
        dispatch(removeActiveUser(activeConversationId));
      }
    };
  }, [activeConversationId, dispatch]);

  // Always reset to fresh state when navigating to messages page or when user changes
  // But don't reset if we have a conversationId in navigation state
  useEffect(() => {
    const state = location.state as { conversationId?: string } | null;
    if (!state?.conversationId) {
      // Reset active conversation whenever user navigates to messages page or logs in
      // This ensures they always see the conversation selection screen and no message panel is open
      dispatch(setActiveConversation(null));
    }
  }, [dispatch, authUser?.userId, location.state]);

  const handleSelectConversation = (conversationId: string) => {
    // Validate conversationId is not null/undefined
    if (!conversationId) {
      console.error('Cannot select conversation: conversationId is null or undefined');
      return;
    }

    // Remove current user from previous conversation's active users (if any)
    if (activeConversationId && activeConversationId !== conversationId) {
      dispatch(removeActiveUser(activeConversationId));
    }

    // Select the new conversation (sets active, resets unread count, adds to active users)
    dispatch(selectConversation(conversationId));
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
          placeholderMessage={conversations.length === 0 ? "No conversations yet" : undefined}
        />
      </div>
    </div>
  );
}
