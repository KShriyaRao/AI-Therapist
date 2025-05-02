
import React from 'react';
import { ChatMessage as ChatMessageType } from '../types/chat';
import { cn } from '@/lib/utils';
import { User, Bot, Brain } from 'lucide-react';

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
        "max-w-[80%] rounded-2xl p-4 flex items-start gap-3 shadow-sm",
        isUser 
          ? "bg-gradient-to-br from-therapy-accent to-therapy-accent/90 text-white rounded-tr-sm" 
          : "bg-gradient-to-br from-therapy-gray/95 to-therapy-purple/20 text-gray-800 rounded-tl-sm border border-white/10"
      )}>
        <div className={cn(
          "flex items-center justify-center rounded-full w-7 h-7",
          isUser ? "bg-white/20" : "bg-white/30"
        )}>
          {isUser ? (
            <User className="h-4 w-4 text-white/90" />
          ) : (
            <Brain className="h-4 w-4 text-therapy-accent/90" />
          )}
        </div>
        <div className="flex-1 text-sm leading-relaxed">
          {message.text}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
