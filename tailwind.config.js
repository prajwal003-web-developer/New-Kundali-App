/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-mukta)', 'system-ui', 'sans-serif'],
        display: ['var(--font-yatra)', 'serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      colors: {
        saffron: {
          50: '#fff8f0',
          100: '#ffefd6',
          200: '#ffd9a8',
          300: '#ffbc6e',
          400: '#ff9533',
          500: '#ff7a0a',
          600: '#f06000',
          700: '#c74a00',
          800: '#9e3c06',
          900: '#7f330a',
          950: '#451700',
        },
        vermillion: {
          500: '#e63946',
          600: '#c1121f',
          700: '#9d0208',
        },
        gold: {
          400: '#f4d03f',
          500: '#d4ac0d',
          600: '#b7950b',
        },
        cosmic: {
          900: '#0a0514',
          800: '#12082a',
          700: '#1a0d3d',
          600: '#240e52',
          500: '#3b0f6f',
        }
      },
      backgroundImage: {
        'cosmic-gradient': 'radial-gradient(ellipse at top, #1a0d3d 0%, #0a0514 70%)',
        'saffron-glow': 'radial-gradient(ellipse, rgba(255,122,10,0.15) 0%, transparent 70%)',
        'chart-grid': 'linear-gradient(rgba(212,172,13,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,172,13,0.1) 1px, transparent 1px)',
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255,122,10,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(255,122,10,0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'glow-saffron': '0 0 30px rgba(255,122,10,0.4)',
        'glow-gold': '0 0 20px rgba(212,172,13,0.3)',
        'inner-cosmic': 'inset 0 2px 20px rgba(59,15,111,0.5)',
      },
    },
  },
  plugins: [],
}
