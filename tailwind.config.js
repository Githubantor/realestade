/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'serif'],
        display: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        gold: {
          50: '#fdf9ec',
          100: '#fbf0c8',
          200: '#f6e094',
          300: '#edd06a',
          400: '#e3b63a',
          500: '#c9981a',
          600: '#a67a14',
          700: '#7a5a12',
          800: '#3d2e0a',
        },
        ink: '#0a0a0a',
        stone2: '#1a1a1a',
      },
      letterSpacing: {
        luxe: '0.3em',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      },
      animation: {
        marquee: 'marquee 22s linear infinite',
        shimmer: 'shimmer 2s infinite',
        float: 'float 4s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
