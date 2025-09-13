
import { GoogleGenAI, Type } from "@google/genai";
import { PainPoint, BusinessIdea } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const responseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      name: {
        type: Type.STRING,
        description: "A catchy and short name for the business idea.",
      },
      concept: {
        type: Type.STRING,
        description: "A one or two-sentence summary of the business concept.",
      },
      targetAudience: {
        type: Type.STRING,
        description: "The specific group of people this business would serve.",
      },
    },
    required: ["name", "concept", "targetAudience"],
  },
};

export const generateBusinessIdeas = async (painPoints: PainPoint[]): Promise<BusinessIdea[]> => {
  if (!process.env.API_KEY) {
    throw new Error("API key for Gemini is not configured.");
  }
    
  if (painPoints.length === 0) {
    return [];
  }

  const painPointNames = painPoints.map(p => p.name).join(', ');
  const prompt = `
    Based on the following widespread human pain points, generate 5 distinct and innovative business ideas.
    The pain points are: ${painPointNames}.

    For each idea, provide a catchy name, a one-sentence concept explaining how it solves the pain point, and a clear target audience.
    Focus on simple, launchable concepts inspired by the principle of solving a giant pain point effectively, rather than building complex features.
    The goal is to find ideas with massive market potential like procrastination, weight loss, or financial stress.

    Your response must be a JSON array of objects, conforming to the provided schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.8,
        topP: 0.9,
      },
    });

    const responseText = response.text.trim();
    if (!responseText) {
        throw new Error("Received an empty response from the API.");
    }
    
    const ideas: BusinessIdea[] = JSON.parse(responseText);
    return ideas;
  } catch (error) {
    console.error("Error generating business ideas:", error);
    if (error instanceof SyntaxError) {
      throw new Error("Failed to parse the API response. The format might be invalid.");
    }
    throw new Error("An unexpected error occurred while communicating with the Gemini API.");
  }
};
