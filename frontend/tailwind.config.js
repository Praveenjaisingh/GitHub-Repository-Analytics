/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      screens: {
        xs: '420px',
      },
      colors: {
        ink: {
          950: '#0B0E13',
          900: '#12161D',
          800: '#1B2029',
          700: '#262D39',
          600: '#333C4A',
        },
        amber: {
          400: '#F2A65A',
          500: '#E88F3C',
          600: '#C96F24',
        },
        mist: {
          100: '#F5F6F8',
          300: '#B7BEC9',
          500: '#7C8697',
        },
        moss: '#6FCF97',
        rose: '#E8697A',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'grid-lines':
          'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '28px 28px',
      },
    },
  },
  plugins: [],
};
