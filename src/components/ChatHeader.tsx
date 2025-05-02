
import React from 'react';
import { Brain, Heart } from 'lucide-react';

interface ChatHeaderProps {
  title?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ title = "AI Therapist" }) => {
  return (
    <div className="flex items-center justify-center gap-2 p-4 bg-therapy-blue rounded-t-lg">
      <div className="flex items-center gap-2">
        <Brain className="w-6 h-6 text-primary animate-pulse-gentle" />
        <Heart className="w-5 h-5 text-primary animate-pulse-gentle" />
      </div>
      <h1 className="text-xl font-semibold text-primary">{title}</h1>
    </div>
  );
};

export default ChatHeader;
