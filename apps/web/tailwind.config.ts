import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        arabic: ['var(--font-ibm-arabic)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
