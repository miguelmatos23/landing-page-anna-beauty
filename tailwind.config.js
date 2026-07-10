/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      colors: {
        lux: {
          dark: '#1A1715',
          darker: '#0A0908',
          light: '#F9F8F6',
          beige: '#ECE5DD',
          accent: '#C4A484',
          gray: '#8C857D',
          gold: '#D4AF37',
          goldLight: '#F3E5AB'
        }
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-particle': 'floatParticle 12s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          from: { backgroundPosition: '200% 0' },
          to: { backgroundPosition: '-200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        floatParticle: {
          '0%, 100%': { transform: 'translateY(0) translateX(0) scale(1)', opacity: 0.1 },
          '50%': { transform: 'translateY(-120px) translateX(30px) scale(1.4)', opacity: 0.7 },
        }
      }
    },
  },
  plugins: [],
}
