/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
        mono: ['SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'monospace'],
      },
      fontSize: {
        'xs': ['11px', { lineHeight: '1.4' }],
        'sm': ['13px', { lineHeight: '1.45' }],
        'base': ['14px', { lineHeight: '1.45' }],
        'lg': ['15px', { lineHeight: '1.4' }],
      },
      colors: {
        // Linear-style light mode surfaces
        surface: {
          primary: '#FAFAFA',
          secondary: '#FFFFFF',
          tertiary: '#F5F5F5',
          // Linear-style dark mode surfaces
          dark: '#16161A',
          'dark-secondary': '#1C1C21',
          'dark-tertiary': '#27272C',
        },
        // Linear-style text colors (not pure black/white)
        text: {
          primary: '#1A1A1A',
          secondary: '#8A8A8A',
          tertiary: '#565656',
          'dark-primary': '#E6E6E6',
          'dark-secondary': '#8A8A8A',
          'dark-tertiary': '#565656',
        },
        // Linear brand purple accent
        accent: {
          DEFAULT: '#5E6AD2',
          hover: '#4F5ABF',
          subtle: 'rgba(94, 106, 210, 0.08)',
        },
        // Very subtle borders
        border: {
          light: 'rgba(0, 0, 0, 0.05)',
          DEFAULT: 'rgba(0, 0, 0, 0.08)',
          dark: 'rgba(255, 255, 255, 0.05)',
        },
        // Status colors - muted Linear style
        status: {
          success: '#10B981',
          error: '#EF4444',
          warning: '#F59E0B',
          info: '#3B82F6',
        },
      },
      spacing: {
        '4.5': '18px',
        '18': '4.5rem',
      },
      borderRadius: {
        'sm': '4px',
        'md': '6px',
        'lg': '8px',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.04)',
        'md': '0 1px 3px rgba(0, 0, 0, 0.05)',
        'lg': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'inset': 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'modal-in': 'modal-in 0.1s ease-out',
        'fade-in': 'fade-in 0.1s ease-out',
        'pulse-subtle': 'pulse-subtle 1.5s ease-in-out infinite',
      },
      keyframes: {
        'modal-in': {
          '0%': { opacity: '0', transform: 'translateY(2px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      transitionDuration: {
        '100': '100ms',
        '150': '150ms',
      },
    },
  },
  plugins: [],
}
