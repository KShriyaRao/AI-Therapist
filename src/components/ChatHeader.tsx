
import React from 'react';
import { Brain, Heart, Sparkles } from 'lucide-react';

interface ChatHeaderProps {
  title?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ title = "AI Therapist" }) => {
  return (
    <div className="flex items-center justify-center gap-3 p-5 bg-gradient-to-r from-therapy-purple/40 to-therapy-blue/60 rounded-t-lg backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <div className="relative">
          <Brain className="w-6 h-6 text-primary animate-pulse-gentle z-10" />
          <div className="absolute -inset-1 bg-white/30 rounded-full blur-sm -z-10"></div>
        </div>
        <div className="relative">
          <Heart className="w-5 h-5 text-therapy-accent animate-pulse-gentle z-10" />
          <div className="absolute -inset-1 bg-white/30 rounded-full blur-sm -z-10"></div>
        </div>
        <Sparkles className="w-4 h-4 text-primary/70" />
      </div>
      <h1 className="text-xl font-semibold text-primary tracking-tight">{title}</h1>
    </div>
  );
};

export default ChatHeader;
