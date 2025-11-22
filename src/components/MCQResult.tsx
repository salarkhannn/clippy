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
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 10000,
        backgroundColor: 'rgba(30, 30, 30, 0.9)',
        color: THEME.textColor,
        padding: '16px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
        backdropFilter: `blur(${THEME.overlayBackdropBlur})`,
        border: `1px solid ${THEME.borderColor}`,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minWidth: '100px',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
      }}
    >
      {status === 'loading' ? (
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
      ) : (
        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
          {text}
        </div>
      )}
      
      <button
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'rgba(255, 255, 255, 0.6)',
          cursor: 'pointer',
          marginLeft: '8px',
          fontSize: '16px',
        }}
      >
        ✕
      </button>
    </div>
  );
};

export default MCQResult;
