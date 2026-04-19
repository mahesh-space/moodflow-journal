import React from 'react';
import { EmotionAnalysis, EmotionType } from '../types';
import { EMOTION_THEMES, ICON_MAP } from '../constants';

interface EmotionIndicatorProps {
  analysis: EmotionAnalysis;
}

const EmotionIndicator: React.FC<EmotionIndicatorProps> = ({ analysis }) => {
  const theme = EMOTION_THEMES[analysis.primary_emotion];
  const Icon = ICON_MAP[theme.iconName as keyof typeof ICON_MAP] || ICON_MAP.Meh;

  return (
    <div className={`mt-6 p-6 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg transition-all duration-500`}>
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        
        {/* Left: Primary Emotion & Icon */}
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-full ${theme.accentColor} bg-opacity-30 shadow-inner`}>
            <Icon size={32} className={theme.textColor} />
          </div>
          <div>
            <h3 className="text-sm uppercase tracking-widest opacity-70 font-semibold">Detected Mood</h3>
            <p className="text-3xl font-bold capitalize">{analysis.primary_emotion}</p>
          </div>
        </div>

        {/* Center: Intensity & Sentiment */}
        <div className="flex-1 w-full md:w-auto px-4">
          <div className="mb-2 flex justify-between text-xs font-semibold opacity-70">
            <span>INTENSITY ({analysis.emotion_intensity}/10)</span>
            <span>SENTIMENT ({analysis.sentiment_score > 0 ? '+' : ''}{analysis.sentiment_score})</span>
          </div>
          <div className="h-3 w-full bg-black/10 rounded-full overflow-hidden">
            <div 
              className={`h-full ${theme.accentColor} transition-all duration-1000 ease-out`}
              style={{ width: `${analysis.emotion_intensity * 10}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bottom: Summary & Tags */}
      <div className="mt-6 pt-4 border-t border-white/20">
        <p className="text-lg italic opacity-90 mb-4 leading-relaxed">"{analysis.summary}"</p>
        
        <div className="flex flex-wrap gap-2">
          {analysis.secondary_emotions.map((em, i) => (
             <span key={`sec-${i}`} className="px-3 py-1 text-xs rounded-full bg-white/30 backdrop-blur-sm uppercase font-bold tracking-wider">
               {em}
             </span>
          ))}
          {analysis.themes.map((t, i) => (
             <span key={`theme-${i}`} className="px-3 py-1 text-xs rounded-full border border-current opacity-70 uppercase tracking-wider">
               {t}
             </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmotionIndicator;
