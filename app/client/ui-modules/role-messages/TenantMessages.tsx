import React, { useState } from "react";
import { Conversation, Message } from "./types";
import { ConversationList } from "./components/ConversationList";
import { ChatWindow } from "./components/ChatWindow";

function TenantMessages() {
  const [activeId, setActiveId] = useState<string>("1");
  const [messageText, setMessageText] = useState("");

  // TODO: replace with real tenant conversations
  const conversations: Conversation[] = [
    { id: "1", name: "John Smith", role: "Property Manager", avatar: "JS", lastMessage: "We'll schedule the maintenance", timestamp: "10:30 AM", unreadCount: 0 },
    { id: "2", name: "Sarah Johnson", role: "Leasing Agent", avatar: "SJ", lastMessage: "Your lease renewal documents are", timestamp: "Yesterday", unreadCount: 1 },
    { id: "3", name: "Michael Chen", role: "Maintenance Supervisor", avatar: "MC", lastMessage: "Repair completed. Please confirm", timestamp: "Mar 25", unreadCount: 0 },
  ];

  // TODO: replace with real messages
  const messages: Message[] = [
    { id: "1", text: "Hello, the faucet is leaking.", timestamp: "Yesterday, 9:15 AM", isOutgoing: true, isRead: true },
    { id: "2", text: "Thanks for reporting. When works for a visit?", timestamp: "Yesterday, 9:45 AM", isOutgoing: false, isRead: false },
    { id: "3", text: "Tomorrow morning is good.", timestamp: "Yesterday, 10:15 AM", isOutgoing: true, isRead: true },
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

export default TenantMessages;
