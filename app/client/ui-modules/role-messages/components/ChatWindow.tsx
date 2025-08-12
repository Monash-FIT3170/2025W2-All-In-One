import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Input } from "/app/client/ui-modules/theming-shadcn/Input";
import { Button } from "/app/client/ui-modules/theming-shadcn/Button";
import { Send } from "lucide-react";
import { Message } from "../types";

interface ChatWindowProps {
  header: { name: string; role: string; avatar: string } | null;
  messages: Message[];
  messageText: string;
  onChangeMessage: (value: string) => void;
  onSend: () => void;
}

export function ChatWindow({ header, messages, messageText, onChangeMessage, onSend }: ChatWindowProps) {
  return (
    <div className="flex-1 bg-white flex flex-col">
      {header ? (
        <>
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback className="bg-blue-100 text-blue-600">{header.avatar}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold text-gray-900">{header.name}</h2>
                <p className="text-sm text-gray-500">{header.role}</p>
              </div>
            </div>
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto p-4"> {/* Scrollable area */}
              <div className="space-y-4">
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.isOutgoing ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        m.isOutgoing ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{m.text}</p>
                      <div className={`flex items-center justify-between mt-1 text-xs ${m.isOutgoing ? "text-gray-300" : "text-gray-500"}`}>
                        <span>{m.timestamp}</span>
                        {m.isOutgoing && <span>{m.isRead ? "Read" : "Delivered"}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Composer */}
          <div className="p-4 border-t border-gray-200 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => onChangeMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && onSend()}
                className="flex-1 h-12 text-base"
              />
              <Button onClick={onSend} size="sm" className="h-12 px-4">
                <Send className="h-5 w-5" />
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
  );
} 