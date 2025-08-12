import React, { useState } from "react";
import { Conversation, Message } from "./types";
import { ConversationList } from "./components/ConversationList";
import { ChatWindow } from "./components/ChatWindow";

function LandlordMessages() {
  const [activeId, setActiveId] = useState<string>("1");
  const [messageText, setMessageText] = useState("");

  // TODO: replace with real landlord conversations
  const conversations: Conversation[] = [
    { id: "1", name: "Alex Carter", role: "Agent", avatar: "AC", lastMessage: "Tenant application received", timestamp: "09:20 AM", unreadCount: 0 },
    { id: "2", name: "Priya Singh", role: "Tenant", avatar: "PS", lastMessage: "Rent paid for April", timestamp: "Yesterday", unreadCount: 0 },
    { id: "3", name: "Michael Chen", role: "Maintenance", avatar: "MC", lastMessage: "Inspection scheduled Fri 2 PM", timestamp: "Mar 24", unreadCount: 1 },
  ];

  // TODO: replace with real messages
  const messages: Message[] = [
    { id: "1", text: "Hi Alex, can we review the new application?", timestamp: "Yesterday, 2:05 PM", isOutgoing: true, isRead: true },
    { id: "2", text: "Yes, I will send you the summary shortly.", timestamp: "Yesterday, 2:16 PM", isOutgoing: false, isRead: false },
    { id: "3", text: "Thanks!", timestamp: "Yesterday, 2:18 PM", isOutgoing: true, isRead: true },
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
        <ConversationList title="Messages" conversations={conversations} activeId={activeId} onSelect={setActiveId} />
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

export default LandlordMessages; 