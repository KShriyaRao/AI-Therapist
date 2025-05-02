
import { ChatMessage, EmotionalState, TherapeuticResponse } from "../types/chat";

// Function to generate a unique ID for messages
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

// Function to detect emotional state from user input (simplified)
export const detectEmotionalState = (input: string): EmotionalState => {
  const lowerInput = input.toLowerCase();
  
  if (lowerInput.includes('anxious') || lowerInput.includes('anxiety') || lowerInput.includes('nervous') || lowerInput.includes('worry')) {
    return 'anxious';
  } else if (lowerInput.includes('sad') || lowerInput.includes('depressed') || lowerInput.includes('unhappy') || lowerInput.includes('down')) {
    return 'sad';
  } else if (lowerInput.includes('stress') || lowerInput.includes('overwhelm') || lowerInput.includes('busy') || lowerInput.includes('too much')) {
    return 'stressed';
  } else if (lowerInput.includes('happy') || lowerInput.includes('good') || lowerInput.includes('great') || lowerInput.includes('joy')) {
    return 'happy';
  } else if (lowerInput.includes('angry') || lowerInput.includes('mad') || lowerInput.includes('upset') || lowerInput.includes('frustrated')) {
    return 'angry';
  }
  
  return 'neutral';
};

// Therapeutic responses based on emotional state
const therapeuticResponses: Record<EmotionalState, TherapeuticResponse[]> = {
  anxious: [
    { 
      text: "I can see you're feeling anxious. Let's focus on some deep breathing to help calm your nervous system. Try breathing in for 4 counts, hold for 2, and exhale for 6.",
      type: 'breathing'
    },
    {
      text: "Anxiety often comes from worrying about the future. Let's bring you back to the present moment. Can you name five things you can see right now?",
      type: 'mindfulness'
    },
    {
      text: "When we're anxious, our thoughts can spiral. Let's try to identify what specific worry is on your mind right now, and see if we can challenge it together.",
      type: 'cbt'
    }
  ],
  sad: [
    {
      text: "I hear that you're feeling sad right now. Remember that emotions, even difficult ones like sadness, are temporary and will pass with time.",
      type: 'general'
    },
    {
      text: "When we're feeling down, it can help to recall positive memories. Could you share something that brought you joy recently, no matter how small?",
      type: 'gratitude'
    },
    {
      text: "Sometimes sadness can make us withdraw. Consider reaching out to someone you trust today - connection often helps lift our spirits.",
      type: 'general'
    }
  ],
  stressed: [
    {
      text: "Stress can feel overwhelming. Let's take a pause and do a quick body scan. Starting from your toes, notice any tension and allow each part of your body to relax.",
      type: 'mindfulness'
    },
    {
      text: "When we're stressed, breaking tasks into smaller steps can help. What's one small action you could take today to reduce your stress load?",
      type: 'cbt'
    },
    {
      text: "It sounds like you have a lot on your plate. Remember that it's okay to set boundaries and say no to additional responsibilities when needed.",
      type: 'general'
    }
  ],
  happy: [
    {
      text: "It's wonderful to hear you're feeling good! Taking time to savor positive emotions can help extend them. What specifically is bringing you joy right now?",
      type: 'gratitude'
    },
    {
      text: "Happiness is worth celebrating. Consider journaling about this positive feeling so you can revisit it during more challenging times.",
      type: 'general'
    },
    {
      text: "Your positive state is valuable. Is there someone in your life who might benefit from connecting with your good energy today?",
      type: 'general'
    }
  ],
  neutral: [
    {
      text: "How have you been taking care of yourself lately? Self-care is important for maintaining our emotional well-being.",
      type: 'general'
    },
    {
      text: "Sometimes checking in with ourselves helps us understand our needs better. On a scale of 1-10, how would you rate your overall well-being today?",
      type: 'general'
    },
    {
      text: "Let's take a moment for gratitude. What are three things, big or small, that you appreciate in your life right now?",
      type: 'gratitude'
    }
  ],
  angry: [
    {
      text: "I can tell you're feeling frustrated. Anger is a natural emotion that often signals our boundaries have been crossed. Would you like to talk about what triggered this feeling?",
      type: 'general'
    },
    {
      text: "When we're angry, our bodies hold tension. Try unclenching your jaw, dropping your shoulders, and taking a few deep breaths.",
      type: 'breathing'
    },
    {
      text: "Sometimes anger comes from unmet expectations. Let's explore: what were you hoping would happen in this situation?",
      type: 'cbt'
    }
  ]
};

// Function to generate therapeutic response based on emotional state
export const generateTherapeuticResponse = (emotionalState: EmotionalState): TherapeuticResponse => {
  const responses = therapeuticResponses[emotionalState];
  return responses[Math.floor(Math.random() * responses.length)];
};

// Initial greeting message
export const getInitialMessage = (): ChatMessage => {
  return {
    id: generateId(),
    type: 'bot',
    text: "Hi, I'm your AI therapist. I'm here to listen and provide support. How are you feeling today?",
    timestamp: new Date()
  };
};

// Function to handle user input and generate response
export const generateResponse = (userInput: string): ChatMessage => {
  const emotionalState = detectEmotionalState(userInput);
  const response = generateTherapeuticResponse(emotionalState);
  
  return {
    id: generateId(),
    type: 'bot',
    text: response.text,
    timestamp: new Date()
  };
};
