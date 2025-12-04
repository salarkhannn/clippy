
// components/FloatingBubble.tsx
import React from 'react';
import { CloseIcon, SparklesIcon } from './Icons';
import { useTheme } from '../context/ThemeContext';

interface FloatingBubbleProps {
  status: 'loading' | 'success' | 'error';
  text: string;
  onClose: () => void;
}

const FloatingBubble: React.FC<FloatingBubbleProps> = ({ status, text, onClose }) => {
  const { isDarkMode } = useTheme();

  return (
    <div 
      className={`
        fixed bottom-6 right-6 z-[100] 
        w-full max-w-sm p-4 
        rounded-lg shadow-lg animate-modal-in
        ${isDarkMode 
          ? 'bg-surface-dark-secondary border border-border-dark' 
          : 'bg-surface-secondary border border-border-light'
        }
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {status === 'loading' ? (
            <div className="flex items-center gap-0.5">
              <div className="w-1 h-1 rounded-full bg-accent animate-pulse-subtle" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1 h-1 rounded-full bg-accent animate-pulse-subtle" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1 h-1 rounded-full bg-accent animate-pulse-subtle" style={{ animationDelay: '300ms' }}></div>
            </div>
          ) : (
            <SparklesIcon className="w-4 h-4 text-accent" />
          )}
          <h3 className={`
            text-sm font-medium tracking-[-0.01em]
            ${isDarkMode ? 'text-text-dark-primary' : 'text-text-primary'}
          `}>
            Screen Analysis
          </h3>
        </div>
        <button 
          onClick={onClose} 
          className={`
            p-1 rounded-md transition-opacity duration-100 cursor-pointer
            ${isDarkMode 
              ? 'text-text-dark-secondary hover:text-text-dark-primary' 
              : 'text-text-secondary hover:text-text-primary'
            }
          `}
        >
          <CloseIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className={`
        mt-3 text-sm leading-relaxed whitespace-pre-wrap
        ${isDarkMode ? 'text-text-dark-secondary' : 'text-text-secondary'}
      `}>
        {status === 'loading' ? (
          <span className={isDarkMode ? 'text-text-dark-tertiary' : 'text-text-tertiary'}>
            Analyzing content...
          </span>
        ) : (
          text
        )}
      </div>
    </div>
  );
};

export default FloatingBubble;
