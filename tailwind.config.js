/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FBF7F0',
        cream2: '#F5EFE4',
        ink: '#1F1A16',
        ink2: '#5C504A',
        ink3: '#897C72',
        line: '#E5DBCC',
        line2: '#EFE6D8',
        accent: '#B14A2E',
        accent2: '#8E3B25',
        warn: '#A87814',
        ok: '#4F6B45',
      },
      fontFamily: {
        display: ['Fraunces', 'Charter', 'Georgia', 'serif'],
        sans: ['-apple-system', 'SF Pro Text', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
