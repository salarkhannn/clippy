// FIX: Add chrome types reference to resolve errors where the 'chrome' namespace was not found.
/// <reference types="chrome" />

// components/ChatOverlay.tsx
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, MessageType } from '../types';
import { CloseIcon, SendIcon, LoadingSpinner, SparklesIcon, PlusIcon } from './Icons';
import { THEME } from '../constants';

interface ChatOverlayProps {
  onClose: () => void;
}

const ChatOverlay: React.FC<ChatOverlayProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [pendingScreenshot, setPendingScreenshot] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowAttachMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleCaptureScreen = async () => {
    setShowAttachMenu(false);
    try {
      const response = await chrome.runtime.sendMessage({
        type: MessageType.CAPTURE_SCREENSHOT
      });
      
      if (response.status === 'success' && response.dataUrl) {
        setPendingScreenshot(response.dataUrl);
      } else {
        console.error("Failed to capture screen:", response.text);
      }
    } catch (error) {
      console.error("Error capturing screen:", error);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !pendingScreenshot) || isLoading) return;

    const userMessage: ChatMessage = { 
      id: Date.now().toString(), 
      role: 'user', 
      text: input,
      image: pendingScreenshot || undefined
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setPendingScreenshot(null);
    setIsLoading(true);

    try {
        const response = await chrome.runtime.sendMessage({
            type: MessageType.SEND_CHAT_MESSAGE,
            payload: { messages: [...messages, userMessage] }
        });

        if (response.status === 'success') {
            const modelMessage: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: response.text };
            setMessages(prev => [...prev, modelMessage]);
        } else {
            const errorMessage: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: `Error: ${response.text}` };
            setMessages(prev => [...prev, errorMessage]);
        }
    } catch (error) {
        const errorMessage: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: `An unexpected error occurred.` };
        setMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div 
        className="fixed inset-0 z-[2147483646] flex items-end justify-end p-4 pointer-events-none"
    >
      <div 
        className="w-[25vw] h-[35vh] flex flex-col rounded-2xl shadow-2xl border border-dashed overflow-hidden pointer-events-auto"
        style={{
            borderColor: THEME.borderColor,
            backdropFilter: `blur(${THEME.overlayBackdropBlur})`
        }}
      >
        <header className="flex items-center justify-between p-4 border-b" style={{ borderColor: THEME.borderColor }}>
          <div className="flex items-center gap-2">
            <h1 className="text-md font-bold text-neutral-100">Clippy</h1>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white transition-colors">
            <CloseIcon className="w-6 h-6 cursor-pointer" />
          </button>
        </header>
        
        <main className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-lg ${msg.role === 'user' ? 'bg-violet-600 text-white' : 'bg-neutral-700 text-neutral-200'}`}>
                {msg.image && (
                  <img src={msg.image} alt="Screenshot" className="max-w-full rounded mb-2 border border-white/20" />
                )}
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] p-3 rounded-lg bg-neutral-700 text-neutral-200 flex items-center gap-2">
                <LoadingSpinner className="w-4 h-4" />
                <span>Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </main>
        
        <footer className="p-4 border-t border-dashed relative" style={{ borderColor: THEME.borderColor }}>
          {pendingScreenshot && (
            <div className="absolute bottom-full left-4 mb-2 p-2 bg-neutral-800 rounded-lg border border-neutral-600 shadow-lg flex items-start gap-2">
              <img src={pendingScreenshot} alt="Thumbnail" className="h-16 w-auto rounded border border-neutral-500" />
              <button 
                onClick={() => setPendingScreenshot(null)}
                className="text-neutral-400 hover:text-white bg-neutral-700 rounded-full p-0.5"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>
          )}

          <form onSubmit={handleSend} className="flex items-center gap-2">
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                className="text-neutral-400 hover:text-white p-2 rounded-lg transition-colors"
              >
                <PlusIcon className="w-6 h-6" />
              </button>
              
              {showAttachMenu && (
                <div className="absolute bottom-full left-0 mb-2 w-40 bg-neutral-800 border border-neutral-600 rounded-lg shadow-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={handleCaptureScreen}
                    className="w-full text-left px-4 py-2 text-sm text-neutral-200 hover:bg-neutral-700 transition-colors"
                  >
                    Add Screen
                  </button>
                </div>
              )}
            </div>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-neutral-800 border border-neutral-600 text-neutral-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || (!input.trim() && !pendingScreenshot)}
              className="bg-violet-600 text-white p-2 rounded-lg hover:bg-violet-700 disabled:bg-neutral-600 disabled:cursor-not-allowed transition-colors"
            >
              <SendIcon className="w-5 h-5" />
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
};

export default ChatOverlay;
