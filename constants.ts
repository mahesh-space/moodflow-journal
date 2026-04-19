import { EmotionType, ThemeConfig } from './types';
import { 
  CloudRain, Wind, Zap, Sun, Smile, 
  Flame, ShieldAlert, Meh, Rocket, Coffee 
} from 'lucide-react';

export const EMOTION_THEMES: Record<EmotionType, ThemeConfig> = {
  [EmotionType.SAD]: {
    gradient: 'bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900',
    textColor: 'text-blue-100',
    accentColor: 'bg-blue-800',
    fontFamily: 'font-serif',
    animationType: 'none',
    iconName: 'CloudRain'
  },
  [EmotionType.CALM]: {
    gradient: 'bg-gradient-to-br from-teal-50 via-emerald-100 to-teal-50',
    textColor: 'text-teal-900',
    accentColor: 'bg-emerald-200',
    fontFamily: 'font-sans tracking-wide',
    animationType: 'wave',
    iconName: 'Wind'
  },
  [EmotionType.PEACEFUL]: {
    gradient: 'bg-gradient-to-br from-green-50 via-teal-100 to-emerald-50',
    textColor: 'text-emerald-900',
    accentColor: 'bg-teal-200',
    fontFamily: 'font-sans tracking-wide',
    animationType: 'wave',
    iconName: 'Coffee'
  },
  [EmotionType.ANXIOUS]: {
    gradient: 'bg-gradient-to-br from-orange-50 via-red-50 to-orange-100',
    textColor: 'text-orange-900',
    accentColor: 'bg-orange-200',
    fontFamily: 'font-sans tracking-tight',
    animationType: 'pulse',
    iconName: 'Zap'
  },
  [EmotionType.HOPEFUL]: {
    gradient: 'bg-gradient-to-br from-yellow-50 via-amber-100 to-orange-50',
    textColor: 'text-amber-900',
    accentColor: 'bg-yellow-200',
    fontFamily: 'font-rounded',
    animationType: 'float',
    iconName: 'Sun'
  },
  [EmotionType.JOYFUL]: {
    gradient: 'bg-gradient-to-br from-yellow-100 via-amber-200 to-yellow-100',
    textColor: 'text-yellow-950',
    accentColor: 'bg-yellow-400',
    fontFamily: 'font-rounded text-lg',
    animationType: 'float',
    iconName: 'Smile'
  },
  [EmotionType.EXCITED]: {
    gradient: 'bg-gradient-to-br from-fuchsia-100 via-purple-100 to-pink-100',
    textColor: 'text-fuchsia-900',
    accentColor: 'bg-fuchsia-300',
    fontFamily: 'font-rounded',
    animationType: 'float',
    iconName: 'Rocket'
  },
  [EmotionType.ANGRY]: {
    gradient: 'bg-gradient-to-br from-red-100 via-red-200 to-rose-100',
    textColor: 'text-red-950',
    accentColor: 'bg-red-400',
    fontFamily: 'font-sans font-bold',
    animationType: 'pulse',
    iconName: 'Flame'
  },
  [EmotionType.FEARFUL]: {
    gradient: 'bg-gradient-to-br from-indigo-900 via-violet-900 to-slate-900',
    textColor: 'text-indigo-100',
    accentColor: 'bg-indigo-700',
    fontFamily: 'font-sans',
    animationType: 'pulse',
    iconName: 'ShieldAlert'
  },
  [EmotionType.NEUTRAL]: {
    gradient: 'bg-gradient-to-br from-gray-50 via-gray-100 to-slate-50',
    textColor: 'text-gray-800',
    accentColor: 'bg-gray-200',
    fontFamily: 'font-sans',
    animationType: 'none',
    iconName: 'Meh'
  }
};

export const DEFAULT_THEME = EMOTION_THEMES[EmotionType.NEUTRAL];

export const ICON_MAP = {
  CloudRain, Wind, Zap, Sun, Smile, Flame, ShieldAlert, Meh, Rocket, Coffee
};
