import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'vert-pastel':  '#add3a0',
        'rose-pastel':  '#e4a189',
        'rose-saumon':  '#f0806b',
        'blanc-casse':  '#f5f2ef',
        'texte':        '#3a3330',
      },
      fontFamily: {
        heading: ['"Champagne & Limousines"', 'Georgia', 'serif'],
        body:    ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
