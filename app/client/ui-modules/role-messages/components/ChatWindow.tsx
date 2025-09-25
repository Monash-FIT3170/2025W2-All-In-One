import React, { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Textarea } from "/app/client/ui-modules/theming-shadcn/Textarea";
import { Button } from "/app/client/ui-modules/theming-shadcn/Button";
import { Send } from "lucide-react";
import { Message } from "/app/client/library-modules/domain-models/messaging/Message";
import { formatChatMessageTimestamp } from "../utils/timestamp-utils";

interface ChatWindowProps {
  header: { name: string; role: string; avatar: string } | null;
  messages: Message[];
  messageText: string;
  onChangeMessage: (value: string) => void;
  onSend: () => void;
  placeholderMessage?: string;
}

export function ChatWindow({ header, messages, messageText, onChangeMessage, onSend, placeholderMessage }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages]);

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
            <div ref={scrollContainerRef} className="h-full overflow-y-auto p-4"> {/* Scrollable area */}
              <div className="space-y-4">
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.isOutgoing ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        m.isOutgoing ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm break-words whitespace-pre-wrap mb-1">{m.text}</p>
                      <div className={`flex items-center justify-between text-xs ${m.isOutgoing ? "text-gray-300" : "text-gray-500"}`}>
                        <span>{formatChatMessageTimestamp(m.timestamp)}</span>
                        {m.isOutgoing && (
                          <span className="ml-2">{m.isRead ? "Read" : "Delivered"}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {/* Invisible element to scroll to */}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>

          {/* Composer */}
          <div className="p-4 border-t border-gray-200 flex-shrink-0">
            <div className="flex items-end space-x-2">
              <Textarea
                placeholder="Type a message..."
                value={messageText}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChangeMessage(e.target.value)}
                onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    onSend();
                  }
                }}
                className="flex-1 min-h-[48px] max-h-32 text-base resize-none"
                rows={1}
              />
              <Button onClick={onSend} size="sm" className="h-12 px-4">
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <p>{placeholderMessage || "Select a conversation to start messaging"}</p>
        </div>
      )}
    </div>
  );
}
