import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "/app/client/store";
import { ConversationList } from "./components/ConversationList";
import { ChatWindow } from "./components/ChatWindow";
import {
  selectConversations,
  selectActiveConversationId,
  selectMessages,
  selectMessageText,
  selectIsLoading,
  selectConversationsLoading,
  selectMessagesLoading,
  selectError,
  fetchAgentConversations,
  fetchConversationMessages,
  sendMessage,
  setActiveConversation,
  setMessageText,
} from "./state/reducers/agent-messages-slice";

export function AgentMessage(): React.JSX.Element {
  const dispatch = useAppDispatch();
  
  // Selectors
  const conversations = useAppSelector(selectConversations);
  const activeConversationId = useAppSelector(selectActiveConversationId);
  const messages = useAppSelector(selectMessages);
  const messageText = useAppSelector(selectMessageText);
  const isLoading = useAppSelector(selectIsLoading);
  const conversationsLoading = useAppSelector(selectConversationsLoading);
  const messagesLoading = useAppSelector(selectMessagesLoading);
  const error = useAppSelector(selectError);

  // Get current user ID for fetching conversations
  const currentUser = useAppSelector((state) => state.currentUser.authUser);

  useEffect(() => {
    if (currentUser?.userId) {
      dispatch(fetchAgentConversations(currentUser.userId));
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
    if (!messageText.trim() || !activeConversationId) return;
    
    dispatch(sendMessage({
      conversationId: activeConversationId,
      text: messageText.trim()
    }));
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
          activeId={activeConversationId || undefined} 
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
