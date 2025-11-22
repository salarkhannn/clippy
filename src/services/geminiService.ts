// services/geminiService.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
// FIX: Removed GEMINI_API_KEY from imports to use environment variable.
import { SCREEN_ANALYSIS_MODEL, CHAT_MODEL, PROMPT_TEMPLATE } from '../constants';
import { ChatMessage } from "../types";

// FIX: Per security guidelines, the API key is now sourced directly from `process.env.API_KEY` instead of a hardcoded constant.
const ai = new GoogleGenerativeAI(process.env.API_KEY || '');

function dataUrlToBlob(dataUrl: string) {
  const parts = dataUrl.split(',');
  const mimeType = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const base64Data = parts[1];
  return {
    inlineData: {
      mimeType,
      data: base64Data,
    },
  };
}

export async function analyzeScreen(screenshotDataUrl: string, prompt?: string): Promise<string> {
  try {
    const imagePart = dataUrlToBlob(screenshotDataUrl);
    const model = ai.getGenerativeModel({ model: SCREEN_ANALYSIS_MODEL });

    const result = await model.generateContent([
      prompt || PROMPT_TEMPLATE,
      imagePart
    ]);
    
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error calling Gemini API for screen analysis:", error);
    throw new Error("Failed to get analysis from Gemini API.");
  }
}

// FIX: Rewrote getChatResponse to use the full chat history for context. This also resolves the 'findLast' method error.
export async function getChatResponse(history: ChatMessage[]): Promise<string> {
  try {
    const model = ai.getGenerativeModel({ model: CHAT_MODEL });
    
    const contents = history.map(message => {
      const parts: any[] = [{ text: message.text }];
      if (message.image) {
        parts.push(dataUrlToBlob(message.image));
      }
      return {
        role: message.role === 'user' ? 'user' : 'model',
        parts: parts,
      };
    });
    
    const result = await model.generateContent({ contents });
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error calling Gemini API for chat:", error);
    throw new Error("Failed to get chat response from Gemini API.");
  }
}
