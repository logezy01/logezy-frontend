/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
        colors: {
        primary: {
          DEFAULT: '#3A7D44',
          dark: '#2D6235',
          darker: '#1A3A2A',   // nouveau — vert profond pour dégradés/textes forts
          light: '#EBF5ED',
          mid: '#4CAF50',
          soft: '#4ade80',     // nouveau — vert clair, accents/shimmer
        },
        dark: {
          bg: '#0F0F0F',
          card: '#1A1A1A',
          border: '#2A2A2A',
          text: '#F1F5F9',
        },
        paper: '#FAFAF9',      // nouveau — blanc cassé, remplace le blanc pur en fond
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        display: ['"Outfit"', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.06)',
        float: '0 8px 24px rgba(0,0,0,0.12)',
        cta: '0 6px 20px rgba(58,125,68,0.35)',
        'soft-sm': '0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)',
        'soft-lg': '0 24px 48px -12px rgba(15,23,42,0.18), 0 8px 16px -8px rgba(15,23,42,0.08)',
        'glow-brand': '0 0 0 4px rgba(74,222,128,0.12), 0 20px 60px rgba(58,125,68,0.15)',
      },
      borderRadius: {
        btn: '10px',
        card: '16px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}