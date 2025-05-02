
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage as ChatMessageType, FeedbackRating } from '../types/chat';
import ChatHeader from '../components/ChatHeader';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import FeedbackPrompt from '../components/FeedbackPrompt';
import { generateId, getInitialMessage, generateResponse } from '../utils/chatUtils';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([getInitialMessage()]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending a new message
  const handleSendMessage = (text: string) => {
    const newUserMessage: ChatMessageType = {
      id: generateId(),
      type: 'user',
      text,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    
    // Simulate bot thinking
    setTimeout(() => {
      const botResponse = generateResponse(text);
      setMessages(prev => [...prev, botResponse]);
      
      // After several messages, show the feedback prompt
      if (messages.length >= 4 && !showFeedback) {
        setTimeout(() => {
          setShowFeedback(true);
        }, 1000);
      }
    }, 1000);
  };

  // Handle feedback submission
  const handleFeedbackSubmit = (feedback: FeedbackRating) => {
    toast({
      title: "Thank you for your feedback!",
      description: `You rated this session ${feedback.score}/5`,
      className: "bg-white border-therapy-accent border-l-4"
    });
    
    setTimeout(() => {
      setShowFeedback(false);
      setSessionEnded(true);
      
      // Add a closing message
      const closingMessage: ChatMessageType = {
        id: generateId(),
        type: 'bot',
        text: "Thank you for chatting with me today. Remember, it's important to take care of your mental health. Feel free to come back anytime you need support.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, closingMessage]);
    }, 1000);
  };

  // Start a new session
  const handleNewSession = () => {
    setMessages([getInitialMessage()]);
    setSessionEnded(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-therapy-blue/50 to-white p-4">
      <div className="w-full max-w-md flex flex-col rounded-xl shadow-lg bg-white/90 backdrop-blur-sm h-[650px] overflow-hidden border border-white/50">
        <ChatHeader />
        
        <div className="flex-grow overflow-y-auto p-4 bg-gradient-to-b from-white/40 to-therapy-gray/10">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {showFeedback && !sessionEnded && (
            <FeedbackPrompt onSubmitFeedback={handleFeedbackSubmit} />
          )}
          
          {sessionEnded && (
            <div className="mt-6 flex justify-center animate-fade-in">
              <Button
                onClick={handleNewSession}
                className="px-6 py-3 bg-gradient-to-r from-therapy-accent to-therapy-accent/90 text-white rounded-full hover:shadow-md transition-all"
              >
                Start New Session
              </Button>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <ChatInput 
          onSendMessage={handleSendMessage} 
          isDisabled={showFeedback || sessionEnded} 
        />
      </div>
    </div>
  );
};

export default Index;
