import React from 'react';
import { CloseIcon, CheckIcon, AlertIcon } from './Icons';
import { useTheme } from '../context/ThemeContext';

interface MCQResultProps {
  status: 'loading' | 'success' | 'error';
  text?: string;
  onClose: () => void;
}

const MCQResult: React.FC<MCQResultProps> = ({ status, text, onClose }) => {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`
        fixed bottom-6 right-6 z-[50] 
        flex items-center gap-3 px-4 py-3 
        rounded-lg shadow-md animate-modal-in
        ${isDarkMode 
          ? 'bg-surface-dark-secondary border border-border-dark' 
          : 'bg-surface-secondary border border-border-light'
        }
      `}
    >
      {status === 'loading' ? (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className={`w-1 h-1 rounded-full animate-pulse-subtle ${isDarkMode ? 'bg-text-dark-secondary' : 'bg-text-tertiary'}`} style={{ animationDelay: '0ms' }}></div>
            <div className={`w-1 h-1 rounded-full animate-pulse-subtle ${isDarkMode ? 'bg-text-dark-secondary' : 'bg-text-tertiary'}`} style={{ animationDelay: '150ms' }}></div>
            <div className={`w-1 h-1 rounded-full animate-pulse-subtle ${isDarkMode ? 'bg-text-dark-secondary' : 'bg-text-tertiary'}`} style={{ animationDelay: '300ms' }}></div>
          </div>
          <span className={`text-xs ${isDarkMode ? 'text-text-dark-secondary' : 'text-text-tertiary'}`}>
            Analyzing...
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {status === 'success' ? (
            <CheckIcon className="w-4 h-4 text-status-success" />
          ) : (
            <AlertIcon className="w-4 h-4 text-status-error" />
          )}
          <span className={`
            text-xs font-medium
            ${status === 'success' 
              ? 'text-status-success' 
              : status === 'error'
                ? 'text-status-error'
                : isDarkMode ? 'text-text-dark-primary' : 'text-text-primary'
            }
          `}>
            {text}
          </span>
        </div>
      )}
      
      <button
        onClick={onClose}
        className={`
          p-1 rounded-md transition-opacity duration-100 cursor-pointer ml-1
          ${isDarkMode 
            ? 'text-text-dark-secondary hover:text-text-dark-primary' 
            : 'text-text-secondary hover:text-text-primary'
          }
        `}
      >
        <CloseIcon className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default MCQResult;
