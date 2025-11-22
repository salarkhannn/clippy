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

// --- UI Theming ---
export const THEME = {
  overlayBackdropBlur: "8px",
  textColor: "#FAFAFA",
  primaryColor: "#9411ffff",
  borderColor: "#rgba(255, 255, 255, 0.1)",
};
