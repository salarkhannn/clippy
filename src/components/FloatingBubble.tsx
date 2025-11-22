
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
        className="fixed bottom-5 right-5 z-[2147483647] w-full max-w-sm p-4 rounded-xl shadow-2xl text-neutral-200 border animate-fade-in-up"
        style={{
            backgroundColor: THEME.bubbleBgColor,
            borderColor: THEME.borderColor
        }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {status === 'loading' && <LoadingSpinner className="w-5 h-5 text-violet-400" />}
          {status !== 'loading' && <SparklesIcon className="w-5 h-5 text-violet-400" />}
          <h3 className="font-semibold text-violet-400">Screen Analysis</h3>
        </div>
        <button onClick={onClose} className="text-neutral-400 hover:text-white transition-colors">
          <CloseIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="mt-3 text-sm text-neutral-300 pr-4 whitespace-pre-wrap">
        {status === 'loading' ? 'Analyzing your screen...' : text}
      </div>
    </div>
  );
};

export default FloatingBubble;
