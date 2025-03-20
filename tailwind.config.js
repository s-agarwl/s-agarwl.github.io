import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        blink: 'blink 1s step-end infinite',
        dot1: 'dot1 1.4s infinite 0s',
        dot2: 'dot2 1.4s infinite 0.2s',
        dot3: 'dot3 1.4s infinite 0.4s',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
        dot1: {
          '0%': { transform: 'scale(0.8)', opacity: 0.5 },
          '25%': { transform: 'scale(1)', opacity: 1 },
          '50%': { transform: 'scale(0.8)', opacity: 0.5 },
          '75%': { transform: 'scale(0.6)', opacity: 0.2 },
          '100%': { transform: 'scale(0.8)', opacity: 0.5 },
        },
        dot2: {
          '0%': { transform: 'scale(0.8)', opacity: 0.5 },
          '25%': { transform: 'scale(1)', opacity: 1 },
          '50%': { transform: 'scale(0.8)', opacity: 0.5 },
          '75%': { transform: 'scale(0.6)', opacity: 0.2 },
          '100%': { transform: 'scale(0.8)', opacity: 0.5 },
        },
        dot3: {
          '0%': { transform: 'scale(0.8)', opacity: 0.5 },
          '25%': { transform: 'scale(1)', opacity: 1 },
          '50%': { transform: 'scale(0.8)', opacity: 0.5 },
          '75%': { transform: 'scale(0.6)', opacity: 0.2 },
          '100%': { transform: 'scale(0.8)', opacity: 0.5 },
        },
      },
    },
  },
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  plugins: [typography],
};
