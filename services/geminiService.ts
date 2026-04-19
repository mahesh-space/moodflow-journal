import { GoogleGenAI, Type } from "@google/genai";
import { EmotionAnalysis, EmotionType } from "../types";

// Note: In a real production app, never expose keys in client code. 
// This should be proxied through a backend.
const API_KEY = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey: API_KEY });

const modelName = 'gemini-3-flash-preview';

export const analyzeEmotion = async (text: string): Promise<EmotionAnalysis> => {
  if (!API_KEY) {
    throw new Error("Missing Gemini API Key in environment variables.");
  }
  
  if (text.length < 10) {
     // Default fallback for very short text
     return {
        primary_emotion: EmotionType.NEUTRAL,
        emotion_intensity: 1,
        sentiment_score: 0,
        secondary_emotions: [],
        themes: [],
        summary: "Entry too short to analyze."
     };
  }

  const prompt = `
  Analyze the emotional content of this journal entry.
  
  Journal Entry:
  """
  ${text}
  """
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            primary_emotion: {
              type: Type.STRING,
              enum: Object.values(EmotionType),
              description: "The dominant emotion detected in the text."
            },
            emotion_intensity: {
              type: Type.NUMBER,
              description: "Intensity of the emotion from 1 to 10."
            },
            sentiment_score: {
              type: Type.NUMBER,
              description: "Sentiment score from -1 (negative) to 1 (positive)."
            },
            secondary_emotions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Up to 3 secondary emotions detected."
            },
            themes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2-4 key emotional themes or topics."
            },
            summary: {
              type: Type.STRING,
              description: "A brief 1-2 sentence summary of the emotional state."
            }
          },
          required: ["primary_emotion", "emotion_intensity", "sentiment_score", "secondary_emotions", "themes", "summary"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}') as EmotionAnalysis;
    return result;

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    // Return neutral fallback on error
    return {
      primary_emotion: EmotionType.NEUTRAL,
      emotion_intensity: 5,
      sentiment_score: 0,
      secondary_emotions: [],
      themes: ["Error in analysis"],
      summary: "Could not analyze emotion due to an error."
    };
  }
};
