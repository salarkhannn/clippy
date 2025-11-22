import React from 'react';
import { THEME } from '../constants';

interface MCQResultProps {
  status: 'loading' | 'success' | 'error';
  text?: string;
  onClose: () => void;
}

const MCQResult: React.FC<MCQResultProps> = ({ status, text, onClose }) => {
  return (
    <div
      className="fixed bottom-5 right-5 z-[10000] flex items-center gap-4 p-4 rounded-2xl bg-glass-bg backdrop-blur-xl border border-glass-border shadow-[0_0_30px_rgba(0,0,0,0.5)] animate-slide-up-fade text-white min-w-[120px] justify-center group overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-neon-primary/5 to-neon-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {status === 'loading' ? (
        <div className="relative">
           <div className="absolute inset-0 bg-neon-primary blur-md opacity-50 animate-pulse"></div>
           <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-neon-primary relative z-10"></div>
        </div>
      ) : (
        <div className="text-2xl font-bold font-mono text-neon-primary relative z-10 tracking-wider drop-shadow-[0_0_10px_rgba(176,251,255,0.3)]">
          {text}
        </div>
      )}
      
      <button
        onClick={onClose}
        className="relative z-10 text-neutral-400 hover:text-white transition-colors hover:bg-white/10 rounded-full p-1 ml-2 cursor-pointer"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  );
};

export default MCQResult;
