/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Roboto', 'sans-serif'],
      },
      colors: {
        'mdo-cool-gray': {
          10: '#F2F4F8',
          20: '#E6E8ED',
          30: '#D9DCE2',
          40: '#CCCFD7',
          50: '#BFC3CC',
          60: '#B2B6C1',
          70: '#A5AAB6',
          80: '#989DAB',
          90: '#8C91A0',
          100: '#7F8495',
        },
        'mdo-gray': {
          10: '#F4F4F4',
          20: '#E0E0E0',
          30: '#C6C6C6',
          40: '#A8A8A8',
          50: '#8D8D8D',
          60: '#6F6F6F',
          70: '#525252',
          80: '#393939',
          90: '#262626',
          100: '#161616',
        },
        'mdo-primary': '#237CB3',
        'mdo-error': '#DA1E28',
        'mdo-success': '#44B690',
        'toast': {
          'successBg': '#F3F9FF',
          'successBorder': '#0F62FE',
          'errorBg': '#FFF1F1',
          'errorBorder': '#DA1E28',
          'infoBg': '#F0F8FF',
          'infoBorder': '#0F62FE',
          'warningBg': '#FFF8E1',
          'warningBorder': '#FF8F00',
          'darkBg': '#262626',
          'errorLeftBorder': '#DA1E28',
          'warningLeftBorder': '#FF8F00',
          'infoLeftBorder': '#0F62FE',
          'successLeftBorder': '#44B690',
        }
      }
    },
  },
  plugins: [],
} 