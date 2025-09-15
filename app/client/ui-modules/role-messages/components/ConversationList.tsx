import React from "react";
import { Input } from "/app/client/ui-modules/theming-shadcn/Input";
import { Badge } from "/app/client/ui-modules/theming-shadcn/Badge";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Search } from "lucide-react";
import { Conversation } from "/app/client/library-modules/domain-models/messaging/Conversation";
import { formatConversationTimestamp } from "../utils/timestamp-utils";

interface ConversationListProps {
  title?: string;
  conversations: Conversation[];
  activeConversationId?: string | null;
  onSelect: (id: string) => void;
}

export function ConversationList({ title = "Messages", conversations, activeConversationId: activeId, onSelect }: ConversationListProps) {
  return (
    <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input placeholder="Search conversations..." className="pl-10" />
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="p-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  activeId === conversation.id ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
                onClick={() => onSelect(conversation.id)}
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
                      <h3 className="font-semibold text-gray-900 truncate">{conversation.name}</h3>
                      <span className="text-xs text-gray-500">
                        {conversation.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{conversation.role}</p>
                    <p className="text-sm text-gray-500 truncate mt-1">{conversation.lastMessage}</p>
                  </div>

                  {conversation.unreadCount > 0 && activeId !== conversation.id && (
                    <Badge variant="secondary" className="bg-black text-white text-xs px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
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
  );
}
