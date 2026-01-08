
import { GoogleGenAI, Type } from "@google/genai";
import { CoupleChallenge, RelationshipQuest } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getDailyChallenge = async (): Promise<CoupleChallenge> => {
  const model = 'gemini-3-flash-preview';
  const prompt = "Generate a 'Daily Joy Challenge' specifically for a long-distance romantic couple. It should be a small, virtual task that builds connection despite the distance. Return as JSON with title, description, and category (play, gratitude, or reflection).";

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          category: { type: Type.STRING }
        },
        required: ["title", "description", "category"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const getRelationshipQuests = async (category: string): Promise<RelationshipQuest[]> => {
  const model = 'gemini-3-flash-preview';
  const prompt = `Generate 3 creative activities for a couple in an LDR for the category: ${category}. 
  If the category involves "Meet Up", suggest things to do when they are physically together. 
  Otherwise, focus on high-quality virtual connection. 
  Return as a JSON array of objects with 'title', 'description', 'category', and 'isLdr' (boolean).`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            category: { type: Type.STRING },
            isLdr: { type: Type.BOOLEAN }
          }
        }
      }
    }
  });

  return JSON.parse(response.text || '[]');
};

export const suggestSong = async (vibe: string): Promise<string> => {
  const model = 'gemini-3-flash-preview';
  const prompt = `Suggest a song title and artist that fits the vibe of "missing someone" or "long distance love" for a ${vibe} vibe. Return only "Song Title - Artist".`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt
  });

  return response.text || "Beyond - Leon Bridges";
};
