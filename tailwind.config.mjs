/** @type {import('tailwindcss').Config} */
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        paper: token('paper'),
        ink: token('ink'),
        mut: token('mut'),
        rule: token('rule'),
        tint: token('tint'),
        accent: token('accent'),
        'on-accent': token('on-accent'),
        now: token('now'),
      },
      fontFamily: {
        sans: ['"Readex Pro"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
