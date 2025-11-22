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
      // Use composedPath to handle Shadow DOM event retargeting
      const path = event.composedPath();
      const isInside = path.some(node => node === menuRef.current);
      
      if (!isInside) {
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
        className="fixed inset-0 z-[2147483646] flex items-end justify-end p-6 pointer-events-none"
    >
      <div 
        className="w-[28vw] h-[45vh] flex flex-col rounded-2xl overflow-hidden pointer-events-auto animate-slide-up-fade backdrop-blur-xl bg-glass-bg border border-glass-border shadow-[0_0_40px_rgba(0,0,0,0.3)]"
      >
        <header className="flex items-center justify-between p-4 border-b border-glass-border bg-white/5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neon-primary animate-pulse"></div>
            <h1 className="text-lg font-bold text-neon-primary tracking-wide drop-shadow-[0_0_10px_rgba(176,251,255,0.5)]">
              CLIPPY AI
            </h1>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full cursor-pointer">
            <CloseIcon className="w-5 h-5" />
          </button>
        </header>
        
        <main className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-neutral-500 space-y-2 opacity-60">
              <SparklesIcon className="w-8 h-8 text-neon-primary/50" />
              <p className="text-sm font-light">How can I help you today?</p>
            </div>
          )}
          {messages.map((msg, index) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up-fade`} style={{ animationDelay: `${index * 0.05}s` }}>
              <div 
                className={`max-w-[85%] p-3.5 rounded-2xl backdrop-blur-md border border-white/5 shadow-lg
                  ${msg.role === 'user' 
                    ? 'bg-gradient-to-br from-violet-600/80 to-fuchsia-600/80 text-white rounded-tr-sm' 
                    : 'bg-white/5 text-neutral-200 rounded-tl-sm'
                  }`}
              >
                {msg.image && (
                  <div className="relative group mb-2 overflow-hidden rounded-lg border border-white/10">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <img src={msg.image} alt="Screenshot" className="max-w-full" />
                  </div>
                )}
                <p className="text-sm leading-relaxed font-light tracking-wide">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start animate-pulse">
              <div className="p-3 rounded-2xl rounded-tl-sm bg-white/5 text-neon-primary flex items-center gap-2 border border-white/5">
                <LoadingSpinner className="w-4 h-4" />
                <span className="text-xs font-mono tracking-wider">PROCESSING...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </main>
        
        <footer className="p-4 border-t border-glass-border bg-black/20 relative">
          {pendingScreenshot && (
            <div className="absolute bottom-full left-4 mb-2 p-2 bg-black/80 backdrop-blur-xl rounded-xl border border-glass-border shadow-2xl flex items-start gap-3 animate-slide-up-fade">
              <img src={pendingScreenshot} alt="Thumbnail" className="h-16 w-auto rounded-lg border border-white/10" />
              <button 
                onClick={() => setPendingScreenshot(null)}
                className="text-neutral-400 hover:text-white hover:bg-white/10 rounded-full p-1 transition-colors cursor-pointer"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>
          )}

          <form onSubmit={handleSend} className="flex items-center gap-3">
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                className={`p-2.5 rounded-xl transition-all duration-300 cursor-pointer ${showAttachMenu ? 'bg-neon-primary/20 text-neon-primary' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}
              >
                <PlusIcon className="w-5 h-5" />
              </button>
              
              {showAttachMenu && (
                <div className="absolute bottom-full left-0 mb-3 w-48 bg-[#0a0a0f]/95 backdrop-blur-xl border border-glass-border rounded-xl shadow-2xl overflow-hidden animate-slide-up-fade z-50">
                  <button
                    type="button"
                    onClick={handleCaptureScreen}
                    className="w-full text-left px-4 py-3 text-sm text-neutral-300 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2 group cursor-pointer"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-secondary group-hover:shadow-[0_0_8px_#d946ef] transition-shadow"></div>
                    Capture Screen
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-primary to-neon-secondary rounded-xl opacity-20 group-focus-within:opacity-50 transition duration-500 blur"></div>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything..."
                className="relative w-full bg-black/40 border border-white/10 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-white/20 placeholder-neutral-500 transition-all font-light"
                disabled={isLoading}
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading || (!input.trim() && !pendingScreenshot)}
              className="p-2.5 rounded-xl bg-gradient-to-r from-neon-primary to-neon-secondary text-black disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_15px_rgba(176,251,255,0.4)] transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer"
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
