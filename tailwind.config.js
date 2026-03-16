/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sora', 'sans-serif'],
        display: ['Clash Display', 'Sora', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#eef5ff',
          100: '#d9e8ff',
          200: '#bcd4ff',
          300: '#8eb6ff',
          400: '#5a8df8',
          500: '#3567f0',
          600: '#2249e6',
          700: '#1a37d1',
          800: '#1c2fa9',
          900: '#1c2d85',
          950: '#141d52',
        },
        slate: {
          850: '#172033',
          950: '#0b1120',
        }
      },
    },
  },
  plugins: [],
}
