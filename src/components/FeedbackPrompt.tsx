
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FeedbackRating } from '../types/chat';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { HeartPulse } from 'lucide-react';

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
    <div className="w-full p-4 bg-therapy-purple rounded-lg animate-fade-in">
      <div className="flex items-center justify-center gap-2 mb-3">
        <HeartPulse className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-medium text-primary">How was this session?</h3>
      </div>
      
      <div className="flex justify-center space-x-2 mb-4">
        {[1, 2, 3, 4, 5].map((rating) => (
          <Button
            key={rating}
            type="button"
            onClick={() => setSelectedRating(rating)}
            className={cn(
              "h-10 w-10 rounded-full",
              selectedRating === rating 
                ? "bg-therapy-accent text-white hover:bg-therapy-accent/90" 
                : "bg-white text-gray-500 hover:bg-gray-100"
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
        className="min-h-[80px] mb-4 bg-white"
      />
      
      <Button 
        onClick={handleSubmit}
        disabled={selectedRating === null || isSubmitting}
        className="w-full bg-therapy-accent hover:bg-therapy-accent/90"
      >
        {isSubmitting ? 'Thank you!' : 'Submit Feedback'}
      </Button>
    </div>
  );
};

export default FeedbackPrompt;
