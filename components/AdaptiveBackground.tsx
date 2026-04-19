import React from 'react';
import { EmotionType } from '../types';
import { EMOTION_THEMES, DEFAULT_THEME } from '../constants';

interface AdaptiveBackgroundProps {
  emotion: EmotionType | null;
  children: React.ReactNode;
}

const AdaptiveBackground: React.FC<AdaptiveBackgroundProps> = ({ emotion, children }) => {
  const theme = emotion ? EMOTION_THEMES[emotion] : DEFAULT_THEME;

  return (
    <div className={`min-h-screen w-full transition-all duration-1000 ease-in-out ${theme.gradient} ${theme.textColor} ${theme.fontFamily} relative overflow-hidden`}>
      
      {/* Dynamic Ambient Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {theme.animationType === 'pulse' && (
          <>
            <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-black/5 rounded-full mix-blend-overlay filter blur-3xl animate-pulse-slow delay-1000"></div>
          </>
        )}
        
        {theme.animationType === 'float' && (
           <>
            <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-white/20 rounded-full mix-blend-overlay blur-xl animate-float"></div>
            <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-yellow-300/10 rounded-full mix-blend-overlay blur-xl animate-float delay-1000"></div>
            <div className="absolute top-20 right-20 w-20 h-20 bg-white/10 rounded-full mix-blend-overlay blur-lg animate-float delay-500"></div>
           </>
        )}

        {theme.animationType === 'wave' && (
           <>
            <div className="absolute -bottom-20 left-0 w-full h-64 bg-gradient-to-t from-white/10 to-transparent transform skew-y-3 opacity-50"></div>
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent"></div>
           </>
        )}
        
        {/* Sadness/Rainy Effect (Simple CSS particles) */}
        {emotion === EmotionType.SAD && (
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-10"></div>
        )}
      </div>

      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};

export default AdaptiveBackground;
