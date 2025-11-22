/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        neon: {
          primary: '#b0fbff',
          secondary: '#d946ef',
        },
        glass: {
          bg: 'rgba(10, 10, 15, 0.6)',
          border: 'rgba(255, 255, 255, 0.1)',
        }
      },
      animation: {
        'slide-up-fade': 'slide-up-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'slide-up-fade': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 10px rgba(176, 251, 255, 0.3)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 20px rgba(176, 251, 255, 0.5)' },
        }
      }
    },
  },
  plugins: [],
}
