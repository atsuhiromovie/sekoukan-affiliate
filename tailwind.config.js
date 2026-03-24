/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a56db',  // 施工管理らしい信頼感のあるブルー
          dark: '#1e429f',
          light: '#e8f0fe',
        },
        accent: {
          DEFAULT: '#f59e0b',  // CTAボタン・バッジ用アンバー
          dark: '#b45309',
        },
        construction: '#374151',  // テキスト基調
      },
      fontFamily: {
        sans: ['"Noto Sans JP"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
