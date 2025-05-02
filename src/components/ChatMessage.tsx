
import React from 'react';
import { ChatMessage as ChatMessageType } from '../types/chat';
import { cn } from '@/lib/utils';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.type === 'user';

  return (
    <div className={cn(
      "flex w-full mb-4 animate-fade-in",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[80%] rounded-xl p-3 flex items-start gap-2",
        isUser 
          ? "bg-therapy-accent text-white rounded-tr-none" 
          : "bg-therapy-gray text-gray-800 rounded-tl-none"
      )}>
        <div className="mt-1 min-w-[24px]">
          {isUser ? (
            <User className="h-5 w-5" />
          ) : (
            <Bot className="h-5 w-5" />
          )}
        </div>
        <div className="flex-1 text-sm">
          {message.text}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
