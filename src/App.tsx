// FIX: Add chrome types reference to resolve errors where the 'chrome' namespace was not found.
/// <reference types="chrome" />

// App.tsx
import React, { useState, useEffect, useCallback } from 'react';
import FloatingBubble from './components/FloatingBubble';
import ChatOverlay from './components/ChatOverlay';
import { MessageType } from './types';

export default function App() {
  const [isChatVisible, setChatVisible] = useState(false);
  // FIX: Corrected the type for bubbleContent.status to be a specific union type, resolving a type error on FloatingBubble component.
  const [bubbleContent, setBubbleContent] = useState<{ status: 'loading' | 'success' | 'error'; text: string } | null>(null);

  const handleMessage = useCallback((request: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
    console.log("Message received in content script:", request);
    switch (request.type) {
      case 'ping':
        // Respond to ping to confirm content script is loaded
        sendResponse({ status: "ok" });
        break;
      case MessageType.TOGGLE_CHAT_UI:
        setChatVisible(prev => !prev);
        break;
      case MessageType.SHOW_ANALYSIS_BUBBLE:
        setBubbleContent(request.payload);
        // Automatically hide the bubble after some time
        setTimeout(() => {
          setBubbleContent(null);
        }, 15000); // 15 seconds
        break;
    }
    // To acknowledge receipt
    sendResponse({ status: "ok" });
    return true; // Keep the message channel open for async responses
  }, []);
  
  useEffect(() => {
    chrome.runtime.onMessage.addListener(handleMessage);
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, [handleMessage]);

  return (
    <div className="font-sans">
      {bubbleContent && (
        <FloatingBubble
          status={bubbleContent.status}
          text={bubbleContent.text}
          onClose={() => setBubbleContent(null)}
        />
      )}
      {isChatVisible && <ChatOverlay onClose={() => setChatVisible(false)} />}
    </div>
  );
}
