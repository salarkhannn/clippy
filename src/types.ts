
// types.ts

export enum Command {
  AnalyzeScreen = "analyze_screen",
  OpenChat = "open_chat",
}

export enum MessageType {
  // From Background to Content Script
  TOGGLE_CHAT_UI = "TOGGLE_CHAT_UI",
  SHOW_ANALYSIS_BUBBLE = "SHOW_ANALYSIS_BUBBLE",
  SHOW_MCQ_RESULT = "SHOW_MCQ_RESULT",

  // From Content Script to Background
  SEND_CHAT_MESSAGE = "SEND_CHAT_MESSAGE",
  ANALYZE_SCREENSHOT = "ANALYZE_SCREENSHOT"
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}
