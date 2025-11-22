
// components/FloatingBubble.tsx
import React from 'react';
import { CloseIcon, LoadingSpinner, SparklesIcon } from './Icons';
import { THEME } from '../constants';

interface FloatingBubbleProps {
  status: 'loading' | 'success' | 'error';
  text: string;
  onClose: () => void;
}

const FloatingBubble: React.FC<FloatingBubbleProps> = ({ status, text, onClose }) => {
  return (
    <div 
        className="fixed bottom-6 right-6 z-[2147483647] w-full max-w-sm p-5 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] text-white border border-glass-border animate-slide-up-fade backdrop-blur-xl bg-glass-bg overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-neon-primary/10 to-neon-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative flex items-start justify-between z-10">
        <div className="flex items-center gap-3">
          {status === 'loading' && (
            <div className="relative">
              <div className="absolute inset-0 bg-neon-primary blur-md opacity-50 animate-pulse"></div>
              <LoadingSpinner className="w-5 h-5 text-neon-primary relative z-10" />
            </div>
          )}
          {status !== 'loading' && (
            <div className="relative">
              <div className="absolute inset-0 bg-neon-secondary blur-md opacity-50 animate-pulse"></div>
              <SparklesIcon className="w-5 h-5 text-neon-secondary relative z-10" />
            </div>
          )}
          <h3 className="font-bold text-neon-primary tracking-wide drop-shadow-[0_0_8px_rgba(176,251,255,0.4)]">
            Screen Analysis
          </h3>
        </div>
        <button onClick={onClose} className="text-neutral-400 hover:text-white transition-colors hover:bg-white/10 rounded-full p-1 cursor-pointer">
          <CloseIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="relative z-10 mt-3 text-sm text-neutral-200 pr-2 whitespace-pre-wrap font-light leading-relaxed">
        {status === 'loading' ? (
          <span className="animate-pulse text-neon-primary/80 font-mono text-xs tracking-widest">ANALYZING PIXELS...</span>
        ) : (
          text
        )}
      </div>
    </div>
  );
};

export default FloatingBubble;
