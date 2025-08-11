import React, { useState } from "react";
import { Conversation, Message } from "/app/client/ui-modules/messages/types";
import { ConversationList } from "/app/client/ui-modules/messages/components/ConversationList";
import { ChatWindow } from "/app/client/ui-modules/messages/components/ChatWindow";

export function AgentMessage(): React.JSX.Element {
  const [activeId, setActiveId] = useState<string>("1");
  const [messageText, setMessageText] = useState("");

  // TODO: replace with real agent conversations
  const conversations: Conversation[] = [
    {
      id: "1",
      name: "John Smith",
      role: "Property Manager",
      avatar: "JS",
      lastMessage: "I'll schedule the maintenance visit",
      timestamp: "10:30 AM",
      unreadCount: 2,
    },
    {
      id: "2",
      name: "Sarah Johnson",
      role: "Leasing Agent",
      avatar: "SJ",
      lastMessage: "Your lease renewal documents are",
      timestamp: "Yesterday",
      unreadCount: 1,
    },
    {
      id: "3",
      name: "Michael Chen",
      role: "Maintenance Supervisor",
      avatar: "MC",
      lastMessage: "The repair has been completed. Please",
      timestamp: "Mar 25",
      unreadCount: 0,
    },
  ];

  // TODO: replace with real messages
  const messages: Message[] = [
    { id: "1", text: "Hello, I need to report a leaking faucet in the kitchen.", timestamp: "Yesterday, 9:15 AM", isOutgoing: true, isRead: true },
    { id: "2", text: "Thank you for reporting this. When would be a good time for a maintenance visit?", timestamp: "Yesterday, 9:45 AM", isOutgoing: false, isRead: false },
    { id: "3", text: "I'm available tomorrow morning or afternoon.", timestamp: "Yesterday, 10:15 AM", isOutgoing: true, isRead: true },
    { id: "4", text: "Please let me know if that works for you.", timestamp: "10:31 AM", isOutgoing: false, isRead: false },
    { id: "5", text: "I'll schedule the maintenance visit for tomorrow at 10 AM.", timestamp: "10:30 AM", isOutgoing: false, isRead: false },
    { id: "6", text: "I'll schedule the maintenance visit.", timestamp: "10:30 AM", isOutgoing: false, isRead: false },
  ];

  const active = conversations.find(c => c.id === activeId) || null;

  const handleSend = () => {
    if (!messageText.trim()) return;
    // TODO: send message
    setMessageText("");
  };

  return (
    <div className="bg-gray-50 flex justify-center p-2 pt-3">
      <div className="w-full max-w-[1720px] h-[calc(100vh-8rem)] bg-white rounded-xl shadow-lg flex overflow-hidden">
        <ConversationList conversations={conversations} activeId={activeId} onSelect={setActiveId} />
        <ChatWindow
          header={active ? { name: active.name, role: active.role, avatar: active.avatar } : null}
          messages={messages}
          messageText={messageText}
          onChangeMessage={setMessageText}
          onSend={handleSend}
        />
      </div>
    </div>
  );
}
