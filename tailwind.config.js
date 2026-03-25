/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1a2744',
          light: '#243460',
          dark: '#111b30',
        },
        gold: {
          DEFAULT: '#f59e0b',
          light: '#fcd34d',
          dark: '#b45309',
        },
        primary: {
          DEFAULT: '#1a56db',
          dark: '#1e429f',
          light: '#e8f0fe',
        },
        accent: {
          DEFAULT: '#f59e0b',
          dark: '#b45309',
        },
        construction: '#374151',
      },
      fontFamily: {
        sans: ['"Noto Sans JP"', 'sans-serif'],
        display: ['Oswald', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
