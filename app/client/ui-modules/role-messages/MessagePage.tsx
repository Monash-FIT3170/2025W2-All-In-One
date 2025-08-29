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
} from "./state/reducers/messages-slice";

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
  const currentUser = useAppSelector((state) => state.currentUser.authUser);

  useEffect(() => {
    if (currentUser?.userId) {
      dispatch(fetchConversations(currentUser.userId));
    }
  }, [dispatch, currentUser?.userId]);

  useEffect(() => {
    if (activeConversationId) {
      dispatch(fetchConversationMessages(activeConversationId));
    }
  }, [dispatch, activeConversationId]);

  const handleSelectConversation = (conversationId: string) => {
    dispatch(setActiveConversation(conversationId));
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


