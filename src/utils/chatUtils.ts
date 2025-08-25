
import { ChatMessage, EmotionalState, TherapeuticResponse } from "../types/chat";

// Function to generate a unique ID for messages
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

// Enhanced function to detect emotional state from user input
export const detectEmotionalState = (input: string): EmotionalState => {
  const text = input.toLowerCase();

  // Handle explicit negations like "not happy", "unhappy"
  if (/(not\s+happy|unhappy)/.test(text)) return 'sad';

  const dict: Record<EmotionalState, RegExp[]> = {
    anxious: [
      /anxious|anxiety|panic( attack)?|nervous|worry|worried|fear|scared|afraid|heart racing|overthinking|jitters?/
    ],
    sad: [
      /sad|depress(ed|ion)?|unhappy|down|blue|hopeless|lonely|grief|grieving|tearful|cry(ing)?|empty|worthless|numb/
    ],
    stressed: [
      /stress(ed)?|overwhelm(ed|ing)?|too much|pressure|burn(out|ed)?|exhaust(ed|ion)|tired|drained|swamped|behind/
    ],
    happy: [
      /happy|good|great|joy|joyful|excited|positive|wonderful|pleased|content|grateful/
    ],
    angry: [
      /angry|mad|upset|frustrat(ed|ing)?|annoyed|rage|irritated|furious|pissed/
    ],
    neutral: [/.^/]
  };

  // Score emotions by keyword hits
  const scores: Record<EmotionalState, number> = {
    anxious: 0, sad: 0, stressed: 0, happy: 0, neutral: 0, angry: 0
  };

  (Object.keys(dict) as EmotionalState[]).forEach((emotion) => {
    dict[emotion].forEach((re) => {
      const matches = text.match(new RegExp(re, 'g'));
      if (matches) scores[emotion] += matches.length;
    });
  });

  // Downweight happy when mixed with distress
  if (scores.happy > 0 && (scores.sad > 0 || scores.stressed > 0 || /\b(but|however|although)\b/.test(text))) {
    scores.happy = Math.max(0, scores.happy - 1);
  }

  let best: EmotionalState = 'neutral';
  let bestScore = 0;
  (Object.keys(scores) as EmotionalState[]).forEach((emotion) => {
    if (scores[emotion] > bestScore) {
      best = emotion;
      bestScore = scores[emotion];
    }
  });

  return bestScore > 0 ? best : 'neutral';
};

// Simple key phrase extraction to ground responses in user's words
export const extractKeyPhrases = (input: string, max = 3): string[] => {
  const stopWords = new Set([
    'i','im','i\'m','am','is','are','the','a','an','and','or','but','if','then','so','to','of','in','on','for','with','about','it','this','that','was','were','be','been','feeling','feel','feels','very','really','just','like','today','now','my','me','you','your','we','our'
  ]);
  const tokens = input
    .toLowerCase()
    .replace(/[^a-z0-9\s']/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  const words = tokens.filter(w => !stopWords.has(w));

  const bigrams: string[] = [];
  for (let i = 0; i < tokens.length - 1; i++) {
    if (!stopWords.has(tokens[i]) && !stopWords.has(tokens[i+1])) {
      bigrams.push(`${tokens[i]} ${tokens[i+1]}`);
    }
  }

  const counts = new Map<string, number>();
  [...words, ...bigrams].forEach(term => counts.set(term, (counts.get(term) || 0) + 1));

  const boost = ['panic attack','can\'t sleep','not sleeping','lost job','break up','heart racing','overthinking','feel alone','no energy'];
  boost.forEach(term => {
    if (counts.has(term)) counts.set(term, (counts.get(term) || 0) + 2);
  });

  return [...counts.entries()]
    .sort((a,b) => b[1] - a[1] || b[0].length - a[0].length)
    .slice(0, max)
    .map(([t]) => t);
};

// Enhanced therapeutic responses based on emotional state
const therapeuticResponses: Record<EmotionalState, TherapeuticResponse[]> = {
  anxious: [
    { 
      text: "I notice you're feeling anxious. Let's try a quick breathing exercise: Inhale through your nose for 4 counts, hold for 2, then exhale slowly through your mouth for 6. Would you like to try this together?",
      type: 'breathing',
      exercisePrompt: "Would you like to try a guided breathing exercise to help reduce your anxiety?"
    },
    {
      text: "Anxiety often pulls us into worrying about the future. Let's ground ourselves in the present moment. Can you tell me 3 things you can see right now, 2 things you can hear, and 1 thing you can feel?",
      type: 'mindfulness',
      exercisePrompt: "Would you like to try a quick grounding exercise?"
    },
    {
      text: "When anxiety takes over, our thoughts can become overwhelming. Let's identify what specific worry is most present for you right now. Once we name it, we can start to address it together.",
      type: 'cbt',
      exercisePrompt: "Would you like to work through a thought challenging exercise for your anxiety?"
    }
  ],
  sad: [
    {
      text: "I hear that you're feeling down right now. Remember that emotions come and go like waves – they may feel intense, but they will eventually pass. What self-care activity might bring you a moment of comfort today?",
      type: 'general',
      exercisePrompt: "Would you like to create a quick self-care plan for when you're feeling low?"
    },
    {
      text: "When sadness is present, it can be helpful to recall small positive moments. Even in difficult times, can you think of one tiny thing from today or yesterday that brought you even a second of peace or joy?",
      type: 'gratitude',
      exercisePrompt: "Would you like to try a brief gratitude practice to help shift your perspective?"
    },
    {
      text: "Sadness can make us want to isolate, but connection often helps. Is there someone supportive you could reach out to today, even for just a brief text or call? Sometimes sharing our feelings lightens their weight.",
      type: 'general',
      exercisePrompt: "Would you like to brainstorm gentle ways to connect with others when you're feeling sad?"
    }
  ],
  stressed: [
    {
      text: "I can tell you're carrying a lot of stress right now. Let's take a pause together. Starting from your toes and moving upward, can you notice where your body is holding tension and gently invite those areas to relax?",
      type: 'mindfulness',
      exercisePrompt: "Would you like to try a progressive muscle relaxation exercise to help release tension?"
    },
    {
      text: "When we're overwhelmed, breaking things down helps. What's one small, manageable task you could focus on today? Sometimes completing just one thing can help us feel more in control.",
      type: 'cbt',
      exercisePrompt: "Would you like to work on prioritizing your tasks to make them more manageable?"
    },
    {
      text: "It sounds like you're carrying a heavy load right now. Remember that setting boundaries is an act of self-care. Is there something you can postpone or delegate to create some breathing room for yourself?",
      type: 'general',
      exercisePrompt: "Would you like to explore some boundary-setting techniques to reduce your stress?"
    }
  ],
  happy: [
    {
      text: "It's wonderful to hear you're feeling good! Taking time to fully experience positive emotions can actually extend their benefits. Can you describe what specifically is bringing you joy right now?",
      type: 'gratitude',
      exercisePrompt: "Would you like to create a 'joy inventory' to reference when times get tough?"
    },
    {
      text: "Happy moments are worth savoring. Consider taking a mental photograph of this feeling – notice the sensations in your body, your thoughts, and what's happening around you. This practice helps encode positive experiences more deeply in memory.",
      type: 'general',
      exercisePrompt: "Would you like to try a savoring exercise to enhance this positive moment?"
    },
    {
      text: "Your positive state is like a resource you're building up. Is there a way you might channel some of this good energy – perhaps toward a goal you've been working on, or sharing it with someone else who could use a lift?",
      type: 'general',
      exercisePrompt: "Would you like to explore ways to build on this positive momentum?"
    }
  ],
  neutral: [
    {
      text: "How have you been taking care of yourself lately? Even small acts of self-care can have a significant impact on our overall wellbeing. What's one small thing you could do for yourself today?",
      type: 'general',
      exercisePrompt: "Would you like to develop a personalized self-care routine?"
    },
    {
      text: "Checking in with ourselves regularly helps us understand our needs better. On a scale of 1-10, how would you rate your overall wellbeing today? What might help move that number up by just one point?",
      type: 'general',
      exercisePrompt: "Would you like to track your mood patterns to gain insights into what affects your wellbeing?"
    },
    {
      text: "Taking a moment for gratitude can shift our perspective. What are three simple things, no matter how small, that you appreciate in your life right now?",
      type: 'gratitude',
      exercisePrompt: "Would you like to start a regular gratitude practice to boost your mood?"
    }
  ],
  angry: [
    {
      text: "I can hear the frustration in your words. Anger is often a signal that something important to us has been threatened or violated. Would you like to explore what might be beneath this feeling?",
      type: 'general',
      exercisePrompt: "Would you like to try an exercise to safely process and release your anger?"
    },
    {
      text: "When we're angry, our bodies respond physically. Try this: unclench your jaw, drop your shoulders, and take a few slow, deep breaths. Physical relaxation can help create space between you and the intense emotion.",
      type: 'breathing',
      exercisePrompt: "Would you like to try a quick physical technique to help diffuse some of the anger sensations?"
    },
    {
      text: "Sometimes anger comes from unmet expectations or needs. If you feel comfortable, could you share what you were hoping would happen or what need wasn't being met in this situation?",
      type: 'cbt',
      exercisePrompt: "Would you like to work through an exercise to identify the needs behind your anger?"
    }
  ]
};

// Function to generate therapeutic response based on emotional state
export const generateTherapeuticResponse = (
  emotionalState: EmotionalState,
  previousMessages: ChatMessage[] = [],
  userInput?: string
): TherapeuticResponse => {
  const responses = therapeuticResponses[emotionalState];

  // Track conversation context to avoid repetitive responses
  const recentResponseTypes = previousMessages
    .filter(msg => msg.type === 'bot')
    .slice(-3)
    .map(msg => msg.responseType || 'general');

  // Bias response type based on user input keywords
  let preferredType: TherapeuticResponse['type'] | undefined;
  if (userInput) {
    const lower = userInput.toLowerCase();
    if (/(panic( attack)?|breath|breathing|heart racing|hyperventilat)/.test(lower)) preferredType = 'breathing';
    else if (/(overwhelm|focus|ruminat|thought|worry|catastroph|spiral|negative thoughts)/.test(lower)) preferredType = 'cbt';
    else if (/(sleep|insomnia|tension|body|ground|present|mindful|scan|relax)/.test(lower)) preferredType = 'mindfulness';
    else if (/(grateful|gratitude|happy|joy|good|excited|proud|content)/.test(lower)) preferredType = 'gratitude';
  }

  let responsePool = responses;

  if (preferredType) {
    const preferred = responses.filter(r => r.type === preferredType && !recentResponseTypes.includes(r.type || 'general'));
    if (preferred.length) responsePool = preferred;
  }

  // Try to avoid repeating the same response type
  const nonRepeated = responsePool.filter(response => !recentResponseTypes.includes(response.type || 'general'));
  responsePool = nonRepeated.length > 0 ? nonRepeated : responsePool;

  return responsePool[Math.floor(Math.random() * responsePool.length)];
};

// Initial greeting message
export const getInitialMessage = (): ChatMessage => {
  return {
    id: generateId(),
    type: 'bot',
    text: "Hi, I'm your AI therapist. I'm here to listen and provide support. How are you feeling today?",
    timestamp: new Date(),
    responseType: 'greeting'
  };
};

// Enhanced response generator with conversation context
export const generateResponse = (userInput: string, previousMessages: ChatMessage[] = []): ChatMessage => {
  const emotionalState = detectEmotionalState(userInput);
  const response = generateTherapeuticResponse(emotionalState, previousMessages, userInput);

  // Build empathetic prefix with key phrases
  const keys = extractKeyPhrases(userInput);
  const topic = keys.length ? ` about ${keys.join(', ')}` : '';
  const toneMap: Record<EmotionalState, string> = {
    anxious: "I hear how anxious you're feeling",
    sad: "I'm really sorry you're going through this",
    stressed: "It sounds like you're feeling overwhelmed",
    angry: "I can sense the frustration you're experiencing",
    happy: "I'm glad to hear the positive feelings",
    neutral: "Thank you for sharing how you're feeling",
  };

  // Detect change in emotional state from previous user message
  const lastUser = [...previousMessages].reverse().find(m => m.type === 'user');
  const prevState = lastUser ? detectEmotionalState(lastUser.text) : undefined;
  let changeNote = '';
  if (prevState && prevState !== emotionalState) {
    if ((prevState === 'sad' || prevState === 'anxious' || prevState === 'stressed' || prevState === 'angry') && (emotionalState === 'happy' || emotionalState === 'neutral')) {
      changeNote = " It's encouraging to hear that shift.";
    } else if ((prevState === 'happy' || prevState === 'neutral') && (emotionalState === 'sad' || emotionalState === 'anxious' || emotionalState === 'stressed' || emotionalState === 'angry')) {
      changeNote = " I'm here with you as this feels harder right now.";
    }
  }

  const personalizedText = `${toneMap[emotionalState]}${topic}.${changeNote} ${response.text}`;

  return {
    id: generateId(),
    type: 'bot',
    text: personalizedText,
    timestamp: new Date(),
    responseType: response.type,
    exercisePrompt: response.exercisePrompt,
  };
};

// Function to extract user's name from conversation (if mentioned)
export const extractUserName = (messages: ChatMessage[]): string | null => {
  const namePatterns = [
    /my name is (\w+)/i,
    /i am (\w+)/i,
    /i'm (\w+)/i,
    /call me (\w+)/i
  ];
  
  for (const message of messages.filter(m => m.type === 'user')) {
    for (const pattern of namePatterns) {
      const match = message.text.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
  }
  
  return null;
};
