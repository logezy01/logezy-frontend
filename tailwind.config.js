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
          DEFAULT: '#2D3A8C',
          dark: '#1E2660',
          light: '#EEF0FB',
          mid: '#4A5AAD',
        },
        accent: {
          DEFAULT: '#E8472A',
          dark: '#C73A20',
          light: '#FDF0ED',
        },
        dark: '#0F172A',
        slate: '#334155',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        display: ['"Outfit"', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.06)',
        float: '0 8px 24px rgba(0,0,0,0.10)',
        cta: '0 6px 20px rgba(45,58,140,0.35)',
        orange: '0 6px 20px rgba(232,71,42,0.35)',
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
        'bounce-soft': 'bounceSoft 0.6s ease-out',
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
        bounceSoft: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}