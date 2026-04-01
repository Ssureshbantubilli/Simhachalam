/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        kumkum: {
          50: '#fdf2f2',
          100: '#fce7e7',
          500: '#9b2226',
          700: '#7A1C1C',
          900: '#4a0e0e',
        },
        gold: {
          50: '#fdf9e7',
          200: '#f5e6a3',
          400: '#D4AF37',
          600: '#a88c2a',
          800: '#6b5a1b',
        },
        sandal: {
          50: '#fdf8f0',
          200: '#F5E6C8',
          400: '#e8c98a',
          600: '#c4943d',
        },
        divine: {
          dark: '#0F0F0F',
          mid: '#1a1a1a',
          card: '#1e1a16',
        }
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
        devanagari: ['Noto Serif Devanagari', 'serif'],
        telugu: ['Noto Serif Telugu', 'serif'],
      },
      animation: {
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(212, 175, 55, 0.7)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
