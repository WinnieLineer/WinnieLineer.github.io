/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'sheen': 'sheen 1s ease-in-out infinite',
      },
      keyframes: {
        sheen: {
          '0%': { transform: 'translateX(-150%) skewX(-12deg)' },
          '100%': { transform: 'translateX(150%) skewX(-12deg)' },
        }
      }
    },
  },
  // Enable the typography plugin
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
