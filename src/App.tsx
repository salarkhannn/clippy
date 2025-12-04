// FIX: Add chrome types reference to resolve errors where the 'chrome' namespace was not found.
/// <reference types="chrome" />

// App.tsx
import React, { useState, useEffect, useCallback } from 'react';
import FloatingBubble from './components/FloatingBubble';
import ChatOverlay from './components/ChatOverlay';
import MCQResult from './components/MCQResult';
import FloatingActionButton from './components/FloatingActionButton';
import { ThemeProvider } from './context/ThemeContext';
import { MessageType } from './types';

function AppContent() {
  const [isChatVisible, setChatVisible] = useState(false);
  const [showFAB, setShowFAB] = useState(true);
  const [bubbleContent, setBubbleContent] = useState<{ status: 'loading' | 'success' | 'error'; text: string } | null>(null);
  const [mcqResult, setMcqResult] = useState<{ status: 'loading' | 'success' | 'error'; text?: string } | null>(null);

  const handleMessage = useCallback((request: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
    console.log("Message received in content script:", request);
    switch (request.type) {
      case 'ping':
        sendResponse({ status: "ok" });
        break;
      case MessageType.TOGGLE_CHAT_UI:
        console.log("Toggling chat UI");
        setChatVisible(prev => !prev);
        break;
      case MessageType.SHOW_ANALYSIS_BUBBLE:
        console.log("Showing analysis bubble:", request.payload);
        setBubbleContent(request.payload);
        setTimeout(() => {
          setBubbleContent(null);
        }, 15000);
        break;
      case MessageType.SHOW_MCQ_RESULT:
        console.log("Showing MCQ result:", request.payload);
        setMcqResult(request.payload);
        if (request.payload.status === 'success' || request.payload.status === 'error') {
          setTimeout(() => {
            setMcqResult(null);
          }, 5000);
        }
        break;
    }
    sendResponse({ status: "ok" });
    return true;
  }, []);
  
  useEffect(() => {
    chrome.runtime.onMessage.addListener(handleMessage);
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, [handleMessage]);

  const handleFABClick = () => {
    setChatVisible(true);
    setShowFAB(false);
  };

  const handleCloseChat = () => {
    setChatVisible(false);
    setShowFAB(true);
  };

  return (
    <>
      {bubbleContent && (
        <FloatingBubble
          status={bubbleContent.status}
          text={bubbleContent.text}
          onClose={() => setBubbleContent(null)}
        />
      )}
      {mcqResult && (
        <MCQResult
          status={mcqResult.status}
          text={mcqResult.text}
          onClose={() => setMcqResult(null)}
        />
      )}
      {showFAB && !isChatVisible && !bubbleContent && !mcqResult && (
        <FloatingActionButton onClick={handleFABClick} />
      )}
      {isChatVisible && <ChatOverlay onClose={handleCloseChat} />}
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <div className="font-sans">
        <AppContent />
      </div>
    </ThemeProvider>
  );
}
