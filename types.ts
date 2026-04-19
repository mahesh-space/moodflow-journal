export enum EmotionType {
  SAD = 'sad',
  CALM = 'calm',
  ANXIOUS = 'anxious',
  HOPEFUL = 'hopeful',
  JOYFUL = 'joyful',
  ANGRY = 'angry',
  FEARFUL = 'fearful',
  NEUTRAL = 'neutral',
  EXCITED = 'excited',
  PEACEFUL = 'peaceful'
}

export interface EmotionAnalysis {
  primary_emotion: EmotionType;
  emotion_intensity: number; // 1-10
  sentiment_score: number; // -1 to 1
  secondary_emotions: string[];
  themes: string[];
  summary: string;
}

export interface JournalEntry {
  id: string;
  text: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  analysis: EmotionAnalysis | null;
}

export interface ThemeConfig {
  gradient: string;
  textColor: string;
  accentColor: string;
  fontFamily: string;
  animationType: 'pulse' | 'wave' | 'float' | 'none';
  iconName: string;
}
