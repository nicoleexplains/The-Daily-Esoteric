import { GoogleGenAI, Type, Schema } from "@google/genai";
import { EsotericWisdom } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const WISDOM_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    quote: {
      type: Type.STRING,
      description: "The actual quote or aphorism.",
    },
    source: {
      type: Type.STRING,
      description: "The author, text, or tradition (e.g., 'The Kybalion', 'Carl Jung', 'Hermetic Tradition').",
    },
    topic: {
      type: Type.STRING,
      description: "The general esoteric category (e.g., Alchemy, Astrology, Tarot, Kabbalah, Gnosticism).",
    },
    briefInterpretation: {
      type: Type.STRING,
      description: "A 1-2 sentence modern interpretation of the quote.",
    },
  },
  required: ["quote", "source", "topic", "briefInterpretation"],
};

export const fetchDailyWisdom = async (): Promise<EsotericWisdom> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate a profound esoteric, occult, or mystical wisdom entry for today. Focus on traditions like Alchemy, Hermeticism, Gnosticism, or Jungian Psychology. Avoid dark or negative magic; focus on enlightenment, transformation, and inner knowledge. Provide a Quote, Source, Topic, and a very brief Interpretation.",
      config: {
        responseMimeType: "application/json",
        responseSchema: WISDOM_SCHEMA,
        temperature: 1, 
      },
    });

    const text = response.text;
    if (!text) throw new Error("No text returned from Gemini");

    return JSON.parse(text) as EsotericWisdom;
  } catch (error) {
    console.error("Error fetching daily wisdom:", error);
    throw new Error("Failed to consult the oracle.");
  }
};

export const fetchExplanation = async (wisdom: EsotericWisdom): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are 'Nicole', a friendly but knowledgeable guide to the esoteric. Explain this concept in depth for a modern blog audience. 
      
      Quote: "${wisdom.quote}"
      Source: ${wisdom.source}
      Topic: ${wisdom.topic}
      
      Explain the history, the symbolism, and how it applies to personal growth or modern life today. Keep it engaging, roughly 300 words. Format with Markdown.`,
    });

    return response.text || "The mists obscured the explanation. Please try again.";
  } catch (error) {
    console.error("Error fetching explanation:", error);
    throw new Error("Failed to interpret the signs.");
  }
};

export const generateMysticImage = async (wisdom: EsotericWisdom): Promise<string | null> => {
  try {
    // Using gemini-2.5-flash-image for generation as per instructions
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [
          {
            text: `Create a mystical, symbolic illustration for the concept: "${wisdom.topic} - ${wisdom.quote}". Style: Tarot card, woodcut, gold on black, esoteric symbolism, vintage occult illustration, high contrast. No text in the image.`,
          },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    // Non-blocking error, just return null to show placeholder
    return null;
  }
};