import React, { useState } from "react";
import { Input } from "../../../theming-shadcn/Input";
import { Button } from "../../../theming-shadcn/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Badge } from "../../../theming-shadcn/Badge";
import { Search, Paperclip, Send } from "lucide-react";

interface Conversation {
  id: string;
  name: string;
  role: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isActive: boolean;
}

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isOutgoing: boolean;
  isRead: boolean;
}

export function AgentMessage(): React.JSX.Element {
  const [selectedConversation, setSelectedConversation] = useState<string>("1");
  const [messageText, setMessageText] = useState("");

  // Mock data for conversations
  // TODO: TO BE DELETED ONCE REAL DATA COMES IN
  const conversations: Conversation[] = [
    {
      id: "1",
      name: "John Smith",
      role: "Property Manager",
      avatar: "JS",
      lastMessage: "I'll schedule the maintenance visit",
      timestamp: "10:30 AM",
      unreadCount: 2,
      isActive: true,
    },
    {
      id: "2",
      name: "Sarah Johnson",
      role: "Leasing Agent",
      avatar: "SJ",
      lastMessage: "Your lease renewal documents are",
      timestamp: "Yesterday",
      unreadCount: 1,
      isActive: false,
    },
    {
      id: "3",
      name: "Michael Chen",
      role: "Maintenance Supervisor",
      avatar: "MC",
      lastMessage: "The repair has been completed. Please",
      timestamp: "Mar 25",
      unreadCount: 0,
      isActive: false,
    },
  ];

  // Mock data for messages 
  // TODO: TO BE DELETED ONCE REAL DATA COMES IN
  const messages: Message[] = [
    {
      id: "1",
      text: "Hello, I need to report a leaking faucet in the kitchen.",
      timestamp: "Yesterday, 9:15 AM",
      isOutgoing: true,
      isRead: true,
    },
    {
      id: "2",
      text: "Thank you for reporting this. When would be a good time for a maintenance visit?",
      timestamp: "Yesterday, 9:45 AM",
      isOutgoing: false,
      isRead: false,
    },
    {
      id: "3",
      text: "I'm available tomorrow morning or afternoon.",
      timestamp: "Yesterday, 10:15 AM",
      isOutgoing: true,
      isRead: true,
    },
    {
      id: "4",
      text: "Please let me know if that works for you.",
      timestamp: "10:31 AM",
      isOutgoing: false,
      isRead: false,
    },
    {
      id: "5",
      text: "I'll schedule the maintenance visit for tomorrow at 10 AM.",
      timestamp: "10:30 AM",
      isOutgoing: false,
      isRead: false,
    },
    {
      id: "6",
      text: "I'll schedule the maintenance visit.",
      timestamp: "10:30 AM",
      isOutgoing: false,
      isRead: false,
    },
  ];

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // Handle sending message logic here
      setMessageText("");
    }
  };

  const activeConversation = conversations.find(c => c.id === selectedConversation);

  return (
    <div className="bg-gray-50 flex justify-center p-2 pt-3">
      <div className="w-full max-w-[1720px] h-[calc(100vh-8rem)] bg-white rounded-xl shadow-lg flex overflow-hidden">
        {/* Left Panel: Conversation List */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">Messages</h1>
            </div>
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search conversations..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Conversation List - Scrollable */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto">
              <div className="p-2">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      conversation.isActive
                        ? "bg-gray-100"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {conversation.avatar}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {conversation.name}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {conversation.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.role}
                        </p>
                        <p className="text-sm text-gray-500 truncate mt-1">
                          {conversation.lastMessage}
                        </p>
                      </div>

                      {conversation.unreadCount > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Chat Window */}
        <div className="flex-1 bg-white flex flex-col">
          {activeConversation ? (
            <>
              {/* Chat Header - Fixed */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {activeConversation.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {activeConversation.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {activeConversation.role}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages Area - Scrollable */}
              <div className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isOutgoing ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.isOutgoing
                              ? "bg-gray-900 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <div className={`flex items-center justify-between mt-1 text-xs ${
                            message.isOutgoing ? "text-gray-300" : "text-gray-500"
                          }`}>
                            <span>{message.timestamp}</span>
                            {message.isOutgoing && (
                              <span>{message.isRead ? "Read" : "Delivered"}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Message Input - Fixed at bottom */}
              <div className="p-4 border-t border-gray-200 flex-shrink-0">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} size="sm">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
