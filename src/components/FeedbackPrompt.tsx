
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FeedbackRating } from '../types/chat';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { HeartPulse, Sparkles } from 'lucide-react';

interface FeedbackPromptProps {
  onSubmitFeedback: (feedback: FeedbackRating) => void;
}

const FeedbackPrompt: React.FC<FeedbackPromptProps> = ({ onSubmitFeedback }) => {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (selectedRating !== null) {
      setIsSubmitting(true);
      onSubmitFeedback({
        score: selectedRating,
        comment: comment.trim() || undefined
      });
    }
  };

  return (
    <div className="w-full p-6 bg-gradient-to-br from-therapy-blue/40 to-therapy-purple/40 rounded-xl shadow-sm border border-white/50 animate-fade-in">
      <div className="flex items-center justify-center gap-3 mb-4">
        <HeartPulse className="w-5 h-5 text-therapy-accent" />
        <h3 className="text-lg font-medium text-primary">How was this session?</h3>
        <Sparkles className="w-4 h-4 text-therapy-accent/70" />
      </div>
      
      <div className="flex justify-center space-x-3 mb-5">
        {[1, 2, 3, 4, 5].map((rating) => (
          <Button
            key={rating}
            type="button"
            onClick={() => setSelectedRating(rating)}
            className={cn(
              "h-12 w-12 rounded-full transition-all",
              selectedRating === rating 
                ? "bg-therapy-accent text-white hover:bg-therapy-accent/90 scale-110 shadow-md" 
                : "bg-white text-gray-500 hover:bg-gray-100 hover:scale-105"
            )}
            variant="ghost"
          >
            {rating}
          </Button>
        ))}
      </div>
      
      <Textarea
        placeholder="Any additional comments? (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="min-h-[90px] mb-5 bg-white/80 border-0 shadow-sm focus-visible:ring-therapy-accent resize-none"
      />
      
      <Button 
        onClick={handleSubmit}
        disabled={selectedRating === null || isSubmitting}
        className="w-full bg-gradient-to-r from-therapy-accent to-therapy-accent/90 hover:from-therapy-accent/90 hover:to-therapy-accent text-white font-medium py-6 shadow-sm transition-all"
      >
        {isSubmitting ? 'Thank you!' : 'Submit Feedback'}
      </Button>
    </div>
  );
};

export default FeedbackPrompt;
