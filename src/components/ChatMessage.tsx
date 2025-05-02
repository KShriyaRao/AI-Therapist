
import React from 'react';
import { ChatMessage as ChatMessageType } from '../types/chat';
import { cn } from '@/lib/utils';
import { User, Brain, Heart } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
  onExerciseClick?: (exercisePrompt: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onExerciseClick }) => {
  const isUser = message.type === 'user';

  const handleExerciseClick = () => {
    if (message.exercisePrompt && onExerciseClick) {
      onExerciseClick(message.exercisePrompt);
    }
  };

  return (
    <div className={cn(
      "flex w-full mb-4 animate-fade-in",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[80%] rounded-2xl p-4 flex flex-col items-start gap-3 shadow-sm",
        isUser 
          ? "bg-gradient-to-br from-therapy-accent to-therapy-accent/90 text-white rounded-tr-sm" 
          : "bg-gradient-to-br from-therapy-gray/95 to-therapy-purple/20 text-gray-800 rounded-tl-sm border border-white/10"
      )}>
        <div className="flex items-start gap-3 w-full">
          <div className={cn(
            "flex items-center justify-center rounded-full w-7 h-7 mt-1",
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

        {/* Exercise Prompt Button */}
        {!isUser && message.exercisePrompt && (
          <button
            onClick={handleExerciseClick}
            className="ml-10 mt-2 flex items-center gap-2 px-4 py-2 bg-white/30 hover:bg-white/50 rounded-full text-xs font-medium text-therapy-accent transition-colors"
          >
            <Heart className="h-3.5 w-3.5" />
            <span>Try this exercise</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
