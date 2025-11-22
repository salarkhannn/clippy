// FIX: Add chrome types reference to resolve errors where the 'chrome' namespace was not found.
/// <reference types="chrome" />

// components/ChatOverlay.tsx
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, MessageType } from '../types';
import { CloseIcon, SendIcon, LoadingSpinner, SparklesIcon } from './Icons';
import { THEME } from '../constants';

interface ChatOverlayProps {
  onClose: () => void;
}

const ChatOverlay: React.FC<ChatOverlayProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);
  
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
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
        className="fixed inset-0 z-[2147483646] flex items-center justify-center p-4"
        style={{
            backgroundColor: THEME.overlayBgColor,
            backdropFilter: `blur(${THEME.overlayBackdropBlur})`
        }}
    >
      <div 
        className="w-full max-w-2xl h-[80vh] flex flex-col rounded-2xl shadow-2xl border overflow-hidden"
        style={{
            backgroundColor: THEME.chatWindowBgColor,
            borderColor: THEME.borderColor
        }}
      >
        <header className="flex items-center justify-between p-4 border-b" style={{ borderColor: THEME.borderColor }}>
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-6 h-6 text-violet-400" />
            <h1 className="text-lg font-bold text-neutral-100">Gemini Assistant</h1>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white transition-colors">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>
        
        <main className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-lg ${msg.role === 'user' ? 'bg-violet-600 text-white' : 'bg-neutral-700 text-neutral-200'}`}>
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
        
        <footer className="p-4 border-t" style={{ borderColor: THEME.borderColor }}>
          <form onSubmit={handleSend} className="flex items-center gap-2">
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
              disabled={isLoading || !input.trim()}
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
