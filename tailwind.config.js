/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        catppuccin: {
          base: '#1e1e2e',
          text: '#cdd6f4',
          lavender: '#b4befe',
          blue: '#89b4fa',
          sapphire: '#74c7ec',
          sky: '#89dceb',
          teal: '#94e2d5',
          green: '#a6e3a1',
          yellow: '#f9e2af',
          peach: '#fab387',
          maroon: '#eba0ac',
          red: '#f38ba8',
          mauve: '#cba6f7',
          pink: '#f5c2e7',
          surface0: '#313244',
          surface1: '#45475a',
          surface2: '#585b70',
          overlay0: 'rgba(49, 50, 68, 0.8)',
          overlay1: 'rgba(49, 50, 68, 0.95)',
        },
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        scale: {
          '0%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out',
        float: 'float 3s ease-in-out infinite',
        slideIn: 'slideIn 0.3s ease-out',
        slideUp: 'slideUp 0.3s ease-out',
        pulse: 'pulse 2s ease-in-out infinite',
        scale: 'scale 0.2s ease-out'
      },
    },
  },
  plugins: [],
}
