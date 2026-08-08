/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        copper: {
          DEFAULT: '#c97b3a',
          light: '#e0a169',
          dark: '#a05f28',
        },
        forest: {
          DEFAULT: '#234d42',
          dark: '#17332c',
          darker: '#0f241f',
          light: '#2f6859',
        },
        sand: {
          DEFAULT: '#e8dcc8',
          light: '#f5efe3',
          dark: '#cbb79a',
        },
        cream: '#faf7f0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        soft: '0 20px 60px -20px rgba(20, 40, 35, 0.35)',
        card: '0 10px 40px -12px rgba(20, 40, 35, 0.25)',
        glow: '0 10px 40px -8px rgba(201, 123, 58, 0.5)',
      },
      backgroundImage: {
        'copper-gradient': 'linear-gradient(135deg, #e0a169 0%, #c97b3a 50%, #a05f28 100%)',
      },
    },
  },
  plugins: [],
};
