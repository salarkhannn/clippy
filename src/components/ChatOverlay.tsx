// FIX: Add chrome types reference to resolve errors where the 'chrome' namespace was not found.
/// <reference types="chrome" />

// components/ChatOverlay.tsx
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, MessageType } from '../types';
import { CloseIcon, SendIcon, SparklesIcon, PlusIcon, CameraIcon, SunIcon, MoonIcon } from './Icons';
import { useTheme } from '../context/ThemeContext';

interface ChatOverlayProps {
  onClose: () => void;
}

const ChatOverlay: React.FC<ChatOverlayProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [pendingScreenshot, setPendingScreenshot] = useState<string | null>(null);
  const { isDarkMode, toggleTheme } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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
        inputRef.current?.focus();
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
    <div className={`fixed inset-0 z-[100] flex items-end justify-end p-6 pointer-events-none ${isDarkMode ? 'dark' : ''}`}>
      <div 
        className={`
          w-[380px] h-[520px] max-h-[80vh] flex flex-col 
          rounded-lg overflow-hidden pointer-events-auto 
          animate-modal-in shadow-lg
          ${isDarkMode 
            ? 'bg-surface-dark border border-border-dark' 
            : 'bg-surface-secondary border border-border-light'
          }
        `}
      >
        {/* Header - minimal Linear style */}
        <header 
          className={`
            flex items-center justify-between px-4 py-3
            ${isDarkMode 
              ? 'border-b border-border-dark' 
              : 'border-b border-border-light'
            }
          `}
        >
          <div className="flex items-center gap-2">
            <SparklesIcon className={`w-4 h-4 ${isDarkMode ? 'text-accent' : 'text-accent'}`} />
            <h1 className={`
              text-sm font-medium tracking-[-0.01em]
              ${isDarkMode ? 'text-text-dark-primary' : 'text-text-primary'}
            `}>
              Clippy
            </h1>
          </div>
          <div className="flex items-center gap-1">
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme} 
              className={`
                p-1.5 rounded-md transition-opacity duration-100
                ${isDarkMode 
                  ? 'text-text-dark-secondary hover:text-text-dark-primary' 
                  : 'text-text-secondary hover:text-text-primary'
                }
                cursor-pointer hover:opacity-80
              `}
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
            </button>
            {/* Close Button */}
            <button 
              onClick={onClose} 
              className={`
                p-1.5 rounded-md transition-opacity duration-100
                ${isDarkMode 
                  ? 'text-text-dark-secondary hover:text-text-dark-primary' 
                  : 'text-text-secondary hover:text-text-primary'
                }
                cursor-pointer hover:opacity-80
              `}
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>
        </header>
        
        {/* Messages - dense Linear style */}
        <main 
          className={`
            flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-styled
            ${isDarkMode ? 'bg-surface-dark' : 'bg-surface-primary'}
          `}
        >
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center space-y-3">
              <SparklesIcon className={`w-5 h-5 ${isDarkMode ? 'text-text-dark-tertiary' : 'text-text-tertiary'}`} />
              <div className="text-center space-y-1">
                <p className={`text-sm font-medium ${isDarkMode ? 'text-text-dark-primary' : 'text-text-primary'}`}>
                  How can I help?
                </p>
                <p className={`text-xs ${isDarkMode ? 'text-text-dark-secondary' : 'text-text-secondary'}`}>
                  Ask a question or capture your screen
                </p>
              </div>
              
              {/* Quick actions - Linear style compact pills */}
              <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                {['Summarize page', 'Explain this', 'Help write'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className={`
                      px-2.5 py-1 text-xs rounded-md transition-all duration-100 cursor-pointer
                      ${isDarkMode 
                        ? 'bg-surface-dark-tertiary text-text-dark-secondary hover:text-text-dark-primary' 
                        : 'bg-surface-tertiary text-text-secondary hover:text-text-primary'
                      }
                    `}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div 
                className={`
                  max-w-[80%] px-3 py-2 rounded-md
                  ${msg.role === 'user' 
                    ? 'bg-accent text-white' 
                    : isDarkMode 
                      ? 'bg-surface-dark-tertiary text-text-dark-primary' 
                      : 'bg-surface-tertiary text-text-primary'
                  }
                `}
              >
                {msg.image && (
                  <div className="mb-2 overflow-hidden rounded">
                    <img 
                      src={msg.image} 
                      alt="Screenshot" 
                      className="max-w-full rounded"
                    />
                  </div>
                )}
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <div className={`
                px-3 py-2 rounded-md
                ${isDarkMode ? 'bg-surface-dark-tertiary' : 'bg-surface-tertiary'}
              `}>
                <div className="flex items-center gap-1">
                  <div className={`w-1 h-1 rounded-full animate-pulse-subtle ${isDarkMode ? 'bg-text-dark-secondary' : 'bg-text-secondary'}`} style={{ animationDelay: '0ms' }}></div>
                  <div className={`w-1 h-1 rounded-full animate-pulse-subtle ${isDarkMode ? 'bg-text-dark-secondary' : 'bg-text-secondary'}`} style={{ animationDelay: '150ms' }}></div>
                  <div className={`w-1 h-1 rounded-full animate-pulse-subtle ${isDarkMode ? 'bg-text-dark-secondary' : 'bg-text-secondary'}`} style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </main>
        
        {/* Footer / Input - Linear minimal style */}
        <footer 
          className={`
            p-3 
            ${isDarkMode 
              ? 'border-t border-border-dark bg-surface-dark-secondary' 
              : 'border-t border-border-light bg-surface-secondary'
            }
          `}
        >
          {/* Screenshot Preview */}
          {pendingScreenshot && (
            <div className={`
              mb-2 p-2 rounded-md flex items-start gap-2 animate-fade-in
              ${isDarkMode ? 'bg-surface-dark-tertiary' : 'bg-surface-tertiary'}
            `}>
              <img 
                src={pendingScreenshot} 
                alt="Screenshot preview" 
                className="h-12 w-auto rounded object-cover"
              />
              <button 
                onClick={() => setPendingScreenshot(null)}
                className={`
                  p-0.5 rounded transition-opacity duration-100 cursor-pointer
                  ${isDarkMode ? 'text-text-dark-secondary hover:text-text-dark-primary' : 'text-text-secondary hover:text-text-primary'}
                `}
              >
                <CloseIcon className="w-3 h-3" />
              </button>
            </div>
          )}

          <form onSubmit={handleSend} className="flex items-center gap-2">
            {/* Attach Button */}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                className={`
                  p-2 rounded-md transition-all duration-100 cursor-pointer
                  ${showAttachMenu 
                    ? 'bg-accent-subtle text-accent' 
                    : isDarkMode 
                      ? 'text-text-dark-secondary hover:text-text-dark-primary hover:bg-surface-dark-tertiary' 
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-tertiary'
                  }
                `}
              >
                <PlusIcon className="w-4 h-4" />
              </button>
              
              {/* Attach Menu - Linear dropdown style */}
              {showAttachMenu && (
                <div className={`
                  absolute bottom-full left-0 mb-1 w-40 overflow-hidden 
                  rounded-md shadow-md
                  ${isDarkMode 
                    ? 'bg-surface-dark-secondary border border-border-dark' 
                    : 'bg-surface-secondary border border-border-light'
                  }
                `}>
                  <button
                    type="button"
                    onClick={handleCaptureScreen}
                    className={`
                      w-full text-left px-3 py-2 text-sm transition-colors duration-100 
                      flex items-center gap-2 cursor-pointer
                      ${isDarkMode 
                        ? 'text-text-dark-secondary hover:text-text-dark-primary hover:bg-surface-dark-tertiary' 
                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-tertiary'
                      }
                    `}
                  >
                    <CameraIcon className="w-4 h-4" />
                    Capture screen
                  </button>
                </div>
              )}
            </div>

            {/* Input Field - Linear minimal style */}
            <div className="flex-1">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything..."
                className={`
                  w-full px-3 py-2 rounded-md text-sm
                  transition-colors duration-100
                  focus:outline-none
                  ${isDarkMode 
                    ? 'bg-surface-dark-tertiary border border-border-dark text-text-dark-primary placeholder-text-dark-secondary focus:border-accent' 
                    : 'bg-surface-tertiary border border-border-light text-text-primary placeholder-text-secondary focus:border-accent'
                  }
                `}
                disabled={isLoading}
              />
            </div>
            
            {/* Send Button - Linear compact style */}
            <button
              type="submit"
              disabled={isLoading || (!input.trim() && !pendingScreenshot)}
              className={`
                px-3 py-2 rounded-md bg-accent text-white text-sm font-medium
                disabled:opacity-40 disabled:cursor-not-allowed
                hover:bg-accent-hover active:shadow-inset
                transition-all duration-100 cursor-pointer
              `}
            >
              <SendIcon className="w-4 h-4" />
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
};

export default ChatOverlay;
