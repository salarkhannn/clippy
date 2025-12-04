// components/FloatingActionButton.tsx
import React from 'react';
import { SparklesIcon } from './Icons';
import { useTheme } from '../context/ThemeContext';

interface FloatingActionButtonProps {
  onClick: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick }) => {
  const { isDarkMode } = useTheme();

  return (
    <button
      onClick={onClick}
      className={`
        fixed bottom-6 right-6 z-[100]
        w-10 h-10 rounded-lg
        flex items-center justify-center
        shadow-md cursor-pointer
        transition-all duration-100
        ${isDarkMode 
          ? 'bg-surface-dark-secondary border border-border-dark hover:bg-surface-dark-tertiary' 
          : 'bg-surface-secondary border border-border-light hover:bg-surface-tertiary'
        }
        active:shadow-inset
      `}
      style={{ outline: 'none' }}
      aria-label="Open Clippy Assistant"
    >
      <SparklesIcon className="w-4 h-4 text-accent" />
    </button>
  );
};

export default FloatingActionButton;
