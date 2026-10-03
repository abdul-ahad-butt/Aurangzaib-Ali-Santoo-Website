/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#0B0B0E',
        charcoal: '#16161C',
        gold: '#D4AF37',
        amber: '#F59E0B',
        emerald: '#064E3B',
        ivory: '#F4F4F5',
        muted: '#A1A1AA',
      },
      fontFamily: {
        heading: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        md: '12px',
      },
    },
  },
  plugins: [],
}
