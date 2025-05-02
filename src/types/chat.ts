
export type MessageType = 'user' | 'bot';

export interface ChatMessage {
  id: string;
  type: MessageType;
  text: string;
  timestamp: Date;
}

export interface TherapeuticResponse {
  text: string;
  type?: 'general' | 'mindfulness' | 'cbt' | 'gratitude' | 'breathing';
}

export type EmotionalState = 'anxious' | 'sad' | 'stressed' | 'happy' | 'neutral' | 'angry';

export interface FeedbackRating {
  score: number;
  comment?: string;
}
