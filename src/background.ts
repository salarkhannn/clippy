// FIX: Add chrome types reference to resolve errors where the 'chrome' namespace was not found.
/// <reference types="chrome" />

// background.ts

import { analyzeScreen, getChatResponse } from './services/geminiService';
import { Command, MessageType } from './types';

// Listener for keyboard shortcuts
chrome.commands.onCommand.addListener((command) => {
  console.log(`Command received: ${command}`);
  if (command === Command.AnalyzeScreen) {
    handleAnalyzeScreen();
  } else if (command === Command.OpenChat) {
    sendMessageToActiveTab({ type: MessageType.TOGGLE_CHAT_UI });
  }
});

// Listener for extension icon clicks
chrome.action.onClicked.addListener(() => {
  sendMessageToActiveTab({ type: MessageType.TOGGLE_CHAT_UI });
});

// Listener for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === MessageType.SEND_CHAT_MESSAGE) {
    handleChat(request.payload.messages).then(sendResponse);
    return true; // Indicates async response
  }
  return false;
});

async function handleAnalyzeScreen() {
  try {
    const dataUrl = await chrome.tabs.captureVisibleTab({ format: 'jpeg', quality: 90 });
    sendMessageToActiveTab({ type: MessageType.SHOW_ANALYSIS_BUBBLE, payload: { status: 'loading' } });

    const analysis = await analyzeScreen(dataUrl);

    sendMessageToActiveTab({
      type: MessageType.SHOW_ANALYSIS_BUBBLE,
      payload: { status: 'success', text: analysis },
    });
  } catch (error) {
    console.error("Error analyzing screen:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    sendMessageToActiveTab({
      type: MessageType.SHOW_ANALYSIS_BUBBLE,
      payload: { status: 'error', text: `Error: ${errorMessage}` },
    });
  }
}

async function handleChat(messages: any[]) {
  try {
    const responseText = await getChatResponse(messages);
    return { status: 'success', text: responseText };
  } catch (error) {
    console.error("Error getting chat response:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { status: 'error', text: `Error: ${errorMessage}` };
  }
}

async function sendMessageToActiveTab(message: object) {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];
    
    if (!tab || !tab.id) {
      console.log('No active tab found');
      return;
    }

    // Check if the tab URL is compatible with content scripts
    if (tab.url?.startsWith('chrome://') || tab.url?.startsWith('chrome-extension://') || tab.url?.startsWith('edge://')) {
      console.warn('⚠️ Extension cannot run on browser system pages:', tab.url);
      console.log('💡 Please navigate to a regular website (e.g., google.com) to use this extension');
      return;
    }

    // Try sending the message
    try {
      await chrome.tabs.sendMessage(tab.id, message);
      console.log('✅ Message sent successfully to content script');
    } catch (messageError) {
      console.warn('⚠️ Content script not loaded on this page');
      console.log('💡 Please reload the page (Ctrl+R or F5) and try again');
      console.log('📝 This is normal for pages that were open before the extension was installed/updated');
    }
  } catch (error) {
    console.error('Error in sendMessageToActiveTab:', error);
  }
}