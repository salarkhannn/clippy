// constants.ts

// --- API Configuration ---
// IMPORTANT: Replace these placeholders with your actual configuration.
// FIX: Removed hardcoded API key. The API key should be sourced from process.env.API_KEY in geminiService.ts.
export const GEMINI_API_ENDPOINT_URL = "https://generativelanguage.googleapis.com"; // Example, not used by SDK directly

// --- Model Configuration ---
export const SCREEN_ANALYSIS_MODEL = "gemini-2.5-flash"; // A model capable of understanding images
export const CHAT_MODEL = "gemini-2.5-flash"; // A model for conversational chat

export const PROMPT_TEMPLATE = `
Analyze the content of this screenshot. Based on the text and layout, please provide:
1.  A brief summary of what is visible on the page.
2.  What the user's likely goal or intention is.
3.  A few insightful questions the user might have about the content.

Format your response as clean, readable text.
`;

export const MCQ_PROMPT_TEMPLATE = `
Analyze this full screenshot. Look for multiple choice questions (MCQs). Only answer MCQs where you can see the complete question text AND all answer options (A, B, C, D, etc.) fully within the screen boundaries - not cut off at edges. If you find exactly one complete MCQ, respond with ONLY the correct letter. If there are multiple complete MCQs, respond with "MULTIPLE". If no complete MCQs are visible or if any question/options are cut off at screen edges, respond with "NO".
`;
