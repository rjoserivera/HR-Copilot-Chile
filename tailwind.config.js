/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0f4ff',
          100: '#dce6fe',
          200: '#baccfd',
          300: '#8aa9fb',
          400: '#557df6',
          500: '#2d55f0',
          600: '#1e3fe4',
          700: '#1a31c8',
          800: '#1c2da1',
          900: '#1c2b7e',
          950: '#141b4d',
        },
        accent: '#f97316',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
}
