
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
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
    <form onSubmit={handleSubmit} className="flex w-full mt-auto p-4 bg-white border-t border-gray-200">
      <div className="relative flex w-full items-center">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type how you're feeling..."
          className="flex-grow pr-10 focus-visible:ring-therapy-accent"
          disabled={isDisabled}
        />
        <Button 
          type="submit" 
          size="icon" 
          className={cn(
            "absolute right-0 bg-transparent hover:bg-transparent",
            input.trim() ? "text-therapy-accent" : "text-gray-400"
          )}
          disabled={!input.trim() || isDisabled}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
};

export default ChatInput;
