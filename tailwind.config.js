/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./data/**/*.{js,ts,jsx,tsx}",
    "./App.tsx"
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          DEFAULT: '#F79800',
          50: '#fffbf0',
          100: '#ffefcc',
          200: '#ffdf99',
          300: '#ffcf66',
          400: '#ffbf33',
          500: '#ffaf00',
          600: '#faa61a',
          700: '#F79800',
          800: '#C83900',
          900: '#9e6800',
          950: '#5c3d00',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
