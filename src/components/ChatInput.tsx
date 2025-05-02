
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isDisabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isDisabled = false }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isDisabled) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full mt-auto p-4 bg-white border-t border-gray-100 shadow-inner">
      <div className="relative flex w-full items-center bg-therapy-gray/50 rounded-full transition-all focus-within:bg-white focus-within:shadow-md">
        <Sparkles className="absolute left-3 w-4 h-4 text-therapy-accent/70" />
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type how you're feeling..."
          className="flex-grow pl-10 pr-12 py-3 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-700"
          disabled={isDisabled}
        />
        <Button 
          type="submit" 
          size="icon" 
          className={cn(
            "absolute right-1 rounded-full w-8 h-8 transition-all",
            input.trim() 
              ? "bg-therapy-accent text-white hover:bg-therapy-accent/90 hover:shadow-md" 
              : "bg-gray-200 text-gray-400"
          )}
          disabled={!input.trim() || isDisabled}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

export default ChatInput;
