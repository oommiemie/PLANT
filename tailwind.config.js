/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-3d': 'float-3d 8s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'icon-float-3d': 'icon-float-3d 6s ease-in-out infinite',
        'parallax-bg': 'parallax-bg 20s ease-in-out infinite',
        'parallax-float': 'parallax-float 25s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'float-3d': {
          '0%, 100%': {
            transform: 'translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg)'
          },
          '25%': {
            transform: 'translateY(-10px) translateZ(20px) rotateX(5deg) rotateY(-5deg)'
          },
          '50%': {
            transform: 'translateY(-20px) translateZ(40px) rotateX(-5deg) rotateY(5deg)'
          },
          '75%': {
            transform: 'translateY(-10px) translateZ(20px) rotateX(5deg) rotateY(-5deg)'
          },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        glow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'icon-float-3d': {
          '0%, 100%': {
            transform: 'translateY(0) translateZ(0) rotateZ(0deg)',
            filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.2))',
          },
          '50%': {
            transform: 'translateY(-15px) translateZ(10px) rotateZ(5deg)',
            filter: 'drop-shadow(0 20px 30px rgba(0, 0, 0, 0.3))',
          },
        },
        'parallax-bg': {
          '0%, 100%': {
            transform: 'translateY(0) scale(1)',
          },
          '50%': {
            transform: 'translateY(-20px) scale(1.05)',
          },
        },
        'parallax-float': {
          '0%, 100%': {
            transform: 'translate(0, 0) rotate(0deg)',
          },
          '33%': {
            transform: 'translate(30px, -30px) rotate(5deg)',
          },
          '66%': {
            transform: 'translate(-30px, 30px) rotate(-5deg)',
          },
        },
      },
    },
  },
  plugins: [],
}
